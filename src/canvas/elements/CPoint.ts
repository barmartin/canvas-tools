module cKit.elements {
  import constants = cKit.constants;
  import Vector = cKit.elements.Vector;
  import Objects = cKit.objects;

  /* objPoint is a reference to the point inside the pedal */
  export class CPoint extends Vector {
    inDrag:boolean;

    constructor(x:number, y:number, inDrag: boolean = false) {
      super(x, y);
      this.inDrag = inDrag;
    }

    draw(index, context, parentRotation:number, editMode:number) {
      var realPoint;
      if (editMode !== events.controlModes.EDIT_TRANSFORM || index !== 2) {
        realPoint = this.rotateIntoNewVector(parentRotation);
      } else {
        realPoint = this;
      }

      context.beginPath();
      context.arc(realPoint.x, realPoint.y, constants.CONTROL_POINT_RADIUS, 0, Math.PI * 2, true);
      context.closePath();
      context.lineWidth = 1;

      if (this.inDrag) {
        context.fillStyle = '#999999';
        context.fill();
      } else {
        context.fillStyle = '#FFFFFF';
        context.fill();
      }
      context.stroke();
    }

    mouseInside(point : Vector, parentObjectScale: number) {
      return constants.CONTROL_POINT_RADIUS + constants.MAX_CLICK_DISTANCE > this.distance(point) * parentObjectScale;
    }
  }
}