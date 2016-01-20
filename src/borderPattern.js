/**
 * @file
 * borderPattern.js
 *
 * Provides a example(s) for creating complex border patterns
 * using HTML elements. This was created as a fun experiment and
 * should be seen as such ;).
 */
'use strict';

var defaults = require('./defaults.js');
var util = require('./util.js');

/**
 * borderPattern class
 *
 * @param element string/htmlElement
 * @param options object
 */
class borderPattern {
  constructor(element, options) {
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

  setup() {
    var width = this.options.width ? this.options.width : this.element.clientWidth;
    var height = this.options.height ? this.options.height : this.element.clientHeight;
    this.area = (width * height) * 1.2;

    this.options.perRow = this.options.perRow ? this.options.perRow : Math.ceil(width / this.options.element.width);

    // Ensure row contains an even count.
    if (this.options.perRow % 2) {
      this.options.perRow++;
    }

    this.createElements();
  }

  createElements() {
    var elementArea = this.options.element.height * this.options.element.width;
    this.total = Math.ceil(this.area / elementArea);

    for (var i = 0; i < this.total; i++) {
      this.items.push({
        id: i,
        class: i % 2 ? 'up' : 'down',
        style: {
          top: 0,
          left: 0
        }
      })

      this.positionElement(this.items[i]);
    }
  }

  positionElement(item) {   
    if (this.row) {
      this.left += 32;

      if (!this.count) {
        this.left = 0;
      }
    }
    else {
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
      }
      else if (this.row) {
        this.top = (64 * (this.row + 1));
      }
      else {
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
}

module.exports = borderPattern;