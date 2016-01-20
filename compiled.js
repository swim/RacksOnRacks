(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @file
 * mithril.modal.js
 *
 * Usage
 * Define new model with unique id; as bellow.
 * this.searchModal = new modal.controller({
 *   id: 'search',
 *   display: false,
 *   controls: true
 * })
 *
 * Trigger each model by id.
 * modal.vm.open(event, 'search');
 * modal.vm.close(event, 'search');
 */

var modal = {};

/**
 * Modal model =).
 */
modal.vm = (function() {
  var vm = {
    id: m.prop(),
    page: m.prop(),
    display: m.prop(false),
    controls: m.prop(true)
  }

  /**
   * Init.
   */
  vm.init = function(options) {
    vm.page(options.page);
    options.hasOwnProperty('id') ? vm.id(options.id) : '';
    options.hasOwnProperty('display') ? vm.display(options.display) : '';
    options.hasOwnProperty('controls') ? vm.controls(options.controls) : '';
  }

  vm.view = function(element, isInitialized, context) {
    if (!isInitialized) {
      element.style.opacity = 1;
      // Velocity(element, {opacity: 1})
    }
  }

  vm.open = function(event, id) {
    event.preventDefault();
 
    if (vm.page()) {
      var page = document.getElementById(vm.page());
      page.classList.add('active');
    }

    vm.display(id);
  }

  vm.close = function(event, id) {
    m.redraw.strategy('none')

    event ? event.preventDefault() : '';
    id ? modal.vm.display(id) : '';

    if (vm.page()) {
      var page = document.getElementById(vm.page());
      page.classList.remove('active');
    }

    // @todo, implement callback... before & after.
    element = document.getElementById(modal.vm.display());
    element.style.opacity = 0;
    vm.display(false);
    m.redraw();
    /*Velocity(element, {opacity: 0}, {
      complete: function() {
        m.startComputation()
        vm.display(false);
        m.endComputation()
      }
    })*/
  }

  return vm;
}())

/**
 * Modal controller.
 */
modal.controller = function(options) {
  this.id = options.id ? options.id : '';
  modal.vm.init(options)
};

/**
 * Modal controls.
 */
modal.controls = function() {
  if (modal.vm.controls()) {
    return m('.controls', [
      m('ul', [
        m('li', [
          m('a', {onclick: modal.vm.close, href: '#', class: 'close'}, [
            m('i', {class: 'fa fa-times'})
          ])
        ]),
      ])
    ]);
  }
}

/**
 * Modal window.
 */
modal.display = function(content) {
  return m('.modal-overlay', {id: modal.vm.display(), config: modal.vm.view}, [
    m('.modal-container', [
      modal.controls(),
      m('.modal', [
        content
      ])
    ])
  ]);
}

/**
 * Modal view.
 */
modal.view = function(ctrl, content) {
  if (modal.vm.display() == ctrl.id) {
    return modal.display(content)
  }
};

module.exports = modal;
},{}],2:[function(require,module,exports){
/**
 * @file
 * home.js
 *
 * This example was inspired by the wonderful work of Brendan Callahan
 * @ref, https://dribbble.com/shots/2035187-racks-on-racks-on-racks
 */

var ui = require('popmotion');
var modal = require('./components/mithril.modal.js');
var home = {};

/**
 * Display the border triangle pattern example.
 *
 * @todo, moe cool stuff, rotate effect
 * @todo, moe patterns.
 */
home.vm = (function() {
  var vm = {
    count: 0,
    complete: m.prop(false)
  }

  vm.init = function() {
    vm.list = [];
  }

  vm.build = function(element, isInitialized, context) {
    if (isInitialized) return;

    // @todo, moe options, moe methods.
    var pattern = new borderPattern(element);

    vm.list = pattern.items;
    vm.complete(true); 
  }

  vm.shuffle = function(element, isInitialized, context) {
    if (isInitialized) return;

    for (var i = 0; i < element.children.length; i++) {
      var Actor = new ui.Actor({
        element: element.children[i]
      });

      var color = '';
      if (element.classList.contains('down')) {
        color = '#FEC56C';
        if (element.children[i].classList.contains('up')) {
          color = '#EA6640';

          if (element.children[i].classList.contains('in')) {
            color = '#FEC56C'; 
          }
        }
      }

      if (element.classList.contains('up')) {
        color = '#FEB841';
        if (element.children[i].classList.contains('down')) {
          color = '#F0A432';

          if (element.children[i].classList.contains('in')) {
            color = '#FEB841'; 
          }
        }
      }

      var Tween = new ui.Tween({
        values: {
          borderBottomColor: color
        }
      });

      // Display one by one...
      Tween.delay = (30 * vm.count);

      Actor.start(Tween);
      vm.count++;
    }
  }

  return vm;
}())

/**
 * Home controller.
 */
home.controller = function() {
  this.info = new modal.controller({
    id: 'info',
    page: 'onracks',
    display: false,
    controls: true
  });

  this.options = new modal.controller({
    id: 'options',
    page: 'onracks',
    display: false,
    controls: true
  });
  
  this.openModal = function(event) {
    var id = this.valueOf();
    console.log(id)
    modal.vm.open(event, id);
  }

  this.closeModal = function(event) {
    var id = this.valueOf();
    modal.vm.close(event, id);
  }

  var complete = setInterval(function() {
    if (home.vm.complete()) {
      clearTimeout(complete);
      m.redraw()
    }
  }, 2500);

  home.vm.init();
}

/**
 * Home view.
 */
home.view = function(ctrl) {
  return [
    modal.view(ctrl.info, [
      m('p', [
        'RacksOnRacks is a fun experiment using the border CSS attribute to create complex and beautiful background patterns. The pattern is created using some simple CSS, inspect the background to see the going ons. Crafted with a dash of free time and a lot love by ',
        m('a', {href: 'http://syilo.co'}, 'Syilo.co')
      ]),
      m('p', [
        'This example was inspired by the wonderful work of Brendan Callahan ',
        m('a', {href: 'https://dribbble.com/shots/2035187-racks-on-racks-on-racks'}, 'RacksOnRacksOnRacks')
      ])
    ]),
    modal.view(ctrl.options, [
      m('p', 'No methods to play with just yet.')
    ]),
    m('.page', [
      m('#stage', {config: home.vm.build, class: 'stage'}, [
        m('.message', [
          m('.container', [
            m('h1', home.vm.complete() ? 'Border Driven Background Patterns' : 'One sec...'),
            m('h2', home.vm.complete() ? 'An Experiment by Syilo' : '')
          ])
        ]),
        m('.navbar', [
          m('ul', [
            m('li', [
              m('a', {href: 'https://github.com/swim/RacksOnRacks'}, [
                m('i', {class: 'fa fa-github'})
              ]),
            ]),
            /*m('li', [
              m('a', {href: '#', onclick: ctrl.openModal.bind('options')}, [
                m('i', {class: 'fa fa-cog'})
              ]),
            ]),*/
            m('li', [
              m('a', {href: '#', onclick: ctrl.openModal.bind('info')}, [
                m('i', {class: 'fa fa-info'})
              ]),
            ])
          ])
        ]),
        home.vm.list.map(function(item) {
          return m('.triangle', {config: home.vm.shuffle, class: item.class, style: item.style}, [
            m('.item', {class: 'up'}),
            m('.item', {class: 'down'}),
            m('.item', {class: 'up in'}),
            m('.item', {class: 'down in'})
          ]);
        })
      ])
    ])
  ];
}

module.exports = home;
},{"./components/mithril.modal.js":1,"popmotion":30}],3:[function(require,module,exports){
/**
 * @file
 * route.js
 */
var home = require('./home.js');

function init() {
  m.route.mode = 'hash';

  m.route(document.getElementById('onracks'), '/', {
    '/': home,
  });
}

init();
},{"./home.js":2}],4:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Imports
var calc = require('../inc/calc');
var utils = require('../inc/utils');
var Controls = require('../controls/Controls');
var each = utils.each;

// Values
var DEFAULT_PROP = 'current';
var PRIVATE = ['onStart', 'onFrame', 'onUpdate', 'onComplete'];

var Action = (function () {

    /*
        # Action class constructor
        ## Assign default properties of Action or extended class and set user-defined props
         @param [object]
    */

    function Action(props) {
        var _this = this;

        _classCallCheck(this, Action);

        each(this.getDefaultProps(), function (key, value) {
            _this[key] = value;
        });

        this.values = {};
        this.set(props, this.getDefaultValueProp());
    }

    /*
        # Set Action properties
        ## Set user-defined Action properties
         @param [object]
        @param [string]: Name of default value property (set when `value` is **not** provided as object)
        @return [Action]
    */

    Action.prototype.set = function set() {
        var _this2 = this;

        var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var defaultProp = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_PROP : arguments[1];

        // Loop through non-`value` properties and set
        each(props, function (key, value) {
            if (key !== 'values') {
                _this2[key] = value;
            }
        });

        // Merge `value` properties with existing
        if (props.values) {
            (function () {
                var currentValues = _this2.values;

                each(props.values, function (key, value) {
                    var existingValue = currentValues[key];
                    var newValue = {};

                    if (utils.isObj(value)) {
                        newValue = value;
                    } else {
                        newValue[defaultProp] = value;
                    }

                    currentValues[key] = existingValue ? utils.merge(existingValue, newValue) : newValue;
                });
            })();
        }

        return this;
    };

    /*
        # Process latest `current` value
        ## Actions performs existing `current` value
         @param [Actor]
        @param [object]
        @return [number]
    */

    Action.prototype.process = function process(actor, value) {
        return value.current;
    };

    /*
        # Has Action ended?
        ## Returns `true` to end Action (Action only fires once).
        
        @return [boolean]
    */

    Action.prototype.hasEnded = function hasEnded() {
        return true;
    };

    /*
        # Limit value to within set parameters
        ## Return value within min/max, with outlying values multiplied by `escapeAmp`
         @param [number]
        @param [object] { min: number, max: number, escapeAmp: factor }
        @return [number]
    */

    Action.prototype.limit = function limit(output, value) {
        var restricted = calc.restricted(output, value.min, value.max);
        var escapeAmp = value.escapeAmp !== undefined ? value.escapeAmp : 0;

        return restricted + (output - restricted) * escapeAmp;
    };

    /*
        # Get Controls class for this Action
        ## Inherited Actions may return different Controls class
         @return [Controls]
    */

    Action.prototype.getControls = function getControls() {
        return Controls;
    };

    /*
        # Get default Action properties
         @return [object]
    */

    Action.prototype.getDefaultProps = function getDefaultProps() {
        return {};
    };

    /*
        # Get default Action value properties
         @return [object]
    */

    Action.prototype.getDefaultValue = function getDefaultValue() {
        return {};
    };

    /*
        # Get default Action value property name
        ## Set this `value` property when set as value instead of object
         @return [string]
    */

    Action.prototype.getDefaultValueProp = function getDefaultValueProp() {
        return DEFAULT_PROP;
    };

    /*
        # Get set properties
        ## Get user-set properties for this Action
         @return [object]
    */

    Action.prototype.getSet = function getSet() {
        var _this3 = this;

        var set = { values: this.values };

        each(this, function (key, prop) {
            if (_this3.hasOwnProperty(key) && PRIVATE.indexOf(key) === -1) {
                set[key] = prop;
            }
        });

        return set;
    };

    /*
        # Extend this Action with new properties
        ## Returns new instance of this Action's `prototype` with existing and new properties
         @param [object] (optional)
        @return [Action]
    */

    Action.prototype.extend = function extend(props) {
        return new this.constructor(utils.merge(this, props), this.getDefaultValueProp());
    };

    /*
        # Get a new playable version of this Action
         @return [Action]
    */

    Action.prototype.getPlayable = function getPlayable() {
        return this.extend();
    };

    /*
        # Activate this Action
         @return [Action]
    */

    Action.prototype.activate = function activate() {
        this.isActive = true;
        return this;
    };

    /*
        # Deactivate this Action
         @return [Action]
    */

    Action.prototype.deactivate = function deactivate() {
        this.isActive = false;
        return this;
    };

    return Action;
})();

module.exports = Action;

},{"../controls/Controls":20,"../inc/calc":23,"../inc/utils":26}],5:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Imports
var Action = require('./Action');
var calc = require('../inc/calc');
var utils = require('../inc/utils');
var simulations = require('./simulate/simulations');

// Values
var DEFAULT_PROP = 'velocity';

var Simulate = (function (_Action) {
    _inherits(Simulate, _Action);

    /*
        # Simulate class constructor
        ## Sets parent Action class and then default Simulate properties
         @param [object]
    */

    function Simulate() {
        _classCallCheck(this, Simulate);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, _Action.call.apply(_Action, [this].concat(args)));

        _this.calculatesVelocity = true;
        _this.inactiveFrames = 0;
        return _this;
    }

    /*
        # Get default Simulate props
         @return [object]
    */

    Simulate.prototype.getDefaultProps = function getDefaultProps() {
        return {
            autoEnd: true,
            maxInactiveFrames: 3
        };
    };

    /*
        # Get default Simulate value props
         @return [object]
    */

    Simulate.prototype.getDefaultValue = function getDefaultValue() {
        return {
            // [string]: Simulation to .run
            simulate: DEFAULT_PROP,

            // [number]: Acceleration to apply to value, in units per second
            acceleration: 0,

            // [number]: Factor to multiply velocity by on bounce
            bounce: 0,

            // [number]: Spring strength during 'string'
            spring: 80,

            // [number]: Timeconstant of glide
            timeConstant: 395,

            // [number]: Stop simulation under this speed
            stopSpeed: 0.0001,

            // [boolean]: Capture with spring physics on limit breach
            capture: false,

            // [number]: Friction to apply per frame
            friction: 0,

            to: 0,
            round: false
        };
    };

    /*
        # Get default Simulate value property name
        ## Set values to this when a `value` is not provided as an object
         @return [string]
    */

    Simulate.prototype.getDefaultValueProp = function getDefaultValueProp() {
        return DEFAULT_PROP;
    };

    /*
        # Method to fire when Action starts
        ## Set `started` to current time.
    */

    Simulate.prototype.onStart = function onStart() {
        this.started = utils.currentTime();
    };

    /*
        # Fire at start of every frame
        ## Set `hasChanged` to false
    */

    Simulate.prototype.onFrameStart = function onFrameStart() {
        this.hasChanged = false;
    };

    /*
        # Simulate the `value`s per-frame movement
        
        @param [Actor]
        @param [Value]: Current value
        @param [string]: Key of current value
        @param [number]: Duration of frame in ms
        @return [number]: Calculated value
    */

    Simulate.prototype.process = function process(actor, value, key, timeSinceLastFrame) {
        var current = value.current;
        var simulate = value.simulate;
        var newValue = current;

        // If string, use in-built simulation otherwise treat as function
        var simulation = utils.isString(simulate) ? simulations[simulate] : simulate;

        var newVelocity = simulation ? simulation(value, timeSinceLastFrame, this.started) : 0;

        value.velocity = Math.abs(newVelocity) >= value.stopSpeed ? newVelocity : 0;

        newValue = value.current + calc.speedPerFrame(value.velocity, timeSinceLastFrame);

        if (newValue !== current) {
            this.hasChanged = true;
        }

        return newValue;
    };

    /*
        # Has this action ended?
        ## Use a framecounter to see if Action has changed in the last x frames
        and declare ended if not
        
        @param [Actor]
        @return [boolean]: Has Action ended?
    */

    Simulate.prototype.hasEnded = function hasEnded(actor) {
        var ended = false;

        if (this.autoEnd) {
            this.inactiveFrames = this.hasChanged ? 0 : this.inactiveFrames + 1;
            ended = this.inactiveFrames > actor.maxInactiveFrames;
        }

        return ended;
    };

    /*
        # Limit output to value range, if any
        ## If velocity is at or more than range, and value has a bounce property,
        run the bounce simulation
        
        @param [number]: Calculated output
        @param [Value]: Current Value
        @return [number]: Limit-adjusted output
    */

    Simulate.prototype.limit = function limit(output, value) {
        var isOutsideMax = output >= value.max;
        var isOutsideMin = output <= value.min;
        var isOutsideRange = isOutsideMax || isOutsideMin;

        if (isOutsideRange) {
            output = calc.restricted(output, value.min, value.max);

            if (value.bounce) {
                value.velocity = simulations.bounce(value);
            } else if (value.capture) {
                simulations.capture(value, isOutsideMax ? value.max : value.min);
            }
        }

        return output;
    };

    return Simulate;
})(Action);

