/**
* 自动根据dir、cfg参数生成 wiafile.yml 文件映射

* 一、编译
 *
 * 1. 扫描项目所有文件，保存文件hash到building字段，等待编译
 * 2. 比较build 和 building的hash值，更新文件放入update字段
 * 3. 对更新的js、less按文件进行独立编译（js可使用rspack或webpack）
 * 4. 根据编译后文件，生成应用index.js、页面打包文件及未包含到共用wia中的wia包
 * 5. 编译完成，building 替换 build，避免重复编译
 *
 * 二、发布
 *
 * 1. 编译完成后，发布文件hash存入pubing字段
 * 2. 比较 pub 和 pubing的hash值，更新文件放入 update字段
 * 3. 更新文件发布到cos服务器，发布成功 标记为 1
 * 4. 发布完成后，自动刷新CDN，刷新成功 标记为 2
 * 5. 发布完毕，所有update文件全部为2，删除update字段，pubing 替换pub，避免重复发布

 * 比如，增量编译less为css：
    const rs = await wiafile.build(dir, wiacfg)
    if (rs && rs.update && rs.update.less) {
      buildCss(rs.update.less, () => {
        wiafile.builded(dir, true)
        cb && cb()
      })
    } else {
      wiafile.builded(dir, true)
      console.log('less: no change.')
      cb && cb()
    }
 *
 */
import path from 'node:path'
import crypto from 'node:crypto'
import fs from 'fs-extra'
import ld from 'lodash'
import * as util from 'utility'
import yaml from 'js-yaml'

/** @enum {number} */
const MakeType = {
  build: 0, // src 编译到 dist
  builded: 1,
  pack: 2, // dist 打包到 pack
  packed: 3,
  del: 4,
  pub: 5, // pack 发布到 wia store
  pubed: 6,
}

/** @typedef {object} MakeOpts
 * @prop {string[]} [file] - 发布文件或路径
 * @prop {string[]} [exclude] - 排除路径或文件
 * @prop {boolean} [clear = false] - 忽略wiafile.yml，重新全部生成
 * @prop {string} [ext] - 限定文件类型
 */

/** @typedef {object} MakeOpt
 * @prop {string[]} file - 发布文件或路径
 * @prop {string[]} [files] - 发布文件
 * @prop {string[]} [dirs] - 发布路径
 * @prop {string[]} exclude - 排除路径或文件
 * @prop {string[]} [xfiles] - 排除文件
 * @prop {string[]} [xdirs] - 排除路径
 * @prop {boolean} clear - 忽略wiafile.yml，重新全部生成
 * @prop {string} [src] - 处理代码路径 src/dist/pub
 * @prop {string} [ext] - 限定文件类型
 */

const makeDef = {
  file: ['index.*', 'page', 'img'], // 打包的入口，文件或路径
  // @ts-ignore
  files: [],
  // @ts-ignore
  dirs: [],
  exclude: ['*.ts', '*.json'], // 排除
  // @ts-ignore
  xfiles: [],
  // @ts-ignore
  xdirs: [],
  clear: false,
}

/**
 * 获取wia文件，保存到 wiafile.yml 文件，比较文件hash，将更新的文件放入 update
 * 便于增量（更新的文件）编译或发布
 * @param {string} dir 文件map路径
 * @param {MakeType} type build or pub，build 时，读取src，pub时，读取 dist
 * @param {MakeOpts} [opts]
 */
