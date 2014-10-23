function initInterface() {
  initPanel();
  initColorPickers();
}

function initPanel(){
  $('#shapeEdit').click( function() {
    cKit.inCurveEditMode = !cKit.inCurveEditMode;
    cKit.redraw();
  });
  $('#shapeColor').click( function() {
    cKit.toggleCurveColor = !cKit.toggleCurveColor;
    cKit.redraw();
  });
  $('#k').change( function() {
    cKit.update();
    return true;
  });
  $('#k').blur( function() {
    cKit.update();
    return true;
  });
  $('#myCanvas').mousedown(function(event) {
    event.preventDefault();
  });
  $('#bgAlpha').change(function() {
    var newAlpha = parseFloat($(this).val());
    if( cKit.dnexist(newAlpha) || newAlpha > 1 ) {
      cKit.backgroundAlpha = 1.0;
      $(this).val('1.0');
    } else if( newAlpha < 0) {
      cKit.backgroundAlpha = 0.0;
      $(this).val('0.0');
    } else {
      cKit.backgroundAlpha = newAlpha;
    }
    cKit.redraw();
  });
  for(var i=1; i<5; i++) {
    $('#object'+i+', #object_'+i).click(function() {
      cKit.selectedObject = parseInt($(this).attr('data'));
      $(this).parent().parent().children().removeClass('active');
      $(this).parent().addClass('active');
      setInputCells();
      cKit.redraw();
      return false;
    });
  }
  $('.objectPlus').click(function() {
    if(cKit.objList.length>3) {
      return;
    }
    cKit.addObject();
    $('#object_ label, #object label').removeClass('active');
    var ob = cKit.objList.length;
    var newShit = $('#object_ :nth-child('+ob+'), #object :nth-child('+ob+')');
    newShit.removeClass('disabled').addClass('active');
    setInputCells();
    return false;
  });

    $('#imageButton').click(function() {
      var highlightMode = cKit.inCurveEditMode;
      cKit.inCurveEditMode = false;
      cKit.redraw();
      window.open(cKit.canvas.toDataURL('image/png'));
      cKit.inCurveEditMode = highlightMode;
      cKit.redraw();
    });

    /* Disabled now that there are multiple objects in the scene.
    $('#linkButton').click(function(){
      var x1,y1,x2,y2,x3,y3,x4,y4;
      var cpList = cKit.objList[0].controlPoints;
      x1=cKit.cpFormat(cpList[0].x);y1=cKit.cpFormat(cpList[0].y);
      x2=cKit.cpFormat(cpList[1].x);y2=cKit.cpFormat(cpList[1].y);
      x3=cKit.cpFormat(cpList[2].x);y3=cKit.cpFormat(cpList[2].y);
      x4=cKit.cpFormat(cpList[3].x);y4=cKit.cpFormat(cpList[3].y);
      var cpString = x1;
      cpString = cpString.concat(y1,x2,y2,x3,y3,x4,y4);
      var urlString = '#f/' + cKit.k + '/' + cKit.backgroundColor + cKit.encodeToHex(cKit.backgroundAlpha)+'/' + cKit.lineColor +
              '/' + cpString;
      window.location = urlString;
    }); */

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
  var kit = window.cKit;
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
  var kit = window.cKit;
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
  $('#animation input[name="rotation"]').val(0);//cKit.keyFrames[cKit.segment].obj[cKit.selectedObject].rotation);
  $('#animation input#length').val(1.0);//cKit.keyFrames[cKit.segment].timing);
  $('#shape #k').val(6);//cKit.objTypes[cKit.selectedObject][1]);
}