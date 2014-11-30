define(function(require) {
  'use strict';
  var constants = require('constants');
  /* Vector Helper */
  return {
    create : function( x, y ){
      return {
        'x' : x,
        'y' : y
      };
    },
    multiply : function(vector, scaleFactor){ 
      vector.x *= scaleFactor; 
      vector.y *= scaleFactor;
      return vector;
    },
    add : function(vector1, vector2) {
      vector1.x += vector2.x; 
      vector1.y += vector2.y;
      return vector1;
    },
    getPoint : function(centerX, centerY, radius, angle) {
      var thisX = centerX + radius * Math.sin( angle );
      var thisY = centerY - radius * Math.cos( angle );
      var nP =  this.create( thisX, thisY );
      return nP;
    },
    getPolarPoint : function(center, radius, angle) {
      var thisX = center.x + radius * Math.sin( angle );
      var thisY = center.y - radius * Math.cos( angle );
      var nP =  this.create( thisX, thisY );
      return nP;
    },
    rotate : function(centerX, centerY, point, thisAngle) {
      var cosTheta = Math.cos( thisAngle );
      var sinTheta = Math.sin( thisAngle );
      var xNew = ( cosTheta * (point.x-centerX) - sinTheta * (point.y-centerY) ) + centerX;
      var yNew = ( sinTheta * (point.x-centerX) + cosTheta * (point.y-centerY) ) + centerY;
      return this.create( xNew, yNew );
    },
    distance : function(pointA, pointB) {
      var xDist =  pointA.x - pointB.x;
      var yDist =  pointA.y - pointB.y;
      return Math.sqrt( xDist*xDist + yDist*yDist );      
    },
    getRadians : function(center, point) {
      var xDelta = point.x-center.x;
      var yDelta = center.y-point.y;
      var rads = Math.atan2(xDelta, yDelta);
      if(rads<0){
        rads+=constants.TWOPI;
      }
      return rads;
    },
    getDegrees : function(center, point) {
      var xDelta = point.x-center.x;
      var yDelta = center.y-point.y;
      var degrees = Math.atan2(xDelta, yDelta)/constants.TWOPIDIV360;
      if(degrees<0){
        degrees+=360;
      }
      return degrees;
    },
    zeroVector : function() {
      return {
        'x': 0,
        'y': 0
      }
    },
    reflectMatrix : function(theta) {
      return [Math.cos(2*theta), Math.sin(2*theta), Math.sin(2*theta), -Math.cos(2*theta)];
    }
  }
});