async function make(dir, type = MakeType.build, opts = {}) {
  let R = {}
  try {
    /** @type {MakeOpt} */
    const opt = {...makeDef, ...opts}
    const {clear} = opt

    if (opt.file) {
      opt.files = opt.file.filter(v => v.includes('.'))
      opt.dirs = opt.file.filter(v => !v.includes('.'))
    }

    if (opt.exclude) {
      opt.xfiles = opt.exclude.filter(v => v.includes('.'))
      opt.xdirs = opt.exclude.filter(v => !v.includes('.'))
    }

    dir = dir || process.cwd() // 默认指向运行目录

    let src
    if (type === MakeType.build) src = path.join(dir, './src')
    else if (type === MakeType.pack) src = path.join(dir, './dist')
    else if (type === MakeType.pub) {
      src = path.join(dir, './pub')
      opt.ext = 'zip' // 只发布 zip 文件
    }

    opt.src = src
    // require(path.join(dir, './wiaconfig.js')); // eslint-disable-line

    // const rs = await getFiles(dir, ver); // 获得该项目所有文件，变化的文件放入f.R 中
    // 获取上次自动上传文件清单
    let rs = {}
    /** @type {*} */
    let r = {}
    const f = path.resolve(dir, './wiafile.yml')
    // 读取现有 wiafile.yml
    try {
      if (!clear && fs.existsSync(f)) r = yaml.load(fs.readFileSync(f, 'utf8'))
    } catch {
      r = {}
    }

    // if (checkVer(r, ver))
    //   rs = {};
    // 正在编译、发布的，直接返回正在编译、发布文件，不重新扫描
    // 调用者需决定，是重新编译还是等待，发起编译、发布者，需处理编译完成或失败。
    let skip = false
    if (type === MakeType.build && r?.local?.building) {
      R = {building: r.local.building, update: r.local.update}
      skip = true // 正在编译，跳过
    } else if (type === MakeType.pack && r?.release?.packing) {
      R = {packing: r.release.packing, update: r.release.update}
      skip = true
    } else if (type === MakeType.pub && r?.wia?.pubing) {
      R = {pubing: r.wia.pubing, update: r.wia.update}
      skip = true
    }

    // 重新扫描文件，去掉之前的 update
    if (!skip) {
      if (type === MakeType.build) {
        if (r.local) {
          delete r.local.update
          rs = r.local
        }
      } else if (type === MakeType.pack) {
        if (r.release) {
          delete r.release.update
          rs = r.release
        }
      } else if (type === MakeType.pub) {
        if (r.wia) {
          delete r.wia.update
          rs = r.wia
        }
      }

      // 获取目标项目目录、子目录下的文件MD5对象
      await getFile(src, rs, type, opt)
      // console.log('wiafile make getFile', {dir, rs, act});

      if (!ld.isEmpty(rs)) {
        R = rs // .update || {};
        if (type === MakeType.build) rs = {local: rs, release: r?.release ?? {}, wia: r?.wia ?? {}}
        else if (type === MakeType.pack)
          rs = {release: rs, local: r?.local ?? {}, wia: r?.wia ?? {}}
        else if (type === MakeType.pub)
          rs = {wia: rs, release: r?.release ?? {}, local: r?.local ?? {}}
        // console.log('wiafile', {dir, rs, act});
        save(rs, f)
      }
    }
  } catch (ex) {
    console.log(`make exp:${ex.message}`)
  }

  return R
}

/**
 * 对指定文件夹下的子文件夹和文件进行递归，生成带MD5的hash值列表对象
 * 对于子目录文件， 生成嵌套对象， 如
 * 通过比较当前项目文件和文件记录中的文件MD5值，
 * 将变化的文件放入update，用于build or publish
 * @param {string} dir 文件路径
 * @param {*} rs 保存所有文件对象
 * @param {MakeType} type build or pub操作，最新的文件列表写入building or pubing
 * @param {MakeOpt} opt - opt.file 限定发布文件或路径，不传获取所有
 */
async function getFile(dir, rs, type, opt) {
  try {
    // 获得当前文件夹下的所有的文件夹和文件，赋值给目录和文件数组变量
    const [dirs, files] = ld.partition(fs.readdirSync(dir), p =>
      fs.statSync(path.join(dir, p)).isDirectory()
    )

    // 对子文件夹进行递归，使用了await，串行同步执行
    let pms = []
    let r
    for (let d of dirs || []) {
      let name = path.join(dir, d).replace(opt.src, '')
      if (name.startsWith(path.sep)) name = name.slice(1)
      if (path.sep !== '/') name = name.replace(/\\/gim, '/') // 统一路径为/

      let mk = false
      // 限定发布文件或目录
      for (const v of opt.dirs) {
        if (new RegExp(`^${v}$|^${v}/`, 'i').test(name)) {
          mk = true
          break
        }
      }
      // 排除根目录
      if (mk) {
        for (const v of opt.xdirs) {
          if (new RegExp(`^${v}$|^${v}/`, 'i').test(name)) {
            mk = false
            break
          }
        }
      }
      if (mk) {
        // tree[d] = await getDir(path.join(dir, d), last); // 路径创建对象
        pms.push(getFile(path.join(dir, d), rs, type, opt))
      }
    }

    if (!ld.isEmpty(pms)) r = await Promise.all(pms)

    pms = []
    // 当前目录下所有文件名进行同步hash计算
    for (const f of files || []) {
      let name = path.join(dir, f).replace(opt.src, '')
      if (name.startsWith(path.sep)) name = name.slice(1)
      if (path.sep !== '/') name = name.replace(/\\/gim, '/') // 统一路径为/

      let mk = true
      // src 目录 中的文件，不带/
      if (!name.includes('/')) {
        mk = false
        for (let v of opt.files) {
          v = v.replace('.', '\\.').replace('*', '\\w+')
          if (new RegExp(`^${v}$`, 'i').test(name)) {
            mk = true
            break
          }
        }
      }

      // 限定文件扩展名
      if (mk && opt.ext && !new RegExp(`\.${opt.ext}$`, 'i').test(name)) mk = false

      // (pf.includes('.js') && v === pf)
      // tree[f] = await promisify(hashFile)(path.join(dir, f), rs, last); // eslint-disable-line
      // 排除文件
      if (mk) {
        for (let v of opt.xfiles) {
          v = v.replace('.', '\\.').replace('*', '\\w+')
          if (new RegExp(`^${v}$`, 'i').test(name)) {
            console.log('getFile exclude', {pf: v, name})
            mk = false
            break
          }
        }
      }
      if (mk) pms.push(hashFile(name, path.join(dir, f), rs, type))
    }
    if (!ld.isEmpty(pms)) r = await Promise.all(pms)
  } catch (e) {
    console.log(`getFile exp:${e.message}`)
  }
}

