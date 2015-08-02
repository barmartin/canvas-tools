module cKit.events {
  import objects = cKit.objects;
  import elements = cKit.elements;
  import _u = cKit.util;
  import Vector = elements.Vector;
  import CPoint = elements.CPoint;

  // View control point type
  export enum controlModes {
    EDIT_SHAPE,
    EDIT_TRANSFORM,
    EDIT_NONE
  }

  // EVENT BINDING
  // Consider moving out of CanvasKit scope because they execute in global
  export function bindEvents(){
    var kit = cKit.kit;
    /* TODO (WIP for touch devices) */
    kit.canvas.addEventListener('touchstart', startTouch.bind(kit), false);
    kit.canvas.addEventListener('touchend', endDrag.bind(kit), false);
    kit.canvas.addEventListener('touchmove', move.bind(kit), false);
    // Mouse Canvas Events
    kit.canvas.addEventListener('mousedown', startDrag.bind(kit), false);
    kit.canvas.addEventListener('mouseup', endDrag.bind(kit), false);
    kit.canvas.addEventListener('mousemove', move.bind(kit), false);
  }

  /*
   * All this function should to is toggle inDrag to true
   * if a control point has been clicked
   */
  function startDrag(event) {
    console.log('start drag');
    var kit:cKit.CanvasKit = this;
    if (kit.stage.animationMode===true) {
      return;
    }
    var selectedObject = kit.getSelectedObject();
    if(selectedObject.type === 'sketch') {
      selectedObject.setUIAttribute('startDraw', _u.getPosition(event, kit.canvas));
      // kit.redraw();
      return;
    }
    var position: Vector = _u.getPosition(event, kit.canvas);
    var object: objects.baseObject = kit.resourceList.objects[kit.selectedObject];
    if(kit.editMode===controlModes.EDIT_SHAPE) {
      var actualPosition = object.reverseTransformPoint(position);
      object.cPoints.forEach( ( thisPoint: CPoint ) => {
        if(thisPoint.mouseInside(actualPosition, object.scale)){
          thisPoint.inDrag = true;
          kit.dragMode = true;
          kit.redraw();
          return;
        }
      });
    } else if(kit.editMode===controlModes.EDIT_TRANSFORM) {
      object.transformPoints.forEach( (thisPoint: CPoint, index: number ) => {
        var positionInsideObject: Vector;
        if(index!==2) {
          positionInsideObject = new Vector(position.x-object.center.x, position.y-object.center.y);
          positionInsideObject.rotate(-object.rotation);
        } else {
          // Scale control point is not rotated
          object.lastScale = object.scale;
          positionInsideObject = new Vector(position.x-object.center.x, position.y-object.center.y);
        }
        if(thisPoint.mouseInside(positionInsideObject, object.scale)){
          thisPoint.inDrag = true;
          kit.dragMode = true;
          kit.redraw();
          return;
        }
      });
    }
  }

  function endDrag(event){
    var kit:cKit.CanvasKit = this;
    if (kit.stage.animationMode===true) {
      kit.dragMode = false;
      return;
    }
    var selectedObject = kit.getSelectedObject();
    if(selectedObject.type === 'sketch') {
      selectedObject.setUIAttribute('endDraw', _u.getPosition(event, kit.canvas));
      // kit.redraw();
      return;
    }
    kit.dragMode = false;
    // kit.position = _u.getPosition(event, kit.canvas);
    var object = kit.resourceList.objects[kit.selectedObject];
    if(kit.editMode===controlModes.EDIT_SHAPE) {
      _u.each(object.cPoints, function( thisPoint ){
        if( thisPoint.inDrag === true ){
          thisPoint.inDrag = false;
          kit.redraw();
        }
      });
    } else if(kit.editMode===controlModes.EDIT_TRANSFORM) {
      object.transformPoints.forEach( (thisPoint, index) => {
        if( thisPoint.inDrag === true ){
          thisPoint.inDrag = false;
          if(index===2) {
            thisPoint.x = object.scaleDistance;
          }
          kit.redraw();
        }
      });
    }
    /* TODO  this is super lazy mode on updating keyFrames =/ */
    kit.stage.storeState();
    kit.digest();
  };

  function move(event){
    var kit:cKit.CanvasKit = this;
    var selectedObject = kit.getSelectedObject();
    if(selectedObject.type === 'sketch') {
      selectedObject.setUIAttribute('draw', _u.getPosition(event, kit.canvas));
      // kit.redraw();
      return;
    }
    if (kit.dragMode!==true || kit.stage.animationMode===true) {
      return;
    }
    var object = kit.resourceList.objects[kit.selectedObject];
    var position = _u.getPosition(event, kit.canvas);
    if(kit.editMode===controlModes.EDIT_SHAPE) {
      object.cPoints.forEach( (thisPoint : CPoint, index: number)=> {
        // Only drag one control point at a time
        if( thisPoint.inDrag ) {
          if(object.type==='imageLayer' && index === 4) {
            object.center = position;
          } else {
            var actualPosition = object.reverseTransformPoint(position);
            object.setControlPointFromUI(index, actualPosition);
          }
          kit.redraw();
          return;
        }
      });
    } else if(kit.editMode===controlModes.EDIT_TRANSFORM) {
      object.transformPoints.forEach((thisPoint, index) => {
        // Expectation is one CPoint inDrag at a time
        if(thisPoint.inDrag) {
          object.setTransformPointFromUI(index, position);
          kit.redraw();
          return;
        }
      });
    }
  };

  function startTouch(event) {
    console.log('touch');
    var kit:cKit.CanvasKit = this;
    if (kit.stage.animationMode===true) {
      return;
    }
    var position: Vector = _u.getPosition(event, kit.canvas);
    var object: objects.baseObject = kit.resourceList.objects[kit.selectedObject];
    if(kit.editMode===controlModes.EDIT_SHAPE) {
      var actualPosition = object.reverseTransformPoint(position);
      object.cPoints.forEach( ( thisPoint: CPoint ) => {
        if(thisPoint.mouseInside(actualPosition, object.scale)){
          thisPoint.inDrag = true;
          kit.dragMode = true;
          kit.redraw();
        }
      });
    } else if(kit.editMode===controlModes.EDIT_TRANSFORM) {
      object.transformPoints.forEach( (thisPoint: CPoint, index: number ) => {
        var positionInsideObject: Vector;
        if(index!==2) {
          positionInsideObject = new Vector(position.x-object.center.x, position.y-object.center.y);
          positionInsideObject.rotate(-object.rotation);
        } else {
          // Scale control point is not rotated
          object.lastScale = object.scale;
          positionInsideObject = new Vector(position.x-object.center.x, position.y-object.center.y);
        }
        if(thisPoint.mouseInside(positionInsideObject, object.scale)){
          thisPoint.inDrag = true;
          kit.dragMode = true;
          kit.redraw();
        }
      });
    }
  }

}