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