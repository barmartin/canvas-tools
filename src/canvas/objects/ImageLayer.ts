module cKit.objects {
  import constants = cKit.constants;
  import _u = cKit.util;
  import Vector = cKit.elements.Vector;
  import elements = cKit.elements;
  var CPoint = elements.CPoint;

  /* objPoint is a reference to the point inside the pedal */
  export class ImageLayer extends baseObject {
    constructor(kit, imageResource: elements.ImageResource = null) {
      super(kit);
      this.type = 'imageLayer';

      if(imageResource) {
        this.fillImage = imageResource;
      }

      var quarterHeight = this.kit.canvasHeight/4;
      var quarterWidth = this.kit.canvasWidth/4;
      this.cPoints.push( new CPoint(-quarterWidth, -quarterHeight),
          new CPoint(quarterWidth, -quarterHeight),
          new CPoint(quarterWidth, quarterHeight),
          new CPoint(-quarterWidth, quarterHeight));
    }

    draw() {
      var kit = this.kit;
      kit.context.beginPath();
      var index = 0;
      this.cPoints.forEach(function(cP){
        if(!index) {
          kit.context.moveTo(cP.x, cP.y);
        } else if(index<4) {
          kit.context.lineTo(cP.x, cP.y);
        }
        index++;
      });
      kit.context.closePath();
      kit.context.stroke();
      if(this.fillImage.loaded) {
        kit.context.drawImage(this.fillImage.image, this.cPoints[0].x, this.cPoints[0].y, this.cPoints[1].x-this.cPoints[0].x, this.cPoints[2].y - this.cPoints[1].y);
      }
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
      if(index !== 4) {
        this.cPoints[index].x = newPoint.x;
        this.cPoints[index].y = newPoint.y;
        /* modify neighbor control points */
        if (index % 2 == 0) {
          this.cPoints[(index + 1) % 4].y = newPoint.y;
          this.cPoints[(index + 3) % 4].x = newPoint.x;
        } else {
          this.cPoints[(index + 1) % 4].x = newPoint.x;
          this.cPoints[(index + 3) % 4].y = newPoint.y;
        }
        /* this bit could happen on a mouse enddrag event for efficiency */
        var difVector = new Vector((this.cPoints[0].x + this.cPoints[1].x) / 2,
            (this.cPoints[1].y + this.cPoints[2].y) / 2);
        this.center.x += difVector.x;
        this.center.y += difVector.y;
        this.cPoints.forEach(function (cP, index) {
          if(index<4) {
            cP.x = cP.x - difVector.x;
            cP.y = cP.y - difVector.y;
          }
        });
      }
    }
  }
};
