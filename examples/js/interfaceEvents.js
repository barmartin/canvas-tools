function initInterface() {
  initShapeTab();
  initAnimationTab();
  initLoadTab();
  initKeyboard();
  kit.encoder = new GIFEncoder();
  updateInterface();
  // for debuggin
  // mode('animation');
}

function updateInterface() {
  // OBJECT
  $('.object div').addClass('disabled').removeClass('active');
  for(var i=1; i<=kit.objList.length; i++) {
    var itemButton = $('.object div:nth-child('+i+')');
    itemButton.removeClass('disabled');
    if(i===kit.selectedObject+1) {
      itemButton.addClass('active');
    }
  }
  for(var index=kit.objList.length+1; index<=kit.constants.MAX_OBJECTS; index++) {
    $('.object div:nth-child('+index+')').addClass('disabled');
  }

  // ANIMATION
  $('#segmentId').html(kit.segment);
  if(kit.animationMode===true) {
    $('.playSegment, .playAll, #makeGIF').attr('disabled', true);
    $('.stop').attr('disabled', false);
  } else {
    $('.playSegment, .playAll, #makeGIF').attr('disabled', false);
    $('.stop').attr('disabled', true);
  }

  // RESOURCES
  if(typeof kit.resourceList !== 'undefined') {
    $('#backgroundImageLabel').val(kit.resourceList.backgroundImageLabel);
    $('#backgroundImageSource').val(kit.resourceList.backgroundImageSource)
    $('#backgroundImagePage').val(kit.resourceList.backgroundImagePage)
    $('#fillImageLabel').val(kit.resourceList.fillImageLabel)
    $('#fillImageSource').val(kit.resourceList.fillImageSource)
    $('#fillImagePage').val(kit.resourceList.fillImagePage)
  } else {
    $('#backgroundImageLabel').val('');
    $('#backgroundImageSource').val('')
    $('#backgroundImagePage').val('')
    $('#fillImageLabel').val('')
    $('#fillImageSource').val('')
    $('#fillImagePage').val('')
  }
  $('#shapeColor').prop("checked", kit.toggleCurveColor);
  updateObject();
}


function updateObject() {
  document.getElementById('rotation').value = kit.getRotation();
  document.getElementById('length').value = kit.keyFrames[kit.segment].timing;
  if(kit.objList[kit.selectedObject] instanceof PetalFlower) {
    document.getElementById('k').value = kit.objList[kit.selectedObject].petalCount;
    document.getElementById('radialScalar').value = kit.objList[kit.selectedObject].radialAccent;
  } 
}

function initShapeTab() {
  $('#shapeColor').click( function() {
    if(this.checked) {
      kit.toggleCurveColor = true;
    } else {
      kit.toggleCurveColor = false;
    }
    kit.redraw();
    return true;
  });

  $('#k').change( function() {
    kit.updatePetalCount();
    return true;
  });

  $('#radialScalar').change( function() {
    kit.accentRadial();
    return true;
  });

  $('#myCanvas').mousedown(function(event) {
    event.preventDefault();
  });

  $('#bgAlpha').change(function() {
    var newAlpha = parseFloat($(this).val());
    if( kit._u.dnexist(newAlpha) || newAlpha > 1 ) {
      kit.backgroundAlpha = 1.0;
      $(this).val('1.0');
    } else if( newAlpha < 0) {
      kit.backgroundAlpha = 0.0;
      $(this).val('0.0');
    } else {
      kit.backgroundAlpha = newAlpha;
    }
    kit.redraw();
  });

  $('.object div').click(function() {
    var selected = parseInt($(this).attr('data'));
    kit.selectedObject = selected-1;
    $('.object div').removeClass('active');
    $('.object [data="'+selected+'"]').addClass('active');
    kit.redraw();
    updateObject();
    return false;
  });

  $('.addObject').click(function() {
    if(kit.objList.length>3) {
      return false;
    }
    kit.addObject();
    var ob = kit.objList.length;
    $('.object [data="'+ob+'"]').removeClass('disabled').addClass('active');
    updateInterface();
    return false;
  });

  var index = 0;
  var dropdownHTML = '';
  kit._u.each(kit.constants.SOURCE_MODES, function(label, mode) {
    dropdownHTML += '<option value="'+index+'">'+label+'</option>\n'
    index++;
  });
  $('#sourceMode').html(dropdownHTML).change(function() {
    var key = kit._u.getKeys(kit.constants.SOURCE_MODES)[this.value];
    kit.sourceMode = key;
    kit.redraw();
  });

  $('#imageButton').click(function() {
    kit.settingShelf = {'editMode': kit.editMode, 'toggleCurveColor': kit.toggleCurveColor};
    kit.editMode = constants.EDIT_NONE;
    kit.toggleCurveColor = false;
    kit.redraw();
    window.open(kit.canvas.toDataURL('image/png'));
    kit.editMode = kit.settingShelf.editMode;
    kit.toggleCurveColor = kit.settingShelf.toggleCurveColor;
    kit.redraw();
  });
  $('#removeObject').click(function() {
    kit.removeObject();
  });
  $('#removeSegment').click(function() {
    kit.removeSegment();
  });
  $('#removeLast').click(function() {
    kit.removeLast();
  });
  initColorPickers();
}
function backwardFrame() {
  if(kit.segment > 0) {
    kit.segment--;
    $('#rotation').val(kit.getRotation());
    $('#length').val(kit.keyFrames[kit.segment].timing);
    for( var i=0; i<kit.objList.length; i++) {
      kit.objList[i].setState(kit.keyFrames[kit.segment].obj[i]);
    }
    $('#segmentId').html(kit.segment);
  }
}

