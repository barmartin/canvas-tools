define(function (require) {
  'use strict';
  var constants = require('constants');
  var _u = require('util');
  var PetalFlower = require('PetalFlower');
  var Vector = require('Vector');
 // var Transform = require('Transform');

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
    this.frameDelay = 40;
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
    this.maxRadius = Math.sqrt(this.midWidth*this.midWidth+this.midHeight*this.midHeight);
    this.controlPointRadius = constants.CONTROL_POINT_RADIUS;

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
        // this.addBackGroundImage('  ', 'Ray Scope', 'http://serescosmicos.tumblr.com/post/94587874401');
        // this.addFillImage('http://38.media.tumblr.com/b07bed8de1b02eb756b997872d9560b5/tumblr_nd96zsHxum1tpen5so1_1280.jpg', 'Dark Mountain', 'http://universeobserver.tumblr.com/post/101015776326/gorettmisstag-by-anthony-hurd');
        // this.addBackGroundImage('http://33.media.tumblr.com/9383f1a92b139f8e2aab5c7d52528e4d/tumblr_ndg4fznxkO1syynngo1_500.jpg', '', 'http://lucysbasement.tumblr.com/post/100007359383');
      }
      this.redraw();
    }

    // Setup Canvas Events, Initialize Objects and Context
    this.initializeCanvas();
  }

  // Initialize Objects and Set the First KeyFrame
  // Only run when the package is initialized
  kit.prototype.build = function() {
    var kit = this;
    _u.each(_u.range(0, this.initList.length), function(i) {
      if (kit.initList[i] === 'flower') {
        kit.objList.push(new PetalFlower(kit, constants.DEFAULT_RAYS, 1, kit.canvasHeight/constants.DEFAULT_INNER_RADIUS_SCALAR, 
                                         kit.canvasHeight/constants.DEFAULT_OUTER_RADIUS_SCALAR, Vector.create(kit.midWidth, kit.midHeight)));
        kit.objTypes.push(['flower', constants.DEFAULT_RAYS, 1]);
      }
    });
    this.initFrame();
  }

  // This function is used on every scene change
  kit.prototype.redraw = function() {
    // Clear the canvas
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();

    // Reset stroke style in case of highlighted shape
    this.context.strokeStyle = '#' + this.lineColor;

    if(this.backgroundImageExists){
      this.context.drawImage(this.backgroundImage, 0, 0, this.canvasWidth, this.canvasHeight);
    } else {
      var rgb = _u.toRGB(this.backgroundColor);
      this.context.fillStyle = 'rgba('+rgb[0]+', ' + rgb[1] + ', ' + rgb[2] + ', ' + this.backgroundAlpha + ')';
      this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    var kit = this;
    /*if(this.fillImageExists) {
      kit.context.save();
      var ob = this.objList[0];
      ob.transform();
      this.fillImage.draw(new Transform(ob.center, ob.scale, ob.rotation), ob);
      kit.context.restore();
    } else { 
      this.fillImageExists = false;*/
      _u.each(this.objList, function(item) {
        kit.context.save();
        item.transform();
        item.draw();
        kit.context.restore();
      });    
     // this.fillImageExists = true;
      // Always draw active control points on top (last)
      if(this.editMode===constants.EDIT_SHAPE) {
        this.objList[kit.selectedObject].drawShapePoints();
      } 
      if(this.editMode===constants.EDIT_TRANSFORM) {
        this.objList[kit.selectedObject].drawTransformPoints();
      }
    //}
  }

  return kit;
});
