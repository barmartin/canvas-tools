define(function (require) {
  'use strict';
  var kit = require('core');
  require('constants');
  require('Vector');
  require('CPoint');
  require('Transform');
  require('FillImage');
  require('PetalFlower');
  require('mainLoop');
  require('canvasEvents');
  require('sceneEvents');
  require('objectEvents');
  require('settingsEvents');

  var _globalInit = function() {
    window.kit = new kit();
    window.initInterface();
  };

  if (document.readyState === 'complete') {
    _globalInit();
  } else {
    window.addEventListener('load', _globalInit , false);
  }
  return window.kit;
});