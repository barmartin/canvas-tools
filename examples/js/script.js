function initInterface() {
  initShapePanel();
  initAnimationPanel();
  initLoadEvents();
  initKeyboard();
  kit.encoder = new GIFEncoder();
  //new GIF({workers: 2, quality: 1});
  updateInterface();
  // for debuggin
  mode('animation');
}

function updateInterface(){
  // OBJECT
  $('.object button').addClass('disabled').removeClass('active');
  for(var i=1; i<=kit.objList.length; i++) {
    var itemButton = $('.object button:nth-child('+i+')');
    itemButton.removeClass('disabled');
    if(i===kit.selectedObject+1){
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
  if(typeof kit.resourceList !== 'undefined'){
    $('#backgroundImageLabel').val(kit.resourceList.backgroundImageLabel);
    $('#backgroundImageSource').val(kit.resourceList.backgroundImageSource)
    $('#backgroundImagePage').val(kit.resourceList.backgroundImagePage)
    $('#fillImageLabel').val(kit.resourceList.fillImageLabel)
    $('#fillImageSource').val(kit.resourceList.fillImageSource)
    $('#fillImagePage').val(kit.resourceList.fillImagePage)
  }

  updateObject();
}

function updateObject() {
  $('#rotation').val(kit.keyFrames[kit.segment].obj[kit.selectedObject].rotation);
  $('#length').val(kit.keyFrames[kit.segment].timing);
}

function initShapePanel() {
  $('#shapeEdit').click( function() {
    kit.inCurveEditMode = !kit.inCurveEditMode;
    kit.redraw();
  });
  $('#shapeColor').click( function() {
    kit.toggleCurveColor = !kit.toggleCurveColor;
    kit.redraw();
  });
  $('#k').change( function() {
    kit.update();
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

    $('#imageButton').click(function() {
      var highlightMode = kit.inCurveEditMode;
      kit.inCurveEditMode = false;
      kit.redraw();
      window.open(kit.canvas.toDataURL('image/png'));
      kit.inCurveEditMode = highlightMode;
      kit.redraw();
    });

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
  initColorPickers();
}
function backwardFrame(){
  if(kit.segment > 0) {
    kit.segment--;
    $('#rotation').val(kit.keyFrames[kit.segment].obj[kit.selectedObject].rotation);
    $('#length').val(kit.keyFrames[kit.segment].timing);
    for( var i=0; i<kit.objList.length; i++) {
      kit.objList[i].setState(kit.keyFrames[kit.segment].obj[i]);
    }
    //if(kit.segment === 0) {
    $('#segmentId').html(kit.segment);
    //} else {
    //  $('#segmentId').html(kit.segment-1 + '-' + kit.segment);
    //}  
  }
}

function forwardFrame(){
  kit.segment++;
  $('#segmentId').html(kit.segment);//kit.segment-1 + '-' + kit.segment);
  if(kit.segment >= kit.keyFrames.length) {
    kit.initFrame();
    $('#rotation').val(kit.keyFrames[kit.segment].obj[kit.selectedObject].rotation);
    $('#length').val(kit.keyFrames[kit.segment].timing);
  } else {
    $('#rotation').val(kit.keyFrames[kit.segment].obj[kit.selectedObject].rotation);
    kit.setState();
    $('#length').val(kit.keyFrames[kit.segment].timing );
  }
}

function initAnimationPanel(){
  $('#btn-first').click(function() {
    kit.segment = 0;
    $('#rotation').val(kit.keyFrames[kit.segment].obj[kit.selectedObject].rotation);
    $('#length').val(kit.keyFrames[kit.segment].timing);
    kit.setState();
    $('#segmentId').html(0);
  });
  $('#btn-left').click(function() {
    backwardFrame();
  });
  $('#btn-right').click(function() {
    forwardFrame();
  });
  $('#btn-last').click(function() {
    kit.segment = kit.keyFrames.length-1;
    $('#rotation').val(kit.keyFrames[kit.segment].obj[kit.selectedObject].rotation);
    $('#length').val(kit.keyFrames[kit.segment].timing);
    kit.setState();
    //if(kit.segment === 0) {
      $('#segmentId').html(kit.segment);
    //} else {
    //  $('#segmentId').html(kit.segment-1 + '-' + kit.segment);
    //}
  });
  $('#clear-frame').click(function() {
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
    var rotation = parseFloat($(this).val());
    kit.objList[kit.selectedObject].rotation = rotation;
    kit.keyFrames[kit.segment].obj[kit.selectedObject].rotation = rotation;
    kit.objList[kit.selectedObject].allPedals = [];
    kit.objList[kit.selectedObject].createPedals();
    kit.redraw();
  });
  $('#length').change(function() {
    kit.keyFrames[kit.segment].timing = parseFloat($(this).val());
  });
  $('#makeGIF').click(function() {
    $('#playSegment, #playAll, #makeGIF').attr('disabled', true);
    kit.gifInit();
    kit.sceneLoop();
  });
}

function stopScene(){
  kit.stopScene();
  $(this).attr('disabled', true);
  $('#playSegment, #playAll, #makeGIF').attr('disabled', false);
  $('#segmentId').html(0);
}

function playAll(){
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
    var daSettings = {'backgroundColor':kit.backgroundColor, 'backgroundAlpha':kit.backgroundAlpha, 'lineColor':kit.lineColor, 'positions':kit.positions};
    $('#data-json-text').val(JSON.stringify([daSettings, kit.resourceList, kit.objTypes, kit.keyFrames]));
    kit.setState();
  });
  $('#load-sample').click(function() {
    var dataz = $.parseJSON(sampleJSON);
    kit.loadData(dataz, false);
    updateInterface();
  });
  $('#clear-scene').click(function() {
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
  $('#backgroundImageLabel').change(function(){
    kit.backgroundImageLabel = $(this).val();
  });
  $('#backgroundImagePage').change(function(){
    kit.backgroundImagePage = $(this).val();
  });
  $('#fillImageSource').blur(function() {
    kit.fieldFocus = false;
    kit.fillImageSource = $(this).val();
    kit.fillImageExists = false;
    kit.fillImage = new Image();
    kit.fillImage.onload = function () {
      kit.fillImageExists = true;
      kit.redraw();
    };
    kit.fillImage.src = $(this).val();
    kit.redraw();
  });
}

function getSampleJSON(){
  return $.parseJSON(sampleJSON);
}

// (Debug) Select default tab pane
function mode(type){
  if(type === 'shape'){
    $('#tabs li:nth-child(1) a')[0].click();
  } else if(type==='animation'){
    $('#tabs li:nth-child(2) a')[0].click();
  } else if(type==='data'){
    $('#tabs li:nth-child(3) a')[0].click();
  }
}



/*--------------------------------Color Picker Init-------------------------------------*/
var currentSelector;
window.dhx_globalImgPath='img/cp/';
var paletteWidth = 45;
var paletteHeight = 45;

function initColorPickers(){
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

function initKeyboard(){
  document.addEventListener("keydown", keyDownHandler);
}

function keyDownHandler(event){
  if(kit.fieldFocus==true){
    return false;
  }
  var keyPressed = String.fromCharCode(event.keyCode);
  if (keyPressed === '1') {   
    selectObject(1);
  } else if (keyPressed === '2') { 
    selectObject(2);
  } else if (keyPressed === '3') { 
    selectObject(3);
  } else if (keyPressed === '4') { 
    selectObject(4);
  // LEFT CURSOR
  } else if (event.keyCode=='37'||keyPressed=='%') { 
    // Back a frame
    backwardFrame();
  // RIGHT CURSOR
  } else if (event.keyCode=='39'||keyPressed=="'") { 
    forwardFrame();
  // 65 A KEY
  } else if (keyPressed == 'A') { 
    // STOP
    kit.stopScene();
    $(this).attr('disabled', true);
    $('#playSegment, #playAll, #makeGIF').attr('disabled', false);
    $('#segmentId').html(0);
  // 83 S KEY
  } else if (keyPressed == 'S') { 
    // START
    kit.loopInit();
    kit.sceneLoop();
    $('#playSegment, #playAll, #makeGIF').attr('disabled', true);
    $('#stop').attr('disabled', false);
  }
  return false;
}

function selectObject(object){
  var val=parseFloat(object);
  if(kit.selectedObject!==val-1&&val<=kit.objList.length
    &&val<=kit.constants.MAX_OBJECTS&&val>=1){
    $('.object button').removeClass('active');
    $('.object [data="'+val+'"]').removeClass('disabled').addClass('active');
    kit.selectedObject=val-1;
    kit.redraw();
  }
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
  var theseC = new Array(kit.decodeFromHex(color.substring(0, 2)), kit.decodeFromHex(color.substring(2, 4)),kit.decodeFromHex(color.substring(4, 6)));
  thisC.attr('style', 'background-color: #' + color);
  thisC.attr('color', color);
  //$('#' + id).html(gripImg(theseC[0],theseC[1] ,theseC[2]));
  return false;
}

function setInputCells(){
  // TODO
  $('#animation input[name="rotation"]').val(0);//kit.keyFrames[kit.segment].obj[kit.selectedObject].rotation);
  $('#animation input#length').val(1.0);//kit.keyFrames[kit.segment].timing);
  $('#shape #k').val(6);//kit.objTypes[kit.selectedObject][1]);
}

var sampleJSON = '[{"backgroundColor":"010201","backgroundAlpha":1,"lineColor":"9fb4f4"}, \
{"backgroundImageSource":"http://40.media.tumblr.com/56ff609390ee74b3994f311a8f13e0d5/tumblr_n4qrodAcxV1qaf77co1_1280.jpg", \
"backgroundImageLabel":"Ray Scope","backgroundImagePage":"http://serescosmicos.tumblr.com/post/94587874401", \
"fillImageSource":"http://38.media.tumblr.com/b07bed8de1b02eb756b997872d9560b5/tumblr_nd96zsHxum1tpen5so1_1280.jpg","fillImageLabel":"Dark Mountain", \
"fillImagePage":"http://universeobserver.tumblr.com/post/101015776326/gorettmisstag-by-anthony-hurd"},[["flower",6],["flower",6]], \
[{"obj":[{"controlPoints":[{"x":310,"y":302.6794919243112},{"x":408,"y":131},{"x":280,"y":70},{"x":320,"y":70}],"rotation":0}, \
{"controlPoints":[{"x":282.2044976220715,"y":254.5362695838375},{"x":191,"y":180},{"x":611,"y":148},{"x":320,"y":21}],"rotation":0}], \
"timing":1},{"obj":[{"controlPoints":[{"x":149.16308946834707,"y":24.10179115107843},{"x":476,"y":533},{"x":205,"y":249},{"x":320,"y":41}], "rotation":0}, \
{"controlPoints":[{"x":299.3844718719117,"y":284.29285785728575},{"x":232,"y":130},{"x":277,"y":605},{"x":320,"y":21}],"rotation":0}],"timing":1}, \
{"obj":[{"controlPoints":[{"x":153.89385923452443,"y":32.29572474500833},{"x":622,"y":35},{"x":205,"y":249},{"x":320,"y":591}],"rotation":0}, \
{"controlPoints":[{"x":263.7305589151625,"y":222.5384691275578},{"x":278,"y":48},{"x":277,"y":605},{"x":320,"y":56}],"rotation":0}],"timing":1}, \
{"obj":[{"controlPoints":[{"x":153.89385923452443,"y":32.29572474500833},{"x":622,"y":35},{"x":205,"y":249},{"x":320,"y":591}],"rotation":0}, \
{"controlPoints":[{"x":263.7305589151625,"y":222.5384691275578},{"x":278,"y":48},{"x":575,"y":96},{"x":320,"y":56}],"rotation":0}],"timing":1}]]';
