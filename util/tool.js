class StringBuf {
  constructor() {
    this.buf = [];
  }

  append(str, ...args) {
    if (args.length > 0) this.buf.push(format(str, ...args));
    // 参数传递
    else this.buf.push(String(str));
  }

  insert(str, ...args) {
    if (args.length > 0) this.buf.unshift(format(str, ...args));
    // 参数传递
    else this.buf.unshift(String(str));
  }

  pop() {
    this.buf.pop();
  }

  toString() {
    return this.buf.join('');
  }
}

/**
 * 格式化字符串，类似 node util中带的 format
 * @type {Function}
 */
function format(f, ...args) {
  let i = 0;
  const len = args.length;
  const str = String(f).replace(/%[sdjo%]/g, x => {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s':
        return String(args[i++]);
      case '%d':
        return Number(args[i++]);
      case '%j':
      case '%o':
        return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });

  return str;
}

/**
 * 去除字符串头部空格或指定字符
 */
function trimStart(s, c) {
  if (!c) return String(s).replace(/(^\s*)/g, '');

  const rx = new RegExp(format('^%s*', c));
  return String(s).replace(rx, '');
}

/**
 * 去除字符串尾部空格或指定字符
 */
function trimEnd(s, c) {
  if (!s) return '';

  if (!c) return String(s).replace(/(\s*$)/g, '');

  const rx = new RegExp(format('%s*$', c));
  return String(s).replace(rx, '');
}

function addDay(n, d) {
  if (!d) d = new Date();
  else if (typeof d === 'string') {
    // 兼容
    d = d
      .replace(/\-/g, '/')
      .replace(/T/g, ' ')
      .replace(/\.+[0-9]+[A-Z]$/, '');
    // 还原时区，内部保存为标准时间
    d = new Date(d).getTime() - 3600000 * (new Date().getTimezoneOffset() / 60);
    d = new Date(d);
  }

  return new Date(d.getTime() + n * 36000000);
}

/**
 * 修改微信 title
 */
function setTitle(val) {
  setTimeout(() => {
    // 利用iframe的onload事件刷新页面
    document.title = val;

    const fr = document.createElement('iframe');
    // fr.style.visibility = 'hidden';
    fr.style.display = 'none';
    // fr.src = 'https://cos.nuoya.io/mall/favicon.ico';
    fr.onload = () => {
      setTimeout(() => {
        document.body.removeChild(fr);
      }, 0);
    };
    document.body.appendChild(fr);
  }, 0);
}

/**
 * 随机生成文件名称，能保存，并能作为 url字符串，主要用于上传图片随机生成文件名称
 * @param {int} len
 */
function newFileName(len) {
  const R = [];
  len = len || 32;
  // 键盘上的所有可见字符
  // 不包含 *?:/\<>|
  const str =
    // 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_~()';
    '123456789-_~()!';
  const size = str.length;
  for (let i = 0; i < len; i++) {
    R.push(str.charAt(Math.floor(Math.random() * size)));
  }
  return R.join('');
}

/**
 * 比较方法，用于对象数组排序，常用于数据表排序
 * @param {string} k 对象属性key
 * @param {boolean} desc 升序、降序，默认升序
 * @param {string} type 类型auto, number、date、string，缺省 auto
 * @param {string} [sub] 子对象
 */
function compareObj(k, desc, type, sub) {
  return (o1, o2) => {
    let R = 0
    try {
      let v1 = sub ? o1[sub][k] : o1[k]
      let v2 = sub ? o2[sub][k] : o2[k]

      // log({v1, v2, type}, 'compareObj')

      if (typeof v1 === 'string' || typeof v2 === 'string') {
        // 数字、日期字符串，按数字、日期排序
        // 金额可能有千字分隔符，需替换
        if (type.toLowerCase() === 'number') {
          if (typeof v1 === 'string') {
            v1 = v1.replaceAll(',', '').replaceAll(/null|-|^$/g, '0')
            v1 = Number(v1)
          }
          if (typeof v2 === 'string') {
            v2 = v2.replaceAll(',', '').replaceAll(/null|-|^$/g, '0')
            v2 = Number(v2)
          }
        } else if (type.toLowerCase() === 'date') {
          v1 = Date.parse(v1)
          v2 = Date.parse(v2)
        }
      }

      if (v1 < v2) R = desc ? 1 : -1
      else if (v1 > v2) R = desc ? -1 : 1

      // log({v1, v2, R}, 'compareObj')
    } catch (ex) {
      console.log('compareObj exp:', ex.message)
    }
    return R
  }
}