function forwardFrame() {
  kit.segment++;
  $('#segmentId').html(kit.segment);//kit.segment-1 + '-' + kit.segment);
  if(kit.segment >= kit.keyFrames.length) {
    kit.initFrame();
    $('#rotation').val(kit.getRotation());
    $('#length').val(kit.keyFrames[kit.segment].timing);
  } else {
    $('#rotation').val(kit.getRotation());
    kit.setState();
    $('#length').val(kit.keyFrames[kit.segment].timing );
  }
}

function initAnimationTab() {
  $('#btn-first').click(function() {
    kit.segment = 0;
    $('#rotation').val(kit.getRotation());
    $('#length').val(kit.keyFrames[kit.segment].timing);
    kit.setState();
    $('#segmentId').html(0);
  });
  $('#btn-prev').click(function() {
    backwardFrame();
  });
  $('#btn-next').click(function() {
    forwardFrame();
  });
  $('#btn-last').click(function() {
    kit.segment = kit.keyFrames.length-1;
    $('#rotation').val(kit.getRotation());
    $('#length').val(kit.keyFrames[kit.segment].timing);
    kit.setState();
    $('#segmentId').html(kit.segment);
  });

  $('#seamless').click( function() {
    if(this.checked) {
      kit.seamlessAnimation = true;
    } else {
      kit.seamlessAnimation = false;
    }
    kit.redraw();
    return true;
  });
  $('.playSegment').click(function() {
    kit.animationMode = true;
    if(kit.segment === 0) {
      if(kit.keyFrames.length < 2) {
        return;
      }
    } else {
      kit.segment--;
    }
    kit.setState();
    kit.segment++;
    kit.setTime = 0;
    kit.loopStartTime = new Date().getTime();
    $(this).attr('disabled', true);
    $('.playSegment, .playAll, .makeGIF').attr('disabled', true);
    $('.stop').attr('disabled', false);
    kit.segmentLoop();
  });
  $('.playAll').click(function() {
    playAll();
  });
  $('.stop').click(function() {
    stopScene();
  });
  $('.form-field').focus(function() {
    kit.fieldFocus = true;
  });
  $('.form-field').blur(function() {
    kit.fieldFocus = false;
  });
  $('#rotation').change(function() {
    kit.setRotation(kit._u.degreesToRadians(parseFloat($(this).val())));
  });
  $('#length').change(function() {
    kit.keyFrames[kit.segment].timing = parseFloat($(this).val());
  });
  $('#makeGIF').click(function() {
    $('.playSegment, .playAll, #makeGIF').attr('disabled', true);
    kit.gifInit();
    kit.sceneLoop();
  });

  $('#edit-shape').click(function(){
    $('.edit-mode button').removeClass('active');
    $(this).addClass('active');
    kit.editMode = kit.constants.EDIT_SHAPE;
    kit.redraw();
  });
  $('#edit-transform').click(function(){
    $('.edit-mode button').removeClass('active');
    $(this).addClass('active');
    kit.editMode = kit.constants.EDIT_TRANSFORM;
    kit.redraw();
  });
  $('#edit-none').click(function(){
    $('.edit-mode button').removeClass('active');
    $(this).addClass('active');
    kit.editMode = kit.constants.EDIT_NONE;
    kit.redraw();
  });
}

function stopScene() {
  kit.stopScene();
  $(this).attr('disabled', true);
  $('.playSegment, .playAll, #makeGIF').attr('disabled', false);
  $('#segmentId').html(0);
}

function playAll() {
  kit.loopInit();
  kit.sceneLoop();
  $('.playSegment, .playAll, .makeGIF').attr('disabled', true);
  $('.stop').attr('disabled', false);
}

