const Plugin = require('mokit-plugin');
module.exports = new Plugin(function () {
  return require('./touch');
});