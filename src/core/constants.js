/**
 *
 */
define(function(require) {

  var PI = Math.PI;

  return {
  	// RADIO SETTINGS
    SCENE_NORMAL: 0,
    SCENE_GIF: 1,

    // Math
    PI: PI,
    TWOPIDIV360: 2*Math.PI/360,

    // SCENE SETTINGS
    MAX_OBJECTS: 4,
    DEFAULT_RAYS: 6,
    DEFAULT_INNER_RADIUS_SCALAR: 17,
    DEFAULT_OUTER_RADIUS_SCALAR: 2.2,

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
