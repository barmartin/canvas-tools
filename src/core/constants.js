/**
 *
 */
define(function(require) {

  var PI = Math.PI;

  return {
  	// LOOPING TYPE
    SCENE_NORMAL: 0,
    SCENE_GIF: 1,

    // CONTROL POINT TYPE
    EDIT_SHAPE: 0,
    EDIT_TRANSFORM: 1,
    EDIT_NONE: 2,

    // Math
    PI: PI,
    TWOPIDIV360: 2*Math.PI/360,
    TWOPI: 2*Math.PI,

    // SCENE SETTINGS
    MAX_OBJECTS: 4,
    DEFAULT_RAYS: 6,
    DEFAULT_INNER_RADIUS_SCALAR: 17,
    DEFAULT_OUTER_RADIUS_SCALAR: 2.2,

    BACKGROUND_COLOR: '010201',
    BACKGROUND_ALPHA: '1',
    LINE_COLOR: '9fb4f4',
    BODY_BACKGROUND_COLOR: '020202',

    MAX_CLICK_DISTANCE: 2,
    SOURCE_MODES: {
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
      'destination-out': 'bottom-out',
      //'destination-over': 'bottom-over'
    }
  };

});