module.exports = Simulate;

},{"../inc/calc":23,"../inc/utils":26,"./Action":4,"./simulate/simulations":9}],6:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Action = require('./Action'),
    Pointer = require('../input/Pointer'),
    calc = require('../inc/calc');

var Track = (function (_Action) {
    _inherits(Track, _Action);

    function Track() {
        _classCallCheck(this, Track);

        return _possibleConstructorReturn(this, _Action.apply(this, arguments));
    }

    /*
        Update input offset
    */

    Track.prototype.onFrameStart = function onFrameStart(actor, frameDuration, framestamp) {
        actor.state.input = this.input.onFrame(framestamp);
        this.inputOffset = calc.offset(this.inputOrigin, this.input.current);
        this.frameDuration = frameDuration;
    };

    /*
        Move Value relative to Input movement
        
        @param [Value]: Current value
        @param [string]: Key of current value
        @return [number]: Calculated value
    */

    Track.prototype.process = function process(actor, value, key) {
        var newValue = value.current;

        if (this.inputOffset.hasOwnProperty(key)) {
            newValue = value.direct ? this.input.current[key] : value.origin + this.inputOffset[key] * value.amp;
        }

        return newValue;
    };

    /*
        Has this Action ended? 
        
        @return [boolean]: False to make user manually finish .track()
    */

    Track.prototype.hasEnded = function hasEnded() {
        return false;
    };

    Track.prototype.deactivate = function deactivate() {
        _Action.prototype.deactivate.call(this);

        if (this.input && this.input.stop) {
            this.input.stop();
        }

        return this;
    };

    Track.prototype.bindInput = function bindInput(input) {
        this.input = !input.current ? new Pointer(input) : input;
        this.inputOrigin = this.input.get();
    };

    Track.prototype.getDefaultValue = function getDefaultValue() {
        return {
            amp: 1,
            escapeAmp: 0,
            direct: false,
            smooth: 0
        };
    };

    return Track;
})(Action);

module.exports = Track;

},{"../inc/calc":23,"../input/Pointer":28,"./Action":4}],7:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Action = require('./Action');
var calc = require('../inc/calc');
var utils = require('../inc/utils');
var presetEasing = require('./tween/preset-easing');
var valueOps = require('../actor/value-operations');
var TweenControls = require('./tween/TweenControls');
var each = utils.each;

var COUNT = 'count';
var NEXT_STEPS = {
    loop: 'restart',
    yoyo: 'reverse',
    flip: 'flipValues'
};

/*
    Ease value within ranged parameters
    
    @param [number]: Progress between 0 and 1
    @param [number]: Value of 0 progress
    @param [number]: Value of 1 progress
    @param [string || function]: Name of preset easing
        to use or generated easing function
    @return [number]: Value of eased progress in range
*/
function ease(progress, from, to, ease) {
    var progressLimited = calc.restricted(progress, 0, 1);
    var easingFunction = utils.isString(ease) ? presetEasing[ease] : ease;

    return calc.valueEased(progressLimited, from, to, easingFunction);
};

var Tween = (function (_Action) {
    _inherits(Tween, _Action);

    function Tween() {
        _classCallCheck(this, Tween);

        return _possibleConstructorReturn(this, _Action.apply(this, arguments));
    }

    Tween.prototype.getControls = function getControls() {
        return TweenControls;
    };

    Tween.prototype.getDefaultProps = function getDefaultProps() {
        return {
            delay: 0,
            dilate: 1,
            duration: 300,
            loop: false,
            yoyo: false,
            flip: false,
            playDirection: 1,
            ended: false,
            elapsed: 0
        };
    };

    Tween.prototype.getDefaultValue = function getDefaultValue() {
        return {
            delay: 0,
            duration: 300,
            ease: 'easeOut',
            stagger: 0,
            steps: 0,
            to: 0,
            round: false
        };
    };

    Tween.prototype.getDefaultValueProp = function getDefaultValueProp() {
        return 'to';
    };

    /*
        Update Action elapsed time
        
        @param [object]: Action properties
        @param [number]: Timestamp of current frame
    */

    Tween.prototype.onFrameStart = function onFrameStart(actor, frameDuration) {
        this.elapsed = this.elapsed || 0;

        if (frameDuration) {
            this.elapsed += frameDuration * actor.dilate * this.playDirection;
            this.ended = true;
        }
    };

    /*
        Calculate progress of value based on time elapsed,
        value delay/duration/stagger properties
         @param [Actor]
        @param [object]: Value state and properties
        @return [number]: Calculated value
    */

    Tween.prototype.process = function process(actor, value) {
        var target = value.to;
        var progressTarget = this.playDirection === 1 ? 1 : 0;
        var newValue = value.current;

        // If this value has a to property, otherwise we just return current value
        if (target !== undefined) {
            var progress = calc.restricted(calc.progress(this.elapsed - value.delay, 0, value.duration) - value.stagger, 0, 1);

            // Mark Action as NOT ended if still in progress
            if (progress !== progressTarget) {
                this.ended = false;
            }

            // Step progress if we're stepping
            if (value.steps) {
                progress = utils.stepProgress(progress, value.steps);
            }

            // Ease value
            newValue = ease(progress, value.origin, target, value.ease);
        }

        return newValue;
    };

    /*
        If this tween has ended, check if we loop/yoyo/flip
        
        @return [boolean]: Has this tween really really ended?
    */

    Tween.prototype.hasEnded = function hasEnded(actor) {
        var _this2 = this;

        var ended = this.ended;

        if (ended) {
            each(NEXT_STEPS, function (name, methodName) {
                if (_this2.checkNextStep(actor, name, _this2[methodName])) {
                    ended = false;
                    actor.hasChanged = true;
                    return false;
                }
            });
        }

        // Reset `ended`
        this.ended = false;

        return ended;
    };

    Tween.prototype.checkNextStep = function checkNextStep(actor, name, method) {
        var step = this[name];
        var forever = step === true;
        var count = this[name + COUNT] || 0;
        var stepTaken = false;

        if (forever || utils.isNum(step)) {
            ++count;
            this[name + COUNT] = count;

            if (forever || count <= step) {
                method.call(this, actor);
                stepTaken = true;
            }
        }

        return stepTaken;
    };

    Tween.prototype.flipValues = function flipValues(actor) {
        var actorValues = actor.values;
        this.elapsed = this.duration - this.elapsed;

        each(this.values, function (key) {
            var value = actorValues[key];

            if (value.children) {
                each(value.children, function (childKey) {
                    valueOps.flip(actorValues[key + childKey]);
                });
            }

            valueOps.flip(value);
        });
    };

    Tween.prototype.reverse = function reverse() {
        this.playDirection *= -1;
    };

    Tween.prototype.restart = function restart() {
        this.elapsed = this.playDirection === 1 ? 0 : this.duration;
        this.started = utils.currentTime();
    };

    return Tween;
})(Action);

module.exports = Tween;

},{"../actor/value-operations":19,"../inc/calc":23,"../inc/utils":26,"./Action":4,"./tween/TweenControls":12,"./tween/preset-easing":14}],8:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Action = require('./Action'),
    calc = require('../inc/calc'),
    isString = require('../inc/utils').isString,

/*
    Translate our mapLink value into mapTo
    
    @param [number]: Calculated value from linked value
    @param [Value || object]: Linked value or empty object if we're linking to input
    @param [array]: List of numbers relating to linked value
    @param [array]: List of numbers relating to this value
*/
findMappedValue = function (newValue, linkedValue, toValue, mapLink, mapTo) {
    var mapLength = mapLink.length,
        i = 1,
        lastLinkValue,
        thisLinkValue,
        lastToValue,
        thisToValue;

    for (; i < mapLength; i++) {
        // Assign values from array, or if they're strings, look for them in linkedValue
        lastLinkValue = isString(mapLink[i - 1]) ? linkedValue[mapLink[i - 1]] : mapLink[i - 1];
        thisLinkValue = isString(mapLink[i]) ? linkedValue[mapLink[i]] : mapLink[i];
        lastToValue = isString(mapTo[i - 1]) ? toValue[mapTo[i - 1]] : mapTo[i - 1];
        thisToValue = isString(mapTo[i]) ? toValue[mapTo[i]] : mapTo[i];

        // Check if we've gone past our calculated value, or if we're at the end of the array
        if (newValue < thisLinkValue || i === mapLength - 1) {
            newValue = calc.value(calc.restricted(calc.progress(newValue, lastLinkValue, thisLinkValue), 0, 1), lastToValue, thisToValue);
            break;
        }
    }

    return newValue;
};

var Watch = (function (_Action) {
    _inherits(Watch, _Action);

    function Watch() {
        _classCallCheck(this, Watch);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, _Action.call.apply(_Action, [this].concat(args)));

        _this.isActive = true;
        return _this;
    }

    /*
        Process this value
        
        First check if this value exists as a Value, if not
        check within Input (if we have one)
            
        @param [Actor]
        @param [Value]: Current value
        @param [string]: Key of current value
        @return [number]: Calculated value
    */

    Watch.prototype.process = function process(actor, value, key) {
        var watchedKey = value.watch;
        var watchedValue = 0;
        var values = actor.values;
        var newValue = value.current;
        var inputOffset = value.action ? value.action.inputOffset : false;

        if (isString(watchedKey)) {
            watchedValue = values[watchedKey] ? values[watchedKey] : {};

            // First look at Action and check value isn't linking itself
            if (watchedValue.current !== undefined && key !== watchedKey) {
                newValue = watchedValue.current;

                // Then check values in Input
            } else if (inputOffset && inputOffset.hasOwnProperty(watchedKey)) {
                    newValue = value.action.process(actor, value, watchedKey);
                }
        } else {
            newValue = watchedKey(actor);
        }

        // If we have mapFrom and mapTo properties, translate the new value
        if (value.mapFrom && value.mapTo) {
            newValue = findMappedValue(newValue, watchedValue, value, value.mapFrom, value.mapTo);
        }

        return newValue;
    };

    return Watch;
})(Action);

module.exports = Watch;

},{"../inc/calc":23,"../inc/utils":26,"./Action":4}],9:[function(require,module,exports){
"use strict";

var calc = require('../../inc/calc'),
    utils = require('../../inc/utils'),
    speedPerFrame = calc.speedPerFrame;

/*
    Add core physics simulations
*/
var simulations = {
    /*
        Velocity
        
        The default .run() simulation.
        
        Applies any set deceleration and acceleration to existing velocity
    */
    velocity: function (value, duration) {
        value.velocity = value.velocity + speedPerFrame(value.acceleration, duration);

        return simulations.friction(value, duration);
    },

    /*
        Glide
        
        Emulates touch device scrolling effects with exponential decay
        http://ariya.ofilabs.com/2013/11/javascript-kinetic-scrolling-part-2.html
    */
    glide: function (value, duration, started) {
        var timeUntilFinished = -utils.currentTime() - started,
            delta = -value.to * Math.exp(timeUntilFinished / value.timeConstant);

        return value.to + delta - value.current;
    },

    /*
        Friction
         Apply friction to the current value
        TODO: Make this framerate-independent
    */
    friction: function (value, duration) {
        var newVelocity = speedPerFrame(value.velocity, duration) * (1 - value.friction);

        return calc.speedPerSecond(newVelocity, duration);
    },

    spring: function (value, duration) {
        var distance = value.to - value.current;

        value.velocity += distance * speedPerFrame(value.spring, duration);

        return simulations.friction(value, duration);
    },

    bounce: function (value) {
        var distance = 0,
            to = value.to,
            current = value.current,
            bounce = value.bounce;

        // If we're using glide simulation we have to flip our target too
        if (value.simulate === 'glide') {
            distance = to - current;
            value.to = current - distance * bounce;
        }

        return value.velocity *= -bounce;
    },

    capture: function (value, target) {
        value.to = target;
        value.simulate = 'spring';
        value.capture = value.min = value.max = undefined;
    }
};

module.exports = simulations;

},{"../../inc/calc":23,"../../inc/utils":26}],10:[function(require,module,exports){
/*
    Bezier function generator
        
    Gaëtan Renaudeau's BezierEasing
    https://github.com/gre/bezier-easing/blob/master/index.js  
    https://github.com/gre/bezier-easing/blob/master/LICENSE
    You're a hero
    
    Use
    
        var easeOut = new Bezier(.17,.67,.83,.67),
            x = easeOut(0.5); // returns 0.627...
*/
"use strict";

var NEWTON_ITERATIONS = 8,
    NEWTON_MIN_SLOPE = 0.001,
    SUBDIVISION_PRECISION = 0.0000001,
    SUBDIVISION_MAX_ITERATIONS = 10,
    K_SPLINE_TABLE_SIZE = 11,
    K_SAMPLE_STEP_SIZE = 1.0 / (K_SPLINE_TABLE_SIZE - 1.0),
    FLOAT_32_SUPPORTED = typeof Float32Array !== 'undefined',
    a = function (a1, a2) {
    return 1.0 - 3.0 * a2 + 3.0 * a1;
},
    b = function (a1, a2) {
    return 3.0 * a2 - 6.0 * a1;
},
    c = function (a1) {
    return 3.0 * a1;
},
    getSlope = function (t, a1, a2) {
    return 3.0 * a(a1, a2) * t * t + 2.0 * b(a1, a2) * t + c(a1);
},
    calcBezier = function (t, a1, a2) {
    return ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t;
},

/*
    Bezier constructor
*/
Bezier = function (mX1, mY1, mX2, mY2) {
    var sampleValues = FLOAT_32_SUPPORTED ? new Float32Array(K_SPLINE_TABLE_SIZE) : new Array(K_SPLINE_TABLE_SIZE),
        _precomputed = false,
        binarySubdivide = function (aX, aA, aB) {
        var currentX,
            currentT,
            i = 0;

        do {
            currentT = aA + (aB - aA) / 2.0;
            currentX = calcBezier(currentT, mX1, mX2) - aX;
            if (currentX > 0.0) {
                aB = currentT;
            } else {
                aA = currentT;
            }
        } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

        return currentT;
    },
        newtonRaphsonIterate = function (aX, aGuessT) {
        var i = 0,
            currentSlope = 0.0,
            currentX;

        for (; i < NEWTON_ITERATIONS; ++i) {
            currentSlope = getSlope(aGuessT, mX1, mX2);

            if (currentSlope === 0.0) {
                return aGuessT;
            }

            currentX = calcBezier(aGuessT, mX1, mX2) - aX;
            aGuessT -= currentX / currentSlope;
        }

        return aGuessT;
    },
        calcSampleValues = function () {
        for (var i = 0; i < K_SPLINE_TABLE_SIZE; ++i) {
            sampleValues[i] = calcBezier(i * K_SAMPLE_STEP_SIZE, mX1, mX2);
        }
    },
        getTForX = function (aX) {
        var intervalStart = 0.0,
            currentSample = 1,
            lastSample = K_SPLINE_TABLE_SIZE - 1,
            dist = 0.0,
            guessForT = 0.0,
            initialSlope = 0.0;

        for (; currentSample != lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
            intervalStart += K_SAMPLE_STEP_SIZE;
        }

        --currentSample;

        dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
        guessForT = intervalStart + dist * K_SAMPLE_STEP_SIZE;

        initialSlope = getSlope(guessForT, mX1, mX2);

        // If slope is greater than min
        if (initialSlope >= NEWTON_MIN_SLOPE) {
            return newtonRaphsonIterate(aX, guessForT);
            // Slope is equal to min
        } else if (initialSlope === 0.0) {
                return guessForT;
                // Slope is less than min
            } else {
                    return binarySubdivide(aX, intervalStart, intervalStart + K_SAMPLE_STEP_SIZE);
                }
    },
        precompute = function () {
        _precomputed = true;
        if (mX1 != mY1 || mX2 != mY2) {
            calcSampleValues();
        }
    },

    /*
        Generated function
        
        Returns value 0-1 based on X
    */
    f = function (aX) {
        var returnValue;

        if (!_precomputed) {
            precompute();
        }

        // If linear gradient, return X as T
        if (mX1 === mY1 && mX2 === mY2) {
            returnValue = aX;

            // If at start, return 0
        } else if (aX === 0) {
                returnValue = 0;

                // If at end, return 1
            } else if (aX === 1) {
                    returnValue = 1;
                } else {
                    returnValue = calcBezier(getTForX(aX), mY1, mY2);
                }

        return returnValue;
    };

    return f;
};

module.exports = Bezier;

},{}],11:[function(require,module,exports){
'use strict';

var Bezier = require('./Bezier'),

/*
    Mirror easing
    
    Mirrors the provided easing function, used here for mirroring an
    easeIn into an easeInOut
    
    @param [number]: Progress, from 0 - 1, of current shift
    @param [function]: The easing function to mirror
    @returns [number]: The easing-adjusted delta
*/
mirrorEasing = function (method) {
    return function (progress, strength) {
        return progress <= 0.5 ? method(2 * progress, strength) / 2 : (2 - method(2 * (1 - progress), strength)) / 2;
    };
},

/*
    Reverse easing
    
    Reverses the output of the provided easing function, used for flipping easeIn
    curve to an easeOut.
    
    @param [number]: Progress, from 0 - 1, of current shift
    @param [function]: The easing function to reverse
    @returns [number]: The easing-adjusted delta
*/
reverseEasing = function (method) {
    return function (progress, strength) {
        return 1 - method(1 - progress, strength);
    };
};

/*
    Easing class

    If provided easing function, returns easing function with 
    in/out/inOut variations

    If provided four arguments, returns new Bezier class instead.
*/
var Easing = function (x1, y1, x2, y2) {
    var method = x1,
        easingFunction;

    // If this is a bezier curve, return a bezier function
    if (arguments.length > 1) {
        easingFunction = new Bezier(x1, y1, x2, y2);
    } else {
        easingFunction = function (progress, strength) {
            return method(progress, strength);
        };
        easingFunction.in = function (progress, strength) {
            return method(progress, strength);
        };
        easingFunction.out = reverseEasing(method);
        easingFunction.inOut = mirrorEasing(method);
    }

    return easingFunction;
};

module.exports = Easing;

},{"./Bezier":10}],12:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Controls = require('../../controls/Controls');