/**
 * 对象按名称排序，签名时需要
 * @param {*} obj
 * @param {*} fn
 */
function sortObj(obj) {
  const res = {};

  Object.keys(obj)
    .sort()
    .forEach(k => {
      res[k] = obj[k];
    });

  return res;
}

/**
 * 对象转为字符串，ajax调用时会用到
 * @param {*} obj
 */
function serObj(obj) {
  return Object.keys(obj)
    .map(k => `${k}=${obj[k]}`)
    .join('&');
}

/**
 * 金额千位分隔符字符串转换为 Number，单位分
 * 避免运算误差！
 * @param {String} v 金额千位分隔符金额字符串
 * @returns Number 整型金额，单位分
 */
function toFen(v) {
  let R = v
  if (typeof v === 'string') R = Math.round(Number.parseFloat(v.replaceAll(',', '')) * 100)
  return R
}

/**
 * 金额千位分隔符字符串
 * @param {Number} v 金额，单位分
 * @returns
 */
function toYuan(v) {
  let R = v

  if (typeof v === 'number') {
    v = `${(v * 0.01).toFixed(2)}` // 分到元
    // 千分符的正则
    const reg = v.includes('.') ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g
    R = v.replace(reg, '$1,') // 千分位格式化
  }

  return R
}

/**
 * 延迟promise，可以 await 或 then
 * @param {number} ms - 毫秒
 */
function delay(ms) {
  return new Promise(succ => {
    setTimeout(succ, ms)
  })
}

/**
 * 简单异步函数转换为promise函数
 * @param {*} f
 * @param {*} type
 * 0：一个回调，一个参数，无失败参数，仅仅返回执行结果
 * 1: 一个回调函数，第一个参数为 err，第二个参数为成功结果
 * 2：两个回调函数，第一个为成功回调，第二个为失败回调
 * 3：两个回调函数，第一个为失败回调，第二个为成功回调
 * @returns
 */
function promisify(f, type = 1) {
  return (...arg) =>
    new Promise((res, rej) => {
      if (type == null || type === 1)
        f(...arg, (err, rs) => {
          if (err) rej(err)
          else res(rs)
        })
      else if (type === 0) f(...arg, rs => res(rs))
      else if (type === 2)
        f(
          ...arg,
          rs => res(rs),
          rs => rej(rs || new Error('reject'))
        )
      else if (type === 3)
        f(
          ...arg,
          rs => res(rs),
          rs => rej(rs || new Error('reject'))
        )
    })
}

/**
 * 格式化数字：保留 cnt 位小数并添加千位分隔符
 * @param {number} num - 需要格式化的数字
 * @param {number} [cnt] - 小数位数
 * @returns {string} 格式化后的字符串
 */
function formatNum(num, cnt = 2) {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0.00' // 如果不是数字，返回默认值
  }
  return num.toLocaleString('en-US', {
    minimumFractionDigits: cnt, // 最少保留 2 位小数
    maximumFractionDigits: cnt, // 最多保留 2 位小数
  })
}

/**
 * 判断参数是否为空
 * @param {*} p
 * @returns {boolean}
 *  true: undefined/null/''/空对象/空数组/空Map/空Set
 *  false: false/0/非空对象、非空数组、值
 */
