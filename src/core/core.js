/**
 * 
 */
define(function (require) {
  'use strict';
  var constants = require('constants');
  var Vector = require('Vector');
  var CPoint = require('CPoint');
  var PetalFlower = require('PetalFlower');
  var _u = require('util');

  var cKit = function () {
    // Make these libs accessable by external script
    this.constants = constants;
    this.Vector = Vector;
    this._u = _u;

    this.canvas = document.getElementById('myCanvas');
    this.context = '';

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
    //this.timeOut = 20;
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
    this.debugMode = false;


    this.initializeCanvas = function() {
      this.bindEvents();
      this.context = this.canvas.getContext('2d');
      var kInputField = document.getElementById('k');
      kInputField.value = constants.DEFAULT_RAYS;
      if (this.objList.length===0) {
        this.build();
      } else {
        this.setState();
      }
      this.initFrame();

      if(this.debugMode===true) {
        var dataz = window.getSampleJSON();
        // Temporary testing code
        this.loadData(dataz, false);
        this.editMode = constants.EDIT_TRANSFORM;
        // this.addFillImage('http://41.media.tumblr.com/5a22f64bd4564fa750b150e0358d1ded/tumblr_na82n1PmJl1t02n2vo1_500.jpg', 'Color Wheel Ray', 'http://annaporreca.tumblr.com/post/84120798025/sunrise-sunset');
        // this.addBackGroundImage('http://40.media.tumblr.com/56ff609390ee74b3994f311a8f13e0d5/tumblr_n4qrodAcxV1qaf77co1_1280.jpg', 'Ray Scope', 'http://serescosmicos.tumblr.com/post/94587874401');
        // this.addFillImage('http://38.media.tumblr.com/b07bed8de1b02eb756b997872d9560b5/tumblr_nd96zsHxum1tpen5so1_1280.jpg', 'Dark Mountain', 'http://universeobserver.tumblr.com/post/101015776326/gorettmisstag-by-anthony-hurd');
        // this.addBackGroundImage('http://33.media.tumblr.com/9383f1a92b139f8e2aab5c7d52528e4d/tumblr_ndg4fznxkO1syynngo1_500.jpg', '', 'http://lucysbasement.tumblr.com/post/100007359383');
      }
      this.redraw();
    }

    this.build = function() {
      var kit = this;
      _u.each(_u.range(0, this.initList.length), function(i) {
        if (kit.initList[i] === 'flower') {
          kit.objList.push(new PetalFlower(kit, constants.DEFAULT_RAYS, 1, kit.canvasHeight/constants.DEFAULT_INNER_RADIUS_SCALAR, 
                                           kit.canvasHeight/constants.DEFAULT_OUTER_RADIUS_SCALAR, Vector.create(kit.midWidth, kit.midHeight)));
          kit.objTypes.push(['flower', constants.DEFAULT_RAYS, 1]);
        }
      });
    }

    this.redraw = function() {
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

    this.updatePetalCount = function() {
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
    this.accentRadial = function() {
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

    this.initFrame = function() {
      this.keyFrames[this.segment] = {};
      this.keyFrames[this.segment].obj = [];
      if(this.segment>0) {
        for(var i=0; i<this.objList; i++) {
          this.keyFrames[this.segment].obj[i].rotation = this.keyFrames[this.segment-1].obj[i].rotation;
          this.keyFrames[this.segment].obj[i].timing = this.keyFrames[this.segment-1].obj[i].timing;
        }
      } else {
        for(var ind=0; ind<this.objList; ind++) {
          this.keyFrames[this.segment].obj[ind].rotation = 0;
          this.keyFrames[this.segment].obj[ind].timing = 1.0;
        }
      }
      this.storeFrame();
    }

    this.setState = function() {
      for(var i=0; i<this.objList.length; i++) {
        this.objList[i].setState(this.keyFrames[this.segment].obj[i]);
      }
    }

    this.getState = function() {
      for(var i = 0; i<this.objList.length; i++){
        this.keyFrames[this.segment].obj[i] = this.objList[i].getState();
      }
      this.keyFrames[this.segment].timing = parseFloat(document.getElementById('length').value);
    }

    this.clearScene = function(){
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
    this.initializeCanvas();
  }

  cKit.prototype.getRotation = function() {
    var rotationDegrees = this.keyFrames[this.segment].obj[this.selectedObject].rotation*this.constants.TWOPIDIV360;
    return Math.floor(rotationDegrees * 100) / 100;
  }

  cKit.prototype.setRotation = function(val) {
    this.objList[this.selectedObject].rotation = val;
    this.keyFrames[this.segment].obj[this.selectedObject].rotation = val;
    this.objList[this.selectedObject].allPetals = [];
    this.objList[this.selectedObject].createPetals();
    this.redraw();
  }

  cKit.prototype.addObject = function(){
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

  cKit.prototype.removeObject = function(){
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

  cKit.prototype.removeSegment = function(){
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

  cKit.prototype.removeLast = function(){
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

  cKit.prototype.addFillImage = function (src, label, page) {
    this.fillImageExists = false;
    this.fillImage = new Image();
    this.fillImage.onload = function () {
      window.kit.fillImageExists = true;
      window.kit.redraw();
    };
    this.fillImage.src = src;
    this.resourceList.fillImageSource = src;
    this.resourceList.fillImageLabel = label;
    this.resourceList.fillImagePage = page;
  };

  cKit.prototype.addBackGroundImage = function (src, label, page) {
    this.backgroundImage = new Image();
    this.backgroundImage.onload = function () {
      window.kit.backgroundImageExists = true;
      window.kit.redraw();
    };
    this.backgroundImage.src = src;
    this.resourceList.backgroundImageSource = src;
    this.resourceList.backgroundImageLabel = label;
    this.resourceList.backgroundImagePage = page;
  };

  cKit.prototype.constrain = function (point) {
    if(point.x<0) {
      point.x=0;
    } else if(point.x>this.canvasWidth) {
      point.x=this.canvasWidth;
    }
    if(point.y<0) {
      point.y=0;
    } else if(point.y>this.canvasHeight) {
      point.y=this.canvasHeight;
    }
  }

  // EVENT BINDING
  // Consider moving out of kit scope because they are global
  cKit.prototype.startDrag = function(event) {
    var kit = window.kit;
    if (kit.animationMode===true) {
      return;
    }
    var position = _u.getPosition(event, kit.canvas);
    var object = kit.objList[kit.selectedObject];
    if(kit.editMode===constants.EDIT_SHAPE) {
      _u.each(object.shapePoints, function( thisPoint ){
        var actualPosition = object.reverseTransformPoint(position);
        if(thisPoint.mouseInside(actualPosition)){
          thisPoint.inDrag = true;
          kit.canvasMode = 'cpDrag';
          kit.redraw();
          return;
        }
      });
    } else if(kit.editMode===constants.EDIT_TRANSFORM) {
      _u.each(object.transformPoints, function( thisPoint ){
        var positionInsideObject;
        if(thisPoint.index!==2) {
          positionInsideObject = Vector.create(position.x-object.center.x, position.y-object.center.y);
          positionInsideObject = Vector.rotate(0, 0, positionInsideObject, -object.rotation);
        } else {
          // Scale control point is not rotated
          object.lastScale = object.scale;
          positionInsideObject = Vector.create(position.x-object.center.x, position.y-object.center.y);
        }
        if(thisPoint.mouseInside(positionInsideObject)){
          thisPoint.inDrag = true;
          kit.canvasMode = 'cpDrag';
          kit.redraw();
          return;
        }
      });
    }
  }

  cKit.prototype.endDrag = function(event){ 
    var kit = window.kit;
    if (kit.animationMode===true) {
      return;
    }
    kit.canvasMode = 'static';
    kit.position = _u.getPosition(event, kit.canvas);
    var object = kit.objList[kit.selectedObject];
    if(kit.editMode===constants.EDIT_SHAPE) {
      _u.each(object.shapePoints, function( thisPoint ){
        if( thisPoint.inDrag === true ){
          thisPoint.inDrag = false;
          kit.redraw();
        }
      });
    } else if(kit.editMode===constants.EDIT_TRANSFORM) {
      _u.each(object.transformPoints, function( thisPoint ){
        if( thisPoint.inDrag === true ){
          thisPoint.inDrag = false;
          if(thisPoint.index===2) {
            thisPoint.x = object.scaleDistance;
          }
          kit.redraw();
        }
      });
    }
    kit.getState();
  }
  
  cKit.prototype.move = function(event){
    var kit = window.kit;
    if (kit.canvasMode !== 'cpDrag' || kit.animationMode===true) {
      return;
    }
    var object = kit.objList[kit.selectedObject];
    var position = _u.getPosition(event, kit.canvas);
    var actualPosition = object.reverseTransformPoint(position);
    // TODO use Index of control point variable rather than iterable
    var index = 0;
    if(kit.editMode===kit.constants.EDIT_SHAPE) {
      _u.each( object.shapePoints, function( thisPoint ){
        // Only drag one control point at a time 
        if( thisPoint.inDrag ) {
          var newPoint = new CPoint(kit, actualPosition.x, actualPosition.y, object, index);
          newPoint.inDrag = true;
          object.updatePetal( index, newPoint );
          kit.redraw();
          return;
        } 
        index++;
      });
    } else if(kit.editMode===kit.constants.EDIT_TRANSFORM) {
      _u.each( object.transformPoints, function(thisPoint) {
        // Expectation is one CPoint inDrag at a time
        if(thisPoint.inDrag) {
          // Center tranform point does not move
          if(index===0) {
            object.center=position;
          } else if(index===1) {
            var angleVector = Vector.create(position.x-object.center.x, position.y-object.center.y)
            var angle = Vector.getRadians(Vector.create(0, 0), angleVector);
            kit.setRotation(angle);
            kit._u.debugConsole(angle);
          } else if(index===2) {
            var newX = position.x-object.center.x;
            object.setScale(newX);
            thisPoint.x = newX;
          }
          kit.redraw();
          return;
        }
        index++;
      });
    }
  }

  cKit.prototype.bindEvents = function(){
    /* TODO (WIP for touch devices) */
    this.canvas.addEventListener('touchstart', this.startDrag, false);
    this.canvas.addEventListener('touchend', this.endDrag, false);
    this.canvas.addEventListener('touchmove', this.move, false);
    // Mouse Canvas Events
    this.canvas.addEventListener('mousedown', this.startDrag, false);
    this.canvas.addEventListener('mouseup', this.endDrag, false);
    this.canvas.addEventListener('mousemove', this.move, false);
  }

  /*
   * Used to store the canvas configuration to the current frame
   */
  cKit.prototype.storeFrame = function(){
    for( var i = 0; i<this.objList.length; i++){
        this.keyFrames[this.segment].obj[i] = this.objList[i].getState();
    }
    this.keyFrames[this.segment].timing = parseFloat(document.getElementById('length').value);
    var val = document.getElementById('rotation').value;
    this.keyFrames[this.segment].obj[this.selectedObject].rotation = parseFloat(val)*constants.TWOPIDIV360;
  }

// ANIMATION
// TODO add worker threads to GIF builder
  cKit.prototype.gifInit = function() {
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

  cKit.prototype.gifComplete = function() {
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

  cKit.prototype.loopInit = function() {
    this.animationMode = true;
    this.segment = 0;
    this.loopStartTime = _u.msTime();
    this.segmentStartTime = this.loopStartTime;
    this.settingShelf = {'editMode': this.editMode, 'toggleCurveColor': this.toggleCurveColor};
    this.editMode = constants.EDIT_NONE;
    this.toggleCurveColor = false;
    window.updateInterface();
  }

  cKit.prototype.stopScene = function() {
    this.editMode = this.settingShelf.editMode;
    this.toggleCurveColor = this.settingShelf.toggleCurveColor;
    this.sceneReset();
  }

  cKit.prototype.sceneReset = function() {
    this.animationMode = false;
    this.segment=0;
    this.setState();
    this.redraw();
  }

  /*
   * Used to set the canvas state with the keyframe
   *
   */
  cKit.prototype.setState = function() {
    for( var i=0; i<this.objList.length; i++) {
      this.objList[i].setState(this.keyFrames[this.segment].obj[i]);
    }
  }

  cKit.prototype.sceneLoop = function() {
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
      // TODO EASING modes
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

  cKit.prototype.updateSegment = function(delta) {
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
      _u.each(ob.shapePoints, function(cp) {
        var newX = kit.keyFrames[kit.segment-1].obj[objIndex].shapePoints[index].x*(1.0-sig)+cp.x*sig;
        var newY = kit.keyFrames[kit.segment-1].obj[objIndex].shapePoints[index].y*(1.0-sig)+cp.y*sig;
        var newPoint = new CPoint(kit, newX, newY, kit.objList[objIndex], index);
        newCps.push(newPoint);
        index++;
      });
      var newState = {
        shapePoints:newCps
      }
      var fromRotation = kit.keyFrames[kit.segment-1].obj[objIndex].rotation;
      var toRotation = kit.keyFrames[keyTo].obj[objIndex].rotation;
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
      kit.objList[objIndex].setState(newState);
      objIndex++;
    });
  }

  // This needs to be updated (disabled functionality)
  cKit.prototype.segmentLoop = function() {
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
      } else if( this.setTime !== this.keyFrames[this.segment].timing*1000 ){
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

        var fromRotation = kit.keyFrames[kit.segment-1].obj[objIndex].rotation;
        var toRotation = kit.keyFrames[kit.segment].obj[objIndex].rotation;
        var del = toRotation-fromRotation;
        if( Math.abs(del) > 180 ) {
          if(del<0) {
            toRotation+=360;
          } else {
            fromRotation+=360;
          }
        }
        newState.rotation = (fromRotation*(1-sig)+toRotation*sig)%360;

        kit.objList[objIndex].setState(newState);
        objIndex++;
      });
    }
    setTimeout(function(){window.kit.segmentLoop()}, window.kit.frameDelay);
  }

  cKit.prototype.getSettings = function(data, preinit) {  
    return {'backgroundColor': this.backgroundColor, 'backgroundAlpha': this.backgroundAlpha, 'lineColor': this.lineColor, 
    'sourceMode': this.sourceMode, 'seamlessAnimation': this.seamlessAnimation};
  }

  cKit.prototype.loadData = function(data, preinit) {
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
      this.addBackGroundImage(this.resourceList.backgroundImageSource, this.resourceList.backgroundImageLabel, this.resourceList.backgroundImagePage);
    }
    if(typeof this.resourceList.fillImageSource === 'string'){
      this.addFillImage(this.resourceList.fillImageSource, this.resourceList.fillImageLabel, this.resourceList.fillImagePage)
    }
    this.selectedObject = 0;
    this.segment = 0;
    this.setState();
  }

  cKit.prototype.registerMethod = function(name, m) {
    if (!cKit.prototype._registeredMethods.hasOwnProperty(name)) {
      cKit.prototype._registeredMethods[name] = [];
    }
    cKit.prototype._registeredMethods[name].push(m);
  }.bind(this);

  return cKit;
});