define(function(require) {
  'use strict';
  var kit = require('core');
  var constants = require('constants');
  var _u = require('util');
  var Vector = require('Vector');
  var PetalFlower = require('PetalFlower');
  var FillImage = require('FillImage');

  // Store all objects current configuration to keyframes
  kit.prototype.setState = function() {
    for(var i=0; i<this.objList.length; i++) {
      this.objList[i].setState(this.keyFrames[this.segment].obj[i]);
    }
  }

  // Set all objects configuration with current keyframe
  kit.prototype.getState = function() {
    for(var i = 0; i<this.objList.length; i++){
      this.keyFrames[this.segment].obj[i] = this.objList[i].getState();
    }
    this.keyFrames[this.segment].timing = parseFloat(document.getElementById('length').value);
  }

  // get the selected object rotation in degrees
  kit.prototype.getRotation = function() {
    var rotationDegrees = this.keyFrames[this.segment].obj[this.selectedObject].rotation/this.constants.TWOPIDIV360;
    return Math.floor(rotationDegrees * 100) / 100;
  }

  kit.prototype.getRotationMatrix = function(angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return [cos, sin, -sin, cos, 0, 0];
  }

  // Set the current rotation in radians
  // Value passed to method should already be in radians
  kit.prototype.setRotation = function(val) {
    this.objList[this.selectedObject].rotation = val;
    this.keyFrames[this.segment].obj[this.selectedObject].rotation = val;
    this.objList[this.selectedObject].allPetals = [];
    this.objList[this.selectedObject].createPetals();
    this.redraw();
  }

  // Create a new object of the default type, update all keyframes with init configuration
  // Select the new object
  kit.prototype.addObject = function(){
    if(this.objList.length >= constants.MAX_OBJECTS) {
      return;
    }
    this.objList.push(new PetalFlower(this, constants.DEFAULT_RAYS, 1, this.canvasHeight/constants.DEFAULT_INNER_RADIUS_SCALAR, 
                                      this.canvasHeight/constants.DEFAULT_OUTER_RADIUS_SCALAR, Vector.create(this.midWidth, this.midHeight)));
    this.objTypes.push(['flower', constants.DEFAULT_RAYS, 1]);
    for(var i=0; i<this.keyFrames.length; i++) {
      this.keyFrames[i].obj[this.objList.length-1] = this.objList[this.objList.length-1].getState();
      this.keyFrames[i].obj[this.objList.length-1].timing = document.getElementById('length').value;
    }
    var ind = this.objList.length-1;
    this.selectedObject = ind;
    this.redraw();
  }

  // Remove the object currently selected
  kit.prototype.removeObject = function(){
    if(this.objList.length<2) {
      return;
    }
    _u.removeArrayEntry(this.objList, this.selectedObject);
    _u.removeArrayEntry(this.objTypes, this.selectedObject);
    var kit = this;
    _u.each(this.keyFrames, function(keyFrame) {
      _u.removeArrayEntry(keyFrame.obj, kit.selectedObject);
    });
    if(this.selectedObject===this.objList.length) {
      this.selectedObject--;
    }
    this.redraw();
    window.updateInterface();
  }

  // Add a new fill image.  Label and Page are optional arguments
  kit.prototype.addFillImage = function (src, page, label) {
    this.fillImage = new FillImage(src, page);
    this.fillImage.onload = function () {
      window.kit.redraw();
    }
    this.resourceList.fillImageSource = src;
    this.resourceList.fillImagePage = page;
    this.resourceList.fillImageLabel = label;
  };

  // Add a new background image.  Label and Page are optional arguments
  kit.prototype.addBackgroundImage = function (src, page, label) {
    kit.backgroundImageExists = false;
    this.backgroundImage = new Image();
    this.backgroundImage.onload = function () {
      window.kit.backgroundImageExists = true;
      window.kit.redraw();
    };
    this.backgroundImage.src = src;
    this.resourceList.backgroundImageSource = src;
    this.resourceList.backgroundImagePage = page;
    this.resourceList.backgroundImageLabel = label;
    this.redraw();
  };

  // Update the amount of Petals in the flower
  kit.prototype.updatePetalCount = function() {
    var kVal = document.getElementById('k').value;
    if (isNaN(kVal)) {
      return;
    }
    var object = this.objList[this.selectedObject];
    if(object instanceof PetalFlower) {
      this.objList[this.selectedObject] = new PetalFlower(this, kVal, object.radialAccent, this.canvasHeight/constants.DEFAULT_INNER_RADIUS_SCALAR,
                                                          this.canvasHeight/constants.DEFAULT_OUTER_RADIUS_SCALAR, Vector.create(this.midWidth, this.midHeight));
      this.objTypes[this.selectedObject][1] = kVal;
      this.objList[this.selectedObject].updateRadialPoint();
      this.setState();
      this.redraw();
    }
  }

  // Update the crossover width of each petal
  // RadialAccent < 1 creates gaps between petal
  // RadialAccent > 1 creates wider Petals
  kit.prototype.accentRadial = function() {
    var radialScalar = document.getElementById('radialScalar').value;
    if (isNaN(radialScalar)) {
      return;
    }
    radialScalar = _u.validateFloat(radialScalar);
    this.objTypes[this.selectedObject][2] = radialScalar;
    var thisObject = this.objList[this.selectedObject];
    if(radialScalar > 0&&radialScalar < thisObject.petalCount) {
      thisObject.accentRadialPoint(radialScalar);
      this.setState();
      this.redraw();
    }
  }

  return kit
});  