/**
 * 处理js更新文件
 * @param {*} rs
 */
function js(rs, opt) {
  // 有js文件变化，html、less 暂未处理
  if (rs && rs.R && !ld.isEmpty(rs.R.JS)) {
    const pf = {} // page file
    // f.R.JS.forEach((v) => { // forEach 回调函数是同步执行的，不用担心jf没有准备好！
    for (let v of rs.R.JS) {
      // eslint-disable-line
      let pk = false // 是否需重新编译      console.log('pages', {js: f.R.JS});

      for (let pf of opt.file) {
        // eslint-disable-line
        if (
          (pf.includes('.js') && v === pf) ||
          (!pf.includes('.js') && new RegExp(`^/?${pf}/`, 'i').test(v))
        ) {
          pk = true
          break
        }
      }

      // 排除
      if (pk) {
        for (let pf of opt.exclude) {
          // eslint-disable-line
          if (
            (pf.includes('.js') && v === pf) ||
            (!pf.includes('.js') && new RegExp(`^${pf}/`, 'i').test(v))
          ) {
            pk = false
            break
          }
        }
      }

      // 需编译文件
      if (pk) {
        let name = ''
        let file = v
        if (v.includes('/')) {
          const dir = path.dirname(v)
          file = path.basename(v)
          name = `${prj}/${dir}/${file.substring(0, file.indexOf('.'))}`
          uf[name] = `./src/${prj}/${dir}/${file}`
        } else {
          name = `${prj}/${file.substring(0, file.indexOf('.'))}`
          uf[name] = `./src/${prj}/${file}`
        }

        // 去掉包含page路径
        /*           if (v.includes('page/')) {
          const fl = path.parse(v.replace('page/', ''));
          if (fl.dir) {
            name = `${fl.dir}/${fl.name}`;
            let ns = name.split('/');
            ns = ns.map(n => n[0].toUpperCase() + n.slice(1));
            name = ns.join('');
            pf[name] = `./${file}`;
          } else {
            name = fl.name[0].toUpperCase() + fl.name.slice(1);
            pf[name] = `./${file}`;
          }
        }
*/
      }
    }

    // 有更新则发布
    if (!ld.isEmpty(uf)) {
      R.f = rs
    }
    // page下的文件写入pages.js文件
    //if (!_.isEmpty(pf))
    //  R = pagefile(pf);
  }
}

function checkVer(rs, ver) {
  let R = false
  // 比较主、中版本号，发现config.js与wiamap.js中的不一致，则全部重新发布！
  if (rs && ver) {
    if (rs.R && rs.R.ver) {
      let rg = /(\d*)\.(\d*)\.(\d+)/.exec(rs.R.ver)
      const rv = (rg && `${rg[1]}.${rg[2]}`) || ''
      rg = /(\d*)\.(\d*)\.(\d+)/.exec(ver)
      const pv = (rg && `${rg[1]}.${rg[2]}`) || ''
      if (rv !== pv) rs = {}
    } else {
      R = true
    }
  }
}

/**
 * 增加版本号
 * @param {*} prj 项目名称
 */
