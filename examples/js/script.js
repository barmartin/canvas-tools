function initInterface() {
  initShapePanel();
  initAnimationPanel();
  initLoadEvents();
  initKeyboard();
  kit.encoder = new GIFEncoder();
  updateInterface();
  // for debuggin
  mode('animation');
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

function initShapePanel() {
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
    if( kit.dnexist(newAlpha) || newAlpha > 1 ) {
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

function initAnimationPanel() {
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
  /*$('#clear-frame').click(function() {
    if(kit.segment>0) {
      kit.keyFrames[kit.segment] = kit.keyFrames[kit.segment-1];
    }
  });
  $('#insert-frame').click(function() {
    // frame always exist after moving into state, initialized on right -> click from previous states
    kit.keyFrames.insert(kit.segment, {});
    kit.keyFrames[kit.segment].obj = [];
    kit.getState();
  });
  $('#delete-frame').click(function() {
    // frame always exist after moving into state, initialized on right -> click from previous states
    if(kit.keyFrames.length<2) {
      return;
    }
    delete kit.keyFrames[kit.segment];
    if(kit.segment<kit.keyFrames.length) {
      kit.setState();
    } else {
      kit.segment--;
    }
  });*/
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

function initLoadEvents() {
  $('#load-data').click(function() {
    var dataz = $.parseJSON($('#data-json-text').val());
    kit.loadData(dataz, false);
    updateInterface();
  });
  $('#get-data').click(function() {
    var daSettings = {'backgroundColor':kit.backgroundColor, 'backgroundAlpha':kit.backgroundAlpha, 'lineColor':kit.lineColor, 'positions':kit.positions, 'sourceMode': kit.sourceMode};
    $('#data-json-text').val(JSON.stringify([daSettings, kit.resourceList, kit.objTypes, kit.keyFrames]));
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

// COLOR PICKER CODE
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

// LEGACY CODE
/* 
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

function setInputCells(){
  // TODO
  $('#animation input[name="rotation"]').val(0);//kit.keyFrames[kit.segment].obj[kit.selectedObject].rotation);
  $('#animation input#length').val(1.0);//kit.keyFrames[kit.segment].timing);
  $('#shape #k').val(6);//kit.objTypes[kit.selectedObject][1]);
}

/* Disabled now that there are multiple objects in the scene.
$('#linkButton').click(function(){
  var x1,y1,x2,y2,x3,y3,x4,y4;
  var cpList = kit.objList[0].controlPoints;
  x1=kit.cpFormat(cpList[0].x);y1=kit.cpFormat(cpList[0].y);
  x2=kit.cpFormat(cpList[1].x);y2=kit.cpFormat(cpList[1].y);
  x3=kit.cpFormat(cpList[2].x);y3=kit.cpFormat(cpList[2].y);
  x4=kit.cpFormat(cpList[3].x);y4=kit.cpFormat(cpList[3].y);
  var cpString = x1;
  cpString = cpString.concat(y1,x2,y2,x3,y3,x4,y4);
  var urlString = '#f/' + kit.k + '/' + kit.backgroundColor + kit.encodeToHex(kit.backgroundAlpha)+'/' + kit.lineColor +
          '/' + cpString;
  window.location = urlString;
}); */

//"backgroundImageSource":"img/radials.jpg", \
//"backgroundImagePage":"http://serescosmicos.tumblr.com/post/94587874401", \
var sampleJSON = '[{"backgroundColor":"010201","backgroundAlpha":1,"lineColor":"9fb4f4","sourceMode":"lighter"}, \
{"fillImageSource":"img/darkmountain.jpg", "fillImagePage":"http://serescosmicos.tumblr.com/post/94587874401"},[["flower",6,2],["flower",6,1],["flower","12",1]], \
[{"obj":[{"shapePoints":[{"x":-141.79099936173662,"y":-81.86307165016471},{"x":18.5,"y":-145},{"x":23.5,"y":108},{"x":0,"y":-151}],"rotation":0}, \
{"shapePoints":[{"x":-2.3048861143232213,"y":-3.9921798556678283},{"x":19.5,"y":-120},{"x":-8.5,"y":-289},{"x":0,"y":-163}],"rotation":0}, \
{"shapePoints":[{"x":-9.74377581562431,"y":-36.36426640147081},{"x":-69.5,"y":-250},{"x":-0.5,"y":-206},{"x":0,"y":193}],"rotation":0}],"timing":1}, \
{"obj":[{"shapePoints":[{"x":-126.49975296418566,"y":-73.03466642629377},{"x":85.5,"y":-134},{"x":-8.5,"y":128},{"x":0,"y":-151}],"rotation":4.696703992269068}, \
{"shapePoints":[{"x":-88.08837891572303,"y":-152.57354783841137},{"x":36.5,"y":-216},{"x":206.5,"y":-115},{"x":0,"y":-199}],"rotation":4.701578590710583}, \
{"shapePoints":[{"x":-75.49102030073418,"y":-281.7363232775535},{"x":-19.5,"y":-299},{"x":201.5,"y":-189},{"x":0,"y":-290.9090909090909}],"rotation":0}],"timing":1}, \
{"obj":[{"shapePoints":[{"x":-126.49975296418566,"y":-73.03466642629377},{"x":24.5,"y":-123},{"x":4.5,"y":95},{"x":0,"y":-200}],"rotation":3.1540920026091546}, \
{"shapePoints":[{"x":-8.097067370350821,"y":-14.02453207775575},{"x":42.5,"y":-224},{"x":16.5,"y":59},{"x":0,"y":-199}],"rotation":3.1458661318481425}, \
{"shapePoints":[{"x":-64.04464065994941,"y":-239.01785289542278},{"x":66.5,"y":-57},{"x":-55.5,"y":-162},{"x":0,"y":-290.9090909090909}],"rotation":0}],"timing":1}, \
{"obj":[{"shapePoints":[{"x":-126.49975296418566,"y":-73.03466642629377},{"x":24.5,"y":-123},{"x":4.5,"y":95},{"x":0,"y":-200}],"rotation":1.5626332428118657}, \
{"shapePoints":[{"x":-115.2055228710846,"y":-199.54181892525688},{"x":263.5,"y":-131},{"x":48.5,"y":16},{"x":0,"y":-199}],"rotation":1.5531770048972708}, \
{"shapePoints":[{"x":-76.14351177448445,"y":-284.17145460909506},{"x":145.5,"y":-149},{"x":-138.5,"y":-257},{"x":0,"y":-290.9090909090909}],"rotation":0}],"timing":1}]]'
