module cKit.elements {
  export class ObjState {
    /* Control Points are represented with a Vector only in a keyframe */
    id:string;
    states:Dictionary<any>;

    constructor(id: string, states: Dictionary<any>) {
      this.id = id;
      this.states = states;
    }
  }
}