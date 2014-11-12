define(function(require) {
  'use strict';
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

    this.allPetals = [];
    this.firstPetal = [];
    this.shapePoints = [];
    this.transformPoints = [];
    this.thisAngle = 0;

    this.scaleDistance = this.kit.midWidth/2;
    this.scale = 1;
    this.lastScale = 1;

    /* Setup curve that is the to be reflected/rotated/modified */
    var cp, cp2, cp3, cp4;
    if (this.kit.curve.length === 8) {
      // REMOVE Backbone.js Legacy code
      cp = Vector.create(kit.curve[0], this.kit.curve[1]);
      cp2 = Vector.create(kit.curve[2], this.kit.curve[3]);
      cp3 = Vector.create(kit.curve[4], this.kit.curve[5]);
      cp4 = Vector.create(kit.curve[6], this.kit.curve[7]);
    } else {
      cp = Vector.getPoint(0, 0, this.innerRadius, this.firstInnerAngle);
      var secondCPRadius = (this.outerRadius - this.innerRadius) / 2 + this.innerRadius;
      cp2 = Vector.getPoint(0, 0, secondCPRadius, this.firstInnerAngle);
      cp3 = Vector.getPoint(0, 0, this.outerRadius, this.thisAngle);
      cp3.x = cp3.x - 40;
      cp4 = Vector.getPoint(0, 0, this.outerRadius, this.thisAngle);
    }
    /* getPoint() is a Radial point P(angle, radius) */
    this.firstPetal.push(cp);
    this.shapePoints.push(new CPoint(kit, cp.x, cp.y, this, 0));
    this.shapePoints.push(new CPoint(kit, cp2.x, cp2.y, this, 1));
    this.firstPetal.push(cp2);
    this.shapePoints.push(new CPoint(kit, cp3.x, cp3.y, this, 2));
    this.firstPetal.push(cp3);
    this.shapePoints.push(new CPoint(kit, cp4.x, cp4.y, this, 3));
    this.firstPetal.push(cp4);
    /* Reflect Curve about the y axis to create the first Petal */
    this.firstPetal.push(Vector.create(-cp3.x, cp3.y));
    this.firstPetal.push(Vector.create(-cp2.x, cp2.y));
    this.firstPetal.push(Vector.create(-cp.x, cp.y));

    this.transformPoints.push( new CPoint(this.kit, 0, 0, this, 0) );
    var rotatePoint = Vector.create(0, -this.kit.midHeight/2.5);
    Vector.rotate(0, 0, rotatePoint, this.rotation);
    this.transformPoints.push( new CPoint(this.kit, rotatePoint.x, rotatePoint.y, this, 1))
    this.transformPoints.push( new CPoint(this.kit, this.scaleDistance, 0, this, 2))
    // TODO Scale point

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
      u.each(this.firstPetal, function(point) {
        var thisPoint = Vector.rotate(0, 0, point, thisAngle);
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
    /*
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
    } */
    //var index = this.kit.indexOf(this.firstPetal, PetalPoint);
    // Could add toggle to allow skewed flowers
    if (index === 3) {
      newCoords.x = 0;
      this.firstPetal[ 3 ].x = 0;
      this.firstPetal[ index ].y = newPoint.y;
    } else if (index === 0) {
      this.innerRadius = Vector.distance(Vector.create(0, 0), Vector.create(newPoint.x, newPoint.y));
      newCoords = Vector.getPoint(0, 0, this.innerRadius, this.firstInnerAngle);
      this.firstPetal[ 0 ].x = newCoords.x;
      this.firstPetal[ 0 ].y = newCoords.y;
      this.firstPetal[ 6 ].x = -newCoords.x;
      this.firstPetal[ 6 ].y = newCoords.y;
    } else {
      this.firstPetal[ index ].x = newPoint.x;
      this.firstPetal[ 6 - index ].x = - newPoint.x;
      this.firstPetal[ 6 - index ].y = newPoint.y;
      this.firstPetal[ index ].y = newPoint.y;
    }
    this.allPetals = [];
    /* Create the rest of the Petals by copying  and rotating the first Petal */
    this.createPetals();
    /* update control point with constrained values */
    this.shapePoints[index].x = newCoords.x;
    this.shapePoints[index].y = newCoords.y;
  }

  /*
   * Update the first Petal based on a transform change.
   * Recreate all the other Petals based on first Petal.
   */
  PetalFlower.prototype.updateTransform = function(index, newPoint) {
    var newCoords = Vector.create(newPoint.x, newPoint.y);
    if(index===1){
      
    }
    this.transformPoints[index].x = newCoords.x;
    this.transformPoints[index].y = newCoords.y;
  }

  /*
   * Rotate, Scale and Transform Context
   *  (RST)
   */
  PetalFlower.prototype.transform = function() {
    this.kit.context.transform(this.scale, 0, 0, this.scale, this.center.x, this.center.y);
  }

  /*
   * Rotate, Scale and Transform Context
   *  (RST)
   */
  PetalFlower.prototype.translateTranform = function() {
    this.kit.context.transform(1, 0, 0, 1, this.center.x, this.center.y);
  }

  /*
   *  Use a reverse transform to find actual point
   *  For finding a click in the object space (TSR)
   */
  PetalFlower.prototype.reverseTransformPoint = function(point) {
    // TODO scale and rotate inclusion
    var actual = Vector.create(point.x-this.center.x, point.y-this.center.y);
    actual.x /= this.scale;
    actual.y /= this.scale;
    actual = Vector.rotate(0, 0, actual, -this.rotation);
    return actual;
  }

  PetalFlower.prototype.setScale = function(xPosition) {
    this.scale = this.lastScale*xPosition/this.scaleDistance;
  }

  PetalFlower.prototype.resetScalePoint = function(xPosition) {
    this.transformPoints[2].x = this.scaleDistance;
  }

  /*
   * Modify flower for a set of control points
   * Called before createPetals
   * Used when loading a keyframe
   */
  PetalFlower.prototype.updateFirstPetal = function() {
    //this.firstPetal = [];
    this.firstPetal[0].x=this.shapePoints[0].x;
    this.firstPetal[0].y=this.shapePoints[0].y;
    this.firstPetal[1].x=this.shapePoints[1].x;
    this.firstPetal[1].y=this.shapePoints[1].y;
    this.firstPetal[2].x=this.shapePoints[2].x;
    this.firstPetal[2].y=this.shapePoints[2].y;
    this.firstPetal[3].x=this.shapePoints[3].x;
    this.firstPetal[3].y=this.shapePoints[3].y;
    /* Reflect Curve about the y axis to create the first Petal */
    this.firstPetal[4].x =-this.shapePoints[2].x;
    this.firstPetal[4].y = this.shapePoints[2].y;
    this.firstPetal[5].x =-this.shapePoints[1].x;
    this.firstPetal[5].y = this.shapePoints[1].y;
    this.firstPetal[6].x = -this.shapePoints[0].x;
    this.firstPetal[6].y = this.shapePoints[0].y;
  }

  PetalFlower.prototype.setControlPoint = function(point, newPoint) {
    this.shapePoints[this.kit.indexOf(this.shapePoints, point)] = newPoint;
  }

  PetalFlower.prototype.draw = function() {
    var index = 0;
    var flower = this;
    var kit = this.kit;
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
          rotated.push(Vector.rotate(0, 0, Petal[i], flower.rotation));
        }
        kit.context.moveTo(rotated[0].x, rotated[0].y);
        kit.context.bezierCurveTo(rotated[1].x, rotated[1].y, rotated[2].x, rotated[2].y, rotated[3].x, rotated[3].y);
        kit.context.bezierCurveTo(rotated[4].x, rotated[4].y, rotated[5].x, rotated[5].y, rotated[6].x, rotated[6].y);
        kit.context.moveTo( rotated[6].x, rotated[6].y );
        kit.context.lineTo(rotated[0].x, rotated[0].y);
      }
      // Could setup different fills for each layer here
      index++;
    });

    kit.context.closePath();
    if(kit.fillImageExists) {
      // TODO Multiple blending modes feature
      kit.context.globalCompositeOperation = kit.sourceMode;
      kit.context.clip();
      kit.context.drawImage(kit.fillImage, -kit.midWidth, -kit.midHeight, kit.canvasWidth, kit.canvasHeight);
      if(kit.toggleCurveColor===true) {
        // Restore composition mode in the case the line highlight mode is toggled
        kit.context.globalCompositeOperation = 'source-over';
        kit.context.lineWidth = 1.9;
        kit.context.stroke();
      }
    } else {
      // Restore composition mode in case fill image has been removed
      kit.context.globalCompositeOperation = 'source-over';
      kit.context.stroke();
    }
  }

  PetalFlower.prototype.updateRadialPoint = function() {
    this.increment = 2 * Math.PI / this.petalCount;
    this.firstInnerAngle = -0.5 * this.increment * this.radialAccent;
    var kit = this.kit;
    var flower = this;
    u.each(kit.keyFrames, function(keyFrame){
      var point = keyFrame.obj[kit.selectedObject].shapePoints[0];
      var radius = Vector.distance(Vector.zeroVector(), Vector.create(point.x, point.y));
      var newPosition = Vector.getPolarPoint(Vector.zeroVector(), radius, flower.firstInnerAngle);
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
    this.firstInnerAngle = -0.5 * this.increment * scale;
    var kit = this.kit;
    var flower = this;
    u.each(kit.keyFrames, function(keyFrame){
      var point = keyFrame.obj[kit.selectedObject].shapePoints[0];
      var radius = Vector.distance(Vector.zeroVector(), Vector.create(point.x, point.y));
      var newPosition = Vector.getPolarPoint(Vector.zeroVector(), radius, flower.firstInnerAngle);
      point.x = newPosition.x;
      point.y = newPosition.y;
    });
  }

  PetalFlower.prototype.drawShapePoints = function() {
    this.kit.context.save();
    // Using custom transform to translate without scaling control point size
    this.kit.context.transform(1, 0, 0, 1, this.center.x, this.center.y);
    var flower = this;
    u.each(this.shapePoints, function(controlPoint) {
      var newPoint = new CPoint(flower.kit, controlPoint.x*flower.scale, controlPoint.y*flower.scale, flower, controlPoint.index);
      newPoint.draw();
    });
    this.kit.context.restore();
  }

  PetalFlower.prototype.drawTransformPoints = function() {
    this.kit.context.save();
    this.translateTranform();
    this.transformPoints[0].draw();
    this.transformPoints[1].draw();
    this.transformPoints[2].draw();
    this.kit.context.restore();
  }

  PetalFlower.prototype.getState = function() {
    var cps = [];
    u.each(this.shapePoints, function(point){
      cps.push( Vector.create(point.x, point.y) );
    });
    return { 'shapePoints': cps,
             'rotation': this.rotation };
  }

  PetalFlower.prototype.setState = function(state) {
    var kit = this.kit;
    this.rotation = state.rotation;
    kit.index = 0;
    u.each(this.shapePoints, function(cp) {
      cp.x = state.shapePoints[kit.index].x;
      cp.y = state.shapePoints[kit.index].y;
      kit.index++;      
    });
    this.allPetals = [];
    this.updateFirstPetal();
    this.createPetals();
    kit.redraw();
  }

  return PetalFlower;
});
