define(function(require) {
  'use strict';
  var constants = require('constants');
  var CPoint = require('CPoint');
  var Vector = require('Vector');
  var u = require('util');

  var PetalFlower = function(kit, petals, radialAccent, innerRadius, outerRadius, center) {
    // Reference to parent package
    this.kit = kit;

    // Instantiation Variables
    this.rotation = 0;
    this.petalCount = petals;
    this.radialAccent = radialAccent;
    this.increment = 2 * Math.PI / petals;
    this.firstInnerAngle = -0.5 * this.increment * radialAccent;
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;
    this.center = center;
    // 
    this.allPetals = [];
    this.firstPetal = [];
    this.controlPoints = [];
    this.thisAngle = 0;

    /* Setup curve that is the to be reflected/rotated/modified */
    var cp, cp2, cp3, cp4;
    if (this.kit.curve.length === 8) {
      cp = Vector.create(kit.curve[0], this.kit.curve[1]);
      cp2 = Vector.create(kit.curve[2], this.kit.curve[3]);
      cp3 = Vector.create(kit.curve[4], this.kit.curve[5]);
      cp4 = Vector.create(kit.curve[6], this.kit.curve[7]);
    } else {
      cp = Vector.getPoint(this.center.x, this.center.y, this.innerRadius, this.firstInnerAngle);
      var secondCPRadius = (this.outerRadius - this.innerRadius) / 2 + this.innerRadius;
      cp2 = Vector.getPoint(this.center.x, this.center.y, secondCPRadius, this.firstInnerAngle);
      cp3 = Vector.getPoint(this.center.x, this.center.y, this.outerRadius, this.thisAngle);
      cp3.x = cp3.x - 40;
      cp4 = Vector.getPoint(this.center.x, this.center.y, this.outerRadius, this.thisAngle);
    }
    /* getPoint() is a Radial point P(angle, radius) */
    this.firstPetal.push(cp);
    this.controlPoints.push(new CPoint(kit, cp.x, cp.y, this, 0));
    this.controlPoints.push(new CPoint(kit, cp2.x, cp2.y, this, 1));
    this.firstPetal.push(cp2);
    this.controlPoints.push(new CPoint(kit, cp3.x, cp3.y, this, 2));
    this.firstPetal.push(cp3);
    this.controlPoints.push(new CPoint(kit, cp4.x, cp4.y, this, 3));
    this.firstPetal.push(cp4);
    /* Reflect Curve about the y axis to create the first Petal */
    this.firstPetal.push(Vector.create(-1 * (cp3.x - this.center.x) + this.center.x, cp3.y));
    this.firstPetal.push(Vector.create(-1 * (cp2.x - this.center.x) + this.center.x, cp2.y));
    this.firstPetal.push(Vector.create(-1 * (cp.x - this.center.x) + this.center.x, cp.y));

    /* 
     * Use first Petal as a template for the rest of the Petals 
     * First Petal is drawn at each radial based on PetalCount rotation
     */
    this.createPetals();
  }

/* Use first Petal as a template for the rest of the Petals */ 
  PetalFlower.prototype.createPetals = function() {
    this.allPetals.push(this.firstPetal);
    for (var i = 1; i < this.petalCount; i++) {
      this.thisAngle = i * this.increment;
      var newPetal = [];
      var thisAngle = this.thisAngle;
      var thisFlower = this;
      u.each(this.firstPetal, function(point) {
        var thisPoint = Vector.rotate(thisFlower.center.x, thisFlower.center.y, point, thisAngle);
        newPetal.push(thisPoint);
      });
      this.allPetals.push(newPetal);
    }
  }

  /*
   * Update the first Petal based on a control point change.
   * Recreate all the other Petals based on first Petal.
   * Could make this more efficient with modifications instead 
   * of recreating the whole flower. (TODO)
   */
  PetalFlower.prototype.updatePetal = function(index, newPoint) {    
    var newCoords = Vector.create(newPoint.x, newPoint.y);
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
    //var index = this.kit.indexOf(this.firstPetal, PetalPoint);
    if (index === 3) {
      newCoords.x = this.kit.canvasWidth / 2;
      this.firstPetal[ 3 ].x = newCoords.x;
      this.firstPetal[ index ].y = newPoint.y;
    } else if (index === 0) {
      this.innerRadius = Vector.distance(Vector.create(this.center.x, this.center.y), Vector.create(newPoint.x, newPoint.y));
      newCoords = Vector.getPoint(this.center.x, this.center.y, this.innerRadius, this.firstInnerAngle);
      this.firstPetal[ 0 ].x = newCoords.x;
      this.firstPetal[ 0 ].y = newCoords.y;
      this.firstPetal[ 6 ].x = 2 * this.kit.canvasWidth / 2 - newCoords.x;
      this.firstPetal[ 6 ].y = newCoords.y;
    } else {
      this.firstPetal[ index ].x = newPoint.x;
      this.firstPetal[ 6 - index ].x = 2 * this.kit.canvasWidth / 2 - newPoint.x;
      this.firstPetal[ 6 - index ].y = newPoint.y;
      this.firstPetal[ index ].y = newPoint.y;
    }
    this.allPetals = [];
    /* Create the rest of the Petals by copying  and rotating the first Petal */
    this.createPetals();
    /* update control point with constrained values */
    this.controlPoints[index].x = newCoords.x;
    this.controlPoints[index].y = newCoords.y;
  }

  /*
   * Modify flower for a set of control points
   * Called before createPetals
   * Used when loading a keyframe
   */
  PetalFlower.prototype.updateFirstPetal = function() {
    //this.firstPetal = [];
    this.firstPetal[0].x=this.controlPoints[0].x;
    this.firstPetal[0].y=this.controlPoints[0].y;
    this.firstPetal[1].x=this.controlPoints[1].x;
    this.firstPetal[1].y=this.controlPoints[1].y;
    this.firstPetal[2].x=this.controlPoints[2].x;
    this.firstPetal[2].y=this.controlPoints[2].y;
    this.firstPetal[3].x=this.controlPoints[3].x;
    this.firstPetal[3].y=this.controlPoints[3].y;
    /* Reflect Curve about the y axis to create the first Petal */
    this.firstPetal[4].x =-1 * (this.controlPoints[2].x - this.center.x) + this.center.x;
    this.firstPetal[4].y = this.controlPoints[2].y;
    this.firstPetal[5].x =-1 * (this.controlPoints[1].x - this.center.x) + this.center.x;
    this.firstPetal[5].y = this.controlPoints[1].y;
    this.firstPetal[6].x = -1 * (this.controlPoints[0].x - this.center.x) + this.center.x;
    this.firstPetal[6].y = this.controlPoints[0].y;
  }

  PetalFlower.prototype.setControlPoint = function(point, newPoint) {
    this.controlPoints[this.kit.indexOf(this.controlPoints, point)] = newPoint;
  }

  PetalFlower.prototype.draw = function() {
    var index = 0;
    var flower = this;
    var kit = this.kit;
    kit.context.save();
    kit.context.beginPath();
    u.each( this.allPetals, function(Petal) {
      // TODO manage these settings 
      /* if ( index === 0 && kit.toggleCurveColor ) {
        kit.context.strokeStyle = '#00ff00';
      } */
      kit.context.lineWidth = 1;
      //kit.context.beginPath();
      if(flower.rotation === 0) {
        kit.context.moveTo( Petal[0].x, Petal[0].y );
        kit.context.bezierCurveTo(Petal[1].x, Petal[1].y, Petal[2].x, Petal[2].y, Petal[3].x, Petal[3].y);
        kit.context.bezierCurveTo(Petal[4].x, Petal[4].y, Petal[5].x, Petal[5].y, Petal[6].x, Petal[6].y);
        kit.context.moveTo( Petal[6].x, Petal[6].y );
        kit.context.lineTo(Petal[0].x, Petal[0].y);
      } else {
        var rotated = [];
        for( var i = 0; i < Petal.length; i++) {
          rotated.push(Vector.rotate(flower.center.x, flower.center.y, Petal[i], flower.rotation*constants.TWOPIDIV360));
        }
        kit.context.moveTo(rotated[0].x, rotated[0].y);
        kit.context.bezierCurveTo(rotated[1].x, rotated[1].y, rotated[2].x, rotated[2].y, rotated[3].x, rotated[3].y);
        kit.context.bezierCurveTo(rotated[4].x, rotated[4].y, rotated[5].x, rotated[5].y, rotated[6].x, rotated[6].y);
        kit.context.moveTo( rotated[6].x, rotated[6].y );
        kit.context.lineTo(rotated[0].x, rotated[0].y);
      }
      //kit.context.closePath();
      if(index===0){
        //kit.context.clip();
        //kit.context.drawImage(kit.backgroundImage, 0, 0, kit.canvasWidth, kit.canvasHeight);
      }
      // kit.context.stroke();
      // kit.context.strokeStyle = '#' + kit.lineColor;
      index++;
    });

    kit.context.closePath();
    if(kit.fillImageExists) {
      kit.context.clip();
      kit.context.drawImage(kit.fillImage, 0, 0, kit.canvasWidth, kit.canvasHeight);
      if(kit.toggleCurveColor===true){
        kit.context.lineWidth = 3;
        kit.context.stroke();
      }
    } else {
      kit.context.stroke();
    }
    kit.context.restore();
  }

  PetalFlower.prototype.updateRadialPoint = function() {
    this.increment = 2 * Math.PI / this.petalCount;
    // rotate?
    this.firstInnerAngle = -0.5 * this.increment * this.radialAccent;
    var kit = this.kit;
    var flower = this;
    u.each(kit.keyFrames, function(keyFrame){
      var point = keyFrame.obj[kit.selectedObject].controlPoints[0];
      var radius = Vector.distance(flower.center, Vector.create(point.x, point.y));
      var newPosition = Vector.getPolarPoint(flower.center, radius, flower.firstInnerAngle);
      point.x = newPosition.x;
      point.y = newPosition.y;
    });
  }

  /*
   * Allows center shape manipulation
   * scale should be between 0 and petalCount
   */
  PetalFlower.prototype.accentRadialPoint = function(scale) {
    this.radialAccent = scale;
    this.increment = 2 * Math.PI / this.petalCount;
    // rotate?
    this.firstInnerAngle = -0.5 * this.increment * scale;
    var kit = this.kit;
    var flower = this;
    u.each(kit.keyFrames, function(keyFrame){
      var point = keyFrame.obj[kit.selectedObject].controlPoints[0];
      var radius = Vector.distance(flower.center, Vector.create(point.x, point.y));
      var newPosition = Vector.getPolarPoint(flower.center, radius, flower.firstInnerAngle);
      point.x = newPosition.x;
      point.y = newPosition.y;
    });
  }

  PetalFlower.prototype.drawControlPoints = function() {
    var cps = this.controlPoints;
    u.each(cps, function(controlPoint) {
      controlPoint.draw(cps);
    });
  }

  PetalFlower.prototype.getState = function() {
    var cps = [];
    u.each(this.controlPoints, function(point){
      cps.push( Vector.create(point.x, point.y) );
    });
    return { 'controlPoints': cps,
             'rotation': this.rotation };
  }

  PetalFlower.prototype.setState = function(state) {
    var kit = this.kit;
    this.rotation = state.rotation;
    // TODO check this
    kit.index = 0;
    u.each(this.controlPoints, function(cp) {
      cp.x = state.controlPoints[kit.index].x;
      cp.y = state.controlPoints[kit.index].y;
      kit.index++;      
    });
    //kitt.each(this.controlPoints, function(newCp){
    //this.controlPoints = state.controlPoints;
    this.allPetals = [];
    this.updateFirstPetal();
    this.createPetals();
    kit.redraw();
  }

  return PetalFlower;
});
