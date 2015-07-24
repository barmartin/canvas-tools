module cKit.elements {
  // Delta is used by the UI & for the final keyframe smooth animation to segment 0 time
  // The main scene loop works based on timestamps
  export class Keyframe {
    objStates: Array<KeyState>;
    timestamp: number;

    constructor(objStates: Array<KeyState>, timestamp: number) {
      this.objStates = [];
      objStates.forEach( (keyState: KeyState) => {
        this.objStates.push(new KeyState(keyState.cPStates, keyState.attributes));
      });
      this.timestamp = timestamp;
    }

    export() {
      return {
        objStates: this.objStates,
        timestamp: this.timestamp,
      };
    }
  }

  export class KeyState {
    cPStates: Array<Vector>;
    attributes: Dictionary<any> = {};
    constructor(cpStates: Array<Vector>, attributes: Dictionary<any>) {
      this.cPStates = [];
      cpStates.forEach( (item) => {
        this.cPStates.push(new Vector(item.x, item.y));
      });
      Object.keys(attributes).forEach( (key) => {
        if(key==='center') {
          this.attributes[key] = new Vector(attributes[key].x, attributes[key].y);
        } else {
          this.attributes[key] = attributes[key];
        }
      });
    }
  }
}