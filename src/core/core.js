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
    this.pauseTime = 200;
    //this.timeOut = 20;
    this.frameDelay = 60;
    this.gifFramerate = 200;
    this.delta = -this.frameDelay;
    this.Vector = Vector;

    this.sceneMode = constants.SCENE_NORMAL;

    // GIF
    this.encoder = '';
    this.delayTime = 0;

    // TODO setup initList via external functions
    this.initList = ['flower'];
    this.curve = [];
    this.pattern = null;
    this.bodybg ='020202';

    // TODO
    this.backgroundColor = '010201';
    this.lineColor = '9fb4f4';
    this.backgroundAlpha = 1.0;
    document.getElementById('bgAlpha').value = this.backgroundAlpha;
    // SETUP ID to all interface elements and setter methods in package

    // CANVAS SETTINGS
    this.controlPointRadius = 6;
    this.canvasWidth = 640;
    this.canvasHeight = 640;
    this.midWidth = this.canvasWidth / 2;
    this.midHeight = this.canvasHeight / 2;
    this.center = Vector.create(this.midWidth, this.midHeight);

    this.inCurveEditMode = true;
    this.toggleCurveColor = false;
    this.fieldFocus = false;
    this.settingShelf = {'toggleCurveColor': this.toggleCurveColor, 'inCurveEditMode': this.inCurveEditMode};

    this.objList = [];
    this.objTypes = [];
    this.selectedObject = 0;

    // TESTING
    this.debugMode = true;
    this.resourceList = {};
    this.backgroundImageExists = false;
    this.fillImageExists = false;

    this.initializeCanvas = function () {
      this.initConstants();
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
        // this.addFillImage('http://41.media.tumblr.com/5a22f64bd4564fa750b150e0358d1ded/tumblr_na82n1PmJl1t02n2vo1_500.jpg', 'Color Wheel Ray', 'http://annaporreca.tumblr.com/post/84120798025/sunrise-sunset');
        // this.addBackGroundImage('http://40.media.tumblr.com/56ff609390ee74b3994f311a8f13e0d5/tumblr_n4qrodAcxV1qaf77co1_1280.jpg', 'Ray Scope', 'http://serescosmicos.tumblr.com/post/94587874401');
        // this.addFillImage('http://38.media.tumblr.com/b07bed8de1b02eb756b997872d9560b5/tumblr_nd96zsHxum1tpen5so1_1280.jpg', 'Dark Mountain', 'http://universeobserver.tumblr.com/post/101015776326/gorettmisstag-by-anthony-hurd');
        // this.addBackGroundImage('http://33.media.tumblr.com/9383f1a92b139f8e2aab5c7d52528e4d/tumblr_ndg4fznxkO1syynngo1_500.jpg', '', 'http://lucysbasement.tumblr.com/post/100007359383');
      }
      this.redraw();
    }

    this.initConstants = function () {
      if (_u.exists(this.positions)) {
        if(this.positions.length!==24) {return;}
        this.curve.push(this.validateInt(this.positions.substring(0, 3)));
        this.curve.push(this.validateInt(this.positions.substring(3, 6)));

        this.curve.push(this.validateInt(this.positions.substring(6, 9)));
        this.curve.push(this.validateInt(this.positions.substring(9, 12)));

        this.curve.push(this.validateInt(this.positions.substring(12, 15)));
        this.curve.push(this.validateInt(this.positions.substring(15, 18)));

        this.curve.push(this.validateInt(this.positions.substring(18, 21)));
        this.curve.push(this.validateInt(this.positions.substring(21, 24)));
      }
    }

    this.build = function () {
      var kit = this;
      _u.each(_u.range(0, this.initList.length), function(i) {
        if (kit.initList[i] === 'polar') {
          //kit.polarFlower(250, kit.k);
        } else if (kit.initList[i] === 'flower') {
          kit.objList.push(new PetalFlower(kit, constants.DEFAULT_RAYS, 1, kit.canvasHeight/constants.DEFAULT_INNER_RADIUS_SCALAR, 
                                           kit.canvasHeight/constants.DEFAULT_OUTER_RADIUS_SCALAR, kit.center));
          kit.objTypes.push(['flower', constants.DEFAULT_RAYS, 1]);
        }
      });
    }

    this.redraw = function () {
      // Clear the canvas
      this.context.save();
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.restore();

      // Reset stroke style in case of highlighted shape
      this.context.strokeStyle = '#' + this.lineColor;

      if(this.backgroundImageExists){
        // TODO resize background
        this.context.drawImage(this.backgroundImage, 0, 0, this.canvasWidth, this.canvasHeight);
      } else {
        var rgb = _u.toRGB(this.backgroundColor);
        this.context.fillStyle = 'rgba('+rgb[0]+', ' + rgb[1] + ', ' + rgb[2] + ', ' + this.backgroundAlpha + ')';
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      }

      var kit = this;
      _u.each(this.objList, function(item) {
        item.draw();
      });    
      // Always draw active control points on top
      _u.each(this.objList, function(item) {
        if(_u.indexOf(kit.objList, item) === kit.selectedObject) {
          item.drawControlPoints();
        }
      }); 
    }


    this.updatePetalCount = function () {
      var kVal = document.getElementById('k').value;
      if (isNaN(kVal)) {
        return;
      }
      if(this.objList[this.selectedObject] instanceof PetalFlower) {
        this.objList[this.selectedObject] = new PetalFlower(this, kVal, 1, this.canvasHeight/constants.DEFAULT_INNER_RADIUS_SCALAR,
                                                            this.canvasHeight/constants.DEFAULT_OUTER_RADIUS_SCALAR, this.center);
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
      this.setFrame();
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
                                        this.canvasHeight/constants.DEFAULT_OUTER_RADIUS_SCALAR, this.center));
      this.objTypes.push(['flower', constants.DEFAULT_RAYS, 1]);
      this.selectedObject = 0;
      this.initFrame();
      this.redraw();
      window.updateInterface();
    }
    this.initializeCanvas();
  }

  cKit.prototype.addObject = function(){
    if(this.objList.length >= constants.MAX_OBJECTS) {
      return;
    }
    this.objList.push(new PetalFlower(this, constants.DEFAULT_RAYS, 1, this.canvasHeight/constants.DEFAULT_INNER_RADIUS_SCALAR, 
                                      this.canvasHeight/constants.DEFAULT_OUTER_RADIUS_SCALAR, this.center));
    this.objTypes.push(['flower', constants.DEFAULT_RAYS, 1]);
    for(var i=0; i<this.keyFrames.length; i++) {
      this.keyFrames[i].obj[this.objList.length-1] = this.objList[this.objList.length-1].getState();
      this.keyFrames[i].obj[this.objList.length-1].timing = document.getElementById('length').value;
    }
    var ind = this.objList.length-1;
    this.selectedObject = ind;
    this.redraw();
  }

  cKit.prototype.addFillImage = function (src, label, page) {
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

  // EVENT BINDING
  // TODO kit is a hack, need to fix Global access
  cKit.prototype.startDrag = function(event) {
    // TODO getPosition must be Global for now, localize?
    var kit = window.kit;
    kit.position = _u.getPosition(event, kit.canvas);
    _u.debugConsole('startDrag x:' + kit.position.x + ' y:' + kit.position.y);
    var clickPoint = kit.Vector.rotate( kit.midWidth, kit.midHeight, kit.position, -kit.objList[kit.selectedObject].rotation*kit.constants.TWOPIDIV360 );
    _u.each(kit.objList[kit.selectedObject].controlPoints, function( thisPoint ){
      if( thisPoint.mouseInside( clickPoint ) ){
        thisPoint.inDrag = true;
        kit.canvasMode = 'cpDrag';
        kit.redraw();
        return;
      }
    });
  }

  cKit.prototype.endDrag = function(event){ 
    // alert('end');
    var kit = window.kit;
    kit.canvasMode = 'static';
    kit.position = _u.getPosition(event, kit.canvas);
    _u.debugConsole('endDrag x:' + kit.position.x + ' y:' + kit.position.y);
    _u.each( kit.objList, function( object ){
      _u.each( object.controlPoints, function( thisPoint ){
        if( thisPoint.inDrag === true ){
          thisPoint.inDrag = false;
          kit.redraw();
        }
      });
    });
    kit.getState();
  }
  
  cKit.prototype.move = function(event){
    //alert('move');
    var kit = window.kit;
    if ( kit.canvasMode !== 'cpDrag' ) {
      return;
    }
    kit.position = _u.getPosition(event, kit.canvas);
    _u.each( kit.objList, function( object ){
      // TODO use Index of control point variable rather than iterable
      var index = 0;
      _u.each( object.controlPoints, function( thisPoint ){
        // Only drag one control point at a time 
        if( thisPoint.inDrag ) {
          var rotatedPos = kit.Vector.rotate(kit.midWidth, kit.midHeight, kit.position, -object.rotation*kit.constants.TWOPIDIV360 );
          var newPoint = new CPoint(kit, rotatedPos.x, rotatedPos.y, object, index);
          newPoint.inDrag = true;
          object.updatePetal( index, newPoint );
          _u.debugConsole('newPoint.x/y::' + rotatedPos.x + '/' + rotatedPos.y + ' indexof::'+ _u.indexOf( object.controlPoints, thisPoint)  + ' object type:' + object.type +  '</p>');
          //$('#console').html('<p>newPoint.x/y::' + rotatedPos.x + '/' + rotatedPos.y + ' indexof::')
          //+ c_u.indexOf( object.controlPoints, thisPoint)  + ' object type:' + object.type +  '</p>');
          kit.redraw();
          return;
        } 
        index++;
      });
    });
    _u.debugConsole('mousemove x:' + kit.position.x + ' y:' + kit.position.y);
    //$('#console').html('<p>mousemove x:' + position.x + ' y:' + position.y + '<p>');    
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
    //this.animationEvents();
  }

  cKit.prototype.setFrame = function(){
    for( var i = 0; i<this.objList.length; i++){
        this.keyFrames[this.segment].obj[i] = this.objList[i].getState();
    }
    this.keyFrames[this.segment].timing = parseFloat(document.getElementById('length').value);
    var val = document.getElementById('rotation').value;
    this.keyFrames[this.segment].obj[this.selectedObject].rotation = parseFloat(val);
  }
  /*
  cKit.prototype.gripImg = function(r, g, b){
    var p = new PNGlib(paletteWidth, paletteHeight, 256); // construcor takes height, weight and color-depth    
    for (var i = 0; i < paletteWidth; i++) {
      for (var j = 0; j < paletteHeight; j++) {
        // use a color triad of Microsofts million dollar color
        p.buffer[p.index(i, j)] = p.color(r, g, b);
      //p.buffer[p.index(Math.floor(x), Math.floor(y))] = p.color(0xcc, 0x00, 0x44);
      //p.buffer[p.index(Math.floor(x), Math.floor(y + 10))] = p.color(0x00, 0xcc, 0x44);
      }
    }
    return '<img src="data:image/png;base64,'+p.getBase64()+'">';
  }*/

// ANIMATION
  // TODO 
  /* cKit.prototype.trigger = function() {
    //$('footer p.copy').append(new Date().getFullYear());
    cKit.initializeCanvas();
    cKit.initColorPickers();
    // $('.selectpicker').selectpicker();
    if (this.keyFrames.length === 0) {
      this.keyFrames = [{}];
      this.keyFrames[0].obj = [];
    }
    for(var i = 0; i<this.objList.length;i++) {
      this.keyFrames[0].obj[i] = this.objList[i].getState();
    }
    this.keyFrames[0].timing = 1.0;
    this.setupGif();
  }  */

// TODO
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
    this.settingShelf = {'inCurveEditMode': this.inCurveEditMode, 'toggleCurveColor': this.toggleCurveColor};
    this.inCurveEditMode = false;
    this.toggleCurveColor = false;
    window.updateInterface();
  }

  cKit.prototype.stopScene = function() {
    this.inCurveEditMode = this.settingShelf.inCurveEditMode;
    this.toggleCurveColor = this.settingShelf.toggleCurveColor;
    this.sceneReset();
  }

  cKit.prototype.sceneReset = function() {
    this.animationMode = false;
    this.segment=0;
    this.setState();
    this.redraw();
  }

  cKit.prototype.setState = function() {
    for( var i=0; i<this.objList.length; i++){
      this.objList[i].setState(this.keyFrames[this.segment].obj[i]);
    }
  }

  cKit.prototype.sceneLoop = function() {
    if(!this.animationMode||this.keyFrames.length<2){
      this.stopScene();
      window.updateInterface();
      return;
    }
    if (this.sceneMode === constants.SCENE_GIF) {
      this.delta += this.gifFramerate;
    } else {
      this.delta = _u.msTime()-this.segmentStartTime;
    }
    if(this.segment === 0 && this.delta >= this.pauseTime) {
      this.segment = 1;
      this.delta = 0;
      this.segmentStartTime = _u.msTime();
    } else if(this.segment !== 0){
      // TODO EASING modes
      if( this.delta > this.keyFrames[this.segment-1].timing*1000 ) {
        if(this.segment < this.keyFrames.length) {
          this.setState();
          this.segment++;
          if(this.sceneMode === this.GIF) {
              this.delta = 0;
          } else {
              this.segmentStartTime = _u.msTime();
          }
        } else {
          if( this.sceneMode === constants.SCENE_GIF ) {
            this.gifComplete();
            return;
          }
          this.segment = 0;
          this.setState();
          // This is a hack on delta for segment = 1
          this.segmentStartTime = _u.msTime();
        }
      } else {
        this.updateSegment(this.delta);
      }
    }
    if( this.sceneMode === constants.SCENE_GIF) {
      // TODO
      this.encoder.addFrame(this.context);
      setTimeout(function(){
          window.kit.sceneLoop();
        }, 
      0.01);
    } else {
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
      _u.each(ob.controlPoints, function(cp) {
        var newX = kit.keyFrames[kit.segment-1].obj[objIndex].controlPoints[index].x*(1.0-sig)+cp.x*sig;
        var newY = kit.keyFrames[kit.segment-1].obj[objIndex].controlPoints[index].y*(1.0-sig)+cp.y*sig;
        // To-DO check????????
        var newPoint = new CPoint(kit, newX, newY, kit.objList[objIndex], index);
        newCps.push(newPoint);
        index++;
      });
      var newState = {
        controlPoints:newCps
      }

      var fromRotation = kit.keyFrames[kit.segment-1].obj[objIndex].rotation;
      var toRotation = kit.keyFrames[keyTo].obj[objIndex].rotation;
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
    } else if( delta > this.keyFrames[this.segment].timing*1000 ){
      if( delta > this.keyFrames[this.segment].timing*1000 + this.pauseTime ){
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
        _u.each(ob.controlPoints, function(cp) {
          var newX = kit.keyFrames[kit.segment-1].obj[objIndex].controlPoints[index].x*(1.0-sig)+cp.x*sig;
          var newY = kit.keyFrames[kit.segment-1].obj[objIndex].controlPoints[index].y*(1.0-sig)+cp.y*sig;
          var newPoint = new CPoint(kit, newX, newY, kit.objList[objIndex], index);
          newCps.push(newPoint);
          index++;
        });
        var newState = {controlPoints:newCps};

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

  cKit.prototype.loadData = function(data, preinit) {
    this.objList = [];
    this.objTypes = [];
    this.resourceList = data[1];
    this.objTypes = data[2];
    this.keyFrames = data[3];

    this.objList = [];
    for(var i = 0; i < this.objTypes.length; i++) {
      if(this.objTypes[i][0] === 'flower') {
        this.objList.push(new PetalFlower(this, this.objTypes[i][1], 1, this.canvasHeight/constants.DEFAULT_INNER_RADIUS_SCALAR, 
                                          this.canvasHeight/constants.DEFAULT_OUTER_RADIUS_SCALAR, this.center));
      } else if(this.objTypes[i][0] === 'polar') {
        // TODO
      }
    }
    this.selectedObject = 0;
    this.options = data[0];
    this.currentSelector = 'bg-color';
    this.backgroundColor = this.options.backgroundColor;
    this.backgroundAlpha = this.options.backgroundAlpha;
    this.lineColor = this.options.lineColor;
    this.backgroundImageExists = false;
    this.fillImageExists = false;
    if(typeof this.resourceList.backgroundImageSource === 'string'){
      this.addBackGroundImage(this.resourceList.backgroundImageSource, this.resourceList.backgroundImageLabel, this.resourceList.backgroundImagePage);
    }
    if(typeof this.resourceList.fillImageSource === 'string'){
      this.addFillImage(this.resourceList.fillImageSource, this.resourceList.fillImageLabel, this.resourceList.fillImagePage)
    }
    if(!this.preinit) {
      window.setColor('#'+this.backgroundColor);
    }
    this.currentSelector = 'line-color';
    if(!this.preinit) {
      window.setColor('#'+this.lineColor);
    }
    this.segment = 0;
    this.setState();
    this.redraw();
    // While in debug mode loadData auto fires before object global reference set
    // TODO
    // window.updateInterface(this);
  }

  for (var kit in cKit.prototype) {
    if(typeof cKit.prototype[kit] === 'function') {
      /*var ev = kit.substring(2);
      if (!this._events.hasOwnProperty(ev)) {
        window[kit] = cKit.prototype[kit].bind(this);
      }
    } else {*/
      window[kit] = cKit.prototype[kit];
    }
  }

  // functions that cause preload to wait
  // more can be added by using registerPreloadMethod(func)
  cKit.prototype._preloadMethods = [
  ];

  cKit.prototype._registeredMethods = { pre: [], post: [], remove: [] };

  cKit.prototype.registerPreloadMethod = function(m) {
    cKit.prototype._preloadMethods.push(m);
  }.bind(this);

  cKit.prototype.registerMethod = function(name, m) {
    if (!cKit.prototype._registeredMethods.hasOwnProperty(name)) {
      cKit.prototype._registeredMethods[name] = [];
    }
    cKit.prototype._registeredMethods[name].push(m);
  }.bind(this);

  return cKit;
});
