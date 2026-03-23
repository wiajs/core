/**
 * @typedef {Object} LogOptions
 * @property {string} m - 模块名称
 */

/**
 * @typedef {((...args: any[]) => void) & { debug: (...args: any[])=>void, info: (...args: any[])=>void, warn: (...args: any[])=>void, error: (...args: any[])=>void, err: (...args: any[])=>void }} ScopedLogger
 */

/**
 * @typedef {((...args: any[]) => void) & { log: (...args: any[])=>void, debug: (...args: any[])=>void, info: (...args: any[])=>void, warn: (...args: any[])=>void, error: (...args: any[])=>void, err: (...args: any[])=>void, fn: (name: string) => ScopedLogger }} LoggerFn
 */

// 1. 安全地获取开发环境状态（兼容打包工具、浏览器和 Node.js）
// 如果 Rspack 注入了 __DEV__，就用注入的值；如果是在 Node.js 下，就回退读取 process.env.NODE_ENV
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production'

/**
 * 前端日志输出，封装 console 日志，简化代码
 * 自动识别并重排提示符与对象，保持前后端一致性
 */
class Log {
  /** @type {string} 模块名称 */
  m = ''

  /** @type {string} 函数名称 */
  fnName = ''

  /**
   * @param {string} [m=''] 模块
   * @param {string} [fnName=''] 函数
   */
  constructor(m = '', fnName = '') {
    this.m = m
    this.fnName = fnName
  }

  /**
   * 格式化参数：提取提示符，构建前缀，将对象后置
   * 格式要求：[模块名称:函数名称]提示符: {对象}
   * @param {any[]} args
   * @returns {any[]} 返回处理后传递给 console 的参数数组
   */
  formatArgs(args) {
    let R = ''
    const _ = this
    try {
      const msgs = []
      const objs = []

      // 1. 将字符串(提示符)和非字符串(对象/数值等)分开
      for (const arg of args) {
        if (typeof arg === 'string') msgs.push(arg)
        else objs.push(arg)
      }

      let prefix = ''

      // 2. 添加模块与函数前缀
      if (_.m) prefix = `[${_.m}${_.fnName ? ':' + _.fnName : ''}]`
      else if (_.fnName) prefix = `[:${_.fnName}]`

      // 3. 拼接提示符
      const msg = msgs.join(' ')
      if (msg) prefix += msg

      R = []
      if (prefix) R.push(prefix)
      R.push(...objs)
    } catch (e) {
      console.error(`formatArgs exp:${e.message}`)
    }

    return R
  }

  /** @param {...any} args */
  log(...args) {
    // 生产环境安全剔除 (需 Rspack DefinePlugin 注入 __DEV__)
    if (isDev) console.log(...this.formatArgs(args))
  }

  /** @param {...any} args */
  debug(...args) {
    if (isDev) console.debug(...this.formatArgs(args))
  }

  /** @param {...any} args */
  info(...args) {
    if (isDev) console.info(...this.formatArgs(args))
  }

  /** @param {...any} args */
  warn(...args) {
    if (isDev) console.warn(...this.formatArgs(args))
  }

  /** @param {...any} args */
  trace(...args) {
    if (isDev) console.trace(...this.formatArgs(args))
  }

  /** * error 会在生产环境保留
   * @param {...any} args
   */
  error(...args) {
    console.error(...this.formatArgs(args))
  }

  /**
   * 用于 catch(e) log.err(e) 或 log.err("提示符", e) 或 log.err(e, "提示符")
   * 自动对齐前缀 [模块:函数] 提示符: Error对象，并保留堆栈
   * @param {...any} args
   */
  err(...args) {
    // 生产环境安全输出，不会被 Tree-shaking 摇掉
    // formatArgs 会自动分离字符串与 Error 对象，并补全冒号
    const formattedArgs = this.formatArgs(args)

    // 原生打印，保持 stack trace 可点击跳转！
    console.error(...formattedArgs)
  }

  /**
   * 派生函数级别日志实例 (完美对齐后端 log.fn)
   * @param {string} name 函数名称
   * @returns {ScopedLogger}
   */
  fn(name) {
    const scopedLog = new Log(this.m, name)

    /** @type {any} */
    const R = (...args) => scopedLog.log(...args)

    R.debug = scopedLog.debug.bind(scopedLog)
    R.info = scopedLog.info.bind(scopedLog)
    R.warn = scopedLog.warn.bind(scopedLog)
    R.trace = scopedLog.trace.bind(scopedLog)
    R.error = scopedLog.error.bind(scopedLog)
    R.err = scopedLog.err.bind(scopedLog)

    return /** @type {ScopedLogger} */ (R)
  }
}

// 实例化唯一的全局日志单例
const _log = new Log()

/**
 * 标准日志输出或构建模块日志类实例，用于模块中带[m:xxx]标记日志输出
 * 传入 { m: '模块名' } 构建实例，或直接传入参数输出全局日志
 * @param {...any} args - params
 * returns {*}
 */
function log(...args) {
  const last = args.at(-1)

  // 1. 如果只有一个参数且带 m 属性，说明是构造 Logger 实例 (如: const log = Log({m: 'User'}))
  if (args.length === 1 && typeof last === 'object' && last !== null && 'm' in last) {
    const lg = new Log(last.m)

    /** @type {any} */
    const R = (...args2) => lg.log(...args2)

    R.log = lg.log.bind(lg)
    R.debug = lg.debug.bind(lg)
    R.info = lg.info.bind(lg)
    R.warn = lg.warn.bind(lg)
    R.trace = lg.trace.bind(lg)
    R.error = lg.error.bind(lg)
    R.err = lg.err.bind(lg)
    R.fn = lg.fn.bind(lg) // 暴露派生函数作用域方法

    return /** @type {LoggerFn} */ (R)
  }

  // 2. 否则作为全局普通日志直接输出
  _log.log(...args)
}

// 绑定全局快捷方法，方便直接调用 log.err(e) 等
log.err = _log.err.bind(_log)
log.error = _log.error.bind(_log)
log.warn = _log.warn.bind(_log)
log.info = _log.info.bind(_log)
log.debug = _log.debug.bind(_log)
log.trace = _log.trace.bind(_log)

export {log, Log}
