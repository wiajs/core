/**
 * 将rspack、swc等编译生成的less、html、js文件打包到一个js文件并zip压缩
 * 开发模式与生产模式输出的代码差异很大：
 * - 入口文件直接放最后调用，没有封装到代码数组中
 * - __webpack_require__ 被压缩成不同的字母，无法跨文件调用
 * - 奇怪的是，local模式生产打包，保留了 __webpack_require__，未保留入口文件
 * - local模式时，router 使用了 __webpack_require__，如果被压缩改名，将无法运行
 */
import path from 'node:path'
import util from 'node:util'
import crypto from 'node:crypto'
import zlib from 'node:zlib'
import fs from 'fs-extra'
import ld from 'lodash'
// const {minify, minify_sync} = require('terser')
import {parseSync, Compiler, minify} from '@swc/core' // acorn 替换为 swc

const gzip = util.promisify(zlib.gzip)

/**
 * @typedef {object} Opts
 * @prop {string} owner - 应用所有者
 * @prop {string} name - 应用名称
 * @prop {string} ver - 版本号
 * @prop {string} [dir] - 代码根路径
 * @prop {string} [out] - 发布打包输出路径
 * @prop {string} [cos] - 资源托管网址
 * @prop {string[]} [load] - 启动时需加载的模块，启动器需要，一般加载wia公用模块
 * @prop {boolean} [press] - 压缩代码
 * @prop {boolean} [gzip] - gzip打包
 * @prop {*} [cfg] - 打包配置文件
 */

/**
 * @typedef {object} Opt
 * @prop {string} owner
 * @prop {string} name
 * @prop {string} ver
 * @prop {string} cos
 * @prop {string[]} [load] - 启动器需要，一般加载wia公用模块
 * @prop {string} dir
 * @prop {string} out
 * @prop {boolean} press - 压缩代码
 * @prop {boolean} gzip - gzip打包
 * @prop {*} cfg - 打包配置文件
 */

const def = {
  owner: '',
  name: '',
  ver: '1.0.0',
  cos: 'https://cos.wia.pub', // 资源主机
  dir: '',
  out: 'dist', // 输出路径
  press: true,
  gzip: true,
  cfg: {},
}

export default class WiaPack {
  /** @type {Opt} */
  opt
  /** @type {Object.<string, string>} */
  files

  /**
   *
   * @param {Opts} opts
   */
  constructor(opts) {
    /** @type {Opt} */
    const opt = {...def, ...opts}
    const {cfg} = opt
    opt.dir = cfg.code.dir
    this.opt = opt
    this.cfg = cfg
  }

  /**
   * 调用rspack/webpack进行编译打包
   * @param {{js: Object.<*, string>}} uf - 更新文件对象
   *  {js: {'page/login': './dist/page/login.js'}}
   * @param {*} pf - page目录下，所有改变、未改变js文件，pf为空，表示不生成page.js
   */
  async work(uf, pf) {
    let R = {}
    const _ = this
    const {opt} = _
    const {owner, name, ver, dir} = opt

    try {
      _.files = uf

      console.log('work...', {uf, pf})

      // 处理编译后的代码
      R = await _.process(uf.js, pf)
    } catch (e) {
      console.log(`work exp:${e.message}`)
    }

    return R
  }