var TweenControls = (function (_Controls) {
    _inherits(TweenControls, _Controls);

    function TweenControls() {
        _classCallCheck(this, TweenControls);

        return _possibleConstructorReturn(this, _Controls.apply(this, arguments));
    }

    TweenControls.prototype.restart = function restart() {
        this.restoreOrigins();
        this.action.restart();
        return this;
    };

    TweenControls.prototype.reverse = function reverse() {
        this.restoreOrigins();
        this.action.reverse();
        return this;
    };

    TweenControls.prototype.seek = function seek(progress) {
        if (!this.actor.hasAction(this.id)) {
            this.start().pause();
        }

        this.action.elapsed = this.action.duration * progress;

        if (!this.action.isActive) {
            this.action.activate();
            this.actor.process.fire();
            this.action.deactivate();
        }

        return this;
    };

    return TweenControls;
})(Controls);

module.exports = TweenControls;

},{"../../controls/Controls":20}],13:[function(require,module,exports){
"use strict";

module.exports = function (easing) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return function (progress) {
    return easing.apply(undefined, [progress].concat(args));
  };
};

},{}],14:[function(require,module,exports){
'use strict';

/*
    Easing functions
    ----------------------------------------
    
    Generates and provides easing functions based on baseFunction definitions
    
    A call to easingFunction.get('functionName') returns a function that can be passed:
        @param [number]: Progress 0-1
        @param [number] (optional): Amp modifier, only accepted in some easing functions
                                    and is used to adjust overall strength
        @return [number]: Eased progress
        
    We can generate new functions by sending an easing function through easingFunction.extend(name, method).
    Which will make nameIn, nameOut and nameInOut functions available to use.
        
    Easing functions from Robert Penner
    http://www.robertpenner.com/easing/
        
    Bezier curve interpretor created from Gaëtan Renaudeau's original BezierEasing  
    https://github.com/gre/bezier-easing/blob/master/index.js  
    https://github.com/gre/bezier-easing/blob/master/LICENSE

    Anticipate easing created by Elliot Gino
    https://twitter.com/ElliotGeno
*/
// Imports
var Easing = require('./Easing');
var utils = require('../../inc/utils');

// Values
var DEFAULT_BACK_STRENGTH = 1.525;
var DEFAULT_POW_STRENGTH = 2;

// Utility functions
var generatePowerEasing = function (strength) {
    return function (progress, strength) {
        return baseEasing.ease(progress, strength);
    };
};

/*
    Each of these base functions is an easeIn
    
    On init, we use .mirror and .reverse to generate easeInOut and
    easeOut functions respectively.
*/
var baseEasing = {
    ease: function (progress) {
        var strength = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_POW_STRENGTH : arguments[1];
        return Math.pow(progress, strength);
    },
    circ: function (progress) {
        return 1 - Math.sin(Math.acos(progress));
    },
    back: function (progress) {
        var strength = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_BACK_STRENGTH : arguments[1];
        return progress * progress * ((strength + 1) * progress - strength);
    }
};

['cubic', 'quart', 'quint'].forEach(function (easingName, i) {
    baseEasing[easingName] = generatePowerEasing(i + 3);
});

// Generate in/out/inOut variations
utils.each(baseEasing, function (key, baseEase) {
    var easingFunction = new Easing(baseEase);
    baseEasing[key + 'In'] = easingFunction.in;
    baseEasing[key + 'Out'] = easingFunction.out;
    baseEasing[key + 'InOut'] = easingFunction.inOut;
});

baseEasing.linear = function (progress) {
    return progress;
};
baseEasing.anticipate = function (progress) {
    var strength = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_BACK_STRENGTH : arguments[1];
    return (progress *= 2) < 1 ? 0.5 * baseEasing.backIn(progress, strength) : 0.5 * (2 - Math.pow(2, -10 * (progress - 1)));
};

module.exports = baseEasing;

},{"../../inc/utils":26,"./Easing":11}],15:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Process = require('../process/Process'),
    Queue = require('../inc/Queue'),
    utils = require('../inc/utils'),
    select = require('../inc/select-dom'),
    valueOps = require('./value-operations'),

/*
    Process methods
*/
update = require('./update'),
    render = require('./render'),
    postRender = require('./post-render'),

/*
    Role imports
*/
defaultRole = require('../roles/defaultRole'),
    cssRole = require('../roles/css/cssRole'),
    svgRole = require('../roles/svg/svgRole'),
    drawPathRole = require('../roles/path/drawPathRole'),
    Action = require('../actions/Action'),
    each = utils.each;

var Actor = (function () {

    /*
        @param [object]
    */

    function Actor() {
        var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Actor);

        var props = utils.isString(opts) ? { element: opts } : opts;

        this.values = {};
        this.state = { values: {} };
        this.queue = new Queue();
        this.process = new Process({ update: update, render: render, postRender: postRender }, this);
        this.activeActions = {};
        this.numActive = 0;
        this.actionCounter = 0;
        this.activeValues = [];
        this.activeParents = [];
        this.isActive = false;

        // Get actual elements if this is a selector
        if (utils.isString(props.element)) {
            props.element = select(props.element)[0];
        }

        this.assignRoles(props.element, props.as, true);
        this.set(props);
        this.initRoles();
        this.sync();
    }

    /*
        Set Actor properties and values
         @param [object]
        @returns [Actor]
    */

    Actor.prototype.set = function set(opts) {
        var _this = this;

        each(opts, function (key, value) {
            if (key !== 'values' && key !== 'action') {
                _this[key] = value;
            }
        });

        if (opts && opts.values) {
            this.values = valueOps.process(this.values, opts.values, opts, 'current', this);
        }

        // Check all active actions for any that can be removed
        each(this.activeActions, function (id, action) {
            var actionIsActive = false;

            each(_this.values, function (key, value) {
                actionIsActive = value.action === action ? true : actionIsActive;
            });

            if (!actionIsActive) {
                _this.unbindAction(id);
            }
        });

        return this;
    };

    /*
        Bind Action-specific controls to Actor
         @returns [Controls]
    */

    Actor.prototype.controls = function controls(action) {
        var Controls = action.getControls();
        return new Controls(this, action.getPlayable());
    };

    /*
        Start a new Action
         @param [Action || number]
        @param [Input || event] (optional)
        @param [boolean] (optional): defined `true` if we surpress making new queue
        @returns [Controls]
    */

    Actor.prototype.start = function start(toSet, input) {
        var actionExists = utils.isNum(toSet);
        var action = actionExists ? this.getAction(toSet) : toSet.getPlayable();
        var opts = action.getSet();
        var surpressQueueClear = arguments[arguments.length - 1] === false;

        opts.action = action;

        this.set(opts);

        if (input) {
            action.bindInput(input);
        }

        if (!surpressQueueClear) {
            this.queue.clear();
        }

        // Fire all Role onStarts if not already active
        if (!this.isActive) {
            var numRoles = this.roles.length;
            for (var i = 0; i < numRoles; i++) {
                var role = this.roles[i];
                if (role.start) {
                    role.start.call(this, this);
                }
            }
        }

        // Fire new action onStart
        if (!action.isActive && action.onStart) {
            action.onStart(this, action);
        }

        this.activate();

        if (!actionExists) {
            var Controls = action.getControls();
            return new Controls(this, action, true);
        }
    };

    /*
        Pause all active Actions
         @param [int] (optional)
        @returns [Actor]
    */

    Actor.prototype.pause = function pause() {
        this.isActive = false;
        each(this.activeActions, function (id, action) {
            return action.deactivate();
        });
        this.process.stop();
        return this;
    };

    /*
        Resume all active Actions
         @param [int] (optional)
        @returns [Actor];
    */

    Actor.prototype.resume = function resume() {
        this.isActive = true;
        each(this.activeActions, function (id, action) {
            return action.activate();
        });
        this.process.start();
        return this;
    };

    /*
        Stop all active Actions
         @param [int] (optional)
        @returns [Actor]
    */

    Actor.prototype.stop = function stop() {
        var _this2 = this;

        this.pause();
        each(this.activeActions, function (id) {
            return _this2.unbindAction(id);
        });
        return this;
    };

    /*
        Toggle all active Actions
         @param [int] (optional)
        @returns [Actor]
    */

    Actor.prototype.toggle = function toggle() {
        return this.isActive ? this.pause() : this.resume();
    };

    /*
        Syncs `element` with current properties
         @returns [Actor]
    */

    Actor.prototype.sync = function sync() {
        var currentValues = {};

        utils.each(this.values, function (key, value) {
            currentValues[key] = value.current;
        });

        this.start(new Action({ values: currentValues }));
        return this;
    };

    /*
        Add a new Action to the queue
    */

    Actor.prototype.then = function then() {
        this.queue.add.apply(this.queue, arguments);
        return this;
    };

    /*
        Execute next in queue
    */

    Actor.prototype.next = function next() {
        var next = this.queue.next();

        if (next) {
            if (utils.isFunc(next[0])) {
                next[0]();
                this.next();
                // Or this is an action
            } else {
                    next.push(false);
                    this.start.apply(this, next);
                }
        } else {
            this.stop();
        }

        return this;
    };

    /*
        Assign Roles based on element and manually provided props
         @param [object]: Element
        @param [Role || array]
        @param [boolean] (optional)
    */

    Actor.prototype.assignRoles = function assignRoles(element, manualRoles, surpressInit) {
        // All Actors get a default Role that handles user callbacks
        this.roles = [defaultRole];

        // Auto-assign if no manually-set Roles
        if (!manualRoles && element) {
            this.autoAssignRoles(element);

            // Or manually set if provided
        } else if (manualRoles) {
                if (utils.isArray(manualRoles)) {
                    this.roles.push.apply(this.roles, manualRoles);
                } else {
                    this.roles.push(manualRoles);
                }
            }

        if (!surpressInit) {
            this.initRoles();
        }
    };

    /*
        Automatically assign Roles based on element, designed
        to be extended
         @param [object]: Element
    */

    Actor.prototype.autoAssignRoles = function autoAssignRoles(element) {
        // Add CSS role if HTMLElement
        if (element instanceof HTMLElement || element.tagName === 'svg') {
            this.roles.push(cssRole);

            // Add SVG role if SVG element
        } else if (element instanceof SVGElement) {
                this.roles.push(svgRole);

                // Add Draw Path role if path element
                if (element.tagName === 'path') {
                    this.roles.push(drawPathRole);
                }
            }
    };

    /*
        Fire init callbacks
    */

    Actor.prototype.initRoles = function initRoles() {
        var _this3 = this;

        // Fire init callback
        this.roles.forEach(function (role) {
            if (role.init) {
                role.init.call(_this3, _this3);
            }
        });
    };

    Actor.prototype.activate = function activate() {
        if (!this.isActive) {
            this.isActive = true;
            this.firstFrame = true;
            this.process.start();
        }
    };

    /*
        Bind Action and return its table id
         @param [Action]
        @returns [int]
    */

    Actor.prototype.bindAction = function bindAction(action, id) {
        if (id === undefined) {
            id = this.actionCounter++;
        }

        if (!this.hasAction(id)) {
            this.activeActions[id] = action;
            this.numActive++;
        }

        return id;
    };

    Actor.prototype.unbindAction = function unbindAction(id) {
        if (this.activeActions.hasOwnProperty(id)) {
            var action = this.activeActions[id];
            if (action.input && action.input.autoStop === true) {
                action.input.stop();
            }
            action.deactivate();
            this.numActive--;
            delete this.activeActions[id];
        }

        if (!this.numActive) {
            this.pause();
        }
    };

    Actor.prototype.getAction = function getAction(id) {
        return this.activeActions[id];
    };

    Actor.prototype.hasAction = function hasAction(id) {
        return this.getAction(id) !== undefined;
    };

    /*
        Update processing order
        
        @param [string]
        @param [boolean]
        @param [boolean]
    */

    Actor.prototype.updateOrder = function updateOrder(key, moveToBack, hasChildren) {
        var order = !hasChildren ? this.activeValues : this.activeParents,
            position = order.indexOf(key);

        // If key isn't list or moveToBack is set to true, add key
        if (position === -1 || moveToBack) {
            order.push(key);

            // If key already exists, remove
            if (position > -1) {
                order.splice(position, 1);
            }
        }
    };

    // [boolean]: Is this Actor active?

    _createClass(Actor, [{
        key: 'isActive',
        get: function () {
            return this._isActive;
        }

        // Set hasChanged to true is this is now active
        ,
        set: function (status) {
            if (status === true) {
                this.hasChanged = status;
            }

            this._isActive = status;
        }
    }]);

    return Actor;
})();

