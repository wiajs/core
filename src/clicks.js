/**
 * document 绑定click事件，传递到 app.on，页面、部件、组件可通过该方法接收点击事件
 * 触发所有子模块的 clicks
 * 支持touch则绑定touch，否则绑定click
 * 无论touch 还是 click事件，都会触发事件响应函数
 * @param {*} cb
 */
function bindClick(cb) {
  let touchStartX
  let touchStartY
  function touchStart(ev) {
    // ev.preventDefault();
    touchStartX = ev.changedTouches[0].clientX
    touchStartY = ev.changedTouches[0].clientY
  }
  function touchEnd(ev) {
    // ev.preventDefault();
    const x = Math.abs(ev.changedTouches[0].clientX - touchStartX)
    const y = Math.abs(ev.changedTouches[0].clientY - touchStartY)
    // console.log('touchEnd', {x, y});

    if (x <= 5 && y <= 5) cb.call(this, ev)
  }

  // 在捕捉时触发，不影响后续冒泡阶段再次触发
  if ($.support.touch) {
    // console.log('bind touch');
    document.addEventListener('touchstart', touchStart, true)
    document.addEventListener('touchend', touchEnd, true)
  } else {
    // console.log('bind click');
    document.addEventListener('click', cb, true)
  }
}

function initClicks(app) {
  function appClick(ev) {
    app.emit({
      events: 'click',
      data: [ev],
    })
  }

  function handleClicks(ev) {
    const $clickedEl = $(ev.target)
    const $clickedLinkEl = $clickedEl.closest('a')
    const isLink = $clickedLinkEl.length > 0
    const url = isLink && $clickedLinkEl.attr('href')

    // Check if link is external
    if (isLink) {
      const ext =
        $clickedLinkEl.hasClass('ext') ||
        url.startsWith('http:') ||
        url.startsWith('https:') ||
        url.startsWith('javascript:') ||
        url.startsWith('mailto:') ||
        url.startsWith('tel:') ||
        url.startsWith('#') ||
        url === ''

      // 外部链接、锚点和 javascript 调用
      if (ext) {
        const target = $clickedLinkEl.attr('target')
        if (url && window.cordova && window.cordova.InAppBrowser && (target === '_system' || target === '_blank')) {
          ev.preventDefault()
          window.cordova.InAppBrowser.open(url, target)
        } else if (
          url &&
          window.Capacitor &&
          window.Capacitor.Plugins &&
          window.Capacitor.Plugins.Browser &&
          (target === '_system' || target === '_blank')
        ) {
          ev.preventDefault()
          window.Capacitor.Plugins.Browser.open({url})
        }

        return // 跳过 all Modules Clicks
      } else {
        // 内部SPA 路由
        if (
          $ &&
          $.router &&
          !ev.preventWiaRouter &&
          !$clickedLinkEl.hasClass('prevent-router') &&
          !$clickedLinkEl.hasClass('router-prevent')
        ) {
          const validUrl = url && url.length > 0
          if (validUrl || $clickedLinkEl.hasClass('back')) {
            ev.preventDefault()
            const clickedLinkData = $clickedLinkEl.data()
            clickedLinkData.clickedEl = $clickedLinkEl[0]

            if ($clickedLinkEl[0].wiaRouteProps) clickedLinkData.props = $clickedLinkEl[0].wiaRouteProps

            if ($clickedLinkEl.hasClass('back')) $.router.back(url, clickedLinkData)
            else $.router.go(url, clickedLinkData)
          }
        }

        return // 跳过 all Modules Clicks
      }
    }

    // call all Modules Clicks，效率很低！！！
    Object.keys(app.modules).forEach(moduleName => {
      const moduleClicks = app.modules[moduleName].clicks
      if (!moduleClicks) return
      if (ev.preventF7Router) return
      Object.keys(moduleClicks).forEach(clickSelector => {
        const matchingClickedElement = $clickedEl.closest(clickSelector).eq(0)
        if (matchingClickedElement.length > 0)
          moduleClicks[clickSelector].call(app, matchingClickedElement, matchingClickedElement.dataset(), ev)
      })
    })
  }

  // 绑定click 或 touch 事件，触发时，发射click事件
  bindClick(appClick)
  // click event 响应，触发所有已加载模块的 clicks 函数，效率比较低！
  app.on('click', handleClicks)
}

export default {
  name: 'clicks',
  params: {
    clicks: {
      // External Links
      externalLinks: '.ext',
    },
  },
  on: {
    // app 创建时被调用
    init() {
      const app = this
      initClicks(app)
    },
  },
}