  /**
   * 处理webpack生成的文件，分离wia、index、page，并将页面的js、css、html 合并成一个js文件
   * @param {*} uf - 更新文件对象：{'page/login': './dist/page/login.js'}
   * @param {*} pf - 为页面对象，包含所有改变、未改变js文件，pf为空，表示不生成page.js
   * @returns {Promise<*[]>} - 对象数组[{'mall/page/login':'./dist/mall/page/login.js'}]
   */
  async process(uf, pf) {
    const R = []
    const _ = this
    const {opt, cfg} = _
    const {owner, name, ver, dir, out} = opt

    console.log(`${owner}/${name} process ...`)

    try {
      let index // index中包含的模块

      // 模块引用次数，查找仅引用一次的模块，包含到页面，不作为共用
      /** @type {Object.<*,string>} */
      let rf = {}

      // 针对每个变化源文件生成的打包文件进行处理，提取所有页面公共部分到 page.js 文件
      const ufk = Object.keys(uf)
      for (const k of ufk) {
        let f = path.resolve(dir, `dist/${k}.js`)
        if (path.sep !== '/') f = f.replace(/\\/gim, '/') // 统一路径为/，方便处理

        if (fs.existsSync(f)) {
          const ms = await _.getModule(f)
          if (ms) {
            for (const m of ms) {
              if (m.org) for (const n of ms) n.code = n.code.replaceAll(m.org, m.name)

              if (!cfg.module?.includes(m.name)) rf[m.name] = (rf[m.name] ?? 0) + 1
            }
            console.log('%s modules:%d file:%s', k, ms.length, uf[k])
          } else console.error('%s modules:%d file:%s', k, 0, uf[k])

          // 保存模块，稍后处理
          uf[k] = {name: uf[k], ms, f}
          // 首页
          if (/\/dist\/index.js$/.test(f)) index = ms

          // index.js与页面js各自打包，页面公共部分，不在index中的，打入page.js，wia引用部分打入wia.js
          // const wf = this.procFile(f, uf[k], ms, index, page, appcfg.load);
          // if (wf) R.push({[k]: wf});
        }
      }

      // 提取未修改page文件的引用模块，重新生成page.js
      const fk = ld.difference(Object.keys(pf), Object.keys(uf))

      const pfile = path.resolve(`${dir}/${out}`, './page.js')
      let lp // lastPage
      const lpf = {} // lastPageFiles 未更改页面文件引用模块
      // 获取当前页面共用模块
      if (fs.existsSync(pfile)) {
        const tx = await fs.readFile(pfile, 'utf8')
        try {
          lp = JSON.parse(tx)
        } catch (e) {}
      } else console.warn('process %s.%s page.js not found!', owner, name)

      // 未更新的页面，提取引用部分模块，排除index，保存到page中，代码从page.js获取
      // 如page.js 不存在，则需清除wiafile.yml 文件中的页面js，重新编译生成page.js！！！
      if (lp && fk && fk.length > 0) {
        // 提取未修改page文件的引用模块，使用现有page.js中的代码
        for (const k of fk) {
          const f = path.resolve(`${dir}/dist`, `${k}.js`)

          if (fs.existsSync(f)) {
            try {
              const tx = await fs.readFile(f, 'utf8')
              const p = JSON.parse(tx)
              lpf[k] = {f, name: pf[k], pf: p, ms: []}
              const {ms} = lpf[k]
              // 还原页面引用模块，排除wia模块
              if (p && p.M) {
                p.M.forEach(m => {
                  if (!cfg.module?.includes(m)) ms.push({name: m, code: lp[m]})
                })
                // 增加模块引用计数
                if (ms.length) {
                  ms.forEach(m => {
                    rf[m.name] = (rf[m.name] ?? 0) + 1
                  })
                }
                console.log('%s modules:%d', k, ms.length)
              }
            } catch (e) {
              console.error(`process last page:${k} exp:${e.message}`)
            }
          }
        }
      }

      // 所有page共用的js
      const page = {
        R: {
          name: `${owner}/${name}/page`,
          ver,
          time: +new Date(),
        },
        M: [],
      }

      // 共用的wia模块
      const wia = {
        R: {
          name: `${owner}/${name}/wia`,
          ver,
          time: +new Date(),
        },
        M: [],
      }

      // 首页模块
      index = {js: {}}

      // 唯一引用，页面唯一引用包含到页面
      const rfs = []
      Object.keys(rf).forEach(k => {
        if (rf[k] === 1) rfs.push(k)
      })
      rf = rfs

      // 处理更新文件
      for (const k of Object.keys(uf)) {
        // index.js与页面js各自打包，页面公共部分，不在index中的，打入page.js，wia引用部分打入wia.js
        const wf = await _.procFile(uf[k], rf, index, wia, page)
        if (wf) R.push({[k]: wf})
      }

      // 处理未更新页面文件
      for (const k of Object.keys(lpf)) {
        // index.js与页面js各自打包，页面公共部分，不在index中的，打入page.js，wia引用部分打入wia.js
        const wf = await _.procPgfile(lpf[k], rf, index, wia, page)
        if (wf) R.push({[k]: wf})
      }

      // 最后处理 index，页面共享代码，并入 index
      if (index.name && !ld.isEmpty(index.js)) {
        const wf = await _.pack(index.name, index.f, index.js, index.pms)
        if (wf) R.push({[index.name]: wf})
      }

      // 非页面自身的引用文件，写入 page
      if (page?.M.length) {
        const wf = await _.procPage(page)
        if (wf) R.push({page: wf})
      }

      // 非共用wia，写入 wia
      if (wia?.M.length) {
        const wf = await _.procWia(wia)
        if (wf) R.push({wia: wf})
      }
    } catch (e) {
      console.log(`process exp:${e.message}`)
    }

    return R
  } // process

