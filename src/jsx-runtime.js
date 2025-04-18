// runtime: 'automatic', // automatic or classic automatic 使用 JSX 运行时（在React 17 中引入）
function jsx(tag, {children, ...props} = {}) {
  let R = '';

  if (typeof tag === 'function') R = tag({children, ...props});
  else if (typeof tag === 'string') {
    const attrs = props || {};
    const attrsString = Object.keys(attrs)
      .map(attr => {
        if (attr[0] === '_') {
          if (attrs[attr]) return attr.replace('_', '');
          return '';
        }
        return `${attr}="${attrs[attr]}"`;
      })
      .filter(attr => !!attr)
      .join(' ');

    if (['path', 'img', 'circle', 'polygon', 'line', 'input'].indexOf(tag) >= 0)
      R = `<${tag} ${attrsString} />`.trim();
    else {
      const childrenContent = Array.isArray(children)
        ? children
            .filter(c => !!c)
            .map(c => (Array.isArray(c) ? c.join('') : c))
            .join('')
        : children;

      R = `<${tag} ${attrsString}>${childrenContent ?? ''}</${tag}>`.trim();
    }
  }

  return R;
}

function Fragment({children} = {}) {
  const R = Array.isArray(children)
    ? children
        .filter(c => !!c)
        .map(c => (Array.isArray(c) ? c.join('') : c))
        .join('')
    : children;

  return R ?? '';
}

exports.Fragment = Fragment;
exports.jsx = jsx;
exports.jsxs = jsx;
exports.jsxDEV = jsx;
