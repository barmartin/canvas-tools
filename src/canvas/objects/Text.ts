module cKit.objects {
  import constants = cKit.constants;
  import _u = cKit.util;
  import Vector = cKit.elements.Vector;
  import elements = cKit.elements;
  var CPoint = elements.CPoint;

  /* objPoint is a reference to the point inside the pedal */
  export class Text extends baseObject {
    text: string;
    fontSize: number;

    constructor(kit, text = '') {
      super(kit);
      this.type = 'textLayer';

      this.text = text;
      this.fontSize = 16;
      this.uiTranslators['text'] = new elements.UIString('Text');
      this.uiTranslators['fontSize'] = new elements.UIString('Font Size');

      this.center.x = this.kit.canvasHeight/4;
      this.center.y = this.kit.canvasWidth/4;
      this.cPoints.push(new CPoint(0, 0));

      this.animationAttributes = this.animationAttributes.concat(['text']);
      this.stateAttributes = this.stateAttributes.concat(['fontSize']);
    }

    draw() {
      var kit = this.kit;
      var ctx = kit.context;
      //if(_u.exists(this.fillImage.loaded) && this.fillImage.loaded) {
        //ctx.drawImage(this.fillImage.image, this.cPoints[0].x, this.cPoints[0].y, this.cPoints[1].x-this.cPoints[0].x, this.cPoints[2].y - this.cPoints[1].y);
      // }
      ctx.font = this.fontSize + "px Arial";
      // ctx.fillText(" World", this.cPoints[0].x, this.cPoints[0].y);
      ctx.strokeText(this.text ,this.cPoints[0].x + 10, this.cPoints[0].y);
    }

    /*resetScalePoint(xPosition) {
     this.transformPoints[2].x = this.scaleDistance;
     }*/
    setState(target:string, newValue:any) {
      if(target==="shapePoints") {
        this.setControlPoints(newValue);
      } else {
        this[target] = newValue;
      }
    }

    /* For the mouse drag event */
    setControlPointFromUI(index, newPoint) {
      this.center.x += newPoint.x;
      this.center.y += newPoint.y;
    }
  }
};
