module cKit.objects {
  import elements = cKit.elements;
  import objects = cKit.objects;
  import Vector = elements.Vector;
  import CPoint = elements.CPoint;
  import UITranslator = elements.UITranslator;
  import UINumber = elements.UINumber;
  import UIVector = elements.UIVector;
  import UIString = elements.UIString;
  import TYPES = elements.TYPES;
  import CONSTRAINTS = elements.CONSTRAINTS;
  import _u = cKit.util;

  export class baseObject implements baseInterface{
    kit: cKit.CanvasKit;

    rotation:number = 0;
    scale:number = 1;
    center:Vector;

    uiTranslators: Dictionary<UITranslator>;
    animationAttributes: Array<string>;
    stateAttributes: Array<string>;

    type: string;

    /* used for mouse events */
    lastScale:number;
    scaleDistance:number;

    /* not used in base class */
    cPoints: Array<CPoint>;
    transformPoints: Array<CPoint>;

    fillImage: elements.ImageResource = null;
    lineColor: string = constants.LINE_COLOR;

    constructor(kit: any) {
      this.kit = kit;
      this.center = new Vector(kit.midWidth, kit.midHeight);

      this.uiTranslators = {
        rotation: new UINumber('Rotation', 180 / Math.PI, 2, CONSTRAINTS.MOD, constants.TWOPI),
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
      this.fillImage = <elements.ImageResource>{};

      // Main Control Points
      this.cPoints = [];

      var rotatePoint = new CPoint(0, -this.kit.midHeight / 2.5);
      rotatePoint.rotate(this.rotation);
      this.transformPoints = [new CPoint(0, 0), rotatePoint, new CPoint(this.scaleDistance, 0)];
    }

    /* just set basics, no object to draw */
    draw() {
      this.kit.context.strokeStyle = '#' + this.lineColor;
    }

    /* Get and Set UIAttribute are for the interface */
    getUIAttribute(target:string) : any {
      if(target === 'fillImage') {
        return this.kit.resourceList.images.indexOf(this.fillImage);
      } else if(_u.exists(this.uiTranslators[target])) {
        return this.uiTranslators[target].export(this[target]);
      } else {
        return '';
      }
    }
    setUIAttribute(target:string, newValue:any) {
      var thisTarget = this.uiTranslators[target];
      if(_u.exists(thisTarget)) {
        var newValue = thisTarget.import(newValue);
        this[target] = newValue;
        return newValue;
      }
    }

    getControlPoint(index) {
      return new Vector(this.cPoints[index].x, this.cPoints[index].y);
    }

    /*getControlPoints() {
      var self = this;
      return this.cPoints.map(function(cp, index){return self.getControlPoint(index)});
    }*/

    setControlPoints(newControlPoints: Array<Vector>) {
      for (var i = 0; i < newControlPoints.length; i++) {
        this.cPoints[i].x = newControlPoints[i].x;
        this.cPoints[i].y = newControlPoints[i].y;
      }
    }

    /* This needs to be overridden in order to update the actual geometry */
    setControlPointFromUI(index:number, point: Vector) {
      this.cPoints[index].x = _u.reduceSig(point.x, constants.MAX_CP_SIGS);
      this.cPoints[index].y = _u.reduceSig(point.y, constants.MAX_CP_SIGS);
    }

    setTransformPointFromUI(index:number, point:Vector) {
      // Center tranform point does not move
      if(index===0) {
        this.center = new Vector(_u.reduceSig(point.x, constants.MAX_CP_SIGS),_u.reduceSig(point.y, constants.MAX_CP_SIGS));
      } else if(index===1) {
        var angleVector = new Vector(point.x-this.center.x, point.y-this.center.y);
        this.rotation = angleVector.getRadians(Vector.zeroVector());
      } else if(index===2) {
        this.scale = this.lastScale * (point.x-this.center.x) / this.scaleDistance;
        this.transformPoints[index].x = point.x-this.center.x;
      }
    }

    setItemFromUI(target:string, newValue:any) {
      var translator: UITranslator = this.uiTranslators[target];
      if(_u.exists(this.uiTranslators)) {
        this[target] = translator.import(newValue);
      }
    }

    /*
    getState(target:string){
      return this[target];
    }*/

    drawControlPoints() {
      this.kit.context.save();
      // Using custom transform to translate without scaling control point size
      this.kit.context.transform(1, 0, 0, 1, this.center.x, this.center.y);
      var obj = this;
      this.cPoints.forEach( (controlPoint: CPoint, index: Number) => {
        var newPoint: CPoint = new CPoint(controlPoint.x * obj.scale, controlPoint.y * obj.scale, controlPoint.inDrag);
        newPoint.draw(index, obj.kit.context, obj.rotation, obj.kit.editMode);
      });
      this.kit.context.restore();
    }

    drawTransformPoints() {
      this.kit.context.save();
      this.translateTranform();
      this.transformPoints[0].draw(0, this.kit.context, this.rotation, this.kit.editMode);
      this.transformPoints[1].draw(1, this.kit.context, this.rotation, this.kit.editMode);
      this.transformPoints[2].draw(2, this.kit.context, this.rotation, this.kit.editMode);
      this.kit.context.restore();
    }

    setScale(xPosition) {
      this.scale = this.lastScale * xPosition / this.scaleDistance;
    }

    /*
     * Rotate, Scale and Transform Context
     *  (RST)
     *  TODO - WIP moving transforms into a state object
     *  this object could be used in object groups also
     */
    transform() {
      this.kit.context.transform(this.scale, 0, 0, this.scale, this.center.x, this.center.y);
      this.kit.context.rotate(this.rotation);
    }

    /*
     * Rotate, Scale and Transform Context
     *  (RST)
     */
    translateTranform() {
      this.kit.context.transform(1, 0, 0, 1, this.center.x, this.center.y);
    }

    /*
     *  Use a reverse transform to find actual point
     *  For finding a click in the object space (TSR)
     */
    reverseTransformPoint(point):Vector {
      // TODO scale and rotate inclusion
      var actual = new Vector(point.x - this.center.x, point.y - this.center.y);
      actual.x /= this.scale;
      actual.y /= this.scale;
      actual.rotate(-this.rotation);
      return actual;
    }
    exportControlPoints():Array<Vector> {
      var cps:Array<Vector> = [];
      this.cPoints.forEach(cp=>cps.push(cp.clone()));
      return cps;
    }

    exportAnimationAttributes() : any{
      var attrs = {};
      this.animationAttributes.forEach(item => {
        if(item==='center') {
          attrs[item] = this['center'].clone();
        } else {
          attrs[item] = this[item];
        }
      });
      return attrs;
    }

    getStates() : Dictionary<any> {
      var attributes : Dictionary<any> = {};
      this.stateAttributes.forEach(item=> {
        if(item==='fillImage') {
          attributes[item] = this.kit.resourceList.images.indexOf(this[item]);
        } else {
          attributes[item] = this[item]
        }
      });
      return attributes;
    }

    exportObject() : elements.ObjState {
      return new elements.ObjState(this.type, this.getStates());
    }

    exportFrame() : elements.KeyState {
      return new elements.KeyState(
        this.exportControlPoints(),
        this.exportAnimationAttributes()
      )
    }

  }
}