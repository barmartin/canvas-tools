define(function(require) {
  'use strict';
  var kit = require('core');
  var constants = require('constants');
  var _u = require('util');
  var PetalFlower = require('PetalFlower');
  var CPoint = require('CPoint');
  var Vector = require('Vector');

  // This is the main sceneLoop
  kit.prototype.sceneLoop = function() {
    if(!this.animationMode||this.keyFrames.length<2) {
      this.stopScene();
      this.digest();
      return;
    }
    if (this.sceneMode === constants.SCENE_GIF) {
      this.delta += this.gifFramerate;
    } else {
      this.delta = _u.msTime()-this.segmentStartTime;
    }
    var lastStartTime = _u.msTime();
    // pauseTime is the resting time at the first frame
    if(this.segment === 0 && this.delta >= this.pauseTime) {
      this.segment = 1;
      this.delta = 0;
      this.segmentStartTime = _u.msTime();
    } else if(this.segment !== 0) {
      if(this.delta > this.keyFrames[this.segment-1].timing*1000) {
        // If not seamlessly looping set to start without incremental return
        if(this.segment === this.keyFrames.length-1 && this.seamlessAnimation === false) {
          this.segment = 0;
          this.setState();
          this.segment = 1;
          this.delta = 0;
          this.segmentStartTime = _u.msTime();
        } else if(this.segment < this.keyFrames.length) {
          this.setState();
          // segment sometime is larger than the keyFrame array
          // manipulation in animation mode is disabled for a few reasons
          this.segment++;
          if(this.sceneMode === this.GIF) {
            this.delta = 0;
          } else {
            this.segmentStartTime = _u.msTime();
          }
        } else {
          if(this.sceneMode === constants.SCENE_GIF) {
            this.gifComplete();
            return;
          }
          this.segment = 0;
          this.setState();
          this.segmentStartTime = _u.msTime();
        }
      } else {
        this.updateSegment(this.delta);
      }
    }
    // Update UI
    this.digest();
    if(this.sceneMode === constants.SCENE_GIF) {
      // TODO Worker threads
      this.encoder.addFrame(this.context);
      setTimeout(function(){
          window.kit.sceneLoop();
        }, 
      0.01);
    } else {
      // TODO, do faster callbacks checking for frameDelay (smooth it)
      var processTime = _u.msTime()-lastStartTime;
      setTimeout(function(){
        window.kit.sceneLoop();
      }, 
      Math.max(0, window.kit.frameDelay-processTime));
    }
  }

  kit.prototype.updateSegment = function(delta) {
    var keyTo = this.segment;
    if(this.segment === this.keyFrames.length) {
      keyTo = 0;
    }
    var sig = delta/(this.keyFrames[keyTo].timing*1000);
    var objIndex = 0;
    var kit = this;
    _u.each(this.keyFrames[keyTo].obj, function(ob) {
      var index = 0;
      var newCps = [];
      var obFrom = kit.keyFrames[kit.segment-1].obj[objIndex];
      _u.each(ob.shapePoints, function(cp) {
        var newX = obFrom.shapePoints[index].x*(1.0-sig)+cp.x*sig;
        var newY = obFrom.shapePoints[index].y*(1.0-sig)+cp.y*sig;
        var newPoint = new CPoint(kit, newX, newY, kit.objList[objIndex], index);
        newCps.push(newPoint);
        index++;
      });
      var newState = {
        shapePoints:newCps
      }
      var fromRotation = obFrom.rotation;
      var toRotation = ob.rotation;
      var del = toRotation-fromRotation;
      // Always rotate the shortest path to the new angle
      if(Math.abs(del) > Math.PI) {
        if(del<0) {
          toRotation+=2*Math.PI;
        } else {
          fromRotation+=2*Math.PI;
        }
      }
      newState.rotation = (fromRotation*(1-sig)+toRotation*sig)%360;
      newState.position = Vector.create(obFrom.position.x*(1.0-sig)+ob.position.x*sig,
                          obFrom.position.y*(1.0-sig)+ob.position.y*sig);
      newState.scale = obFrom.scale*(1.0-sig)+ob.scale*sig;
      kit.objList[objIndex].setState(newState);
      objIndex++;
    });
  }

  // Segment Looping needs to be updated (disabled functionality)
  kit.prototype.segmentLoop = function() {
    if(!this.animationMode || this.segment === 0) {
      this.setState();
      this.digest();
      return;
    }
    var delta = _u.msTime()-this.loopStartTime-this.pauseTime;
    // before pause
    if( delta < 0) {
      if(this.setTime !== 0) {
        this.segment--;
        this.setState();
        this.segment++;
        this.setTime = 0;
      }
    // after segment end
    } else if(delta > this.keyFrames[this.segment].timing*1000) {
      if(delta > this.keyFrames[this.segment].timing*1000 + this.pauseTime) {
        this.loopStartTime = _u.msTime();
        this.segment--;
        this.setState();
        this.segment++;
        this.setTime = 0;
      } else if(this.setTime !== this.keyFrames[this.segment].timing*1000){
        this.setState();
        this.setTime = this.keyFrames[this.segment].timing*1000;
      }
    } else {
      var sig = delta/(this.keyFrames[this.segment].timing*1000);
      var objIndex = 0;
      var kit = this;
      _u.each(this.keyFrames[this.segment].obj, function(ob) {
        var index = 0;
        var newCps = [];
        _u.each(ob.shapePoints, function(cp) {
          var newX = kit.keyFrames[kit.segment-1].obj[objIndex].shapePoints[index].x*(1.0-sig)+cp.x*sig;
          var newY = kit.keyFrames[kit.segment-1].obj[objIndex].shapePoints[index].y*(1.0-sig)+cp.y*sig;
          var newPoint = new CPoint(kit, newX, newY, kit.objList[objIndex], index);
          newCps.push(newPoint);
          index++;
        });
        var newState = {shapePoints:newCps};

        var obFrom = kit.keyFrames[kit.segment-1].obj[objIndex];

        var fromRotation = obFrom.rotation;
        var toRotation = ob.rotation;
        var del = toRotation-fromRotation;
        if( Math.abs(del) > 180 ) {
          if(del<0) {
            toRotation+=360;
          } else {
            fromRotation+=360;
          }
        }
        newState.rotation = (fromRotation*(1-sig)+toRotation*sig)%360;
        newState.position = Vector.create(obFrom.center.x*(1.0-sig)+ob.center.x*sig,
                            obFrom.center.y*(1.0-sig)+ob.center.y*sig);
        newState.scale = obFrom.scale*(1.0-sig)+ob.scale*sig;

        kit.objList[objIndex].setState(newState);
        objIndex++;
      });
    }
    setTimeout(function(){window.kit.segmentLoop()}, window.kit.frameDelay);

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
      this.keyFrames[this.segment].timing = constants.DEFAULT_LENGTH;
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
    this.digest();
  }

  /*
   * Used to store the canvas configuration shape to the current frame
   */
  kit.prototype.storeFrame = function(){
    for( var i = 0; i<this.objList.length; i++){
        this.keyFrames[this.segment].obj[i] = this.objList[i].getState();
    }
    var val = this.objList[this.selectedObject].rotation;
  }

  kit.prototype.removeKeyframe = function(){
    if(this.keyFrames.length<2) {
      return;
    }
    _u.removeArrayEntry(this.keyFrames, this.segment);
    if(this.segment===this.keyFrames.length) {
      this.segment--;
    }
    this.setState();
    this.redraw();
    this.digest();
  }

  kit.prototype.removeLast = function(){
    if(this.keyFrames.length<2) {
      return;
    }
    _u.removeArrayEntry(this.keyFrames, this.keyFrames.length-1);
    if(this.segment===this.keyFrames.length) {
      this.segment--;
    }
    this.setState();
    this.redraw();
    this.digest();
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
    this.setTempModes(constants.EDIT_NONE, false);
  }

  kit.prototype.stopScene = function() {
    this.restoreModes();
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

  kit.prototype.selectFirst = function() {
    this.segment = 0;
    this.setState();
  }
  kit.prototype.selectPrev = function() {
    if(this.segment > 0) {
      this.segment--;
      for( var i=0; i<this.objList.length; i++) {
        this.objList[i].setState(this.keyFrames[this.segment].obj[i]);
      }
    }
  }
  kit.prototype.selectNext = function() {
    this.segment++;
    if(this.segment >= this.keyFrames.length) {
      this.initFrame();
    } else {
      this.setState();
    }
  }
  kit.prototype.selectLast = function() {
    this.segment = this.keyFrames.length-1;
    this.setState();
  }

  return kit
});  
