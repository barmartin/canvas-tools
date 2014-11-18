define(function(require) {
  'use strict';
  var kit = require('core');
  var constants = require('constants');
  var _u = require('util');
  var PetalFlower = require('PetalFlower');
  var Vector = require('Vector');

  kit.prototype.getSettings = function(data, preinit) {  
    return {'backgroundColor': this.backgroundColor, 'backgroundAlpha': this.backgroundAlpha, 'lineColor': this.lineColor, 
    'sourceMode': this.sourceMode, 'seamlessAnimation': this.seamlessAnimation};
  }

  kit.prototype.loadData = function(data, preinit) {
    this.objList = [];
    this.objTypes = [];
    this.resourceList = data[1];
    this.objTypes = data[2];
    this.keyFrames = data[3];

    this.objList = [];
    for(var i = 0; i < this.objTypes.length; i++) {
      if(this.objTypes[i][0] === 'flower') {
        this.objList.push(new PetalFlower(this, this.objTypes[i][1], this.objTypes[i][2], this.canvasHeight/constants.DEFAULT_INNER_RADIUS_SCALAR, 
                                          this.canvasHeight/constants.DEFAULT_OUTER_RADIUS_SCALAR, Vector.create(this.midWidth, this.midHeight)));
      } else if(this.objTypes[i][0] === 'polar') {
      }
    }

    this.options = data[0];
    // DNE is for backwards compatibility for JSON data
    if(_u.exists(this.options.backgroundColor)) {
      this.backgroundColor = this.options.backgroundColor;
    } else {
      this.backgroundColor = constants.BACKGROUND_COLOR;
    }
    if(_u.exists(this.options.backgroundAlpha)) {
      this.backgroundAlpha = this.options.backgroundAlpha;
    } else {
      this.backgroundAlpha = constants.BACKGROUND_ALPHA;
    }
    if(_u.exists(this.options.lineColor)) {
      this.lineColor = this.options.lineColor;
    } else {
      this.lineColor = constants.LINE_COLOR;
    }
    // Update the color pickers
    // TODO fix this
    this.currentSelector = 'bg-color';
    window.setColor('#'+this.backgroundColor);
    this.currentSelector = 'line-color';
    window.setColor('#'+this.lineColor);

    if(_u.exists(this.options.sourceMode)) {
      this.sourceMode = this.options.sourceMode;
    } else {
      this.sourceMode = constants.SOURCE_MODE;
    }
    if(_u.exists(this.options.seamlessAnimation)) {
      this.seamlessAnimation = this.options.seamlessAnimation;
    } else {
      this.seamlessAnimation = true;
    }
    
    this.backgroundImageExists = false;
    this.fillImageExists = false;
    if(typeof this.resourceList.backgroundImageSource === 'string'){
      this.addBackgroundImage(this.resourceList.backgroundImageSource, this.resourceList.backgroundImagePage, this.resourceList.backgroundImageLabel);
    }
    if(typeof this.resourceList.fillImageSource === 'string'){
      this.addFillImage(this.resourceList.fillImageSource, this.resourceList.fillImagePage, this.resourceList.fillImageLabel)
    }
    this.selectedObject = 0;
    this.segment = 0;
    this.setState();
  }

  return kit
});  