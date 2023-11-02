if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/core.cmn');
} else {
  module.exports = require('./dist/core.cmn');
}
