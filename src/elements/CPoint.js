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
      var realPoint;
      if(this.kit.editMode!==constants.EDIT_TRANSFORM||this.index!==2) {
        realPoint = Vector.rotate(0, 0, this, parentObject.rotation);
      } else {
        realPoint = this;
      }
      // Need to redo constraints with full reverse tranform now
      // kit.constrain(realPoint);
      if (this.inDrag) {
        var anchorPoint;
        var points = parentObject.shapePoints;
        if(this.kit.editMode===constants.EDIT_TRANSFORM) {
          points = parentObject.transformPoints;
        }
        if (this.index === 1) {
          anchorPoint = Vector.rotate(0, 0, points[0], parentObject.rotation);
          this.kit.context.beginPath();
          this.kit.context.moveTo(realPoint.x, realPoint.y);
          this.kit.context.lineTo(anchorPoint.x, anchorPoint.y);
          this.kit.context.stroke();
        } else if (this.index === 2) {
          if(this.kit.editMode===constants.EDIT_TRANSFORM) {
            // TODO fix this
            anchorPoint = points[0];
          } else {
            anchorPoint = Vector.rotate(0, 0, points[3], parentObject.rotation);
          }
          this.kit.context.beginPath();
          this.kit.context.moveTo(realPoint.x, realPoint.y);
          this.kit.context.lineTo(anchorPoint.x, anchorPoint.y);
          this.kit.context.stroke();
        }
      }
      this.kit.context.beginPath();
      this.kit.context.arc(realPoint.x, realPoint.y, this.kit.controlPointRadius, 0, Math.PI * 2, true);
      this.kit.context.closePath();
      this.kit.context.lineWidth = 1;

      if (this.inDrag) {
        this.kit.context.fillStyle = '#999999';
        this.kit.context.fill();
      } else {
        this.kit.context.fillStyle = '#FFFFFF';
        this.kit.context.fill();
      }
      this.kit.context.stroke();
    }
    this.mouseInside = function(point) {
      return this.kit.controlPointRadius + constants.MAX_CLICK_DISTANCE > Vector.distance(point, this)*this.parentObject.scale;
    }
  }
  return CPoint;
});