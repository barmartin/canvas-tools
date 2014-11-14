define(function(require) {
  'use strict';
  var Vector = require('Vector');
  var constants = require('constants');

  var FillImage = function(src, page, label) {
    this.src = src;
    // Page and Label are used only to clearly show the source of images
    this.page = page;
    this.label = label;
    this.image = new Image();
    this.image.onload = function() {
      window.kit.fillImageExists = true;
      window.kit.redraw();
    }
    this.image.src = this.src;
  }

  FillImage.prototype.draw = function(transform, object) {
    var kit = object.kit;
    var sweepFrom = Vector.getPolarPoint(Vector.create(0, 0), kit.maxRadius, object.firstInnerAngle/object.radialAccent+transform.rotation);
    var sweepTo = Vector.getPolarPoint(Vector.create(0, 0), kit.maxRadius, transform.rotation);

    var temp_canvas = document.createElement('canvas');
    temp_canvas.width = kit.canvasWidth;
    temp_canvas.height = kit.canvasHeight;
    var tempContext = temp_canvas.getContext('2d');
    // Draw first half of first cone
    tempContext.setTransform(1, 0, 0, 1, object.center.x, object.center.y);
    tempContext.save();
    tempContext.beginPath();
    tempContext.moveTo(0, 0);
    tempContext.lineTo(sweepFrom.x, sweepFrom.y);
    tempContext.lineTo(sweepTo.x, sweepTo.y);
    tempContext.closePath();
    tempContext.clip();
    tempContext.drawImage(this.image, -kit.midWidth, -kit.midHeight, kit.canvasWidth, kit.canvasHeight);
    tempContext.stroke();
    tempContext.restore();

    // Draw the other half of the first cone by reflecting about rotation angled line
    tempContext.save();
    var reflectionMatrix = Vector.reflectMatrix(transform.rotation);
    tempContext.setTransform(reflectionMatrix[0], reflectionMatrix[1], reflectionMatrix[2], reflectionMatrix[3], 
                              object.center.x, object.center.y);
    tempContext.beginPath();
    tempContext.moveTo(0, 0);
    tempContext.lineTo(sweepFrom.x, sweepFrom.y);
    tempContext.lineTo(sweepTo.x, sweepTo.y);
    tempContext.closePath();
    tempContext.clip();
    tempContext.drawImage(this.image, -kit.midWidth, -kit.midHeight, kit.canvasWidth, kit.canvasHeight);
    tempContext.stroke();
    tempContext.restore();

    // Copy first petal onto main canvas over every section
    kit.context.save();
    kit.context.translate(-object.center.x, -object.center.y);
    for(var i=0; i<object.petalCount; i++) {
      var matrix = kit.getRotationMatrix(constants.TWOPI/object.petalCount);
      kit.context.transform(matrix[0], matrix[1], matrix[2], matrix[3], object.center.x, object.center.y);
      kit.context.translate(-object.center.x, -object.center.y);
      kit.context.drawImage(temp_canvas, 0, 0);
    }
    kit.context.restore();
  }

  return FillImage;
});