async function addVer(prj, rf, ver) {
  let R = ''

  try {
    // 参数配置文件
    const f = path.join(__dirname, '/src/config/app.js')
    const rv = /(\d*)\.(\d*)\.(\d+)/.exec(ver)
    const nv = (rv && `${rv[1]}.${rv[2]}.${parseInt(rv[3], 10) + 1}`) || ''
    if (nv) {
      const re = new RegExp(`ver\\s*:\\s*['"]${ver}['"]`, 'i')
      let pcs = fs.readFileSync(f, 'utf8')
      pcs = pcs.replace(re, `ver: '${nv}'`)
      fs.writeFileSync(f, pcs, e => e && console.log(`save ${f} exp:${e.message}`))

      // 更新配置文件后，更新f，便于后续处理
      if (rf) {
        rf['config.js'] = await promisify(hashFile)(f)
        // // config.js 必须包含在 app.js 中！
        // if (rf.R && rf.R.JS.includes('config.js'))
        //   delete rf.R.JS['config.js'];
      }

      console.warn(`addVer config ${ver} -> ${nv}`)
      R = nv
    }
  } catch (e) {
    console.log(` exp:${e.message}`)
  }

  return R
}

/**
 * 获取更新后需要编译的文件
 * @param {string} dir - 代码路径
 * @param {MakeOpt} opt - 代码路径
 * 数组：[page/attend/index.js]
 * 返回对象 uf: 更新文件 pf：页面文件
 * entry: {index: './src/index.js',
 * 'page/attend/index', './src/page/attend/index.js'}
 */
async function getUpdate(dir, opt) {
  let R
  try {
    // 获取上次自动上传文件清单
    const file = path.resolve(dir, './wiafile.yml')
    let last = null
    if (fs.existsSync(file)) last = yaml.load(fs.readFileSync(file, 'utf8'))

    // 比较主、中版本号，与发布文件不一致，则全部重新发布！
    // const {ver} = _appcfg
    // let clear = false
    // const lastVer = last?.wia?.pub?.ver
    // if (ver && lastVer) {
    //   let rg = /(\d*)\.(\d*)\.(\d+)/.exec(lastVer)
    //   const lv = (rg && `${rg[1]}.${rg[2]}`) || ''
    //   rg = /(\d*)\.(\d*)\.(\d+)/.exec(ver)
    //   const v = (rg && `${rg[1]}.${rg[2]}`) || ''
    //   clear = v !== lv
    // }

    const rs = await build(dir, opt)
    if (rs?.building && rs?.update) {
      // 更新文件
      const {less, html} = rs.update
      let {js} = rs.update
      // index 作为入口文件，必须包含，放到uf的最后
      // webpack 入口文件
      const uf = {less, html, js: {index: `./${owner}/${app}/src/index.js`}}
      if (js) {
        for (const v of js) {
          let pk = false // 是否需重新编译
          // eslint-disable-next-line
          for (let pf of opt.file) {
            if (
              (pf.includes('.js') && v === pf) ||
              (!pf.includes('.js') && new RegExp(`^${pf}/`, 'i').test(v))
            ) {
              pk = true
              break
            }
          }

          // 需编译文件
          if (pk) {
            const n = v.replace(/\.js$/i, '')
            uf.js[n] = `./${owner}/${app}/src/${v}`
          }
        }
      }

      let page = true
      // 仅仅配置文件修改，不重新发布page
      if (js.length === 1 && js.includes('config/app.js')) page = false
      const pf = {}
      // page 需将所有页面及app.js的公共js打包，无论是否更改
      if (page) {
        js = rs.building
        Object.keys(js).forEach(v => {
          if (/^page\/.+\.js$/.test(v)) {
            // if (v.startsWith('page/') && v.endsWith('.js')) {
            const n = v.replace(/\.js$/i, '')
            pf[n] = `./${owner}/${app}/src/${v}`
          }
        })
      }
      R = {uf, pf}
    }
  } catch (e) {
    console.log('getFile exp:', e.message)
  }

  return R
}

/**
 * 按文件后缀，设置变更文件列表
 * @param {*} rs 写入数据集，变更文件写入 rs.update
 * @param {*} f 当前文件，含路径，含后缀，不含src 根路径
 */
