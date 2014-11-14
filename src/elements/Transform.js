define(function(require) {
  'use strict';

  var Transform = function(position, scale, rotation) {
    this.position = position;
    this.scale = scale;
    this.rotation = rotation;
  }

  Transform.prototype.getMatrix = function() {
  	var cos = Math.cos(this.rotation);
  	var sin = Math.sin(this.rotation);
  	return [this.scale*cos, sin, -sin, this.scale*cos, this.position.x, this.position.y];
  }
    
  return Transform;
});