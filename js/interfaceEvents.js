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
  $('.object button').addClass('disabled').removeClass('active');
  for(var i=1; i<=kit.objList.length; i++) {
    var itemButton = $('.object button:nth-child('+i+')');
    itemButton.removeClass('disabled');
    if(i===kit.selectedObject+1) {
      itemButton.addClass('active');
    }
  }
  for(var index=kit.objList.length+1; index<=kit.constants.MAX_OBJECTS; index++) {
    $('.object button:nth-child('+index+')').addClass('disabled');
  }

  // ANIMATION
  $('#segmentId').html(kit.segment);
  if(kit.animationMode===true) {
    $('#playSegment, #playAll, #makeGIF').attr('disabled', true);
    $('#stop').attr('disabled', false);
  } else {
    $('#playSegment, #playAll, #makeGIF').attr('disabled', false);
    $('#stop').attr('disabled', true);
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

  $('.object button').click(function() {
    var selected = parseInt($(this).attr('data'));
    kit.selectedObject = selected-1;
    $('.object button').removeClass('active');
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
    var highlightMode = kit.inCurveEditMode;
    kit.inCurveEditMode = false;
    kit.redraw();
    window.open(kit.canvas.toDataURL('image/png'));
    kit.inCurveEditMode = highlightMode;
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
  $('#playSegment').click(function() {
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
    $('#playSegment, #playAll, #makeGIF').attr('disabled', true);
    $('#stop').attr('disabled', false);
    kit.segmentLoop();
  });
  $('#playAll').click(function() {
    playAll();
  });
  $('#stop').click(function() {
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
    $('#playSegment, #playAll, #makeGIF').attr('disabled', true);
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
  $('#playSegment, #playAll, #makeGIF').attr('disabled', false);
  $('#segmentId').html(0);
}

function playAll() {
  kit.loopInit();
  kit.sceneLoop();
  $('#playSegment, #playAll, #makeGIF').attr('disabled', true);
  $('#stop').attr('disabled', false);
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
    $('#playSegment, #playAll, #makeGIF').attr('disabled', false);
    $('#segmentId').html(0);
  // 83 S KEY (START)
  } else if (keyPressed == 'S') { 
    kit.loopInit();
    kit.sceneLoop();
    $('#playSegment, #playAll, #makeGIF').attr('disabled', true);
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
    $('.object button').removeClass('active');
    $('.object [data="'+val+'"]').removeClass('disabled').addClass('active');
    kit.selectedObject=val-1;
    updateObject();
    kit.redraw();
  }
}

var sampleJSON = '[{"backgroundColor":"010201","backgroundAlpha":"1","lineColor":"9fb4f4","sourceMode":"lighter","seamlessAnimation":true}, \
{"fillImageSource":"http://38.media.tumblr.com/b07bed8de1b02eb756b997872d9560b5/tumblr_nd96zsHxum1tpen5so1_1280.jpg","fillImageLabel":"Dark Mountain", \
"fillImagePage":"http://universeobserver.tumblr.com/post/101015776326/gorettmisstag-by-anthony-hurd"},[["flower","8",4],["flower","4",2]], \
[{"obj":[{"shapePoints":[{"x":-163.80552493734757,"y":-1.0030195589858733e-14},{"x":261.5,"y":-239},{"x":-92.5,"y":10},{"x":0,"y":-268}], \
"rotation":0,"scale":0.828,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-296,"y":-1.8124772627380827e-14},{"x":84,"y":246},{"x":-57,"y":-298}, \
{"x":0,"y":-290.9090909090909}],"rotation":3.141592653589793,"scale":0.6803757,"position":{"x":250,"y":250}}],"timing":1.5}, \
{"obj":[{"shapePoints":[{"x":-54.230987451824994,"y":-3.250690259873888e-15},{"x":-210.00000000000003,"y":150.99999999999997},{"x":82.00000000000001,"y":-55.999999999999986}, \
{"x":0,"y":-200}],"rotation":4.71238898038469,"scale":1,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-1.0457516339869284,"y":-6.403381956326032e-17},{"x":-79.94224947996697,"y":-214.9908598144234}, \
{"x":-116.11471119094998,"y":-271.7371023102122},{"x":0,"y":-9.427338904088876}],"rotation":4.704813367733494,"scale":0.822375,"position":{"x":250,"y":250}}],"timing":1.5}, \
{"obj":[{"shapePoints":[{"x":-105.00000000000001,"y":-6.4293956955236055e-15},{"x":184.94893484849825,"y":-188.10340639766721},{"x":-15.267229948755718,"y":219.8542965004137},{"x":0,"y":-268}], \
"rotation":3.133780312529692,"scale":1,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-259.43494166599584,"y":-1.5885808544912104e-14},{"x":84,"y":246},{"x":-151.62417582782027,"y":-209.11822146455873}, \
{"x":0,"y":-290.9090909090909}],"rotation":3.141592653589793,"scale":0.7535250000000001,"position":{"x":250,"y":250}}],"timing":1.5}, \
{"obj":[{"shapePoints":[{"x":-127.00393694685216,"y":-7.776748243053738e-15},{"x":260,"y":-166},{"x":-44,"y":95},{"x":0,"y":-268}], \
"rotation":1.5629839857347956,"scale":0.836,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-296,"y":-1.8124772627380827e-14},{"x":235.79041032251354,"y":149.25778954469098}, \
{"x":-193.70129497768636,"y":-200.50091411291828},{"x":0,"y":-290.9090909090909}],"rotation":1.5631628872774035,"scale":0.8233695,"position":{"x":250,"y":250}}],"timing":1.5}, \
{"obj":[{"shapePoints":[{"x":-118.87417187507191,"y":-7.278943704404956e-15},{"x":184.44917965671573,"y":78.49715970443579},{"x":-72.10251303583053,"y":41.201436020474596},{"x":0,"y":-236.28793809957676}], \
"rotation":0.790745706006599,"scale":0.9875,"position":{"x":250,"y":250}},{"shapePoints":[{"x":-30.935741095855114,"y":-1.89426781561451e-15},{"x":71.73837719949023,"y":30.48064585107325}, \
{"x":-89.02525777502746,"y":-134.90588707752391},{"x":0,"y":-122.93134763603086}],"rotation":2.3514996890048496,"scale":0.5775068298339843,"position":{"x":250,"y":250}}],"timing":1.5}]]';
