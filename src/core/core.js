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
    this.frameDelay = 30;
    this.savedSettings = {};
    this.delta = -this.frameDelay;
    this.Vector = Vector;

    this.sceneMode = constants.SCENE_NORMAL;

    // GIF
    this.encoder = 11;
    this.delayTime = 0;

    // TODO more types of objects, spiro is the only one atm. 
    this.initList = ['flower'];
    this.curve = [];
    this.k = 6;
    this.pattern = null;
    this.bodybg ='020202';
    this.selectedObject = 0;
    this.controlPointRadius = 7;
    this.canvasWidth = 600;
    this.canvasHeight = 600;
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
      // this.mode('animation');
    }

    this.initConstants = function () {
      if (this.dnexist(this.k)) {
        this.k = 6;
      }
      if (this.dnexist(this.backgroundColor)) {
        this.backgroundColor = '1e2f25';
      }
      if (this.dnexist(this.backgroundAlpha)) {
        this.backgroundAlpha = 0.5;
      } else {
        document.getElementById('bgAlpha').value = this.backgroundAlpha;
      }
      if (this.dnexist(this.lineColor)) {
        this.lineColor = '9cf4c7';
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
      //$('#console').html('<p>objList.length::' + objList.length + '</p>');
      
    }

    this.update = function () {
      var kVal = document.getElementById('k').value;
      if (isNaN(kVal)) {
        return;
      }
      this.objList[this.selectedObject] = new cKit.pedalFlower(kVal, 20, this.canvasHeight / 6 * 2.5, 'seperated');
      this.objTypes[this.selectedObject][1] = kVal;
      this.setState();
    }
    this.initializeCanvas();
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
    //this section is from http://www.quirksmode.org/js/events_properties.html
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
    }
    // jQuery normalizes the pageX and pageY
    // pageX,Y are the mouse positions relative to the document
    // offset() returns the position of the element relative to the document
    
    // TODO
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
    } /*else {
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
    var kit = window.cKit;
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
    var kit = window.cKit;
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
    // TODO
    //kit.getState();
  }
  
  cKit.prototype.move = function(event){
    //alert('move');
    var kit = window.cKit;
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
    /* TODO these three are the not the right kind of touchy... (buggy for touch devices) */
    this.canvas.addEventListener('touchstart', this.startDrag, false);
    this.canvas.addEventListener('touchend', this.endDrag, false);
    this.canvas.addEventListener('touchmove', this.move, false);
    /*
    $('#shapeEdit').click( function() {
      cKit.inCurveEditMode = !cKit.inCurveEditMode;
      cKit.redraw();
    });
    $('#shapeColor').click( function() {
      cKit.toggleCurveColor = !cKit.toggleCurveColor;
      cKit.redraw();
    });
    $('#k').change( function() {
      cKit.update();
      return true;
    });
    $( '#myCanvas' ).mousedown(function(event){
      event.preventDefault();
    });
    $('#bgAlpha').change(function(){
      var newAlpha = parseFloat($(this).val());
      if( dnexist(newAlpha) || newAlpha > 1 ) {
        backgroundAlpha = 1.0;
        $(this).val('1.0');
      } else if( newAlpha < 0) {
        backgroundAlpha = 0.0;
        $(this).val('0.0');
      } else {
        backgroundAlpha = newAlpha;
      }
      redraw();
    });
    */
    this.canvas.addEventListener('mousedown', this.startDrag, false);
    this.canvas.addEventListener('mouseup', this.endDrag, false);
    this.canvas.addEventListener('mousemove', this.move, false);
    //this.animationEvents();
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

  cKit.prototype.injectColor = function(id, color) {
    /*
    var thisC = $('#' + id);
    var theseC = new Array(decodeFromHex(color.substring(0, 2)), decodeFromHex(color.substring(2, 4)),decodeFromHex(color.substring(4, 6)) );
    thisC.attr('style', 'background-color: #' + color); //rgb(' + theseC[0] + ',' + theseC[1] + ',' +  theseC[2]+ ')'); 
    thisC.attr('color', color);
    $('#' + id).html(gripImg(theseC[0],theseC[1] ,theseC[2]));
    return false;
    */
  }

  cKit.prototype.debugConsole = function(text) {
    var HUD = document.getElementById('console')
    if( HUD.firstChild ) {
        HUD.removeChild( HUD.firstChild );
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