function isEmpty(p) {
  if (p === undefined || p === null || p === '') {
    return true
  }

  if (typeof p === 'string' && p.trim() === '') {
    return true
  }

  if (Array.isArray(p) && p.length === 0) {
    return true
  }

  if (p instanceof Map && p.size === 0) {
    return true
  }

  if (p instanceof Set && p.size === 0) {
    return true
  }

  // 检查普通空对象
  if (typeof p === 'object' && p !== null && p.constructor === Object && Object.keys(p).length === 0) {
    return true
  }

  return false
}

/**
 * 日期判断
 * @param {*} v
 * @returns
 */
function isDate(v) {
  return v instanceof Date
}

/**
 * 是否为数字
 * @param {*} value
 * @returns {boolean}
 */
function isNumber(value) {
  let R = false
  if (typeof value === 'number') R = true
  else R = Number.isFinite(Number(value)) && value.trim() !== ''

  return R
}

/**
 * 检查参数，不满足条件抛出异常
 * 1. 非数组：null/undefined/''/空对象
 * 2. 数组：其中一个元素 null/undefined/''/空对象
 * @param {*} p 参数
 * @param {string=} msg
 */
function needParam(p, msg) {
  if (isEmpty(p)) throw new Err(Err.MissParam, msg)

  if (Array.isArray(p)) {
    if (p.some(m => isEmpty(m))) throw new Err(Err.MissParam, msg)
  }
}

/**
 * 签名，添加 signTime 和 sign 属性
 * 签名120/30秒内有效，只能使用一次，防止重放攻击或重复提交
 * signTime：1970/1/1 以来的【毫秒数】，不用秒，避免重复
 * post 签名，参数需排序，signTime、Sign  不参与排序放最后，其他字段按字母排序
 * 不同时刻，不同用户pid，不同订单编号，可避免签名重复
 * 同用户pid的高密集并发重复请求可能导致签名重复
 * 可在入参中增加一个nonce随机数，避免签名重复
 * 【注意】日期类型，自动转换字符串为：Sat Jul 08 2023 21:48:24 GMT+0800 (China Standard Time)
 * 需手动 toISOString 转换为 "2011-10-05T14:48:00.000Z"
 * @param {*} r 被签名对象
 * @param {*} secret 签名密钥
 * @param {{start?: string, nonce?: boolean}} [opts={}] 起始日期，默认 1970
 * @returns 带签名的字符串
 */
async function sign(r, secret, opts = {nonce: true}) {
  let R = ''

  const {start, nonce} = opts
  // 签名时刻，默认 1970/1/1 以来的毫秒
  let signTime = Date.now()

  if (start) signTime = Math.trunc(Date.now() - Date.parse(start))

  // 可选，无实际用途的随机参数，避免签名重复
  if (nonce && !r.nonce) r.nonce = Math.floor(Math.random() * 1000000) // 6位随机数

  R = Object.keys(r)
    .sort()
    .map(k => (isDate(r[k]) ? `${k}=${r[k].toISOString()}` : `${k}=${r[k]}`))
    .join('&')

  // 兼容 DSC 旧的签名模式（UAir，大写开头）
  if (start) {
    R += `&SignTime=${signTime}`
    r.SignTime = signTime
    r.Sign = (await sha1(`${R}${secret}`)).toUpperCase()
    R += `&Sign=${r.Sign}`
  } else {
    R += `&signTime=${signTime}`
    r.signTime = signTime
    r.sign = (await sha1(`${R}${secret}`)).toUpperCase()
    R += `&sign=${r.sign}`
  }

  // 调试时使用，生产务必关闭，避免泄露密码！！！
  // log.debug(`sign r:${JSON.stringify(r)} R:${R} secret: ${secret}`)

  return R
}

export {
  StringBuf,
  format,
  trimStart,
  trimEnd,
  addDay,
  newFileName,
  compareObj,
  sortObj,
  serObj,
  setTitle,
  toYuan, toFen, promisify, delay, formatNum, isNumber, isDate, needParam, sign
};
