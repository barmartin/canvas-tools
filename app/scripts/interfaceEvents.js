// This is the final initialization that needs to happen after Angular loads
// Digest triggers an update of the Angular UI
function initInterface() {
  window.kit.initializeCanvas();
  initColorPickers();
  kit.digest();
}

// COLOR PICKER
var currentSelector;
window.dhx_globalImgPath='styles/img/cp/';
var paletteWidth = 45;
var paletteHeight = 45;

function initColorPickers() {
  var kit = window.kit;
  var x = new dhtmlXColorPicker('cpc-line', false, false, false, false);
  var y = new dhtmlXColorPicker('cpc-bodybg', false, false, false, false);
  var z = new dhtmlXColorPicker('cpc-bg', false, false, false, false);
  x.init();y.init();z.init();
  x.setOnSelectHandler(setColor);y.setOnSelectHandler(setColor);z.setOnSelectHandler(setColor);
  x.setOnCancelHandler(function () {
    $('.cpc').hide();
  });
  y.setOnCancelHandler(function () {
    $('.cpc').hide();
  });
  z.setOnCancelHandler(function () {
    $('.cpc').hide();
  });
  x.hide();y.hide();z.hide();
  injectColor('bg-color', kit.backgroundColor);
  injectColor('line-color', kit.lineColor);
  injectColor('bodybg-color', kit.bodybg);
  $('body, html').attr('style', 'background-color:#'+kit.bodybg);

  $('#bg-color').click(function() {
    z.hide();
    z.setColor($(this).attr('color'));
    currentSelector = $(this).attr('id');
    $('#cpc-bg').attr('style', 'width: 252px;');
    z.show();
  });
  $('#bodybg-color').click(function() {
    y.hide();
    y.setColor($(this).attr('color'));
    currentSelector = $(this).attr('id');
    $('#cpc-bodybg').attr('style', 'width: 252px; top:' + 53 + 'px;');
    y.show();
  });
  $('#line-color').click(function() {
    x.hide();
    x.setColor($(this).attr('color'));
    currentSelector = $(this).attr('id');
    $('#cpc-line').attr('style', 'width: 252px;');
    x.show();
  });
}

function setColor(color) {
  var kit = window.kit;
  if(currentSelector === 'bg-color') {
    $(currentSelector).attr('style', 'background-color:' + color + ';');
    $(currentSelector+' img').hide();
    injectColor(currentSelector, color.substring(1));
    $(currentSelector+'+ img').show();
    kit.backgroundColor = color.substring(1);
    kit.redraw();
  } else if(currentSelector === 'line-color') {
    $(currentSelector).attr('style', 'background-color:' + color + ';');
    $(currentSelector+' img').hide();
    injectColor(currentSelector, color.substring(1));
    $(currentSelector+'+ img').show();
    kit.lineColor = color.substring(1);
    kit.redraw();
  } else if( currentSelector === 'bodybg-color') {
    $(currentSelector).attr('style', 'background-color:' + color + ';');
    $(currentSelector+' img').hide();
    injectColor(currentSelector, color.substring(1));
    $(currentSelector+'+ img').show();
    $('body, html').attr('style', 'background-color:'+color);
  }
  $('.cpc').hide();
}

function injectColor(id, color) {
  var thisC = $('#' + id);
  var theseC = new Array(kit._u.decodeFromHex(color.substring(0, 2)), kit._u.decodeFromHex(color.substring(2, 4)),kit._u.decodeFromHex(color.substring(4, 6)));
  thisC.attr('style', 'background-color: #' + color);
  thisC.attr('color', color);
  //$('#' + id).html(gripImg(theseC[0],theseC[1] ,theseC[2]));
  return false;
}

// KEYBOARD HANDLING
function initKeyboard() {
  document.addEventListener("keydown", keyDownHandler);
}

function keyDownHandler(event) {
  if(kit.fieldFocus==true) {
    return false;
  }
  var keyPressed = String.fromCharCode(event.keyCode);

  // OBJECT SELECTION
  if(keyPressed === '1') {   
    kit.selectObject(0);
  } else if(keyPressed === '2') { 
    kit.selectObject(1);
  } else if(keyPressed === '3') { 
    kit.selectObject(2);
  } else if(keyPressed === '4') { 
    kit.selectObject(3);

  // KEYFRAME SELECTION
  // LEFT CURSOR (BACK)
  } else if(event.keyCode=='37'||keyPressed=='%') { 
    kit.selectPrev();
  // RIGHT CURSOR (FORWARD)
  } else if(event.keyCode=='39'||keyPressed=="'") { 
    kit.selectNext();
  // 65 A KEY (STOP)
  } else if(keyPressed == 'A') { 
    kit.stopScene();
  // 83 S KEY (START)
  } else if (keyPressed == 'S') { 
    kit.loopInit();
    kit.sceneLoop();

  // EDIT MODES  
  } else if(keyPressed == 'Q') { 
    $('.edit-mode button').removeClass('active');
    $('#edit-shape').addClass('active');
    kit.editMode = kit.constants.EDIT_SHAPE;
    kit.redraw();
  } else if(keyPressed == 'W') { 
    $('.edit-mode button').removeClass('active');
    $('#edit-transform').addClass('active');
    kit.editMode = kit.constants.EDIT_TRANSFORM;
    kit.redraw();
  } else if(keyPressed == 'E') { 
    $('.edit-mode button').removeClass('active');
    $('#edit-none').addClass('active');
    kit.editMode = kit.constants.EDIT_NONE;
    kit.redraw();
  }
  kit.digest();
  return false;
}