  /**
   * 处理更新的js文件，当前页面的js、html、css 打包压缩成一个文件
   * @param {*} u 更新文件对象，{f, ms, name}
   * f: 文件在硬盘中的绝对文件名
   * rf: 相对文件名称 mall/page/shopList.js
   * ms: 该文件包含的模块数组
   * 模块名称：“./wia/store/src/app.js” 或 “./code/wia/store/src/app.js” 取决于运行路径
   * @param {*} rf 当前页面唯一引用模块，需打包到当前页面文件
   * @param {*} index 首页模块，页面共用模块放入index中加载，所有页面加载之前，需加载index
   * @param {*} wia wia 共用wia中未包含，放入当前应用wia，便于生成共用wia
   * @param {*} page 非页面模块(包括共用和非共用模块)，全部放入 page 保存，加快未变更页面模块分析速度
   */
  async procFile(u, rf, index, wia, page) {
    let R = ''
    const _ = this
    const {opt, cfg} = _

    try {
      const js = {}
      let ps

      // 页面引用模块，排除自己
      const pms = u.ms.filter(m => m.name !== u.name).map(m => m.name)
      const rgwia = new RegExp(cfg.code.wia.join('|'))

      // index.js 应用入口代码，wia.js 除外的模块，全部保留在index.js中
      if (/\/dist\/index.js$/.test(u.f)) {
        // 符合wia规则，未包含在共用wia中的，存入应用wia，便于更新wia包
        ps = u.ms.filter(m => !cfg.module?.includes(m.name) && rgwia.test(m.name))
        for (const m of ps) {
          if (!wia[m.name]) {
            wia[m.name] = m.code
            wia.M.push(m.name)
          }
        }

        index.pms = pms // 引用模块
        index.f = u.f
        index.name = u.name
        index.js = {}

        // ps = u.ms.filter(m => !rg.test(m.name));
        // 未包含在共用wia中，不符合wia规则，放入 index，跟page共用模块合并后生成index.js
        ps = u.ms.filter(m => !cfg.module?.includes(m.name) && !rgwia.test(m.name))
        for (const m of ps) {
          // index.push(m.name);
          // js[m.name] = m.code;
          if (m && m.code && m.name) {
            // 压缩代码, 生产模式ast效率低，使用eval开发模式编译，代码为字符串，效率高
            index.js[m.name] = opt.press ? await pressCode(m.code) : m.code
          }
        }
      } else {
        // 页面共用模块存入 page
        // 非页面自身，非共用wia
        ps = u.ms.filter(m => m.name !== u.name && !cfg.module?.includes(m.name))
        // 页面引用模块写入统一的page对象
        for (const m of ps) {
          // 非唯一引用的共用模块，放入 index
          if (!rf.includes(m.name)) {
            // 符合wia规则，非共用wia，存入应用wia，便于更新wia包
            if (rgwia.test(m.name)) {
              if (!wia[m.name]) {
                wia[m.name] = m.code
                wia.M.push(m.name)
              }
            } else if (!index.js?.[m.name]) index.js[m.name] = m.code
          }

          // 所有引用模块（非页面自身），全部放入 page 保存，加快未变更页面的模块分析速度
          if (!page[m.name]) {
            page[m.name] = m.code
            page.M.push(m.name)
          }
        }

        // 页面自身 和 唯一引用，存于当前页面
        ps = u.ms.filter(m => m.name === u.name || rf.includes(m.name))
        for (const m of ps) {
          if (rgwia.test(m.name)) {
            if (!wia[m.name]) {
              wia[m.name] = m.code
              wia.M.push(m.name)
            }
          } else if (m && m.code && m.name) {
            // 压缩代码, 生产模式ast效率低，使用eval开发模式编译，代码为字符串，效率高
            js[m.name] = opt.press ? await pressCode(m.code) : m.code
          }
        }
      }

      // 当前页面的js、html、css 打包压缩成一个文件
      if (!ld.isEmpty(js)) await _.pack(u.name, u.f, js, pms)

      R = u.f
    } catch (e) {
      console.error(`procfile exp:${e.message}`)
    }
    return R
  }

