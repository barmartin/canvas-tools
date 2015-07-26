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
    textAlign: string;

    constructor(kit, text = '') {
      super(kit);
      this.type = 'textLayer';
      this.textAlign = 'left';

      this.text = text;
      this.fontSize = 16;
      this.uiTranslators['text'] = new elements.UIString('Text');
      this.uiTranslators['fontSize'] = new elements.UIString('Font Size');
      this.uiTranslators['textAlign'] = new elements.UIString('Alignment', elements.UIStringContraints.LIST, ['left', 'center', 'right', 'start', 'end']);

      this.center.x = this.kit.canvasHeight/4;
      this.center.y = this.kit.canvasWidth/4;
      this.cPoints.push(new CPoint(0, 0));

      this.animationAttributes = this.animationAttributes.concat(['text']);
      this.stateAttributes = this.stateAttributes.concat(['fontSize']);

    }

    draw() {
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
      var margin : number;
      if(this.textAlign === 'left' || this.textAlign === 'start') {
        margin = 15;
      } else if(this.textAlign === 'end' || this.textAlign === 'right') {
        margin = -20;
      } else {
        margin = 0;
      }
      ctx.fillText(this.text, this.cPoints[0].x + margin, this.cPoints[0].y + 5);
    }

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