module.exports = Actor;

},{"../actions/Action":4,"../inc/Queue":22,"../inc/select-dom":25,"../inc/utils":26,"../process/Process":32,"../roles/css/cssRole":39,"../roles/defaultRole":43,"../roles/path/drawPathRole":44,"../roles/svg/svgRole":47,"./post-render":16,"./render":17,"./update":18,"./value-operations":19}],16:[function(require,module,exports){
'use strict';

var utils = require('../inc/utils');
var each = utils.each;

/*
    Check all Actions for `onEnd`, return true if all are true

    @param [Actor]
    @param [boolean]
    @returns [boolean]
*/
var checkAllActionsHaveEnded = function (actor, hasChanged) {
    var hasEnded = true;
    var values = actor.state.values;

    each(actor.activeActions, function (key, action) {
        // Return if action has been deleted elsewhere
        if (!action) {
            return;
        }

        if (action.onFrame) {
            action.onFrame.call(actor, values, actor, action);
        }

        if (action.onUpdate && hasChanged) {
            action.onUpdate.call(actor, values, actor, action);
        }

        if (action.hasEnded && action.hasEnded(actor) === false) {
            hasEnded = false;
        } else {
            if (action.onComplete) {
                action.onComplete.call(actor, actor, action);
            }
            actor.unbindAction(key);
        }
    });

    return hasEnded;
};

module.exports = function (actor, framestamp) {
    if (actor.isActive) {
        actor.isActive = false;

        if (checkAllActionsHaveEnded(actor, actor.hasChanged)) {
            var numRoles = actor.roles.length;

            // Fire `complete` callbacks
            for (var i = 0; i < numRoles; i++) {
                var role = actor.roles[i];
                if (role.complete) {
                    role.complete.call(actor, actor);
                }
            }

            if (!actor.isActive) {
                actor.next();
            }
        } else {
            actor.isActive = true;
            actor.firstFrame = false;
        }
    }

    actor.framestamp = framestamp;
};

},{"../inc/utils":26}],17:[function(require,module,exports){
'use strict';

var valueTypeManager = require('../value-types/manager');
var each = require('../inc/utils').each;

var createMapper = function (role, mappedValues) {
    return function (name, val) {
        return mappedValues[role.map(name)] = val;
    };
};

module.exports = function (actor) {
    var numActiveParents = actor.activeParents.length;
    var numRoles = actor.roles.length;

    // Update parent values from calculated children
    for (var i = 0; i < numActiveParents; i++) {
        var key = actor.activeParents[i];
        var value = actor.values[key];

        // Update parent value current property
        value.current = valueTypeManager[value.type].combine(actor.state[key], value.template);

        // Update state
        actor.state.values[key] = value.current;
    }

    // Fire `frame` and `update` callbacks on all Roles
    for (var i = 0; i < numRoles; i++) {
        var role = actor.roles[i];
        var mappedValues = {};

        each(actor.state.values, createMapper(role, mappedValues));

        if (role.frame) {
            role.frame.call(actor, mappedValues, actor);
        }

        if (role.update && actor.hasChanged) {
            role.update.call(actor, mappedValues, actor);
        }
    }
};

},{"../inc/utils":26,"../value-types/manager":57}],18:[function(require,module,exports){
'use strict';

var calc = require('../inc/calc');
var utils = require('../inc/utils');
var Action = require('../actions/Action');
var defaultAction = new Action();
var Watch = require('../actions/Watch');
var watcher = new Watch();

module.exports = function (actor, framestamp, frameDuration) {
    var numActiveValues = actor.activeValues.length;
    var state = actor.state;

    actor.hasChanged = false;

    for (var i = 0; i < numActiveValues; i++) {
        // Get value and key
        var key = actor.activeValues[i];
        var value = actor.values[key];
        var action = !value.action || value.action && !value.action.isActive ? defaultAction : value.action;

        // Fire action onFrameStart if not already fired
        if (action.onFrameStart && action.lastUpdate !== framestamp) {
            action.onFrameStart(actor, frameDuration, framestamp);
            action.lastUpdate = framestamp;
        }

        // Calculate new value
        var updatedValue = utils.has(value, 'watch') ? watcher.process(actor, value) : action.process(actor, value, key, frameDuration);

        // User-defined transform function
        if (value.transform) {
            updatedValue = value.transform(updatedValue, key, actor);
        }

        // Limit if actor action does that kind of thing
        if (action.limit && value.hasRange) {
            updatedValue = action.limit(updatedValue, value);
        }

        // Smooth value if we have smoothing
        if (value.smooth) {
            updatedValue = calc.smooth(updatedValue, value.current, frameDuration, value.smooth);
        }

        // Round value if round is true
        if (value.round) {
            updatedValue = Math.round(updatedValue);
        }

        // Update frameChange
        value.frameChange = updatedValue - value.current;

        // Calculate velocity if Action hasn't
        if (!action.calculatesVelocity) {
            value.velocity = calc.speedPerSecond(value.frameChange, frameDuration);
        }

        // Update current speed
        value.speed = Math.abs(value.velocity);

        // Check if value's changed
        if (value.current !== updatedValue || actor.firstFrame) {
            actor.hasChanged = true;
        }

        // Set new current
        value.current = updatedValue;
        var valueState = value.unit ? updatedValue + value.unit : updatedValue;

        // Put value in state if no parent
        if (!value.parent) {
            state.values[key] = valueState;

            // Or, add to parent state to be combined later
        } else {
                state[value.parent] = state[value.parent] || {};
                state[value.parent][value.propName] = valueState;
            }
    }
};

},{"../actions/Action":4,"../actions/Watch":8,"../inc/calc":23,"../inc/utils":26}],19:[function(require,module,exports){
'use strict';

var valueTypesManager = require('../value-types/manager'),
    calc = require('../inc/calc'),
    utils = require('../inc/utils'),
    isNum = utils.isNum,
    each = utils.each;

var numericalValues = ['current', 'to', 'min', 'max', 'velocity', 'friction', 'spring', 'acceleration'],
    numNumericalValues = numericalValues.length,
    defaultValue = {
    current: 0,
    velocity: 0,
    speed: 0,
    frameChange: 0
};

function checkNumericalValue(name) {
    return numericalValues.indexOf(name) > -1;
}

/*
    Check Role typeMaps to see if this value name has been mapped
    to a specific value type

    @param [string]
    @param [array]
    @returns [string]: Value type
*/
function checkRoles(name, roles) {
    var valueType;

    each(roles, function (key, role) {
        if (role._typeMap) {
            valueType = role._typeMap[role.map(name)] || valueType;
        }
    });

    return valueType;
}

/*
    Check value for special type

    @param [object]
    @param [object]
    @param [object]
    @param [string]
    @returns [string || false]
*/
function checkValueType(existingValue, newValue, scope, valueName) {
    var valueType;

    // Check existing value for type already set
    if (existingValue && existingValue.type) {
        valueType = existingValue.type;
    } else {
        // Or check Role _typeMap properties
        if (scope.roles) {
            valueType = checkRoles(valueName, scope.roles);
        }

        // Finally run tests
        if (!valueType && utils.isString(newValue.current)) {
            valueType = valueTypesManager.test(newValue.current);
        }
    }

    return valueType;
}

/*
    Resolve a property

    @param [string]
    @param [string || function || number]
    @param [object]
    @param [object]
    @returns [number]
*/
function resolve(name, prop, value, scope) {
    var isNumericalValue = checkNumericalValue(name);

    // If function, resolve
    if (utils.isFunc(prop) && isNumericalValue) {
        prop = prop.call(scope, scope);
    }

    // If string, check for relative numbers and units
    if (utils.isString(prop)) {
        // If relative value
        if (prop.indexOf('=') > 0) {
            prop = calc.relativeValue(value.current, prop);
        }

        // If unit
        if (isNumericalValue) {
            splitUnit(prop, value);
        }
    }

    if (isNumericalValue) {
        prop = parseFloat(prop);
    }

    return prop;
}

/*
    Split a value into sub-values

    @param [string]
    @param [object]
    @param [object]
    @param [valueTypeHandler]
    @returns [object]
*/
function split(name, value, scope, valueTypeHandler) {
    var splitValues = {},
        i = 0;

    var _loop = function () {
        var propName = numericalValues[i];
        var splitProp = {};

        if (value.hasOwnProperty(propName)) {
            var valueProp = value[propName];

            // If we need to first resolve this, resolve
            if (utils.isFunc(valueProp)) {
                valueProp = valueProp.call(scope, scope);
            }

            if (!utils.isString(valueProp)) {
                return 'continue';
            }

            splitProp = valueTypeHandler.split(valueProp);

            // Assign split properties to each child value
            each(splitProp, function (key, prop) {
                // Create new value if none exists
                splitValues[key] = splitValues[key] || utils.copy(valueTypesManager.defaultProps(value.type, key));
                splitValues[key][propName] = prop;

                if (utils.isString(splitProp[key])) {
                    splitUnit(splitValues[key][propName], splitValues[key]);
                }
            });
        }
    };

    for (; i < numNumericalValues; i++) {
        var _ret = _loop();

        if (_ret === 'continue') continue;
    }

    return splitValues;
}

/*
    Split value into number and unit, and set unit to value

    @param [string]
    @param [object]
*/
function splitUnit(property, hostValue) {
    if (utils.isNum(property)) {
        return property;
    }
    var returnVal = property;

    var _utils$splitValUnit = utils.splitValUnit(property);

    var value = _utils$splitValUnit.value;
    var unit = _utils$splitValUnit.unit;

    if (!isNaN(value)) {
        returnVal = value;
        if (unit) {
            hostValue.unit = unit;
        }
    }

    return returnVal;
}

/*
    Preprocess incoming values, splitting non-numerical values
    into sub-values ie hex

    @param [object]
    @param [object]
    @param [object]
    @param [string]
*/
function preprocess(existing, incoming, scope, defaultProp) {
    var values = {};

    each(incoming, function (key, value) {
        var existingValue = existing[key],
            newValue = {};

        if (utils.isObj(value)) {
            newValue = value;
        } else {
            newValue[defaultProp] = value;
        }

        // If value doesn't have a special type, check for one
        newValue.type = checkValueType(existingValue, newValue, scope, key);

        values[key] = newValue;

        // If we have a type property, split/assign default props
        if (newValue.type) {
            var typeHandler = valueTypesManager[newValue.type];

            // If valueType handler has a split function, split this value
            if (typeHandler.split) {
                var splitValues = split(key, newValue, scope, typeHandler);
                newValue.children = {};

                each(splitValues, function (childName, childValue) {
                    each(newValue, function (key, value) {
                        // Not great is it
                        if (key !== 'children' && key !== 'action' && childValue[key] === undefined) {
                            childValue[key] = value;
                        }
                    });

                    childValue.parent = childValue.name = key;
                    childValue.propName = childName;

                    delete childValue.type;

                    newValue.children[childName] = values[key + childName] = childValue;
                });

                if (typeHandler.template) {
                    newValue.template = existingValue ? existingValue.template : typeHandler.template(newValue.current);
                }

                // Or just assign default properties for this value
            } else {
                    values[key] = utils.merge(valueTypesManager.defaultProps(newValue.type, key), newValue);
                }
        }
    });

    return values;
}

module.exports = {

    /*
        Flip value target/origin
    */
    flip: function (value) {
        var target = value.target !== undefined ? value.target : value.current;
        value.target = value.to = value.origin;
        value.origin = target;
    },

    /*
        Merge existing and incoming values, resolving properties
        set as functions and splitting non-numerical values ie hex
         @param [object]
        @param [object]
        @param [object]
        @param [string] (optional)
        @param [object]
        @returns [object]: New values object
    */
    process: function (existing, incoming, inherit, defaultProp, scope) {
        existing = existing || {};
        defaultProp = defaultProp || 'current';
        var preprocessed = preprocess(existing, incoming, scope, defaultProp);

        each(preprocessed, function (key, value) {
            var newValue = existing[key] || utils.copy(defaultValue),
                hasChildren = value.children !== undefined,
                defaultActionValue = inherit.action ? inherit.action.getDefaultValue() : {};

            value.action = inherit.action;

            each(defaultActionValue, function (propName, defaultActionProp) {
                newValue[propName] = inherit.hasOwnProperty(propName) && !value.hasOwnProperty(propName) ? inherit[propName] : defaultActionProp;
            });

            each(value, function (valueName, valueProp) {
                // If property is not undefined or a number, resolve
                if (valueProp !== undefined && !isNum(valueProp) && !hasChildren) {
                    valueProp = resolve(valueName, valueProp, newValue, scope);
                }

                newValue[valueName] = valueProp;

                // Set internal target if this property is 'to'
                if (valueName === 'to') {
                    newValue.target = newValue.to;
                }
            });

            newValue.origin = newValue.current;
            newValue.hasRange = isNum(newValue.min) || isNum(newValue.max) ? true : false;

            existing[key] = newValue;
            scope.updateOrder(key, utils.has(newValue, 'watch'), hasChildren);
        });

        return existing;
    }
};

},{"../inc/calc":23,"../inc/utils":26,"../value-types/manager":57}],20:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var each = require('../inc/utils').each;

var Controls = (function () {
    function Controls(actor, action, hasStarted) {
        _classCallCheck(this, Controls);

        this.actor = actor;
        this.action = action;
        this.saveOrigins();

        if (hasStarted) {
            this.id = this.bindAction();
            this.action.activate();
        }
    }

    Controls.prototype.start = function start(input) {
        this.id = this.bindAction();
        this.actor.start(this.id, input);
        this.action.activate();
        return this;
    };

    Controls.prototype.stop = function stop() {
        this.actor.unbindAction(this.id);
        this.action.deactivate();

        return this;
    };

    Controls.prototype.pause = function pause() {
        this.action.deactivate();
        return this;
    };

    Controls.prototype.resume = function resume() {
        this.action.activate();
        return this;
    };

    Controls.prototype.toggle = function toggle() {
        var resume = this.actor.hasAction(this.id) ? this.resume : this.start;
        return this.action.isActive ? this.pause() : resume.call(this);
    };

    Controls.prototype.then = function then() {
        var _actor;

        (_actor = this.actor).then.apply(_actor, arguments);
        return this;
    };

    Controls.prototype.bindAction = function bindAction() {
        return this.actor.bindAction(this.action, this.id);
    };

    Controls.prototype.saveOrigins = function saveOrigins() {
        var _this = this;

        this.origins = {};

        each(this.action.values, function (key, value) {
            var actorValue = _this.actor.values[key];

            _this.origins[key] = actorValue.current;

            if (actorValue.children) {
                each(actorValue.children, function (childKey, childValue) {
                    _this.origins[key + childKey] = _this.actor.values[key + childKey].current;
                });
            }
        });
    };

    Controls.prototype.restoreOrigins = function restoreOrigins() {
        var _this2 = this;

        each(this.origins, function (key, value) {
            _this2.actor.values[key].origin = value;
        });
    };

    return Controls;
})();

module.exports = Controls;

},{"../inc/utils":26}],21:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var maxHistorySize = 3;

var History = (function () {

    /*
        History constructor
        
        @param [var]: Variable to store in first history slot
        @param [int] (optional): Maximum size of history
    */

    function History(obj) {
        var max = arguments.length <= 1 || arguments[1] === undefined ? maxHistorySize : arguments[1];

        _classCallCheck(this, History);

        this.max = max;
        this.entries = [];
        this.add(obj);
    }

    /*
        Push new var to history
        
        Shift out oldest entry if we've reached maximum capacity
        
        @param [var]: Variable to push into history.entries
    */

    History.prototype.add = function add(obj) {
        this.entries.push(obj);

        if (this.getSize() >= this.max) {
            this.entries.shift();
        }
    };

    /*
        Get variable at specified index
         @param [int]: Index
        @return [var]: Var found at specified index
    */

    History.prototype.get = function get() {
        var i = arguments.length <= 0 || arguments[0] === undefined ? this.getSize() - 1 : arguments[0];

        return this.entries[i];
    };

    /*
        Get the second newest history entry
        
        @return [var]: Entry found at index size - 2
    */

    History.prototype.getPrevious = function getPrevious() {
        return this.get(this.getSize() - 2);
    };

    /*
        Get current history size
        
        @return [int]: Current length of entries.length
    */

    History.prototype.getSize = function getSize() {
        return this.entries.length;
    };

    return History;
})();