  /**
   * 处理未变更页面代码
   * 1、共享代码打包到index
   * 2、wia 代码，非缓存，打包到 wia.js，方便监测、收集独立的共享wia包
   * 3、原来共享的，可能变为独享，需加入到页面js
   * @param {*} u 更新文件对象，{f, ms, name, pf}
   * f: 文件在硬盘中的绝对文件名
   * name: 相对文件名称 mall/page/shopList.js
   * ms: 该文件包含的模块数组
   * pf：页面文件 对象
   * 模块名称：“./wia/store/src/app.js” 或 “./code/wia/store/src/app.js” 取决于运行路径
   * @param {*} rf 引用模块次数
   * @param {*} index 首页模块
   * @param {*} wia wia模块
   * @param {*} load 运行依赖，需提前加载的模块，需修改加载版本号
   * @returns {Promise<*>}
   */
  async procPgfile(u, rf, index, wia, page, load) {
    let R = ''

    const _ = this

    try {
      const {cfg, owner, name: app} = _
      // 页面引用模块，排除自己
      const rg = new RegExp(cfg.code.wia.join('|'))
      const ljs = u.pf.js
      const js = {}
      js[u.name] = ljs[u.name]

      // index.js 应用入口代码，wia.js 除外的模块，全部保留在index.js中
      // 页面共用模块存入 page
      // 排除自己，排除 wia
      const ps = u.ms.filter(m => m.name !== u.name && !cfg.module?.includes(m.name))
      // 页面引用模块写入统一的page对象
      ps.forEach(m => {
        // 共用模块，放入 index
        if (!rf.includes(m.name) && !index[m.name]) index[m.name] = m.code

        // 非页面模块，全部放入 page 保存，加快未变更页面的模块分析速度
        if (!page[m.name]) {
          page[m.name] = m.code
          page.M.push(m.name)
        }

        // 符合wia规则，未包含在wia中的，存入wia，便于更新wia包
        if (rg.test(m.name) && !wia[m.name]) {
          wia[m.name] = m.code
          wia.M.push(m.name)
        }

        // 唯一引用，包含到页面代码
        if (rf.includes(m.name)) {
          // 非唯一依赖由于其他页面变化，可能会变成唯一依赖
          if (!js[m.name]) {
            js[m.name] = m.code
          }
        }
      })

      // 有变化，则重新保存
      if (!ld.isEmpty(ld.difference(Object.keys(js), Object.keys(ljs)))) {
        u.pf.R = {
          name: u.name.replace(/\.js$/i, ''),
          ver: this.ver,
          time: +new Date(),
        }
        u.pf.js = js
        const wf = JSON.stringify(u.pf)
        await fs.writeFile(u.f, wf, e => {
          if (e) console.log(`save ${u.f} exp:${e.message}`)
          R = u.f
        })
      }
    } catch (e) {
      console.error(`procPgFile exp:${e.message}`)
    }

    return R
  }

