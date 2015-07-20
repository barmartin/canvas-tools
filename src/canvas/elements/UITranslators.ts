module cKit.elements {
  import _u = cKit.util;

  /* A UI Type exposes a variable to the UI,
   * for now we are using the same to import/export keyframes & json
   * I hope to use the type value in angular to automate UI control generation
   */
  export enum TYPES {
    NUMBER,
    STRING,
    VECTOR
  }

  export enum CONSTRAINTS {
    NONE,
    MOD,
    MINMAX
  }

  export class UITranslatorBase {
    type: number;
    constructor(type) {
      this.type = type;
    }
  }

  /* The purpose of extending UITranslatorBase is to for these two methods */
  export interface UITranslator {
    import(value:any);
    export(value:any);
  }

  export class UINumber extends UITranslatorBase implements UITranslator {
    // Radian to Degrees ...
    multiplier: number;
    // .0414 -> 0.041 for maxSigFigs = 3
    maxSigFigs: number;
    constrain: number;
    minimum: number;
    modOrMax: number;
    constructor(multiplier:number = 1, maxSigFigs:number = 3, constrain:number = CONSTRAINTS.NONE, modOrMax:number = constants.TWOPI, minimum:number = 0) {
      super(TYPES.NUMBER);
      this.multiplier = multiplier;
      this.maxSigFigs = maxSigFigs;
      this.constrain = constrain;
      this.minimum = minimum;
      this.modOrMax = modOrMax;
    }
    export(value: number) : number {
      return _u.reduceSig(value*this.multiplier, this.maxSigFigs);
    }
    import(value: number) : number {
      if(this.constrain) {
        if(this.constrain===CONSTRAINTS.MINMAX) {
          return Math.max(Math.min(this.modOrMax, value/ this.multiplier), this.minimum);
        } else {
          value = (value/ this.multiplier)%this.modOrMax;
          if(value < 0) {
            value += this.modOrMax;
          }
          return value;
        }
      } else {
        return value / this.multiplier;
      }
    }
  }

  export class UIVector extends UITranslatorBase implements UITranslator {
    // Radian to Degrees ...
    multiplier: number;
    // .0414 -> 0.041 for maxSigFigs = 3
    maxSigFigs: number;
    constrain: number;
    minimum: number;
    modOrMax: number;
    constructor(multiplier: number = 1, maxSigFigs:number = 3, constrain:number = CONSTRAINTS.NONE, modOrMax:number = 0, minimum:number = 0) {
      super(TYPES.VECTOR);
      this.multiplier = multiplier;
      this.maxSigFigs = maxSigFigs;
      this.constrain = constrain;
      this.modOrMax = modOrMax;
      this.minimum = minimum;
    }
    export(vector: Vector) : Vector {
      return new Vector(_u.reduceSig(vector.y*this.multiplier, this.maxSigFigs),
                        _u.reduceSig(vector.y*this.multiplier, this.maxSigFigs));
    }
    import(vector: Vector) {
      if(this.constrain) {
        if(this.constrain===CONSTRAINTS.MINMAX) {
          return new Vector(Math.max(Math.min(this.modOrMax, vector.x / this.multiplier), this.minimum),
              Math.max(Math.min(this.modOrMax, vector.y / this.multiplier), this.minimum));
        } else {
          // Not really sure if we might need this (yet) so I'm not writing it
          // Mod vectors could be interesting for infinite roll across the canvas
          return new Vector(0, 0);
        }
      } else {
        return new Vector(vector.x / this.multiplier, vector.y / this.multiplier);
      }
    }
  }

  export class UIString extends UITranslatorBase implements UITranslator {
    constructor() {
      super(TYPES.STRING);
    }
    export(value: string) {
      return value;
    }
    import(value: string) {
      return value;
    }
  }
}