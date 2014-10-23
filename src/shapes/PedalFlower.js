define(function(require) {
  'use strict';
  var constants = require('constants');
  var CPoint = require('CPoint');

  var PedalFlower = function(kit, pedals, innerRadius, outerRadius, type) {
    // Parent
    this.kit = kit;
    this.rotation = 0;
    this.pedalCount = pedals;
    this.increment = 2 * Math.PI / pedals;
    this.firstInnerAngle = -0.5 * this.increment;
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;

    this.allPedals = [];
    this.firstPedal = [];
    this.controlPoints = [];
    this.thisAngle = 0;
    /* Setup curve that is the to be reflected/rotated/modified */
    var cp, cp2, cp3, cp4;
    if (this.kit.curve.length === 8) {
      cp = this.kit.Vector.create(kit.curve[0], this.kit.curve[1]);
      cp2 = this.kit.Vector.create(kit.curve[2], this.kit.curve[3]);
      cp3 = this.kit.Vector.create(kit.curve[4], this.kit.curve[5]);
      cp4 = this.kit.Vector.create(kit.curve[6], this.kit.curve[7]);
    } else {
      cp = this.kit.Vector.getPoint(this.kit.midWidth, this.kit.midHeight, this.innerRadius, this.firstInnerAngle);
      var secondCPRadius = (this.outerRadius - this.innerRadius) / 2 + this.innerRadius;
      cp2 = this.kit.Vector.getPoint(this.kit.midWidth, this.kit.midHeight, secondCPRadius, this.firstInnerAngle);
      cp3 = this.kit.Vector.getPoint(this.kit.midWidth, this.kit.midHeight, this.outerRadius, this.thisAngle);
      cp3.x = cp3.x - 40;
      cp4 = this.kit.Vector.getPoint(this.kit.midWidth, this.kit.midHeight, this.outerRadius, this.thisAngle);
    }
    /* getPoint() is a Radial point P(angle, radius) */
    this.firstPedal.push(cp);
    this.controlPoints.push(new CPoint(kit, cp.x, cp.y, this, 0));
    this.controlPoints.push(new CPoint(kit, cp2.x, cp2.y, this, 1));
    this.firstPedal.push(cp2);
    this.controlPoints.push(new CPoint(kit, cp3.x, cp3.y, this, 2));
    this.firstPedal.push(cp3);
    this.controlPoints.push(new CPoint(kit, cp4.x, cp4.y, this, 3));
    this.firstPedal.push(cp4);
    /* Reflect Curve about the y axis to create the first pedal */
    this.firstPedal.push(this.kit.Vector.create(-1 * (cp3.x - this.kit.midWidth) + this.kit.midWidth, cp3.y));
    this.firstPedal.push(this.kit.Vector.create(-1 * (cp2.x - this.kit.midWidth) + this.kit.midWidth, cp2.y));
    this.firstPedal.push(this.kit.Vector.create(-1 * (cp.x - this.kit.midWidth) + this.kit.midWidth, cp.y));
    /* Use first pedal as a template for the rest of the pedals */
    this.createPedals();
  }

/* Use first pedal as a template for the rest of the pedals */
  PedalFlower.prototype.createPedals = function() {
    this.allPedals.push(this.firstPedal);
    var kit = this.kit;
    for (var i = 1; i < this.pedalCount; i++) {
      this.thisAngle = i * this.increment;
      var newPedal = [];
      var thisAngle = this.thisAngle;
      kit.each(this.firstPedal, function(point) {
        var thisPoint = kit.Vector.rotate(kit.midWidth, kit.midHeight, point, thisAngle);
        //controlPoints.push( new CPoint( thisPoint.x, thisPoint.y ) );
        newPedal.push(thisPoint);
      });
      this.allPedals.push(newPedal);
    }
  }

  PedalFlower.prototype.updatePedal = function(index, newPoint) {
    var newCoords = this.kit.Vector.create(newPoint.x, newPoint.y);
    if (newCoords.x < 10) {
      newCoords.x = 10;
    }
    if (newCoords.x > this.kit.canvasWidth - 10) {
      newCoords.x = this.kit.canvasWidth - 10;
    }
    if (newCoords.y < 10) {
      newCoords.y = 10;
    }
    if (newCoords.y > this.kit.canvasWidth - 10) {
      newCoords.y = this.kit.canvasHeight - 10;
    }
    //var index = this.kit.indexOf(this.firstPedal, pedalPoint);
    if (index === 3) {
      newCoords.x = this.kit.canvasWidth / 2;
      this.firstPedal[ 3 ].x = newCoords.x;
      this.firstPedal[ index ].y = newPoint.y;
    } else if (index === 0) {
      this.innerRadius = this.kit.Vector.distance( this.kit.Vector.create(this.kit.midWidth, this.kit.midHeight), this.kit.Vector.create(newPoint.x, newPoint.y) );
      newCoords = this.kit.Vector.getPoint( this.kit.midWidth, this.kit.midHeight, this.innerRadius, this.firstInnerAngle );
      this.firstPedal[ 0 ].x = newCoords.x;
      this.firstPedal[ 0 ].y = newCoords.y;
      this.firstPedal[ 6 ].x = 2 * this.kit.canvasWidth / 2 - newCoords.x;
      this.firstPedal[ 6 ].y = newCoords.y;
    } else {
      this.firstPedal[ index ].x = newPoint.x;
      this.firstPedal[ 6 - index ].x = 2 * this.kit.canvasWidth / 2 - newPoint.x;
      this.firstPedal[ 6 - index ].y = newPoint.y;
      this.firstPedal[ index ].y = newPoint.y;
    }
    this.allPedals = [];
    /* Create the rest of the pedals by copying  and rotating the first pedal */
    this.createPedals();
    /* update control point with constrained values */
    this.controlPoints[index].x = newCoords.x;
    this.controlPoints[index].y = newCoords.y;
  }

  PedalFlower.prototype.updateFirstPedal = function(){
    //this.firstPedal = [];
    this.firstPedal[0].x=this.controlPoints[0].x;
    this.firstPedal[0].y=this.controlPoints[0].y;
    this.firstPedal[1].x=this.controlPoints[1].x;
    this.firstPedal[1].y=this.controlPoints[1].y;
    this.firstPedal[2].x=this.controlPoints[2].x;
    this.firstPedal[2].y=this.controlPoints[2].y;
    this.firstPedal[3].x=this.controlPoints[3].x;
    this.firstPedal[3].y=this.controlPoints[3].y;
    /* Reflect Curve about the y axis to create the first pedal */
    this.firstPedal[4].x =-1 * (this.controlPoints[2].x - this.kit.midWidth) + this.kit.midWidth;
    this.firstPedal[4].y = this.controlPoints[2].y;
    this.firstPedal[5].x =-1 * (this.controlPoints[1].x - this.kit.midWidth) + this.kit.midWidth;
    this.firstPedal[5].y = this.controlPoints[1].y;
    this.firstPedal[6].x = -1 * (this.controlPoints[0].x - this.kit.midWidth) + this.kit.midWidth;
    this.firstPedal[6].y = this.controlPoints[0].y;
  }

  PedalFlower.prototype.setControlPoint = function(point, newPoint) {
    this.controlPoints[this.kit.indexOf(this.controlPoints, point)] = newPoint;
  }

  PedalFlower.prototype.draw = function(){
    var index = 0;
    var flower = this;
    var kit = this.kit;
    kit.each( this.allPedals, function(pedal) {
      if ( index === 0 && kit.toggleCurveColor ) {
        kit.context.strokeStyle = '#00ff00';
      }
      kit.context.lineWidth = 1;
      kit.context.beginPath();
      if(flower.rotation === 0) {
        kit.context.moveTo( pedal[0].x, pedal[0].y );
        kit.context.bezierCurveTo(pedal[1].x, pedal[1].y, pedal[2].x, pedal[2].y, pedal[3].x, pedal[3].y);
        kit.context.stroke();
        kit.context.bezierCurveTo(pedal[4].x, pedal[4].y, pedal[5].x, pedal[5].y, pedal[6].x, pedal[6].y);
      } else {
        var rotated = [];
        for( var i = 0; i < pedal.length; i++) {
          rotated.push(kit.Vector.rotate(kit.midWidth, kit.midHeight, pedal[i], flower.rotation*constants.TWOPIDIV360));
        }
        kit.context.moveTo( rotated[0].x, rotated[0].y );
        kit.context.bezierCurveTo(rotated[1].x, rotated[1].y, rotated[2].x, rotated[2].y, rotated[3].x, rotated[3].y);
        kit.context.stroke();
        kit.context.bezierCurveTo(rotated[4].x, rotated[4].y, rotated[5].x, rotated[5].y, rotated[6].x, rotated[6].y);
      }
      kit.context.closePath();
      kit.context.stroke();
      kit.context.strokeStyle = '#' + kit.lineColor;
      index++;
    });
    var cPs = this.controlPoints;
    if( kit.indexOf( kit.objList, this) === kit.selectedObject) {
      kit.each(this.controlPoints, function(controlPoint) {
        controlPoint.draw(cPs);
      });
    }
  }

  PedalFlower.prototype.getState = function() {
    var cps = [];
    var kit = this.kit;
    kit.each(this.controlPoints, function(point){
      cps.push( kit.Vector.create(point.x, point.y) );
    });
    return { 'controlPoints': cps,
             'rotation': this.rotation };
  }

  PedalFlower.prototype.setState = function(state) {
    var kit = this.kit;
    this.rotation = state.rotation;
    kit.index = 0;
    kit.each(this.controlPoints, function(cp) {
      cp.x = state.controlPoints[kit.index].x;
      cp.y = state.controlPoints[kit.index].y;
      kit.index++;      
    });
    //kitt.each(this.controlPoints, function(newCp){
    //this.controlPoints = state.controlPoints;
    this.allPedals = [];
    this.updateFirstPedal();
    this.createPedals();
    kit.redraw();
  }

  return PedalFlower;
});