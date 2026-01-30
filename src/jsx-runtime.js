// runtime: 'automatic', // automatic or classic automatic 使用 JSX 运行时（在React 17 中引入）
// HTML 属性值转义函数
function escapeAttrValue(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function jsx(tag, {children, ...props} = {}) {
  let R = '';

  if (typeof tag === 'function') R = tag({children, ...props});
  else if (typeof tag === 'string') {
    const attrs = props || {};
    const attrsArray = [];

    // 特殊处理 className 和 htmlFor
    if (attrs.className) {
      attrsArray.push(`class="${escapeAttrValue(attrs.className)}"`);
      delete attrs.className;
    }
    
    if (attrs.htmlFor) {
      attrsArray.push(`for="${escapeAttrValue(attrs.htmlFor)}"`);
      delete attrs.htmlFor;
    }

    // 处理 style 对象
    if (attrs.style && typeof attrs.style === 'object') {
      const styleArray = [];
      for (const [key, value] of Object.entries(attrs.style)) {
        if (value == null) continue;
        
        // 转换驼峰式属性为CSS属性（backgroundColor -> background-color）
        const cssProp = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
        
        // 处理数值属性（添加px单位）
        let cssValue = value;
        if (typeof value === 'number' && 
            // 这些属性不需要单位
            !['zIndex', 'opacity', 'fontWeight', 'flex', 'order', 'zoom'].includes(key)) {
          cssValue = `${value}px`;
        }
        
        styleArray.push(`${cssProp}:${cssValue}`);
      }
      attrsArray.push(`style="${escapeAttrValue(styleArray.join(';'))}"`);
      delete attrs.style;
    }
    
    // 处理其他属性
    for (const [key, value] of Object.entries(attrs)) {
      // 跳过特殊处理的属性
      if (key === 'children' || key === 'className' || key === 'htmlFor') continue;
      
      // 处理布尔属性（如 disabled, checked 等）
      if (typeof value === 'boolean') {
        if (value) attrsArray.push(key);        
      } 
      // 处理动态值属性
      else if (value != null) {
        attrsArray.push(`${key}="${escapeAttrValue(value)}"`);
      }
    }

    const attrsString = attrsArray.join(' ');

/*    const attrsString = Object.keys(attrs)
      .map(attr => {
        if (attr[0] === '_') {
          if (attrs[attr]) return attr.replace('_', '');
          return '';
        }
        return `${attr}="${attrs[attr]}"`;
      })
      .filter(attr => !!attr)
      .join(' ');
*/
    // 自闭合标签处理
    const voidElements = ['input', 'img', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr', 'path', 'circle', 'polygon', 'line', 'rect', 'ellipse', 'use', 'stop'];
    if (voidElements.includes(tag))
      R = `<${tag}${attrsString ? ' ' + attrsString : ''} />`;
    else {
      const childrenContent = Array.isArray(children)
        ? children
            .filter(c => c != null) // 只过滤 null/undefined
            .map(c => {
              if (Array.isArray(c)) return c.join('');
              
              // 特殊处理布尔值（不渲染）
              if (typeof c === 'boolean') return '';
              
              return c;
            })
            .join('')
        : children != null
          ? (typeof children === 'boolean' ? '' : children)
          : '';

      R = `<${tag}${attrsString ? ' ' + attrsString : ''}>${childrenContent}</${tag}>`;
    }
  }

  return R;
}

function Fragment({children} = {}) {
  const R = Array.isArray(children)
    ? children
        .filter(c => c != null) // 只过滤 null/undefined
        .map(c => {
          if (Array.isArray(c)) return c.join('');
          if (typeof c === 'boolean') return '';
          return c;
        })
        .join('')
    : children != null
      ? (typeof children === 'boolean' ? '' : children)
      : '';

  return R;
}

exports.Fragment = Fragment;
exports.jsx = jsx;
exports.jsxs = jsx;
exports.jsxDEV = jsx;
