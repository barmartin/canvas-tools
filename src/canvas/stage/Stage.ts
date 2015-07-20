module cKit.stage {

  import _u = cKit.util;
  import stage = cKit.stage;
  import Vector = cKit.elements.Vector;
  import objects = cKit.objects;
  import elements = cKit.elements;
  import Keyframe = cKit.elements.Keyframe;

  // LOOPING TYPE
  export enum sceneModes {
    SCENE_NORMAL= 0,
    SCENE_GIF= 1
  }

  export class Stage {
    kit: cKit.CanvasKit;
    keyframes:Array<Keyframe>;
    stageConfig:StageConfig;

    sceneMode:number = sceneModes.SCENE_NORMAL;
    /* is animating */
    animationMode:boolean = false;

    // Set when scene loop starts over or begins
    loopStartTime:number;

    // Set when segment changes
    segmentStartTime:number;
    segment:number = 0;

    constructor(kit:any) {
      this.kit = kit;
      // this.keyframes = keyframeStage.keyFrames;
      this.keyframes = [new Keyframe(this.getState(), 0)];
      this.stageConfig = new StageConfig(kit);
    }

    /* Called to initiate play mode */
    init() {
      this.animationMode = true;
      this.segment = 0;
      this.loopStartTime = this.segmentStartTime = _u.msTime();
      if(this.stageConfig.pauseTime>0) {
        this.stageConfig.paused = true;
      } else {
        this.stageConfig.paused = false;
      }
      kit.loadFrame();
    }

    clearStage() {
      this.stageConfig.backgroundImage = null;
      this.segment = 0;
      // this.keyframeStage = new KeyframeStage();
      this.keyframes = [new Keyframe(this.getState(), 0)];
    }

    /* Main Scene Loop
     * New mode is timestamp based not delta based
     * Currently building keyframe gui where you can enable when keyframes effect
     * For now all objects must have a state which includes all transforms and control points
     * These are updated at each loop by interpolating between states of current and next keyframe
     * The processing time is removed from the callback time at the end of the loop
     * TODO --MVP create a new canvas which is set when callback happens
     */

    sceneLoop() {
      var kit = this.kit;
      /* Stop has been clicked since the last update or there isn't enough keyframes */
      if (!this.animationMode || this.keyframes.length < 2) {
        kit.stopScene();
        kit.digest();
        return;
      }

      var cycleStartTime =  _u.msTime();
      /* Gif creation does not rely on cycle speed */
      //if (this.sceneMode === sceneModes.SCENE_GIF) {
      //  this.delta += kit.gifFramerate;
      //}

      // pauseTime is the resting time at the first frame
      if (this.stageConfig.paused) {
        var delta = cycleStartTime - this.loopStartTime;
        if(delta >= this.stageConfig.pauseTime) {
          this.stageConfig.paused = false;
          /* For now if delay is longer than pauseTime it should proceed towards next click */
          this.loopStartTime = this.segmentStartTime = cycleStartTime;
        }
      } else {
        var delta = cycleStartTime - this.segmentStartTime;
        // Last segment animation, smooth animate or start over
        if (this.segment === this.keyframes.length - 1) {
          /* Restart animation back to keyframe 0 */
          if (delta > this.stageConfig.seamlessAnimationTime) {
            if (this.stageConfig.pauseTime > 0) {
              this.stageConfig.paused = true;
            }
            this.loopStartTime = this.segmentStartTime = cycleStartTime;
            this.segment = 0;
            kit.loadFrame();
          } else {
            this.updateSegment(delta, this.stageConfig.seamlessAnimationTime);
            kit.redraw();
          }
        } else {
          /* Animation segment completion for segment which is not the last one */
          if (delta > this.keyframes[this.segment + 1].timestamp - this.keyframes[this.segment].timestamp) {
            if (this.segment === this.keyframes.length - 1) {
              // If animate smoothly to first frame
              if (this.stageConfig.seamlessAnimationTime > 0) {
                this.segment++;
                kit.loadFrame();
                //if (kit.sceneMode === constants.SCENE_GIF) {
                // this.delta = 0;
                // } else {
                this.segmentStartTime = cycleStartTime;
                // }
                // Animate directly to frame 0, no smooth animation
              } else {
                this.loopStartTime = this.segmentStartTime = cycleStartTime;
                this.segment = 0;
                kit.loadFrame();
                if (this.stageConfig.pauseTime > 0) {
                  this.stageConfig.paused = true;
                }
              }
            } else {
              //if (kit.sceneMode === constants.SCENE_GIF) {
              // // this.gifComplete();
              // return;
              // }
              this.segment++;
              kit.loadFrame();
              this.loopStartTime = this.segmentStartTime = cycleStartTime;
            }
          } else {
            this.updateSegment(delta, this.keyframes[this.segment + 1].timestamp - this.keyframes[this.segment].timestamp);
            kit.redraw();
          }
        }
      }
      // Update UI
      kit.digest();
      if (kit.stage.sceneMode === sceneModes.SCENE_GIF) {
        // TODO Worker threads
        /*this.encoder.addFrame(this.context);
         setTimeout(function(){
         cKit.kit.sceneLoop();
         },
         0.01);
         */
      } else {
        // TODO, do faster callbacks checking for frameDelay (smooth it)
        var processTime = _u.msTime() - cycleStartTime;
        if(this.stageConfig.frameRate < processTime) {
          console.warn('Reduce framerate to improve animation smoothness');
        }
      }
      setTimeout(function () {
            cKit.kit.stage.sceneLoop();
          },
          Math.max(0, this.stageConfig.frameRate - processTime));
    }

    updateSegment(delta: number, segmentLength: number) {
      var kit: cKit.CanvasKit = this.kit;
      var self = this;
      var keyTo: number;
      var sig: number = delta / segmentLength;
      if (this.segment === this.keyframes.length-1) {
        keyTo = 0;
      } else {
        keyTo = this.segment+1;
      }

      for (var i = 0; i < this.keyframes[keyTo].objStates.length; i++) {
        var newCPs = [];
        var obFrom = self.keyframes[this.segment].objStates[i];
        var obTo = self.keyframes[keyTo].objStates[i];
        for (var j = 0; j < obTo.cPStates.length; j++) {
          var newX = obFrom.cPStates[j].x * (1.0 - sig) + obTo.cPStates[j].x * sig;
          var newY = obFrom.cPStates[j].y * (1.0 - sig) + obTo.cPStates[j].y * sig;
          var cp = new Vector(newX, newY);
          newCPs.push(cp);
        }

        var fromRotation = obFrom.attributes['rotation'];
        var toRotation = obTo.attributes['rotation'];
        var del = toRotation - fromRotation;
        // Always rotate the shortest path to the new angle
        if (Math.abs(del) > Math.PI) {
          if (del < 0) {
            toRotation += 2 * Math.PI;
          } else {
            fromRotation += 2 * Math.PI;
          }
        }

        var thisObj = kit.resourceList.objects[i];
        thisObj.rotation = (fromRotation * (1 - sig) + toRotation * sig) % 360;
        thisObj.center = new Vector(obFrom.attributes['center'].x * (1.0 - sig) + obTo.attributes['center'].x * sig,
            obFrom.attributes['center'].y * (1.0 - sig) + obTo.attributes['center'].y * sig);
        thisObj.scale = obFrom.attributes['scale'] * (1.0 - sig) + obTo.attributes['scale'] * sig;
        thisObj.setControlPoints(newCPs);
      }
    }
    exportKeyframes() {
      var frames = [];
      for (var i = 0; i < this.keyframes.length; i++) {
        frames.push(this.keyframes[i].export());
      }
      return frames;
    }
    importFrames(frames: Array<elements.Keyframe>) {
      this.keyframes = [];
      for (var i = 0; i<frames.length; i++) {
        /* TODO -mvp */
        //this.keyframes.push(new Keyframe(frames[i].stageStates.timestamp));
        var thisFrame = frames[i];
        this.keyframes.push(new Keyframe(thisFrame.objStates, thisFrame.timestamp));
      }
      this.loadState(this.segment);
      this.kit.redraw();
    }

    /* Removed single segment animation at one point
     * needs to be redone now, probably won't add again
     * until there is a keyframe GUI
     * */

    /*
     // Segment Looping needs to be updated (disabled functionality)
     CanvasKit.prototype.segmentLoop = function() {
     if(!this.animationMof || this.segment === 0) {
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
     } else if(this.setTime !== this.keyframes[this.segment].timing*1000){
     this.setState();
     this.setTime = this.keyframes[this.segment].timing*1000;
     this.setTime = this.keyframes[this.segment].timing*1000;
     }
     } else {
     var sig = delta/(this.keyframes[this.segment].timing*1000);
     var objIndex = 0;
     var CanvasKit = this;
     _u.each(this.keyframes[this.segment].obj, function(ob) {
     var index = 0;
     var newCps = [];
     _u.each(ob.shapePoints, function(cp) {
     var newX = CanvasKit.keyframes[CanvasKit.segment-1].obj[objIndex].shapePoints[index].x*(1.0-sig)+cp.x*sig;
     var newY = CanvasKit.keyframes[CanvasKit.segment-1].obj[objIndex].shapePoints[index].y*(1.0-sig)+cp.y*sig;
     var newPoint = new kit.CPoint(CanvasKit, newX, newY, kit.resourceList.objects[objIndex], index);
     newCps.push(newPoint);
     index++;
     });

     var newState = {
     shapePoints: newCps,
     rotation: 0,
     position: Vector.zeroVector(),
     scale: 0
     };

     var obFrom = kit.stage[CanvasKit.segment-1].obj[objIndex];

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

     kit.resourceList.objects[objIndex].setState(newState);
     objIndex++;
     });
     }
     setTimeout(function(){cKit.kit.segmentLoop()}, cKit.kit.frameDelay);

     }

     // This method is not currently in use
     CanvasKit.prototype.playSegment = function() {
     if(this.keyframes.length < 2) {
     return;
     }
     this.animationMode = true;
     if(this.segment !== 0) {
     this.segment--;
     }
     this.setState();
     this.segment++;
     this.setTime = 0;
     this.loopStartTime = new Date().getTime();
     this.segmentLoop();
     };

     */

    /* set single attribute state for a keyFrame (for field inputs/mouse drag changes) */
    setKeyframeAttribute(target: string, segment: number, objIndex: number, value: any) {
      var thisObject = this.keyframes[segment].objStates[objIndex];
      if(target === "cp") {
        // thisObject.cPStates
      } else {
        thisObject.attributes[target] = value;
      }
    }

    /* Iterate through objects and retrieve states to put into a keyframe */
    /* Used for creation of new keyframes */
    getState() {
      var objStates: Array<elements.KeyState> = [];
      for(var i=0; i<this.kit.resourceList.objects.length; i++) {
        objStates.push(this.kit.resourceList.objects[i].exportFrame());
      }
      return objStates;
    }

    /* Iterate through objects and save states into the keyframe requested */
    /* Used for setting an existing keyframe */
    storeState() {
      var keyStates: Array<elements.KeyState> = [];
      for(var i=0; i<kit.resourceList.objects.length; i++) {
        keyStates.push(kit.resourceList.objects[i].exportFrame());
      }
      this.keyframes[this.segment] = new Keyframe(keyStates, this.keyframes[this.segment].timestamp);
    }

    loadState(segment: number) {
      if(segment>=this.keyframes.length) {
        console.log('ERROR');
        //this.newState();
        return;
      }
      var theseStates = this.keyframes[segment].objStates;
      for(var i=0; i<theseStates.length; i++) {
        var objState = theseStates[i];
        /* TODO setup a stage location for this method */
        var ob = kit.resourceList.objects[i];
        Object.keys(objState.attributes).forEach( key => {
          ob[key] = objState.attributes[key];
        });
        ob.setControlPoints(objState.cPStates);
      }
      // this.resourceList.objects[i].setState(this.keyframes[this.segment].obj[i]);
    }


    newKeyframe() {
      var keyFrameTimestamp;

      if(this.keyframes.length==0) {
        keyFrameTimestamp = 0;
      } else if(this.keyframes.length===1) {
        keyFrameTimestamp = constants.DEFAULT_TIMING;
      } else {
        keyFrameTimestamp = 2*this.keyframes[this.keyframes.length - 1].timestamp-this.keyframes[this.keyframes.length - 2].timestamp;
      }
      this.keyframes.push(new elements.Keyframe(this.getState(), keyFrameTimestamp));
      /*  a deep copy of previous keyframe would be faster, but extra code...
       *   UI interactions don't need to be efficient yet, only animation events
       *   For now use objects state to create a new frame
       * */
      // this.storeState(this.keyframes.length-1);
      this.storeState();
    }

    /*
     * So far the only use of these next two methods
     * is to get the timing for the animation UI panel
     *
     */
    getSegmentTiming() {
      if(this.segment===this.keyframes.length-1) {
        return this.stageConfig.getAttribute('seamlessAnimationTime');
      } else {
        return this.stageConfig.uiTranslators['segmentLength'].export(this.keyframes[this.segment+1].timestamp - this.keyframes[this.segment].timestamp);
      }
    }

    setSegmentTiming(value: any) {
      var newDelta = this.stageConfig.uiTranslators['segmentLength'].import(value);
      if(this.segment<this.keyframes.length-1) {
        var theDiff = newDelta - this.keyframes[this.segment+1].timestamp + this.keyframes[this.segment].timestamp;
        for(var seg = this.segment+1; seg<this.keyframes.length; seg++) {
          this.keyframes[seg].timestamp = this.keyframes[seg].timestamp + theDiff; // could be negative
        }
      } else {
        this.stageConfig.seamlessAnimationTime = newDelta;
      }
    }
  }

  export class StageConfig {
    kit: CanvasKit;
    uiTranslators: Dictionary<elements.UITranslator>;
    /* delay @ start of full play cycle @ segment = 0 */
    pauseTime:number = constants.DEFAULT_PAUSETIME;
    paused:boolean;
    /* if > 0, final keyframe is added which animates smoothly to initial keyframe */
    seamlessAnimationTime:number = constants.DEFAULT_TIMING;

    backgroundImage:elements.ImageResource;

    /* if frameDelay > iff time it took to process this loop wait the diff */
    frameRate:number = constants.DEFAULT_FRAME_RATE;

    constructor(kit: CanvasKit) {
      this.kit = kit;
      this.uiTranslators = {};
      this.uiTranslators['frameRate'] =
          new elements.UINumber(1, 0, elements.CONSTRAINTS.MINMAX, 10000, 0);
      this.uiTranslators['segmentLength'] =
          new elements.UINumber(.001, 2, elements.CONSTRAINTS.MINMAX, Number.MAX_VALUE, 0);
    }

    setAttribute(target: string, value: number) {
      var translator;
      if(target === 'pauseTime') {
        translator = this.uiTranslators['segmentLength'];
      } else {
        translator = this.uiTranslators[target];
      }
      if(_u.exists(translator)) {
        this[target] = translator.import(value);
      }
    }
    getAttribute(target:string) {
      var translator;
      if(target === 'pauseTime' || target === 'seamlessAnimationTime') {
        translator = this.uiTranslators['segmentLength'];
      } else {
        translator = this.uiTranslators[target];
      }
      if(_u.exists(translator)) {
        return translator.export(this[target]);
      }
    }

    exportStageConfig() {
      return {
        pauseTime: this.pauseTime,
        seamlessAnimationTime: this.seamlessAnimationTime,
        frameRate: this.frameRate,
        backgroundImage: this.kit.resourceList.images.indexOf(this.backgroundImage)
      }
    }

    importStageConfig(config) {
      this.pauseTime = config.pauseTime;
      this.seamlessAnimationTime = config.seamlessAnimationTime;
      this.frameRate = config.frameRate;
      this.backgroundImage = this.kit.resourceList.images[config.backgroundImage];
    }
  }
}