  /**
   * js、html、css 打包保存
   * @param {*} name - 相对路径文件js文件
   * @param {*} f - 绝对路径js文件
   * @param {*} js - 引用模块
   * @param {*} pms
   */
  async pack(name, f, js, pms) {
    const _ = this
    const {opt} = _
    const {owner, name: appName, ver, dir, out} = opt

    try {
      // 将页面文件打包到一个文件中
      const w = {
        R: {
          name: name.replace(/\.js$/i, ''),
          ver: ver,
          time: +new Date(),
        },
        html: '',
        css: '',
        js: '',
      }

      // 加入 html，index.html 不打入包中！！！
      if (!/\/dist\/index\.js$/.test(f)) {
        const htmlf = f.replace(/\.js$/i, '.html')
        if (fs.existsSync(htmlf)) {
          const html = await fs.readFile(htmlf, 'utf8')
          if (html) w.html = html
        }
      }

      // 加入 css
      const cssf = f.replace(/\.js$/i, '.css')
      if (fs.existsSync(cssf)) {
        const css = await fs.readFile(cssf, 'utf8')
        if (css) w.css = css
      }

      w.js = js
      w.M = pms

      let wf = '' // 写入文件内容
      // 配置了load参数（如 wiastore），index 作为wia应用启动器，需使用$.M 加载 index 及 wia 模块
      // 未配置load参数，只有模块，由其他启动器动态加载运行，wia应用由wiastore 加载运行
      if (opt.load && /\/dist\/index\.js$/.test(f)) {
        // 更改 load中的版本号，确保客户端加载新发布的版本
        let load = opt.load.map(v => `"${v}"`).join(',')
        // 替换 ?v=${ver} 为当前版本
        load = load.replace(/\?v=\$\{ver\}/gim, `?v=${ver}`)

        // 获取并加载 wia.js，加载index.js中的所有模块，调用index模块
        wf =
          `(function(){var app=${JSON.stringify(w)};\r\n` +
          `$.M.get("${opt.cos}", [${load}])\r\n` +
          `.then(function(){$.M.add(app.js);$.M("${owner}/${appName}/index.js");})})();\r\n`

        // 未压缩
        f = f.replace(/([\\\/])dist[\\\/]/, `$1${out}$1`)
        // await fs.ensureDir(path.dirname(f))
        // fs.writeFile(f, wf)
      } else wf = JSON.stringify(w)

      // 未压缩，生产需屏蔽
      // f = f.replace(/([\\\/])dist[\\\/]/, `$1${out}$1`)
      // await fs.ensureDir(path.dirname(f))
      // fs.writeFile(f, wf)

      // 压缩
      f = f.replace(/([\\\/])dist[\\\/]/, `$1${out}$1`).replace(/\.js$/, '.zip') // write file
      // @ts-ignore
      const buf = await gzip(wf)
      await fs.ensureDir(path.dirname(f))
      fs.writeFile(f, buf)
      console.log(`Build ${name} gzipped(${(wf.length / 1024).toFixed(2)}KB -> ${(buf.length / 1024).toFixed(2)}KB)`)
    } catch (e) {
      console.error(`pack exp:${e.message}`)
    }
  }

  /**
   * 页面模块按名称排序
   */
  sortPage(ms) {
    const R = {}

    if (ld.isEmpty(ms)) return {}
    R.R = ms.R
    const ks = ld.sortBy(ld.keys(ms))
    ld.forIn(ks, k => {
      if (k !== 'R') R[k] = ms[k]
    })

    return R
  }

  /**
   * 生成指定文件的 MD5值，用于判断文件内容是否变化
   * @param {string} tx
   * @returns {string}
   */
  hash(tx) {
    let R = ''
    const hash = crypto.createHash('md5')
    hash.update(tx)
    R = hash.digest('hex')
    return R
  }

  /**
   * 将首页之外的页面共用模块，保存到page.js，便于分析
   * 该部分模块已包含在index.js，
   * 由于index加载前，需要加载page，因此合并page到index，不单独加载page
   * @param {*} page 首页之外的模块
   */
  async procPage(page) {
    let R
    const _ = this
    const {opt} = _
    const {owner, name, dir, out} = opt

    try {
      if (!page?.M.length) return

      console.log(`${owner}/${name} procPage(M:${page.M.length}) ...`)

      // 压缩代码
      if (opt.press) {
        for (const k of Object.keys(page)) {
          if (k !== 'R' && k !== 'M') page[k] = await pressCode(page[k])
        }
      }

      const f = path.resolve(`${dir}/${out}`, './page.js')

      // 添加自动合并模块 代码
      // const wf = `(function(){var js=${JSON.stringify(wia)};\r\n`
      //   + '$._m.add(js);})();\r\n';
      const wf = JSON.stringify(page)

      // console.log('Module:%s%s', JSON.stringify(p), '\r\n');
      await fs.ensureDir(path.dirname(f))
      await fs.writeFile(f, wf, e => {
        if (e) console.error(`save ${f} error:${e.message}`)
      })
      R = f
    } catch (e) {
      console.error(`procPage exp:${e.message}`)
    }

    return R
  }

  /**
   * 处理分离的 wia 包，共享缓存的wia已被排除
   * @param {*} wia wia模块
   * @returns {Promise<string>}
   */
  async procWia(wia) {
    let R = ''
    const _ = this
    const {opt} = _
    const {owner, name, dir, out} = opt

    try {
      if (!wia?.M.length) return

      console.log(`${owner}/${name} procWia(M:${wia.M.length}) ...`)

      // 压缩代码
      if (opt.press) {
        for (const k of Object.keys(wia)) {
          if (k !== 'R' && k !== 'M') wia[k] = await pressCode(wia[k])
        }
      }

      const f = path.resolve(`${dir}/${out}`, './wia.js')

      // 添加自动合并模块 代码
      // const wf = `(function(){var js=${JSON.stringify(wia)};\r\n`
      //   + '$._m.add(js);})();\r\n';
      const wf = JSON.stringify(wia)

      // console.log('Module:%s%s', JSON.stringify(p), '\r\n');
      await fs.ensureDir(path.dirname(f))
      fs.writeFile(f, wf)
      R = f
    } catch (e) {
      console.log(`procWia exp:${e.message}`)
    }

    return R
  }

