define(function(require) {
  'use strict';
  var kit = require('core');
  var Vector = require('Vector');
  var constants = require('constants');
  var _u = require('util');
  var CPoint = require('CPoint');
  
  // EVENT BINDING
  // Consider moving out of kit scope because they execute in global
  kit.prototype.bindEvents = function(){
    /* TODO (WIP for touch devices) */
    this.canvas.addEventListener('touchstart', this.startDrag, false);
    this.canvas.addEventListener('touchend', this.endDrag, false);
    this.canvas.addEventListener('touchmove', this.move, false);
    // Mouse Canvas Events
    this.canvas.addEventListener('mousedown', this.startDrag, false);
    this.canvas.addEventListener('mouseup', this.endDrag, false);
    this.canvas.addEventListener('mousemove', this.move, false);
  }

  kit.prototype.startDrag = function(event) {
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

  kit.prototype.endDrag = function(event){ 
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
    kit.digest();
  }
  
  kit.prototype.move = function(event){
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
          var newPoint = new CPoint(kit, _u.reduceSig(actualPosition.x, constants.MAX_CP_SIGS), _u.reduceSig(actualPosition.y, constants.MAX_CP_SIGS), object, index);
          newPoint.inDrag = true;
          object.updatePetal(index, newPoint);
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
            var angle = Vector.getDegrees(Vector.create(0, 0), angleVector);
            kit.setRotation(angle);
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

  kit.prototype.constrain = function (point) {
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

  return kit
});