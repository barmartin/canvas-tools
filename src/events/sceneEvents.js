define(function(require) {
  'use strict';
  var kit = require('core');
  var constants = require('constants');
  var _u = require('util');
  var PetalFlower = require('PetalFlower');
  var Vector = require('Vector');

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
    _u.each(this.objList, function(item) {
      kit.context.save();
      item.transform();
      item.draw();
      kit.context.restore();
    });    
    // Always draw active control points on top (last)
    if(this.editMode===constants.EDIT_SHAPE) {
      this.objList[kit.selectedObject].drawShapePoints();
    } 
    if(this.editMode===constants.EDIT_TRANSFORM) {
      this.objList[kit.selectedObject].drawTransformPoints();
    } 
  }

  // Create a new keyframe, store all objects state
  kit.prototype.initFrame = function() {
    this.keyFrames[this.segment] = {};
    this.keyFrames[this.segment].obj = [];
    if(this.segment>0) {
      this.keyFrames[this.segment].timing = this.keyFrames[this.segment-1].timing;
      for(var i=0; i<this.objList; i++) {
        this.keyFrames[this.segment].obj[i].rotation = this.keyFrames[this.segment-1].obj[i].rotation;
        this.keyFrames[this.segment].obj[i].center = this.keyFrames[this.segment-1].obj[i].center;
        this.keyFrames[this.segment].obj[i].scale = this.keyFrames[this.segment-1].obj[i].scale;
      }
    // Initialization case (first keyFrame)
    } else {
      this.keyFrames[this.segment].timing = 1.0;
      for(var ind=0; ind<this.objList; ind++) {
        this.keyFrames[this.segment].obj[ind].rotation = 0;
        this.keyFrames[this.segment].obj[ind].position = new Vector(this.objList[0].center.x, this.objList[0].center.y);
        this.keyFrames[this.segment].obj[ind].scale = 1.0;
      }
    }
    // Store the shape
    this.storeFrame();
  }

  kit.prototype.clearScene = function(){
    this.objList = [];
    this.objTypes = [];
    this.resourceList = {};
    this.backgroundImageExists = false;
    this.fillImageExists = false;

    this.keyFrames = [];
    this.segment = 0;
    this.objList.push(new PetalFlower(this, constants.DEFAULT_RAYS, 1, this.canvasHeight/constants.DEFAULT_INNER_RADIUS_SCALAR, 
                                      this.canvasHeight/constants.DEFAULT_OUTER_RADIUS_SCALAR, Vector.create(this.midWidth, this.midHeight)));
    this.objTypes.push(['flower', constants.DEFAULT_RAYS, 1]);
    this.selectedObject = 0;
    this.initFrame();
    this.redraw();
    window.updateInterface();
  }

  /*
   * Used to store the canvas configuration shape to the current frame
   */
  kit.prototype.storeFrame = function(){
    for( var i = 0; i<this.objList.length; i++){
        this.keyFrames[this.segment].obj[i] = this.objList[i].getState();
    }
    this.keyFrames[this.segment].timing = parseFloat(document.getElementById('length').value);
    var val = document.getElementById('rotation').value;
    this.keyFrames[this.segment].obj[this.selectedObject].rotation = parseFloat(val)*constants.TWOPIDIV360;
  }

  kit.prototype.removeSegment = function(){
    if(this.keyFrames.length<2) {
      return;
    }
    _u.removeArrayEntry(this.keyFrames, this.segment);
    if(this.segment===this.keyFrames.length) {
      this.segment--;
    }
    window.updateInterface();
    this.setState();
    this.redraw();
  }

  kit.prototype.removeLast = function(){
    if(this.keyFrames.length<2) {
      return;
    }
    _u.removeArrayEntry(this.keyFrames, this.keyFrames.length-1);
    if(this.segment===this.keyFrames.length) {
      this.segment--;
    }
    window.updateInterface();
    this.setState();
    this.redraw();
  }

  // TODO add worker threads to GIF builder
  kit.prototype.gifInit = function() {
    this.encoder.setRepeat(-1);
    this.encoder.setDelay(this.gifFramerate);
    this.encoder.setSize(this.canvasWidth, this.canvasHeight); 
    this.encoder.start();
    // TODO check
    /*this.encoder.on('finished', function(blob) {
      window.open(URL.createObjectURL(blob));
    }); */
    this.sceneMode = constants.SCENE_GIF;
    this.loopInit();
    this.redraw();
  }

  kit.prototype.gifComplete = function() {
    //this.encoder.render();
    this.encoder.finish();
    var binary_gif = this.encoder.stream().getData(); //notice this is different from the as3gif package!
    var data_url = 'data:image/gif;base64,'+window.encode64(binary_gif);
    //window.open(data_url);
    //document.location.href = data_url;
    window.open(data_url, '_blank');
    this.sceneMode = constants.SCENE_NORMAL;
    this.stopScene();
  }

  kit.prototype.loopInit = function() {
    this.animationMode = true;
    this.segment = 0;
    this.loopStartTime = _u.msTime();
    this.segmentStartTime = this.loopStartTime;
    this.settingShelf = {'editMode': this.editMode, 'toggleCurveColor': this.toggleCurveColor};
    this.editMode = constants.EDIT_NONE;
    this.toggleCurveColor = false;
    window.updateInterface();
  }

  kit.prototype.stopScene = function() {
    this.editMode = this.settingShelf.editMode;
    this.toggleCurveColor = this.settingShelf.toggleCurveColor;
    this.sceneReset();
  }

  kit.prototype.sceneReset = function() {
    this.animationMode = false;
    this.segment=0;
    this.setState();
    this.redraw();
  }

  /*
   * Used to set the canvas state with the keyframe
   *
   */
  kit.prototype.setState = function() {
    for( var i=0; i<this.objList.length; i++) {
      this.objList[i].setState(this.keyFrames[this.segment].obj[i]);
    }
  }

  return kit
});  
