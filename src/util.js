/**
 * @file
 * util.js
 */

var util = {};

util.extend = function(defaults, options) {
  var extended = {};
  var prop;

  for (prop in defaults) {
    if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
      extended[prop] = defaults[prop];
    }
  }
  for (prop in options) {
    if (Object.prototype.hasOwnProperty.call(options, prop)) {
      extended[prop] = options[prop];
    }
  }

  return extended;
}

util.selectElement = function(element) {
  if (typeof element == 'string') {
    return document.querySelector(element);
  }

  return element;
}

module.exports = util;