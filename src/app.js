define(function (require) {
  'use strict';
  var kit = require('core');
  require('constants');
  require('Vector');
  require('CPoint');
  require('Transform');
  require('FillImage');
  require('PetalFlower');
  require('canvasEvents');
  require('sceneEvents');
  require('objectEvents');
  require('settingsEvents');

  var _globalInit = function() {
    window.kit = new kit();
    initKeyboard();
    kit.encoder = new GIFEncoder();
    setTimeout(window.initInterface, 400);
  };

  if (document.readyState === 'complete') {
    _globalInit();
  } else {
    window.addEventListener('load', _globalInit , false);
  }
  return window.kit;
});