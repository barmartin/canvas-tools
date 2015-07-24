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
    var linePicker = new dhtmlXColorPicker('cpc-line', false, false, false, false);
    var backgroundPicker = new dhtmlXColorPicker('cpc-bg', false, false, false, false);

    //var y = new dhtmlXColorPicker('cpc-bodybg', false, false, false, false);
    //y.init();
    //y.setOnSelectHandler(setColor);
    /*y.setOnCancelHandler(function () {
     $('.cpc').hide();
     });*/
    //y.hide();
    //injectColor('bodybg-color', kit.bodybg);
    //$('body, html').attr('style', 'background-color:#' + kit.bodybg);
    /*$('#bodybg-color').click(function () {
     y.hide();
     y.setColor($(this).attr('color'));
     currentSelector = $(this).attr('id');
     $('#cpc-bodybg').attr('style', 'width: 252px; top:' + 53 + 'px;');
     y.show();
     });*/

    linePicker.init();
    backgroundPicker.init();

    linePicker.setOnSelectHandler(setColor);
    backgroundPicker.setOnSelectHandler(setColor);
    linePicker.setOnCancelHandler(function () {
      $('.cpc').hide();
    });
    backgroundPicker.setOnCancelHandler(function () {
      $('.cpc').hide();
    });
    linePicker.hide();
    backgroundPicker.hide();

    injectColor('bg-color', kit.getSceneAttribute('backgroundColor'));
    injectColor('line-color', kit.getSceneAttribute('lineColor'));

    $('#bg-color').click(function () {
      $('.cpc').hide();
      backgroundPicker.hide();
      backgroundPicker.setColor($(this).attr('color'));
      currentSelector = $(this).attr('id');
      $('#cpc-bg').attr('style', 'width: 252px;');
      backgroundPicker.show();
    });
    $('#line-color').click(function () {
      $('.cpc').hide();
      linePicker.hide();
      linePicker.setColor($(this).attr('color'));
      currentSelector = $(this).attr('id');
      $('#cpc-line').attr('style', 'width: 252px;');
      linePicker.show();
    });

    function colorFunc() {
      injectColor('bg-color', cKit.kit.getSceneAttribute('backgroundColor'));
      injectColor('line-color', cKit.kit.getSceneAttribute('lineColor'));
    }
    cKit.kit.setColorFunc(colorFunc);
  }

  function setColor(color) {
    var kit = cKit.kit;
    if (currentSelector === 'bg-color') {
      injectColor(currentSelector, color.substring(1));
      $(currentSelector + '+ img').show();
      kit.setSceneAttribute('backgroundColor', color.substring(1));
      kit.redraw();
    } else if (currentSelector === 'line-color') {
      injectColor(currentSelector, color.substring(1));
      $(currentSelector + '+ img').show();
      kit.setSceneAttribute('lineColor', color.substring(1));
      kit.redraw();
    }/* else if (currentSelector === 'bodybg-color') {
      $(currentSelector).attr('style', 'background-color:' + color + ';');
      $(currentSelector + ' img').hide();
      injectColor(currentSelector, color.substring(1));
      $(currentSelector + '+ img').show();
      $('body, html').attr('style', 'background-color:' + color);
    }*/
    $('.cpc').hide();
  }

  function injectColor(id, color) {
    var thisC = $('#' + id);
    thisC.attr('style', 'background-color: #' + color);
    thisC.attr('color', color);
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
    'eyJzY2VuZVNldHRpbmdzIjp7InNldHRpbmdTaGVsZiI6eyJlZGl0TW9kZSI6MCwidG9nZ2xlQ3VydmVDb2xvciI6ZmFsc2V9fSwia2V5ZnJhbWVzIjpbeyJvYmpTdGF0ZXMiOlt7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjAsInNjYWxlIjowLjM1MzE3MzMzMzMzMzMzMzQsImNlbnRlciI6eyJ4Ijo2MjIsInkiOjU5Mn19LCJjUFN0YXRlcyI6W3sieCI6MCwieSI6MH0seyJ4IjotMjEwLjAwMDAwMDAwMDA2LCJ5IjotMS4yODU4NzkxMzkxMDUwODgyZS0xNH0seyJ4IjotNzAsInkiOi0zMzR9LHsieCI6MCwieSI6LTQyMH1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjAsInNjYWxlIjowLjQ1MzMzMzMzMzMzMzMzMzMsImNlbnRlciI6eyJ4Ijo2MjAsInkiOjU5Mn19LCJjUFN0YXRlcyI6W3sieCI6LTE5NS40MjUsInkiOi0xMTIuODI5fSx7IngiOi0yMTAuMDAwMDAwMDAwMDYsInkiOi0xLjI4NTg3OTEzOTEwNTA4ODJlLTE0fSx7IngiOi01OSwieSI6LTE0fSx7IngiOjAsInkiOi00MjB9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjowLCJzY2FsZSI6MC41NDY2NjY2NjY2NjY2NjY2LCJjZW50ZXIiOnsieCI6NjIxLCJ5Ijo1OTR9fSwiY1BTdGF0ZXMiOlt7IngiOi01MC40NDgsInkiOjB9LHsieCI6LTIxMC4wMDAwMDAwMDAwNiwieSI6LTEuMjg1ODc5MTM5MTA1MDg4MmUtMTR9LHsieCI6MTcsInkiOjE4MH0seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MC4zMzI2NzM2NTUyMDIzNzQzNSwic2NhbGUiOjEuMDg1NDA5MzY2NTMzMzgxMywiY2VudGVyIjp7IngiOjEwMiwieSI6OTkwfSwidGV4dCI6InciLCJmb250U2l6ZSI6IjMwIn0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfV19XSwidGltZXN0YW1wIjowfSx7Im9ialN0YXRlcyI6W3siYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MCwic2NhbGUiOjAuNTMwNzIyMjIyMjIyMjIyMiwiY2VudGVyIjp7IngiOjYyMCwieSI6NTkzfX0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfSx7IngiOi0yMTAuMDAwMDAwMDAwMDYsInkiOi0xLjI4NTg3OTEzOTEwNTA4ODJlLTE0fSx7IngiOi00MCwieSI6LTQyMH0seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6NS4yMzE5MzIzOTI5ODEzODUsInNjYWxlIjowLjY0LCJjZW50ZXIiOnsieCI6NjIwLCJ5Ijo1OTB9fSwiY1BTdGF0ZXMiOlt7IngiOi0xOTUuNDI1LCJ5IjotMTEyLjgyOX0seyJ4IjotMjEwLjAwMDAwMDAwMDA2LCJ5IjotMS4yODU4NzkxMzkxMDUwODgyZS0xNH0seyJ4IjotMTA1LjE0NTY3MDIyNTg4Mjk4LCJ5Ijo5MC4wOTA5OTg2MjIyMjU2N30seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MS4wNTM2Mjg0NDkzMzQ3NzU0LCJzY2FsZSI6MC41MiwiY2VudGVyIjp7IngiOjYyMiwieSI6NTkzfX0sImNQU3RhdGVzIjpbeyJ4IjotMzYyLjkyNywieSI6MH0seyJ4IjozNTYuMTI2MjEzNjcwOTMwMiwieSI6NzMuNzE2NDgzNDc4MzAzNX0seyJ4IjotMTk1Ljc3NDUyMDcwNDQ5NDkzLCJ5IjotMjc0LjcyMjI5MDc2NDU1Nn0seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6Ni4xMzYxMDY5NTE3OTExODM1LCJzY2FsZSI6MS4xMDY2NjY2NjY2NjY2NjY3LCJjZW50ZXIiOnsieCI6NzMsInkiOjEwNTJ9LCJ0ZXh0Ijoid2hvIn0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfV19XSwidGltZXN0YW1wIjoxMDAwfSx7Im9ialN0YXRlcyI6W3siYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MCwic2NhbGUiOjAuMzU2Mzg2NzYxNDgxNDgxNCwiY2VudGVyIjp7IngiOjYyMCwieSI6NTkyfX0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfSx7IngiOi0yMTAuMDAwMDAwMDAwMDYsInkiOi0xLjI4NTg3OTEzOTEwNTA4ODJlLTE0fSx7IngiOi00MCwieSI6LTQyMH0seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6NC4xODMwNDY1Njk4MzE0MTg1LCJzY2FsZSI6MC41NTYwNzg4MTQ4MTQ4MTQ4LCJjZW50ZXIiOnsieCI6NjIxLCJ5Ijo1OTJ9fSwiY1BTdGF0ZXMiOlt7IngiOi0zOTkuMjk4LCJ5IjotMjMwLjUzNX0seyJ4IjotMzY0LjYwMjk2NTM3MjIxNjksInkiOi0zODQuNzcyMjQxMjU2ODA2NH0seyJ4IjotMTIzLjc5Mjk2NzUzMjY5MTA1LCJ5IjotMTIuMTc3ODk3NTc5MjI1MDgyfSx7IngiOjAsInkiOi00MjB9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjoyLjA5OTQ1MTY2MzkxNTcyMiwic2NhbGUiOjAuNTExMTQ0NDQ0NDQ0NDQ0NCwiY2VudGVyIjp7IngiOjYyMSwieSI6NTkyfX0sImNQU3RhdGVzIjpbeyJ4IjotNTAuNDQ4LCJ5IjowfSx7IngiOi0yNC43MTAyMjczMTI2NjMwNSwieSI6LTY1NC45NDYxMDgyMTUxMzl9LHsieCI6LTEwMC43NzM2NjU0MzY2MDMxMiwieSI6LTYxOC42MjMyMDM4NjAzNzIyfSx7IngiOjAsInkiOi00MjB9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjowLCJzY2FsZSI6MS45NiwiY2VudGVyIjp7IngiOjU3LCJ5IjoxMDg1fSwidGV4dCI6IndobyBkIn0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfV19XSwidGltZXN0YW1wIjoyMDAwfSx7Im9ialN0YXRlcyI6W3siYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MCwic2NhbGUiOjAuODgzMzMzMzMzMzMzMzMzMywiY2VudGVyIjp7IngiOjYyMCwieSI6NTkyfX0sImNQU3RhdGVzIjpbeyJ4IjotMTM0LjA3NiwieSI6LTIzMi4yMjZ9LHsieCI6LTIxMC4wMDAwMDAwMDAwNiwieSI6LTEuMjg1ODc5MTM5MTA1MDg4MmUtMTR9LHsieCI6LTQwLCJ5IjotNDIwfSx7IngiOjAsInkiOi0xODB9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjozLjEzNzUxMTA0MzYwMjc5OCwic2NhbGUiOjAuODE2NjY2NjY2NjY2NjY2NywiY2VudGVyIjp7IngiOjYyMSwieSI6NTkzfX0sImNQU3RhdGVzIjpbeyJ4IjotMTk1LjQyNSwieSI6LTExMi44Mjl9LHsieCI6LTIxMC4wMDAwMDAwMDAwNiwieSI6LTEuMjg1ODc5MTM5MTA1MDg4MmUtMTR9LHsieCI6LTE1Ny42OTI1NjM5OTkxMDY4MiwieSI6MTY5LjM1Nzc3Mjk1MjM3MzI0fSx7IngiOjAsInkiOi00MjB9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjozLjEzNDc5MDAzNzQzNDk4NDYsInNjYWxlIjowLjg0MzMzMzMzMzMzMzMzMzQsImNlbnRlciI6eyJ4Ijo2MjAsInkiOjU5NH19LCJjUFN0YXRlcyI6W3sieCI6LTUwLjQ0OCwieSI6MH0seyJ4IjotMjEwLjAwMDAwMDAwMDA2LCJ5IjotMS4yODU4NzkxMzkxMDUwODgyZS0xNH0seyJ4IjoxNDkuOTQyMTA4ODM0ODc5OTIsInkiOi0yODQuOTg2NjAzMTkwNjU3MDR9LHsieCI6MCwieSI6LTQyMH1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjAuMTY1ODI3MTAzMzYyMTAyNjgsInNjYWxlIjoxLjM3LCJjZW50ZXIiOnsieCI6NDksInkiOjExMjl9LCJ0ZXh0Ijoid2hvIGRpIn0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfV19XSwidGltZXN0YW1wIjozMDAwfSx7Im9ialN0YXRlcyI6W3siYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MCwic2NhbGUiOjEsImNlbnRlciI6eyJ4Ijo2MjAsInkiOjU5M319LCJjUFN0YXRlcyI6W3sieCI6MCwieSI6MH0seyJ4IjotMjEwLjAwMDAwMDAwMDA2LCJ5IjotMS4yODU4NzkxMzkxMDUwODgyZS0xNH0seyJ4IjoxNTMsInkiOjg4fSx7IngiOjAsInkiOjQyNH1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjIuMDkyNjk5NDI0OTk3NDcxNSwic2NhbGUiOjEsImNlbnRlciI6eyJ4Ijo2MjIsInkiOjU5MH19LCJjUFN0YXRlcyI6W3sieCI6LTE5NS40MjUsInkiOi0xMTIuODI5fSx7IngiOjIwLjAzMDE0MTIzNTI5ODAzMiwieSI6NjYuOTIzNzg4MzEyNDgyODN9LHsieCI6LTQwLCJ5IjotNDIwfSx7IngiOjAsInkiOi00MjQuMDA0NjMxMzc5NzEzMX1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjQuMTg3MDIyMTA2NTY5Mzc0LCJzY2FsZSI6MSwiY2VudGVyIjp7IngiOjYyMCwieSI6NTg4fX0sImNQU3RhdGVzIjpbeyJ4IjotMjQ0Ljc1NSwieSI6MH0seyJ4IjozLjU5ODQ4MDg3NTY1ODgyNjcsInkiOi0wLjIyNTY4ODY5NjAzNDM1MTE2fSx7IngiOjQuNjAxNTQxNzQ2OTIyNjExLCJ5IjotMS45NTU5Njg2OTg5NjQzNzkyfSx7IngiOjAsInkiOi00MjB9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjo2LjEyODY4ODY5MDI0NTIwNSwic2NhbGUiOjEuMzgsImNlbnRlciI6eyJ4Ijo2NiwieSI6MTEzM30sInRleHQiOiJ3aG8gZGlkIn0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfV19XSwidGltZXN0YW1wIjo0MDAwfSx7Im9ialN0YXRlcyI6W3siYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MCwic2NhbGUiOjAuNzk2NjY2NjY2NjY2NjY2NiwiY2VudGVyIjp7IngiOjYyMSwieSI6NTkyfX0sImNQU3RhdGVzIjpbeyJ4IjotMjMzLjAzMSwieSI6LTQwMy42MjF9LHsieCI6ODUsInkiOi0zODJ9LHsieCI6MzYsInkiOi00OTV9LHsieCI6MCwieSI6NDI0fV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MS4wMzg3NDI0OTg2MjQ3MTM0LCJzY2FsZSI6MC43NywiY2VudGVyIjp7IngiOjYyMSwieSI6NTk0fX0sImNQU3RhdGVzIjpbeyJ4IjotMTk1LjQyNSwieSI6LTExMi44Mjl9LHsieCI6MjIwLjQ3NTc2MzEyMTMwMDkzLCJ5IjotNzAuOTYwODE5MzAyNDg1NDV9LHsieCI6LTgwLjQyMzk5NjI0OTkzMjA2LCJ5IjotNDI5LjExNzY3NzEzMjAzMjA0fSx7IngiOjAsInkiOi00MjQuMDA0NjMxMzc5NzEzMX1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjUuMjIzMTM5NzY5NDg3MDM5LCJzY2FsZSI6MC44NjMzMzMzMzMzMzMzMzMzLCJjZW50ZXIiOnsieCI6NjIxLCJ5Ijo1OTN9fSwiY1BTdGF0ZXMiOlt7IngiOi01MC40NDgsInkiOjB9LHsieCI6LTE5NC4yNjE5NzgzOTI3OTAwNywieSI6LTU1OS40MzQ3ODk1NDI5MDkyfSx7IngiOi0zOC45NDg2NTgwNTAyNTk5OCwieSI6Mzk4Ljk1NDg4NzIxOTE5OTF9LHsieCI6MCwieSI6LTQyMH1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjAsInNjYWxlIjowLjc2NjY2NjY2NjY2NjY2NjcsImNlbnRlciI6eyJ4Ijo5OCwieSI6MTEwNH0sInRleHQiOiJ3aG8gZGlkIHRoaXMiLCJmb250U2l6ZSI6IjIyIn0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfV19XSwidGltZXN0YW1wIjo1MDAwfV0sInN0YWdlQ29uZmlnIjp7ImZyYW1lUmF0ZSI6NTAsInBhdXNlVGltZSI6MCwic2VhbWxlc3NBbmltYXRpb25UaW1lIjoxMDAwLCJzb3VyY2VNb2RlIjoic291cmNlLWF0b3AiLCJsaW5lQ29sb3IiOiI1MjNiOGQiLCJiYWNrZ3JvdW5kQ29sb3IiOiIwMTAyMDEiLCJiYWNrZ3JvdW5kQWxwaGEiOjEsImJhY2tncm91bmRJbWFnZSI6M30sInJlc291cmNlcyI6eyJpbWFnZUxpc3QiOlt7InNyYyI6Imh0dHA6Ly80MC5tZWRpYS50dW1ibHIuY29tLzc3ZTlhMGRmNDFmNWRiNzcxMmNjZjEzOTMzOWFjYjVjL3R1bWJscl9ubGhtNzFDRjB4MXNjdWQ5am8xXzQwMC5qcGciLCJwYWdlIjoiIiwibGFiZWwiOiJtb29uLWxpbmlzdCJ9LHsic3JjIjoiaHR0cDovLzQxLm1lZGlhLnR1bWJsci5jb20vODJhYmUyMDhhNGIxODJmOWM2MTA4MWQ1ZWE4MWZhYzMvdHVtYmxyX25sajNubHdmN2Yxc2N1ZDlqbzFfNTAwLmpwZyIsInBhZ2UiOiIiLCJsYWJlbCI6IndoaXRlIGJpcmNoIn0seyJzcmMiOiJodHRwOi8vNDEubWVkaWEudHVtYmxyLmNvbS90dW1ibHJfbTA2NGZmeU9zdDFxaGV4NzRvMV8xMjgwLnBuZyIsInBhZ2UiOiJodHRwOi8vYXJjaGlsbGVjdC5jb20vMjYxMzkiLCJsYWJlbCI6InRlcm1pbmFsIn0seyJzcmMiOiJodHRwOi8vMzYubWVkaWEudHVtYmxyLmNvbS80YmZhNDNmNTY5MjFhYTFlOTAzYzk0YjJjYTdkNmM1NS90dW1ibHJfbWtsOGk3a3lWbjFxZHE2NzFvMV8xMjgwLmpwZyIsInBhZ2UiOiJodHRwOi8vYXJjaGlsbGVjdC5jb20vMjYxMjEiLCJsYWJlbCI6InR1bm5lbGluIn1dLCJvYmplY3RMaXN0IjpbeyJpZCI6InBldGFsRmxvd2VyIiwic3RhdGVzIjp7ImZpbGxJbWFnZSI6MSwicGV0YWxzIjo2LCJhY2NlbnQiOjF9fSx7ImlkIjoicGV0YWxGbG93ZXIiLCJzdGF0ZXMiOnsiZmlsbEltYWdlIjoyLCJwZXRhbHMiOjYsImFjY2VudCI6Mn19LHsiaWQiOiJwZXRhbEZsb3dlciIsInN0YXRlcyI6eyJmaWxsSW1hZ2UiOjMsInBldGFscyI6NiwiYWNjZW50IjozfX0seyJpZCI6InRleHRMYXllciIsInN0YXRlcyI6eyJmaWxsSW1hZ2UiOi0xLCJmb250U2l6ZSI6IjMwIn19XX19';
  //-----------End Canvas Kit Patch-----------
}