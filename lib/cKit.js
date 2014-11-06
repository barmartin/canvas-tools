/*! cKit.js v0.1.9 November 06, 2014 */
var constants = function (require) {
    var PI = Math.PI;
    return {
      SCENE_NORMAL: 0,
      SCENE_GIF: 1,
      PI: PI,
      TWOPIDIV360: 2 * Math.PI / 360,
      MAX_OBJECTS: 4,
      DEFAULT_RAYS: 6,
      DEFAULT_INNER_RADIUS_SCALAR: 17,
      DEFAULT_OUTER_RADIUS_SCALAR: 2.2,
      MAX_CLICK_DISTANCE: 2
    };
  }({});
var Vector = function (require) {
    'use strict';
    return {
      create: function (x, y) {
        return {
          'x': x || -1,
          'y': y || -1
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
      }
    };
  }({});
var CPoint = function (require, constants) {
    'use strict';
    var constants = constants;
    var CPoint = function (kit, x, y, parentObject, index) {
      this.kit = kit;
      this.x = x;
      this.y = y;
      this.index = index;
      this.inDrag = false;
      this.draw = function (cPoints) {
        if (!this.kit.inCurveEditMode) {
          return;
        }
        var realPoint = this.kit.Vector.rotate(kit.midWidth, kit.midHeight, this, parentObject.rotation * constants.TWOPIDIV360);
        if (this.inDrag) {
          if (this.index === 1) {
            var _anchorPoint = this.kit.Vector.rotate(kit.midWidth, kit.midHeight, parentObject.controlPoints[0], parentObject.rotation * constants.TWOPIDIV360);
            kit.context.beginPath();
            kit.context.moveTo(realPoint.x, realPoint.y);
            kit.context.lineTo(_anchorPoint.x, _anchorPoint.y);
            kit.context.stroke();
          } else if (this.index === 2) {
            var anchorPoint = this.kit.Vector.rotate(kit.midWidth, kit.midHeight, parentObject.controlPoints[3], parentObject.rotation * constants.TWOPIDIV360);
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
      this.mouseInside = function (point) {
        return this.kit.controlPointRadius + constants.MAX_CLICK_DISTANCE > this.kit.Vector.distance(point, this);
      };
    };
    return CPoint;
  }({}, constants);
var util = function (require) {
    'use strict';
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
      validateInt: function (obj) {
        return parseInt(obj);
      },
      validateFloat: function (obj) {
        return parseFloat(obj);
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
        }
        return obj;
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
        console.log('Item not Found, IndexOf (should not happen with current config)');
        return -1;
      },
      debugConsole: function (text) {
        var HUD = document.getElementById('console');
        if (HUD.firstChild) {
          HUD.removeChild(HUD.firstChild);
        }
        HUD.appendChild(document.createTextNode(text));
      }
    };
  }({});
var PetalFlower = function (require, constants, CPoint, Vector, util) {
    'use strict';
    var constants = constants;
    var CPoint = CPoint;
    var Vector = Vector;
    var u = util;
    var PetalFlower = function (kit, petals, radialAccent, innerRadius, outerRadius, center) {
      this.kit = kit;
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
      this.controlPoints = [];
      this.thisAngle = 0;
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
      this.firstPetal.push(cp);
      this.controlPoints.push(new CPoint(kit, cp.x, cp.y, this, 0));
      this.controlPoints.push(new CPoint(kit, cp2.x, cp2.y, this, 1));
      this.firstPetal.push(cp2);
      this.controlPoints.push(new CPoint(kit, cp3.x, cp3.y, this, 2));
      this.firstPetal.push(cp3);
      this.controlPoints.push(new CPoint(kit, cp4.x, cp4.y, this, 3));
      this.firstPetal.push(cp4);
      this.firstPetal.push(Vector.create(-1 * (cp3.x - this.center.x) + this.center.x, cp3.y));
      this.firstPetal.push(Vector.create(-1 * (cp2.x - this.center.x) + this.center.x, cp2.y));
      this.firstPetal.push(Vector.create(-1 * (cp.x - this.center.x) + this.center.x, cp.y));
      this.createPetals();
    };
    PetalFlower.prototype.createPetals = function () {
      this.allPetals.push(this.firstPetal);
      for (var i = 1; i < this.petalCount; i++) {
        this.thisAngle = i * this.increment;
        var newPetal = [];
        var thisAngle = this.thisAngle;
        var thisFlower = this;
        u.each(this.firstPetal, function (point) {
          var thisPoint = Vector.rotate(thisFlower.center.x, thisFlower.center.y, point, thisAngle);
          newPetal.push(thisPoint);
        });
        this.allPetals.push(newPetal);
      }
    };
    PetalFlower.prototype.updatePetal = function (index, newPoint) {
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
      if (index === 3) {
        newCoords.x = this.kit.canvasWidth / 2;
        this.firstPetal[3].x = newCoords.x;
        this.firstPetal[index].y = newPoint.y;
      } else if (index === 0) {
        this.innerRadius = Vector.distance(Vector.create(this.center.x, this.center.y), Vector.create(newPoint.x, newPoint.y));
        newCoords = Vector.getPoint(this.center.x, this.center.y, this.innerRadius, this.firstInnerAngle);
        this.firstPetal[0].x = newCoords.x;
        this.firstPetal[0].y = newCoords.y;
        this.firstPetal[6].x = 2 * this.kit.canvasWidth / 2 - newCoords.x;
        this.firstPetal[6].y = newCoords.y;
      } else {
        this.firstPetal[index].x = newPoint.x;
        this.firstPetal[6 - index].x = 2 * this.kit.canvasWidth / 2 - newPoint.x;
        this.firstPetal[6 - index].y = newPoint.y;
        this.firstPetal[index].y = newPoint.y;
      }
      this.allPetals = [];
      this.createPetals();
      this.controlPoints[index].x = newCoords.x;
      this.controlPoints[index].y = newCoords.y;
    };
    PetalFlower.prototype.updateFirstPetal = function () {
      this.firstPetal[0].x = this.controlPoints[0].x;
      this.firstPetal[0].y = this.controlPoints[0].y;
      this.firstPetal[1].x = this.controlPoints[1].x;
      this.firstPetal[1].y = this.controlPoints[1].y;
      this.firstPetal[2].x = this.controlPoints[2].x;
      this.firstPetal[2].y = this.controlPoints[2].y;
      this.firstPetal[3].x = this.controlPoints[3].x;
      this.firstPetal[3].y = this.controlPoints[3].y;
      this.firstPetal[4].x = -1 * (this.controlPoints[2].x - this.center.x) + this.center.x;
      this.firstPetal[4].y = this.controlPoints[2].y;
      this.firstPetal[5].x = -1 * (this.controlPoints[1].x - this.center.x) + this.center.x;
      this.firstPetal[5].y = this.controlPoints[1].y;
      this.firstPetal[6].x = -1 * (this.controlPoints[0].x - this.center.x) + this.center.x;
      this.firstPetal[6].y = this.controlPoints[0].y;
    };
    PetalFlower.prototype.setControlPoint = function (point, newPoint) {
      this.controlPoints[this.kit.indexOf(this.controlPoints, point)] = newPoint;
    };
    PetalFlower.prototype.draw = function () {
      var index = 0;
      var flower = this;
      var kit = this.kit;
      kit.context.save();
      kit.context.beginPath();
      u.each(this.allPetals, function (Petal) {
        kit.context.lineWidth = 1;
        if (flower.rotation === 0) {
          kit.context.moveTo(Petal[0].x, Petal[0].y);
          kit.context.bezierCurveTo(Petal[1].x, Petal[1].y, Petal[2].x, Petal[2].y, Petal[3].x, Petal[3].y);
          kit.context.bezierCurveTo(Petal[4].x, Petal[4].y, Petal[5].x, Petal[5].y, Petal[6].x, Petal[6].y);
          kit.context.moveTo(Petal[6].x, Petal[6].y);
          kit.context.lineTo(Petal[0].x, Petal[0].y);
        } else {
          var rotated = [];
          for (var i = 0; i < Petal.length; i++) {
            rotated.push(Vector.rotate(flower.center.x, flower.center.y, Petal[i], flower.rotation * constants.TWOPIDIV360));
          }
          kit.context.moveTo(rotated[0].x, rotated[0].y);
          kit.context.bezierCurveTo(rotated[1].x, rotated[1].y, rotated[2].x, rotated[2].y, rotated[3].x, rotated[3].y);
          kit.context.bezierCurveTo(rotated[4].x, rotated[4].y, rotated[5].x, rotated[5].y, rotated[6].x, rotated[6].y);
          kit.context.moveTo(rotated[6].x, rotated[6].y);
          kit.context.lineTo(rotated[0].x, rotated[0].y);
        }
        if (index === 0) {
        }
        index++;
      });
      kit.context.closePath();
      if (kit.fillImageExists) {
        kit.context.clip();
        kit.context.drawImage(kit.fillImage, 0, 0, kit.canvasWidth, kit.canvasHeight);
        if (kit.toggleCurveColor === true) {
          kit.context.lineWidth = 3;
          kit.context.stroke();
        }
      } else {
        kit.context.stroke();
      }
      kit.context.restore();
    };
    PetalFlower.prototype.updateRadialPoint = function () {
      this.increment = 2 * Math.PI / this.petalCount;
      this.firstInnerAngle = -0.5 * this.increment;
      var kit = this.kit;
      var flower = this;
      u.each(kit.keyFrames[kit.selectedObject].obj, function (keyFrame) {
        var point = keyFrame.controlPoints[0];
        var radius = Vector.distance(flower.center, Vector.create(point.x, point.y));
        var newPosition = Vector.getPolarPoint(flower.center, radius, flower.firstInnerAngle);
        point.x = newPosition.x;
        point.y = newPosition.y;
      });
    };
    PetalFlower.prototype.accentRadialPoint = function (scale) {
      this.increment = 2 * Math.PI / this.petalCount;
      this.firstInnerAngle = -0.5 * this.increment * scale;
      var kit = this.kit;
      var flower = this;
      u.each(kit.keyFrames[kit.selectedObject].obj, function (keyFrame) {
        var point = keyFrame.controlPoints[0];
        var radius = Vector.distance(flower.center, Vector.create(point.x, point.y));
        var newPosition = Vector.getPolarPoint(flower.center, radius, flower.firstInnerAngle);
        point.x = newPosition.x;
        point.y = newPosition.y;
      });
    };
    PetalFlower.prototype.drawControlPoints = function () {
      var cps = this.controlPoints;
      u.each(cps, function (controlPoint) {
        controlPoint.draw(cps);
      });
    };
    PetalFlower.prototype.getState = function () {
      var cps = [];
      u.each(this.controlPoints, function (point) {
        cps.push(Vector.create(point.x, point.y));
      });
      return {
        'controlPoints': cps,
        'rotation': this.rotation
      };
    };
    PetalFlower.prototype.setState = function (state) {
      var kit = this.kit;
      this.rotation = state.rotation;
      kit.index = 0;
      u.each(this.controlPoints, function (cp) {
        cp.x = state.controlPoints[kit.index].x;
        cp.y = state.controlPoints[kit.index].y;
        kit.index++;
      });
      this.allPetals = [];
      this.updateFirstPetal();
      this.createPetals();
      kit.redraw();
    };
    return PetalFlower;
  }({}, constants, CPoint, Vector, util);
var core = function (require, constants, Vector, CPoint, PetalFlower, util) {
    'use strict';
    var constants = constants;
    var Vector = Vector;
    var CPoint = CPoint;
    var PetalFlower = PetalFlower;
    var _u = util;
    var cKit = function () {
      this.constants = constants;
      this._u = _u;
      this.canvas = document.getElementById('myCanvas');
      this.context = '';
      this.canvasMode = 'static';
      this.keyFrames = [];
      this.updateMode = false;
      this.animationMode = false;
      this.segmentStartTime = 0;
      this.segment = 0;
      this.loopStartTime = 0;
      this.setTime = 0;
      this.pauseTime = 200;
      this.frameDelay = 60;
      this.gifFramerate = 200;
      this.delta = -this.frameDelay;
      this.Vector = Vector;
      this.sceneMode = constants.SCENE_NORMAL;
      this.encoder = '';
      this.delayTime = 0;
      this.initList = ['flower'];
      this.curve = [];
      this.pattern = null;
      this.bodybg = '020202';
      this.backgroundColor = '010201';
      this.lineColor = '9fb4f4';
      this.backgroundAlpha = 1;
      document.getElementById('bgAlpha').value = this.backgroundAlpha;
      this.controlPointRadius = 6;
      this.canvasWidth = 640;
      this.canvasHeight = 640;
      this.midWidth = this.canvasWidth / 2;
      this.midHeight = this.canvasHeight / 2;
      this.center = Vector.create(this.midWidth, this.midHeight);
      this.inCurveEditMode = true;
      this.toggleCurveColor = false;
      this.fieldFocus = false;
      this.settingShelf = {
        'toggleCurveColor': this.toggleCurveColor,
        'inCurveEditMode': this.inCurveEditMode
      };
      this.objList = [];
      this.objTypes = [];
      this.selectedObject = 0;
      this.debugMode = true;
      this.resourceList = {};
      this.backgroundImageExists = false;
      this.fillImageExists = false;
      this.initializeCanvas = function () {
        this.initConstants();
        this.bindEvents();
        this.context = this.canvas.getContext('2d');
        var kInputField = document.getElementById('k');
        kInputField.value = constants.DEFAULT_RAYS;
        if (this.objList.length === 0) {
          this.build();
        } else {
          this.setState();
        }
        this.initFrame();
        if (this.debugMode === true) {
          var dataz = window.getSampleJSON();
          this.loadData(dataz, false);
        }
        this.redraw();
      };
      this.initConstants = function () {
        if (_u.exists(this.positions)) {
          if (this.positions.length !== 24) {
            return;
          }
          this.curve.push(this.validateInt(this.positions.substring(0, 3)));
          this.curve.push(this.validateInt(this.positions.substring(3, 6)));
          this.curve.push(this.validateInt(this.positions.substring(6, 9)));
          this.curve.push(this.validateInt(this.positions.substring(9, 12)));
          this.curve.push(this.validateInt(this.positions.substring(12, 15)));
          this.curve.push(this.validateInt(this.positions.substring(15, 18)));
          this.curve.push(this.validateInt(this.positions.substring(18, 21)));
          this.curve.push(this.validateInt(this.positions.substring(21, 24)));
        }
      };
      this.build = function () {
        var kit = this;
        _u.each(_u.range(0, this.initList.length), function (i) {
          if (kit.initList[i] === 'polar') {
          } else if (kit.initList[i] === 'flower') {
            kit.objList.push(new PetalFlower(kit, constants.DEFAULT_RAYS, 1, kit.canvasHeight / constants.DEFAULT_INNER_RADIUS_SCALAR, kit.canvasHeight / constants.DEFAULT_OUTER_RADIUS_SCALAR, kit.center));
            kit.objTypes.push([
              'flower',
              constants.DEFAULT_RAYS,
              1
            ]);
          }
        });
      };
      this.redraw = function () {
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
          item.draw();
        });
        _u.each(this.objList, function (item) {
          if (_u.indexOf(kit.objList, item) === kit.selectedObject) {
            item.drawControlPoints();
          }
        });
      };
      this.updatePetalCount = function () {
        var kVal = document.getElementById('k').value;
        if (isNaN(kVal)) {
          return;
        }
        if (this.objList[this.selectedObject] instanceof PetalFlower) {
          this.objList[this.selectedObject] = new PetalFlower(this, kVal, 1, this.canvasHeight / constants.DEFAULT_INNER_RADIUS_SCALAR, this.canvasHeight / constants.DEFAULT_OUTER_RADIUS_SCALAR, this.center);
          this.objTypes[this.selectedObject][1] = kVal;
          this.objList[this.selectedObject].updateRadialPoint();
          this.setState();
          this.redraw();
        }
      };
      this.accentRadial = function () {
        var radialScalar = document.getElementById('radialScalar').value;
        if (isNaN(radialScalar)) {
          return;
        }
        radialScalar = _u.validateFloat(radialScalar);
        this.objTypes[this.selectedObject][2] = radialScalar;
        var thisObject = this.objList[this.selectedObject];
        if (radialScalar > 0 && radialScalar < thisObject.petalCount) {
          thisObject.accentRadialPoint(radialScalar);
          this.setState();
          this.redraw();
        }
      };
      this.initFrame = function () {
        this.keyFrames[this.segment] = {};
        this.keyFrames[this.segment].obj = [];
        if (this.segment > 0) {
          for (var i = 0; i < this.objList; i++) {
            this.keyFrames[this.segment].obj[i].rotation = this.keyFrames[this.segment - 1].obj[i].rotation;
            this.keyFrames[this.segment].obj[i].timing = this.keyFrames[this.segment - 1].obj[i].timing;
          }
        } else {
          for (var ind = 0; ind < this.objList; ind++) {
            this.keyFrames[this.segment].obj[ind].rotation = 0;
            this.keyFrames[this.segment].obj[ind].timing = 1;
          }
        }
        this.setFrame();
      };
      this.setState = function () {
        for (var i = 0; i < this.objList.length; i++) {
          this.objList[i].setState(this.keyFrames[this.segment].obj[i]);
        }
      };
      this.getState = function () {
        for (var i = 0; i < this.objList.length; i++) {
          this.keyFrames[this.segment].obj[i] = this.objList[i].getState();
        }
        this.keyFrames[this.segment].timing = parseFloat(document.getElementById('length').value);
      };
      this.clearScene = function () {
        this.objList = [];
        this.objTypes = [];
        this.resourceList = {};
        this.backgroundImageExists = false;
        this.fillImageExists = false;
        this.keyFrames = [];
        this.segment = 0;
        this.objList.push(new PetalFlower(this, constants.DEFAULT_RAYS, 1, this.canvasHeight / constants.DEFAULT_INNER_RADIUS_SCALAR, this.canvasHeight / constants.DEFAULT_OUTER_RADIUS_SCALAR, this.center));
        this.objTypes.push([
          'flower',
          constants.DEFAULT_RAYS,
          1
        ]);
        this.selectedObject = 0;
        this.initFrame();
        this.redraw();
        window.updateInterface();
      };
      this.initializeCanvas();
    };
    cKit.prototype.addObject = function () {
      if (this.objList.length >= constants.MAX_OBJECTS) {
        return;
      }
      this.objList.push(new PetalFlower(this, constants.DEFAULT_RAYS, 1, this.canvasHeight / constants.DEFAULT_INNER_RADIUS_SCALAR, this.canvasHeight / constants.DEFAULT_OUTER_RADIUS_SCALAR, this.center));
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
    };
    cKit.prototype.addFillImage = function (src, label, page) {
      this.fillImage = new Image();
      this.fillImage.onload = function () {
        window.kit.fillImageExists = true;
        window.kit.redraw();
      };
      this.fillImage.src = src;
      this.resourceList.fillImageSource = src;
      this.resourceList.fillImageLabel = label;
      this.resourceList.fillImagePage = page;
    };
    cKit.prototype.addBackGroundImage = function (src, label, page) {
      this.backgroundImage = new Image();
      this.backgroundImage.onload = function () {
        window.kit.backgroundImageExists = true;
        window.kit.redraw();
      };
      this.backgroundImage.src = src;
      this.resourceList.backgroundImageSource = src;
      this.resourceList.backgroundImageLabel = label;
      this.resourceList.backgroundImagePage = page;
    };
    cKit.prototype.startDrag = function (event) {
      var kit = window.kit;
      kit.position = _u.getPosition(event, kit.canvas);
      _u.debugConsole('startDrag x:' + kit.position.x + ' y:' + kit.position.y);
      var clickPoint = kit.Vector.rotate(kit.midWidth, kit.midHeight, kit.position, -kit.objList[kit.selectedObject].rotation * kit.constants.TWOPIDIV360);
      _u.each(kit.objList[kit.selectedObject].controlPoints, function (thisPoint) {
        if (thisPoint.mouseInside(clickPoint)) {
          thisPoint.inDrag = true;
          kit.canvasMode = 'cpDrag';
          kit.redraw();
          return;
        }
      });
    };
    cKit.prototype.endDrag = function (event) {
      var kit = window.kit;
      kit.canvasMode = 'static';
      kit.position = _u.getPosition(event, kit.canvas);
      _u.debugConsole('endDrag x:' + kit.position.x + ' y:' + kit.position.y);
      _u.each(kit.objList, function (object) {
        _u.each(object.controlPoints, function (thisPoint) {
          if (thisPoint.inDrag === true) {
            thisPoint.inDrag = false;
            kit.redraw();
          }
        });
      });
      kit.getState();
    };
    cKit.prototype.move = function (event) {
      var kit = window.kit;
      if (kit.canvasMode !== 'cpDrag') {
        return;
      }
      kit.position = _u.getPosition(event, kit.canvas);
      _u.each(kit.objList, function (object) {
        var index = 0;
        _u.each(object.controlPoints, function (thisPoint) {
          if (thisPoint.inDrag) {
            var rotatedPos = kit.Vector.rotate(kit.midWidth, kit.midHeight, kit.position, -kit.objList[0].rotation * kit.constants.TWOPIDIV360);
            var newPoint = new CPoint(kit, rotatedPos.x, rotatedPos.y, object, index);
            newPoint.inDrag = true;
            object.updatePetal(index, newPoint);
            _u.debugConsole('newPoint.x/y::' + rotatedPos.x + '/' + rotatedPos.y + ' indexof::' + _u.indexOf(object.controlPoints, thisPoint) + ' object type:' + object.type + '</p>');
            kit.redraw();
            return;
          }
          index++;
        });
      });
      _u.debugConsole('mousemove x:' + kit.position.x + ' y:' + kit.position.y);
    };
    cKit.prototype.bindEvents = function () {
      this.canvas.addEventListener('touchstart', this.startDrag, false);
      this.canvas.addEventListener('touchend', this.endDrag, false);
      this.canvas.addEventListener('touchmove', this.move, false);
      this.canvas.addEventListener('mousedown', this.startDrag, false);
      this.canvas.addEventListener('mouseup', this.endDrag, false);
      this.canvas.addEventListener('mousemove', this.move, false);
    };
    cKit.prototype.setFrame = function () {
      for (var i = 0; i < this.objList.length; i++) {
        this.keyFrames[this.segment].obj[i] = this.objList[i].getState();
      }
      this.keyFrames[this.segment].timing = parseFloat(document.getElementById('length').value);
      var val = document.getElementById('rotation').value;
      this.keyFrames[this.segment].obj[this.selectedObject].rotation = parseFloat(val);
    };
    cKit.prototype.gifInit = function () {
      this.encoder.setRepeat(-1);
      this.encoder.setDelay(this.gifFramerate);
      this.encoder.setSize(this.canvasWidth, this.canvasHeight);
      this.encoder.start();
      this.sceneMode = constants.SCENE_GIF;
      this.loopInit();
      this.redraw();
    };
    cKit.prototype.gifComplete = function () {
      this.encoder.finish();
      var binary_gif = this.encoder.stream().getData();
      var data_url = 'data:image/gif;base64,' + window.encode64(binary_gif);
      window.open(data_url, '_blank');
      this.sceneMode = constants.SCENE_NORMAL;
      this.stopScene();
    };
    cKit.prototype.loopInit = function () {
      this.animationMode = true;
      this.segment = 0;
      this.loopStartTime = _u.msTime();
      this.segmentStartTime = this.loopStartTime;
      this.settingShelf = {
        'inCurveEditMode': this.inCurveEditMode,
        'toggleCurveColor': this.toggleCurveColor
      };
      this.inCurveEditMode = false;
      this.toggleCurveColor = false;
      window.updateInterface();
    };
    cKit.prototype.stopScene = function () {
      this.inCurveEditMode = this.settingShelf.inCurveEditMode;
      this.toggleCurveColor = this.settingShelf.toggleCurveColor;
      this.sceneReset();
    };
    cKit.prototype.sceneReset = function () {
      this.animationMode = false;
      this.segment = 0;
      this.setState();
      this.redraw();
    };
    cKit.prototype.setState = function () {
      for (var i = 0; i < this.objList.length; i++) {
        this.objList[i].setState(this.keyFrames[this.segment].obj[i]);
      }
    };
    cKit.prototype.sceneLoop = function () {
      if (!this.animationMode || this.keyFrames.length < 2) {
        this.stopScene();
        window.updateInterface();
        return;
      }
      if (this.sceneMode === constants.SCENE_GIF) {
        this.delta += this.gifFramerate;
      } else {
        this.delta = _u.msTime() - this.segmentStartTime;
      }
      if (this.segment === 0 && this.delta >= this.pauseTime) {
        this.segment = 1;
        this.delta = 0;
        this.segmentStartTime = _u.msTime();
      } else if (this.segment !== 0) {
        if (this.delta > this.keyFrames[this.segment - 1].timing * 1000) {
          if (this.segment < this.keyFrames.length) {
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
      if (this.sceneMode === constants.SCENE_GIF) {
        this.encoder.addFrame(this.context);
        setTimeout(function () {
          window.kit.sceneLoop();
        }, 0.01);
      } else {
        setTimeout(function () {
          window.kit.sceneLoop();
        }, window.kit.frameDelay);
      }
    };
    cKit.prototype.updateSegment = function (delta) {
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
        _u.each(ob.controlPoints, function (cp) {
          var newX = kit.keyFrames[kit.segment - 1].obj[objIndex].controlPoints[index].x * (1 - sig) + cp.x * sig;
          var newY = kit.keyFrames[kit.segment - 1].obj[objIndex].controlPoints[index].y * (1 - sig) + cp.y * sig;
          var newPoint = new CPoint(kit, newX, newY, kit.objList[objIndex], index);
          newCps.push(newPoint);
          index++;
        });
        var newState = { controlPoints: newCps };
        var fromRotation = kit.keyFrames[kit.segment - 1].obj[objIndex].rotation;
        var toRotation = kit.keyFrames[keyTo].obj[objIndex].rotation;
        var del = toRotation - fromRotation;
        if (Math.abs(del) > 180) {
          if (del < 0) {
            toRotation += 360;
          } else {
            fromRotation += 360;
          }
        }
        newState.rotation = (fromRotation * (1 - sig) + toRotation * sig) % 360;
        kit.objList[objIndex].setState(newState);
        objIndex++;
      });
    };
    cKit.prototype.segmentLoop = function () {
      if (!this.animationMode || this.segment === 0) {
        this.setState();
        window.updateInterface();
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
          _u.each(ob.controlPoints, function (cp) {
            var newX = kit.keyFrames[kit.segment - 1].obj[objIndex].controlPoints[index].x * (1 - sig) + cp.x * sig;
            var newY = kit.keyFrames[kit.segment - 1].obj[objIndex].controlPoints[index].y * (1 - sig) + cp.y * sig;
            var newPoint = new CPoint(kit, newX, newY, kit.objList[objIndex], index);
            newCps.push(newPoint);
            index++;
          });
          var newState = { controlPoints: newCps };
          var fromRotation = kit.keyFrames[kit.segment - 1].obj[objIndex].rotation;
          var toRotation = kit.keyFrames[kit.segment].obj[objIndex].rotation;
          var del = toRotation - fromRotation;
          if (Math.abs(del) > 180) {
            if (del < 0) {
              toRotation += 360;
            } else {
              fromRotation += 360;
            }
          }
          newState.rotation = (fromRotation * (1 - sig) + toRotation * sig) % 360;
          kit.objList[objIndex].setState(newState);
          objIndex++;
        });
      }
      setTimeout(function () {
        window.kit.segmentLoop();
      }, window.kit.frameDelay);
    };
    cKit.prototype.loadData = function (data, preinit) {
      this.objList = [];
      this.objTypes = [];
      this.resourceList = data[1];
      this.objTypes = data[2];
      this.keyFrames = data[3];
      this.objList = [];
      for (var i = 0; i < this.objTypes.length; i++) {
        if (this.objTypes[i][0] === 'flower') {
          this.objList.push(new PetalFlower(this, this.objTypes[i][1], 1, this.canvasHeight / constants.DEFAULT_INNER_RADIUS_SCALAR, this.canvasHeight / constants.DEFAULT_OUTER_RADIUS_SCALAR, this.center));
        } else if (this.objTypes[i][0] === 'polar') {
        }
      }
      this.selectedObject = 0;
      this.options = data[0];
      this.currentSelector = 'bg-color';
      this.backgroundColor = this.options.backgroundColor;
      this.backgroundAlpha = this.options.backgroundAlpha;
      this.lineColor = this.options.lineColor;
      this.backgroundImageExists = false;
      this.fillImageExists = false;
      if (typeof this.resourceList.backgroundImageSource === 'string') {
        this.addBackGroundImage(this.resourceList.backgroundImageSource, this.resourceList.backgroundImageLabel, this.resourceList.backgroundImagePage);
      }
      if (typeof this.resourceList.fillImageSource === 'string') {
        this.addFillImage(this.resourceList.fillImageSource, this.resourceList.fillImageLabel, this.resourceList.fillImagePage);
      }
      if (!this.preinit) {
        window.setColor('#' + this.backgroundColor);
      }
      this.currentSelector = 'line-color';
      if (!this.preinit) {
        window.setColor('#' + this.lineColor);
      }
      this.segment = 0;
      this.setState();
      this.redraw();
    };
    for (var kit in cKit.prototype) {
      if (typeof cKit.prototype[kit] === 'function') {
        window[kit] = cKit.prototype[kit];
      }
    }
    cKit.prototype._preloadMethods = [];
    cKit.prototype._registeredMethods = {
      pre: [],
      post: [],
      remove: []
    };
    cKit.prototype.registerPreloadMethod = function (m) {
      cKit.prototype._preloadMethods.push(m);
    }.bind(this);
    cKit.prototype.registerMethod = function (name, m) {
      if (!cKit.prototype._registeredMethods.hasOwnProperty(name)) {
        cKit.prototype._registeredMethods[name] = [];
      }
      cKit.prototype._registeredMethods[name].push(m);
    }.bind(this);
    return cKit;
  }({}, constants, Vector, CPoint, PetalFlower, util);
var src_app = function (require, core, constants, Vector, CPoint, PetalFlower) {
    'use strict';
    var cKit = core;
    var _globalInit = function () {
      window.kit = new cKit();
      window.initInterface();
    };
    if (document.readyState === 'complete') {
      _globalInit();
    } else {
      window.addEventListener('load', _globalInit, false);
    }
    return window.kit;
  }({}, core, constants, Vector, CPoint, PetalFlower);
