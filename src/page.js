/**
 * 所有页面从该类继承，并必须实现 load 事件！
 * 事件
 *  五个个事件：load -> ready -> show / hide -> unload
 *  load：必选，加载视图、代码，第一次加载后缓存，后续不会重复加载，动态代码也要在这里加载
 *    参数；param
 *    如果需要前路由数据，通过 $.lastPage.data 访问
 *    view 还未创建，隐藏page 不存在
 *  ready：可选，对视图中的对象事件绑定，已经缓存的视图，比如回退，不会再次触发 ready
 *    参数；view、param
 *    如果需要前路由数据，通过 $.lastPage.data 访问
 *  show：可选，视图显示时触发，可以接收参数，操作视图，无论是否缓存（比如回退）都会触发
 *    对于已经加载、绑定隐藏（缓存）的页面，重新显示时，不会触发load和ready，只会触发show
 *    参数：view、param
 *  hide：可选，视图卸载删除时触发，适合保存卸载页面的数据，卸载的页面从页面删除，进入缓存
 *  unload：可选，页面从缓存中删除时触发，目前暂未实现
 *
 * 数据传递
 *  每个页面都能访问当前路由，路由存在以下参数，用户跨页面数据传递
 *  url：页面跳转时的原始网址
 *  param：页面网址及go中传入的参数合并，保存在 param 中
 *  data：路由中需要保存的数据
 *  view：当前页面层，dom 对象，已经包括绑定的事件
 *  $.page：当前页面对象
 *  $.lastPage：前路由，可通过该参数，获取前路由的 data，在后续路由中使用
 *
 */
import {log as Log} from '../util/log'
import Event from './event'

export default class Page extends Event {
  constructor(app, name, title, style) {
    super(null, [app])
    this.app = app // 应用实例
    this.cfg = app.cfg
    this.name = name // 名称，可带路径 admin/login
    this.title = title // 浏览器标题
    this.style = style || `./page/${name}.css`

    // 以下变量由路由器赋值
    this.owner = ''
    this.appName = ''
    this.path = ''
    this.view = null // 页面的div层$Dom对象，router创建实例时赋值
    this.dom = null // 页面的div层dom对象，router创建实例时赋值
    this.$el = null // $dom === view
    this.el = null // dom === dom

    this.html = '' // 页面html文本，router创建实例时赋值
    this.css = '' // 页面css样式，router创建实例时赋值
    this.js = '' // 页面代码，router创建实例时赋值
    this.data = {} // 页面数据对象
    this.param = {} // 页面切换传递进来的参数对象，router创建实例时赋值
  }

  /**
   * 异步加载页面视图内容
   * 返回Promise对象
   * @param {*} param
   * @param {*} cfg
   */
  load(param) {
    // $.assign(this.data, param);
    this.emit('local::load pageLoad', param)
    this.emit('pageLoad', this, param)
  }

  /**
   * 在已经加载就绪的视图上操作
   * @param {*} view 页面层的 Dom 对象，已经使用`$(#page-name)`，做了处理
   * @param {*} param go 函数的参数，或 网址中 url 中的参数
   * @param {*} lastPath 前路由的路径，go 函数的参数，或 网址中 url 中的参数
   */
  ready(view, param, lastPath) {
    // $.assign(this, {page, param, back});
    // $.assign(this.data, param);
    // 隐藏所有模板
    this.init()
    this.emit('local::ready', view, param, lastPath)
    // 向上触发跨页面事件，存在安全问题
    this.emit('pageReady', this, view, param, lastPath)
  }

  /**
   * 对页面进行初始化处理，或页面内容动态变更时，对局部页面容器进行初始化
   * @param {*} v dom 容器，默认为页面实例的view
   */
  init(v) {
    const {view} = this
    v = v ? $(v) : view
  }

