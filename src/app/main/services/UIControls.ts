module cKit.app.services {

  declare var dhtmlXColorPicker;
  declare var cKit: any;
  declare var window: any;

  export function initLibUI() {
    initColorPickers();
    initKeyboard();
  }

  // COLOR PICKER
  var currentSelector = '';
  window.dhx_globalImgPath = 'assets/styles/img/cp/';

  function initColorPickers() {
    var kit = cKit.kit;
    var x = new dhtmlXColorPicker('cpc-line', false, false, false, false);
    var y = new dhtmlXColorPicker('cpc-bodybg', false, false, false, false);
    var z = new dhtmlXColorPicker('cpc-bg', false, false, false, false);
    x.init();
    y.init();
    z.init();
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
    x.hide();
    y.hide();
    z.hide();
    injectColor('bg-color', kit.backgroundColor);
    injectColor('line-color', kit.lineColor);
    injectColor('bodybg-color', kit.bodybg);
    $('body, html').attr('style', 'background-color:#' + kit.bodybg);

    $('#bg-color').click(function () {
      z.hide();
      z.setColor($(this).attr('color'));
      currentSelector = $(this).attr('id');
      $('#cpc-bg').attr('style', 'width: 252px;');
      z.show();
    });
    $('#bodybg-color').click(function () {
      y.hide();
      y.setColor($(this).attr('color'));
      currentSelector = $(this).attr('id');
      $('#cpc-bodybg').attr('style', 'width: 252px; top:' + 53 + 'px;');
      y.show();
    });
    $('#line-color').click(function () {
      x.hide();
      x.setColor($(this).attr('color'));
      currentSelector = $(this).attr('id');
      $('#cpc-line').attr('style', 'width: 252px;');
      x.show();
    });
  }

  function setColor(color) {
    var kit = cKit.kit;
    if (currentSelector === 'bg-color') {
      $(currentSelector).attr('style', 'background-color:' + color + ';');
      $(currentSelector + ' img').hide();
      injectColor(currentSelector, color.substring(1));
      $(currentSelector + '+ img').show();
      kit.backgroundColor = color.substring(1);
      kit.redraw();
    } else if (currentSelector === 'line-color') {
      $(currentSelector).attr('style', 'background-color:' + color + ';');
      $(currentSelector + ' img').hide();
      injectColor(currentSelector, color.substring(1));
      $(currentSelector + '+ img').show();
      kit.lineColor = color.substring(1);
      kit.redraw();
    } else if (currentSelector === 'bodybg-color') {
      $(currentSelector).attr('style', 'background-color:' + color + ';');
      $(currentSelector + ' img').hide();
      injectColor(currentSelector, color.substring(1));
      $(currentSelector + '+ img').show();
      $('body, html').attr('style', 'background-color:' + color);
    }
    $('.cpc').hide();
  }

  function injectColor(id, color) {
    var kit = cKit.kit;
    var thisC = $('#' + id);
    var theseC = new Array(kit._u.decodeFromHex(color.substring(0, 2)), kit._u.decodeFromHex(color.substring(2, 4)), kit._u.decodeFromHex(color.substring(4, 6)));
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
    var kit = cKit.kit;
    if (kit.fieldFocus == true) {
      return false;
    }
    var keyPressed = String.fromCharCode(event.keyCode);

    // OBJECT SELECTION
    if (keyPressed === '1') {
      kit.selectObject(0);
    } else if (keyPressed === '2') {
      kit.selectObject(1);
    } else if (keyPressed === '3') {
      kit.selectObject(2);
    } else if (keyPressed === '4') {
      kit.selectObject(3);

      // KEYFRAME SELECTION
      // LEFT CURSOR (BACK)
    } else if (event.keyCode == '37' || keyPressed == '%') {
      kit.selectPrev();
      // RIGHT CURSOR (FORWARD)
    } else if (event.keyCode == '39' || keyPressed == "'") {
      kit.selectNext();
      // 65 A KEY (STOP)
    } else if (keyPressed == 'A') {
      kit.stopScene();
      // 83 S KEY (START)
    } else if (keyPressed == 'S') {
      kit.play();

      // EDIT MODES
    } else if (keyPressed == 'Q') {
      $('.edit-mode button').removeClass('active');
      $('#edit-shape').addClass('active');
      kit.editMode = cKit.events.controlModes.EDIT_SHAPE;
      kit.redraw();
    } else if (keyPressed == 'W') {
      $('.edit-mode button').removeClass('active');
      $('#edit-transform').addClass('active');
      kit.editMode = cKit.events.controlModes.EDIT_TRANSFORM;
      kit.redraw();
    } else if (keyPressed == 'E') {
      $('.edit-mode button').removeClass('active');
      $('#edit-none').addClass('active');
      kit.editMode = cKit.events.controlModes.EDIT_NONE;
      kit.redraw();
    }
    kit.digest();
    return false;
  }

  declare var JXG;
  export function getSampleJSON() {
    var encodedPatch = sampleJSON;//.replace(cKit.app.ui.loading.prefixString, '').replace(cKit.app.ui.loading.postfixString, '');
    return $.parseJSON(JXG.Util.Base64.decode(encodedPatch));
  }

  var sampleJSON = //----------Start Canvas Kit Patch----------
    'eyJzY2VuZVNldHRpbmdzIjp7InNldHRpbmdTaGVsZiI6eyJlZGl0TW9kZSI6MiwidG9nZ2xlQ3VydmVDb2xvciI6ZmFsc2V9LCJiYWNrZ3JvdW5kQ29sb3IiOiIwMTAyMDEiLCJiYWNrZ3JvdW5kQWxwaGEiOjEsImxpbmVDb2xvciI6IjlmYjRmNCJ9LCJrZXlmcmFtZXMiOlt7Im9ialN0YXRlcyI6W3siY1BTdGF0ZXMiOlt7IngiOi0xODIuODU2LCJ5IjotMTA1LjU3Mn0seyJ4IjotMjcwLjk2Nzc0MTkzNTQ4Mzg0LCJ5IjotMzk0LjgzODcwOTY3NzQxOTMzfSx7IngiOi00MCwieSI6LTguMDAwMDAwMDAwMDAwMDAxZS0xMX0seyJ4IjowLCJ5IjotMTE4LjcwOTY3NzQxOTM1NDgzfV0sImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjAsInNjYWxlIjowLjc3NSwiY2VudGVyIjp7IngiOjQxMCwieSI6Mzk0fX19XSwidGltZXN0YW1wIjowfSx7Im9ialN0YXRlcyI6W3siY1BTdGF0ZXMiOlt7IngiOi0xNjUuMjI5LCJ5IjotOTUuMzk1fSx7IngiOjMwMy40MzkzMjQ2ODUwOTczNSwieSI6LTEyOC42OTE3ODc3NTE0MDI2NH0seyJ4IjotMTI0LjgwNTQ5MTEyMDg0NTI1LCJ5IjotMjI4LjAwMTI5MjUwOTY3OTl9LHsieCI6MCwieSI6MzA4LjkyNDAxNzUxMDQ4MDd9XSwiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6NC42NDQ0MzA5NjM0Mzg0NjYsInNjYWxlIjoxLCJjZW50ZXIiOnsieCI6NDE1LCJ5IjozOTJ9fX1dLCJ0aW1lc3RhbXAiOjEwMDB9LHsib2JqU3RhdGVzIjpbeyJjUFN0YXRlcyI6W3sieCI6LTUuNjU3LCJ5IjotOS43OTh9LHsieCI6LTM2MSwieSI6LTcuMDAwMDAwMDAwMDAwMDQ0fSx7IngiOjExOCwieSI6NTEuMDAwMDAwMDAwMDAwMDE0fSx7IngiOjAsInkiOi0yODd9XSwiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6My4xNDE1OTI2NTM1ODk3OTMsInNjYWxlIjoxLCJjZW50ZXIiOnsieCI6NDEyLCJ5IjozODh9fX1dLCJ0aW1lc3RhbXAiOjIwMDB9LHsib2JqU3RhdGVzIjpbeyJjUFN0YXRlcyI6W3sieCI6LTIzMi4yODksInkiOi0xMzQuMTEyfSx7IngiOjMzMywieSI6LTE2Mi45OTk5OTk5OTk5OTk5N30seyJ4IjotMTg4LCJ5IjoxMDUuOTk5OTk5OTk5OTk5OTl9LHsieCI6MCwieSI6LTI0Nn1dLCJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjoxLjU3MDc5NjMyNjc5NDg5NjYsInNjYWxlIjoxLCJjZW50ZXIiOnsieCI6NDAwLCJ5Ijo0MDB9fX1dLCJ0aW1lc3RhbXAiOjMwMDB9XSwic3RhZ2VDb25maWciOnsicGF1c2VUaW1lIjowLCJzZWFtbGVzc0FuaW1hdGlvblRpbWUiOjEwMDAsImZyYW1lUmF0ZSI6NTAsImJhY2tncm91bmRJbWFnZSI6M30sInJlc291cmNlcyI6eyJpbWFnZUxpc3QiOlt7InNyYyI6Imh0dHA6Ly80MC5tZWRpYS50dW1ibHIuY29tLzc3ZTlhMGRmNDFmNWRiNzcxMmNjZjEzOTMzOWFjYjVjL3R1bWJscl9ubGhtNzFDRjB4MXNjdWQ5am8xXzQwMC5qcGciLCJwYWdlIjoiIiwibGFiZWwiOiJtb29uLWxpbmlzdCJ9LHsic3JjIjoiaHR0cDovLzQxLm1lZGlhLnR1bWJsci5jb20vODJhYmUyMDhhNGIxODJmOWM2MTA4MWQ1ZWE4MWZhYzMvdHVtYmxyX25sajNubHdmN2Yxc2N1ZDlqbzFfNTAwLmpwZyIsInBhZ2UiOiIiLCJsYWJlbCI6IndoaXRlIGJpcmNoIn0seyJzcmMiOiJodHRwOi8vNDEubWVkaWEudHVtYmxyLmNvbS90dW1ibHJfbTA2NGZmeU9zdDFxaGV4NzRvMV8xMjgwLnBuZyIsInBhZ2UiOiJodHRwOi8vYXJjaGlsbGVjdC5jb20vMjYxMzkiLCJsYWJlbCI6InRlcm1pbmFsIn0seyJzcmMiOiJodHRwOi8vMzYubWVkaWEudHVtYmxyLmNvbS80YmZhNDNmNTY5MjFhYTFlOTAzYzk0YjJjYTdkNmM1NS90dW1ibHJfbWtsOGk3a3lWbjFxZHE2NzFvMV8xMjgwLmpwZyIsInBhZ2UiOiJodHRwOi8vYXJjaGlsbGVjdC5jb20vMjYxMjEiLCJsYWJlbCI6InR1bm5lbGluIn1dLCJvYmplY3RMaXN0IjpbeyJpZCI6IlBFVEFMX0ZMT1dFUiIsInN0YXRlcyI6eyJmaWxsSW1hZ2UiOjIsImlkIjoiUEVUQUxfRkxPV0VSIiwicGV0YWxzIjo2LCJhY2NlbnQiOjJ9fV19fQ==';
//-----------End Canvas Kit Patch-----------
}