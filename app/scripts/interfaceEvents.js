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
var sampleJSON = '[{"backgroundColor":"010201","backgroundAlpha":"1","lineColor":"9fb4f4","sourceMode":"lighter","seamlessAnimation":true}, \
{"fillImageSource":"styles/img/darkmountain.jpg"},[["flower",6,2],["flower",12,1]],[{"obj":[{"shapePoints":[{"x":-7.9017,"y":-4.5621},{"x":-14.5,"y":-48}, \
{"x":-12.5,"y":-113},{"x":0,"y":-212}],"rotation":0,"scale":1,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-59.6218,"y":-222.5118},{"x":-238.5,"y":-215}, \
{"x":-35.5,"y":-234},{"x":0,"y":-207}],"rotation":0,"scale":1,"position":{"x":250,"y":250}}],"timing":1.5},{"obj":[{"shapePoints":[{"x":-46.7674,"y":-27.0011}, \
{"x":-10.6255,"y":46.4042},{"x":15.0538,"y":-38.0741},{"x":0,"y":-228.406}],"rotation":1.0472,"scale":1,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-59.5707,"y":-222.3209}, \
{"x":94.9698,"y":-18.4928},{"x":-22.4701,"y":-107.081},{"x":0,"y":-220.3439}],"rotation":1.0472,"scale":1,"position":{"x":250,"y":250}}],"timing":1.5}, \
{"obj":[{"shapePoints":[{"x":-56.3665,"y":-32.5432},{"x":-12.7665,"y":29.8876},{"x":-65.4994,"y":248.55},{"x":0,"y":-116.9375}], \
"rotation":2.0944,"scale":1,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-59.353272788517614,"y":-221.50942964224305},{"x":124.9179,"y":114.3625},{"x":-24.5572,"y":-166.5329}, \
{"x":0,"y":-73.0907}],"rotation":2.0944,"scale":1,"position":{"x":250,"y":250}}],"timing":1.5},{"obj":[{"shapePoints":[{"x":-36.1688,"y":-20.8821},{"x":41.4995,"y":199.0001}, \
{"x":-48.5001,"y":54.9999},{"x":0,"y":-181}],"rotation":3.14159,"scale":1,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-32.8824,"y":-122.7191},{"x":-104.5003,"y":119.9997}, \
{"x":-158.5006,"y":217.9996},{"x":0,"y":-174}],"rotation":3.14159,"scale":1,"position":{"x":250,"y":250}}],"timing":1.5},{"obj":[{"shapePoints":[{"x":-36.3963,"y":-21.0134}, \
{"x":239.082,"y":-98.1021},{"x":-113.2282,"y":24.1169},{"x":0,"y":-189.5952}],"rotation":4.18879,"scale":1,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-30.2389,"y":-112.8532}, \
{"x":102.0461,"y":147.251},{"x":-71.2641,"y":-40.567},{"x":0,"y":-182.765}],"rotation":4.18879,"scale":1,"position":{"x":250,"y":250}}],"timing":1.5},{"obj":[{"shapePoints":[ {"x":-1.299,"y":-0.75},\
{"x":-163.3706,"y":-122.034},{"x":166.2007,"y":127.1321},{"x":0,"y":161.6275}],"rotation":5.75959,"scale":0.684,"position":{"x":250,"y":250}}, {"shapePoints":[{"x":-1.5861,"y":-5.9194}, \
{"x":67.2928,"y":184.0119},{"x":21.4111,"y":-132.8091},{"x":0,"y":133.0052}],"rotation":5.23599,"scale":1.034240832,"position": {"x":250,"y":250}}],"timing":1.5}]]';