  // 显示已加载的页面
  // view：页面Dom层，param：参数
  show(view, param, lastPath) {
    // 隐藏所有模板
    view.qus('[name$=-tp]').hide()
    // 防止空链接，刷新页面
    view.qus('a[href=""]').attr('href', 'javascript:;')
    // this.init();
    if (this.reset) this.reset()
    this.emit('local::show', view, param, lastPath)
    // 向上触发跨页面事件，存在安全问题
    this.emit('pageShow', this, view, param, lastPath)
  }

  // 回退显示已加载的页面
  // view：页面Dom层，param：参数
  back(view, param, lastPath) {
    // 隐藏所有模板
    view.qus('[name$=-tp]').hide()
    // 防止空链接，刷新页面
    view.qus('a[href=""]').attr('href', 'javascript:;')

    this.emit('local::back', view, param, lastPath)
    // 向上触发跨页面事件，存在安全问题
    this.emit('pageBack', this, view, param, lastPath)
  }

  change(view, param, lastParam) {
    this.emit('local::change', view, param, lastParam)
    // 向上触发跨页面事件，存在安全问题
    this.emit('pageChange', this, view, param, lastParam)
  }

  hide(view) {
    this.emit('local::hide', view)
    // 向上触发跨页面事件，存在安全问题
    this.emit('pageHide', this, view)
  }

  unload(view) {
    this.emit('local::unload', view)
    // 向上触发跨页面事件，存在安全问题
    this.emit('pageUnload', this, view)
  }
}

/**
 * 页面工厂函数
 * 自动处理类的继承、日志注入、生命周期事件绑定
 * @param {Object} def - 页面默认配置
 * @param {Object} hooks - 业务钩子函数集合 { init, bind, show... }
 */
export function page(def, hooks = {}) {
  // 自动根据配置创建当前页面的专属日志实例
  const _log = Log({m: `${def.name}`})

  return class extends Page {
    constructor(opts = {}) {
      const opt = {...def, ...opts}
      super(opt.app, opt.name, opt.title)
      this.opt = opt

      // ✨ 魔法 1：利用 page.js 内置的 Event 机制，全自动挂载无侵入日志！
      this.on('local::load', param => _log({param}, 'load'))
      this.on('local::ready', (v, param, lastPath) => _log({v, param, lastPath, id: this.id}, 'ready'))
      this.on('local::show', (v, param, lastPath) => _log({v, param, lastPath, id: this.id}, 'show'))
      this.on('local::change', (v, param, lastParam) => _log({v, param, lastParam}, 'change'))
      this.on('local::back', (v, param, lastPath) => _log({v, param, lastPath, id: this.id}, 'back'))
      this.on('local::hide', v => _log({v, id: this.id}, 'hide'))
      this.on('local::unload', v => _log({v, id: this.id}, 'unload'))
    }

    // 映射其他生命周期到业务 hooks
    load(param) {
      super.load(param)
      if (hooks.load) hooks.load({param, pg: this, log: _log})
    }

    // ✨ 魔法 2：统一调度业务代码的 init 和 bind，提供优雅的上下文
    async ready(v, param, lastPath) {
      super.ready(v, param, lastPath)

      // 组装上下文对象供业务使用
      const ctx = {v, pg: this, param, lastPath, log: _log}

      // 自动按顺序执行业务层的初始化和事件绑定
      if (hooks.init) await hooks.init(ctx)
      if (hooks.bind) hooks.bind(ctx)
    }

    show(v, param, lastPath) {
      super.show(v, param, lastPath)
      if (hooks.show) hooks.show({v, pg: this, param, lastPath, log: _log})
    }

    change(v, param, lastParam) {
      super.change(v, param, lastParam)
      if (hooks.change) hooks.change({v, pg: this, param, lastParam, log: _log})
    }

    back(v, param, lastPath) {
      super.back(v, param, lastPath)
      if (hooks.back) hooks.back({v, pg: this, param, lastPath, log: _log})
    }

    hide(v, param) {
      super.hide(v, param)
      if (hooks.hide) hooks.hide({v, pg: this, param, log: _log})
    }

    unload(v) {
      super.unload(v)
      if (hooks.unload) hooks.unload({v, pg: this, log: _log})
    }
  }
}
