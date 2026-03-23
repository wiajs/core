/**
 * 模块日志选项
 */
export interface LogOptions {
  /** 模块名称 */
  m: string
}

/**
 * 派生函数级别的日志实例（支持直接作为函数调用，或调用内部方法）
 */
export interface ScopedLogger {
  (...args: any[]): void
  debug(...args: any[]): void
  info(...args: any[]): void
  warn(...args: any[]): void
  error(...args: any[]): void
  err(...args: any[]): void
  trace(...args: any[]): void
}

/**
 * 模块级别的日志实例（带有派生子函数 .fn 的能力）
 */
export interface LoggerFn {
  (...args: any[]): void
  log(...args: any[]): void
  debug(...args: any[]): void
  info(...args: any[]): void
  warn(...args: any[]): void
  error(...args: any[]): void
  err(...args: any[]): void
  trace(...args: any[]): void
  /**
   * 派生函数级别日志实例 (完美对齐后端 log.fn)
   * @param name 函数名称
   */
  fn(name: string): ScopedLogger
}

/**
 * 前端日志输出核心类
 * 自动识别并重排提示符与对象，保持前后端一致性
 */
export class Log {
  /** 模块名称 */
  m: string
  /** 函数名称 */
  fnName: string

  constructor(m?: string, fnName?: string)

  /**
   * 格式化参数：提取提示符，构建前缀，将对象后置
   * 格式要求：[模块名称:函数名称]提示符: {对象}
   * @param args
   * @returns 返回处理后传递给 console 的参数数组
   */
  formatArgs(args: any[]): any[]

  log(...args: any[]): void
  debug(...args: any[]): void
  info(...args: any[]): void
  warn(...args: any[]): void
  trace(...args: any[]): void

  /**
   * error 会在生产环境保留
   */
  error(...args: any[]): void

  /**
   * 用于 catch(e) log.err(e) 或 log.err("提示符", e) 或 log.err(e, "提示符")
   * 自动对齐前缀 [模块:函数] 提示符: Error对象，并保留堆栈
   */
  err(...args: any[]): void

  /**
   * 派生函数级别日志实例
   * @param name 函数名称
   */
  fn(name: string): ScopedLogger
}

/**
 * 全局的 log 实例接口
 * 实现了函数重载，支持构造日志模块对象，或是直接调用
 */
export interface GlobalLogger {
  /**
   * 构建模块日志类实例
   * @example const uploaderLog = log({ m: 'uploader' })
   */
  (opt: LogOptions): LoggerFn

  /**
   * 标准日志输出 (无模块前缀)
   * @example log('普通提示', { data: 1 })
   */
  (...args: any[]): void

  err(...args: any[]): void
  error(...args: any[]): void
  warn(...args: any[]): void
  info(...args: any[]): void
  debug(...args: any[]): void
  trace(...args: any[]): void
}

/**
 * 标准日志输出或构建模块日志类实例
 */
export const log: GlobalLogger
