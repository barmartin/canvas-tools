define(function(require) {
  'use strict';
  var constants = require('constants');

  /* objPoint is a reference to the point inside the pedal */
  var CPoint = function(kit, x, y, parentObject, index) {
    this.kit = kit;
    this.x = x;
    this.y = y;
    this.index = index;
    this.inDrag = false;

    // TODO Review need for cPoints reference
    this.draw = function(cPoints) {
      if (!this.kit.inCurveEditMode) {
          return;
      }
      var realPoint = this.kit.Vector.rotate(kit.midWidth, kit.midHeight, this, parentObject.rotation*constants.TWOPIDIV360);
      if (this.inDrag) {
        if (index === 1) {
          var _anchorPoint = this.kit.Vector.rotate(kit.midWidth, kit.midHeight, parentObject.controlPoints[0], parentObject.rotation*constants.TWOPIDIV360);
          kit.context.beginPath();
          kit.context.moveTo(realPoint.x, realPoint.y);
          kit.context.lineTo(_anchorPoint.x, _anchorPoint.y);
          kit.context.stroke();
        }
        else if (index === 2) {
          var anchorPoint = this.kit.Vector.rotate(kit.midWidth, kit.midHeight, parentObject.controlPoints[3], parentObject.rotation*constants.TWOPIDIV360);
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
    };
    this.mouseInside = function(point) {
      return this.kit.controlPointRadius + 2 > this.kit.Vector.distance(point, this);
    };
  }
  return CPoint;
});