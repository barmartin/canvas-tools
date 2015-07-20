module cKit.objects {
  import constants = cKit.constants;
  import _u = cKit.util;
  import elements = cKit.elements;
  import Vector = elements.Vector;
  import CPoint = elements.CPoint;

  /* objPoint is a reference to the point inside the pedal */
  export class PetalFlower extends baseObject {

    /* Update-able */
    petals:number;
    accent:number;

    /* Internal */
    allPetals:Array<Array<Vector>>;
    firstPetal:Array<Vector>;
    maxRadius:number;

    /* increment is the degree between petals */
    increment:number;
    /* first inner angle is the derivative angle of the first curve (the first bezier angle) */
    firstInnerAngle:number;


    constructor(kit, petals=6, accent=1, innerRadius=-1, outerRadius=-1) {
      super(kit);
      if(innerRadius===-1) {
        innerRadius = kit.canvasWidth*constants.DEFAULT_INNER_RADIUS_SCALAR;
      }
      if(outerRadius === -1) {
        outerRadius = kit.canvasWidth*constants.DEFAULT_OUTER_RADIUS_SCALAR;
      }
      this.uiTranslators['petals'] = new elements.UINumber(1, 0, elements.CONSTRAINTS.MINMAX, 300, 1);
      this.uiTranslators['accent'] = new elements.UINumber(1, 3, elements.CONSTRAINTS.MINMAX, petals, 0);
      this.stateAttributes = this.stateAttributes.concat(['petals', 'accent']);

      this.id = 'petalFlower';
      this.label = "Petal Flower";

      // Instantiation Variables
      this.petals = petals;
      this.accent = accent;
      this.increment = 2 * Math.PI / petals;
      this.firstInnerAngle = -0.5 * this.increment * this.accent;

      // TODO ... why did I write this into the fill image algorithm?
      this.maxRadius = Math.sqrt(kit.midWidth*kit.midWidth+kit.midHeight*kit.midHeight);

      var cp, cp2, cp3, cp4;

      cp = Vector.getPolarPoint(innerRadius, this.firstInnerAngle);
      var secondCPRadius = (outerRadius - innerRadius) / 2 + innerRadius;
      cp2 = Vector.getPolarPoint(secondCPRadius, this.firstInnerAngle*3);
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
      var rotatePoint = new CPoint(0, -this.kit.midHeight / 2.5);
      rotatePoint.rotate(this.rotation);
      this.transformPoints.push(new CPoint(0, 0), rotatePoint, new CPoint(this.scaleDistance, 0));

      /*
       * Use first Petal as a template for the rest of the Petals
       * First Petal is drawn at each radial based on PetalCount rotation
       */
      this.createPetals();
    }

    /* override (rotation in draw) */
    transform() {
      this.kit.context.transform(this.scale, 0, 0, this.scale, this.center.x, this.center.y);
    }

    draw() {
      var index = 0;
      var flower = this;
      var kit = this.kit;
      kit.context.beginPath();
      _u.each(this.allPetals, function (Petal: Array<Vector>) {
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
        } else {
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
        kit.context.globalCompositeOperation = kit.sourceMode;
        kit.context.clip();
        this.drawPetalFill(new elements.Transform(this.center, this.scale, this.rotation));
        /*if (kit.highlightCurve === true) {
          // Restore composition mode in the case the line highlight mode is toggled
          kit.context.globalCompositeOperation = 'source-over';
          kit.context.lineWidth = 1.9;
          kit.context.stroke();
        }*/
      } else {
        // Restore composition mode in case fill image has been removed
        kit.context.globalCompositeOperation = 'source-over';
        kit.context.stroke();
      }
    }

    drawPetalFill(transform) {
      var kit = this.kit;
      var sweepFrom = Vector.getPolarPoint(this.maxRadius, this.firstInnerAngle / this.accent + transform.rotation);
      var sweepTo = Vector.getPolarPoint(this.maxRadius, transform.rotation);

      var temp_canvas:any = document.createElement('canvas');
      temp_canvas.width = kit.canvasWidth;
      temp_canvas.height = kit.canvasHeight;
      var tempContext:any = temp_canvas.getContext('2d');
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
      tempContext.setTransform(reflectionMatrix[0], reflectionMatrix[1], reflectionMatrix[2], reflectionMatrix[3],
          this.center.x, this.center.y);
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
    }

    /* Use first Petal as a template for the rest of the Petals */
    createPetals() {
      this.allPetals = [];
      this.allPetals.push(this.firstPetal);

      for (var i = 1; i < this.petals; i++) {
        var newPetal = [];
        var thisAngle = i * this.increment;
        _u.each(this.firstPetal, function (point: Vector, index: number) {
          newPetal.push(point.rotateIntoNewVector(thisAngle));
        });
        this.allPetals.push(newPetal);
      }
    }

    updateIncrement() {
      this.increment = 2 * Math.PI / this.petals;
    }

    /*
     * Update the first Petal based on a control point change.
     * Recreate all the other Petals based on first Petal.
     * Should only be called from mouse events, not effecient for keyframe changes
     */
    updatePetal(index:number, newPoint:Vector) {
      if (index === 3) {
        newPoint.x = 0;
        this.firstPetal[3].x = 0;
        this.firstPetal[index].y = newPoint.y;
      } else if (index === 0) {
        var innerRadius = Vector.zeroVector().distance(newPoint);
        newPoint = Vector.getPolarPoint(innerRadius, this.firstInnerAngle);
        newPoint.x = _u.reduceSig(newPoint.x, constants.MAX_CP_SIGS);
        newPoint.y = _u.reduceSig(newPoint.y, constants.MAX_CP_SIGS);
        this.firstPetal[0].x = newPoint.x;
        this.firstPetal[0].y = newPoint.y;
        this.firstPetal[6].x = -newPoint.x;
        this.firstPetal[6].y = newPoint.y;
      } else {
        this.firstPetal[index].x = newPoint.x;
        this.firstPetal[6 - index].x = -newPoint.x;
        this.firstPetal[6 - index].y = newPoint.y;
        this.firstPetal[index].y = newPoint.y;
      }
      /* update control point with constrained values */
      this.cPoints[index].x = newPoint.x;
      this.cPoints[index].y = newPoint.y;
    }

    rebuild() {
      this.updateFirstPetal();
      /* Create the rest of the Petals by copying  and rotating the first Petal */
      this.createPetals();
    }

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
    updateFirstPetal() {
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
    }

    /*
     * Allows center shape manipulation
     * scale should be between 0 and petalCount
     */
    accentRadialPoint(centerScale) {
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
    }

    // Modify accent
    updateRadialPoint() {
      this.updateIncrement();
      this.firstInnerAngle = -0.5 * this.increment * this.accent;
      var kit = this.kit;
      var self = this;
      kit.stage.keyframes.forEach(function (keyframe, index) {
        var cP: Vector = keyframe.objStates[kit.selectedObject].cPStates[0];
        var radius = cP.distance();
        var newPosition = Vector.getPolarPoint(radius, self.firstInnerAngle);
        cP.x = newPosition.x;
        cP.y = newPosition.y;
        if(kit.stage.segment===index) {
          self.firstPetal[0].x = self.cPoints[0].x = cP.x;
          self.firstPetal[0].y = self.cPoints[0].y = cP.y;
        }
      });
    }



    /* These next three are the interface with external libs */
    setUIAttribute(target:string, newValue:string) {
      if (this.hasOwnProperty(target)) {
        if (target === 'petals') {
          // default fix
          var val = util.parseIntOrDefault(newValue, constants.DEFAULT_RAYS);
          this.petals = val;
          this.uiTranslators['accent'] = new elements.UINumber(1, 3, elements.CONSTRAINTS.MINMAX, this.petals, 0);
          this.updateIncrement();
          this.updateRadialPoint();
          this.rebuild();
          return val;
        } else if (target === 'accent') {
          var val = util.parseIntOrDefault(newValue, 1);
          this.accentRadialPoint(this.uiTranslators['accent'].import(val));
        } else {
          return super.setUIAttribute(target, newValue);
        }
      }
      return null;
    }

    setControlPoints(newControlPoints: Array<elements.Vector>) {
      for(var i=0; i<newControlPoints.length; i++) {
        this.updatePetal(i, newControlPoints[i]);
      }
      this.rebuild();
    }

    /* Used in Mouse Drag Operations */
    // this.kit.indexOf(this.cPoints, point)
    setControlPointFromUI(index, newPoint) {
    //setSingleControlPoint(index, newPoint) {
      this.updatePetal(index, newPoint);
      this.rebuild();
    }

    getControlPoint(index){
      return new Vector(this.cPoints[index].x, this.cPoints[index].y);
    }

  }
};