function initLoadTab() {
  $('#load-data').click(function() {
    var dataz = $.parseJSON($('#data-json-text').val());
    kit.loadData(dataz, false);
    updateInterface();
  });
  $('#get-data').click(function() {
    var settings = kit.getSettings();
    $('#data-json-text').val(JSON.stringify([settings, kit.resourceList, kit.objTypes, kit.keyFrames]));
  });
  $('.load-sample').click(function() {
    var dataz = $.parseJSON(sampleJSON);
    kit.loadData(dataz, false);
    updateInterface();
  });
  $('.clear-scene').click(function() {
    kit.clearScene();
  });

  // IMAGE RESOURCES
  $('#backgroundImageSource, #fillImageSource').focus(function() {
    kit.fieldFocus = true;
  });
  $('#backgroundImageSource').blur(function() {
    kit.fieldFocus = false;
    kit.backgroundImageSource = $(this).val();
    kit.backgroundImageExists = false;
    kit.backgroundImage = new Image();
    kit.backgroundImage.onload = function () {
      kit.backgroundImageExists = true;
      kit.redraw();
    };
    kit.backgroundImage.src = $(this).val();
    kit.redraw();
  });
  $('#backgroundImageLabel').change(function() {
    kit.backgroundImageLabel = $(this).val();
  });
  $('#backgroundImagePage').change(function() {
    kit.backgroundImagePage = $(this).val();
  });
  $('#fillImageSource').blur(function() {
    kit.fieldFocus = false;
    kit.addFillImage($(this).val());
    kit.redraw();
  });
}

function getSampleJSON() {
  return $.parseJSON(sampleJSON);
}

// (Debug) Select default tab pane
function mode(type) {
  if(type === 'shape') {
    $('#tabs li:nth-child(1) a')[0].click();
  } else if(type==='animation') {
    $('#tabs li:nth-child(2) a')[0].click();
  } else if(type==='data') {
    $('#tabs li:nth-child(3) a')[0].click();
  }
}

// COLOR PICKER
var currentSelector;
window.dhx_globalImgPath='img/cp/';
var paletteWidth = 45;
var paletteHeight = 45;

function initColorPickers() {
  var kit = window.kit;
  var x = new dhtmlXColorPicker('cpc-line', false, false, false, false);
  var y = new dhtmlXColorPicker('cpc-bodybg', false, false, false, false);
  var z = new dhtmlXColorPicker('cpc-bg', false, false, false, false);
  x.init();y.init();z.init();
  x.setOnSelectHandler(setColor);
  y.setOnSelectHandler(setColor);
  z.setOnSelectHandler(setColor);
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
    selectObject(1);
  } else if(keyPressed === '2') { 
    selectObject(2);
  } else if(keyPressed === '3') { 
    selectObject(3);
  } else if(keyPressed === '4') { 
    selectObject(4);

  // KEYFRAME SELECTION
  // LEFT CURSOR (BACK)
  } else if(event.keyCode=='37'||keyPressed=='%') { 
    backwardFrame();
  // RIGHT CURSOR (FORWARD)
  } else if(event.keyCode=='39'||keyPressed=="'") { 
    forwardFrame();
  // 65 A KEY (STOP)
  } else if(keyPressed == 'A') { 
    kit.stopScene();
    $(this).attr('disabled', true);
    $('.playSegment, .playAll, #makeGIF').attr('disabled', false);
    $('#segmentId').html(0);
  // 83 S KEY (START)
  } else if (keyPressed == 'S') { 
    kit.loopInit();
    kit.sceneLoop();
    $('.playSegment, .playAll, .makeGIF').attr('disabled', true);
    $('#stop').attr('disabled', false);

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
  return false;
}

function selectObject(object) {
  var val=parseFloat(object);
  if(kit.selectedObject!==val-1&&val<=kit.objList.length
    &&val<=kit.constants.MAX_OBJECTS&&val>=1) {
    $('.object div').removeClass('active');
    $('.object [data="'+val+'"]').removeClass('disabled').addClass('active');
    kit.selectedObject=val-1;
    updateObject();
    kit.redraw();
  }
}

var sampleJSON = '[{"backgroundColor":"010201","backgroundAlpha":"1","lineColor":"9fb4f4","sourceMode":"lighter","seamlessAnimation":true},{"fillImageSource":"img/darkmountain.jpg"}, \
[["flower","12",1],["flower",6,2]],[{"obj":[{"shapePoints":[{"x":-0.5590233628997393,"y":-2.0863035929598417},{"x":12.1485961292003,"y":-128.88002328150233},{"x":-49.11165462656021,"y":-78.63714243359995},{"x":0,"y":-132.16734734352232}], \
"rotation":5.754529970058761,"scale":0.834656832,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-30.122221832793045,"y":-17.391072883752692},{"x":85.9704641350211,"y":-161.39240506329114},{"x":10.021097046413503,"y":-69.62025316455697},{"x":0,"y":-227.27272727272725}], \
"rotation":0,"scale":0.948,"position":{"x":250,"y":250}}],"timing":1.5},{"obj":[{"shapePoints":[{"x":-66.54834810398798,"y":-248.36181628386313},{"x":49.62409043622804,"y":-209.6660121056433},{"x":-2.8280655533554153,"y":-179.2534302318673},{"x":0,"y":-216.07629402658225}], \
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
