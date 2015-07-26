var cKit;
(function (cKit) {
    var constants;
    (function (constants) {
        // Math
        constants.PI = Math.PI;
        constants.TWOPIDIV360 = Math.PI / 180;
        constants.TWOPI = 2 * Math.PI;
        // SCENE SETTINGS
        constants.MAX_OBJECTS = 4;
        constants.DEFAULT_RAYS = 6;
        constants.DEFAULT_TIMING = 1000;
        constants.DEFAULT_PAUSETIME = 0;
        constants.DEFAULT_INNER_RADIUS_SCALAR = .0000000000001;
        constants.DEFAULT_OUTER_RADIUS_SCALAR = .35;
        constants.CONTROL_POINT_RADIUS = 6;
        constants.MAX_CP_SIGS = 3;
        constants.BACKGROUND_COLOR = '010201';
        constants.BACKGROUND_ALPHA = 1;
        constants.LINE_COLOR = '9fb4f4';
        constants.DEFAULT_FRAME_RATE = 50;
        constants.MAX_CLICK_DISTANCE = 2;
        constants.SOURCE_MODES = {
            'lighter': 'lighter',
            'darker': 'darker',
            'xor': 'xor',
            //'copy': 'copy',
            'source-atop': 'atop',
            //'source-in': 'in',
            'source-out': 'out',
            'source-over': 'over',
            'destination-atop': 'bottom',
            //'destination-in': 'bottom-intersection',
            'destination-out': 'bottom-out'
        };
    })(constants = cKit.constants || (cKit.constants = {}));
})(cKit || (cKit = {}));
var cKit;
(function (cKit) {
    var util;
    (function (util) {
        var constants = cKit.constants;
        /* Util Helper */
        function getPosition(e, canvas) {
            var rect = canvas.getBoundingClientRect();
            return new cKit.elements.Vector(e.clientX - rect.left, e.clientY - rect.top);
        }
        util.getPosition = getPosition;
        // SHALLOW CLONE
        function clone(obj) {
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
        }
        util.clone = clone;
        function encodeToHex(floatString) {
            return 0; // parseInt(255 * floatString).toString(16);
        }
        util.encodeToHex = encodeToHex;
        function decodeFromHex(str) {
            return parseInt(str, 16);
        }
        util.decodeFromHex = decodeFromHex;
        function dnexist(item) {
            return typeof item === 'undefined';
        }
        util.dnexist = dnexist;
        function exists(item) {
            return typeof item !== 'undefined';
        }
        util.exists = exists;
        function reduceSig(num, sig) {
            var mult = Math.pow(10, sig);
            // Floating point fix + 0.00001
            return Math.round(num * mult + 0.0000001) / mult;
        }
        util.reduceSig = reduceSig;
        function degreesToRadians(angle) {
            return constants.TWOPIDIV360 * angle;
        }
        util.degreesToRadians = degreesToRadians;
        function toRGB(str) {
            return [decodeFromHex(str.substring(0, 2)), decodeFromHex(str.substring(2, 4)), decodeFromHex(str.substring(4, 6))];
        }
        util.toRGB = toRGB;
        function msTime() {
            return new Date().getTime();
        }
        util.msTime = msTime;
        //  This is underscore's each algorithm
        function each(obj, func) {
            if (obj == null) {
                return obj;
            }
            var i, length = obj.length;
            //console.log('length:' + length + ','+'+length: '+length);
            if (length === +length) {
                for (i = 0; i < length; i++) {
                    func(obj[i], i, obj);
                }
            }
            else {
                // Fix self reference issue
                var keys = getKeys(obj);
                for (i = 0, length = keys.length; i < length; i++) {
                    func(obj[keys[i]], keys[i], obj);
                }
            }
            return obj;
        }
        util.each = each;
        function getKeys(obj) {
            return Object.keys(obj);
        }
        util.getKeys = getKeys;
        function dicMap(dic, func, context) {
            if (context === void 0) { context = null; }
            var keys = getKeys(dic);
            keys.forEach(function (key) {
                if (dnexist(context)) {
                    func(key, dic[key]);
                }
                else {
                    func.call(context, key, dic[key]);
                }
            });
        }
        util.dicMap = dicMap;
        // TODO
        function range(st, end) {
            var r = [];
            for (var i = st; i < end; i++) {
                r.push(i);
            }
            return r;
        }
        util.range = range;
        function indexOf(obj, item) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i] === item) {
                    //console.log('indexOf returning:' + i);
                    return i;
                }
            }
            console.log('There is a bug with a call to indexOf');
            return -1;
        }
        util.indexOf = indexOf;
        function removeArrayEntry(arr, index) {
            arr.splice(index, 1);
        }
        util.removeArrayEntry = removeArrayEntry;
        function parseIntOrDefault(i, def) {
            i = parseInt(i);
            if (i % 1 === 0) {
                return i;
            }
            else {
                return def;
            }
        }
        util.parseIntOrDefault = parseIntOrDefault;
        function parseFloatOrDefault(f, def) {
            f = parseFloat(f);
            if (isNaN(f)) {
                return def;
            }
            else {
                return f;
            }
        }
        util.parseFloatOrDefault = parseFloatOrDefault;
        var AsArray = (function () {
            function AsArray(key, value) {
                this.key = key;
                this.value = value;
            }
            return AsArray;
        })();
        util.AsArray = AsArray;
        function getRotationMatrix(angle) {
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            return [cos, sin, -sin, cos, 0, 0];
        }
        util.getRotationMatrix = getRotationMatrix;
    })(util = cKit.util || (cKit.util = {}));
})(cKit || (cKit = {}));
Date.prototype.compare = function (x) {
    var result = this.getTime() - x.getTime();
    return result;
};
var Dictionary = (function () {
    function Dictionary() {
    }
    return Dictionary;
})();
var cKit;
(function (cKit) {
    var elements;
    (function (elements) {
        var constants = cKit.constants;
        var Vector = (function () {
            function Vector(x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                this.x = x;
                this.y = y;
            }
            Vector.prototype.multiply = function (vector, scaleFactor) {
                vector.x *= scaleFactor;
                vector.y *= scaleFactor;
            };
            Vector.prototype.add = function (vector2) {
                this.x += vector2.x;
                this.y += vector2.y;
            };
            /* For things like control point rotation */
            Vector.prototype.rotate = function (thisAngle, center) {
                if (center === void 0) { center = theZeroVector; }
                var cosTheta = Math.cos(thisAngle);
                var sinTheta = Math.sin(thisAngle);
                var newX = (cosTheta * (this.x - center.x) - sinTheta * (this.y - center.y)) + center.x;
                this.y = (sinTheta * (this.x - center.x) + cosTheta * (this.y - center.y)) + center.y;
                this.x = newX;
            };
            /* For things like control point rotation */
            Vector.prototype.rotateIntoNewVector = function (thisAngle, center) {
                if (center === void 0) { center = theZeroVector; }
                var cosTheta = Math.cos(thisAngle);
                var sinTheta = Math.sin(thisAngle);
                var newX = (cosTheta * (this.x - center.x) - sinTheta * (this.y - center.y)) + center.x;
                var newY = (sinTheta * (this.x - center.x) + cosTheta * (this.y - center.y)) + center.y;
                return new Vector(newX, newY);
            };
            Vector.prototype.distance = function (pointB) {
                if (pointB === void 0) { pointB = theZeroVector; }
                var xDist = this.x - pointB.x;
                var yDist = this.y - pointB.y;
                return Math.sqrt(xDist * xDist + yDist * yDist);
            };
            Vector.prototype.getRadians = function (center) {
                var xDelta = this.x - center.x;
                var yDelta = center.y - this.y;
                var rads = Math.atan2(xDelta, yDelta);
                if (rads < 0) {
                    rads += constants.TWOPI;
                }
                return rads;
            };
            Vector.prototype.getDegrees = function (center) {
                var xDelta = this.x - center.x;
                var yDelta = center.y - this.y;
                var degrees = Math.atan2(xDelta, yDelta) / constants.TWOPIDIV360;
                if (degrees < 0) {
                    degrees += 360;
                }
                return degrees;
            };
            Vector.prototype.clone = function () {
                return new Vector(this.x, this.y);
            };
            /* Shouldn't ever be modified by recipient! */
            Vector.zeroVector = function () {
                return theZeroVector;
            };
            Vector.newZeroVector = function () {
                return new Vector(0, 0);
            };
            Vector.reflectMatrix = function (theta) {
                return [Math.cos(2 * theta), Math.sin(2 * theta), Math.sin(2 * theta), -Math.cos(2 * theta)];
            };
            Vector.getPolarPoint = function (radius, angle, center) {
                if (center === void 0) { center = theZeroVector; }
                return new Vector(center.x + radius * Math.sin(angle), center.y - radius * Math.cos(angle));
            };
            return Vector;
        })();
        elements.Vector = Vector;
        var theZeroVector = new Vector(0, 0);
    })(elements = cKit.elements || (cKit.elements = {}));
})(cKit || (cKit = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cKit;
(function (cKit) {
    var elements;
    (function (elements) {
        var constants = cKit.constants;
        var Vector = cKit.elements.Vector;
        /* objPoint is a reference to the point inside the pedal */
        var CPoint = (function (_super) {
            __extends(CPoint, _super);
            function CPoint(x, y, inDrag) {
                if (inDrag === void 0) { inDrag = false; }
                _super.call(this, x, y);
                this.inDrag = inDrag;
            }
            CPoint.prototype.draw = function (index, context, parentRotation, editMode) {
                var realPoint;
                if (editMode !== cKit.events.controlModes.EDIT_TRANSFORM || index !== 2) {
                    realPoint = this.rotateIntoNewVector(parentRotation);
                }
                else {
                    realPoint = this;
                }
                context.beginPath();
                context.arc(realPoint.x, realPoint.y, constants.CONTROL_POINT_RADIUS, 0, Math.PI * 2, true);
                context.closePath();
                context.lineWidth = 1;
                if (this.inDrag) {
                    context.fillStyle = '#999999';
                    context.fill();
                }
                else {
                    context.fillStyle = '#FFFFFF';
                    context.fill();
                }
                context.stroke();
            };
            CPoint.prototype.mouseInside = function (point, parentObjectScale) {
                return constants.CONTROL_POINT_RADIUS + constants.MAX_CLICK_DISTANCE > this.distance(point) * parentObjectScale;
            };
            return CPoint;
        })(Vector);
        elements.CPoint = CPoint;
    })(elements = cKit.elements || (cKit.elements = {}));
})(cKit || (cKit = {}));
var cKit;
(function (cKit) {
    var elements;
    (function (elements) {
        var Transform = (function () {
            function Transform(position, scale, rotation) {
                var _this = this;
                this.getMatrix = function () {
                    var cos = Math.cos(_this.rotation);
                    var sin = Math.sin(_this.rotation);
                    return [_this.scale * cos, sin, -sin, _this.scale * cos, _this.position.x, _this.position.y];
                };
                this.position = position;
                this.scale = scale;
                this.rotation = rotation;
            }
            return Transform;
        })();
        elements.Transform = Transform;
    })(elements = cKit.elements || (cKit.elements = {}));
})(cKit || (cKit = {}));
var cKit;
(function (cKit) {
    var elements;
    (function (elements) {
        var ImageResource = (function () {
            function ImageResource(kit, src, page, label) {
                this.loaded = false;
                this.kit = kit;
                this.src = src;
                this.page = page;
                this.label = label;
                this.image = new Image();
                var till = function () {
                    this.loaded = true;
                    /* Use .bind to attach scope? */
                    cKit.kit.redraw();
                };
                this.image.addEventListener('load', till.bind(this), false);
                this.image.src = src;
                this.id = kit.resourceList.images.length;
            }
            ImageResource.prototype.exportImage = function () {
                return { src: this.src, page: this.page, label: this.label };
            };
            return ImageResource;
        })();
        elements.ImageResource = ImageResource;
    })(elements = cKit.elements || (cKit.elements = {}));
})(cKit || (cKit = {}));
var cKit;
(function (cKit) {
    var elements;
    (function (elements) {
        // Delta is used by the UI & for the final keyframe smooth animation to segment 0 time
        // The main scene loop works based on timestamps
        var Keyframe = (function () {
            function Keyframe(objStates, timestamp) {
                var _this = this;
                this.objStates = [];
                objStates.forEach(function (keyState) {
                    _this.objStates.push(new KeyState(keyState.cPStates, keyState.attributes));
                });
                this.timestamp = timestamp;
            }
            Keyframe.prototype.export = function () {
                return {
                    objStates: this.objStates,
                    timestamp: this.timestamp,
                };
            };
            return Keyframe;
        })();
        elements.Keyframe = Keyframe;
        var KeyState = (function () {
            function KeyState(cpStates, attributes) {
                var _this = this;
                this.attributes = {};
                this.cPStates = [];
                cpStates.forEach(function (item) {
                    _this.cPStates.push(new elements.Vector(item.x, item.y));
                });
                Object.keys(attributes).forEach(function (key) {
                    if (key === 'center') {
                        _this.attributes[key] = new elements.Vector(attributes[key].x, attributes[key].y);
                    }
                    else {
                        _this.attributes[key] = attributes[key];
                    }
                });
            }
            return KeyState;
        })();
        elements.KeyState = KeyState;
    })(elements = cKit.elements || (cKit.elements = {}));
})(cKit || (cKit = {}));
var cKit;
(function (cKit) {
    var elements;
    (function (elements) {
        var _u = cKit.util;
        /* A UI Type exposes a variable to the UI,
         * for now we are using the same to import/export keyframes & json
         * I hope to use the type value in angular to automate UI control generation
         */
        (function (TYPES) {
            TYPES[TYPES["NUMBER"] = 0] = "NUMBER";
            TYPES[TYPES["STRING"] = 1] = "STRING";
            TYPES[TYPES["VECTOR"] = 2] = "VECTOR";
        })(elements.TYPES || (elements.TYPES = {}));
        var TYPES = elements.TYPES;
        (function (CONSTRAINTS) {
            CONSTRAINTS[CONSTRAINTS["NONE"] = 0] = "NONE";
            CONSTRAINTS[CONSTRAINTS["MOD"] = 1] = "MOD";
            CONSTRAINTS[CONSTRAINTS["MINMAX"] = 2] = "MINMAX";
        })(elements.CONSTRAINTS || (elements.CONSTRAINTS = {}));
        var CONSTRAINTS = elements.CONSTRAINTS;
        var UITranslatorBase = (function () {
            function UITranslatorBase(type, label) {
                this.display = true;
                this.type = type;
                this.label = label;
            }
            return UITranslatorBase;
        })();
        elements.UITranslatorBase = UITranslatorBase;
        var UINumber = (function (_super) {
            __extends(UINumber, _super);
            function UINumber(label, multiplier, maxSigFigs, constraint, modOrMax, minimum) {
                if (multiplier === void 0) { multiplier = 1; }
                if (maxSigFigs === void 0) { maxSigFigs = 3; }
                if (constraint === void 0) { constraint = CONSTRAINTS.NONE; }
                if (modOrMax === void 0) { modOrMax = cKit.constants.TWOPI; }
                if (minimum === void 0) { minimum = 0; }
                _super.call(this, TYPES.NUMBER, label);
                this.multiplier = multiplier;
                this.maxSigFigs = maxSigFigs;
                this.constraint = constraint;
                this.minimum = minimum;
                this.modOrMax = modOrMax;
            }
            UINumber.prototype.export = function (value) {
                return _u.reduceSig(value * this.multiplier, this.maxSigFigs);
            };
            UINumber.prototype.import = function (value) {
                if (this.constraint) {
                    if (this.constraint === CONSTRAINTS.MINMAX) {
                        return Math.max(Math.min(this.modOrMax, value / this.multiplier), this.minimum);
                    }
                    else {
                        value = (value / this.multiplier) % this.modOrMax;
                        if (value < 0) {
                            value += this.modOrMax;
                        }
                        return value;
                    }
                }
                else {
                    return value / this.multiplier;
                }
            };
            return UINumber;
        })(UITranslatorBase);
        elements.UINumber = UINumber;
        (function (UIStringContraints) {
            UIStringContraints[UIStringContraints["NONE"] = 0] = "NONE";
            UIStringContraints[UIStringContraints["LIST"] = 1] = "LIST";
        })(elements.UIStringContraints || (elements.UIStringContraints = {}));
        var UIStringContraints = elements.UIStringContraints;
        var UIString = (function (_super) {
            __extends(UIString, _super);
            function UIString(label, constraint, possibleValues) {
                if (constraint === void 0) { constraint = UIStringContraints.NONE; }
                if (possibleValues === void 0) { possibleValues = []; }
                _super.call(this, TYPES.STRING, label);
                this.constraint = constraint;
                this.possibleValues = possibleValues;
            }
            UIString.prototype.export = function (value) {
                return value;
            };
            UIString.prototype.import = function (value) {
                if (this.constraint === UIStringContraints.NONE) {
                    return value;
                }
                else {
                    if (this.possibleValues.indexOf(value) !== -1) {
                        return value;
                    }
                    else {
                        return this.possibleValues[0];
                    }
                }
            };
            return UIString;
        })(UITranslatorBase);
        elements.UIString = UIString;
        var UIVector = (function (_super) {
            __extends(UIVector, _super);
            function UIVector(label, multiplier, maxSigFigs, constraint, modOrMax, minimum) {
                if (multiplier === void 0) { multiplier = 1; }
                if (maxSigFigs === void 0) { maxSigFigs = 3; }
                if (constraint === void 0) { constraint = CONSTRAINTS.NONE; }
                if (modOrMax === void 0) { modOrMax = 0; }
                if (minimum === void 0) { minimum = 0; }
                _super.call(this, TYPES.VECTOR, label);
                this.multiplier = multiplier;
                this.maxSigFigs = maxSigFigs;
                this.constraint = constraint;
                this.modOrMax = modOrMax;
                this.minimum = minimum;
            }
            UIVector.prototype.export = function (vector) {
                return new elements.Vector(_u.reduceSig(vector.y * this.multiplier, this.maxSigFigs), _u.reduceSig(vector.y * this.multiplier, this.maxSigFigs));
            };
            UIVector.prototype.import = function (vector) {
                if (this.constraint) {
                    if (this.constraint === CONSTRAINTS.MINMAX) {
                        return new elements.Vector(Math.max(Math.min(this.modOrMax, vector.x / this.multiplier), this.minimum), Math.max(Math.min(this.modOrMax, vector.y / this.multiplier), this.minimum));
                    }
                    else {
                        // Not really sure if we might need this (yet) so I'm not writing it
                        // Mod vectors could be interesting for infinite roll across the canvas
                        return new elements.Vector(0, 0);
                    }
                }
                else {
                    return new elements.Vector(vector.x / this.multiplier, vector.y / this.multiplier);
                }
            };
            return UIVector;
        })(UITranslatorBase);
        elements.UIVector = UIVector;
    })(elements = cKit.elements || (cKit.elements = {}));
})(cKit || (cKit = {}));
var cKit;
(function (cKit) {
    var elements;
    (function (elements) {
        var ObjState = (function () {
            function ObjState(id, states) {
                this.id = id;
                this.states = states;
            }
            return ObjState;
        })();
        elements.ObjState = ObjState;
    })(elements = cKit.elements || (cKit.elements = {}));
})(cKit || (cKit = {}));
var cKit;
(function (cKit) {
    var events;
    (function (events) {
        var elements = cKit.elements;
        var _u = cKit.util;
        var Vector = elements.Vector;
        // View control point type
        (function (controlModes) {
            controlModes[controlModes["EDIT_SHAPE"] = 0] = "EDIT_SHAPE";
            controlModes[controlModes["EDIT_TRANSFORM"] = 1] = "EDIT_TRANSFORM";
            controlModes[controlModes["EDIT_NONE"] = 2] = "EDIT_NONE";
        })(events.controlModes || (events.controlModes = {}));
        var controlModes = events.controlModes;
        // EVENT BINDING
        // Consider moving out of CanvasKit scope because they execute in global
        function bindEvents() {
            var kit = cKit.kit;
            /* TODO (WIP for touch devices) */
            kit.canvas.addEventListener('touchstart', startDrag.bind(kit), false);
            kit.canvas.addEventListener('touchend', endDrag.bind(kit), false);
            kit.canvas.addEventListener('touchmove', move.bind(kit), false);
            // Mouse Canvas Events
            kit.canvas.addEventListener('mousedown', startDrag.bind(kit), false);
            kit.canvas.addEventListener('mouseup', endDrag.bind(kit), false);
            kit.canvas.addEventListener('mousemove', move.bind(kit), false);
        }
        events.bindEvents = bindEvents;
        ;
        /*
         * All this function should to is toggle inDrag to true
         * if a control point has been clicked
         */
        function startDrag(event) {
            var kit = this;
            if (kit.stage.animationMode === true) {
                return;
            }
            var position = _u.getPosition(event, kit.canvas);
            var object = kit.resourceList.objects[kit.selectedObject];
            if (kit.editMode === controlModes.EDIT_SHAPE) {
                var actualPosition = object.reverseTransformPoint(position);
                object.cPoints.forEach(function (thisPoint) {
                    if (thisPoint.mouseInside(actualPosition, object.scale)) {
                        thisPoint.inDrag = true;
                        kit.dragMode = true;
                        kit.redraw();
                    }
                });
            }
            else if (kit.editMode === controlModes.EDIT_TRANSFORM) {
                object.transformPoints.forEach(function (thisPoint, index) {
                    var positionInsideObject;
                    if (index !== 2) {
                        positionInsideObject = new Vector(position.x - object.center.x, position.y - object.center.y);
                        positionInsideObject.rotate(-object.rotation);
                    }
                    else {
                        // Scale control point is not rotated
                        object.lastScale = object.scale;
                        positionInsideObject = new Vector(position.x - object.center.x, position.y - object.center.y);
                    }
                    if (thisPoint.mouseInside(positionInsideObject, object.scale)) {
                        thisPoint.inDrag = true;
                        kit.dragMode = true;
                        kit.redraw();
                    }
                });
            }
        }
        function endDrag(event) {
            var kit = this;
            if (kit.stage.animationMode === true) {
                kit.dragMode = false;
                return;
            }
            kit.dragMode = false;
            // kit.position = _u.getPosition(event, kit.canvas);
            var object = kit.resourceList.objects[kit.selectedObject];
            if (kit.editMode === controlModes.EDIT_SHAPE) {
                _u.each(object.cPoints, function (thisPoint) {
                    if (thisPoint.inDrag === true) {
                        thisPoint.inDrag = false;
                        kit.redraw();
                    }
                });
            }
            else if (kit.editMode === controlModes.EDIT_TRANSFORM) {
                object.transformPoints.forEach(function (thisPoint, index) {
                    if (thisPoint.inDrag === true) {
                        thisPoint.inDrag = false;
                        if (index === 2) {
                            thisPoint.x = object.scaleDistance;
                        }
                        kit.redraw();
                    }
                });
            }
            /* TODO  this is super lazy mode on updating keyFrames =/ */
            kit.stage.storeState();
            kit.digest();
        }
        ;
        function move(event) {
            var kit = this;
            if (kit.dragMode !== true || kit.stage.animationMode === true) {
                return;
            }
            var object = kit.resourceList.objects[kit.selectedObject];
            var position = _u.getPosition(event, kit.canvas);
            if (kit.editMode === controlModes.EDIT_SHAPE) {
                object.cPoints.forEach(function (thisPoint, index) {
                    // Only drag one control point at a time
                    if (thisPoint.inDrag) {
                        if (object.type === 'imageLayer' && index === 4) {
                            object.center = position;
                        }
                        else {
                            var actualPosition = object.reverseTransformPoint(position);
                            object.setControlPointFromUI(index, actualPosition);
                        }
                        kit.redraw();
                        return;
                    }
                });
            }
            else if (kit.editMode === controlModes.EDIT_TRANSFORM) {
                object.transformPoints.forEach(function (thisPoint, index) {
                    // Expectation is one CPoint inDrag at a time
                    if (thisPoint.inDrag) {
                        object.setTransformPointFromUI(index, position);
                        kit.redraw();
                        return;
                    }
                });
            }
        }
        ;
    })(events = cKit.events || (cKit.events = {}));
})(cKit || (cKit = {}));
var cKit;
(function (cKit) {
    var objects;
    (function (objects_1) {
        var elements = cKit.elements;
        var Vector = elements.Vector;
        var CPoint = elements.CPoint;
        var UINumber = elements.UINumber;
        var UIVector = elements.UIVector;
        var UIString = elements.UIString;
        var CONSTRAINTS = elements.CONSTRAINTS;
        var _u = cKit.util;
        var baseObject = (function () {
            function baseObject(kit) {
                this.rotation = 0;
                this.scale = 1;
                this.fillImage = null;
                this.lineColor = cKit.constants.LINE_COLOR;
                this.kit = kit;
                this.center = new Vector(kit.midWidth, kit.midHeight);
                this.uiTranslators = {
                    rotation: new UINumber('Rotation', 180 / Math.PI, 2, CONSTRAINTS.MOD, cKit.constants.TWOPI),
                    scale: new UINumber('Scale', 1, 2, CONSTRAINTS.MINMAX, 9999, 0),
                    center: new UIVector('Center', 1, 3, CONSTRAINTS.NONE),
                    lineColor: new UIString('Line Color')
                };
                this.uiTranslators['center'].display = false;
                this.uiTranslators['lineColor'].display = false;
                this.animationAttributes = ['rotation', 'scale', 'center', 'lineColor'];
                this.stateAttributes = ['fillImage', 'id'];
                this.type = 'generic';
                // Transform variables
                this.transformPoints = [];
                this.rotation = 0;
                this.center = new Vector(kit.midWidth, kit.midHeight);
                this.scaleDistance = this.kit.midWidth / 2;
                this.scale = 1;
                this.lastScale = 1;
                /* TODO frax this casting */
                this.fillImage = {};
                // Main Control Points
                this.cPoints = [];
                var rotatePoint = new CPoint(0, -this.kit.midHeight / 2.5);
                rotatePoint.rotate(this.rotation);
                this.transformPoints = [new CPoint(0, 0), rotatePoint, new CPoint(this.scaleDistance, 0)];
            }
            /* just set basics, no object to draw */
            baseObject.prototype.draw = function () {
                this.kit.context.strokeStyle = '#' + this.lineColor;
            };
            /* Get and Set UIAttribute are for the interface */
            baseObject.prototype.getUIAttribute = function (target) {
                if (target === 'fillImage') {
                    return this.kit.resourceList.images.indexOf(this.fillImage);
                }
                else if (_u.exists(this.uiTranslators[target])) {
                    return this.uiTranslators[target].export(this[target]);
                }
                else {
                    return '';
                }
            };
            baseObject.prototype.setUIAttribute = function (target, newValue) {
                var thisTarget = this.uiTranslators[target];
                if (_u.exists(thisTarget)) {
                    var newValue = thisTarget.import(newValue);
                    this[target] = newValue;
                    return newValue;
                }
            };
            baseObject.prototype.getControlPoint = function (index) {
                return new Vector(this.cPoints[index].x, this.cPoints[index].y);
            };
            /*getControlPoints() {
              var self = this;
              return this.cPoints.map(function(cp, index){return self.getControlPoint(index)});
            }*/
            baseObject.prototype.setControlPoints = function (newControlPoints) {
                for (var i = 0; i < newControlPoints.length; i++) {
                    this.cPoints[i].x = newControlPoints[i].x;
                    this.cPoints[i].y = newControlPoints[i].y;
                }
            };
            /* This needs to be overridden in order to update the actual geometry */
            baseObject.prototype.setControlPointFromUI = function (index, point) {
                this.cPoints[index].x = _u.reduceSig(point.x, cKit.constants.MAX_CP_SIGS);
                this.cPoints[index].y = _u.reduceSig(point.y, cKit.constants.MAX_CP_SIGS);
            };
            baseObject.prototype.setTransformPointFromUI = function (index, point) {
                // Center tranform point does not move
                if (index === 0) {
                    this.center = new Vector(_u.reduceSig(point.x, cKit.constants.MAX_CP_SIGS), _u.reduceSig(point.y, cKit.constants.MAX_CP_SIGS));
                }
                else if (index === 1) {
                    var angleVector = new Vector(point.x - this.center.x, point.y - this.center.y);
                    this.rotation = angleVector.getRadians(Vector.zeroVector());
                }
                else if (index === 2) {
                    this.scale = this.lastScale * (point.x - this.center.x) / this.scaleDistance;
                    this.transformPoints[index].x = point.x - this.center.x;
                }
            };
            baseObject.prototype.setItemFromUI = function (target, newValue) {
                var translator = this.uiTranslators[target];
                if (_u.exists(this.uiTranslators)) {
                    this[target] = translator.import(newValue);
                }
            };
            /*
            getState(target:string){
              return this[target];
            }*/
            baseObject.prototype.drawControlPoints = function () {
                this.kit.context.save();
                // Using custom transform to translate without scaling control point size
                this.kit.context.transform(1, 0, 0, 1, this.center.x, this.center.y);
                var obj = this;
                this.cPoints.forEach(function (controlPoint, index) {
                    var newPoint = new CPoint(controlPoint.x * obj.scale, controlPoint.y * obj.scale, controlPoint.inDrag);
                    newPoint.draw(index, obj.kit.context, obj.rotation, obj.kit.editMode);
                });
                this.kit.context.restore();
            };
            baseObject.prototype.drawTransformPoints = function () {
                this.kit.context.save();
                this.translateTranform();
                this.transformPoints[0].draw(0, this.kit.context, this.rotation, this.kit.editMode);
                this.transformPoints[1].draw(1, this.kit.context, this.rotation, this.kit.editMode);
                this.transformPoints[2].draw(2, this.kit.context, this.rotation, this.kit.editMode);
                this.kit.context.restore();
            };
            baseObject.prototype.setScale = function (xPosition) {
                this.scale = this.lastScale * xPosition / this.scaleDistance;
            };
            /*
             * Rotate, Scale and Transform Context
             *  (RST)
             *  TODO - WIP moving transforms into a state object
             *  this object could be used in object groups also
             */
            baseObject.prototype.transform = function () {
                this.kit.context.transform(this.scale, 0, 0, this.scale, this.center.x, this.center.y);
                this.kit.context.rotate(this.rotation);
            };
            /*
             * Rotate, Scale and Transform Context
             *  (RST)
             */
            baseObject.prototype.translateTranform = function () {
                this.kit.context.transform(1, 0, 0, 1, this.center.x, this.center.y);
            };
            /*
             *  Use a reverse transform to find actual point
             *  For finding a click in the object space (TSR)
             */
            baseObject.prototype.reverseTransformPoint = function (point) {
                // TODO scale and rotate inclusion
                var actual = new Vector(point.x - this.center.x, point.y - this.center.y);
                actual.x /= this.scale;
                actual.y /= this.scale;
                actual.rotate(-this.rotation);
                return actual;
            };
            baseObject.prototype.exportControlPoints = function () {
                var cps = [];
                this.cPoints.forEach(function (cp) { return cps.push(cp.clone()); });
                return cps;
            };
            baseObject.prototype.exportAnimationAttributes = function () {
                var _this = this;
                var attrs = {};
                this.animationAttributes.forEach(function (item) {
                    if (item === 'center') {
                        attrs[item] = _this['center'].clone();
                    }
                    else {
                        attrs[item] = _this[item];
                    }
                });
                return attrs;
            };
            baseObject.prototype.getStates = function () {
                var _this = this;
                var attributes = {};
                this.stateAttributes.forEach(function (item) {
                    if (item === 'fillImage') {
                        attributes[item] = _this.kit.resourceList.images.indexOf(_this[item]);
                    }
                    else {
                        attributes[item] = _this[item];
                    }
                });
                return attributes;
            };
            baseObject.prototype.exportObject = function () {
                return new elements.ObjState(this.type, this.getStates());
            };
            baseObject.prototype.exportFrame = function () {
                return new elements.KeyState(this.exportControlPoints(), this.exportAnimationAttributes());
            };
            return baseObject;
        })();
        objects_1.baseObject = baseObject;
    })(objects = cKit.objects || (cKit.objects = {}));
})(cKit || (cKit = {}));
var cKit;
(function (cKit) {
    var objects;
    (function (objects) {
        var constants = cKit.constants;
        var _u = cKit.util;
        var elements = cKit.elements;
        var Vector = elements.Vector;
        var CPoint = elements.CPoint;
        /* objPoint is a reference to the point inside the pedal */
        var PetalFlower = (function (_super) {
            __extends(PetalFlower, _super);
            function PetalFlower(kit, petals, accent, innerRadius, outerRadius) {
                if (petals === void 0) { petals = 6; }
                if (accent === void 0) { accent = 1; }
                if (innerRadius === void 0) { innerRadius = -1; }
                if (outerRadius === void 0) { outerRadius = -1; }
                _super.call(this, kit);
                if (innerRadius === -1) {
                    innerRadius = kit.canvasWidth * constants.DEFAULT_INNER_RADIUS_SCALAR;
                }
                if (outerRadius === -1) {
                    outerRadius = kit.canvasWidth * constants.DEFAULT_OUTER_RADIUS_SCALAR;
                }
                this.uiTranslators['petals'] = new elements.UINumber('Petals', 1, 0, elements.CONSTRAINTS.MINMAX, 300, 1);
                this.uiTranslators['accent'] = new elements.UINumber('Accent', 1, 3, elements.CONSTRAINTS.MINMAX, petals, 0);
                this.stateAttributes = this.stateAttributes.concat(['petals', 'accent']);
                this.type = 'petalFlower';
                // Instantiation Variables
                this.petals = petals;
                this.accent = accent;
                this.increment = 2 * Math.PI / petals;
                this.firstInnerAngle = -0.5 * this.increment * this.accent;
                // TODO ... why did I write this into the fill image algorithm?
                this.maxRadius = Math.sqrt(kit.midWidth * kit.midWidth + kit.midHeight * kit.midHeight);
                var cp, cp2, cp3, cp4;
                cp = Vector.getPolarPoint(innerRadius, this.firstInnerAngle);
                var secondCPRadius = (outerRadius - innerRadius) / 2 + innerRadius;
                cp2 = Vector.getPolarPoint(secondCPRadius, this.firstInnerAngle * 3);
                cp3 = Vector.getPolarPoint(outerRadius, 0);
                cp3.x = cp3.x - 40;
                cp4 = Vector.getPolarPoint(outerRadius, 0);
                this.firstPetal = [];
                this.firstPetal.push(cp);
                this.cPoints.push(new CPoint(cp.x, cp.y));
                this.cPoints.push(new CPoint(cp2.x, cp2.y));
                this.firstPetal.push(cp2);
                this.cPoints.push(new CPoint(cp3.x, cp3.y));
                this.firstPetal.push(cp3);
                this.cPoints.push(new CPoint(cp4.x, cp4.y));
                this.firstPetal.push(cp4);
                /* Reflect Curve about the y axis to create the first Petal */
                this.firstPetal.push(new Vector(-cp3.x, cp3.y));
                this.firstPetal.push(new Vector(-cp2.x, cp2.y));
                this.firstPetal.push(new Vector(-cp.x, cp.y));
                /*
                 * Use first Petal as a template for the rest of the Petals
                 * First Petal is drawn at each radial based on PetalCount rotation
                 */
                this.createPetals();
            }
            /* override (rotation in draw) */
            PetalFlower.prototype.transform = function () {
                this.kit.context.transform(this.scale, 0, 0, this.scale, this.center.x, this.center.y);
            };
            PetalFlower.prototype.draw = function () {
                _super.prototype.draw.call(this);
                var index = 0;
                var flower = this;
                var kit = this.kit;
                kit.context.beginPath();
                _u.each(this.allPetals, function (Petal) {
                    /*  Highlight specific curve needs to be redone after fillImage func added
                     *  Line should go over the image clip, may need two loops
                     if(index === 0 && kit.toggleCurveColor && !kit.fillImageExists) {
                     kit.context.strokeStyle = '#00ff00';
                     kit.context.save();
                     }  */
                    if (flower.rotation === 0) {
                        kit.context.moveTo(Petal[0].x, Petal[0].y);
                        kit.context.bezierCurveTo(Petal[1].x, Petal[1].y, Petal[2].x, Petal[2].y, Petal[3].x, Petal[3].y);
                        kit.context.bezierCurveTo(Petal[4].x, Petal[4].y, Petal[5].x, Petal[5].y, Petal[6].x, Petal[6].y);
                        kit.context.moveTo(Petal[6].x, Petal[6].y);
                        kit.context.lineTo(Petal[0].x, Petal[0].y);
                    }
                    else {
                        var rotated = [];
                        // TODO new set in rotate necessary?
                        // Create a new set of vectors rotating this petal to the correct position about flower center
                        for (var i = 0; i < Petal.length; i++) {
                            rotated.push(Petal[i].rotateIntoNewVector(flower.rotation));
                        }
                        kit.context.moveTo(rotated[0].x, rotated[0].y);
                        kit.context.bezierCurveTo(rotated[1].x, rotated[1].y, rotated[2].x, rotated[2].y, rotated[3].x, rotated[3].y);
                        kit.context.bezierCurveTo(rotated[4].x, rotated[4].y, rotated[5].x, rotated[5].y, rotated[6].x, rotated[6].y);
                        kit.context.moveTo(rotated[6].x, rotated[6].y);
                        kit.context.lineTo(rotated[0].x, rotated[0].y);
                    }
                    // Could setup different fills for each layer and flower
                    /* if(index === 0 && kit.toggleCurveColor && !kit.fillImageExists) {
                     kit.context.closePath();
                     kit.context.stroke();
                     kit.context.strokeStyle = kit.lineColor;
                     kit.context.beginPath();
                     console.log(kit.lineColor);
                     } */
                    index++;
                });
                kit.context.closePath();
                if (this.fillImage && this.fillImage.loaded) {
                    kit.context.globalCompositeOperation = kit.stage.stageConfig.sourceMode;
                    kit.context.clip();
                    this.drawPetalFill(new elements.Transform(this.center, this.scale, this.rotation));
                }
                else {
                    // Restore composition mode in case fill image has been removed
                    kit.context.globalCompositeOperation = 'source-over';
                    kit.context.stroke();
                }
            };
            PetalFlower.prototype.drawPetalFill = function (transform) {
                var kit = this.kit;
                var sweepFrom = Vector.getPolarPoint(this.maxRadius, this.firstInnerAngle / this.accent + transform.rotation);
                var sweepTo = Vector.getPolarPoint(this.maxRadius, transform.rotation);
                var temp_canvas = document.createElement('canvas');
                temp_canvas.width = kit.canvasWidth;
                temp_canvas.height = kit.canvasHeight;
                var tempContext = temp_canvas.getContext('2d');
                // Draw first half of first cone
                tempContext.setTransform(1, 0, 0, 1, this.center.x, this.center.y);
                tempContext.save();
                tempContext.beginPath();
                tempContext.moveTo(0, 0);
                tempContext.lineTo(sweepFrom.x, sweepFrom.y);
                tempContext.lineTo(sweepTo.x, sweepTo.y);
                tempContext.closePath();
                tempContext.clip();
                tempContext.drawImage(this.fillImage.image, -kit.midWidth, -kit.midHeight, kit.canvasWidth, kit.canvasHeight);
                tempContext.stroke();
                tempContext.restore();
                // Draw the other half of the first cone by reflecting about rotation angled line
                tempContext.save();
                var reflectionMatrix = Vector.reflectMatrix(transform.rotation);
                tempContext.setTransform(reflectionMatrix[0], reflectionMatrix[1], reflectionMatrix[2], reflectionMatrix[3], this.center.x, this.center.y);
                tempContext.beginPath();
                tempContext.moveTo(0, 0);
                tempContext.lineTo(sweepFrom.x, sweepFrom.y);
                tempContext.lineTo(sweepTo.x, sweepTo.y);
                tempContext.closePath();
                tempContext.clip();
                tempContext.drawImage(this.fillImage.image, -kit.midWidth, -kit.midHeight, kit.canvasWidth, kit.canvasHeight);
                tempContext.stroke();
                tempContext.restore();
                // Copy first petal onto main canvas over every section
                kit.context.save();
                kit.context.translate(-this.center.x, -this.center.y);
                for (var i = 0; i < this.petals; i++) {
                    var matrix = _u.getRotationMatrix(constants.TWOPI / this.petals);
                    kit.context.transform(matrix[0], matrix[1], matrix[2], matrix[3], this.center.x, this.center.y);
                    kit.context.translate(-this.center.x, -this.center.y);
                    kit.context.drawImage(temp_canvas, 0, 0);
                }
                kit.context.restore();
            };
            /* Use first Petal as a template for the rest of the Petals */
            PetalFlower.prototype.createPetals = function () {
                this.allPetals = [];
                this.allPetals.push(this.firstPetal);
                for (var i = 1; i < this.petals; i++) {
                    var newPetal = [];
                    var thisAngle = i * this.increment;
                    _u.each(this.firstPetal, function (point, index) {
                        newPetal.push(point.rotateIntoNewVector(thisAngle));
                    });
                    this.allPetals.push(newPetal);
                }
            };
            PetalFlower.prototype.updateIncrement = function () {
                this.increment = 2 * Math.PI / this.petals;
            };
            /*
             * Update the first Petal based on a control point change.
             * Recreate all the other Petals based on first Petal.
             * Should only be called from mouse events, not effecient for keyframe changes
             */
            PetalFlower.prototype.updatePetal = function (index, newPoint) {
                if (index === 3) {
                    newPoint.x = 0;
                    this.firstPetal[3].x = 0;
                    this.firstPetal[index].y = newPoint.y;
                }
                else if (index === 0) {
                    var innerRadius = Vector.zeroVector().distance(newPoint);
                    newPoint = Vector.getPolarPoint(innerRadius, this.firstInnerAngle);
                    newPoint.x = _u.reduceSig(newPoint.x, constants.MAX_CP_SIGS);
                    newPoint.y = _u.reduceSig(newPoint.y, constants.MAX_CP_SIGS);
                    this.firstPetal[0].x = newPoint.x;
                    this.firstPetal[0].y = newPoint.y;
                    this.firstPetal[6].x = -newPoint.x;
                    this.firstPetal[6].y = newPoint.y;
                }
                else {
                    this.firstPetal[index].x = newPoint.x;
                    this.firstPetal[6 - index].x = -newPoint.x;
                    this.firstPetal[6 - index].y = newPoint.y;
                    this.firstPetal[index].y = newPoint.y;
                }
                /* update control point with constrained values */
                this.cPoints[index].x = newPoint.x;
                this.cPoints[index].y = newPoint.y;
            };
            PetalFlower.prototype.rebuild = function () {
                this.updateFirstPetal();
                /* Create the rest of the Petals by copying  and rotating the first Petal */
                this.createPetals();
            };
            /*
             * Update the first Petal based on a transform change.
             * Recreate all the other Petals based on first Petal.
             *
             * .... i was building a transform object at one point.. mebbee later
             */
            /*updateTransform(index, newPoint) {
              var newCoords = new Vector(newPoint.x, newPoint.y);
              this.transformPoints[index].x = newCoords.x;
              this.transformPoints[index].y = newCoords.y;
            }*/
            /*resetScalePoint(xPosition) {
              this.transformPoints[2].x = this.scaleDistance;
            }*/
            /*
             * Modify flower for a set of control points
             * Called before createPetals
             * Used when loading a keyframe
             */
            PetalFlower.prototype.updateFirstPetal = function () {
                //this.firstPetal = [];
                this.firstPetal[0].x = this.cPoints[0].x;
                this.firstPetal[0].y = this.cPoints[0].y;
                this.firstPetal[1].x = this.cPoints[1].x;
                this.firstPetal[1].y = this.cPoints[1].y;
                this.firstPetal[2].x = this.cPoints[2].x;
                this.firstPetal[2].y = this.cPoints[2].y;
                this.firstPetal[3].x = this.cPoints[3].x;
                this.firstPetal[3].y = this.cPoints[3].y;
                /* Reflect Curve about the y axis to create the first Petal */
                this.firstPetal[4].x = -this.cPoints[2].x;
                this.firstPetal[4].y = this.cPoints[2].y;
                this.firstPetal[5].x = -this.cPoints[1].x;
                this.firstPetal[5].y = this.cPoints[1].y;
                this.firstPetal[6].x = -this.cPoints[0].x;
                this.firstPetal[6].y = this.cPoints[0].y;
            };
            /*
             * Allows center shape manipulation
             * scale should be between 0 and petalCount
             */
            PetalFlower.prototype.accentRadialPoint = function (centerScale) {
                this.accent = centerScale;
                this.increment = 2 * Math.PI / this.petals;
                this.firstInnerAngle = -0.5 * this.increment * centerScale;
                var kit = this.kit;
                var flower = this;
                _u.each(kit.stage.keyframes, function (keyFrame) {
                    var radius = Vector.zeroVector().distance(keyFrame.objStates[kit.selectedObject].cPStates[0]);
                    keyFrame.objStates[kit.selectedObject].cPStates[0] = Vector.getPolarPoint(radius, flower.firstInnerAngle);
                });
                this.updateRadialPoint();
                this.rebuild();
            };
            // Modify accent
            PetalFlower.prototype.updateRadialPoint = function () {
                this.updateIncrement();
                this.firstInnerAngle = -0.5 * this.increment * this.accent;
                var kit = this.kit;
                var self = this;
                kit.stage.keyframes.forEach(function (keyframe, index) {
                    var cP = keyframe.objStates[kit.selectedObject].cPStates[0];
                    var radius = cP.distance();
                    var newPosition = Vector.getPolarPoint(radius, self.firstInnerAngle);
                    cP.x = newPosition.x;
                    cP.y = newPosition.y;
                    if (kit.stage.segment === index) {
                        self.firstPetal[0].x = self.cPoints[0].x = cP.x;
                        self.firstPetal[0].y = self.cPoints[0].y = cP.y;
                    }
                });
            };
            /* These next three are the interface with external libs */
            PetalFlower.prototype.setUIAttribute = function (target, newValue) {
                if (this.hasOwnProperty(target)) {
                    if (target === 'petals') {
                        // default fix
                        var val = cKit.util.parseIntOrDefault(newValue, constants.DEFAULT_RAYS);
                        this.petals = val;
                        this.uiTranslators['accent'] = new elements.UINumber('Accent', 1, 3, elements.CONSTRAINTS.MINMAX, this.petals, 0);
                        this.updateIncrement();
                        this.updateRadialPoint();
                        this.rebuild();
                        return val;
                    }
                    else if (target === 'accent') {
                        var val = this.uiTranslators['accent'].import(cKit.util.parseIntOrDefault(newValue, 1));
                        this.accentRadialPoint(val);
                        return val;
                    }
                    else {
                        return _super.prototype.setUIAttribute.call(this, target, newValue);
                    }
                }
                return null;
            };
            PetalFlower.prototype.setControlPoints = function (newControlPoints) {
                for (var i = 0; i < newControlPoints.length; i++) {
                    this.updatePetal(i, newControlPoints[i]);
                }
                this.rebuild();
            };
            /* Used in Mouse Drag Operations */
            // this.kit.indexOf(this.cPoints, point)
            PetalFlower.prototype.setControlPointFromUI = function (index, newPoint) {
                //setSingleControlPoint(index, newPoint) {
                this.updatePetal(index, newPoint);
                this.rebuild();
            };
            PetalFlower.prototype.getControlPoint = function (index) {
                return new Vector(this.cPoints[index].x, this.cPoints[index].y);
            };
            return PetalFlower;
        })(objects.baseObject);
        objects.PetalFlower = PetalFlower;
    })(objects = cKit.objects || (cKit.objects = {}));
})(cKit || (cKit = {}));
;
var cKit;
(function (cKit) {
    var objects;
    (function (objects) {
        var Vector = cKit.elements.Vector;
        var elements = cKit.elements;
        var CPoint = elements.CPoint;
        /* objPoint is a reference to the point inside the pedal */
        var ImageLayer = (function (_super) {
            __extends(ImageLayer, _super);
            function ImageLayer(kit, imageResource) {
                if (imageResource === void 0) { imageResource = null; }
                _super.call(this, kit);
                this.type = 'imageLayer';
                if (imageResource) {
                    this.fillImage = imageResource;
                }
                var quarterHeight = this.kit.canvasHeight / 4;
                var quarterWidth = this.kit.canvasWidth / 4;
                this.cPoints.push(new CPoint(-quarterWidth, -quarterHeight), new CPoint(quarterWidth, -quarterHeight), new CPoint(quarterWidth, quarterHeight), new CPoint(-quarterWidth, quarterHeight));
            }
            ImageLayer.prototype.draw = function () {
                var kit = this.kit;
                kit.context.beginPath();
                var index = 0;
                this.cPoints.forEach(function (cP) {
                    if (!index) {
                        kit.context.moveTo(cP.x, cP.y);
                    }
                    else if (index < 4) {
                        kit.context.lineTo(cP.x, cP.y);
                    }
                    index++;
                });
                kit.context.closePath();
                kit.context.stroke();
                if (this.fillImage.loaded) {
                    kit.context.drawImage(this.fillImage.image, this.cPoints[0].x, this.cPoints[0].y, this.cPoints[1].x - this.cPoints[0].x, this.cPoints[2].y - this.cPoints[1].y);
                }
            };
            /*resetScalePoint(xPosition) {
              this.transformPoints[2].x = this.scaleDistance;
            }*/
            ImageLayer.prototype.setState = function (target, newValue) {
                if (target === "shapePoints") {
                    this.setControlPoints(newValue);
                }
                else {
                    this[target] = newValue;
                }
            };
            /* For the mouse drag event */
            ImageLayer.prototype.setControlPointFromUI = function (index, newPoint) {
                if (index !== 4) {
                    this.cPoints[index].x = newPoint.x;
                    this.cPoints[index].y = newPoint.y;
                    /* modify neighbor control points */
                    if (index % 2 == 0) {
                        this.cPoints[(index + 1) % 4].y = newPoint.y;
                        this.cPoints[(index + 3) % 4].x = newPoint.x;
                    }
                    else {
                        this.cPoints[(index + 1) % 4].x = newPoint.x;
                        this.cPoints[(index + 3) % 4].y = newPoint.y;
                    }
                    /* this bit could happen on a mouse enddrag event for efficiency */
                    var difVector = new Vector((this.cPoints[0].x + this.cPoints[1].x) / 2, (this.cPoints[1].y + this.cPoints[2].y) / 2);
                    this.center.x += difVector.x;
                    this.center.y += difVector.y;
                    this.cPoints.forEach(function (cP, index) {
                        if (index < 4) {
                            cP.x = cP.x - difVector.x;
                            cP.y = cP.y - difVector.y;
                        }
                    });
                }
            };
            return ImageLayer;
        })(objects.baseObject);
        objects.ImageLayer = ImageLayer;
    })(objects = cKit.objects || (cKit.objects = {}));
})(cKit || (cKit = {}));
;
var cKit;
(function (cKit) {
    var objects;
    (function (objects) {
        var elements = cKit.elements;
        var CPoint = elements.CPoint;
        /* objPoint is a reference to the point inside the pedal */
        var Text = (function (_super) {
            __extends(Text, _super);
            function Text(kit, text) {
                if (text === void 0) { text = ''; }
                _super.call(this, kit);
                this.type = 'textLayer';
                this.textAlign = 'left';
                this.text = text;
                this.fontSize = 16;
                this.uiTranslators['text'] = new elements.UIString('Text');
                this.uiTranslators['fontSize'] = new elements.UIString('Font Size');
                this.uiTranslators['textAlign'] = new elements.UIString('Alignment', elements.UIStringContraints.LIST, ['left', 'center', 'right', 'start', 'end']);
                this.center.x = this.kit.canvasHeight / 4;
                this.center.y = this.kit.canvasWidth / 4;
                this.cPoints.push(new CPoint(0, 0));
                this.animationAttributes = this.animationAttributes.concat(['text']);
                this.stateAttributes = this.stateAttributes.concat(['fontSize']);
            }
            Text.prototype.draw = function () {
                // super.draw();
                var kit = this.kit;
                var ctx = kit.context;
                //if(_u.exists(this.fillImage.loaded) && this.fillImage.loaded) {
                //ctx.drawImage(this.fillImage.image, this.cPoints[0].x, this.cPoints[0].y, this.cPoints[1].x-this.cPoints[0].x, this.cPoints[2].y - this.cPoints[1].y);
                // }
                ctx.font = this.fontSize + "px Arial";
                ctx.fillStyle = '#' + this.lineColor;
                ctx.textAlign = this.textAlign;
                //ctx.strokeText
                var margin;
                if (this.textAlign === 'left' || this.textAlign === 'start') {
                    margin = 15;
                }
                else if (this.textAlign === 'end' || this.textAlign === 'right') {
                    margin = -20;
                }
                else {
                    margin = 0;
                }
                ctx.fillText(this.text, this.cPoints[0].x + margin, this.cPoints[0].y + 5);
            };
            Text.prototype.setState = function (target, newValue) {
                if (target === "shapePoints") {
                    this.setControlPoints(newValue);
                }
                else {
                    this[target] = newValue;
                }
            };
            /* For the mouse drag event */
            Text.prototype.setControlPointFromUI = function (index, newPoint) {
                this.center.x += newPoint.x;
                this.center.y += newPoint.y;
            };
            return Text;
        })(objects.baseObject);
        objects.Text = Text;
    })(objects = cKit.objects || (cKit.objects = {}));
})(cKit || (cKit = {}));
;
var cKit;
(function (cKit) {
    var stage;
    (function (stage) {
        var objects = cKit.objects;
        var elements = cKit.elements;
        var _u = cKit.util;
        var ResourceList = (function () {
            function ResourceList(kit) {
                this.objects = [];
                this.images = [];
                this.kit = kit;
            }
            ResourceList.prototype.addImage = function (src, page, label) {
                if (page === void 0) { page = ''; }
                if (label === void 0) { label = ''; }
                if (label === '') {
                    label = src;
                }
                this.images.push(new elements.ImageResource(this.kit, src, page, label));
            };
            ResourceList.prototype.addObject = function (itemConfig) {
                if (itemConfig.id === 'petalFlower' || itemConfig.id === 'PETAL_FLOWER') {
                    this.objects.push(new objects.PetalFlower(this.kit, itemConfig.states.petals, itemConfig.states.accent));
                    if (_u.exists(itemConfig.states.fillImage) && itemConfig.states.fillImage != null) {
                        this.objects[this.objects.length - 1].fillImage = this.images[itemConfig.states.fillImage];
                    }
                }
                else if (itemConfig.id === 'imageLayer') {
                    if (_u.exists(itemConfig.index) && this.images.length > itemConfig.index) {
                        this.objects.push(new objects.ImageLayer(this.kit, this.images[itemConfig.index]));
                    }
                    else {
                        this.objects.push(new objects.ImageLayer(this.kit));
                    }
                }
                else if (itemConfig.id === 'textLayer') {
                    this.objects.push(new objects.Text(this.kit));
                }
                return this.objects.length - 1;
            };
            ResourceList.prototype.changeObjectType = function (selectedObject, itemType) {
                if (itemType === 'petalFlower') {
                    this.objects[selectedObject] = new objects.PetalFlower(this.kit);
                }
                else if (itemType === 'imageLayer') {
                    this.objects[selectedObject] = new objects.ImageLayer(this.kit);
                }
                else if (itemType === 'textLayer') {
                    this.objects[selectedObject] = new objects.Text(this.kit);
                }
            };
            ResourceList.prototype.removeObject = function (index) {
                this.objects.splice(index, 1);
            };
            ResourceList.prototype.clearResources = function () {
                this.objects = [];
                this.images = [];
            };
            ResourceList.prototype.export = function () {
                var imageList = [];
                for (var i = 0; i < this.images.length; i++) {
                    imageList.push(this.images[i].exportImage());
                }
                var objList = [];
                for (var i = 0; i < this.objects.length; i++) {
                    objList.push(this.objects[i].exportObject());
                }
                return { imageList: imageList, objectList: objList };
            };
            ResourceList.prototype.import = function (resources) {
                var self = this;
                this.clearResources();
                resources.imageList.forEach(function (item) { return self.addImage(item.src, item.page, item.label); });
                resources.objectList.forEach(function (item) { return self.addObject(item); });
            };
            return ResourceList;
        })();
        stage.ResourceList = ResourceList;
    })(stage = cKit.stage || (cKit.stage = {}));
})(cKit || (cKit = {}));
var cKit;
(function (cKit) {
    var stage;
    (function (stage_1) {
        var _u = cKit.util;
        var Vector = cKit.elements.Vector;
        var elements = cKit.elements;
        var Keyframe = cKit.elements.Keyframe;
        // LOOPING TYPE
        (function (sceneModes) {
            sceneModes[sceneModes["SCENE_NORMAL"] = 0] = "SCENE_NORMAL";
            sceneModes[sceneModes["SCENE_GIF"] = 1] = "SCENE_GIF";
        })(stage_1.sceneModes || (stage_1.sceneModes = {}));
        var sceneModes = stage_1.sceneModes;
        var Stage = (function () {
            function Stage(kit) {
                this.sceneMode = sceneModes.SCENE_NORMAL;
                /* is animating */
                this.animationMode = false;
                this.segment = 0;
                this.kit = kit;
                // this.keyframes = keyframeStage.keyFrames;
                this.keyframes = [new Keyframe(this.getState(), 0)];
                this.stageConfig = new StageConfig(kit);
            }
            /* Called to initiate play mode */
            Stage.prototype.init = function () {
                this.animationMode = true;
                this.segment = 0;
                this.loopStartTime = this.segmentStartTime = _u.msTime();
                if (this.stageConfig.pauseTime > 0) {
                    this.stageConfig.paused = true;
                }
                else {
                    this.stageConfig.paused = false;
                }
                cKit.kit.loadFrame();
            };
            Stage.prototype.clearStage = function () {
                this.stageConfig = new StageConfig(this.kit);
                this.segment = 0;
                // this.keyframeStage = new KeyframeStage();
                this.keyframes = [new Keyframe(this.getState(), 0)];
            };
            /* Main Scene Loop
             * New mode is timestamp based not delta based
             * Currently building keyframe gui where you can enable when keyframes effect
             * For now all objects must have a state which includes all transforms and control points
             * These are updated at each loop by interpolating between states of current and next keyframe
             * The processing time is removed from the callback time at the end of the loop
             * TODO --MVP create a new canvas which is set when callback happens
             */
            Stage.prototype.sceneLoop = function () {
                var kit = this.kit;
                /* Stop has been clicked since the last update or there isn't enough keyframes */
                if (!this.animationMode || this.keyframes.length < 2) {
                    kit.stopScene();
                    kit.digest();
                    return;
                }
                var cycleStartTime = _u.msTime();
                /* Gif creation does not rely on cycle speed */
                //if (this.sceneMode === sceneModes.SCENE_GIF) {
                //  this.delta += kit.gifFramerate;
                //}
                // pauseTime is the resting time at the first frame
                if (this.stageConfig.paused) {
                    var delta = cycleStartTime - this.loopStartTime;
                    if (delta >= this.stageConfig.pauseTime) {
                        this.stageConfig.paused = false;
                        /* For now if delay is longer than pauseTime it should proceed towards next click */
                        this.loopStartTime = this.segmentStartTime = cycleStartTime;
                    }
                }
                else {
                    var delta = cycleStartTime - this.segmentStartTime;
                    // Last segment animation, smooth animate or start over
                    if (this.segment === this.keyframes.length - 1) {
                        /* Restart animation back to keyframe 0 */
                        if (delta > this.stageConfig.seamlessAnimationTime) {
                            if (this.stageConfig.pauseTime > 0) {
                                this.stageConfig.paused = true;
                            }
                            this.loopStartTime = this.segmentStartTime = cycleStartTime;
                            this.segment = 0;
                            kit.loadFrame();
                        }
                        else {
                            this.updateSegment(delta, this.stageConfig.seamlessAnimationTime);
                            kit.redraw();
                        }
                    }
                    else {
                        /* Animation segment completion for segment which is not the last one */
                        if (delta > this.keyframes[this.segment + 1].timestamp - this.keyframes[this.segment].timestamp) {
                            if (this.segment === this.keyframes.length - 1) {
                                // If animate smoothly to first frame
                                if (this.stageConfig.seamlessAnimationTime > 0) {
                                    this.segment++;
                                    kit.loadFrame();
                                    //if (kit.sceneMode === constants.SCENE_GIF) {
                                    // this.delta = 0;
                                    // } else {
                                    this.segmentStartTime = cycleStartTime;
                                }
                                else {
                                    this.loopStartTime = this.segmentStartTime = cycleStartTime;
                                    this.segment = 0;
                                    kit.loadFrame();
                                    if (this.stageConfig.pauseTime > 0) {
                                        this.stageConfig.paused = true;
                                    }
                                }
                            }
                            else {
                                //if (kit.sceneMode === constants.SCENE_GIF) {
                                // // this.gifComplete();
                                // return;
                                // }
                                this.segment++;
                                kit.loadFrame();
                                this.loopStartTime = this.segmentStartTime = cycleStartTime;
                            }
                        }
                        else {
                            this.updateSegment(delta, this.keyframes[this.segment + 1].timestamp - this.keyframes[this.segment].timestamp);
                            kit.redraw();
                        }
                    }
                }
                // Update UI
                kit.digest();
                if (kit.stage.sceneMode === sceneModes.SCENE_GIF) {
                }
                else {
                    // TODO, do faster callbacks checking for frameDelay (smooth it)
                    var processTime = _u.msTime() - cycleStartTime;
                    if (this.stageConfig.frameRate < processTime) {
                        console.warn('Reduce framerate to improve animation smoothness');
                    }
                }
                setTimeout(function () {
                    cKit.kit.stage.sceneLoop();
                }, Math.max(0, this.stageConfig.frameRate - processTime));
            };
            Stage.prototype.updateSegment = function (delta, segmentLength) {
                var kit = this.kit;
                var self = this;
                var keyTo;
                var sig = delta / segmentLength;
                if (this.segment === this.keyframes.length - 1) {
                    keyTo = 0;
                }
                else {
                    keyTo = this.segment + 1;
                }
                for (var i = 0; i < this.keyframes[keyTo].objStates.length; i++) {
                    var newCPs = [];
                    var obFrom = self.keyframes[this.segment].objStates[i];
                    var obTo = self.keyframes[keyTo].objStates[i];
                    for (var j = 0; j < obTo.cPStates.length; j++) {
                        var newX = obFrom.cPStates[j].x * (1.0 - sig) + obTo.cPStates[j].x * sig;
                        var newY = obFrom.cPStates[j].y * (1.0 - sig) + obTo.cPStates[j].y * sig;
                        var cp = new Vector(newX, newY);
                        newCPs.push(cp);
                    }
                    var fromRotation = obFrom.attributes['rotation'];
                    var toRotation = obTo.attributes['rotation'];
                    var del = toRotation - fromRotation;
                    // Always rotate the shortest path to the new angle
                    if (Math.abs(del) > Math.PI) {
                        if (del < 0) {
                            toRotation += 2 * Math.PI;
                        }
                        else {
                            fromRotation += 2 * Math.PI;
                        }
                    }
                    var thisObj = kit.resourceList.objects[i];
                    thisObj.rotation = (fromRotation * (1 - sig) + toRotation * sig) % 360;
                    thisObj.center = new Vector(obFrom.attributes['center'].x * (1.0 - sig) + obTo.attributes['center'].x * sig, obFrom.attributes['center'].y * (1.0 - sig) + obTo.attributes['center'].y * sig);
                    thisObj.scale = obFrom.attributes['scale'] * (1.0 - sig) + obTo.attributes['scale'] * sig;
                    thisObj.setControlPoints(newCPs);
                    if (obFrom.attributes['lineColor'] !== obTo.attributes['lineColor']) {
                        var lCF = obFrom.attributes['lineColor'];
                        var lCT = obTo.attributes['lineColor'];
                        var newR = Math.floor((parseInt(lCF.substring(0, 2), 16) * (1.0 - sig) + parseInt(lCT.substring(0, 2), 16) * sig)).toString(16);
                        var newG = Math.floor((parseInt(lCF.substring(2, 4), 16) * (1.0 - sig) + parseInt(lCT.substring(2, 4), 16) * sig)).toString(16);
                        var newB = Math.floor((parseInt(lCF.substring(4, 6), 16) * (1.0 - sig) + parseInt(lCT.substring(4, 6), 16) * sig)).toString(16);
                        thisObj.lineColor = newR + newG + newB;
                    }
                }
            };
            Stage.prototype.exportKeyframes = function () {
                var frames = [];
                for (var i = 0; i < this.keyframes.length; i++) {
                    frames.push(this.keyframes[i].export());
                }
                return frames;
            };
            Stage.prototype.importFrames = function (frames) {
                this.keyframes = [];
                for (var i = 0; i < frames.length; i++) {
                    /* TODO -mvp */
                    //this.keyframes.push(new Keyframe(frames[i].stageStates.timestamp));
                    this.keyframes.push(new Keyframe(frames[i].objStates, frames[i].timestamp));
                }
                this.loadState(this.segment);
                this.kit.redraw();
            };
            /* Removed single segment animation at one point
             * needs to be redone now, probably won't add again
             * until there is a keyframe GUI
             * */
            /*
             // Segment Looping needs to be updated (disabled functionality)
             CanvasKit.prototype.segmentLoop = function() {
             if(!this.animationMof || this.segment === 0) {
             this.setState();
             this.digest();
             return;
             }
             var delta = _u.msTime()-this.loopStartTime-this.pauseTime;
             // before pause
             if( delta < 0) {
             if(this.setTime !== 0) {
             this.segment--;
             this.setState();
             this.segment++;
             this.setTime = 0;
             }
             // after segment end
             } else if(delta > this.keyFrames[this.segment].timing*1000) {
             if(delta > this.keyFrames[this.segment].timing*1000 + this.pauseTime) {
             this.loopStartTime = _u.msTime();
             this.segment--;
             this.setState();
             this.segment++;
             this.setTime = 0;
             } else if(this.setTime !== this.keyframes[this.segment].timing*1000){
             this.setState();
             this.setTime = this.keyframes[this.segment].timing*1000;
             this.setTime = this.keyframes[this.segment].timing*1000;
             }
             } else {
             var sig = delta/(this.keyframes[this.segment].timing*1000);
             var objIndex = 0;
             var CanvasKit = this;
             _u.each(this.keyframes[this.segment].obj, function(ob) {
             var index = 0;
             var newCps = [];
             _u.each(ob.shapePoints, function(cp) {
             var newX = CanvasKit.keyframes[CanvasKit.segment-1].obj[objIndex].shapePoints[index].x*(1.0-sig)+cp.x*sig;
             var newY = CanvasKit.keyframes[CanvasKit.segment-1].obj[objIndex].shapePoints[index].y*(1.0-sig)+cp.y*sig;
             var newPoint = new kit.CPoint(CanvasKit, newX, newY, kit.resourceList.objects[objIndex], index);
             newCps.push(newPoint);
             index++;
             });
        
             var newState = {
             shapePoints: newCps,
             rotation: 0,
             position: Vector.zeroVector(),
             scale: 0
             };
        
             var obFrom = kit.stage[CanvasKit.segment-1].obj[objIndex];
        
             var fromRotation = obFrom.rotation;
             var toRotation = ob.rotation;
             var del = toRotation-fromRotation;
             if( Math.abs(del) > 180 ) {
             if(del<0) {
             toRotation+=360;
             } else {
             fromRotation+=360;
             }
             }
             newState.rotation = (fromRotation*(1-sig)+toRotation*sig)%360;
             newState.position = Vector.create(obFrom.center.x*(1.0-sig)+ob.center.x*sig,
             obFrom.center.y*(1.0-sig)+ob.center.y*sig);
             newState.scale = obFrom.scale*(1.0-sig)+ob.scale*sig;
        
             kit.resourceList.objects[objIndex].setState(newState);
             objIndex++;
             });
             }
             setTimeout(function(){cKit.kit.segmentLoop()}, cKit.kit.frameDelay);
        
             }
        
             // This method is not currently in use
             CanvasKit.prototype.playSegment = function() {
             if(this.keyframes.length < 2) {
             return;
             }
             this.animationMode = true;
             if(this.segment !== 0) {
             this.segment--;
             }
             this.setState();
             this.segment++;
             this.setTime = 0;
             this.loopStartTime = new Date().getTime();
             this.segmentLoop();
             };
        
             */
            /* set single attribute state for a keyFrame (for field inputs/mouse drag changes) */
            Stage.prototype.setKeyframeAttribute = function (target, segment, objIndex, value) {
                var thisObject = this.keyframes[segment].objStates[objIndex];
                if (target === "cp") {
                }
                else {
                    thisObject.attributes[target] = value;
                }
            };
            /* Iterate through objects and retrieve states to put into a keyframe */
            /* Used for creation of new keyframes */
            Stage.prototype.getState = function () {
                var objStates = [];
                for (var i = 0; i < this.kit.resourceList.objects.length; i++) {
                    objStates.push(this.kit.resourceList.objects[i].exportFrame());
                }
                return objStates;
            };
            /* Iterate through objects and save states into the keyframe requested */
            /* Used for setting an existing keyframe */
            Stage.prototype.storeState = function () {
                var keyStates = [];
                for (var i = 0; i < cKit.kit.resourceList.objects.length; i++) {
                    keyStates.push(cKit.kit.resourceList.objects[i].exportFrame());
                }
                this.keyframes[this.segment] = new Keyframe(keyStates, this.keyframes[this.segment].timestamp);
            };
            /* Iterate through keyframes and save all keyframes to current state of object */
            Stage.prototype.clearStates = function (objectIndex) {
                if (objectIndex === void 0) { objectIndex = -1; }
                /* all objects  (not yet tested because it isn't used yet) */
                if (objectIndex === -1) {
                    for (var i = 0; i < this.keyframes.length; i++) {
                        for (var j = 0; j < this.kit.resourceList.objects.length; j++) {
                            this.keyframes[i].objStates[j] = this.kit.resourceList.objects[i].exportFrame();
                        }
                    }
                }
                else {
                    /* Specified object */
                    for (var i = 0; i < this.keyframes.length; i++) {
                        this.keyframes[i].objStates[objectIndex] = this.kit.resourceList.objects[objectIndex].exportFrame();
                    }
                }
            };
            Stage.prototype.loadState = function (segment) {
                if (segment >= this.keyframes.length) {
                    console.log('ERROR');
                    //this.newState();
                    return;
                }
                var theseStates = this.keyframes[segment].objStates;
                for (var i = 0; i < theseStates.length; i++) {
                    var objState = theseStates[i];
                    /* TODO setup a stage location for this method */
                    var ob = cKit.kit.resourceList.objects[i];
                    Object.keys(objState.attributes).forEach(function (key) {
                        ob[key] = objState.attributes[key];
                    });
                    ob.setControlPoints(objState.cPStates);
                }
                // this.resourceList.objects[i].setState(this.keyframes[this.segment].obj[i]);
            };
            Stage.prototype.newKeyframe = function () {
                var keyFrameTimestamp;
                if (this.keyframes.length == 0) {
                    keyFrameTimestamp = 0;
                }
                else if (this.keyframes.length === 1) {
                    keyFrameTimestamp = cKit.constants.DEFAULT_TIMING;
                }
                else {
                    keyFrameTimestamp = 2 * this.keyframes[this.keyframes.length - 1].timestamp - this.keyframes[this.keyframes.length - 2].timestamp;
                }
                this.keyframes.push(new elements.Keyframe(this.getState(), keyFrameTimestamp));
                /*  a deep copy of previous keyframe would be faster, but extra code...
                 *   UI interactions don't need to be efficient yet, only animation events
                 *   For now use objects state to create a new frame
                 * */
                // this.storeState(this.keyframes.length-1);
                this.storeState();
            };
            /*
             * So far the only use of these next two methods
             * is to get the timing for the animation UI panel
             *
             */
            Stage.prototype.getSegmentTiming = function () {
                if (this.segment === this.keyframes.length - 1) {
                    return this.stageConfig.getAttribute('seamlessAnimationTime');
                }
                else {
                    return this.stageConfig.uiTranslators['pauseTime'].export(this.keyframes[this.segment + 1].timestamp - this.keyframes[this.segment].timestamp);
                }
            };
            Stage.prototype.setSegmentTiming = function (value) {
                if (this.segment < this.keyframes.length - 1) {
                    var newDelta = this.stageConfig.uiTranslators['seamlessAnimationTime'].import(value);
                    var theDiff = newDelta - this.keyframes[this.segment + 1].timestamp + this.keyframes[this.segment].timestamp;
                    for (var seg = this.segment + 1; seg < this.keyframes.length; seg++) {
                        this.keyframes[seg].timestamp = this.keyframes[seg].timestamp + theDiff; // could be negative
                    }
                }
                else {
                    var newDelta = this.stageConfig.uiTranslators['pauseTime'].import(value);
                    this.stageConfig.seamlessAnimationTime = newDelta;
                }
            };
            return Stage;
        })();
        stage_1.Stage = Stage;
        var StageConfig = (function () {
            function StageConfig(kit) {
                /* delay @ start of full play cycle @ segment = 0 */
                this.pauseTime = cKit.constants.DEFAULT_PAUSETIME;
                /* if > 0, final keyframe is added which animates smoothly to initial keyframe */
                this.seamlessAnimationTime = cKit.constants.DEFAULT_TIMING;
                this.backgroundColor = cKit.constants.BACKGROUND_COLOR;
                this.backgroundAlpha = cKit.constants.BACKGROUND_ALPHA;
                this.lineColor = cKit.constants.LINE_COLOR;
                /* if frameDelay > iff time it took to process this loop wait the diff */
                this.frameRate = cKit.constants.DEFAULT_FRAME_RATE;
                this.kit = kit;
                this.uiTranslators = {};
                this.uiTranslators['frameRate'] =
                    new elements.UINumber('Frame Rate', 1, 0, elements.CONSTRAINTS.MINMAX, 10000, 0);
                this.uiTranslators['pauseTime'] =
                    new elements.UINumber('Initial Pause', .001, 2, elements.CONSTRAINTS.MINMAX, Number.MAX_VALUE, 0);
                this.uiTranslators['seamlessAnimationTime'] =
                    new elements.UINumber('Loop Close Time', .001, 2, elements.CONSTRAINTS.MINMAX, Number.MAX_VALUE, 0);
                this.uiTranslators['seamlessAnimationTime'].display = false;
                this.uiTranslators['sourceMode'] =
                    new elements.UIString('Source Mode', elements.UIStringContraints.LIST, _u.getKeys(cKit.constants.SOURCE_MODES));
                this.uiTranslators['sourceMode'].display = false;
                this.uiTranslators['lineColor'] = new elements.UIString('Line Color');
                this.uiTranslators['lineColor'].display = false;
                this.uiTranslators['backgroundColor'] = new elements.UIString('Background Color');
                this.uiTranslators['backgroundColor'].display = false;
                this.uiTranslators['backgroundAlpha'] = new elements.UINumber('Background Alpha', 1, 2, elements.CONSTRAINTS.MINMAX, 1, 0);
                this.sourceMode = cKit.constants.SOURCE_MODES[_u.getKeys(cKit.constants.SOURCE_MODES)[0]];
            }
            StageConfig.prototype.setAttribute = function (target, value) {
                if (target === 'backgroundImage') {
                    if (this.kit.resourceList.images.length > value)
                        this.backgroundImage = this.kit.resourceList.images[value];
                }
                else {
                    var translator = this.uiTranslators[target];
                    if (_u.exists(translator)) {
                        this[target] = translator.import(value);
                    }
                }
            };
            StageConfig.prototype.getAttribute = function (target) {
                if (target === 'backgroundImage') {
                    return this.kit.resourceList.images.indexOf(this.backgroundImage);
                }
                else {
                    var translator = this.uiTranslators[target];
                    if (_u.exists(translator)) {
                        return translator.export(this[target]);
                    }
                }
            };
            StageConfig.prototype.exportStageConfig = function () {
                var _this = this;
                var dic = {};
                Object.keys(this.uiTranslators).forEach(function (item) { return dic[item] = _this[item]; });
                dic.backgroundImage = this.kit.resourceList.images.indexOf(this.backgroundImage);
                return dic;
            };
            StageConfig.prototype.importStageConfig = function (config) {
                var _this = this;
                Object.keys(config).forEach(function (item) {
                    if (item === 'backgroundImage') {
                        _this.kit.resourceList.images[config.backgroundImage];
                    }
                    else {
                        _this[item] = config[item];
                    }
                });
                this.pauseTime = config.pauseTime;
                this.seamlessAnimationTime = config.seamlessAnimationTime;
                this.frameRate = config.frameRate;
                this.backgroundImage = this.kit.resourceList.images[config.backgroundImage];
            };
            return StageConfig;
        })();
        stage_1.StageConfig = StageConfig;
    })(stage = cKit.stage || (cKit.stage = {}));
})(cKit || (cKit = {}));
var cKit;
(function (cKit) {
    var constants = cKit.constants;
    var _u = cKit.util;
    var stage = cKit.stage;
    var events = cKit.events;
    var controlModes = events.controlModes;
    var CanvasKit = (function () {
        function CanvasKit() {
            // CANVAS SETTINGS
            this.canvasWidth = 1200;
            this.canvasHeight = 1200;
            this.midWidth = this.canvasWidth / 2;
            this.midHeight = this.canvasHeight / 2;
            /* control point edit mode */
            this.editMode = controlModes.EDIT_SHAPE;
            /* this just saves some time in drag events */
            this.dragMode = false;
            this.selectedObject = 0;
            /* is fieldFocus just used by the UI? */
            this.fieldFocus = false;
            this.highlightCurve = false;
            /* idf remember how this works */
            this.toggleCurveColor = false;
            /* Generic type needs to be changed in object inherited from baseObject
             * or you won't be able to create it from the interface
             */
            this.objectTypes = {
                petalFlower: "Petal Flower",
                imageLayer: "Image Layer",
                textLayer: "Text" //,
            };
            /* attaching for external libs to use if needed */
            this._u = _u;
            this.constants = cKit.constants;
            this.resourceList = new stage.ResourceList(this);
            this.stage = new stage.Stage(this);
            // Triggered after any event that needs to refresh UI (injected)
            this.digest = function () { };
            // Triggered after any event that needs to refresh color pickers UI (injected)
            this.colorFunc = function () { };
            // SETUP ID to all interface elements and setter methods in package
            this.settingShelf = { 'toggleCurveColor': this.toggleCurveColor, 'editMode': this.editMode };
            /* TODO init with constructor arguments / configure somehow? */
            this.defaultObject = { id: 'petalFlower', states: { petals: 6, accent: 1 } };
            this.initList = [
                //{ id: 'imageLayer', index:3 },
                this.defaultObject
            ];
            // TESTING
            this.debugMode = true;
        }
        // Setup Canvas Events, Initialize Objects and Context
        CanvasKit.prototype.initializeCanvas = function () {
            this.canvas = document.getElementById('canvas');
            this.context = this.canvas.getContext('2d');
            events.bindEvents();
            // Testing Code
            if (this.debugMode === true) {
                this.addImage("http://40.media.tumblr.com/77e9a0df41f5db7712ccf139339acb5c/tumblr_nlhm71CF0x1scud9jo1_400.jpg", "", "moon-linist");
                this.addImage("http://41.media.tumblr.com/82abe208a4b182f9c61081d5ea81fac3/tumblr_nlj3nlwf7f1scud9jo1_500.jpg", "", "white birch");
                this.addImage("http://41.media.tumblr.com/tumblr_m064ffyOst1qhex74o1_1280.png", "http://archillect.com/26139", "terminal");
                this.addImage("http://36.media.tumblr.com/4bfa43f56921aa1e903c94b2ca7d6c55/tumblr_mkl8i7kyVn1qdq671o1_1280.jpg", "http://archillect.com/26121", "tunnelin");
            }
            // Setup the scene
            this.build();
            this.redraw();
        };
        /* Tells AngularUI (or whatever UI) to check for updates */
        CanvasKit.prototype.setDigestFunc = function (newFunc) {
            this.digest = newFunc;
        };
        CanvasKit.prototype.setColorFunc = function (newFunc) {
            this.colorFunc = newFunc;
        };
        CanvasKit.prototype.build = function () {
            var kit = this;
            kit.initList.forEach(kit.resourceList.addObject.bind(kit.resourceList));
            this.stage.storeState();
        };
        // This function is used on every scene change
        CanvasKit.prototype.redraw = function () {
            // Clear the canvas
            this.context.save();
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.restore();
            // Reset stroke style in case of highlighted shape
            this.context.strokeStyle = '#' + this.stage.stageConfig.lineColor;
            if (this.stage.stageConfig.backgroundImage && this.stage.stageConfig.backgroundImage.loaded) {
                this.context.drawImage(this.stage.stageConfig.backgroundImage.image, 0, 0, this.canvasWidth, this.canvasHeight);
            }
            else {
                var rgb = _u.toRGB(this.stage.stageConfig.backgroundColor);
                this.context.fillStyle = 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', ' + this.stage.stageConfig.backgroundAlpha + ')';
                this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            }
            var kit = this;
            _u.each(this.resourceList.objects, function (item) {
                kit.context.save();
                item.transform();
                item.draw();
                kit.context.restore();
            });
            // Always draw active control points on top (last)
            this.context.strokeStyle = '#' + this.stage.stageConfig.lineColor;
            if (this.editMode === controlModes.EDIT_SHAPE) {
                this.resourceList.objects[kit.selectedObject].drawControlPoints();
            }
            if (this.editMode === controlModes.EDIT_TRANSFORM) {
                this.resourceList.objects[kit.selectedObject].drawTransformPoints();
            }
        };
        /* Methods for the UI
         * Redraw and Digest where needed
         *
         */
        CanvasKit.prototype.selectObject = function (obj) {
            obj = parseFloat(obj);
            if (this.selectedObject !== obj && obj < this.resourceList.objects.length
                && obj < constants.MAX_OBJECTS && obj >= 0) {
                this.selectedObject = obj;
                this.redraw();
                this.digest();
            }
        };
        CanvasKit.prototype.getSelectedObject = function () {
            return this.resourceList.objects[this.selectedObject];
        };
        CanvasKit.prototype.getSelectedObjectType = function () {
            return this.resourceList.objects[this.selectedObject].type;
        };
        CanvasKit.prototype.getObjectTypes = function () {
            return this.objectTypes;
        };
        CanvasKit.prototype.updateObjectType = function (objectType) {
            if (objectType !== this.resourceList.objects[this.selectedObject].type) {
                this.resourceList.changeObjectType(this.selectedObject, objectType);
                this.stage.clearStates(this.selectedObject);
                this.redraw();
            }
        };
        // Create a new object of the default type, update all keyframes with init configuration
        // Select the new object
        CanvasKit.prototype.addObject = function () {
            if (this.resourceList.objects.length >= constants.MAX_OBJECTS) {
                return;
            }
            var index = this.resourceList.addObject(this.defaultObject);
            for (var i = 0; i < this.stage.keyframes.length; i++) {
                this.stage.keyframes[i].objStates.push(this.resourceList.objects[index].exportFrame());
            }
            this.selectedObject = index;
            this.redraw();
            this.digest();
        };
        // Remove the object currently selected
        CanvasKit.prototype.removeObject = function () {
            if (this.resourceList.objects.length < 2) {
                return;
            }
            this.resourceList.removeObject(this.selectedObject);
            var kit = this;
            _u.each(this.stage.keyframes, function (keyframe) {
                _u.removeArrayEntry(keyframe.objStates, kit.selectedObject);
            });
            if (this.selectedObject === this.resourceList.objects.length) {
                this.selectedObject--;
            }
            this.redraw();
            this.digest();
        };
        CanvasKit.prototype.removeImage = function (index) {
            if (index == -1) {
                return;
            }
            var images = this.resourceList.images;
            this.resourceList.objects.forEach(function (item) {
                if (_u.exists(item.fillImage) && images.indexOf(item.fillImage) === index) {
                    item.fillImage = null;
                }
            });
            var bImg = this.stage.stageConfig.backgroundImage;
            if (_u.exists(bImg) && images.indexOf(bImg) === index) {
                this.stage.stageConfig.backgroundImage = null;
            }
            images.splice(index, 1);
            images.forEach(function (item, index) {
                item.id = index;
            });
            this.redraw();
            this.digest();
        };
        CanvasKit.prototype.getImage = function () {
            this.setTempModes(controlModes.EDIT_NONE, false);
            this.redraw();
            window.open(this.canvas.toDataURL('image/png'));
            this.restoreModes();
            this.redraw();
        };
        /*
         * Used to set the canvas state with the keyframe interpolation scene states
         * //Objects in the scene are used to store temporary states,
         */
        CanvasKit.prototype.loadFrame = function () {
            this.stage.loadState(this.stage.segment);
            this.redraw();
        };
        CanvasKit.prototype.removeKeyframe = function () {
            if (this.stage.keyframes.length < 2) {
                return;
            }
            _u.removeArrayEntry(this.stage.keyframes, this.stage.segment);
            if (this.stage.segment === this.stage.keyframes.length) {
                this.stage.segment--;
            }
            this.stage.loadState(this.stage.segment);
            this.redraw();
            this.digest();
        };
        CanvasKit.prototype.removeLast = function () {
            if (this.stage.keyframes.length < 2) {
                return;
            }
            _u.removeArrayEntry(this.stage.keyframes, this.stage.keyframes.length - 1);
            if (this.stage.segment === this.stage.keyframes.length) {
                this.stage.segment--;
            }
            this.stage.loadState(this.stage.segment);
            this.redraw();
            this.digest();
        };
        /* Below this point are completed methods re-written for 0.2.0  */
        /* These are all for interface use */
        CanvasKit.prototype.clearScene = function () {
            this.selectedObject = 0;
            this.resourceList.clearResources();
            this.resourceList.addObject(this.defaultObject);
            this.stage.clearStage();
            this.redraw();
            this.digest();
        };
        CanvasKit.prototype.setObjectAttribute = function (target, value) {
            if (_u.exists(this.resourceList.objects[this.selectedObject].uiTranslators[target])) {
                var value = this.resourceList.objects[this.selectedObject].setUIAttribute(target, value);
                if (this.resourceList.objects[this.selectedObject].animationAttributes.indexOf(target) !== -1) {
                    this.stage.setKeyframeAttribute(target, this.stage.segment, this.selectedObject, value);
                }
                this.redraw();
            }
        };
        CanvasKit.prototype.getObjectAttribute = function (target) {
            return this.resourceList.objects[this.selectedObject].getUIAttribute(target);
        };
        CanvasKit.prototype.objectCount = function () {
            return this.resourceList.objects.length;
        };
        CanvasKit.prototype.addImage = function (src, page, label) {
            if (page === void 0) { page = ''; }
            if (label === void 0) { label = ''; }
            this.resourceList.addImage(src, page, label);
        };
        CanvasKit.prototype.getImageList = function () {
            //var listImages = [];
            //this.resourceList.images.forEach(function (value, index) {
            //  listImages.push({ id: index, label: value.label });
            //});
            //return listImages;
            return this.resourceList.images;
        };
        /* Animation UI get ers and set ers
         * 'ATTRIBUTES' ARE FOR UI STRING ELEMENTS
         * 'STATES' ARE FOR INTERNAL USE
         * Everything below this point are for UI use
         * */
        CanvasKit.prototype.setSceneAttribute = function (target, value) {
            if (target === 'timing') {
                this.stage.setSegmentTiming(value);
            }
            else {
                this.stage.stageConfig.setAttribute(target, value);
                this.redraw();
            }
        };
        CanvasKit.prototype.getSceneAttribute = function (target) {
            if (target === 'timing') {
                return this.stage.getSegmentTiming();
            }
            else if (target === 'segment') {
                return this.stage.segment;
            }
            else {
                return this.stage.stageConfig.getAttribute(target);
            }
        };
        CanvasKit.prototype.setFillImage = function (index) {
            if (index === '' || index == null) {
                /* TODO frax this casting */
                this.resourceList.objects[this.selectedObject].fillImage = {};
            }
            else {
                var index = _u.parseIntOrDefault(index, 0);
                if (this.resourceList.images.length > index) {
                    this.resourceList.objects[this.selectedObject].fillImage = this.resourceList.images[index];
                }
            }
            this.redraw();
        };
        CanvasKit.prototype.selectFirst = function () {
            this.stage.segment = 0;
            this.stage.loadState(0);
            this.digest();
            this.colorFunc();
            this.redraw();
        };
        CanvasKit.prototype.selectPrev = function () {
            if (this.stage.segment > 0) {
                this.stage.segment--;
                this.stage.loadState(this.stage.segment);
                this.digest();
                this.colorFunc();
                this.redraw();
            }
        };
        CanvasKit.prototype.selectNext = function () {
            this.stage.segment++;
            if (this.stage.segment === this.stage.keyframes.length) {
                this.stage.newKeyframe();
            }
            this.stage.loadState(this.stage.segment);
            this.digest();
            this.colorFunc();
            this.redraw();
        };
        CanvasKit.prototype.selectLast = function () {
            this.stage.segment = this.stage.keyframes.length - 1;
            this.stage.loadState(this.stage.segment);
            this.digest();
            this.colorFunc();
            this.redraw();
        };
        /* Animation
         *
         *
         * */
        CanvasKit.prototype.play = function () {
            if (!this.stage.animationMode)
                this.loopInit();
            this.stage.sceneLoop();
        };
        CanvasKit.prototype.stopScene = function () {
            this.sceneReset();
            this.restoreModes();
            this.redraw();
        };
        CanvasKit.prototype.loopInit = function () {
            this.setTempModes(controlModes.EDIT_NONE, false);
            this.stage.init();
        };
        CanvasKit.prototype.sceneReset = function () {
            this.stage.animationMode = false;
            this.stage.segment = 0;
            this.stage.loadState(0);
        };
        CanvasKit.prototype.setTempModes = function (editMode, toggleCurveColor) {
            this.settingShelf = { 'editMode': this.editMode, 'toggleCurveColor': this.toggleCurveColor };
            this.editMode = editMode;
            this.toggleCurveColor = toggleCurveColor;
        };
        CanvasKit.prototype.restoreModes = function () {
            this.editMode = this.settingShelf.editMode;
            this.toggleCurveColor = this.settingShelf.toggleCurveColor;
        };
        CanvasKit.prototype.getConfigSetting = function (setting) {
            //if(setting==='height') {
            //  return this.canvasHeight.toString();
            //} else if(setting==='width') {
            //  return this.canvasWidth.toString();
            //} else
            if (setting === 'max-objects') {
                return constants.MAX_OBJECTS;
            }
            else if (setting === 'source-modes') {
                return constants.SOURCE_MODES;
            }
            //} else {
            //  return 'UNKOWN';
            //}
        };
        // JSON LOADING & PATCHOUT
        CanvasKit.prototype.getData = function () {
            return {
                sceneSettings: this.exportSceneConfig(),
                keyframes: this.stage.exportKeyframes(),
                stageConfig: this.stage.stageConfig.exportStageConfig(),
                resources: this.resourceList.export()
            };
        };
        CanvasKit.prototype.loadData = function (data) {
            this.resourceList.import(data.resources);
            this.stage.importFrames(data.keyframes);
            /* StageConfig requires the resourceList */
            this.stage.stageConfig.importStageConfig(data.stageConfig);
            this.importSceneConfig(data.sceneSettings);
            this.colorFunc();
            this.digest();
            this.redraw();
        };
        CanvasKit.prototype.exportSceneConfig = function () {
            return {
                settingShelf: this.settingShelf
            };
        };
        CanvasKit.prototype.importSceneConfig = function (config) {
            this.settingShelf = config.settingShelf;
        };
        return CanvasKit;
    })();
    cKit.CanvasKit = CanvasKit;
    cKit.kit = new CanvasKit();
})(cKit || (cKit = {}));
/// <reference path="src/canvas/core/constants.ts" />
/// <reference path="src/canvas/core/util.ts" />
/// <reference path="src/canvas/elements/Vector.ts" />
/// <reference path="src/canvas/elements/CPoint.ts" />
/// <reference path="src/canvas/elements/Transform.ts" />
/// <reference path="src/canvas/elements/ImageResource.ts" />
/// <reference path="src/canvas/elements/Keyframe.ts" />
/// <reference path="src/canvas/elements/UITranslators.ts" />
/// <reference path="src/canvas/elements/ObjState.ts" />
/// <reference path="src/canvas/core/events.ts" />
/// <reference path="src/canvas/objects/baseObject.ts"/>
/// <reference path="src/canvas/objects/baseInterface.ts" />
/// <reference path="src/canvas/objects/PetalFlower.ts" />
/// <reference path="src/canvas/objects/ImageLayer.ts" />
/// <reference path="src/canvas/objects/Text.ts" />
/// <reference path="src/canvas/stage/Resources.ts" />
/// <reference path="src/canvas/stage/Stage.ts" />
/// <reference path="src/canvas/core/core.ts" /> 
//# sourceMappingURL=cKit.js.map