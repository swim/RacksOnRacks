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