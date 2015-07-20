module cKit.util {
  import constants = cKit.constants;
  /* Util Helper */

  export function getPosition(e, canvas) {
      var rect = canvas.getBoundingClientRect();
      return new elements.Vector(e.clientX - rect.left, e.clientY - rect.top);
  }

  // SHALLOW CLONE
  export function clone(obj) {
    if(obj == null || 'object' !== typeof obj) {
      return obj;
    }
    var copy = obj.constructor();
    for(var attr in obj) {
      if(obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr];
      }
    }
    return copy;
  }

  export function encodeToHex(floatString) {
    return 0;  // parseInt(255 * floatString).toString(16);
  }

  export function decodeFromHex(str) {
    return parseInt(str, 16);
  }

  export function dnexist(item) {
    return typeof item === 'undefined';
  }

  export function exists(item) {
    return typeof item !== 'undefined';
  }

  export function reduceSig(num: number, sig: number) {
    var mult = Math.pow(10, sig);
    // Floating point fix + 0.00001
    return Math.round(num*mult + 0.0000001)/mult;
  }

  export function degreesToRadians(angle: number) {
    return constants.TWOPIDIV360*angle;
  }

  export function toRGB(str: String) {
    return [decodeFromHex(str.substring(0,2)), decodeFromHex(str.substring(2,4)), decodeFromHex(str.substring(4,6))];
  }

  export function msTime() {
    return new Date().getTime();
  }

  //  This is underscore's each algorithm
  export function each(obj, func) {
    if (obj == null) {
      return obj;
    }
    var i, length = obj.length;
    //console.log('length:' + length + ','+'+length: '+length);
    if (length === +length) {
      for (i = 0; i < length; i++) {
        func(obj[i], i, obj);
      }
    } else {
      // Fix self reference issue
      var keys = getKeys(obj);
      for(i = 0, length = keys.length; i < length; i++) {
        func(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  }

  export function getKeys(obj) {
    return Object.keys(obj);
  }

  export function dicMap(dic, func, context=null) {
    var keys = getKeys(dic);
    keys.forEach(function(key){
      if(dnexist(context)) {
        func(key, dic[key]);
      } else {
        func.call(context, key, dic[key]);
      }
    });
  }

  // TODO
  export function range(st, end) {
    var r = [];
    for(var i=st; i<end; i++) {
      r.push(i);
    }
    return r;
  }

  export function indexOf(obj, item) {
    for(var i=0; i<obj.length; i++) {
      if(obj[i]===item) {
        //console.log('indexOf returning:' + i);
        return i;
      }
    }
    console.log('There is a bug with a call to indexOf');
    return -1;
  }

  export function removeArrayEntry(arr, index){
    arr.splice(index, 1);
  }

  export function parseIntOrDefault(i, def) {
    i = parseInt(i);
    if(i % 1 === 0) {
      return i;
    } else {
      return def;
    }
  }

  export function parseFloatOrDefault(f, def) {
    f = parseFloat(f);
    if(isNaN(f)) {
      return def;
    } else {
      return f;
    }
  }

  export class AsArray {
    key: string;
    /* string or integer */
    value: any;

    constructor(key: string, value: any) {
      this.key = key;
      this.value = value;
    }
  }

  export function getRotationMatrix(angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return [cos, sin, -sin, cos, 0, 0];
  }

}

interface Date {
  compare(x:Date):number;
}

Date.prototype.compare =  function(x){
  var result = this.getTime() - x.getTime();
  return result;
};

class Dictionary<T>{
  [index: string]: T;
}