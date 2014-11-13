define(function (require) {
  'use strict';
  var constants = require('constants');
  var _u = require('util');

  var kit = function () {
    // Make these classes accessable by the interface script
    this.constants = constants;
    this._u = _u;

    this.canvas = document.getElementById('myCanvas');
    this.context = this.canvas.getContext('2d');

    // EVENTS
    this.canvasMode = 'static';

    // ANIMATION
    this.keyFrames = [];
    this.updateMode = false;
    this.animationMode = false;
    this.segmentStartTime = 0;
    this.segment = 0;
    this.loopStartTime = 0;
    this.setTime = 0;
    this.pauseTime = 0;
    this.frameDelay = 10;
    this.gifFramerate = 200;
    this.delta = -this.frameDelay;

    this.sceneMode = constants.SCENE_NORMAL;

    // GIF
    this.encoder = '';
    this.delayTime = 0;

    // TODO move initializing constants to constants.js
    this.initList = ['flower'];
    this.pattern = null;
    this.bodybg = constants.BODY_BACKGROUND_COLOR;

    this.backgroundColor = constants.BACKGROUND_COLOR;
    this.lineColor = constants.LINE_COLOR;
    this.backgroundAlpha = constants.BACKGROUND_ALPHA;

    var key = this._u.getKeys(constants.SOURCE_MODES)[0];
    this.sourceMode = constants.SOURCE_MODES[key];
    // SETUP ID to all interface elements and setter methods in package

    // CANVAS SETTINGS
    this.canvasWidth = 640;
    this.canvasHeight = 640;
    this.midWidth = this.canvasWidth/2;
    this.midHeight = this.canvasHeight/2;
    this.controlPointRadius = 6;

    this.editMode = constants.EDIT_SHAPE;
    this.toggleCurveColor = false;
    this.seamlessAnimation = true;
    this.fieldFocus = false;
    this.settingShelf = {'toggleCurveColor': this.toggleCurveColor, 'editMode': this.editMode};

    this.objList = [];
    this.objTypes = [];
    this.selectedObject = 0;

    // Image Resources
    this.resourceList = {};
    this.backgroundImageExists = false;
    this.fillImageExists = false;

    // TESTING
    this.debugMode = true;

    // Setup Canvas Events, Initialize Objects and Context
    this.initializeCanvas = function() {
      // Setup the canvas event binding
      this.bindEvents();
      // Setup the canvas
      this.build();

      // Testing Code
      if(this.debugMode===true) {
        var dataz = window.getSampleJSON();
        this.loadData(dataz, false);
        // this.addFillImage('http://41.media.tumblr.com/5a22f64bd4564fa750b150e0358d1ded/tumblr_na82n1PmJl1t02n2vo1_500.jpg', 'Color Wheel Ray', 'http://annaporreca.tumblr.com/post/84120798025/sunrise-sunset');
        // this.addBackGroundImage('http://40.media.tumblr.com/56ff609390ee74b3994f311a8f13e0d5/tumblr_n4qrodAcxV1qaf77co1_1280.jpg', 'Ray Scope', 'http://serescosmicos.tumblr.com/post/94587874401');
        // this.addFillImage('http://38.media.tumblr.com/b07bed8de1b02eb756b997872d9560b5/tumblr_nd96zsHxum1tpen5so1_1280.jpg', 'Dark Mountain', 'http://universeobserver.tumblr.com/post/101015776326/gorettmisstag-by-anthony-hurd');
        // this.addBackGroundImage('http://33.media.tumblr.com/9383f1a92b139f8e2aab5c7d52528e4d/tumblr_ndg4fznxkO1syynngo1_500.jpg', '', 'http://lucysbasement.tumblr.com/post/100007359383');
      }
      this.redraw();
    }

    // Setup Canvas Events, Initialize Objects and Context
    this.initializeCanvas();
  }
  return kit;
});
