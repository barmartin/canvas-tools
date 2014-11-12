define(function(require) {
  'use strict';
  var constants = require('constants');
  var Vector = require('Vector');

  /* objPoint is a reference to the point inside the pedal */
  var CPoint = function(kit, x, y, parentObject, index) {
    this.kit = kit;
    this.x = x;
    this.y = y;
    this.parentObject = parentObject;
    this.index = index;
    this.inDrag = false;

    this.draw = function() {
      var realPoint = Vector.rotate(0, 0, this, parentObject.rotation);
      // Need to redo constraints with full reverse tranform now
      // kit.constrain(realPoint);
      if (this.inDrag) {
        var points = parentObject.shapePoints;
        if(kit.editMode===constants.EDIT_TRANSFORM) {
          points = parentObject.transformPoints;
        }
        if (this.index === 1) {
          var _anchorPoint = Vector.rotate(0, 0, points[0], parentObject.rotation);
          kit.context.beginPath();
          kit.context.moveTo(realPoint.x, realPoint.y);
          kit.context.lineTo(_anchorPoint.x, _anchorPoint.y);
          kit.context.stroke();
        }
        else if (this.index === 2) {
          var anchorPoint = Vector.rotate(0, 0, points[3], parentObject.rotation);
          kit.context.beginPath();
          kit.context.moveTo(realPoint.x, realPoint.y);
          kit.context.lineTo(anchorPoint.x, anchorPoint.y);
          kit.context.stroke();
        }
      }
      kit.context.beginPath();
      kit.context.arc(realPoint.x, realPoint.y, this.kit.controlPointRadius, 0, Math.PI * 2, true);
      kit.context.closePath();
      kit.context.lineWidth = 1;

      if (this.inDrag) {
        kit.context.fillStyle = '#999999';
        kit.context.fill();
      } else {
        kit.context.fillStyle = '#FFFFFF';
        kit.context.fill();
      }
      kit.context.stroke();
    }
    this.mouseInside = function(point) {
      return this.kit.controlPointRadius + constants.MAX_CLICK_DISTANCE > Vector.distance(point, this);
    }
  }
  return CPoint;
});