function setUpdate(rs, f) {
  let R = null

  if (!rs) return null

  try {
    if (!rs.update) rs.update = {time: util.logDate(), tick: Date.now()}

    let r = rs.update
    r.js = r.js || []
    r.html = r.html || []
    r.css = r.css || []
    r.less = r.less || []
    r.img = r.img || []
    r.asset = r.asset || []
    r.zip = r.zip || []

    // 'mall/page/login': './src/mall/page/login.js'
    switch (path.extname(f).toLowerCase()) {
      case '.js':
        r = r.js
        break
      case '.html':
        r = r.html
        break
      case '.less':
        r = r.less
        break
      case '.css':
        r = r.css
        break
      case '.zip':
        r = r.zip
        break
      case '.jpg':
        r = r.img
        break
      case '.png':
        r = r.img
        break
      default:
        r = r.asset
    }

    if (r) r.push(f)

    R = r
  } catch (e) {
    console.log(`setUpdate exp:${e.message}`)
  }

  return R
}

/**
 * 生成指定文件的 MD5值，写入building 或 pubing对象
 * 通过 MD5判断文件是否变化，变化文件写入 update，用于重新编译或发布
 * @param {string} name 去掉路径的文件名
 * @param {string} f 文件
 * @param {*} rs 写入的数据集
 * @param {MakeType} type 写入的数据集
 * @returns {Promise<*>}
 */
function hashFile(name, f, rs, type = MakeType.build) {
  return new Promise((res, rej) => {
    const r = fs.createReadStream(f)
    const md5 = crypto.createHash('md5')
    let hex = ''

    r.on('data', md5.update.bind(md5))
    r.on('end', () => {
      hex = md5.digest('hex')
      if (rs) {
        // console.log('hashFile', {file, act});
        let hs = null
        switch (type) {
          case MakeType.build: {
            if (!rs.building)
              rs.building = {
                time: util.logDate(),
                tick: Date.now(),
              }
            rs.building[name] = hex
            hs = rs.build || {}
            break
          }

          case MakeType.pack: {
            if (!rs.packing)
              rs.packing = {
                time: util.logDate(),
                tick: Date.now(),
              }
            rs.packing[name] = hex
            hs = rs.build || {}
            break
          }

          case MakeType.pub: {
            if (!rs.pubing)
              rs.pubing = {
                time: util.logDate(),
                tick: Date.now(),
              }
            rs.pubing[name] = hex
            hs = rs.pub || {}
            break
          }

          // 默认放入 last
          default: {
            break
          }
        }

        const h = hs && hs[name]
        // getLastHash(last, f);
        // 变化的文件，记录到update中
        if (!h || h !== hex) setUpdate(rs, name)
      }
      res(hex)
    })
  })
}

/**
 * 按yaml格式存储到指定文件
 * @param {object} rs
 * @param {string} f
 */
function save(rs, f) {
  try {
    const yml = yaml.dump(rs)
    fs.writeFile(f, yml)
  } catch (e) {
    console.log(`save exp:${e.message}`)
  }
}

/**
 * 编译完成，building文件列表替换之前的build,update保留
 * @param {string} dir
 * @param {boolean} succ 编译成功还是失败
 * @returns {object}
 */
function builded(dir, succ = true) {
  let R = {}
  try {
    dir = dir || process.cwd() // 默认指向运行目录
    const f = path.resolve(dir, './wiafile.yml')
    /** @type {*} */
    let r = {}
    if (fs.existsSync(f)) r = yaml.load(fs.readFileSync(f, 'utf8')) // require(file); // eslint-disable-line
    if (r?.local?.building) {
      const rs = {
        local: {build: {}, update: r.local.update || {}},
        release: r.release ? r.release : {},
        wia: r.wia ? r.wia : {},
      }
      rs.local.build = succ ? r.local.building || {} : r.local.build || {}
      save(rs, f)

      R = rs.local.update
    }
  } catch (e) {
    console.log(`wiafile builded exp:${e.message}`)
  }

  return R
}

/**
 * 打包完成，packing 变为 pack 或 被放弃
 * @param {*} dir
 * @param {boolean} succ 编译成功还是失败
 * @returns {object}
 */
function packed(dir, succ = true) {
  /** {object} */
  let R = {}
  try {
    dir = dir || process.cwd() // 默认指向运行目录
    const f = path.resolve(dir, './wiafile.yml')
    /** @type {*} */
    let r = {}
    if (fs.existsSync(f)) r = yaml.load(fs.readFileSync(f, 'utf8')) // require(file); // eslint-disable-line
    if (r?.release?.packing) {
      const rs = {
        release: {pack: {}, update: r.release.update},
        local: r.local ? r.local : {},
        wia: r.wia ? r.wia : {},
      }
      rs.release.pack = succ ? r.release.packing || {} : r.release.pack || {}
      save(rs, f)

      R = rs.release.update
    }
  } catch (e) {
    console.log(`pubed exp:${e.message}`)
  }

  return R
}

