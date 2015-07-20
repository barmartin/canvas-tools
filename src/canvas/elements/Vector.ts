module cKit.elements {
  import constants = cKit.constants;

  export class Vector {
    x: number;
    y: number;
    constructor(x: number = 0, y:number = 0) {
      this.x = x;
      this.y = y;
    }

    multiply(vector: Vector, scaleFactor:number) {
      vector.x *= scaleFactor;
      vector.y *= scaleFactor;
    }

    add(vector2: Vector) {
      this.x += vector2.x;
      this.y += vector2.y;
    }

    /* For things like control point rotation */
    rotate(thisAngle: number, center: Vector = theZeroVector) {
      var cosTheta = Math.cos(thisAngle);
      var sinTheta = Math.sin(thisAngle);
      var newX = ( cosTheta * (this.x - center.x) - sinTheta * (this.y - center.y) ) + center.x;
      this.y = ( sinTheta * (this.x - center.x) + cosTheta * (this.y - center.y) ) + center.y;
      this.x = newX;
    }

    /* For things like control point rotation */
    rotateIntoNewVector(thisAngle: number, center: Vector = theZeroVector) : Vector {
      var cosTheta = Math.cos(thisAngle);
      var sinTheta = Math.sin(thisAngle);
      var newX = ( cosTheta * (this.x - center.x) - sinTheta * (this.y - center.y) ) + center.x;
      var newY = ( sinTheta * (this.x - center.x) + cosTheta * (this.y - center.y) ) + center.y;
      return new Vector(newX, newY);
    }

    distance(pointB: Vector = theZeroVector) : number {
      var xDist = this.x - pointB.x;
      var yDist = this.y - pointB.y;
      return Math.sqrt(xDist * xDist + yDist * yDist);
    }

    getRadians(center) {
      var xDelta = this.x - center.x;
      var yDelta = center.y - this.y;
      var rads = Math.atan2(xDelta, yDelta);
      if (rads < 0) {
        rads += constants.TWOPI;
      }
      return rads;
    }

    getDegrees(center) {
      var xDelta = this.x - center.x;
      var yDelta = center.y - this.y;
      var degrees = Math.atan2(xDelta, yDelta) / constants.TWOPIDIV360;
      if (degrees < 0) {
        degrees += 360;
      }
      return degrees;
    }

    clone() {
      return new Vector(this.x, this.y);
    }

    /* Shouldn't ever be modified by recipient! */
    static zeroVector() {
      return theZeroVector;
    }

    static newZeroVector() {
      return new Vector(0, 0);
    }

    static reflectMatrix(theta) {
      return [Math.cos(2 * theta), Math.sin(2 * theta), Math.sin(2 * theta), -Math.cos(2 * theta)];
    }

    static getPolarPoint(radius: number, angle: number, center:Vector=theZeroVector) {
      return new Vector(center.x + radius * Math.sin(angle), center.y - radius * Math.cos(angle));
    }
  }
  var theZeroVector: Vector = new Vector(0, 0);
}