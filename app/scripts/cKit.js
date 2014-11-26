/*! cKit.js v0.4.5 November 25, 2014 */
var constants = function (require) {
    var PI = Math.PI;
    return {
      SCENE_NORMAL: 0,
      SCENE_GIF: 1,
      EDIT_SHAPE: 0,
      EDIT_TRANSFORM: 1,
      EDIT_NONE: 2,
      PI: PI,
      TWOPIDIV360: 2 * Math.PI / 360,
      TWOPI: 2 * Math.PI,
      MAX_OBJECTS: 4,
      DEFAULT_RAYS: 6,
      DEFAULT_INNER_RADIUS_SCALAR: 17,
      DEFAULT_OUTER_RADIUS_SCALAR: 2.2,
      CONTROL_POINT_RADIUS: 6,
      DEFAULT_LENGTH: 1.5,
      MAX_CP_SIGS: 4,
      BACKGROUND_COLOR: '010201',
      BACKGROUND_ALPHA: '1',
      LINE_COLOR: '9fb4f4',
      BODY_BACKGROUND_COLOR: '020202',
      MAX_CLICK_DISTANCE: 2,
      SOURCE_MODES: {
        'lighter': 'lighter',
        'darker': 'darker',
        'xor': 'xor',
        'source-atop': 'atop',
        'source-out': 'out',
        'source-over': 'over',
        'destination-atop': 'bottom',
        'destination-out': 'bottom-out'
      }
    };
  }({});
var util = function (require, constants) {
    'use strict';
    var constants = constants;
    return {
      getPosition: function (e, canvas) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      },
      clone: function (obj) {
        if (obj == null || 'object' !== typeof obj) {
          return obj;
        }
        var copy = obj.constructor();
        for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) {
            copy[attr] = obj[attr];
          }
        }
        return copy;
      },
      dnexist: function (item) {
        return typeof item === 'undefined';
      },
      exists: function (item) {
        return typeof item !== 'undefined';
      },
      encodeToHex: function (floatString) {
        return parseInt(255 * floatString).toString(16);
      },
      decodeFromHex: function (str) {
        return parseInt(str, 16);
      },
      parseIntOrDefault: function (i, def) {
        i = parseInt(i);
        if (Number.isInteger(i)) {
          return i;
        } else {
          return def;
        }
      },
      parseFloatOrDefault: function (f, def) {
        f = parseFloat(f);
        if (isNaN(f)) {
          return def;
        } else {
          return f;
        }
      },
      reduceSig: function (num, sig) {
        var mult = Math.pow(10, sig);
        return Math.round(num * mult + 0.00001) / mult;
      },
      degreesToRadians: function (angle) {
        return constants.TWOPIDIV360 * angle;
      },
      toRGB: function (str) {
        return [
          this.decodeFromHex(str.substring(0, 2)),
          this.decodeFromHex(str.substring(2, 4)),
          this.decodeFromHex(str.substring(4, 6))
        ];
      },
      msTime: function () {
        return new Date().getTime();
      },
      each: function (obj, func) {
        if (obj == null) {
          return obj;
        }
        var i, length = obj.length;
        if (length === +length) {
          for (i = 0; i < length; i++) {
            func(obj[i], i, obj);
          }
        } else {
          var keys = window.kit._u.getKeys(obj);
          for (i = 0, length = keys.length; i < length; i++) {
            func(obj[keys[i]], keys[i], obj);
          }
        }
        return obj;
      },
      getKeys: function (obj) {
        return Object.keys(obj);
      },
      range: function (st, end) {
        var r = [];
        for (var i = st; i < end; i++) {
          r.push(i);
        }
        return r;
      },
      indexOf: function (obj, item) {
        for (var i = 0; i < obj.length; i++) {
          if (obj[i] === item) {
            return i;
          }
        }
        console.log('There is a bug with a call to indexOf');
        return -1;
      },
      removeArrayEntry: function (arr, index) {
        arr.splice(index, 1);
      },
      debugConsole: function (text) {
        var HUD = document.getElementById('console');
      }
    };
  }({}, constants);
var Vector = function (require, constants) {
    'use strict';
    var constants = constants;
    return {
      create: function (x, y) {
        return {
          'x': x,
          'y': y
        };
      },
      multiply: function (vector, scaleFactor) {
        vector.x *= scaleFactor;
        vector.y *= scaleFactor;
        return vector;
      },
      add: function (vector1, vector2) {
        vector1.x += vector2.x;
        vector1.y += vector2.y;
        return vector1;
      },
      getPoint: function (centerX, centerY, radius, angle) {
        var thisX = centerX + radius * Math.sin(angle);
        var thisY = centerY - radius * Math.cos(angle);
        var nP = this.create(thisX, thisY);
        return nP;
      },
      getPolarPoint: function (center, radius, angle) {
        var thisX = center.x + radius * Math.sin(angle);
        var thisY = center.y - radius * Math.cos(angle);
        var nP = this.create(thisX, thisY);
        return nP;
      },
      rotate: function (centerX, centerY, point, thisAngle) {
        var cosTheta = Math.cos(thisAngle);
        var sinTheta = Math.sin(thisAngle);
        var xNew = cosTheta * (point.x - centerX) - sinTheta * (point.y - centerY) + centerX;
        var yNew = sinTheta * (point.x - centerX) + cosTheta * (point.y - centerY) + centerY;
        return this.create(xNew, yNew);
      },
      distance: function (pointA, pointB) {
        var xDist = pointA.x - pointB.x;
        var yDist = pointA.y - pointB.y;
        return Math.sqrt(xDist * xDist + yDist * yDist);
      },
      getRadians: function (center, point) {
        var xDelta = point.x - center.x;
        var yDelta = center.y - point.y;
        var rads = Math.atan2(xDelta, yDelta);
        if (rads < 0) {
          rads += constants.TWOPI;
        }
        return rads;
      },
      getDegrees: function (center, point) {
        var xDelta = point.x - center.x;
        var yDelta = center.y - point.y;
        var degrees = Math.atan2(xDelta, yDelta) * constants.TWOPIDIV360;
        if (degrees < 0) {
          degrees += 360;
        }
        return degrees;
      },
      zeroVector: function () {
        return {
          'x': 0,
          'y': 0
        };
      },
      reflectMatrix: function (theta) {
        return [
          Math.cos(2 * theta),
          Math.sin(2 * theta),
          Math.sin(2 * theta),
          -Math.cos(2 * theta)
        ];
      }
    };
  }({}, constants);