/**
 * 发布完成，pubing 变为 pub 或 被放弃
 * @param {*} dir
 * @param {boolean} succ 编译成功还是失败
 * @returns {object}
 */
function pubed(dir, succ = true) {
  /** {object} */
  let R = {}
  try {
    dir = dir || process.cwd() // 默认指向运行目录
    const f = path.resolve(dir, './wiafile.yml')
    /** @type {*} */
    let r = {}
    if (fs.existsSync(f)) r = yaml.load(fs.readFileSync(f, 'utf8')) // require(file); // eslint-disable-line
    if (r?.wia?.pubing) {
      const rs = {
        wia: {pub: {}, update: r.wia.update},
        release: r.release ? r.release : {},
        local: r.local ? r.local : {},
      }
      rs.wia.pub = succ ? r.pub.pubing || {} : r.wia.pub || {}
      save(rs, f)

      R = rs.wia.update
    }
  } catch (e) {
    console.log(`pubed exp:${e.message}`)
  }

  return R
}

/**
 *
 * @param {*} f
 * @returns {(...any) => Promise<*>}
 */
function promisify(f) {
  return (...arg) =>
    new Promise((res, rej) => {
      f(...arg, (err, rs) => {
        if (err) rej(err)
        else res(rs)
      })
    })
}

/**
 * src 编译到 dist
 * @param {*} dir
 * @param {MakeOpts} opts
 * @returns {Promise<*>}
 */
async function build(dir, opts) {
  return make(dir, MakeType.build, opts)
}

/**
 * 获取dist 打包到 pack 的文件列表
 * @param {*} dir
 * @param {MakeOpts} opts
 * @returns {Promise<*>}
 */
async function pack(dir, opts) {
  return make(dir, MakeType.pack, opts)
}

/**
 * pack 发布到 wia
 * @param {*} dir
 * @param {MakeOpts} opts
 * @returns {Promise<{packing: string[], update: {js: string[],}}>}
 */
async function pub(dir, opts) {
  return make(dir, MakeType.pub, opts)
}

/**
 * 从pack结果中获取需发布打包的文件列表，便于发布打包
 * 【注意】基于效率，增量生成规则如下：
 * 1. index 引用的文件修改，rspack 会自动更新到项目index.js文件
 * 2. page 页面文件（js、html、less、css）修改，需重新生成到 页面文件
 * 3. 页面引用的文件修改，rspack 会自动更新对应页面js文件
 * 4. clear 参数为true，不比较差异，全量生成，否则只生成变化文件（增量）
 * @param {{packing: string[], update: *}} rs - pack 返回数据集
 * @returns {Promise<{uf:*, pf:*}>} - uf为更新文件，pf为page全量文件
 */
async function getPack(rs) {
  let R
  try {
    if (!rs) return

    /** @type {{js: *}} */
    const uf = {js: {index: `./dist/index.js`}} // 无论是否修改（页面修改会影响index），均纳入生成
    const {js, html, less, css} = rs.update // 更新文件
    let n
    // 所有更新文件均需打包到js文件后再压缩
    for (const v of js) uf.js[v.replace(/\.js$/i, '')] = `./dist/${v}`
    for (const v of less) (n = v.replace(/\.less$/i, '')), (uf.js[n] = `./dist/${n}.js`)
    for (const v of css) (n = v.replace(/\.css$/i, '')), (uf.js[n] = `./dist/${n}.js`)
    for (const v of html) (n = v.replace(/\.html$/i, '')), (uf.js[n] = `./dist/${n}.js`)

    let page = true
    // 仅仅index文件修改，不重新发布page
    if (Object.keys(uf.js).length === 1) page = false
    /** @type {*} */
    const pf = {}
    // page 需将所有页面及app.js的公共js打包，无论是否更改
    if (page) {
      const ps = rs.packing // 所有页面js文件
      for (const v of Object.keys(ps || {})) {
        if (/^page\/\S+\.js$/.test(v)) {
          const n = v.replace(/\.js$/i, '')
          pf[n] = `./dist/${v}`
        }
      }
    }
    R = {uf, pf}
  } catch (e) {
    console.log('getPack exp:', e.message)
  }

  return R
}

export {build, builded, pack, packed, getPack, pub, pubed, MakeType}