module.exports = History;

},{}],22:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = (function () {
    function Queue() {
        _classCallCheck(this, Queue);

        this.clear();
    }

    /*
        Add a set of arguments to queue
    */

    Queue.prototype.add = function add() {
        this.queue.push([].slice.call(arguments));
    };

    /*
        Get next set of arguments from queue
    */

    Queue.prototype.next = function next() {
        var direction = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

        var queue = this.queue,
            returnVal = false,
            index = this.index;

        // If our index is between 0 and the queue length, return that item
        if (index >= 0 && index < queue.length) {
            returnVal = queue[index];
            this.index = index + direction;

            // Or clear
        } else {
                this.clear();
            }

        return returnVal;
    };

    /*
        Replace queue with empty array
    */

    Queue.prototype.clear = function clear() {
        this.queue = [];
        this.index = 0;
    };

    return Queue;
})();

module.exports = Queue;

},{}],23:[function(require,module,exports){
'use strict';

var utils = require('./utils.js'),
    zeroPoint = {
    x: 0,
    y: 0
},
    calc = {

    /*
        Angle between points
        
        Translates the hypothetical line so that the 'from' coordinates
        are at 0,0, then return the angle using .angleFromCenter()
        
        @param [object]: X and Y coordinates of from point
        @param [object]: X and Y cordinates of to point
        @return [radian]: Angle between the two points in radians
    */
    angle: function (a) {
        var b = arguments.length <= 1 || arguments[1] === undefined ? zeroPoint : arguments[1];
        return calc.angleFromCenter(a.x - b.x, a.y - b.y);
    },

    /*
        Angle from center
        
        Returns the current angle, in radians, of a defined point
        from a center (assumed 0,0)
        
        @param [number]: X coordinate of second point
        @param [number]: Y coordinate of second point
        @return [radian]: Angle between 0, 0 and point in radians
    */
    angleFromCenter: function (x, y) {
        return calc.radiansToDegrees(Math.atan2(y, x));
    },

    /*
        Convert degrees to radians
        
        @param [number]: Value in degrees
        @return [number]: Value in radians
    */
    degreesToRadians: function (degrees) {
        return degrees * Math.PI / 180;
    },

    /*
        Dilate
        
        Change the progression between a and b according to dilation.
        
        So dilation = 0.5 would change
        
        a --------- b
        
        to
        
        a ---- b
        
        @param [number]: Previous value
        @param [number]: Current value
        @param [number]: Dilate progress by x
        @return [number]: Previous value plus the dilated difference
    */
    dilate: function (a, b, dilation) {
        return a + (b - a) * dilation;
    },

    /*
        Distance
        
        Returns the distance between (0,0) and pointA, unless pointB
        is provided, then we return the difference between the two.
        
        @param [object/number]: x and y or just x of point A
        @param [object/number]: (optional): x and y or just x of point B
        @return [number]: The distance between the two points
    */
    distance: function (a, b) {
        return utils.isNum(a) ? calc.distance1D(a, b) : calc.distance2D(a, b);
    },

    /*
        Distance 1D
        
        Returns the distance between point A and point B
        
        @param [number]: Point A
        @param [number]: (optional): Point B
        @return [number]: The distance between the two points
    */
    distance1D: function (a) {
        var b = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        return Math.abs(a - b);
    },

    /*
        Distance 2D
        
        Returns the distance between (0,0) and point A, unless point B
        is provided, then we return the difference between the two.
        
        @param [object]: x and y of point A
        @param [object]: (optional): x and y of point B
        @return [number]: The distance between the two points
    */
    distance2D: function (a) {
        var b = arguments.length <= 1 || arguments[1] === undefined ? zeroPoint : arguments[1];
        return calc.hypotenuse(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
    },

    /*
        Hypotenuse
        
        Returns the hypotenuse, side C, given the lengths of sides A and B.
        
        @param [number]: Length of A
        @param [number]: Length of B
        @return [number]: Length of C
    */
    hypotenuse: function (a, b) {
        return Math.sqrt(a * a + b * b);
    },

    /*
        Offset between two inputs
        
        Calculate the difference between two different inputs
        
        @param [Point]: First input
        @param [Point]: Second input
        @return [Offset]: Distance metrics between two points
    */
    offset: function (a, b) {
        var offset = {};

        utils.each(b, function (key, value) {
            offset[key] = a.hasOwnProperty(key) ? value - a[key] : 0;
        });

        if (utils.isNum(offset.x) && utils.isNum(offset.y)) {
            offset.angle = calc.angle(a, b);
            offset.distance = calc.distance2D(a, b);
        }

        return offset;
    },

    /*
        Point from angle and distance
        
        @param [object]: 2D point of origin
        @param [number]: Angle from origin
        @param [number]: Distance from origin
        @return [object]: Calculated 2D point
    */
    pointFromAngleAndDistance: function (origin, angle, distance) {
        angle = calc.degreesToRadians(angle);

        return {
            x: distance * Math.cos(angle) + origin.x,
            y: distance * Math.sin(angle) + origin.y
        };
    },

    /*
        Progress within given range
        
        Given a lower limit and an upper limit, we return the progress
        (expressed as a number 0-1) represented by the given value, and
        limit that progress to within 0-1.
        
        @param [number]: Value to find progress within given range
        @param [number]: Lower limit 
        @param [number]: Upper limit
        @return [number]: Progress of value within range as expressed 0-1
    */
    progress: function (value, from, to) {
        return (value - from) / (to - from);
    },

    /*
        Convert radians to degrees
        
        @param [number]: Value in radians
        @return [number]: Value in degrees
    */
    radiansToDegrees: function (radians) {
        return radians * 180 / Math.PI;
    },

    /*
        Return random number between range
        
        @param [number] (optional): Output minimum
        @param [number] (optional): Output maximum
        @return [number]: Random number within range, or 0 and 1 if none provided
    */
    random: function () {
        var min = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var max = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
        return Math.random() * (max - min) + min;
    },

    /*
        Calculate relative value
        
        Takes the operator and value from a string, ie "+=5", and applies
        to the current value to resolve a new target.
        
        @param [number]: Current value
        @param [string]: Relative value
        @return [number]: New value
    */
    relativeValue: function (current, rel) {
        var newValue = current;
        var equation = rel.split('=');
        var operator = equation[0];

        var _utils$splitValUnit = utils.splitValUnit(equation[1]);

        var unit = _utils$splitValUnit.unit;
        var value = _utils$splitValUnit.value;

        value = parseFloat(value);

        switch (operator) {
            case '+':
                newValue += value;
                break;
            case '-':
                newValue -= value;
                break;
            case '*':
                newValue *= value;
                break;
            case '/':
                newValue /= value;
                break;
        }

        if (unit) {
            newValue += unit;
        }

        return newValue;
    },

    /*
        Restrict value to range
        
        Return value within the range of lowerLimit and upperLimit
        
        @param [number]: Value to keep within range
        @param [number]: Lower limit of range
        @param [number]: Upper limit of range
        @return [number]: Value as limited within given range
    */
    restricted: function (value, min, max) {
        if (utils.isNum(min)) {
            value = Math.max(value, min);
        }

        if (utils.isNum(max)) {
            value = Math.min(value, max);
        }

        return value;
    },

    /*
        Framerate-independent smoothing
         @param [number]: New value
        @param [number]: Old value
        @param [number]: Frame duration
        @param [number] (optional): Smoothing (0 is none)
    */
    smooth: function (newValue, oldValue, duration) {
        var smoothing = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
        return calc.toDecimal(oldValue + duration * (newValue - oldValue) / Math.max(smoothing, duration));
    },

    /*
        Convert x per second to per frame velocity based on fps
        
        @param [number]: Unit per second
        @param [number]: Frame duration in ms
    */
    speedPerFrame: function (xps, frameDuration) {
        return utils.isNum(xps) ? xps / (1000 / frameDuration) : 0;
    },

    /*
        Convert velocity into velicity per second
        
        @param [number]: Unit per frame
        @param [number]: Frame duration in ms
    */
    speedPerSecond: function (velocity, frameDuration) {
        return velocity * (1000 / frameDuration);
    },

    /*
        Convert number to decimal place
    */
    toDecimal: function (num) {
        var precision = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];

        precision = Math.pow(10, precision);
        return Math.round(num * precision) / precision;
    },

    /*
        Value in range from progress
        
        Given a lower limit and an upper limit, we return the value within
        that range as expressed by progress (a number from 0-1)
        
        @param [number]: The progress between lower and upper limits expressed 0-1
        @param [number]: Lower limit of range
        @param [number]: Upper limit of range
        @return [number]: Value as calculated from progress within range (not limited within range)
    */
    value: function (progress, from, to) {
        return -progress * from + progress * to + from;
    },

    /*
        Eased value in range from progress
        
        Given a lower limit and an upper limit, we return the value within
        that range as expressed by progress (a number from 0-1)
        
        @param [number]: The progress between lower and upper limits expressed 0-1
        @param [number]: Lower limit of range, or upper if limit2 not provided
        @param [number]: Upper limit of range
        @param [function]: Easing to apply to value
        @return [number]: Value as calculated from progress within range (not limited within range)
    */
    valueEased: function (progress, from, to, easing) {
        return calc.value(easing(progress), from, to);
    }
};

module.exports = calc;

},{"./utils.js":26}],24:[function(require,module,exports){
'use strict';

var Actor = require('../actor/Actor'),
    Iterator = require('../iterator/Iterator'),
    selectDom = require('./select-dom');

var SAVE_PROP = '__pm_actor_';

module.exports = function (selector) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var dom = selectDom(selector),
        actors = [];

    dom.forEach(function (element) {
        var actor = element[SAVE_PROP];

        if (!actor) {
            opts.element = element;
            actor = element[SAVE_PROP] = new Actor(opts);
        }

        actors.push(actor);
    });

    return actors.length > 1 ? new Iterator(actors) : actors[0];
};

},{"../actor/Actor":15,"../iterator/Iterator":29,"./select-dom":25}],25:[function(require,module,exports){
'use strict';

/*
    @param [string || NodeList || jQuery object]:
        If string, treated as selector.
        If not, treated as preexisting NodeList || jQuery object.
*/
module.exports = function (selector) {
    var nodes = typeof selector === 'string' ? document.querySelectorAll(selector) : selector,
        elements = [];

    // If jQuery selection, get array of Elements
    if (nodes.get) {
        elements = nodes.get();

        // Or convert NodeList to array
    } else if (nodes.length) {
            elements = [].slice.call(nodes);

            // Or if it's just an Element, put into array
        } else {
                elements.push(nodes);
            }

    return elements;
};

},{}],26:[function(require,module,exports){
'use strict';

var protectedProperties = ['scope', 'dom'];
var CAMEL_CASE_PATTERN = /([a-z])([A-Z])/g;
var REPLACE_TEMPLATE = '$1-$2';

var isProtected = function (key) {
    return protectedProperties.indexOf(key) !== -1;
};

/*
    Get var type as string
    
    @param: Variable to test
    @return [string]: Returns, for instance 'Object' if [object Object]
*/
var varType = function (variable) {
    return Object.prototype.toString.call(variable).slice(8, -1);
};

var utils = {
    /*
        Convert camelCase to dash-case
         @param [string]
        @return [string]
    */
    camelToDash: function (string) {
        return string.replace(CAMEL_CASE_PATTERN, REPLACE_TEMPLATE).toLowerCase();
    },

    /*
        Iterate over an object and fire a callback for every item in it
         @param [object]: Properties
        @param [function]: Callback to fire
    */
    each: function (props, callback) {
        var keys = props ? Object.keys(props) : [],
            numKeys = keys.length;

        for (var i = 0; i < numKeys; i++) {
            var key = keys[i],
                prop = props[key];

            if (callback(key, prop) === false) {
                break;
            }
        }
    },

    /*
        Check if object has property and it isn't undefined
         @param [object]
        @param [string]
        @return [boolean]
    */
    has: function (object, propertyName) {
        return object.hasOwnProperty(propertyName) && object[propertyName] !== undefined;
    },

    /*
        Has one object changed from the other
        
        Compares the two provided inputs and returns true if they are different
        
        @param [object]: Input A
        @param [object]: Input B
        @return [boolean]: True if different
    */
    hasChanged: function (a, b) {
        var hasChanged = false,
            key = '';

        for (key in b) {
            if (a.hasOwnProperty(key) && b.hasOwnProperty(key)) {
                if (a[key] !== b[key]) {
                    hasChanged = true;
                }
            } else {
                hasChanged = true;
            }
        }

        return hasChanged;
    },

    /*
        Is utils var a function ? 
        
        @param: Variable to test
        @return [boolean]: Returns true if utils.varType === 'Function'
    */
    isFunc: function (obj) {
        return varType(obj) === 'Function';
    },

    /*
        Is utils var a number?
        
        @param: Variable to test
        @return [boolean]: Returns true if typeof === 'number'
    */
    isNum: function (num) {
        return typeof num === 'number';
    },

    /*
        Is utils var an object?
        
        @param: Variable to test
        @return [boolean]: Returns true if typeof === 'object'
    */
    isObj: function (obj) {
        return typeof obj === 'object';
    },

    /*
        Is utils var a string ? 
        
        @param: Variable to test
        @return [boolean]: Returns true if typeof str === 'string'
    */
    isString: function (str) {
        return typeof str === 'string';
    },

    /*
        Is utils a relative value assignment?
        
        @param [string]: Variable to test
        @return [boolean]: If utils looks like a relative value assignment
    */
    isRelativeValue: function (value) {
        return value && value.indexOf && value.indexOf('=') > 0 ? true : false;
    },

    /*
        Is utils var an array ? 
        
        @param: Variable to test
        @return [boolean]: Returns true if utils.varType === 'Array'
    */
    isArray: function (arr) {
        return varType(arr) === 'Array';
    },

    /*
        Copy object or array
        
        Checks whether base is an array or object and makes
        appropriate copy
        
        @param [array || object]: Array or object to copy
        @param [array || object]: New copy of array or object
    */
    copy: function (base) {
        return utils.isArray(base) ? utils.copyArray(base) : utils.copyObject(base);
    },

    /*
        Deep copy an object
        
        Iterates over an object and creates a new copy of every item,
        deep copying if it finds any objects/arrays
        
        @param [object]: Object to copy
        @param [object]: New copy of object
    */
    copyObject: function (base) {
        var newObject = {};

        utils.each(base, function (key, value) {
            newObject[key] = utils.isObj(value) && !isProtected(key) ? utils.copy(value) : value;
        });

        return newObject;
    },

    /*
        Deep copy an array
        
        Loops through an array and creates a new copy of every item,
        deep copying if it finds any objects/arrays
        
        @param [array]: Array to copy
        @return [array]: New copy of array
    */
    copyArray: function (base) {
        return base;
    },

    /*
        Non-destructive merge of object or array
        
        @param [array || object]: Array or object to use as base
        @param [array || object]: Array or object to overwrite base with
        @return [array || object]: New array or object
    */
    merge: function (base, overwrite) {
        return utils.isArray(base) ? utils.copyArray(overwrite) : utils.mergeObject(base, overwrite);
    },

    /*
        Non-destructive merge of object
        
        @param [object]: Object to use as base
        @param [object]: Object to overwrite base with
        @return [object]: New object
    */
    mergeObject: function (base, overwrite) {
        var hasBase = utils.isObj(base),
            newObject = hasBase ? utils.copy(base) : utils.copy(overwrite);

        if (hasBase) {
            utils.each(overwrite, function (key, value) {
                newObject[key] = utils.isObj(value) && !isProtected(key) ? utils.merge(base[key], value) : value;
            });
        }

        return newObject;
    },

    /*
        Split a value into a value/unit object
        
            "200px" -> { value: 200, unit: "px" }
            
        @param [string]: Value to split
        @return [object]: Object with value and unit props
    */
    splitValUnit: function (value) {
        var splitVal = value.match(/(-?\d*\.?\d*)(.*)/);

        return {
            value: splitVal[1],
            unit: splitVal[2]
        };
    },

    /*
        Create stepped version of 0-1 progress
        
        @param [number]: Current value
        @param [int]: Number of steps
        @return [number]: Stepped value
    */
    stepProgress: function (progress, steps) {
        var segment = 1 / (steps - 1),
            target = 1 - 1 / steps,
            progressOfTarget = Math.min(progress / target, 1);

        return Math.floor(progressOfTarget / segment) * segment;
    },

    /*
        Generate current timestamp
        
        @return [timestamp]: Current UNIX timestamp
    */
    currentTime: function () {
        return typeof performance !== 'undefined' && performance.now ? performance.now() : new Date().getTime();
    }
};

module.exports = utils;

},{}],27:[function(require,module,exports){
/*
    Input controller
*/
"use strict";

var calc = require('../inc/calc.js'),
    utils = require('../inc/utils.js'),
    History = require('../inc/History.js'),

/*
    Input constructor
    
        Syntax
            newInput(name, value[, poll])
                @param [string]: Name of to track
                @param [number]: Initial value
                @param [function] (optional): Function to poll Input data
                
            newInput(props[, poll])
                @param [object]: Object of values
                @param [function] (optional): Function to poll Input data
     @return [Input]
*/
Input = function () {
    var pollPos = arguments.length - 1;

    this.current = {};
    this.offset = {};
    this.velocity = {};
    this.history = new History();
    this.update(arguments[0], arguments[1]);

    if (utils.isFunc(arguments[pollPos])) {
        this.poll = arguments[pollPos];
    }
};

Input.prototype = {

    // [number]: Number of frames of inactivity before velocity is turned to 0
    maxInactiveFrames: 2,

    // [number]: Number of frames input hasn't been updated
    inactiveFrames: 0,

    /*
        Get latest input values
        
        @param [string] (optional): Name of specific property to return
        @return [object || number]: Latest input values or, if specified, single value
    */
    get: function (prop) {
        var latest = this.history.get(),
            val = prop !== undefined ? latest[prop] : latest;
        return val;
    },

    /*
        Update the input values
        
        Syntax
            input.update(name, value)
                @param [string]: Name of to track
                @param [number]: Initial value
                
            input.update(props)
                @param [object]: Object of values
                
        @return [Input]
    */
    update: function (arg0, arg1) {
        var values = {};

        if (utils.isNum(arg1)) {
            values[arg0] = arg1;
        } else {
            values = arg0;
        }

        this.history.add(utils.merge(this.current, values));

        return this;
    },

    /*
        Check for input movement and update pointer object's properties
        
        @param [number]: Timestamp of frame
        @return [Input]
    */
    onFrame: function (timestamp) {
        var latest, hasChanged;

        // Check provided timestamp against lastFrame timestamp and return input has already been updated
        if (timestamp === this.lastFrame) {
            return;
        }

        latest = this.poll ? this.poll() : this.history.get();
        hasChanged = utils.hasChanged(this.current, latest);

        // If input has changed between frames 
        if (hasChanged) {
            this.velocity = calc.offset(this.current, latest);
            this.current = latest;
            this.inactiveFrames = 0;

            // Or it hasn't moved and our frame limit has been reached
        } else if (this.inactiveFrames >= this.maxInactiveFrames) {
                this.velocity = calc.offset(this.current, this.current);

                // Or input hasn't changed
            } else {
                    this.inactiveFrames++;
                }

        this.lastFrame = timestamp;

        return this;
    }
};

module.exports = Input;

},{"../inc/History.js":21,"../inc/calc.js":23,"../inc/utils.js":26}],28:[function(require,module,exports){
"use strict";

var Input = require('./Input.js'),
    currentPointer,
    // Sort this out for multitouch

TOUCHMOVE = 'touchmove',
    MOUSEMOVE = 'mousemove',

/*
    Convert event into point
    
    Scrape the x/y coordinates from the provided event
    
    @param [event]: Original pointer event
    @param [boolean]: True if touch event
    @return [object]: x/y coordinates of event
*/
eventToPoint = function (event, isTouchEvent) {
    var touchChanged = isTouchEvent ? event.changedTouches[0] : false;

    return {
        x: touchChanged ? touchChanged.clientX : event.pageX,
        y: touchChanged ? touchChanged.clientY : event.pageY
    };
},

/*
    Get actual event
    
    Checks for jQuery's .originalEvent if present
    
    @param [event | jQuery event]
    @return [event]: The actual JS event  
*/
getActualEvent = function (event) {
    return event.originalEvent || event;
},

/*
    Pointer constructor
*/
Pointer = function (e) {
    var event = getActualEvent(e),
        // In case of jQuery event
    isTouch = event.touches ? true : false,
        startPoint = eventToPoint(event, isTouch);

    this.update(startPoint);
    this.isTouch = isTouch;
    this.bindEvents();
},
    proto = Pointer.prototype = new Input();

/*
    Bind move event
*/
proto.bindEvents = function () {
    this.moveEvent = this.isTouch ? TOUCHMOVE : MOUSEMOVE;
    this.autoStop = true;

    currentPointer = this;

    document.documentElement.addEventListener(this.moveEvent, this.onMove);
};

/*
    Unbind move event
*/
proto.unbindEvents = function () {
    document.documentElement.removeEventListener(this.moveEvent, this.onMove);
};

/*
    Pointer onMove event handler
    
    @param [event]: Pointer move event
*/
proto.onMove = function (e) {
    var newPoint = eventToPoint(e, currentPointer.isTouch);
    e = getActualEvent(e);
    e.preventDefault();
    currentPointer.update(newPoint);
};

proto.stop = function () {
    this.unbindEvents();
};

module.exports = Pointer;

},{"./Input.js":27}],29:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Actor = require('../actor/Actor');
var Tween = require('../actions/Tween');
var utils = require('../inc/utils');

