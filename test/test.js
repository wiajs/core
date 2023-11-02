function format(f, ...args) {
  let i = 0;
  const len = args.length;
  const str = String(f).replace(/%[sdj%]/g, x => {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s':
        return String(args[i++]);
      case '%d':
        return Number(args[i++]);
      case '%j':
        return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });

  return str;
}

function trimEnd(s, c) {
  if (!s) return '';

  if (!c) return String(s).replace(/(\s*$)/g, '');

  const rx = new RegExp(format('%s*$', c));
  return String(s).replace(rx, '');
}

function dates(fmt, d) {
  if (!fmt) fmt = 'yyyy-MM-dd';

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

  // Date.getXXX 函数会自动还原时区！！！
  const o = {
    y: d.getFullYear().toString(),
    M: d.getMonth() + 1, // 月份
    d: d.getDate(), // 日
    h: d.getHours(), // 小时
    m: d.getMinutes(), // 分
    s: d.getSeconds(), // 秒
    q: Math.floor((d.getMonth() + 3) / 3), // 季度
    S: d.getMilliseconds().toString().padStart(3, '0'), // 毫秒
  };

  // yy几个就返回 几个数字，使用 slice -4 倒数4个，再往后
  fmt = fmt.replace(/(S+)/g, o.S).replace(/(y+)/gi, v => o.y.slice(-v.length));
  fmt = fmt.replace(/(M+|d+|h+|m+|s+|q+)/g, v =>
    ((v.length > 1 ? '0' : '') + o[v.slice(-1)]).slice(-2)
  );

  return trimEnd(fmt, ' 00:00:00');
}

console.log(dates('yyyy-MM-dd'));
console.log(dates('yy-MM-dd'));
console.log(dates('yyyy-M-d'));
console.log(dates('yyyy-MM-dd hh:mm:ss'));
console.log(dates('yyyy-MM-dd  h:m:s'));
console.log(dates('yyyy-MM-dd hh:mm:ss.S'));
console.log(dates('yyyy-M-dd  h:m:s', '2020-05-22 8:9:8'));
