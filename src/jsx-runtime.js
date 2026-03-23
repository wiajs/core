// runtime: 'automatic', // automatic or classic automatic 使用 JSX 运行时（在React 17 中引入）

// 1. 完善的 HTML 转义，防止 XSS 攻击
function escapeHtml(str) {
  if (typeof str !== 'string') str = String(str)
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;') // 补充单引号转义
}

// 2. React 规范中无需添加 px 的免单位 CSS 属性集合（使用 Set，O(1) 查询效率最高）
const unitlessNumbers = new Set([
  'animationIterationCount', 'borderImageOutset', 'borderImageSlice', 'borderImageWidth',
  'boxFlex', 'boxFlexGroup', 'boxOrdinalGroup', 'columnCount', 'columns', 'flex',
  'flexGrow', 'flexPositive', 'flexShrink', 'flexNegative', 'flexOrder', 'gridRow',
  'gridRowEnd', 'gridRowSpan', 'gridRowStart', 'gridColumn', 'gridColumnEnd',
  'gridColumnSpan', 'gridColumnStart', 'fontWeight', 'lineClamp', 'lineHeight',
  'opacity', 'order', 'orphans', 'tabSize', 'widows', 'zIndex', 'zoom',
  'fillOpacity', 'floodOpacity', 'stopOpacity', 'strokeDasharray', 'strokeDashoffset',
  'strokeMiterlimit', 'strokeOpacity', 'strokeWidth'
])

// 3. 自闭合标签（使用 Set 提升性能）
const voidElements = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr', 'path', 'circle', 'polygon', 'line',
  'rect', 'ellipse', 'use', 'stop'
])

// 4. 深度递归渲染子节点 (支持多维嵌套、剔除空值、文本安全转义)
function renderChildren(children) {
  if (children == null || typeof children === 'boolean') return ''
  
  if (Array.isArray(children)) {
    let out = ''
    for (let i = 0; i < children.length; i++) {
      out += renderChildren(children[i]) // 递归拍平
    }
    return out
  }
  
  // 如果子节点本身已经是被 jsx() 处理过的字符串（或者是数字等），对其进行处理
  // 注意：在我们这个极简架构中，jsx() 返回的就是拼接好的字符串，所以直接当作安全 HTML 对待
  // 如果传入的是普通的字符串，为了安全起见，理论上应该转义。
  // 为了区分“原生组件返回的 HTML 字符串”和“用户直接写入的文本”，通常会通过一个特殊对象包裹。
  // 在当前纯字符串拼接的架构下，我们默认纯数字/纯字符串进入这里是被信任或已转义的，或者是组件生成的。
  // 如果需要极其严格的 XSS 保护，建议对确认为“文本节点”的项调用 escapeHtml(children)。
  return typeof children === 'string' ? children : escapeHtml(children)
}

function jsx(type, props = {}) {
  // 处理函数组件： <MyComponent foo="bar" />
  if (typeof type === 'function') {
    return type(props)
  }

  // 处理原生 HTML 标签
  let html = `<${type}`
  let innerHTML = ''
  const children = props.children

  for (const key in props) {
    if (!Object.prototype.hasOwnProperty.call(props, key)) continue
    if (key === 'children') continue
    
    const val = props[key]

    // 过滤 React 保留属性和空值
    if (key === 'key' || key === 'ref') continue
    
    // 过滤掉绑定的事件函数（如 onClick, onChange），静态 HTML 不渲染这些
    if (typeof val === 'function' && key.startsWith('on')) continue

    // 支持 React 的 dangerouslySetInnerHTML
    if (key === 'dangerouslySetInnerHTML') {
      if (val && val.__html) innerHTML = val.__html
      continue
    }

    let attrName = key
    let attrValue = val

    // React 特有属性向原生 HTML 映射
    if (attrName === 'className') attrName = 'class'
    else if (attrName === 'htmlFor') attrName = 'for'
    else if (attrName === 'defaultValue') attrName = 'value'    // 表单非受控默认值
    else if (attrName === 'defaultChecked') attrName = 'checked'// 表单非受控默认选中

    // 处理内联 Style 对象
    if (attrName === 'style' && typeof attrValue === 'object') {
      let styleStr = ''
      for (const styleKey in attrValue) {
        let styleVal = attrValue[styleKey]
        if (styleVal == null || typeof styleVal === 'boolean' || styleVal === '') continue

        let propName = styleKey
        // 处理 CSS 变量（如 --theme-color），不转驼峰，不加 px
        if (styleKey.startsWith('--')) {
          styleStr += `${propName}:${styleVal};`
        } else {
          // 驼峰转中划线 (backgroundColor -> background-color)
          propName = styleKey.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
          // 自动补全 px
          if (typeof styleVal === 'number' && styleVal !== 0 && !unitlessNumbers.has(styleKey)) {
            styleVal = `${styleVal}px`
          }
          styleStr += `${propName}:${styleVal};`
        }
      }
      if (styleStr) html += ` style="${escapeHtml(styleStr)}"`
      continue
    }

    // 处理布尔值属性 (如 disabled, checked)
    if (typeof attrValue === 'boolean') {
      if (attrValue) html += ` ${attrName}`
    } else if (attrValue != null) {
      // 普通属性，安全转义输出
      html += ` ${attrName}="${escapeHtml(attrValue)}"`
    }
  }

  // 闭合标签处理
  if (voidElements.has(type)) {
    html += ` />`
  } else {
    html += `>`
    // 渲染内容：如果存在 dangerouslySetInnerHTML，则优先渲染，否则渲染 children
    if (innerHTML) {
      html += innerHTML
    } else {
      html += renderChildren(children)
    }
    html += `</${type}>`
  }

  return html
}

// Fragment `<> ... </>` 只负责渲染并拍平内部子节点，不产生外层标签
function Fragment({children} = {}) {
  return renderChildren(children)
}

exports.Fragment = Fragment
exports.jsx = jsx
exports.jsxs = jsx
exports.jsxDEV = jsx
