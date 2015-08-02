module cKit.constants {
  // Math
  export var PI = Math.PI;
  export var TWOPIDIV360 = Math.PI/180;
  export var TWOPI = 2*Math.PI;

  // SCENE SETTINGS
  export var MAX_OBJECTS = 4;
  export var DEFAULT_RAYS = 6;
  export var DEFAULT_TIMING = 1000;
  export var DEFAULT_PAUSETIME = 0;

  export var DEFAULT_INNER_RADIUS_SCALAR = .0000000000001;
  export var DEFAULT_OUTER_RADIUS_SCALAR = .35;
  export var CONTROL_POINT_RADIUS = 6;
  export var MAX_CP_SIGS = 3;

  export var BACKGROUND_COLOR = '010201';
  export var BACKGROUND_ALPHA = 1;
  export var LINE_COLOR = '8987f4';

  export var DEFAULT_FRAME_RATE = 50;

  export var MAX_CLICK_DISTANCE = 2;
  export var SOURCE_MODES = {
    'lighter': 'lighter',
    'darker': 'darker',
    'xor': 'xor',
    //'copy': 'copy',
    'source-atop': 'atop',
    //'source-in': 'in',
    'source-out': 'out',
    'source-over': 'over',
    'destination-atop': 'bottom',
    //'destination-in': 'bottom-intersection',
    'destination-out': 'bottom-out'
    //'destination-over': 'bottom-over'
  }
}
