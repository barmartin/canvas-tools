/**
 * 
 */
define(function (require) {
  'use strict';

  var constants = require('constants');
  var Vector = require('Vector');
  var CPoint = require('CPoint');
  var PedalFlower = require('PedalFlower');

  var cKit = function () {
    this.constants = constants;
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
    this.frameDelay = 15;
    this.savedSettings = {};
    this.delta = -this.frameDelay;
    this.Vector = Vector;

    this.sceneMode = constants.SCENE_NORMAL;

    // GIF
    this.encoder = 11;
    this.delayTime = 0;

    // TODO setup initList via external functions
    this.initList = ['flower'];
    this.curve = [];
    this.k = 6;
    this.pattern = null;
    this.bodybg ='020202';
    this.selectedObject = 0;
    this.controlPointRadius = 6;
    this.canvasWidth = 640;
    this.canvasHeight = 640;
    this.midWidth = this.canvasWidth / 2;
    this.midHeight = this.canvasHeight / 2;
    this.inCurveEditMode = true;
    this.toggleCurveColor = false;
    this.objList = [];
    this.objTypes = [];

    this.initializeCanvas = function () {
      this.initConstants();
      this.bindEvents();
      this.context = this.canvas.getContext('2d');
      var kInputField = document.getElementById('k');
      kInputField.value = this.k;
      if (this.objList.length===0) {
        this.build();
      } else {
        this.setState();
      }
      this.redraw();
      this.initFrame();
    }

    this.initConstants = function () {
      if (this.dnexist(this.k)) {
        this.k = 6;
      }
      if (this.dnexist(this.backgroundColor)) {
        this.backgroundColor = '010201';
      }
      if (this.dnexist(this.backgroundAlpha)) {
        this.backgroundAlpha = 1.0;
      } else {
        document.getElementById('bgAlpha').value = this.backgroundAlpha;
      }
      if (this.dnexist(this.lineColor)) {
        this.lineColor = '9fb4f4';
      }
      if (this.exists(this.positions)) {
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
      this.each(this.range(0, this.initList.length), function(i) {
        if (kit.initList[i] === 'polar') {
          //kit.polarFlower(250, kit.k);
        } else if (kit.initList[i] === 'flower') {
          kit.objList.push(new PedalFlower(kit, kit.k, 20, 250, 'seperated'));
          kit.objTypes.push(['flower', kit.k]);
        }
      });
    }

    this.redraw = function () {
      this.context.save();
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.restore();
      this.context.strokeStyle = '#' + this.lineColor;
      var rgb = this.toRGB(this.backgroundColor);
      this.context.fillStyle = 'rgba('+rgb[0]+', ' + rgb[1] + ', ' + rgb[2] + ', ' + this.backgroundAlpha + ')';
      this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.each(this.objList, function(item) {
        item.draw();
      });      
    }

    this.update = function () {
      var kVal = document.getElementById('k').value;
      if (isNaN(kVal)) {
        return;
      }
      this.objList[this.selectedObject] = new PedalFlower(this, kVal, 20, this.canvasHeight / 6 * 2.5, 'seperated');
      this.objTypes[this.selectedObject][1] = kVal;
      this.setState();
      this.redraw();
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
      for( var i=0; i<this.objList.length; i++) {
        this.objList[i].setState(this.keyFrames[this.segment].obj[i]);
      }
    }

    this.getState = function() {
      for( var i = 0; i<this.objList.length; i++){
        this.keyFrames[this.segment].obj[i] = this.objList[i].getState();
      }
      this.keyFrames[this.segment].timing = parseFloat(document.getElementById('length').value);
    }

    // init
    this.initializeCanvas();
  }

  cKit.prototype.addObject = function(){
    if(this.objList.length >= constants.MAX_OBJECTS) {
      return;
    }
    this.objList.push(new PedalFlower(this, this.k, 20, 250, 'seperated'));
    this.objTypes.push(['flower', this.k]);
    for(var i=0; i<this.keyFrames.length; i++) {
      this.keyFrames[i].obj[this.objList.length-1] = this.objList[this.objList.length-1].getState();
      this.keyFrames[i].obj[this.objList.length-1].timing = document.getElementById('length').value;
    }
    var ind = this.objList.length-1;
    this.selectedObject = ind;
    this.redraw();
  }

  cKit.prototype.cpFormat = function(coord) {
    if(coord<10) {
      return '00' + Math.floor(coord);
    }
    if(coord<100) {
      return '0' + Math.floor(coord);
    } else { 
      return Math.floor(coord).toString();
    }
  }

  cKit.prototype.getPosition = function(e) {
    /* TODO Check for Safari Bug
    var targ;
    if (!e) {
      e = window.event;
    }
    if (e.target) {
      targ = e.target;
    } else if (e.srcElement) {
      targ = e.srcElement;
    } 
    if (targ.nodeType === 3) {
      // defeat Safari bug
      targ = targ.parentNode;
    } */
    var rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  // TODO check if this is still being used
  Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
  };

  cKit.prototype.clone = function(obj) {
      if (obj == null || 'object' !== typeof obj) {
        return obj;
      }
      var copy = obj.constructor();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) { 
          copy[attr] = obj[attr];
        }
      }
      return copy;
  }

  cKit.prototype.dnexist = function(item) {
    return typeof item === 'undefined';
  }

  cKit.prototype.exists = function(item) {
    return typeof item !== 'undefined';
  }

  cKit.prototype.encodeToHex = function(floatString) {
    return parseInt(255*floatString).toString(16);
  }

  cKit.prototype.decodeFromHex = function(str) {
    return parseInt(str, 16);
  }

  /* To-Do: Int or Default */
  cKit.prototype.validateInt = function(obj) {
    return parseInt(obj);
  }

  cKit.prototype.toRGB = function(str) {
    return [this.decodeFromHex(str.substring(0,2)), this.decodeFromHex(str.substring(2,4)), this.decodeFromHex(str.substring(4,6))];
  }

  cKit.prototype.msTime = function() {
    return new Date().getTime();
  }

  //  This is underscore's each algorithm
  cKit.prototype.each = function(obj, func) {
    if (obj == null) {
      return obj;
    }
    var i, length = obj.length;
    //console.log('length:' + length + ','+'+length: '+length);
    if (length === +length) {
      for (i = 0; i < length; i++) {
        func(obj[i], i, obj);
      }
    }/* else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        func(obj[keys[i]], keys[i], obj);
      }
    } */
    return obj;
  };

  // TODO
  cKit.prototype.range = function(st, end) {
    var r = [];
    for(var i=st; i<end; i++) {
      r.push(i);
    }
    return r;
  }

  cKit.prototype.indexOf = function(obj, item) {
    for(var i=0; i<obj.length; i++) {
      if(obj[i]===item) {
        //console.log('indexOf returning:' + i);
        return i;
      }
    }
    console.log('Item not Found, IndexOf (likely bug)');
    return -1;
  }

  // EVENT BINDING
  // TODO kit is a hack, need to fix Global access
  cKit.prototype.startDrag = function(event) {
    // alert('!1!');
    // TODO getPosition must be Global for now, localize?
    var kit = window.kit;
    kit.position = kit.getPosition( event );
    kit.debugConsole('startDrag x:' + kit.position.x + ' y:' + kit.position.y);
    var clickPoint = kit.Vector.rotate( kit.midWidth, kit.midHeight, kit.position, -kit.objList[kit.selectedObject].rotation*kit.constants.TWOPIDIV360 );
    kit.each(kit.objList[kit.selectedObject].controlPoints, function( thisPoint ){
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
    kit.position = kit.getPosition( event );
    kit.debugConsole('endDrag x:' + kit.position.x + ' y:' + kit.position.y);
    window.each( kit.objList, function( object ){
      window.each( object.controlPoints, function( thisPoint ){
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
    kit.position = kit.getPosition( event );
    kit.each( kit.objList, function( object ){
      // TODO use Index of control point variable rather than iterable
      var index = 0;
      kit.each( object.controlPoints, function( thisPoint ){
        // Only drag one control point at a time 
        if( thisPoint.inDrag ) {
          var rotatedPos = kit.Vector.rotate(kit.midWidth, kit.midHeight, kit.position, -kit.objList[0].rotation*kit.constants.TWOPIDIV360 );
          var newPoint = new CPoint(kit, rotatedPos.x, rotatedPos.y, object, index);
          newPoint.inDrag = true;
          object.updatePedal( index, newPoint );
          kit.debugConsole('newPoint.x/y::' + rotatedPos.x + '/' + rotatedPos.y + ' indexof::'+ kit.indexOf( object.controlPoints, thisPoint)  + ' object type:' + object.type +  '</p>');
          //$('#console').html('<p>newPoint.x/y::' + rotatedPos.x + '/' + rotatedPos.y + ' indexof::')
          //+ cKit.indexOf( object.controlPoints, thisPoint)  + ' object type:' + object.type +  '</p>');
          kit.redraw();
          return;
        } 
        index++;
      });
    });
    kit.debugConsole('mousemove x:' + kit.position.x + ' y:' + kit.position.y);
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

  cKit.prototype.setupGif = function(){
    /*
    this.encoder = new GIFEncoder();
    this.encoder.setRepeat(0);
    this.encoder.setDelay(this.frameDelay);
    */
  }
  cKit.prototype.gripImg = function(r, g, b){
    /*
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
    */
  }

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
    /*
    alert('wtf');
    encoder.start();
    sceneMode = constants.SCENE_GIF;
    encoder.setSize(canvasWidth, canvasHeight);
    savedSettings = {'inCurveEditMode': inCurveEditMode, 'toggleCurveColor': toggleCurveColor};
    inCurveEditMode = false;
    toggleCurveColor = false;
    redraw();
      */
  }
  cKit.prototype.gifComplete = function() {
    /*
    encoder.finish();
    var binary_gif = encoder.stream().getData(); //notice this is different from the as3gif package!
    var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
    //window.open(data_url);
    document.location.href = data_url;
    sceneMode = constants.SCENE_NORMAL;
    sceneReset();
    inCurveEditMode = savedSettings.inCurveEditMode;
    toggleCurveColor = savedSettings.toggleCurveColor;
    */
  }
  cKit.prototype.loopInit = function() {
    this.animationMode = true;
    this.segment = 0;
    this.loopStartTime = this.msTime();
    this.segmentStartTime = this.loopStartTime;
  }
  cKit.prototype.sceneReset = function() {
    this.animationMode = false;
    for( var i=0; i<this.objList.length; i++){
      this.objList[i].setState(this.keyFrames[0].obj[i]);
    }
    this.segment=0;
    this.redraw();
  }

  cKit.prototype.sceneLoop = function() {
    //alert('delta/segment ' + delta + '/' + segment);
    if(!this.animationMode){
      // TODO trigger interface changes
      //$(this).prop('disabled', true);
      //$('#playSegment, #playAll').prop('disabled', false);
      this.segment=0;
      //$('#segmentId').html(0);
      this.setState();
      return;
    }
    if (this.sceneMode === constants.SCENE_GIF) {
      this.delta += this.frameDelay;
    } else {
      this.delta = this.msTime()-this.segmentStartTime;
    }
    if(this.segment === 0 && this.delta >= this.pauseTime){
      this.segment = 1;
      this.delta = 0;
      this.segmentStartTime = this.msTime();
    } else if(this.segment !== 0){
      // needs easing
      if( this.delta > this.keyFrames[this.segment-1].timing*1000 ){
        if(this.segment < this.keyFrames.length){
          this.setState();
          this.segment++;
          if(this.sceneMode === this.GIF) {
              this.delta = 0;
          } else {
              this.segmentStartTime = this.msTime();
          }
        } else {
          if( this.sceneMode === constants.SCENE_GIF ){
            this.gifComplete();
            return;
          }
          this.segment = 0;
          this.setState();
          // This is a hack on delta for segment = 1
          this.segmentStartTime = this.msTime();
        }
      } else {
        this.updateSegment(this.delta);
      }
    }
    if( this.sceneMode === constants.SCENE_GIF){
      // TODO
      //encoder.addFrame(context);
      setTimeout(function(){
          window.kit.sceneLoop();
        }, 
      1.0);
    }
    else {
      setTimeout(function(){
        window.kit.sceneLoop();
      }, 
      window.kit.frameDelay);
    }
  }

  cKit.prototype.updateSegment = function(delta){
    var keyTo = this.segment;
    if(this.segment === this.keyFrames.length) {
      keyTo = 0;
    }
    var sig = delta/(this.keyFrames[keyTo].timing*1000);
    var objIndex = 0;
    var kit = this;
    this.each(this.keyFrames[keyTo].obj, function(ob) {
      var index = 0;
      var newCps = [];
      kit.each(ob.controlPoints, function(cp) {
        var newX = kit.keyFrames[kit.segment-1].obj[objIndex].controlPoints[index].x*(1.0-sig)+cp.x*sig;
        var newY = kit.keyFrames[kit.segment-1].obj[objIndex].controlPoints[index].y*(1.0-sig)+cp.y*sig;
        // To-DO check????????
        var newPoint = new CPoint(kit, newX, newY, kit.objList[objIndex], index);
        newCps.push(newPoint);
        index++;
      });
      var newState = {controlPoints:newCps};

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
      // TODO interface updates
      // $('#stop').prop('disabled', true);
      // $('#playSegment, #playAll').prop('disabled', false);
      this.setState();
      return;
    }
    var delta = this.msTime()-this.loopStartTime-this.pauseTime;
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
        this.loopStartTime = this.msTime();
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
      this.each(this.keyFrames[this.segment].obj, function(ob) {
        var index = 0;
        var newCps = [];
        kit.each(ob.controlPoints, function(cp) {
          var newX = kit.keyFrames[kit.segment-1].obj[objIndex].controlPoints[index].x*(1.0-sig)+cp.x*sig;
          var newY = kit.keyFrames[kit.segment-1].obj[objIndex].controlPoints[index].y*(1.0-sig)+cp.y*sig;
          // To-DO check????????
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
    this.keyFrames = data[2];
    this.objTypes = data[1];
    this.objList = [];
    for(var i = 0; i < this.objTypes.length; i++) {
      if(this.objTypes[i][0] === 'flower') {
        this.objList.push( new PedalFlower(this, this.objTypes[i][1], 20, 250, 'seperated') );
      } else if(this.objTypes[i][0] === 'polar') {
        // Not implemented
        //this.objList.push( new this.polarFlower(this.objTypes[i][1], 20, 250, 'seperated') );
      }
    }
    //$('#object_ label, #object label').removeClass('active').addClass('disabled');
    for(var it=1; it<this.objList.length+1; it++) {
      //$('#object_'+it+', #object'+it).parent().removeClass('disabled');
    }
    this.selectedObject = 0;
    // TODO
    //$('#object_ label:nth-child(1), #object label:nth-child(1)').addClass('active');
    //$('.oGroup label').removeClass('disabled').removeClass('active');
    this.options = data[0];
    this.currentSelector = 'bg-color';
    this.backgroundColor = this.options.backgroundColor;
    if(!this.preinit) {
      // TODO
      window.setColor('#'+this.backgroundColor);
    }
    this.backgroundAlpha = this.options.backgroundAlpha;
    this.lineColor = this.options.lineColor;
    this.currentSelector = 'line-color';
    if(!this.preinit) {
      // TODO
      window.setColor('#'+this.lineColor);
    }
    this.segment = 0;
    this.setState();
    this.redraw();
    window.updateInterface();
  }

  cKit.prototype.debugConsole = function(text) {
    var HUD = document.getElementById('console')
    if(HUD.firstChild) {
      HUD.removeChild(HUD.firstChild);
    }
    HUD.appendChild( document.createTextNode(text) );
  }

  cKit.prototype.addEventHandler = function(oNode, evt, oFunc, bCaptures) {
    if (this.exists(oNode.attachEvent)) {
      oNode.attachEvent('on'+evt, oFunc);
    } else {
      oNode.addEventListener(evt, oFunc, bCaptures);
    }
  }

  cKit.prototype.setUpClickEvent = function(e) {
    this.addEventHandler(document.getElementById('clickLink'), 'click', this.onLinkClicked, false);
  }

  cKit.prototype.removeEventHandler = function(oNode, evt, oFunc, bCaptures){
    if (cKit.exists(window.event)) {
      // TODO
      // oNode.detachEvent('on' + sEvt, oFunc);
    } else {
      // oNode.removeEventListener(sEvt, fnHandler, true);
    }
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