var DEFAULT_STAGGER_EASE = 'linear';

function generateCallback(method) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    var callback = method;

    if (utils.isString(method)) {
        callback = function (member) {
            return member[method].apply(member, args);
        };
    } else if (!utils.isFunc(method)) {
        callback = function (member) {
            member.start.apply(member, [method].concat(args));
        };
    }

    return callback;
}

var Iterator = (function () {
    function Iterator(members) {
        _classCallCheck(this, Iterator);

        this.clear();

        if (members) {
            this.add(members);
        }

        this._stagger = new Actor();
    }

    Iterator.prototype.add = function add(members) {
        this.members = this.members.concat(members);
        return this;
    };

    Iterator.prototype.clear = function clear() {
        this.members = [];
        return this;
    };

    Iterator.prototype.each = function each(method) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
        }

        var callback = generateCallback.apply(undefined, [method].concat(args));
        this.members.forEach(callback);
        return this;
    };

    Iterator.prototype.eachIntoNew = function eachIntoNew(method) {
        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            args[_key3 - 1] = arguments[_key3];
        }

        var callback = generateCallback.apply(undefined, [method].concat(args));
        var newIterator = new Iterator();

        this.members.forEach(function (member) {
            return newIterator.add(callback(member));
        });

        return newIterator;
    };

    Iterator.prototype.stagger = function stagger(method, props) {
        var tempMembers = utils.copyArray(this.members);
        var numMembers = tempMembers.length;
        var propsIsInterval = utils.isNum(props);
        var interval = propsIsInterval ? props : props.interval || 100;

        for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
            args[_key4 - 2] = arguments[_key4];
        }

        var callback = generateCallback.apply(undefined, [method].concat(args));

        var i = -1;
        var staggerProps = {};

        staggerProps.values = {
            i: {
                current: -0.6,
                duration: interval * numMembers,
                ease: propsIsInterval ? DEFAULT_STAGGER_EASE : props.ease || DEFAULT_STAGGER_EASE,
                round: true,
                to: numMembers - 0.6
            }
        };

        staggerProps.onComplete = propsIsInterval ? undefined : props.onComplete;

        staggerProps.onUpdate = function (output) {
            var newIndex = output.i;
            var gapIndex = i + 1;

            // If our new index is only one more than the previous index, fire immedietly
            if (newIndex === i + 1) {
                callback(tempMembers[gapIndex], gapIndex);

                // Or loop through the distance to fire all indecies. Increase delay.
            } else {
                    for (; gapIndex <= newIndex; gapIndex++) {
                        callback(tempMembers[gapIndex], gapIndex);
                    }
                }

            i = newIndex;
        };

        this._stagger.start(new Tween(staggerProps));

        return this;
    };

    /*
        Array manipulation
    */

    Iterator.prototype.reverse = function reverse() {
        this.members.reverse();
        return this;
    };

    return Iterator;
})();

module.exports = Iterator;

},{"../actions/Tween":7,"../actor/Actor":15,"../inc/utils":26}],30:[function(require,module,exports){
"use strict";

var popmotion = require('../popmotion');

/*
    Add optional custom value type support
*/
popmotion.addValueType({
    alpha: require('../value-types/alpha'),
    angle: require('../value-types/angle'),
    px: require('../value-types/px'),
    hsl: require('../value-types/hsl'),
    rgb: require('../value-types/rgb'),
    hex: require('../value-types/hex'),
    color: require('../value-types/color'),
    positions: require('../value-types/positions'),
    dimensions: require('../value-types/dimensions'),
    scale: require('../value-types/scale'),
    shadow: require('../value-types/shadow'),
    complex: require('../value-types/complex')
});

/*
    Predefined roles
*/
popmotion.attr = require('../roles/attr/attrRole');
popmotion.css = require('../roles/css/cssRole');
popmotion.svg = require('../roles/svg/svgRole');
popmotion.drawPath = require('../roles/path/drawPathRole');

module.exports = popmotion;

},{"../popmotion":31,"../roles/attr/attrRole":37,"../roles/css/cssRole":39,"../roles/path/drawPathRole":44,"../roles/svg/svgRole":47,"../value-types/alpha":50,"../value-types/angle":51,"../value-types/color":52,"../value-types/complex":53,"../value-types/dimensions":54,"../value-types/hex":55,"../value-types/hsl":56,"../value-types/positions":64,"../value-types/px":65,"../value-types/rgb":66,"../value-types/scale":67,"../value-types/shadow":70}],31:[function(require,module,exports){
'use strict';

var valueTypes = require('./value-types/manager'),
    Popmotion = {

    Actor: require('./actor/Actor'),

    Sequence: require('./sequence/Sequence'),

    Input: require('./input/Input'),

    Iterator: require('./iterator/Iterator'),

    Process: require('./process/Process'),

    Easing: require('./actions/tween/Easing'),

    Role: require('./roles/Role'),

    Action: require('./actions/Action'),
    Tween: require('./actions/Tween'),
    Simulate: require('./actions/Simulate'),
    Track: require('./actions/Track'),

    /*
        Create an Iterator of Actors with selected dom elements
    */
    select: require('./inc/select-actor'),

    ease: require('./actions/tween/preset-easing'),

    /*
        Modify properties of inbuilt easing function
    */
    modifyEase: require('./actions/tween/modify-ease'),

    addValueType: function (types) {
        valueTypes.extend(types);
        return Popmotion;
    },

    calc: require('./inc/calc'),
    utils: require('./inc/utils')
};

module.exports = Popmotion;

},{"./actions/Action":4,"./actions/Simulate":5,"./actions/Track":6,"./actions/Tween":7,"./actions/tween/Easing":11,"./actions/tween/modify-ease":13,"./actions/tween/preset-easing":14,"./actor/Actor":15,"./inc/calc":23,"./inc/select-actor":24,"./inc/utils":26,"./input/Input":27,"./iterator/Iterator":29,"./process/Process":32,"./roles/Role":36,"./sequence/Sequence":49,"./value-types/manager":57}],32:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = require('../inc/utils');
var loop = require('./loop');

var Process = (function () {

    /*
        @param [function || object]
        @param [object] (optional)
    */

    function Process(callback, scope) {
        var _this = this;

        _classCallCheck(this, Process);

        // Set callback
        if (utils.isFunc(callback)) {
            this.render = callback;
        } else if (utils.isObj(callback)) {
            utils.each(callback, function (key, value) {
                _this[key] = value;
            });
        }

        this.scope = utils.isObj(scope) ? scope : this;

        this.setBackground(arguments[arguments.length - 1]);

        this.id = loop.getProcessId();
        this.isActive = false;
    }

    Process.prototype.start = function start() {
        this.activate();
        return this;
    };

    Process.prototype.stop = function stop() {
        this.deactivate();
        return this;
    };

    Process.prototype.activate = function activate() {
        this.isActive = true;
        loop.activate(this, this.id);
    };

    Process.prototype.deactivate = function deactivate() {
        this.isActive = false;
        loop.deactivate(this.id);
    };

    Process.prototype.once = function once() {
        var _this2 = this;

        this.cleanup = function () {
            _this2.stop();
            _this2.cleanup = undefined;
        };

        return this.start();
    };

    Process.prototype.setBackground = function setBackground(runInBackground) {
        this.isBackground = runInBackground === true ? true : false;
        return this;
    };

    return Process;
})();

module.exports = Process;

},{"../inc/utils":26,"./loop":33}],33:[function(require,module,exports){
'use strict';

var timer = require('./timer');
var systemTick = require('./system-tick');

var processOrder = ['update', 'preRender', 'render', 'postRender', 'cleanup'];
var numProcessSteps = processOrder.length;

// [int]: Process ID, incremented for each new process
var currentProcessId = 0;

// [int]: Number of running processes
var runningCount = 0;

// [int]: Number of running non-background processes
var activeCount = 0;

// [array]: Array of active process IDs
var runningIds = [];

// [object]: Map of active processes
var runningProcesses = {};

// [array]: Array of process IDs queued for deactivation
var deactivateQueue = [];

// [boolean]: Is loop running?
var isRunning = false;

/*
    Update running

    @param [boolean]
    @param [boolean]
*/
var updateCount = function (add, isBackground) {
    var modify = add ? 1 : -1;

    runningCount += modify;

    if (!isBackground) {
        activeCount += modify;
    }
};

/*
    Purge items in the deactivate queue from our runningProcesses
*/
var purge = function () {
    var queueLength = deactivateQueue.length;

    while (queueLength--) {
        var idToDelete = deactivateQueue[queueLength];
        var activeIdIndex = runningIds.indexOf(idToDelete);

        // If process is active, deactivate
        if (activeIdIndex > -1) {
            runningIds.splice(activeIdIndex, 1);

            updateCount(false, runningProcesses[idToDelete].isBackground);

            delete runningProcesses[idToDelete];
        }
    }

    deactivateQueue = [];
};

/*
    Fire all active processes
    
    @param [int]: Timestamp of executing frames
    @param [int]: Time since previous frame
    @return [boolean]: True if active processes found
*/
var fireAll = function (framestamp, elapsed) {
    purge();

    var numRunning = runningCount;
    for (var i = 0; i < numProcessSteps; i++) {
        var method = processOrder[i];

        for (var _i = 0; _i < numRunning; _i++) {
            var process = runningProcesses[runningIds[_i]];

            if (process && process[method]) {
                process[method].call(process.scope, process.scope, framestamp, elapsed);
            }
        }
    }

    purge();

    return activeCount ? true : false;
};

var loop = {
    /*
        Fire all active processes once per frame
    */
    frame: function () {
        systemTick(function (framestamp) {
            if (isRunning) {
                loop.frame();
            }

            timer.update(framestamp);
            isRunning = fireAll(framestamp, timer.getElapsed());
        });
    },

    start: function () {
        if (!isRunning) {
            timer.start();
            isRunning = true;
            loop.frame();
        }
    },

    stop: function () {
        isRunning = false;
    }
};

module.exports = {
    // Increments and returns the latest process ID
    getProcessId: function () {
        return currentProcessId++;
    },

    /*
        @param [Process]
        @param [int]
    */
    activate: function (process, processId) {
        var queueIndex = deactivateQueue.indexOf(processId);
        var isQueued = queueIndex > -1;
        var isRunning = runningIds.indexOf(processId) > -1;

        // Remove from deactivateQueue if queued
        if (isQueued) {
            deactivateQueue.splice(queueIndex, 1);
        }

        // Add to running processes array if not there
        if (!isRunning) {
            runningIds.push(processId);
            runningProcesses[processId] = process;

            updateCount(true, process.isBackground);
            loop.start();
        }
    },

    /*
        @param [int]
    */
    deactivate: function (processId) {
        if (deactivateQueue.indexOf(processId) === -1) {
            deactivateQueue.push(processId);
        }
    }
};

},{"./system-tick":34,"./timer":35}],34:[function(require,module,exports){
'use strict';

var hasRAF = typeof window !== 'undefined' && window.requestAnimationFrame ? true : false;

var tick = undefined;

if (hasRAF) {
    tick = window.requestAnimationFrame;
} else {
    (function () {
        /*
            requestAnimationFrame polyfill
            
            For IE8/9 Flinstones
             Taken from Paul Irish. We've stripped out cancelAnimationFrame checks because we don't fox with that
            
            http://paulirish.com/2011/requestanimationframe-for-smart-animating/
            http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
             
            requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
             
            MIT license
        */
        var lastTime = 0;

        tick = function (callback) {
            var currentTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currentTime - lastTime));

            lastTime = currentTime + timeToCall;

            setTimeout(function () {
                return callback(lastTime);
            }, timeToCall);
        };
    })();
}

