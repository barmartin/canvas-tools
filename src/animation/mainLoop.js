define(function(require) {
  'use strict';
  var kit = require('core');
  var CPoint = require('CPoint');
  var Vector = require('Vector');
  var constants = require('constants');
  var _u = require('util');

  // This is the main sceneLoop
  kit.prototype.sceneLoop = function() {
    if(!this.animationMode||this.keyFrames.length<2) {
      this.stopScene();
      window.updateInterface();
      return;
    }
    if (this.sceneMode === constants.SCENE_GIF) {
      this.delta += this.gifFramerate;
    } else {
      this.delta = _u.msTime()-this.segmentStartTime;
    }
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
    if(this.sceneMode === constants.SCENE_GIF) {
      // TODO Worker threads
      this.encoder.addFrame(this.context);
      setTimeout(function(){
          window.kit.sceneLoop();
        }, 
      0.01);
    } else {
      // TODO, do faster callbacks checking for frameDelay (smooth it)
      setTimeout(function(){
        window.kit.sceneLoop();
      }, 
      window.kit.frameDelay);
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
      window.updateInterface();
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
        console.log(newState.position.x + '::::');
        newState.scale = obFrom.scale*(1.0-sig)+ob.scale*sig;

        kit.objList[objIndex].setState(newState);
        objIndex++;
      });
    }
    setTimeout(function(){window.kit.segmentLoop()}, window.kit.frameDelay);

  }

  return kit
});