var CPoint = function (require, constants, Vector) {
    'use strict';
    var constants = constants;
    var Vector = Vector;
    var CPoint = function (kit, x, y, parentObject, index) {
      this.kit = kit;
      this.x = x;
      this.y = y;
      this.parentObject = parentObject;
      this.index = index;
      this.inDrag = false;
      this.draw = function () {
        var realPoint;
        if (this.kit.editMode !== constants.EDIT_TRANSFORM || this.index !== 2) {
          realPoint = Vector.rotate(0, 0, this, parentObject.rotation);
        } else {
          realPoint = this;
        }
        if (this.inDrag) {
          var anchorPoint;
          var points = parentObject.shapePoints;
          if (this.kit.editMode === constants.EDIT_TRANSFORM) {
            points = parentObject.transformPoints;
          }
          if (this.index === 1) {
            anchorPoint = Vector.rotate(0, 0, points[0], parentObject.rotation);
            this.kit.context.beginPath();
            this.kit.context.moveTo(realPoint.x, realPoint.y);
            this.kit.context.lineTo(anchorPoint.x, anchorPoint.y);
            this.kit.context.stroke();
          } else if (this.index === 2) {
            if (this.kit.editMode === constants.EDIT_TRANSFORM) {
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
      };
      this.mouseInside = function (point) {
        return this.kit.controlPointRadius + constants.MAX_CLICK_DISTANCE > Vector.distance(point, this) * this.parentObject.scale;
      };
    };
    return CPoint;
  }({}, constants, Vector);
var Transform = function (require) {
    'use strict';
    var Transform = function (position, scale, rotation) {
      this.position = position;
      this.scale = scale;
      this.rotation = rotation;
    };
    Transform.prototype.getMatrix = function () {
      var cos = Math.cos(this.rotation);
      var sin = Math.sin(this.rotation);
      return [
        this.scale * cos,
        sin,
        -sin,
        this.scale * cos,
        this.position.x,
        this.position.y
      ];
    };
    return Transform;
  }({});
var PetalFlower = function (require, CPoint, Vector, Transform, util) {
    'use strict';
    var CPoint = CPoint;
    var Vector = Vector;
    var Transform = Transform;
    var _u = util;
    var PetalFlower = function (kit, petals, radialAccent, innerRadius, outerRadius, center) {
      this.kit = kit;
      this.petalCount = petals;
      this.radialAccent = radialAccent;
      this.allPetals = [];
      this.firstPetal = [];
      this.thisAngle = 0;
      this.increment = 2 * Math.PI / petals;
      this.firstInnerAngle = -0.5 * this.increment * radialAccent;
      this.shapePoints = [];
      this.transformPoints = [];
      this.rotation = 0;
      this.center = center;
      this.scaleDistance = this.kit.midWidth / 2;
      this.scale = 1;
      this.lastScale = 1;
      var cp, cp2, cp3, cp4;
      cp = Vector.getPoint(0, 0, innerRadius, this.firstInnerAngle);
      var secondCPRadius = (outerRadius - innerRadius) / 2 + innerRadius;
      cp2 = Vector.getPoint(0, 0, secondCPRadius, this.firstInnerAngle);
      cp3 = Vector.getPoint(0, 0, outerRadius, 0);
      cp3.x = cp3.x - 40;
      cp4 = Vector.getPoint(0, 0, outerRadius, 0);
      this.firstPetal.push(cp);
      this.shapePoints.push(new CPoint(kit, cp.x, cp.y, this, 0));
      this.shapePoints.push(new CPoint(kit, cp2.x, cp2.y, this, 1));
      this.firstPetal.push(cp2);
      this.shapePoints.push(new CPoint(kit, cp3.x, cp3.y, this, 2));
      this.firstPetal.push(cp3);
      this.shapePoints.push(new CPoint(kit, cp4.x, cp4.y, this, 3));
      this.firstPetal.push(cp4);
      this.firstPetal.push(Vector.create(-cp3.x, cp3.y));
      this.firstPetal.push(Vector.create(-cp2.x, cp2.y));
      this.firstPetal.push(Vector.create(-cp.x, cp.y));
      this.transformPoints.push(new CPoint(this.kit, 0, 0, this, 0));
      var rotatePoint = Vector.create(0, -this.kit.midHeight / 2.5);
      Vector.rotate(0, 0, rotatePoint, this.rotation);
      this.transformPoints.push(new CPoint(this.kit, rotatePoint.x, rotatePoint.y, this, 1));
      this.transformPoints.push(new CPoint(this.kit, this.scaleDistance, 0, this, 2));
      this.createPetals();
    };
    PetalFlower.prototype.draw = function () {
      var index = 0;
      var flower = this;
      var kit = this.kit;
      kit.context.beginPath();
      _u.each(this.allPetals, function (Petal) {
        if (flower.rotation === 0) {
          kit.context.moveTo(Petal[0].x, Petal[0].y);
          kit.context.bezierCurveTo(Petal[1].x, Petal[1].y, Petal[2].x, Petal[2].y, Petal[3].x, Petal[3].y);
          kit.context.bezierCurveTo(Petal[4].x, Petal[4].y, Petal[5].x, Petal[5].y, Petal[6].x, Petal[6].y);
          kit.context.moveTo(Petal[6].x, Petal[6].y);
          kit.context.lineTo(Petal[0].x, Petal[0].y);
        } else {
          var rotated = [];
          for (var i = 0; i < Petal.length; i++) {
            rotated.push(Vector.rotate(0, 0, Petal[i], flower.rotation));
          }
          kit.context.moveTo(rotated[0].x, rotated[0].y);
          kit.context.bezierCurveTo(rotated[1].x, rotated[1].y, rotated[2].x, rotated[2].y, rotated[3].x, rotated[3].y);
          kit.context.bezierCurveTo(rotated[4].x, rotated[4].y, rotated[5].x, rotated[5].y, rotated[6].x, rotated[6].y);
          kit.context.moveTo(rotated[6].x, rotated[6].y);
          kit.context.lineTo(rotated[0].x, rotated[0].y);
        }
        index++;
      });
      kit.context.closePath();
      if (kit.fillImageExists) {
        kit.context.globalCompositeOperation = kit.sourceMode;
        kit.context.clip();
        kit.fillImage.draw(new Transform(this.center, this.scale, this.rotation), this);
        if (kit.highlightCurve === true) {
          kit.context.globalCompositeOperation = 'source-over';
          kit.context.lineWidth = 1.9;
          kit.context.stroke();
        }
      } else {
        kit.context.globalCompositeOperation = 'source-over';
        kit.context.stroke();
      }
    };
    PetalFlower.prototype.createPetals = function () {
      this.allPetals.push(this.firstPetal);
      for (var i = 1; i < this.petalCount; i++) {
        var newPetal = [];
        var thisAngle = i * this.increment;
        _u.each(this.firstPetal, function (point) {
          var thisPoint = Vector.rotate(0, 0, point, thisAngle);
          newPetal.push(thisPoint);
        });
        this.allPetals.push(newPetal);
      }
    };
    PetalFlower.prototype.updatePetal = function (index, newPoint) {
      var newCoords = Vector.create(newPoint.x, newPoint.y);
      if (index === 3) {
        newCoords.x = 0;
        this.firstPetal[3].x = 0;
        this.firstPetal[index].y = newPoint.y;
      } else if (index === 0) {
        var innerRadius = Vector.distance(Vector.create(0, 0), Vector.create(newPoint.x, newPoint.y));
        newCoords = Vector.getPoint(0, 0, innerRadius, this.firstInnerAngle);
        newCoords.x = _u.reduceSig(newCoords.x, constants.MAX_CP_SIGS);
        newCoords.y = _u.reduceSig(newCoords.y, constants.MAX_CP_SIGS);
        this.firstPetal[0].x = newCoords.x;
        this.firstPetal[0].y = newCoords.y;
        this.firstPetal[6].x = -newCoords.x;
        this.firstPetal[6].y = newCoords.y;
      } else {
        this.firstPetal[index].x = newPoint.x;
        this.firstPetal[6 - index].x = -newPoint.x;
        this.firstPetal[6 - index].y = newPoint.y;
        this.firstPetal[index].y = newPoint.y;
      }
      this.allPetals = [];
      this.createPetals();
      this.shapePoints[index].x = newCoords.x;
      this.shapePoints[index].y = newCoords.y;
    };
    PetalFlower.prototype.updateTransform = function (index, newPoint) {
      var newCoords = Vector.create(newPoint.x, newPoint.y);
      this.transformPoints[index].x = newCoords.x;
      this.transformPoints[index].y = newCoords.y;
    };
    PetalFlower.prototype.transform = function () {
      this.kit.context.transform(this.scale, 0, 0, this.scale, this.center.x, this.center.y);
    };
    PetalFlower.prototype.translateTranform = function () {
      this.kit.context.transform(1, 0, 0, 1, this.center.x, this.center.y);
    };
    PetalFlower.prototype.reverseTransformPoint = function (point) {
      var actual = Vector.create(point.x - this.center.x, point.y - this.center.y);
      actual.x /= this.scale;
      actual.y /= this.scale;
      actual = Vector.rotate(0, 0, actual, -this.rotation);
      return actual;
    };
    PetalFlower.prototype.setScale = function (xPosition) {
      this.scale = this.lastScale * xPosition / this.scaleDistance;
    };
    PetalFlower.prototype.resetScalePoint = function (xPosition) {
      this.transformPoints[2].x = this.scaleDistance;
    };
    PetalFlower.prototype.updateFirstPetal = function () {
      this.firstPetal[0].x = this.shapePoints[0].x;
      this.firstPetal[0].y = this.shapePoints[0].y;
      this.firstPetal[1].x = this.shapePoints[1].x;
      this.firstPetal[1].y = this.shapePoints[1].y;
      this.firstPetal[2].x = this.shapePoints[2].x;
      this.firstPetal[2].y = this.shapePoints[2].y;
      this.firstPetal[3].x = this.shapePoints[3].x;
      this.firstPetal[3].y = this.shapePoints[3].y;
      this.firstPetal[4].x = -this.shapePoints[2].x;
      this.firstPetal[4].y = this.shapePoints[2].y;
      this.firstPetal[5].x = -this.shapePoints[1].x;
      this.firstPetal[5].y = this.shapePoints[1].y;
      this.firstPetal[6].x = -this.shapePoints[0].x;
      this.firstPetal[6].y = this.shapePoints[0].y;
    };
    PetalFlower.prototype.setControlPoint = function (point, newPoint) {
      this.shapePoints[this.kit.indexOf(this.shapePoints, point)] = newPoint;
    };
    PetalFlower.prototype.updateRadialPoint = function () {
      this.increment = 2 * Math.PI / this.petalCount;
      this.firstInnerAngle = -0.5 * this.increment * this.radialAccent;
      var kit = this.kit;
      var flower = this;
      _u.each(kit.keyFrames, function (keyFrame) {
        var point = keyFrame.obj[kit.selectedObject].shapePoints[0];
        var radius = Vector.distance(Vector.zeroVector(), Vector.create(point.x, point.y));
        var newPosition = Vector.getPolarPoint(Vector.zeroVector(), radius, flower.firstInnerAngle);
        point.x = newPosition.x;
        point.y = newPosition.y;
      });
    };
    PetalFlower.prototype.accentRadialPoint = function (scale) {
      this.radialAccent = scale;
      this.increment = 2 * Math.PI / this.petalCount;
      this.firstInnerAngle = -0.5 * this.increment * scale;
      var kit = this.kit;
      var flower = this;
      _u.each(kit.keyFrames, function (keyFrame) {
        var point = keyFrame.obj[kit.selectedObject].shapePoints[0];
        var radius = Vector.distance(Vector.zeroVector(), Vector.create(point.x, point.y));
        var newPosition = Vector.getPolarPoint(Vector.zeroVector(), radius, flower.firstInnerAngle);
        point.x = newPosition.x;
        point.y = newPosition.y;
      });
    };
    PetalFlower.prototype.drawShapePoints = function () {
      this.kit.context.save();
      this.kit.context.transform(1, 0, 0, 1, this.center.x, this.center.y);
      var flower = this;
      _u.each(this.shapePoints, function (controlPoint) {
        var newPoint = new CPoint(flower.kit, controlPoint.x * flower.scale, controlPoint.y * flower.scale, flower, controlPoint.index);
        newPoint.draw();
      });
      this.kit.context.restore();
    };
    PetalFlower.prototype.drawTransformPoints = function () {
      this.kit.context.save();
      this.translateTranform();
      this.transformPoints[0].draw();
      this.transformPoints[1].draw();
      this.transformPoints[2].draw();
      this.kit.context.restore();
    };
    PetalFlower.prototype.getState = function () {
      var cps = [];
      _u.each(this.shapePoints, function (point) {
        cps.push(Vector.create(point.x, point.y));
      });
      return {
        'shapePoints': cps,
        'rotation': this.rotation,
        'scale': this.scale,
        'position': this.center
      };
    };
    PetalFlower.prototype.setState = function (state) {
      var kit = this.kit;
      this.rotation = state.rotation;
      this.center = state.position;
      this.scale = state.scale;
      kit.index = 0;
      _u.each(this.shapePoints, function (cp) {
        cp.x = state.shapePoints[kit.index].x;
        cp.y = state.shapePoints[kit.index].y;
        kit.index++;
      });
      this.allPetals = [];
      this.updateFirstPetal();
      this.createPetals();
      kit.redraw();
    };
    return PetalFlower;
  }({}, CPoint, Vector, Transform, util);
var core = function (require, constants, util, PetalFlower, Vector) {
    'use strict';
    var constants = constants;
    var _u = util;
    var PetalFlower = PetalFlower;
    var Vector = Vector;
    var kit = function () {
      this.constants = constants;
      this._u = _u;
      this.initialized = false;
      this.keyFrames = [];
      this.updateMode = false;
      this.animationMode = false;
      this.segmentStartTime = 0;
      this.segment = 0;
      this.loopStartTime = 0;
      this.setTime = 0;
      this.pauseTime = 0;
      this.frameDelay = 30;
      this.gifFramerate = 100;
      this.delta = -this.frameDelay;
      this.sceneMode = constants.SCENE_NORMAL;
      this.encoder = '';
      this.delayTime = 0;
      this.initList = ['flower'];
      this.pattern = null;
      this.bodybg = constants.BODY_BACKGROUND_COLOR;
      this.backgroundColor = constants.BACKGROUND_COLOR;
      this.lineColor = constants.LINE_COLOR;
      this.backgroundAlpha = constants.BACKGROUND_ALPHA;
      var key = this._u.getKeys(constants.SOURCE_MODES)[0];
      this.sourceMode = constants.SOURCE_MODES[key];
      this.canvasWidth = 500;
      this.canvasHeight = 500;
      this.midWidth = this.canvasWidth / 2;
      this.midHeight = this.canvasHeight / 2;
      this.maxRadius = Math.sqrt(this.midWidth * this.midWidth + this.midHeight * this.midHeight);
      this.controlPointRadius = constants.CONTROL_POINT_RADIUS;
      this.editMode = constants.EDIT_SHAPE;
      this.highlightCurve = false;
      this.seamlessAnimation = true;
      this.fieldFocus = false;
      this.settingShelf = {
        'toggleCurveColor': this.toggleCurveColor,
        'editMode': this.editMode
      };
      this.objList = [];
      this.objTypes = [];
      this.selectedObject = 0;
      this.resourceList = {};
      this.backgroundImageExists = false;
      this.fillImageExists = false;
      this.debugMode = true;
      this.initializeCanvas = function () {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.bindEvents();
        this.build();
        if (this.debugMode === true) {
          var dataz = window.getSampleJSON();
          this.loadData(dataz, false);
        }
        this.initialized = true;
        this.redraw();
      };
    };
    kit.prototype.digest = function () {
    };
    kit.prototype.build = function () {
      var kit = this;
      _u.each(_u.range(0, this.initList.length), function (i) {
        if (kit.initList[i] === 'flower') {
          kit.objList.push(new PetalFlower(kit, constants.DEFAULT_RAYS, 1, kit.canvasHeight / constants.DEFAULT_INNER_RADIUS_SCALAR, kit.canvasHeight / constants.DEFAULT_OUTER_RADIUS_SCALAR, Vector.create(kit.midWidth, kit.midHeight)));
          kit.objTypes.push([
            'flower',
            constants.DEFAULT_RAYS,
            1
          ]);
        }
      });
      this.initFrame();
    };
    kit.prototype.redraw = function () {
      if (!this.initialized) {
        return;
      }
      this.context.save();
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.restore();
      this.context.strokeStyle = '#' + this.lineColor;
      if (this.backgroundImageExists) {
        this.context.drawImage(this.backgroundImage, 0, 0, this.canvasWidth, this.canvasHeight);
      } else {
        var rgb = _u.toRGB(this.backgroundColor);
        this.context.fillStyle = 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', ' + this.backgroundAlpha + ')';
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      }
      var kit = this;
      _u.each(this.objList, function (item) {
        kit.context.save();
        item.transform();
        item.draw();
        kit.context.restore();
      });
      if (this.editMode === constants.EDIT_SHAPE) {
        this.objList[kit.selectedObject].drawShapePoints();
      }
      if (this.editMode === constants.EDIT_TRANSFORM) {
        this.objList[kit.selectedObject].drawTransformPoints();
      }
    };
    return kit;
  }({}, constants, util, PetalFlower, Vector);
var FillImage = function (require, Vector, constants) {
    'use strict';
    var Vector = Vector;
    var constants = constants;
    var FillImage = function (src, page, label) {
      this.src = src;
      this.page = page;
      this.label = label;
      this.image = new Image();
      this.image.onload = function () {
        window.kit.fillImageExists = true;
        window.kit.redraw();
      };
      this.image.src = this.src;
    };
    FillImage.prototype.draw = function (transform, object) {
      var kit = object.kit;
      var sweepFrom = Vector.getPolarPoint(Vector.create(0, 0), kit.maxRadius, object.firstInnerAngle / object.radialAccent + transform.rotation);
      var sweepTo = Vector.getPolarPoint(Vector.create(0, 0), kit.maxRadius, transform.rotation);
      var temp_canvas = document.createElement('canvas');
      temp_canvas.width = kit.canvasWidth;
      temp_canvas.height = kit.canvasHeight;
      var tempContext = temp_canvas.getContext('2d');
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
      tempContext.save();
      var reflectionMatrix = Vector.reflectMatrix(transform.rotation);
      tempContext.setTransform(reflectionMatrix[0], reflectionMatrix[1], reflectionMatrix[2], reflectionMatrix[3], object.center.x, object.center.y);
      tempContext.beginPath();
      tempContext.moveTo(0, 0);
      tempContext.lineTo(sweepFrom.x, sweepFrom.y);
      tempContext.lineTo(sweepTo.x, sweepTo.y);
      tempContext.closePath();
      tempContext.clip();
      tempContext.drawImage(this.image, -kit.midWidth, -kit.midHeight, kit.canvasWidth, kit.canvasHeight);
      tempContext.stroke();
      tempContext.restore();
      kit.context.save();
      kit.context.translate(-object.center.x, -object.center.y);
      for (var i = 0; i < object.petalCount; i++) {
        var matrix = kit.getRotationMatrix(constants.TWOPI / object.petalCount);
        kit.context.transform(matrix[0], matrix[1], matrix[2], matrix[3], object.center.x, object.center.y);
        kit.context.translate(-object.center.x, -object.center.y);
        kit.context.drawImage(temp_canvas, 0, 0);
      }
      kit.context.restore();
    };
    return FillImage;
  }({}, Vector, constants);
var canvasEvents = function (require, core, Vector, constants, util, CPoint) {
    'use strict';
    var kit = core;
    var Vector = Vector;
    var constants = constants;
    var _u = util;
    var CPoint = CPoint;
    kit.prototype.bindEvents = function () {
      this.canvas.addEventListener('touchstart', this.startDrag, false);
      this.canvas.addEventListener('touchend', this.endDrag, false);
      this.canvas.addEventListener('touchmove', this.move, false);
      this.canvas.addEventListener('mousedown', this.startDrag, false);
      this.canvas.addEventListener('mouseup', this.endDrag, false);
      this.canvas.addEventListener('mousemove', this.move, false);
    };
    kit.prototype.startDrag = function (event) {
      var kit = window.kit;
      if (kit.animationMode === true) {
        return;
      }
      var position = _u.getPosition(event, kit.canvas);
      var object = kit.objList[kit.selectedObject];
      if (kit.editMode === constants.EDIT_SHAPE) {
        _u.each(object.shapePoints, function (thisPoint) {
          var actualPosition = object.reverseTransformPoint(position);
          if (thisPoint.mouseInside(actualPosition)) {
            thisPoint.inDrag = true;
            kit.canvasMode = 'cpDrag';
            kit.redraw();
            return;
          }
        });
      } else if (kit.editMode === constants.EDIT_TRANSFORM) {
        _u.each(object.transformPoints, function (thisPoint) {
          var positionInsideObject;
          if (thisPoint.index !== 2) {
            positionInsideObject = Vector.create(position.x - object.center.x, position.y - object.center.y);
            positionInsideObject = Vector.rotate(0, 0, positionInsideObject, -object.rotation);
          } else {
            object.lastScale = object.scale;
            positionInsideObject = Vector.create(position.x - object.center.x, position.y - object.center.y);
          }
          if (thisPoint.mouseInside(positionInsideObject)) {
            thisPoint.inDrag = true;
            kit.canvasMode = 'cpDrag';
            kit.redraw();
            return;
          }
        });
      }
    };
    kit.prototype.endDrag = function (event) {
      var kit = window.kit;
      if (kit.animationMode === true) {
        return;
      }
      kit.canvasMode = 'static';
      kit.position = _u.getPosition(event, kit.canvas);
      var object = kit.objList[kit.selectedObject];
      if (kit.editMode === constants.EDIT_SHAPE) {
        _u.each(object.shapePoints, function (thisPoint) {
          if (thisPoint.inDrag === true) {
            thisPoint.inDrag = false;
            kit.redraw();
          }
        });
      } else if (kit.editMode === constants.EDIT_TRANSFORM) {
        _u.each(object.transformPoints, function (thisPoint) {
          if (thisPoint.inDrag === true) {
            thisPoint.inDrag = false;
            if (thisPoint.index === 2) {
              thisPoint.x = object.scaleDistance;
            }
            kit.redraw();
          }
        });
      }
      kit.getState();
      kit.digest();
    };
    kit.prototype.move = function (event) {
      var kit = window.kit;
      if (kit.canvasMode !== 'cpDrag' || kit.animationMode === true) {
        return;
      }
      var object = kit.objList[kit.selectedObject];
      var position = _u.getPosition(event, kit.canvas);
      var actualPosition = object.reverseTransformPoint(position);
      var index = 0;
      if (kit.editMode === kit.constants.EDIT_SHAPE) {
        _u.each(object.shapePoints, function (thisPoint) {
          if (thisPoint.inDrag) {
            var newPoint = new CPoint(kit, _u.reduceSig(actualPosition.x, constants.MAX_CP_SIGS), _u.reduceSig(actualPosition.y, constants.MAX_CP_SIGS), object, index);
            newPoint.inDrag = true;
            object.updatePetal(index, newPoint);
            kit.redraw();
            return;
          }
          index++;
        });
      } else if (kit.editMode === kit.constants.EDIT_TRANSFORM) {
        _u.each(object.transformPoints, function (thisPoint) {
          if (thisPoint.inDrag) {
            if (index === 0) {
              object.center = position;
            } else if (index === 1) {
              var angleVector = Vector.create(position.x - object.center.x, position.y - object.center.y);
              var angle = Vector.getRadians(Vector.create(0, 0), angleVector);
              kit.setRotation(angle);
              kit._u.debugConsole(angle);
            } else if (index === 2) {
              var newX = position.x - object.center.x;
              object.setScale(newX);
              thisPoint.x = newX;
            }
            kit.redraw();
            return;
          }
          index++;
        });
      }
    };
    kit.prototype.constrain = function (point) {
      if (point.x < 0) {
        point.x = 0;
      } else if (point.x > this.canvasWidth) {
        point.x = this.canvasWidth;
      }
      if (point.y < 0) {
        point.y = 0;
      } else if (point.y > this.canvasHeight) {
        point.y = this.canvasHeight;
      }
    };
    return kit;
  }({}, core, Vector, constants, util, CPoint);
var sceneEvents = function (require, core, constants, util, PetalFlower, CPoint, Vector) {
    'use strict';
    var kit = core;
    var constants = constants;
    var _u = util;
    var PetalFlower = PetalFlower;
    var CPoint = CPoint;
    var Vector = Vector;
    kit.prototype.sceneLoop = function () {
      if (!this.animationMode || this.keyFrames.length < 2) {
        this.stopScene();
        this.digest();
        return;
      }
      if (this.sceneMode === constants.SCENE_GIF) {
        this.delta += this.gifFramerate;
      } else {
        this.delta = _u.msTime() - this.segmentStartTime;
      }
      var lastStartTime = _u.msTime();
      if (this.segment === 0 && this.delta >= this.pauseTime) {
        this.segment = 1;
        this.delta = 0;
        this.segmentStartTime = _u.msTime();
      } else if (this.segment !== 0) {
        if (this.delta > this.keyFrames[this.segment - 1].timing * 1000) {
          if (this.segment === this.keyFrames.length - 1 && this.seamlessAnimation === false) {
            this.segment = 0;
            this.setState();
            this.segment = 1;
            this.delta = 0;
            this.segmentStartTime = _u.msTime();
          } else if (this.segment < this.keyFrames.length) {
            this.setState();
            this.segment++;
            if (this.sceneMode === this.GIF) {
              this.delta = 0;
            } else {
              this.segmentStartTime = _u.msTime();
            }
          } else {
            if (this.sceneMode === constants.SCENE_GIF) {
              this.gifComplete();
              return;
            }
            this.segment = 0;
            this.setState();
            this.segmentStartTime = _u.msTime();
          }
        } else {
          this.updateSegment(this.delta);
        }
      }
      this.digest();
      if (this.sceneMode === constants.SCENE_GIF) {
        this.encoder.addFrame(this.context);
        setTimeout(function () {
          window.kit.sceneLoop();
        }, 0.01);
      } else {
        var processTime = _u.msTime() - lastStartTime;
        setTimeout(function () {
          window.kit.sceneLoop();
        }, Math.max(0, window.kit.frameDelay - processTime));
      }
    };
    kit.prototype.updateSegment = function (delta) {
      var keyTo = this.segment;
      if (this.segment === this.keyFrames.length) {
        keyTo = 0;
      }
      var sig = delta / (this.keyFrames[keyTo].timing * 1000);
      var objIndex = 0;
      var kit = this;
      _u.each(this.keyFrames[keyTo].obj, function (ob) {
        var index = 0;
        var newCps = [];
        var obFrom = kit.keyFrames[kit.segment - 1].obj[objIndex];
        _u.each(ob.shapePoints, function (cp) {
          var newX = obFrom.shapePoints[index].x * (1 - sig) + cp.x * sig;
          var newY = obFrom.shapePoints[index].y * (1 - sig) + cp.y * sig;
          var newPoint = new CPoint(kit, newX, newY, kit.objList[objIndex], index);
          newCps.push(newPoint);
          index++;
        });
        var newState = { shapePoints: newCps };
        var fromRotation = obFrom.rotation;
        var toRotation = ob.rotation;
        var del = toRotation - fromRotation;
        if (Math.abs(del) > Math.PI) {
          if (del < 0) {
            toRotation += 2 * Math.PI;
          } else {
            fromRotation += 2 * Math.PI;
          }
        }
        newState.rotation = (fromRotation * (1 - sig) + toRotation * sig) % 360;
        newState.position = Vector.create(obFrom.position.x * (1 - sig) + ob.position.x * sig, obFrom.position.y * (1 - sig) + ob.position.y * sig);
        newState.scale = obFrom.scale * (1 - sig) + ob.scale * sig;
        kit.objList[objIndex].setState(newState);
        objIndex++;
      });
    };
    kit.prototype.segmentLoop = function () {
      if (!this.animationMode || this.segment === 0) {
        this.setState();
        this.digest();
        return;
      }
      var delta = _u.msTime() - this.loopStartTime - this.pauseTime;
      if (delta < 0) {
        if (this.setTime !== 0) {
          this.segment--;
          this.setState();
          this.segment++;
          this.setTime = 0;
        }
      } else if (delta > this.keyFrames[this.segment].timing * 1000) {
        if (delta > this.keyFrames[this.segment].timing * 1000 + this.pauseTime) {
          this.loopStartTime = _u.msTime();
          this.segment--;
          this.setState();
          this.segment++;
          this.setTime = 0;
        } else if (this.setTime !== this.keyFrames[this.segment].timing * 1000) {
          this.setState();
          this.setTime = this.keyFrames[this.segment].timing * 1000;
        }
      } else {
        var sig = delta / (this.keyFrames[this.segment].timing * 1000);
        var objIndex = 0;
        var kit = this;
        _u.each(this.keyFrames[this.segment].obj, function (ob) {
          var index = 0;
          var newCps = [];
          _u.each(ob.shapePoints, function (cp) {
            var newX = kit.keyFrames[kit.segment - 1].obj[objIndex].shapePoints[index].x * (1 - sig) + cp.x * sig;
            var newY = kit.keyFrames[kit.segment - 1].obj[objIndex].shapePoints[index].y * (1 - sig) + cp.y * sig;
            var newPoint = new CPoint(kit, newX, newY, kit.objList[objIndex], index);
            newCps.push(newPoint);
            index++;
          });
          var newState = { shapePoints: newCps };
          var obFrom = kit.keyFrames[kit.segment - 1].obj[objIndex];
          var fromRotation = obFrom.rotation;
          var toRotation = ob.rotation;
          var del = toRotation - fromRotation;
          if (Math.abs(del) > 180) {
            if (del < 0) {
              toRotation += 360;
            } else {
              fromRotation += 360;
            }
          }
          newState.rotation = (fromRotation * (1 - sig) + toRotation * sig) % 360;
          newState.position = Vector.create(obFrom.center.x * (1 - sig) + ob.center.x * sig, obFrom.center.y * (1 - sig) + ob.center.y * sig);
          newState.scale = obFrom.scale * (1 - sig) + ob.scale * sig;
          kit.objList[objIndex].setState(newState);
          objIndex++;
        });
      }
      setTimeout(function () {
        window.kit.segmentLoop();
      }, window.kit.frameDelay);
    };
    kit.prototype.initFrame = function () {
      this.keyFrames[this.segment] = {};
      this.keyFrames[this.segment].obj = [];
      if (this.segment > 0) {
        this.keyFrames[this.segment].timing = this.keyFrames[this.segment - 1].timing;
        for (var i = 0; i < this.objList; i++) {
          this.keyFrames[this.segment].obj[i].rotation = this.keyFrames[this.segment - 1].obj[i].rotation;
          this.keyFrames[this.segment].obj[i].center = this.keyFrames[this.segment - 1].obj[i].center;
          this.keyFrames[this.segment].obj[i].scale = this.keyFrames[this.segment - 1].obj[i].scale;
        }
      } else {
        this.keyFrames[this.segment].timing = constants.DEFAULT_LENGTH;
        for (var ind = 0; ind < this.objList; ind++) {
          this.keyFrames[this.segment].obj[ind].rotation = 0;
          this.keyFrames[this.segment].obj[ind].position = new Vector(this.objList[0].center.x, this.objList[0].center.y);
          this.keyFrames[this.segment].obj[ind].scale = 1;
        }
      }
      this.storeFrame();
    };
    kit.prototype.clearScene = function () {
      this.objList = [];
      this.objTypes = [];
      this.resourceList = {};
      this.backgroundImageExists = false;
      this.fillImageExists = false;
      this.keyFrames = [];
      this.segment = 0;
      this.objList.push(new PetalFlower(this, constants.DEFAULT_RAYS, 1, this.canvasHeight / constants.DEFAULT_INNER_RADIUS_SCALAR, this.canvasHeight / constants.DEFAULT_OUTER_RADIUS_SCALAR, Vector.create(this.midWidth, this.midHeight)));
      this.objTypes.push([
        'flower',
        constants.DEFAULT_RAYS,
        1
      ]);
      this.selectedObject = 0;
      this.initFrame();
      this.redraw();
      this.digest();
    };
    kit.prototype.storeFrame = function () {
      for (var i = 0; i < this.objList.length; i++) {
        this.keyFrames[this.segment].obj[i] = this.objList[i].getState();
      }
      var val = this.objList[this.selectedObject].rotation;
    };
    kit.prototype.removeKeyframe = function () {
      if (this.keyFrames.length < 2) {
        return;
      }
      _u.removeArrayEntry(this.keyFrames, this.segment);
      if (this.segment === this.keyFrames.length) {
        this.segment--;
      }
      this.setState();
      this.redraw();
      this.digest();
    };
    kit.prototype.removeLast = function () {
      if (this.keyFrames.length < 2) {
        return;
      }
      _u.removeArrayEntry(this.keyFrames, this.keyFrames.length - 1);
      if (this.segment === this.keyFrames.length) {
        this.segment--;
      }
      this.setState();
      this.redraw();
      this.digest();
    };
    kit.prototype.gifInit = function () {
      this.encoder.setRepeat(-1);
      this.encoder.setDelay(this.gifFramerate);
      this.encoder.setSize(this.canvasWidth, this.canvasHeight);
      this.encoder.start();
      this.sceneMode = constants.SCENE_GIF;
      this.loopInit();
      this.redraw();
    };
    kit.prototype.gifComplete = function () {
      this.encoder.finish();
      var binary_gif = this.encoder.stream().getData();
      var data_url = 'data:image/gif;base64,' + window.encode64(binary_gif);
      window.open(data_url, '_blank');
      this.sceneMode = constants.SCENE_NORMAL;
      this.stopScene();
    };
    kit.prototype.loopInit = function () {
      this.animationMode = true;
      this.segment = 0;
      this.loopStartTime = _u.msTime();
      this.segmentStartTime = this.loopStartTime;
      this.setTempModes(constants.EDIT_NONE, false);
    };
    kit.prototype.stopScene = function () {
      this.restoreModes();
      this.sceneReset();
    };
    kit.prototype.sceneReset = function () {
      this.animationMode = false;
      this.segment = 0;
      this.setState();
      this.redraw();
    };
    kit.prototype.playSegment = function () {
      if (kit.keyFrames.length < 2) {
        return;
      }
      kit.animationMode = true;
      if (kit.segment !== 0) {
        kit.segment--;
      }
      kit.setState();
      kit.segment++;
      kit.setTime = 0;
      kit.loopStartTime = new Date().getTime();
      kit.segmentLoop();
    };
    kit.prototype.setState = function () {
      for (var i = 0; i < this.objList.length; i++) {
        this.objList[i].setState(this.keyFrames[this.segment].obj[i]);
      }
    };
    kit.prototype.selectFirst = function () {
      this.segment = 0;
      this.setState();
    };
    kit.prototype.selectPrev = function () {
      if (this.segment > 0) {
        this.segment--;
        for (var i = 0; i < this.objList.length; i++) {
          this.objList[i].setState(this.keyFrames[this.segment].obj[i]);
        }
      }
    };
    kit.prototype.selectNext = function () {
      this.segment++;
      if (this.segment >= this.keyFrames.length) {
        this.initFrame();
      } else {
        this.setState();
      }
    };
    kit.prototype.selectLast = function () {
      this.segment = this.keyFrames.length - 1;
      this.setState();
    };
    kit.prototype.getSegment = function () {
      if (!this.initialized) {
        return 0;
      } else if (this.animationMode) {
        return (this.segment + this.keyFrames.length - 1) % this.keyFrames.length;
      } else {
        return this.segment;
      }
    };
    return kit;
  }({}, core, constants, util, PetalFlower, CPoint, Vector);
var objectEvents = function (require, core, constants, util, Vector, PetalFlower, FillImage) {
    'use strict';
    var kit = core;
    var constants = constants;
    var _u = util;
    var Vector = Vector;
    var PetalFlower = PetalFlower;
    var FillImage = FillImage;
    kit.prototype.setState = function () {
      for (var i = 0; i < this.objList.length; i++) {
        this.objList[i].setState(this.keyFrames[this.segment].obj[i]);
      }
    };
    kit.prototype.getState = function () {
      for (var i = 0; i < this.objList.length; i++) {
        this.keyFrames[this.segment].obj[i] = this.objList[i].getState();
      }
      this.keyFrames[this.segment].timing = parseFloat(document.getElementById('length').value);
    };
    kit.prototype.getRotation = function () {
      var rotationDegrees = this.keyFrames[this.segment].obj[this.selectedObject].rotation / this.constants.TWOPIDIV360;
      return Math.floor(rotationDegrees * 100) / 100;
    };
    kit.prototype.getRotationMatrix = function (angle) {
      var cos = Math.cos(angle);
      var sin = Math.sin(angle);
      return [
        cos,
        sin,
        -sin,
        cos,
        0,
        0
      ];
    };
    kit.prototype.addFillImage = function (src) {
      this.fillImage = new FillImage(src);
      this.resourceList.fillImageSource = src;
    };
    kit.prototype.addBackgroundImage = function (src) {
      this.backgroundImage = new Image();
      this.backgroundImage.onload = function () {
        window.kit.backgroundImageExists = true;
        window.kit.redraw();
      };
      this.backgroundImage.src = src;
      this.resourceList.backgroundImageSource = src;
    };
    kit.prototype.updatePetalCount = function (petals) {
      var object = this.objList[this.selectedObject];
      if (object instanceof PetalFlower) {
        this.objList[this.selectedObject] = new PetalFlower(this, petals, object.radialAccent, this.canvasHeight / constants.DEFAULT_INNER_RADIUS_SCALAR, this.canvasHeight / constants.DEFAULT_OUTER_RADIUS_SCALAR, Vector.create(this.midWidth, this.midHeight));
        this.objTypes[this.selectedObject][1] = petals;
        this.objList[this.selectedObject].updateRadialPoint();
        this.setState();
        this.redraw();
      }
    };
    kit.prototype.updateRadialAccent = function (radialScalar) {
      this.objTypes[this.selectedObject][2] = radialScalar;
      var thisObject = this.objList[this.selectedObject];
      if (radialScalar > 0 && radialScalar < thisObject.petalCount) {
        thisObject.accentRadialPoint(radialScalar);
        this.setState();
        this.redraw();
      }
    };
    kit.prototype.selectObject = function (obj) {
      obj = parseFloat(obj);
      if (this.selectedObject !== obj && obj < this.objList.length && obj < this.constants.MAX_OBJECTS && obj >= 0) {
        this.selectedObject = obj;
        this.redraw();
        this.digest();
      }
    };
    kit.prototype.addObject = function () {
      if (this.objList.length >= constants.MAX_OBJECTS) {
        return;
      }
      this.objList.push(new PetalFlower(this, constants.DEFAULT_RAYS, 1, this.canvasHeight / constants.DEFAULT_INNER_RADIUS_SCALAR, this.canvasHeight / constants.DEFAULT_OUTER_RADIUS_SCALAR, Vector.create(this.midWidth, this.midHeight)));
      this.objTypes.push([
        'flower',
        constants.DEFAULT_RAYS,
        1
      ]);
      for (var i = 0; i < this.keyFrames.length; i++) {
        this.keyFrames[i].obj[this.objList.length - 1] = this.objList[this.objList.length - 1].getState();
        this.keyFrames[i].obj[this.objList.length - 1].timing = document.getElementById('length').value;
      }
      var ind = this.objList.length - 1;
      this.selectedObject = ind;
      this.redraw();
      this.digest();
    };
    kit.prototype.removeObject = function () {
      if (this.objList.length < 2) {
        return;
      }
      _u.removeArrayEntry(this.objList, this.selectedObject);
      _u.removeArrayEntry(this.objTypes, this.selectedObject);
      var kit = this;
      _u.each(this.keyFrames, function (keyFrame) {
        _u.removeArrayEntry(keyFrame.obj, kit.selectedObject);
      });
      if (this.selectedObject === this.objList.length) {
        this.selectedObject--;
      }
      this.redraw();
      this.digest();
    };
    kit.prototype.getImage = function () {
      this.setTempModes(constants.EDIT_NONE, false);
      this.redraw();
      window.open(this.canvas.toDataURL('image/png'));
      this.restoreModes();
      this.redraw();
    };
    kit.prototype.setAlpha = function (newAlpha) {
      newAlpha = _u.parseFloatOrDefault(newAlpha, 1);
      if (newAlpha > 1) {
        this.backgroundAlpha = 1;
      } else if (newAlpha < 0) {
        this.backgroundAlpha = 0;
      } else {
        this.backgroundAlpha = newAlpha;
      }
      this.redraw();
    };
    kit.prototype.setRotation = function (newRotation) {
      newRotation = _u.reduceSig(_u.parseFloatOrDefault(newRotation, 0) * constants.PI / 180 % (2 * constants.PI), 5);
      this.objList[this.selectedObject].rotation = newRotation;
      this.keyFrames[this.getSegment()].obj[this.selectedObject].rotation = newRotation;
      this.redraw();
    };
    return kit;
  }({}, core, constants, util, Vector, PetalFlower, FillImage);
var settingsEvents = function (require, core, constants, util, PetalFlower, Vector) {
    'use strict';
    var kit = core;
    var constants = constants;
    var _u = util;
    var PetalFlower = PetalFlower;
    var Vector = Vector;
    kit.prototype.getSettings = function (data, preinit) {
      return {
        'backgroundColor': this.backgroundColor,
        'backgroundAlpha': this.backgroundAlpha,
        'lineColor': this.lineColor,
        'sourceMode': this.sourceMode,
        'seamlessAnimation': this.seamlessAnimation
      };
    };
    kit.prototype.loadData = function (data, preinit) {
      this.objList = [];
      this.objTypes = [];
      this.resourceList = data[1];
      this.objTypes = data[2];
      this.keyFrames = data[3];
      this.objList = [];
      for (var i = 0; i < this.objTypes.length; i++) {
        if (this.objTypes[i][0] === 'flower') {
          this.objList.push(new PetalFlower(this, this.objTypes[i][1], this.objTypes[i][2], this.canvasHeight / constants.DEFAULT_INNER_RADIUS_SCALAR, this.canvasHeight / constants.DEFAULT_OUTER_RADIUS_SCALAR, Vector.create(this.midWidth, this.midHeight)));
        }
      }
      this.options = data[0];
      if (_u.exists(this.options.backgroundColor)) {
        this.backgroundColor = this.options.backgroundColor;
      } else {
        this.backgroundColor = constants.BACKGROUND_COLOR;
      }
      if (_u.exists(this.options.backgroundAlpha)) {
        this.backgroundAlpha = this.options.backgroundAlpha;
      } else {
        this.backgroundAlpha = constants.BACKGROUND_ALPHA;
      }
      if (_u.exists(this.options.lineColor)) {
        this.lineColor = this.options.lineColor;
      } else {
        this.lineColor = constants.LINE_COLOR;
      }
      this.currentSelector = 'bg-color';
      window.setColor('#' + this.backgroundColor);
      this.currentSelector = 'line-color';
      window.setColor('#' + this.lineColor);
      if (_u.exists(this.options.sourceMode)) {
        this.sourceMode = this.options.sourceMode;
      } else {
        this.sourceMode = constants.SOURCE_MODE;
      }
      if (_u.exists(this.options.seamlessAnimation)) {
        this.seamlessAnimation = this.options.seamlessAnimation;
      } else {
        this.seamlessAnimation = true;
      }
      this.backgroundImageExists = false;
      this.fillImageExists = false;
      if (typeof this.resourceList.backgroundImageSource === 'string') {
        this.addBackgroundImage(this.resourceList.backgroundImageSource);
      }
      if (typeof this.resourceList.fillImageSource === 'string') {
        this.addFillImage(this.resourceList.fillImageSource);
      }
      this.selectedObject = 0;
      this.segment = 0;
      this.setState();
    };
    kit.prototype.setTempModes = function (editMode, toggleCurveColor) {
      this.settingShelf = {
        'editMode': this.editMode,
        'toggleCurveColor': this.toggleCurveColor
      };
      this.editMode = editMode;
      this.toggleCurveColor = toggleCurveColor;
    };
    kit.prototype.restoreModes = function () {
      this.editMode = this.settingShelf.editMode;
      this.toggleCurveColor = this.settingShelf.toggleCurveColor;
    };
    return kit;
  }({}, core, constants, util, PetalFlower, Vector);
var src_app = function (require, core, constants, Vector, CPoint, Transform, FillImage, PetalFlower, canvasEvents, sceneEvents, objectEvents, settingsEvents) {
    'use strict';
    var kit = core;
    var _globalInit = function () {
      window.kit = new kit();
      initKeyboard();
      kit.encoder = new GIFEncoder();
    };
    if (document.readyState === 'complete') {
      _globalInit();
    } else {
      window.addEventListener('load', _globalInit, false);
    }
    return window.kit;
  }({}, core, constants, Vector, CPoint, Transform, FillImage, PetalFlower, canvasEvents, sceneEvents, objectEvents, settingsEvents);