module.exports = tick;

},{}],35:[function(require,module,exports){
'use strict';

var currentTime = require('../inc/utils').currentTime;
var MAX_ELAPSED = 33;

var current = 0;
var elapsed = 16.7;

var timer = {
    update: function (framestamp) {
        var prev = current;
        current = framestamp;
        elapsed = Math.min(current - prev, MAX_ELAPSED);

        return current;
    },

    start: function () {
        return current = currentTime();
    },

    getElapsed: function () {
        return elapsed;
    }
};

module.exports = timer;

},{"../inc/utils":26}],36:[function(require,module,exports){
'use strict';

var utils = require('../inc/utils');
var each = utils.each;

/*
    Role class constructor

    @param [object]: Optional methods and props to add:
        name [string]:      Name of generated getter/setter method on Actor
        _map [object]:      Map Actor values to these values for this Role
        _typeMap [object]:  Map values to value types
        init [function]:    Callback to run when this Role is added to an Actor
        start [function]:   Callback to run when host Actor starts an action
        complete [function]: Callback to run when action completes
        frame [function]:   Callback to fire once per frame
        update [function]:  Callback to fire when values change
        get [function]:     Read value from actual element
        set [function]:     Set value on actual element
*/
var Role = function (methods) {
    var role = function (element, opts, prop) {
        var typeOfOpts = typeof opts;

        // Set single, if this is a string and we have a property
        if (typeOfOpts === 'string' && prop) {
            role.set(element, opts, prop);

            // Set multi, if this is an object
        } else if (typeOfOpts === 'object') {
                each(opts, function (key, value) {
                    role.set(element, key, value);
                });

                // Or this is a get if we have a string and no props
            } else {
                    return role.get(element, opts);
                }

        return role;
    };

    role._map = {};

    each(methods, function (name, method) {
        role[name] = !utils.isObj(method) ? method : utils.copy(method);
    });

    /*
        Map value keys or generate new Role with updated map
         Getter:
            @param [string]: Key to map
            @return [string]: Mapped key, or key if no mapped key found
         Setter: 
            @param [object]: Map of Actor keys -> Role keys
            @return [Role]: New Role with unique map
    */
    role.map = function (values) {
        // If this is a string, get mapped value
        // Otherwise this is a map, duplicated role with updated map
        return utils.isString(values) ? this._map[values] || values : createRole(this, values);
    };

    return role;
};

/*
    Create a new role

    @param [object]: Optional methods and props to add
    @param [valuesToMap]: Override existing map with these values
    @return [Role]: New Role
*/
var createRole = function (methods, values) {
    var newRole = new Role(methods);

    each(values, function (key, value) {
        newRole._map[key] = value;
    });

    return newRole;
};

module.exports = Role;

},{"../inc/utils":26}],37:[function(require,module,exports){
"use strict";

var Role = require('../Role');
var each = require('../../inc/utils').each;

var attrRole = new Role({
    update: function (state) {
        var actor = this;

        each(state, function (key, value) {
            attrRole.set(actor.element, key, value);
        });
    },

    get: function (element, key) {
        return element.getAttribute(key);
    },

    set: function (element, key, value) {
        element.setAttribute(key, value);
    }
});

module.exports = attrRole;

},{"../../inc/utils":26,"../Role":36}],38:[function(require,module,exports){
"use strict";

var each = require('../../inc/utils').each,
    transformDictionary = require('./transform-dictionary'),
    transformProps = transformDictionary.props,
    TRANSLATE_Z = 'translateZ';

module.exports = function (output, cache) {
    var css = {},
        transform = '',
        transformHasZ = false;

    // Loop through output, check for transform properties
    each(output, function (key, rule) {
        // If this is a transform property, add to transform string
        if (transformProps[key]) {
            transform += key + '(' + rule + ')';
            transformHasZ = key === TRANSLATE_Z ? true : transformHasZ;

            // Or just assign directly
        } else {
                if (rule !== cache[key]) {
                    cache[key] = css[key] = rule;
                }
            }
    });

    // If we have transform properties, add translateZ
    if (transform !== '') {
        if (!transformHasZ) {
            transform += ' ' + TRANSLATE_Z + '(0px)';
        }

        if (transform !== cache.transform) {
            css.transform = transform;
        }

        cache.transform = transform;
    }

    return css;
};

},{"../../inc/utils":26,"./transform-dictionary":41}],39:[function(require,module,exports){
"use strict";

var Role = require('../Role');
var build = require('./build');

var prefixes = ['Webkit', 'Moz', 'O', 'ms', ''];
var numPrefixes = prefixes.length;
var propertyNameCache = {};
var testElement;

/*
    Test style property for prefixed version
    
    @param [string]: Style property
    @return [string]: Cached property name
*/
var testPrefix = function (key) {
    testElement = testElement || document.createElement('div');

    if (propertyNameCache[key] === false) {
        return false;
    } else {
        propertyNameCache[key] = false;
    }

    for (var i = 0; i < numPrefixes; i++) {
        var prefix = prefixes[i],
            prefixed = prefix === '' ? key : prefix + key.charAt(0).toUpperCase() + key.slice(1);

        if (prefixed in testElement.style) {
            propertyNameCache[key] = prefixed;
        }
    }

    return propertyNameCache[key];
};

var cssRole = new Role({
    _map: require('./map'),
    _typeMap: require('./type-map'),

    init: function (actor) {
        actor._cssCache = {};
    },

    update: function (state, actor) {
        cssRole(actor.element, build(state, actor._cssCache));
    },

    get: function (element, key) {
        key = propertyNameCache[key] || testPrefix(key);

        if (key) {
            return window.getComputedStyle(element, null)[key];
        }
    },

    set: function (element, key, value) {
        key = propertyNameCache[key] || testPrefix(key);

        if (key) {
            element.style[key] = value;
        }
    }

});

module.exports = cssRole;

},{"../Role":36,"./build":38,"./map":40,"./type-map":42}],40:[function(require,module,exports){
'use strict';

var TRANSLATE = 'translate';

module.exports = {
    x: TRANSLATE + 'X',
    y: TRANSLATE + 'Y',
    z: TRANSLATE + 'Z'
};

},{}],41:[function(require,module,exports){
"use strict";

var positionTerms = require('../../value-types/settings/dictionary').positions,
    numPositionTerms = positionTerms.length,
    TRANSFORM_PERSPECTIVE = 'transformPerspective',
    SCALE = 'scale',
    ROTATE = 'rotate',
    terms = {
    funcs: ['translate', SCALE, ROTATE, 'skew', TRANSFORM_PERSPECTIVE],
    props: {} // objects are faster at direct lookups
};

// Create transform terms
(function () {
    var funcs = terms.funcs,
        props = terms.props,
        numFuncs = funcs.length,
        i = 0,
        createProps = function (funcName) {
        var j = 0;

        for (; j < numPositionTerms; j++) {
            props[funcName + positionTerms[j]] = true;
        }
    };

    // Manually add skew and transform perspective 
    props[ROTATE] = props[SCALE] = props[TRANSFORM_PERSPECTIVE] = true;

    // Loop over each function name and create function/property terms
    for (; i < numFuncs; i++) {
        createProps(funcs[i]);
    }
})();

module.exports = terms;

},{"../../value-types/settings/dictionary":69}],42:[function(require,module,exports){
'use strict';

var COLOR = 'color',
    POSITIONS = 'positions',
    DIMENSIONS = 'dimensions',
    SCALE = 'scale',
    SHADOW = 'shadow',
    ANGLE = 'angle',
    ALPHA = 'alpha',
    PX = 'px';

module.exports = {
    // Color properties
    color: COLOR,
    backgroundColor: COLOR,
    outlineColor: COLOR,
    fill: COLOR,
    stroke: COLOR,
    // Border
    borderColor: COLOR,
    borderTopColor: COLOR,
    borderRightColor: COLOR,
    borderBottomColor: COLOR,
    borderLeftColor: COLOR,
    borderRadius: PX,
    // Dimensions
    margin: DIMENSIONS,
    padding: DIMENSIONS,
    width: PX,
    height: PX,
    // Positions
    backgroundPosition: POSITIONS,
    perspectiveOrigin: POSITIONS,
    transformOrigin: POSITIONS,
    // Shadows
    textShadow: SHADOW,
    boxShadow: SHADOW,
    // Transform properties
    rotate: ANGLE,
    rotateX: ANGLE,
    rotateY: ANGLE,
    rotateZ: ANGLE,
    scale: SCALE,
    scaleX: SCALE,
    scaleY: SCALE,
    scaleZ: SCALE,
    skewX: ANGLE,
    skewY: ANGLE,
    distance: PX,
    translateX: PX,
    translateY: PX,
    translateZ: PX,
    perspective: PX,
    opacity: ALPHA
};

},{}],43:[function(require,module,exports){
'use strict';

var Role = require('./Role');

module.exports = new Role({
    init: function (actor) {
        if (actor.init) {
            actor.init(actor);
        }
    },

    start: function (actor) {
        if (actor.onStart) {
            actor.onStart(actor);
        }
    },

    frame: function (state, actor) {
        if (actor.onFrame) {
            actor.onFrame(state, actor);
        }
    },

    update: function (state, actor) {
        if (actor.onUpdate) {
            actor.onUpdate(state, actor);
        }
    },

    complete: function (actor) {
        if (actor.onComplete) {
            actor.onComplete(actor);
        }
    }
});

},{"./Role":36}],44:[function(require,module,exports){
"use strict";

var Role = require('../Role');
var attrRole = require('../attr/attrRole');
var each = require('../../inc/utils').each;

/*
    Convert percentage to pixels
    
    @param [number]: Percentage of total length
    @param [number]: Total length
*/
var percentToPixels = function (percentage, length) {
    return parseFloat(percentage) / 100 * length + 'px';
};

/*
    Create styles
    
    @param [object]: SVG Path properties
    @param [object]: Length of path
    @returns [object]: Key/value pairs of valid CSS properties
*/
var createStyles = function (props, length) {
    var hasDashArray = false,
        dashArrayStyles = {
        length: 0,
        spacing: length + 'px'
    },
        styles = {};

    each(props, function (key, value) {
        key = SVGDrawPath._map[key] || key;

        switch (key) {
            case 'length':
            case 'spacing':
                hasDashArray = true;
                dashArrayStyles[key] = percentToPixels(value, length);
                break;
            case 'offset':
                styles['stroke-dashoffset'] = percentToPixels(-value, length);
                break;
            default:
                styles[key] = value;
        }
    });

    if (hasDashArray) {
        styles['stroke-dasharray'] = dashArrayStyles.length + ' ' + dashArrayStyles.spacing;
    }

    return styles;
};

/*
    Draw Path role
*/
var SVGDrawPath = new Role({
    _map: require('./map'),

    _typeMap: {
        stroke: 'color',
        d: 'complex'
    },

    init: function () {
        this.pathLength = this.element.getTotalLength();
    },

    /*
        Update `path` styles and if `element` is present, set
        x, y and rotation
    */
    update: function (state) {
        attrRole.update.call(this, createStyles(state, this.pathLength));
    }
});

module.exports = SVGDrawPath;

},{"../../inc/utils":26,"../Role":36,"../attr/attrRole":37,"./map":45}],45:[function(require,module,exports){
'use strict';

var STROKE = 'stroke';

module.exports = {
    opacity: STROKE + '-opacity',
    width: STROKE + '-width',
    miterlimit: STROKE + '-miterlimit'
};

},{}],46:[function(require,module,exports){
'use strict';

var utils = require('../../inc/utils');
var transformDictionary = require('../css/transform-dictionary');

var each = utils.each;
var camelToDash = utils.camelToDash;
var transformProps = transformDictionary.props;
var zeroNotZero = 0.0001;

module.exports = function (output, origin) {
    var props = {},
        hasTransform = false,
        scale = output.scale !== undefined ? output.scale || zeroNotZero : output.scaleX || 1,
        scaleY = output.scaleY !== undefined ? output.scaleY || zeroNotZero : scale || 1,
        transformOriginX = origin.x,
        transformOriginY = origin.y,
        scaleTransformX = -transformOriginX * (scale * 1),
        scaleTransformY = -transformOriginY * (scaleY * 1),
        scaleReplaceX = transformOriginX / scale,
        scaleReplaceY = transformOriginY / scaleY,
        transform = {
        translate: 'translate(' + output.translateX + ', ' + output.translateY + ') ',
        scale: 'translate(' + scaleTransformX + ', ' + scaleTransformY + ') scale(' + scale + ', ' + scaleY + ') translate(' + scaleReplaceX + ', ' + scaleReplaceY + ') ',
        rotate: 'rotate(' + output.rotate + ', ' + transformOriginX + ', ' + transformOriginY + ') ',
        skewX: 'skewX(' + output.skewX + ') ',
        skewY: 'skewY(' + output.skewY + ') '
    };

    each(output, function (key, value) {
        if (transformProps[key]) {
            hasTransform = true;
        } else {
            props[camelToDash(key)] = value;
        }
    });

    if (hasTransform) {
        props.transform = '';

        each(transform, function (key, value) {
            var defaultValue = key === 'scale' ? '1' : '0';
            props.transform += value.replace(/undefined/g, defaultValue);
        });
    }

    return props;
};

},{"../../inc/utils":26,"../css/transform-dictionary":41}],47:[function(require,module,exports){
"use strict";

var Role = require('../Role'),
    attrRole = require('../attr/attrRole'),
    build = require('./build'),
    each = require('../../inc/utils').each;

module.exports = new Role({
    _map: require('../css/map'),
    _typeMap: require('./type-map'),

    start: function () {
        var boundingBox = this.element.getBBox(),
            values = this.values,

        // TODO: Support px
        transformOriginX = values.transformOriginX ? values.transformOriginX.current : 50,
            transformOriginY = values.transformOriginY ? values.transformOriginY.current : 50,
            origin = {
            x: boundingBox.width * (transformOriginX / 100) + boundingBox.x,
            y: boundingBox.height * (transformOriginY / 100) + boundingBox.y
        };

        this.svgOrigin = origin;
    },

    update: function (state) {
        var actor = this;
        each(build(state, this.svgOrigin), function (key, value) {
            attrRole.set(actor.element, key, value);
        });
    }

});

},{"../../inc/utils":26,"../Role":36,"../attr/attrRole":37,"../css/map":40,"./build":46,"./type-map":48}],48:[function(require,module,exports){
'use strict';

var ALPHA = 'alpha';
var COLOR = 'color';
var SCALE = 'scale';

module.exports = {
    fill: COLOR,
    stroke: COLOR,
    scale: SCALE,
    scaleX: SCALE,
    scaleY: SCALE,
    transformOrigin: 'positions',
    d: 'complex',
    opacity: ALPHA,
    fillOpacity: ALPHA,
    strokeOpacity: ALPHA
};

},{}],49:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Actor = require('../actor/Actor');
var Tween = require('../actions/Tween');
var utils = require('../inc/utils');
var calcRelative = require('../inc/calc').relativeValue;

