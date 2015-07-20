module cKit.elements {
  // Delta is used by the UI & for the final keyframe smooth animation to segment 0 time
  // The main scene loop works based on timestamps
  export class Keyframe {
    objStates: Array<KeyState>;
    timestamp: number;

    constructor(objStates: Array<KeyState>, timestamp: number) {
      this.objStates = objStates;
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
    attributes: Dictionary<any>;
    constructor(cpStates: Array<Vector>, attributes: Dictionary<any>) {
      this.cPStates = cpStates;
      this.attributes = attributes;
    }
  }
}