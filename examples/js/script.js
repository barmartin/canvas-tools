function initInterface() {
  initShapePanel();
  initAnimationPanel()

  // for debuggin
  mode('animation');
}

function initShapePanel(){
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
  $('#k').blur( function() {
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
  for(var i=1; i<5; i++) {
    $('#object'+i+', #object_'+i).click(function() {
      kit.selectedObject = parseInt($(this).attr('data'));
      $(this).parent().parent().children().removeClass('active');
      $(this).parent().addClass('active');
      setInputCells();
      kit.redraw();
      return false;
    });
  }
  $('.objectPlus').click(function() {
    if(kit.objList.length>3) {
      return;
    }
    kit.addObject();
    $('#object_ label, #object label').removeClass('active');
    var ob = kit.objList.length;
    var newShit = $('#object_ :nth-child('+ob+'), #object :nth-child('+ob+')');
    newShit.removeClass('disabled').addClass('active');
    setInputCells();
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

function initAnimationPanel(){
  $('#btn-first').click(function() {
    kit.segment = 0;
    $('#rotation').val(kit.keyFrames[kit.segment].obj[kit.selectedObject].rotation);
    $('#length').val(kit.keyFrames[kit.segment].timing);
    kit.setState();
    $('#segmentId').html(0);
  });
  $('#btn-left').click(function() {
    if(kit.segment > 0) {
      kit.segment--;
      $('#rotation').val(kit.keyFrames[kit.segment].obj[kit.selectedObject].rotation);
      $('#length').val(kit.keyFrames[kit.segment].timing);
      for( var i=0; i<kit.objList.length; i++) {
        kit.objList[i].setState(kit.keyFrames[kit.segment].obj[i]);
      }
      if(kit.segment === 0) {
        $('#segmentId').html(kit.segment);
      } else {
        $('#segmentId').html(kit.segment-1 + '-' + kit.segment);
      }
    }
  });
  $('#btn-right').click(function() {
    kit.segment++;
    $('#segmentId').html(kit.segment-1 + '-' + kit.segment);
    if(kit.segment >= kit.keyFrames.length) {
      kit.initFrame();
      $('#rotation').val(kit.keyFrames[kit.segment].obj[kit.selectedObject].rotation);
      $('#length').val(kit.keyFrames[kit.segment].timing);
    } else {
      $('#rotation').val(kit.keyFrames[kit.segment].obj[kit.selectedObject].rotation);
      kit.setState();
      $('#length').val(kit.keyFrames[kit.segment].timing );
    }
  });
  $('#btn-last').click(function() {
    kit.segment = kit.keyFrames.length-1;
    $('#rotation').val(kit.keyFrames[kit.segment].obj[kit.selectedObject].rotation);
    $('#length').val(kit.keyFrames[kit.segment].timing);
    kit.setState();
    if(kit.segment === 0) {
      $('#segmentId').html(kit.segment);
    } else {
      $('#segmentId').html(kit.segment-1 + '-' + kit.segment);
    }
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
    kit.loopInit();
    kit.sceneLoop();
    $('#playSegment, #playAll, #makeGIF').attr('disabled', true);
    $('#stop').attr('disabled', false);
  });
  $('#stop').click(function() {
    kit.sceneReset();
    $(this).attr('disabled', true);
    $('#playSegment, #playAll, #makeGIF').attr('disabled', false);
    $('#segmentId').html(0);
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



function setColor(color) {
  var kit = window.kit;
  if(currentSelector == 'bg-color') {
    $(currentSelector).attr('style', 'background-color:' + color + ';');
    $(currentSelector+' img').hide();
    injectColor(currentSelector, color.substring(1));
    $(currentSelector+'+ img').show();
    kit.backgroundColor = color.substring(1);
    kit.redraw();
  } else if(currentSelector == 'line-color') {
    $(currentSelector).attr('style', 'background-color:' + color + ';');
    $(currentSelector+' img').hide();
    injectColor(currentSelector, color.substring(1));
    $(currentSelector+'+ img').show();
    kit.lineColor = color.substring(1);
    kit.redraw();
  } else if( currentSelector == 'bodybg-color') {
    $(currentSelector).attr('style', 'background-color:' + color + ';');
    $(currentSelector+' img').hide();
    injectColor(currentSelector, color.substring(1));
    $(currentSelector+'+ img').show();
    $('body, html').attr('style', 'background-color:'+color);
  }
  $(".cpc").hide();
}

function injectColor(id, color) {
  var thisC = $('#' + id);
  var theseC = new Array(decodeFromHex(color.substring(0, 2)), decodeFromHex(color.substring(2, 4)),decodeFromHex(color.substring(4, 6)));
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