module cKit.objects {
  import elements = cKit.elements;
  import objects = cKit.objects;

  export interface baseInterface {
    setUIAttribute(target:string, newValue:string);
    getUIAttribute(target:string) : any;

    //getControlPoints(): Array<elements.Vector>;
    setControlPoints(newControlPoints: Array<elements.Vector>);
    setControlPointFromUI(index: number, newPoint:elements.Vector);

    // getState(target:string): any;
    // setState(target:string, val: any): void;
  }
}