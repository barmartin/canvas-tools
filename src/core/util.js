define(function(require) {
  'use strict';
  // var constants = require('constants');
  /* Util Helper */
  return {
    getPosition: function(e, canvas) {
      /* TODO Check for Safari Bug
      var targ;
      if (!e) {
        e = window.event;
      }
      if (e.target) {
        targ = e.target;
      } else if (e.srcElement) {
        targ = e.srcElement;
      } 
      if (targ.nodeType === 3) {
        // defeat Safari bug
        targ = targ.parentNode;
      } */
      var rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    },

    // SHALLOW CLONE
    clone: function(obj) {
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
    },

    dnexist: function(item) {
      return typeof item === 'undefined';
    },

    exists: function(item) {
      return typeof item !== 'undefined';
    },

    encodeToHex: function(floatString) {
      return parseInt(255*floatString).toString(16);
    },

    decodeFromHex: function(str) {
      return parseInt(str, 16);
    },

    /* To-Do: Int or Default */
    validateInt: function(obj) {
      return parseInt(obj);
    },

    toRGB: function(str) {
      return [this.decodeFromHex(str.substring(0,2)), this.decodeFromHex(str.substring(2,4)), this.decodeFromHex(str.substring(4,6))];
    },

    msTime: function() {
      return new Date().getTime();
    },

    //  This is underscore's each algorithm
    each: function(obj, func) {
      if (obj == null) {
        return obj;
      }
      var i, length = obj.length;
      //console.log('length:' + length + ','+'+length: '+length);
      if (length === +length) {
        for (i = 0; i < length; i++) {
          func(obj[i], i, obj);
        }
      }/* else {
        var keys = _.keys(obj);
        for (i = 0, length = keys.length; i < length; i++) {
          func(obj[keys[i]], keys[i], obj);
        }
      } */
      return obj;
    },

    // TODO
    range: function(st, end) {
      var r = [];
      for(var i=st; i<end; i++) {
        r.push(i);
      }
      return r;
    },

    indexOf: function(obj, item) {
      for(var i=0; i<obj.length; i++) {
        if(obj[i]===item) {
          //console.log('indexOf returning:' + i);
          return i;
        }
      }
      console.log('Item not Found, IndexOf (should not happen with current config)');
      return -1;
    },

    debugConsole: function(text) {
      var HUD = document.getElementById('console')
      if(HUD.firstChild) {
        HUD.removeChild(HUD.firstChild);
      }
      HUD.appendChild( document.createTextNode(text) );
    }

    // NOT BEING USED
    /*,
    cpFormat: function(coord) {
      if(coord<10) {
        return '00' + Math.floor(coord);
      }
      if(coord<100) {
        return '0' + Math.floor(coord);
      } else { 
        return Math.floor(coord).toString();
      }
    },

    addEventHandler: function(oNode, evt, oFunc, bCaptures) {
      if (this.exists(oNode.attachEvent)) {
        oNode.attachEvent('on'+evt, oFunc);
      } else {
        oNode.addEventListener(evt, oFunc, bCaptures);
      }
    }

    ,
    function reverseString(oldString) {
      if(typeof oldString === 'undefined') {
        return;
      }
      var newString = "";
      for(i=oldString.length; i>=0; i--) {
        newString += oldString.substring(i-1, i);
      }
      return newString;
    } 
    */
  }
});