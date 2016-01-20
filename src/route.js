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