  /**
   * page.js 未修改，则恢复原来的版本，无需更新！
   * @param {*} pfile
   * @param {*} lastP
   */
  async loadPageVer(pfile, lastP) {
    if (ld.isEmpty(lastP)) {
      if (fs.existsSync(pfile)) {
        const tx = await fs.readFile(pfile, 'utf8')
        lastP = JSON.parse(tx)
      }
    }

    const appf = pfile.replace(/page\.js$/i, 'app.js')
    let tx = await fs.readFile(appf, 'utf8')
    tx = tx.replace(`/mall/page.js?v=${this.ver}`, `/mall/page.js?v=${lastP.R.ver}`)
    await fs.writeFile(appf, tx, e => e && console.log(`save app.js ${pfile} exp:${e.message}`))
  }

  /**
   * 通过AST解析webpack开发模式打包文件中的__webpack_modules__，获取模块，返回数组
   * webpack/rspack 打包输出参数：mode: 'development', devtool: 'eval', 代码用字符串封装，ast 解析快，并且 入口文件也封装了
   * 生产模式，不同文件压缩后函数名称不统一
   * swc ast 让人迷惑的事情：
   * 1. 代码中有中文注释，按swc ast 解析位置获取代码，多获取中文字数的双倍
   * 2. 回车换行符，是一个字符，在文本编辑器中是两个字符，swc ast，好像是按两个字符计算，
   * 但是 使用 slice 获取的 字符串又是对的
   * 3. 注意，swc 是从1 开始计数，不是0！
   * 原因：
   *  SWC 的 span 是基于 UTF-8 字节偏移量
   *  中文字符在 UTF-8 编码中占用 2~3 个字节。
   *  例如，"中文" 在字符串中占用 2 个字符，但在 UTF-8 中占用 6 个字节。
   * 因此，使用buffer字节数组获取代码片段，转换为字符串，buffer 比字符串快，swc内部使用的buffer
   * @param {string} f - 注意是utf8字节数组，不是字符串
   * @returns {Promise<{name:string, org: string, code:string}[]>}
   */
  async getModule(f) {
    /** @type {{name:string, org: string, code:string}[]} */
    let R // 模块列表
    const _ = this
    const {opt} = _

    try {
      const buf = await fs.readFile(f)

      console.log('getModule read file:%s len:%d', f, buf.length)
      const ast = await parseSync(buf.toString(), {
        syntax: 'ecmascript',
      })

      // const compile = new Compiler()
      // const ast = compile.parseSync(
      //   buf.toString(),
      //   {
      //     syntax: 'ecmascript', // "ecmascript" | "typescript"
      //     // comments: false,
      //     // script: true, // parsed as a script instead of module.
      //     // isModule: true, // 强制重新初始化
      //     // sourceFileName: f, // 不同的源文件名，Span 独立
      //     // sourceFileName: undefined, // 让 span 从 0 开始
      //   },
      //   f
      // )
      let offset = ast.span.start

      // console.log(util.inspect(ast, true, 5, true), '【ast】')

      // getEntry(fn, ast) // devtool: 'eval' 入口函数已打包，直接获取

      let ms // = await ps
      // 从根节点 查找 __webpack_modules__
      // let ps = new Promise((res, rej) => {
      walkNode(ast, (n, parent) => {
        if (n.type === 'VariableDeclarator' && n.id?.value === '__webpack_modules__') {
          console.log('find __webpack_modules__')
          ms = n
          return true // 找到终止遍历
        }
      })
      // })

      // console.log(util.inspect(ms, true, 5, true), '【ms】')

      // 从根节点开始检查每个代码节点
      // ps = new Promise((res, rej) => {
      // let rs
      walkNode(ms, (n, parent) => {
        // require 我们认为是一个函数调用，并且函数名为 require，参数只有一个，且必须是字面量
        /*
      {"./src/index.js":(function (module, __webpack_exports__, __webpack_require__) {
        eval("");
      })
      // no static exports found
      (function(module, exports) {
        eval()
      })
      */
        // console.log({type: n.type})
        // 根据模块特征，筛选模块节点
        if (n.type === 'ObjectExpression' && Array.isArray(n.properties)) {
          const {properties: props} = n
          const [prop] = props

          console.log({
            len: n.properties?.length,
            ktype: prop.key?.type,
            kvalue: prop.key.value,
          })

          if (
            prop?.type === 'KeyValueProperty' &&
            prop.key?.type === 'StringLiteral' && // 属性名称为字面量
            /\.js$|.mjs$|.cjs$|.ts$|\.less$|\.css$|\.html$|\.json$|\.css\$$/.test(prop.key.value) // 属性名称包含 .js .less
          ) {
            for (const prop of props) {
              // console.log(util.inspect(prop, true, 20, true))
              let name = prop.key.value
              const {value: v} = prop
              const start = v.span.start - offset // - _astSpan - 1
              const end = v.span.end - offset // _astSpan - 1
              // 获取依赖的相关信息
              // console.log({name, span: v.span}, 'getModule-0')
              let code = buf.subarray(start, end).toString()
              // code = code.replaceAll('__webpack_require__', '__m__') // 全局替换

              let pos = code.indexOf('eval("')
              if (pos !== -1) {
                let head = code.slice(0, pos)
                let body = code.slice(
                  code.indexOf('eval("') + 6,
                  code.lastIndexOf('//# sourceURL=webpack:') // devtool: eval 才有
                  //  code.lastIndexOf('")' + 1)) // eval的结尾
                )

                // 将eval中的代码字符串做了转义，需将转义字符还原成真实字符，否则代码压缩报错
                body = JSON.parse(`{"m":"${body}"}`).m
                if (head.startsWith('(')) head = head.slice(1) // 去掉()，带()压缩无效
                code = `${head}${body}}`
              }

              console.log({name, offset, span: v.span, start: code.slice(0, 50), tail: code.slice(-50)}, 'getModule')

              // 路径替换，以最后一个 node_modules 路径为准
              pos = name.lastIndexOf('/node_modules/')
              const org = name
              if (pos !== -1) {
                // ../../node_modules/.pnpm/@wiajs+core@1.1.28/node_modules/@wiajs/core/dist/core.mjs
                /** @type {string} */
                const pre = name.slice(0, pos)
                if (name.endsWith('.less') && pre.includes('/node_modules/less-loader/')) name = `~~/${name.slice(pos + 14)}`
                else name = `~/${name.slice(pos + 14)}`
              } else if (/^\.\/src\//.test(name)) {
                name = name.replace(/^\.\/src\//, `${opt.owner}/${opt.name}/`)
              } else if (/^\.\/wia\.config\.js/.test(name)) {
                name = name.replace(/^\.\/wia\.config\.js/, `${opt.owner}/${opt.name}/wia.config.js`)
              }

              // name = name.replace(/[.]{1,2}\/[./]*\/node_modules\//gi, '~/')
              // // "~/.pnpm/@wiajs+core@1.1.28/node_modules/@wiajs/core/dist/core.mjs"
              // name = name.replace(/~\/\S+\/node_modules\//gi, '~/')

              // code = code.replace(/[.]{1,2}\/[./]*\/node_modules\//gi, '~/')
              // code = code.replace(/~\/\S+\/node_modules\//gi, '~/')
              if (!R) R = []
              R.push({
                name,
                org, // 原始名称，需全代码替换为name，不在这里替换
                code, // 由于存在很多重复模块，在生成唯一模块时做压缩，不在这里做压缩，
              })
            }
            return true // 终止遍历
          }
        }
      })

      // console.log({R}, 'getModule')
    } catch (e) {
      console.error(`getModule exp:${e.message}`)
    }

    return R
  }
}

/**
 * 压缩代码
 * @param {*} src 代码
 * @returns {Promise<string>}
 */
async function pressCode(src) {
  let R = src

  try {
    // console.log({src}, '【src】')

    // swc
    const opts = {
      compress: {
        // booleans: true, // 优化布尔表达式
        // conditionals: true, // 优化条件表达式
        drop_console: true, // 删除 `console.log` 等调试信息
        drop_debugger: true, // 删除 debugger
        dead_code: true,
        unused: true, // 删除未使用的变量和函数
      },
      mangle: {
        // reserved: ['__unused_webpack_module', '__webpack_exports__', '__webpack_require__'],
        // reserved: ['__m__'],
      },
      format: {
        comments: false, // 仅保留特定注释，例如 /*! */   false
      },
      ecma: 6, // 5: ES5 6或2015: ES6  specify one of: 5, 2015, 2016, etc.
      module: false, // 指定是否将代码视为模块
      safari10: true, // Safari 10 的特定问题，如 for-of 迭代器兼容性
      // toplevel: true, // 缺省 false，是否优化顶层作用域的变量和函数
      sourceMap: false, // 为压缩后的代码生成 source map 文件，便于调试
      // outputPath: undefined, // 指定压缩后文件的输出路径
      // inlineSourcesContent: false, // 将源代码内容内联到生成的 source map 中
    }

    // terser
    const opts2 = {
      ecma: 6, // specify one of: 5, 2015, 2016, etc.
      enclose: false, // or specify true, or "args:values"
      keep_classnames: false,
      keep_fnames: false,
      ie8: false,
      module: false,
      nameCache: null, // or specify a name cache object
      safari10: false,
      toplevel: false,
      mangle: {
        toplevel: false, // 防止顶层作用域的变量和参数被混淆或重命名。
      },
    }

    // const rs = await mini(src.replace('function (', 'function __xxx__('), opts2)
    const rs = await minify(src.replace('function (', 'function __xxx__('), opts) // 没有函数名称无法压缩
    // console.log({src, rs})
    if (rs?.code) R = `${rs.code.replace('function __xxx__(', 'function (')}`
  } catch (e) {
    console.log(`pressCode exp:${e.message}`)
  }

  return R
}

/**
 * 返回入口函数，devtool: false 时，入口函数未封装，ast 会很大，不用
 * @param {string} fn
 * @param {*} ast
 * @returns {string}
 */
function getEntry(fn, ast) {
  let R

  try {
    let entry
    // 从根节点 查找 __webpack_modules__
    walkNode(ast, (n, parent) => {
      if (n.type === 'VariableDeclarator' && n.id?.value === '__webpack_exports__') {
        entry = n
        return true // 找到终止遍历
      }
    })

    entry = buf.subarray(entry.span.end).toString()
    entry = entry.slice(0, entry.lastIndexOf('})()')).replace(/..\/[./]*\/node_modules\//gi, '~/')
    // .replace(/__webpack_require__/gi, '__m__') // 全局替换

    // This entry need to be wrapped in an IIFE because it need to be in strict mode.
    const IIFE = entry.includes('wrapped in an IIFE')
    if (IIFE) entry = entry.slice(entry.indexOf('(() => {') + 8, entry.lastIndexOf('})()'))

    entry = `function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {${entry}}`

    console.log({fn, start: entry.slice(0, 80), tail: entry.slice(-80)}, 'getEntry')
    R = entry
  } catch (e) {
    console.error(`getEntry exp:${e.message}`)
  }

  return R
}

/**
 * 迭代遍历所有节点(包括子节点)，回调函数返回 true，则终止剩余节点遍历
 * @param {*} node
 * @param {(node: *, parent: *) => boolean} cb
 * @param {*} parent
 * @returns {boolean}
 */
function walkNode(node, cb, parent) {
  if (!node || typeof node !== 'object') return

  // 调用回调函数处理当前节点和父节点
  if (cb(node, parent) === true) return true

  // 有 type 字段的我们认为是一个节点
  for (const k of Object.keys(node)) {
    const item = node[k]
    if (Array.isArray(item)) {
      // 遍历数组中的每个子节点，返回成功则停止遍历剩余节点
      for (const v of item) {
        if (walkNode(v, cb, node)) return true
      }
      // } else if (item?.type) walkNode(item, cb, node) // 遍历单个子节点
    } else if (item && typeof item === 'object') {
      // 遍历单个子节点，返回成功则停止遍历剩余节点
      if (walkNode(item, cb, node)) return true
    }
  }
}

function sortObj(obj) {
  const R = {}
  const ks = ld.sortBy(ld.keys(obj))

  ld.forIn(ks, k => {
    R[k] = obj[k]
  })

  return R
}

// test
// const pack = new Pack();
// pack.work({login: './src/mall/page/login.js'});
