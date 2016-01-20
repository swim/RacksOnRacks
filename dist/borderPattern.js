(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.borderPattern = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @file
 * borderPattern.js
 *
 * Provides a example(s) for creating complex border patterns
 * using HTML elements. This was created as a fun experiment and
 * should be seen as such ;).
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var defaults = require('./defaults.js');
var util = require('./util.js');

/**
 * borderPattern class
 *
 * @param element string/htmlElement
 * @param options object
 */

var borderPattern = (function () {
  function borderPattern(element, options) {
    _classCallCheck(this, borderPattern);

    this.element = util.selectElement(element);
    this.options = util.extend(defaults, options);

    // Internal defaults.
    this.row = 0;
    this.count = 0;
    this.left = 0;
    this.top = 0;
    this.items = [];

    this.setup();
  }

  _createClass(borderPattern, [{
    key: 'setup',
    value: function setup() {
      var width = this.options.width ? this.options.width : this.element.clientWidth;
      var height = this.options.height ? this.options.height : this.element.clientHeight;
      this.area = width * height * 1.2;

      this.options.perRow = this.options.perRow ? this.options.perRow : Math.ceil(width / this.options.element.width);

      // Ensure row contains an even count.
      if (this.options.perRow % 2) {
        this.options.perRow++;
      }

      this.createElements();
    }
  }, {
    key: 'createElements',
    value: function createElements() {
      var elementArea = this.options.element.height * this.options.element.width;
      this.total = Math.ceil(this.area / elementArea);

      for (var i = 0; i < this.total; i++) {
        this.items.push({
          id: i,
          'class': i % 2 ? 'up' : 'down',
          style: {
            top: 0,
            left: 0
          }
        });

        this.positionElement(this.items[i]);
      }
    }
  }, {
    key: 'positionElement',
    value: function positionElement(item) {
      if (this.row) {
        this.left += 32;

        if (!this.count) {
          this.left = 0;
        }
      } else {
        this.top = 0;
        this.left += 32;

        if (!this.count) {
          this.left = 0;
        }
      }

      if (this.count >= this.options.perRow) {
        this.left = 0;

        if (this.row == 1) {
          this.top = 128;
        } else if (this.row) {
          this.top = 64 * (this.row + 1);
        } else {
          this.top = 64;
        }

        // Reset count, up the row.
        this.row++;
        this.count = 0;
      }

      item.style.top = this.top + 'px';
      item.style.left = this.left + 'px';

      this.count++;
    }
  }]);

  return borderPattern;
})();

module.exports = borderPattern;

},{"./defaults.js":2,"./util.js":3}],2:[function(require,module,exports){
/**
 * @file
 * defaults.js
 */

"use strict";

var defaults = {
  // Auto calculates if not set.
  perRow: 0,
  // Element pattern width/ height.
  element: {
    width: 32,
    height: 64
  }
};

module.exports = defaults;

},{}],3:[function(require,module,exports){
/**
 * @file
 * util.js
 */

'use strict';

var util = {};

util.extend = function (defaults, options) {
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
};

util.selectElement = function (element) {
  if (typeof element == 'string') {
    return document.querySelector(element);
  }

  return element;
};

module.exports = util;

},{}]},{},[1])(1)
});


//# sourceMappingURL=borderPattern.js.map
