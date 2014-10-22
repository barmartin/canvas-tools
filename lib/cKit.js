/*! cKit.js v0.0.1 October 22, 2014 */
var constants = function (require) {
    var PI = Math.PI;
    return {
      SCENE_NORMAL: 0,
      SCENE_GIF: 1,
      PI: PI,
      TWOPIDIV360: 2 * Math.PI / 360
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
          if (index === 1) {
            var _anchorPoint = this.kit.Vector.rotate(kit.midWidth, kit.midHeight, parentObject.controlPoints[0], parentObject.rotation * constants.TWOPIDIV360);
            kit.context.beginPath();
            kit.context.moveTo(realPoint.x, realPoint.y);
            kit.context.lineTo(_anchorPoint.x, _anchorPoint.y);
            kit.context.stroke();
          } else if (index === 2) {
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
        return this.kit.controlPointRadius + 2 > this.kit.Vector.distance(point, this);
      };
    };
    return CPoint;
  }({}, constants);
var PedalFlower = function (require, constants, CPoint) {
    'use strict';
    var constants = constants;
    var CPoint = CPoint;
    var PedalFlower = function (kit, pedals, innerRadius, outerRadius, type) {
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
      this.firstPedal.push(cp);
      this.controlPoints.push(new CPoint(kit, cp.x, cp.y, this, 0));
      this.controlPoints.push(new CPoint(kit, cp2.x, cp2.y, this, 1));
      this.firstPedal.push(cp2);
      this.controlPoints.push(new CPoint(kit, cp3.x, cp3.y, this, 2));
      this.firstPedal.push(cp3);
      this.controlPoints.push(new CPoint(kit, cp4.x, cp4.y, this, 3));
      this.firstPedal.push(cp4);
      this.firstPedal.push(this.kit.Vector.create(-1 * (cp3.x - this.kit.midWidth) + this.kit.midWidth, cp3.y));
      this.firstPedal.push(this.kit.Vector.create(-1 * (cp2.x - this.kit.midWidth) + this.kit.midWidth, cp2.y));
      this.firstPedal.push(this.kit.Vector.create(-1 * (cp.x - this.kit.midWidth) + this.kit.midWidth, cp.y));
      this.createPedals();
    };
    PedalFlower.prototype.createPedals = function () {
      this.allPedals.push(this.firstPedal);
      var kit = this.kit;
      for (var i = 1; i < this.pedalCount; i++) {
        this.thisAngle = i * this.increment;
        var newPedal = [];
        var thisAngle = this.thisAngle;
        kit.each(this.firstPedal, function (point) {
          var thisPoint = kit.Vector.rotate(kit.midWidth, kit.midHeight, point, thisAngle);
          newPedal.push(thisPoint);
        });
        this.allPedals.push(newPedal);
      }
    };
    PedalFlower.prototype.updatePedal = function (index, newPoint) {
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
      if (index === 3) {
        newCoords.x = this.kit.canvasWidth / 2;
        this.firstPedal[3].x = newCoords.x;
        this.firstPedal[index].y = newPoint.y;
      } else if (index === 0) {
        this.innerRadius = this.kit.Vector.distance(this.kit.Vector.create(this.kit.midWidth, this.kit.midHeight), this.kit.Vector.create(newPoint.x, newPoint.y));
        newCoords = this.kit.Vector.getPoint(this.kit.midWidth, this.kit.midHeight, this.innerRadius, this.firstInnerAngle);
        this.firstPedal[0].x = newCoords.x;
        this.firstPedal[0].y = newCoords.y;
        this.firstPedal[6].x = 2 * this.kit.canvasWidth / 2 - newCoords.x;
        this.firstPedal[6].y = newCoords.y;
      } else {
        this.firstPedal[index].x = newPoint.x;
        this.firstPedal[6 - index].x = 2 * this.kit.canvasWidth / 2 - newPoint.x;
        this.firstPedal[6 - index].y = newPoint.y;
        this.firstPedal[index].y = newPoint.y;
      }
      this.allPedals = [];
      this.createPedals();
      this.controlPoints[index].x = newCoords.x;
      this.controlPoints[index].y = newCoords.y;
    };
    PedalFlower.prototype.updateFirstPedal = function () {
      this.firstPedal[0].x = this.controlPoints[0].x;
      this.firstPedal[0].y = this.controlPoints[0].y;
      this.firstPedal[1].x = this.controlPoints[1].x;
      this.firstPedal[1].y = this.controlPoints[1].y;
      this.firstPedal[2].x = this.controlPoints[2].x;
      this.firstPedal[2].y = this.controlPoints[2].y;
      this.firstPedal[3].x = this.controlPoints[3].x;
      this.firstPedal[3].y = this.controlPoints[3].y;
      this.firstPedal[4].x = -1 * (this.controlPoints[2].x - this.kit.midWidth) + this.kit.midWidth;
      this.firstPedal[4].y = this.controlPoints[2].y;
      this.firstPedal[5].x = -1 * (this.controlPoints[1].x - this.kit.midWidth) + this.kit.midWidth;
      this.firstPedal[5].y = this.controlPoints[1].y;
      this.firstPedal[6].x = -1 * (this.controlPoints[0].x - this.kit.midWidth) + this.kit.midWidth;
      this.firstPedal[6].y = this.controlPoints[0].y;
    };
    PedalFlower.prototype.setControlPoint = function (point, newPoint) {
      this.controlPoints[this.kit.indexOf(this.controlPoints, point)] = newPoint;
    };
    PedalFlower.prototype.draw = function () {
      var index = 0;
      var flower = this;
      var kit = this.kit;
      kit.each(this.allPedals, function (pedal) {
        if (index === 0 && kit.toggleCurveColor) {
          kit.context.strokeStyle = '#00ff00';
        }
        kit.context.lineWidth = 2;
        kit.context.beginPath();
        if (flower.rotation === 0) {
          kit.context.moveTo(pedal[0].x, pedal[0].y);
          kit.context.bezierCurveTo(pedal[1].x, pedal[1].y, pedal[2].x, pedal[2].y, pedal[3].x, pedal[3].y);
          kit.context.stroke();
          kit.context.bezierCurveTo(pedal[4].x, pedal[4].y, pedal[5].x, pedal[5].y, pedal[6].x, pedal[6].y);
        } else {
          var rotated = [];
          for (var i = 0; i < pedal.length; i++) {
            rotated.push(kit.Vector.rotate(kit.midWidth, kit.midHeight, pedal[i], flower.rotation * constants.TWOPIDIV360));
          }
          kit.context.moveTo(rotated[0].x, rotated[0].y);
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
      if (kit.indexOf(kit.objList, this) === kit.selectedObject) {
        kit.each(this.controlPoints, function (controlPoint) {
          controlPoint.draw(cPs);
        });
      }
    };
    PedalFlower.prototype.getState = function () {
      var cps = [];
      var kit = this.kit;
      kit.each(this.controlPoints, function (point) {
        cps.push(kit.Vector.create(point.x, point.y));
      });
      return {
        'controlPoints': cps,
        'rotation': this.rotation
      };
    };
    PedalFlower.prototype.setState = function (state) {
      var kit = this.kit;
      this.rotation = state.rotation;
      kit.index = 0;
      kit.each(this.controlPoints, function (cp) {
        cp.x = state.controlPoints[kit.index].x;
        cp.y = state.controlPoints[kit.index].y;
        kit.index++;
      });
      this.allPedals = [];
      this.updateFirstPedal();
      this.createPedals();
      kit.redraw();
    };
    return PedalFlower;
  }({}, constants, CPoint);
var core = function (require, constants, Vector, CPoint, PedalFlower) {
    'use strict';
    var constants = constants;
    var Vector = Vector;
    var CPoint = CPoint;
    var PedalFlower = PedalFlower;
    var cKit = function () {
      this.constants = constants;
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
      this.frameDelay = 30;
      this.savedSettings = {};
      this.delta = -this.frameDelay;
      this.Vector = Vector;
      this.sceneMode = constants.SCENE_NORMAL;
      this.encoder = 11;
      this.delayTime = 0;
      this.initList = ['flower'];
      this.curve = [];
      this.k = 6;
      this.pattern = null;
      this.bodybg = '020202';
      this.selectedObject = 0;
      this.controlPointRadius = 7;
      this.canvasWidth = 600;
      this.canvasHeight = 600;
      this.midWidth = this.canvasWidth / 2;
      this.midHeight = this.canvasHeight / 2;
      this.inCurveEditMode = true;
      this.toggleCurveColor = false;
      this.objList = [];
      this.objTypes = [];
      this.initializeCanvas = function () {
        this.initConstants();
        this.bindEvents();
        this.context = this.canvas.getContext('2d');
        var kInputField = document.getElementById('k');
        kInputField.value = this.k;
        if (this.objList.length === 0) {
          this.build();
        } else {
          this.setState();
        }
        this.redraw();
      };
      this.initConstants = function () {
        if (this.dnexist(this.k)) {
          this.k = 6;
        }
        if (this.dnexist(this.backgroundColor)) {
          this.backgroundColor = '1e2f25';
        }
        if (this.dnexist(this.backgroundAlpha)) {
          this.backgroundAlpha = 0.5;
        } else {
          document.getElementById('bgAlpha').value = this.backgroundAlpha;
        }
        if (this.dnexist(this.lineColor)) {
          this.lineColor = '9cf4c7';
        }
        if (this.exists(this.positions)) {
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
        this.each(this.range(0, this.initList.length), function (i) {
          if (kit.initList[i] === 'polar') {
          } else if (kit.initList[i] === 'flower') {
            kit.objList.push(new PedalFlower(kit, kit.k, 20, 250, 'seperated'));
            kit.objTypes.push([
              'flower',
              kit.k
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
        var rgb = this.toRGB(this.backgroundColor);
        this.context.fillStyle = 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', ' + this.backgroundAlpha + ')';
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.each(this.objList, function (item) {
          item.draw();
        });
      };
      this.update = function () {
        var kVal = document.getElementById('k').value;
        if (isNaN(kVal)) {
          return;
        }
        this.objList[this.selectedObject] = new cKit.pedalFlower(kVal, 20, this.canvasHeight / 6 * 2.5, 'seperated');
        this.objTypes[this.selectedObject][1] = kVal;
        this.setState();
      };
      this.initializeCanvas();
    };
    cKit.prototype.cpFormat = function (coord) {
      if (coord < 10) {
        return '00' + Math.floor(coord);
      }
      if (coord < 100) {
        return '0' + Math.floor(coord);
      } else {
        return Math.floor(coord).toString();
      }
    };
    cKit.prototype.getPosition = function (e) {
      var targ;
      if (!e) {
        e = window.event;
      }
      if (e.target) {
        targ = e.target;
      } else if (e.srcElement) {
        targ = e.srcElement;
      }
      if (targ.nodeType === 3) {
        targ = targ.parentNode;
      }
      var rect = this.canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    Array.prototype.insert = function (index, item) {
      this.splice(index, 0, item);
    };
    cKit.prototype.clone = function (obj) {
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
    };
    cKit.prototype.dnexist = function (item) {
      return typeof item === 'undefined';
    };
    cKit.prototype.exists = function (item) {
      return typeof item !== 'undefined';
    };
    cKit.prototype.encodeToHex = function (floatString) {
      return parseInt(255 * floatString).toString(16);
    };
    cKit.prototype.decodeFromHex = function (str) {
      return parseInt(str, 16);
    };
    cKit.prototype.validateInt = function (obj) {
      return parseInt(obj);
    };
    cKit.prototype.toRGB = function (str) {
      return [
        this.decodeFromHex(str.substring(0, 2)),
        this.decodeFromHex(str.substring(2, 4)),
        this.decodeFromHex(str.substring(4, 6))
      ];
    };
    cKit.prototype.msTime = function () {
      return new Date().getTime();
    };
    cKit.prototype.each = function (obj, func) {
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
    };
    cKit.prototype.range = function (st, end) {
      var r = [];
      for (var i = st; i < end; i++) {
        r.push(i);
      }
      return r;
    };
    cKit.prototype.indexOf = function (obj, item) {
      for (var i = 0; i < obj.length; i++) {
        if (obj[i] === item) {
          return i;
        }
      }
      console.log('Item not Found, IndexOf (likely bug)');
      return -1;
    };
    cKit.prototype.startDrag = function (event) {
      var kit = window.cKit;
      kit.position = kit.getPosition(event);
      kit.debugConsole('startDrag x:' + kit.position.x + ' y:' + kit.position.y);
      var clickPoint = kit.Vector.rotate(kit.midWidth, kit.midHeight, kit.position, -kit.objList[kit.selectedObject].rotation * kit.constants.TWOPIDIV360);
      kit.each(kit.objList[kit.selectedObject].controlPoints, function (thisPoint) {
        if (thisPoint.mouseInside(clickPoint)) {
          thisPoint.inDrag = true;
          kit.canvasMode = 'cpDrag';
          kit.redraw();
          return;
        }
      });
    };
    cKit.prototype.endDrag = function (event) {
      var kit = window.cKit;
      kit.canvasMode = 'static';
      kit.position = kit.getPosition(event);
      kit.debugConsole('endDrag x:' + kit.position.x + ' y:' + kit.position.y);
      window.each(kit.objList, function (object) {
        window.each(object.controlPoints, function (thisPoint) {
          if (thisPoint.inDrag === true) {
            thisPoint.inDrag = false;
            kit.redraw();
          }
        });
      });
    };
    cKit.prototype.move = function (event) {
      var kit = window.cKit;
      if (kit.canvasMode !== 'cpDrag') {
        return;
      }
      kit.position = kit.getPosition(event);
      kit.each(kit.objList, function (object) {
        var index = 0;
        kit.each(object.controlPoints, function (thisPoint) {
          if (thisPoint.inDrag) {
            var rotatedPos = kit.Vector.rotate(kit.midWidth, kit.midHeight, kit.position, -kit.objList[0].rotation * kit.constants.TWOPIDIV360);
            var newPoint = new CPoint(kit, rotatedPos.x, rotatedPos.y, object, index);
            newPoint.inDrag = true;
            object.updatePedal(index, newPoint);
            kit.debugConsole('newPoint.x/y::' + rotatedPos.x + '/' + rotatedPos.y + ' indexof::' + kit.indexOf(object.controlPoints, thisPoint) + ' object type:' + object.type + '</p>');
            kit.redraw();
            return;
          }
          index++;
        });
      });
      kit.debugConsole('mousemove x:' + kit.position.x + ' y:' + kit.position.y);
    };
    cKit.prototype.bindEvents = function () {
      this.canvas.addEventListener('touchstart', this.startDrag, false);
      this.canvas.addEventListener('touchend', this.endDrag, false);
      this.canvas.addEventListener('touchmove', this.move, false);
      this.canvas.addEventListener('mousedown', this.startDrag, false);
      this.canvas.addEventListener('mouseup', this.endDrag, false);
      this.canvas.addEventListener('mousemove', this.move, false);
    };
    cKit.prototype.setupGif = function () {
    };
    cKit.prototype.gripImg = function (r, g, b) {
    };
    cKit.prototype.injectColor = function (id, color) {
    };
    cKit.prototype.debugConsole = function (text) {
      var HUD = document.getElementById('console');
      if (HUD.firstChild) {
        HUD.removeChild(HUD.firstChild);
      }
      HUD.appendChild(document.createTextNode(text));
    };
    cKit.prototype.addEventHandler = function (oNode, evt, oFunc, bCaptures) {
      if (this.exists(oNode.attachEvent)) {
        oNode.attachEvent('on' + evt, oFunc);
      } else {
        oNode.addEventListener(evt, oFunc, bCaptures);
      }
    };
    cKit.prototype.setUpClickEvent = function (e) {
      this.addEventHandler(document.getElementById('clickLink'), 'click', this.onLinkClicked, false);
    };
    cKit.prototype.removeEventHandler = function (oNode, evt, oFunc, bCaptures) {
      if (cKit.exists(window.event)) {
      } else {
      }
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
  }({}, constants, Vector, CPoint, PedalFlower);
var src_app = function (require, core, constants, Vector, CPoint, PedalFlower) {
    'use strict';
    var cKit = core;
    var _globalInit = function () {
      window.cKit = new cKit();
    };
    if (document.readyState === 'complete') {
      _globalInit();
    } else {
      window.addEventListener('load', _globalInit, false);
    }
    return window.cKit;
  }({}, core, constants, Vector, CPoint, PedalFlower);