var timeline = new Tween({
    ease: 'linear',
    values: {
        playhead: 0
    }
});

var checkActions = function (_ref, sequence) {
    var playhead = _ref.playhead;

    var i = sequence.check.length;

    while (i--) {
        var toCheck = sequence.check[i];

        if (playhead >= toCheck.timestamp) {
            toCheck.callback();
            sequence.check.splice(i, 1);
        }
    }
};

var generateCallback = function (actor, action) {
    var callback = undefined;

    if (actor.each) {
        callback = function () {
            actor.each(action);
        };
    } else {
        callback = function () {
            actor.start(action);
        };
    }

    return callback;
};

var Sequence = (function (_Actor) {
    _inherits(Sequence, _Actor);

    function Sequence() {
        _classCallCheck(this, Sequence);

        return _possibleConstructorReturn(this, _Actor.call(this, {
            check: [],
            sequence: [],
            duration: 0,
            currentTimestamp: 0,
            prevActionEnd: 0,
            onUpdate: checkActions
        }));
    }

    Sequence.prototype.do = function _do(actor, action) {
        var isCallback = utils.isFunc(actor);

        this.sequence.push({
            timestamp: this.currentTimestamp,
            callback: isCallback ? actor : generateCallback(actor, action)
        });

        if (action && action.duration) {
            this.prevActionEnd = this.currentTimestamp + action.duration;
        }

        return this;
    };

    Sequence.prototype.stagger = function stagger(iterator, action, staggerProps) {
        var numItems = iterator.members.length;
        var interval = utils.isNum(staggerProps) ? staggerProps : staggerProps.interval || 100;
        var duration = action.duration ? action.duration : 0;

        this.do(iterator, function () {
            iterator.stagger(action, staggerProps);
        });

        this.prevActionEnd = this.currentTimestamp + duration + interval * numItems;

        return this;
    };

    Sequence.prototype.at = function at(timestamp) {
        if (utils.isString(timestamp)) {
            timestamp = calcRelative(this.currentTimestamp, timestamp);
        }

        this.currentTimestamp = timestamp;
        this.duration = Math.max(this.currentTimestamp, this.duration);
        return this;
    };

    Sequence.prototype.then = function then() {
        var offset = arguments.length <= 0 || arguments[0] === undefined ? "+=0" : arguments[0];

        this.at(calcRelative(this.prevActionEnd, offset));
        return this;
    };

    Sequence.prototype.start = function start() {
        _Actor.prototype.start.call(this, timeline.extend({
            duration: this.duration,
            values: {
                playhead: {
                    current: 0,
                    to: this.duration
                }
            }
        }));

        return this;
    };

    Sequence.prototype.onStart = function onStart() {
        this.check = this.sequence.slice();
    };

    Sequence.prototype.clear = function clear() {
        this.sequence = [];
        this.duration = this.currentTimestamp = this.prevActionEnd = 0;
        return this;
    };

    return Sequence;
})(Actor);

module.exports = Sequence;

},{"../actions/Tween":7,"../actor/Actor":15,"../inc/calc":23,"../inc/utils":26}],50:[function(require,module,exports){
"use strict";

module.exports = {
    defaultProps: {
        min: 0,
        max: 1
    }
};

},{}],51:[function(require,module,exports){
'use strict';

module.exports = {
    defaultProps: {
        unit: 'deg'
    }
};

},{}],52:[function(require,module,exports){
'use strict';

var utils = require('../inc/utils'),
    rgb = require('./rgb'),
    hsl = require('./hsl'),
    hex = require('./hex'),
    supported = [rgb, hsl, hex],
    numSupported = 3,
    runSupported = function (method, value) {
    for (var i = 0; i < numSupported; i++) {
        if (supported[i].test(value)) {
            return supported[i][method](value);
        }
    }
};

module.exports = {
    defaultProps: utils.merge(rgb.defaultProps, hsl.defaultProps),

    test: function (value) {
        return rgb.test(value) || hex.test(value) || hsl.test(value);
    },

    split: function (value) {
        return runSupported('split', value);
    },

    combine: function (values) {
        return values.Red !== undefined ? rgb.combine(values) : hsl.combine(values);
    }
};

},{"../inc/utils":26,"./hex":55,"./hsl":56,"./rgb":66}],53:[function(require,module,exports){
'use strict';

var utils = require('../inc/utils'),
    each = utils.each,
    floatRegex = /(-)?(\d[\d\.]*)/g,
    generateToken = function (key) {
    return '${' + key + '}';
};

module.exports = {
    test: function (value) {
        var matches = value.match(floatRegex);
        return utils.isArray(matches) && matches.length > 1;
    },

    template: function (value) {
        var counter = 0;
        return value.replace(floatRegex, function () {
            return generateToken(counter++);
        });
    },

    split: function (value) {
        var splitValue = {},
            matches = value.match(floatRegex),
            numMatches = matches.length;

        for (var i = 0; i < numMatches; i++) {
            splitValue[i] = matches[i];
        }

        return splitValue;
    },

    combine: function (values, template) {
        var combinedValue = template;

        each(values, function (key, value) {
            combinedValue = combinedValue.replace(generateToken(key), value);
        });

        return combinedValue;
    }
};

},{"../inc/utils":26}],54:[function(require,module,exports){
'use strict';

var terms = require('./settings/dictionary').dimensions,
    pxDefaults = require('./px').defaultProps,
    createDelimited = require('./manipulators/create-delimited'),
    splitSpaceDelimited = require('./manipulators/split-space-delimited');

module.exports = {

    defaultProps: pxDefaults,

    /*
        Split dimensions in format "Top Right Bottom Left"
        
        @param [string]: Dimension values
            "20px 0 30px 40px" -> {20px, 0, 30px, 40px}
            "20px 0 30px" -> {20px, 0, 30px, 0}
            "20px 0" -> {20px, 0, 20px, 0}
            "20px" -> {20px, 20px, 20px, 20px}
        
        @return [object]: Object with T/R/B/L metrics
    */
    split: function (value) {
        var dimensions = splitSpaceDelimited(value),
            numDimensions = dimensions.length,
            jumpBack = numDimensions !== 1 ? 2 : 1,
            i = 0,
            j = 0,
            splitValue = {};

        for (; i < 4; i++) {
            splitValue[terms[i]] = dimensions[j];

            // Jump back (to start) counter if we've reached the end of our values
            j++;
            j = j === numDimensions ? j - jumpBack : j;
        }

        return splitValue;
    },

    combine: function (values) {
        return createDelimited(values, terms, ' ');
    }
};

},{"./manipulators/create-delimited":58,"./manipulators/split-space-delimited":63,"./px":65,"./settings/dictionary":69}],55:[function(require,module,exports){
'use strict';

var rgb = require('./rgb');

module.exports = {

    defaultProps: rgb.defaultProps,

    test: function (value) {
        return value && value.indexOf('#') > -1;
    },

    split: function (value) {
        var r, g, b;

        // If we have 6 characters, ie #FF0000
        if (value.length > 4) {
            r = value.substr(1, 2);
            g = value.substr(3, 2);
            b = value.substr(5, 2);

            // Or we have 3 characters, ie #F00
        } else {
                r = value.substr(1, 1);
                g = value.substr(2, 1);
                b = value.substr(3, 1);
                r += r;
                g += g;
                b += b;
            }

        return {
            Red: parseInt(r, 16),
            Green: parseInt(g, 16),
            Blue: parseInt(b, 16),
            Alpha: 1
        };
    },

    combine: function (values) {
        return rgb.combine(values);
    }
};

},{"./rgb":66}],56:[function(require,module,exports){
'use strict';

var createDelimited = require('./manipulators/create-delimited'),
    getColorValues = require('./manipulators/get-color-values'),
    functionCreate = require('./manipulators/function-create'),
    defaultProps = require('./settings/default-props'),
    terms = require('./settings/dictionary').hsl;

module.exports = {

    defaultProps: {
        Hue: {
            min: 0,
            max: 360
        },
        Saturation: defaultProps.percent,
        Lightness: defaultProps.percent,
        Alpha: defaultProps.opacity
    },

    test: function (value) {
        return value && value.indexOf('hsl') > -1;
    },

    split: function (value) {
        return getColorValues(value, terms);
    },

    combine: function (values) {
        return functionCreate(createDelimited(values, terms, ', ', 2), 'hsla');
    }
};

},{"./manipulators/create-delimited":58,"./manipulators/function-create":60,"./manipulators/get-color-values":61,"./settings/default-props":68,"./settings/dictionary":69}],57:[function(require,module,exports){
'use strict';

var each = require('../inc/utils').each;

module.exports = {
    extend: function (types) {
        var _this = this;

        each(types, function (name, type) {
            _this[name] = type;
        });
    },

    defaultProps: function (typeName, key) {
        var valueType = this[typeName],
            defaultProps = valueType.defaultProps ? valueType.defaultProps[key] || valueType.defaultProps : {};

        return defaultProps;
    },

    test: function (value) {
        var type = false;

        each(this, function (key, valueType) {
            if (valueType.test && valueType.test(value)) {
                type = key;
                return false;
            }
        });

        return type;
    }
};

},{"../inc/utils":26}],58:[function(require,module,exports){
'use strict';

module.exports = function (values, terms, delimiter, chop) {
    var combined = '',
        key = '',
        i = 0,
        numTerms = terms.length;

    for (; i < numTerms; i++) {
        key = terms[i];

        if (values.hasOwnProperty(key)) {
            combined += values[key] + delimiter;
        }
    }

    if (chop) {
        combined = combined.slice(0, -chop);
    }

    return combined;
};

},{}],59:[function(require,module,exports){
'use strict';

module.exports = function (value) {
  return value.substring(value.indexOf('(') + 1, value.lastIndexOf(')'));
};

},{}],60:[function(require,module,exports){
"use strict";

module.exports = function (value, prefix) {
  return prefix + "(" + value + ")";
};

},{}],61:[function(require,module,exports){
'use strict';

var splitCommaDelimited = require('./split-comma-delimited'),
    functionBreak = require('./function-break');

module.exports = function (value, terms) {
    var splitValue = {},
        numTerms = terms.length,
        colors = splitCommaDelimited(functionBreak(value)),
        i = 0;

    for (; i < numTerms; i++) {
        splitValue[terms[i]] = colors[i] !== undefined ? colors[i] : 1;
    }

    return splitValue;
};

},{"./function-break":59,"./split-comma-delimited":62}],62:[function(require,module,exports){
'use strict';

var isString = require('../../inc/utils').isString;

module.exports = function (value) {
  return isString(value) ? value.split(/,\s*/) : [value];
};

},{"../../inc/utils":26}],63:[function(require,module,exports){
'use strict';

var isString = require('../../inc/utils').isString;

module.exports = function (value) {
  return isString(value) ? value.split(' ') : [value];
};

},{"../../inc/utils":26}],64:[function(require,module,exports){
'use strict';

var createDelimited = require('./manipulators/create-delimited'),
    pxDefaults = require('./px').defaultProps,
    splitSpaceDelimited = require('./manipulators/split-space-delimited'),
    terms = require('./settings/dictionary').positions;

module.exports = {

    defaultProps: pxDefaults,

    /*
        Split positions in format "X Y Z"
        
        @param [string]: Position values
            "20% 30% 0" -> {20%, 30%, 0}
            "20% 30%" -> {20%, 30%}
            "20%" -> {20%, 20%}
    */
    split: function (value) {
        var positions = splitSpaceDelimited(value),
            numPositions = positions.length,
            splitValue = {
            X: positions[0],
            Y: numPositions > 1 ? positions[1] : positions[0]
        };

        if (numPositions > 2) {
            splitValue.Z = positions[2];
        }

        return splitValue;
    },

    combine: function (values) {
        return createDelimited(values, terms, ' ');
    }
};

},{"./manipulators/create-delimited":58,"./manipulators/split-space-delimited":63,"./px":65,"./settings/dictionary":69}],65:[function(require,module,exports){
'use strict';

module.exports = {
    defaultProps: {
        unit: 'px'
    }
};

},{}],66:[function(require,module,exports){
'use strict';

var createDelimited = require('./manipulators/create-delimited'),
    getColorValues = require('./manipulators/get-color-values'),
    functionCreate = require('./manipulators/function-create'),
    defaultProps = require('./settings/default-props'),
    colorDefaults = defaultProps.color,
    terms = require('./settings/dictionary').colors;

module.exports = {

    defaultProps: {
        Red: colorDefaults,
        Green: colorDefaults,
        Blue: colorDefaults,
        Alpha: defaultProps.opacity
    },

    test: function (value) {
        return value && value.indexOf('rgb') > -1;
    },

    split: function (value) {
        return getColorValues(value, terms);
    },

    combine: function (values) {
        return functionCreate(createDelimited(values, terms, ', ', 2), 'rgba');
    }
};

},{"./manipulators/create-delimited":58,"./manipulators/function-create":60,"./manipulators/get-color-values":61,"./settings/default-props":68,"./settings/dictionary":69}],67:[function(require,module,exports){
"use strict";

module.exports = {
    defaultProps: {
        init: 1
    }
};

},{}],68:[function(require,module,exports){
'use strict';

module.exports = {
    color: {
        min: 0,
        max: 255,
        round: true
    },
    opacity: {
        min: 0,
        max: 1
    },
    percent: {
        min: 0,
        max: 100,
        unit: '%'
    }
};

},{}],69:[function(require,module,exports){
'use strict';

var X = 'X',
    Y = 'Y',
    ALPHA = 'Alpha',
    terms = {
    colors: ['Red', 'Green', 'Blue', ALPHA],
    positions: [X, Y, 'Z'],
    dimensions: ['Top', 'Right', 'Bottom', 'Left'],
    shadow: [X, Y, 'Radius', 'Spread', 'Color'],
    hsl: ['Hue', 'Saturation', 'Lightness', ALPHA]
};

module.exports = terms;

},{}],70:[function(require,module,exports){
'use strict';

var color = require('./color'),
    utils = require('../inc/utils'),
    pxDefaults = require('./px').defaultProps,
    terms = require('./settings/dictionary').shadow,
    splitSpaceDelimited = require('./manipulators/split-space-delimited'),
    createDelimited = require('./manipulators/create-delimited'),
    shadowTerms = terms.slice(0, 4);

module.exports = {

    defaultProps: utils.merge(color.defaultProps, {
        X: pxDefaults,
        Y: pxDefaults,
        Radius: pxDefaults,
        Spread: pxDefaults
    }),

    /*
        Split shadow properties "X Y Radius Spread Color"
        
        @param [string]: Shadow property
        @return [object]
    */
    split: function (value) {
        var bits = splitSpaceDelimited(value),
            numBits = bits.length,
            hasReachedColor = false,
            colorProp = '',
            thisBit,
            i = 0,
            splitValue = {};

        for (; i < numBits; i++) {
            thisBit = bits[i];

            // If we've reached the color property, append to color string
            if (hasReachedColor || color.test(thisBit)) {
                hasReachedColor = true;
                colorProp += thisBit;
            } else {
                splitValue[terms[i]] = thisBit;
            }
        }

        return utils.merge(splitValue, color.split(colorProp));
    },

    combine: function (values) {
        return createDelimited(values, shadowTerms, ' ') + color.combine(values);
    }
};

},{"../inc/utils":26,"./color":52,"./manipulators/create-delimited":58,"./manipulators/split-space-delimited":63,"./px":65,"./settings/dictionary":69}]},{},[3]);