function getSampleJSON() {
  return $.parseJSON(sampleJSON);
}
var sampleJSON = '[{"backgroundColor":"010201","backgroundAlpha":"1","lineColor":"9fb4f4","sourceMode":"lighter","seamlessAnimation":true},{"fillImageSource":"styles/img/darkmountain.jpg"}, \
[["flower","12",1],["flower",6,2]],[{"obj":[{"shapePoints":[{"x":-0.5590233628997393,"y":-2.0863035929598417},{"x":12.1485961292003,"y":-128.88002328150233},{"x":-49.11165462656021,"y":-78.63714243359995},{"x":0,"y":-132.16734734352232}], \
"rotation":5.754529970058761,"scale":0.834656832,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-30.122221832793045,"y":-17.391072883752692},{"x":85.9704641350211,"y":-161.39240506329114},{"x":10.021097046413503,"y":-69.62025316455697},{"x":0,"y":-227.27272727272725}], \
"rotation":0,"scale":0.948,"position":{"x":250,"y":250}}],"timing":1.0},{"obj":[{"shapePoints":[{"x":-66.54834810398798,"y":-248.36181628386313},{"x":49.62409043622804,"y":-209.6660121056433},{"x":-2.8280655533554153,"y":-179.2534302318673},{"x":0,"y":-216.07629402658225}], \
"rotation":5.754529970058761,"scale":0.834656832,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-50.807731559059285,"y":-29.33385749253713},{"x":85.9704641350211,"y":-161.39240506329114},{"x":-104.957805907173,"y":-23.206751054852322},{"x":0,"y":-184.59915611814347}], \
"rotation":0,"scale":0.948,"position":{"x":250,"y":250}}],"timing":1.5},{"obj":[{"shapePoints":[{"x":-65.67787952632173,"y":-245.11318332562047},{"x":71.17540024282371,"y":-194.3026064157911},{"x":-49.58058173540719,"y":283.2295565935227},{"x":0,"y":-221.42302992745593}], \
"rotation":5.754529970058761,"scale":0.834656832,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-50.807731559059285,"y":-29.33385749253713},{"x":179.8523206751055,"y":-123.41772151898735},{"x":-87.02531645569621,"y":-53.797468354430386},{"x":0,"y":-184.59915611814347}], \
"rotation":0,"scale":0.948,"position":{"x":250,"y":250}}],"timing":1.5},{"obj":[{"shapePoints":[{"x":-65.96639670082932,"y":-246.189944079739},{"x":71.17540024282371,"y":-194.3026064157911},{"x":-49.58058173540719,"y":283.2295565935227},{"x":0,"y":-221.42302992745593}], \
"rotation":6.278799370390794,"scale":0.831318204672,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-50.807731559059285,"y":-29.33385749253713},{"x":186.54792286874587,"y":-75.04468951175927},{"x":-111.0347001039193,"y":-52.22737611648803},{"x":0,"y":-209.9105782470954}], \
"rotation":6.2783309763779105,"scale":0.948,"position":{"x":250,"y":250}}],"timing":1.5},{"obj":[{"shapePoints":[{"x":-65.96639670082932,"y":-246.189944079739},{"x":71.17540024282371,"y":-194.3026064157911},{"x":-49.58058173540719,"y":283.2295565935227},{"x":0,"y":-221.42302992745593}], \
"rotation":1.5707963267948966,"scale":0.831318204672,"position":{"x":250,"y":250}}, {"shapePoints":[{"x":-180.25999522596678,"y":-104.07315676783261},{"x":232.95851490149536,"y":-96.50532974597995},{"x":158.37056109488017,"y":-245.92687765652},{"x":0,"y":-151.39389500364405}], \
"rotation":1.5616641605754857,"scale":0.948,"position":{"x":250,"y":250}}],"timing":1.5},{"obj":[{"shapePoints":[{"x":-65.96639670082932,"y":-246.189944079739},{"x":71.17540024282371,"y":-194.3026064157911},{"x":-49.58058173540719,"y":283.2295565935227},{"x":0,"y":-221.42302992745593}], \
"rotation":3.1765783724183185,"scale":0.6015418529006592,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-50.807731559059285,"y":-29.33385749253713},{"x":179.8523206751055,"y":-123.41772151898735},{"x":-87.02531645569621,"y":-53.797468354430386},{"x":0,"y":-184.59915611814347}], \
"rotation":3.1717559163149986,"scale":0.77736,"position":{"x":250,"y":250}}],"timing":1.5},{"obj":[{"shapePoints":[{"x":-62.29535079792313,"y":-232.48941425317554},{"x":71.17540024282371,"y":-194.3026064157911},{"x":-49.58058173540719,"y":283.2295565935227},{"x":0,"y":-183.37388641602942}], \
"rotation":4.702339067491655,"scale":0.34850189248977714,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-50.807731559059285,"y":-29.33385749253713},{"x":179.8523206751055,"y":-123.41772151898735},{"x":-87.02531645569621,"y":-53.797468354430386},{"x":0,"y":-184.59915611814347}], \
"rotation":1.5939135951791896,"scale":0.337654848,"position":{"x":250,"y":250}}],"timing":1.5}]]';
