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
    label: string;
    type: number;
    display: boolean = true;
    constructor(type, label) {
      this.type = type;
      this.label = label;
    }
  }

  /* The purpose of extending UITranslatorBase is to for these two methods */
  export interface UITranslator {
    label: string;
    type: number;
    display: boolean;
    import(value:any);
    export(value:any);
  }

  export class UINumber extends UITranslatorBase implements UITranslator {
    // Radian to Degrees ...
    multiplier: number;
    // .0414 -> 0.041 for maxSigFigs = 3
    maxSigFigs: number;
    constraint: number;
    minimum: number;
    modOrMax: number;
    constructor(label:string, multiplier:number = 1, maxSigFigs:number = 3, constraint:number = CONSTRAINTS.NONE, modOrMax:number = constants.TWOPI, minimum:number = 0) {
      super(TYPES.NUMBER, label);
      this.multiplier = multiplier;
      this.maxSigFigs = maxSigFigs;
      this.constraint = constraint;
      this.minimum = minimum;
      this.modOrMax = modOrMax;
    }
    export(value: number) : number {
      return _u.reduceSig(value*this.multiplier, this.maxSigFigs);
    }
    import(value: number) : number {
      if(this.constraint) {
        if(this.constraint===CONSTRAINTS.MINMAX) {
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

  export enum UIStringContraints {
    NONE,
    LIST
  }

  export class UIString extends UITranslatorBase implements UITranslator {
    constraint: number;
    possibleValues: Array<string>;
    constructor(label:string, constraint=UIStringContraints.NONE, possibleValues=[]) {
      super(TYPES.STRING, label);
      this.constraint = constraint;
      this.possibleValues = possibleValues;
    }
    export(value: string) {
      return value;
    }
    import(value: string) {
      if(this.constraint===UIStringContraints.NONE) {
        return value;
      } else {
        if(this.possibleValues.indexOf(value)!==-1) {
          return value;
        } else {
          return this.possibleValues[0];
        }
      }
    }
  }

  export class UIVector extends UITranslatorBase implements UITranslator {
    // Radian to Degrees ...
    multiplier: number;
    // .0414 -> 0.041 for maxSigFigs = 3
    maxSigFigs: number;
    constraint: number;
    minimum: number;
    modOrMax: number;
    constructor(label: string, multiplier: number = 1, maxSigFigs:number = 3, constraint:number = CONSTRAINTS.NONE, modOrMax:number = 0, minimum:number = 0) {
      super(TYPES.VECTOR, label);
      this.multiplier = multiplier;
      this.maxSigFigs = maxSigFigs;
      this.constraint = constraint;
      this.modOrMax = modOrMax;
      this.minimum = minimum;
    }
    export(vector: Vector) : Vector {
      return new Vector(_u.reduceSig(vector.y*this.multiplier, this.maxSigFigs),
          _u.reduceSig(vector.y*this.multiplier, this.maxSigFigs));
    }
    import(vector: Vector) {
      if(this.constraint) {
        if(this.constraint===CONSTRAINTS.MINMAX) {
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
}