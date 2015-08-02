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
    var sceneLinePicker = new dhtmlXColorPicker('cpc-scene-line', false, false, false, false);
    var objectLinePicker = new dhtmlXColorPicker('cpc-object-line', false, false, false, false);
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

    sceneLinePicker.init();
    objectLinePicker.init();
    backgroundPicker.init();

    sceneLinePicker.setOnSelectHandler(setColor);
    objectLinePicker.setOnSelectHandler(setColor);
    backgroundPicker.setOnSelectHandler(setColor);

    sceneLinePicker.setOnCancelHandler(function () {
      $('.cpc').hide();
    });
    objectLinePicker.setOnCancelHandler(function () {
      $('.cpc').hide();
    });
    backgroundPicker.setOnCancelHandler(function () {
      $('.cpc').hide();
    });

    objectLinePicker.hide();
    sceneLinePicker.hide();
    backgroundPicker.hide();

    $('#bg-color').click(function () {
      $('.cpc').hide();
      backgroundPicker.hide();
      backgroundPicker.setColor($(this).attr('color'));
      currentSelector = $(this).attr('id');
      $('#cpc-bg').attr('style', 'width: 252px;');
      backgroundPicker.show();
    });
    $('#scene-line-color').click(function () {
      $('.cpc').hide();
      sceneLinePicker.hide();
      sceneLinePicker.setColor($(this).attr('color'));
      currentSelector = $(this).attr('id');
      $('#cpc-scene-line').attr('style', 'width: 252px;');
      sceneLinePicker.show();
    });
    $('#object-line-color').click(function () {
      $('.cpc').hide();
      objectLinePicker.hide();
      objectLinePicker.setColor($(this).attr('color'));
      currentSelector = $(this).attr('id');
      $('#cpc-object-line').attr('style', 'width: 252px;');
      objectLinePicker.show();
    });

    function colorFunc() {
      injectColor('bg-color', cKit.kit.getSceneAttribute('backgroundColor'));
      injectColor('object-line-color', cKit.kit.getObjectAttribute('lineColor'));
      injectColor('scene-line-color', cKit.kit.getSceneAttribute('lineColor'));
    }
    cKit.kit.setColorFunc(colorFunc);

    colorFunc();
  }

  function setColor(color) {
    var kit = cKit.kit;
    if (currentSelector === 'bg-color') {
      injectColor(currentSelector, color.substring(1));
      $(currentSelector + '+ img').show();
      kit.setSceneAttribute('backgroundColor', color.substring(1));
      kit.redraw();
    } else if (currentSelector === 'scene-line-color') {
      injectColor(currentSelector, color.substring(1));
      $(currentSelector + '+ img').show();
      kit.setSceneAttribute('lineColor', color.substring(1));
      kit.redraw();
    } else if (currentSelector === 'object-line-color') {
      injectColor(currentSelector, color.substring(1));
      $(currentSelector + '+ img').show();
      kit.setObjectAttribute('lineColor', color.substring(1));
      kit.redraw();
    } /* else if (currentSelector === 'bodybg-color') {
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
    var keyCode = parseInt(event.keyCode);
    // OBJECT SELECTION
    /*
    if (keyPressed === '1') {
      kit.selectObject(0);
    } else if (keyPressed === '2') {
      kit.selectObject(1);
    } else if (keyPressed === '3') {
      kit.selectObject(2);
    } else if (keyPressed === '4') {
      kit.selectObject(3);
    */

    if(keyCode < 58 && keyCode > 47 ) {
      if(keyCode == 48) {
        // 0 -> 9
        kit.selectObject(9)
      } else {
        // 1 -> 9 === 0 -> 8
        kit.selectObject(keyCode - 49);
      }
      // KEYFRAME SELECTION
      // LEFT CURSOR (BACK) or Z
    } else if (keyCode == 37 || keyPressed == '%' || keyCode === 90) {
      kit.selectPrev();
      // RIGHT CURSOR (FORWARD) or X
    } else if (keyCode == 39 || keyPressed == "'" || keyCode == 88) {
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
    'eyJzY2VuZVNldHRpbmdzIjp7InNldHRpbmdTaGVsZiI6eyJlZGl0TW9kZSI6MCwidG9nZ2xlQ3VydmVDb2xvciI6ZmFsc2V9fSwia2V5ZnJhbWVzIjpbeyJvYmpTdGF0ZXMiOlt7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjAsInNjYWxlIjowLjM1MzE3MzMzMzMzMzMzMzQsImNlbnRlciI6eyJ4Ijo2MjIsInkiOjU5Mn0sImxpbmVDb2xvciI6ImIwZjRjYyJ9LCJjUFN0YXRlcyI6W3sieCI6MCwieSI6MH0seyJ4IjotMjEwLjAwMDAwMDAwMDA2LCJ5IjotMS4yODU4NzkxMzkxMDUwODgyZS0xNH0seyJ4IjotNzAsInkiOi0zMzR9LHsieCI6MCwieSI6LTQyMH1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjAsInNjYWxlIjowLjQ1MzMzMzMzMzMzMzMzMzMsImNlbnRlciI6eyJ4Ijo2MjAsInkiOjU5Mn0sImxpbmVDb2xvciI6ImIwZjRjYyJ9LCJjUFN0YXRlcyI6W3sieCI6LTE5NS40MjUsInkiOi0xMTIuODI5fSx7IngiOi0yMTAuMDAwMDAwMDAwMDYsInkiOi0xLjI4NTg3OTEzOTEwNTA4ODJlLTE0fSx7IngiOi01OSwieSI6LTE0fSx7IngiOjAsInkiOi00MjB9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjowLCJzY2FsZSI6MC41NDY2NjY2NjY2NjY2NjY2LCJjZW50ZXIiOnsieCI6NjIxLCJ5Ijo1OTR9LCJsaW5lQ29sb3IiOiJiMGY0Y2MifSwiY1BTdGF0ZXMiOlt7IngiOi01MC40NDgsInkiOjB9LHsieCI6LTIxMC4wMDAwMDAwMDAwNiwieSI6LTEuMjg1ODc5MTM5MTA1MDg4MmUtMTR9LHsieCI6MTcsInkiOjE4MH0seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MC4zMzI2NzM2NTUyMDIzNzQzNSwic2NhbGUiOjEuMDg1NDA5MzY2NTMzMzgxMywiY2VudGVyIjp7IngiOjEwMiwieSI6OTkwfSwidGV4dCI6IlciLCJmb250U2l6ZSI6IjMwIiwibGluZUNvbG9yIjoiMDEwMTAyIn0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfV19XSwidGltZXN0YW1wIjowfSx7Im9ialN0YXRlcyI6W3siYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MCwic2NhbGUiOjAuNTMwNzIyMjIyMjIyMjIyMiwiY2VudGVyIjp7IngiOjYyMCwieSI6NTkzfSwibGluZUNvbG9yIjoiYjBmNGNjIn0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfSx7IngiOi0yMTAuMDAwMDAwMDAwMDYsInkiOi0xLjI4NTg3OTEzOTEwNTA4ODJlLTE0fSx7IngiOi00MCwieSI6LTQyMH0seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6NS4yMzE5MzIzOTI5ODEzODUsInNjYWxlIjowLjY0LCJjZW50ZXIiOnsieCI6NjIwLCJ5Ijo1OTB9LCJsaW5lQ29sb3IiOiJiMGY0Y2MifSwiY1BTdGF0ZXMiOlt7IngiOi0xOTUuNDI1LCJ5IjotMTEyLjgyOX0seyJ4IjotMjEwLjAwMDAwMDAwMDA2LCJ5IjotMS4yODU4NzkxMzkxMDUwODgyZS0xNH0seyJ4IjotMTA1LjE0NTY3MDIyNTg4Mjk4LCJ5Ijo5MC4wOTA5OTg2MjIyMjU2N30seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MS4wNTM2Mjg0NDkzMzQ3NzU0LCJzY2FsZSI6MC41MiwiY2VudGVyIjp7IngiOjYyMiwieSI6NTkzfSwibGluZUNvbG9yIjoiYjBmNGNjIn0sImNQU3RhdGVzIjpbeyJ4IjotMzYyLjkyNywieSI6MH0seyJ4IjozNTYuMTI2MjEzNjcwOTMwMiwieSI6NzMuNzE2NDgzNDc4MzAzNX0seyJ4IjotMTk1Ljc3NDUyMDcwNDQ5NDkzLCJ5IjotMjc0LjcyMjI5MDc2NDU1Nn0seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6Ni4xMzYxMDY5NTE3OTExODM1LCJzY2FsZSI6MS4xMDY2NjY2NjY2NjY2NjY3LCJjZW50ZXIiOnsieCI6NzMsInkiOjEwNTJ9LCJ0ZXh0IjoiV2giLCJsaW5lQ29sb3IiOiI4ZjNkZjQifSwiY1BTdGF0ZXMiOlt7IngiOjAsInkiOjB9XX1dLCJ0aW1lc3RhbXAiOjEwMDB9LHsib2JqU3RhdGVzIjpbeyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjowLCJzY2FsZSI6MC4zNTYzODY3NjE0ODE0ODE0LCJjZW50ZXIiOnsieCI6NjIwLCJ5Ijo1OTJ9LCJsaW5lQ29sb3IiOiJiMGY0Y2MifSwiY1BTdGF0ZXMiOlt7IngiOjAsInkiOjB9LHsieCI6LTIxMC4wMDAwMDAwMDAwNiwieSI6LTEuMjg1ODc5MTM5MTA1MDg4MmUtMTR9LHsieCI6LTQwLCJ5IjotNDIwfSx7IngiOjAsInkiOi00MjB9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjo0LjE4MzA0NjU2OTgzMTQxODUsInNjYWxlIjowLjU1NjA3ODgxNDgxNDgxNDgsImNlbnRlciI6eyJ4Ijo2MjEsInkiOjU5Mn0sImxpbmVDb2xvciI6ImIwZjRjYyJ9LCJjUFN0YXRlcyI6W3sieCI6LTM5OS4yOTgsInkiOi0yMzAuNTM1fSx7IngiOi0zNjQuNjAyOTY1MzcyMjE2OSwieSI6LTM4NC43NzIyNDEyNTY4MDY0fSx7IngiOi0xMjMuNzkyOTY3NTMyNjkxMDUsInkiOi0xMi4xNzc4OTc1NzkyMjUwODJ9LHsieCI6MCwieSI6LTQyMH1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjIuMDk5NDUxNjYzOTE1NzIyLCJzY2FsZSI6MC41MTExNDQ0NDQ0NDQ0NDQ0LCJjZW50ZXIiOnsieCI6NjIxLCJ5Ijo1OTJ9LCJsaW5lQ29sb3IiOiJiMGY0Y2MifSwiY1BTdGF0ZXMiOlt7IngiOi01MC40NDgsInkiOjB9LHsieCI6LTI0LjcxMDIyNzMxMjY2MzA1LCJ5IjotNjU0Ljk0NjEwODIxNTEzOX0seyJ4IjotMTAwLjc3MzY2NTQzNjYwMzEyLCJ5IjotNjE4LjYyMzIwMzg2MDM3MjJ9LHsieCI6MCwieSI6LTQyMH1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjAsInNjYWxlIjoxLjk2LCJjZW50ZXIiOnsieCI6NTcsInkiOjEwODV9LCJ0ZXh0IjoiV2hvIiwibGluZUNvbG9yIjoiYWVmNGNlIn0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfV19XSwidGltZXN0YW1wIjoyMDAwfSx7Im9ialN0YXRlcyI6W3siYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MCwic2NhbGUiOjAuODgzMzMzMzMzMzMzMzMzMywiY2VudGVyIjp7IngiOjYyMCwieSI6NTkyfSwibGluZUNvbG9yIjoiYjBmNGNjIn0sImNQU3RhdGVzIjpbeyJ4IjotMTM0LjA3NiwieSI6LTIzMi4yMjZ9LHsieCI6LTIxMC4wMDAwMDAwMDAwNiwieSI6LTEuMjg1ODc5MTM5MTA1MDg4MmUtMTR9LHsieCI6LTQwLCJ5IjotNDIwfSx7IngiOjAsInkiOi0xODB9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjozLjEzNzUxMTA0MzYwMjc5OCwic2NhbGUiOjAuODE2NjY2NjY2NjY2NjY2NywiY2VudGVyIjp7IngiOjYyMSwieSI6NTkzfSwibGluZUNvbG9yIjoiYjBmNGNjIn0sImNQU3RhdGVzIjpbeyJ4IjotMTk1LjQyNSwieSI6LTExMi44Mjl9LHsieCI6LTIxMC4wMDAwMDAwMDAwNiwieSI6LTEuMjg1ODc5MTM5MTA1MDg4MmUtMTR9LHsieCI6LTE1Ny42OTI1NjM5OTkxMDY4MiwieSI6MTY5LjM1Nzc3Mjk1MjM3MzI0fSx7IngiOjAsInkiOi00MjB9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjozLjEzNDc5MDAzNzQzNDk4NDYsInNjYWxlIjowLjg0MzMzMzMzMzMzMzMzMzQsImNlbnRlciI6eyJ4Ijo2MjAsInkiOjU5NH0sImxpbmVDb2xvciI6ImIwZjRjYyJ9LCJjUFN0YXRlcyI6W3sieCI6LTUwLjQ0OCwieSI6MH0seyJ4IjotMjEwLjAwMDAwMDAwMDA2LCJ5IjotMS4yODU4NzkxMzkxMDUwODgyZS0xNH0seyJ4IjoxNDkuOTQyMTA4ODM0ODc5OTIsInkiOi0yODQuOTg2NjAzMTkwNjU3MDR9LHsieCI6MCwieSI6LTQyMH1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjAuMTY1ODI3MTAzMzYyMTAyNjgsInNjYWxlIjoxLjM3LCJjZW50ZXIiOnsieCI6NDksInkiOjExMjl9LCJ0ZXh0IjoiV2hvIFIiLCJsaW5lQ29sb3IiOiJmNGMyZDYifSwiY1BTdGF0ZXMiOlt7IngiOjAsInkiOjB9XX1dLCJ0aW1lc3RhbXAiOjMwMDB9LHsib2JqU3RhdGVzIjpbeyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjowLCJzY2FsZSI6MSwiY2VudGVyIjp7IngiOjYyMCwieSI6NTkzfSwibGluZUNvbG9yIjoiYjBmNGNjIn0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfSx7IngiOi0yMTAuMDAwMDAwMDAwMDYsInkiOi0xLjI4NTg3OTEzOTEwNTA4ODJlLTE0fSx7IngiOjE1MywieSI6ODh9LHsieCI6MCwieSI6NDI0fV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6Mi4wOTI2OTk0MjQ5OTc0NzE1LCJzY2FsZSI6MSwiY2VudGVyIjp7IngiOjYyMiwieSI6NTkwfSwibGluZUNvbG9yIjoiYjBmNGNjIn0sImNQU3RhdGVzIjpbeyJ4IjotMTk1LjQyNSwieSI6LTExMi44Mjl9LHsieCI6MjAuMDMwMTQxMjM1Mjk4MDMyLCJ5Ijo2Ni45MjM3ODgzMTI0ODI4M30seyJ4IjotNDAsInkiOi00MjB9LHsieCI6MCwieSI6LTQyNC4wMDQ2MzEzNzk3MTMxfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6NC4xODcwMjIxMDY1NjkzNzQsInNjYWxlIjoxLCJjZW50ZXIiOnsieCI6NjIwLCJ5Ijo1ODh9LCJsaW5lQ29sb3IiOiJiMGY0Y2MifSwiY1BTdGF0ZXMiOlt7IngiOi0yNDQuNzU1LCJ5IjowfSx7IngiOjMuNTk4NDgwODc1NjU4ODI2NywieSI6LTAuMjI1Njg4Njk2MDM0MzUxMTZ9LHsieCI6NC42MDE1NDE3NDY5MjI2MTEsInkiOi0xLjk1NTk2ODY5ODk2NDM3OTJ9LHsieCI6MCwieSI6LTQyMH1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjYuMTI4Njg4NjkwMjQ1MjA1LCJzY2FsZSI6MS4zOCwiY2VudGVyIjp7IngiOjY2LCJ5IjoxMTMzfSwidGV4dCI6IldobyBSIHUiLCJsaW5lQ29sb3IiOiIyNGQ5ZjQifSwiY1BTdGF0ZXMiOlt7IngiOjAsInkiOjB9XX1dLCJ0aW1lc3RhbXAiOjQwMDB9LHsib2JqU3RhdGVzIjpbeyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjowLCJzY2FsZSI6MC43OTY2NjY2NjY2NjY2NjY2LCJjZW50ZXIiOnsieCI6NjIxLCJ5Ijo1OTJ9LCJsaW5lQ29sb3IiOiJiMGY0Y2MifSwiY1BTdGF0ZXMiOlt7IngiOi0yMzMuMDMxLCJ5IjotNDAzLjYyMX0seyJ4Ijo4NSwieSI6LTM4Mn0seyJ4IjozNiwieSI6LTQ5NX0seyJ4IjowLCJ5Ijo0MjR9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjoxLjAzODc0MjQ5ODYyNDcxMzQsInNjYWxlIjowLjc3LCJjZW50ZXIiOnsieCI6NjIxLCJ5Ijo1OTR9LCJsaW5lQ29sb3IiOiJiMGY0Y2MifSwiY1BTdGF0ZXMiOlt7IngiOi0xOTUuNDI1LCJ5IjotMTEyLjgyOX0seyJ4IjoyMjAuNDc1NzYzMTIxMzAwOTMsInkiOi03MC45NjA4MTkzMDI0ODU0NX0seyJ4IjotODAuNDIzOTk2MjQ5OTMyMDYsInkiOi00MjkuMTE3Njc3MTMyMDMyMDR9LHsieCI6MCwieSI6LTQyNC4wMDQ2MzEzNzk3MTMxfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6NS4yMjMxMzk3Njk0ODcwMzksInNjYWxlIjowLjg2MzMzMzMzMzMzMzMzMzMsImNlbnRlciI6eyJ4Ijo2MjEsInkiOjU5M30sImxpbmVDb2xvciI6ImIwZjRjYyJ9LCJjUFN0YXRlcyI6W3sieCI6LTUwLjQ0OCwieSI6MH0seyJ4IjotMTk0LjI2MTk3ODM5Mjc5MDA3LCJ5IjotNTU5LjQzNDc4OTU0MjkwOTJ9LHsieCI6LTM4Ljk0ODY1ODA1MDI1OTk4LCJ5IjozOTguOTU0ODg3MjE5MTk5MX0seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MCwic2NhbGUiOjAuNzY2NjY2NjY2NjY2NjY2NywiY2VudGVyIjp7IngiOjk4LCJ5IjoxMTA0fSwidGV4dCI6IldobyBSIHVVIiwiZm9udFNpemUiOiIyMiIsImxpbmVDb2xvciI6IjZiNmNkOCJ9LCJjUFN0YXRlcyI6W3sieCI6MCwieSI6MH1dfV0sInRpbWVzdGFtcCI6NTAwMH1dLCJzdGFnZUNvbmZpZyI6eyJmcmFtZVJhdGUiOjUwLCJwYXVzZVRpbWUiOjAsInNlYW1sZXNzQW5pbWF0aW9uVGltZSI6MTAwMCwic291cmNlTW9kZSI6InNvdXJjZS1hdG9wIiwibGluZUNvbG9yIjoiNTIzYjhkIiwiYmFja2dyb3VuZENvbG9yIjoiMDEwMjAxIiwiYmFja2dyb3VuZEFscGhhIjoxLCJiYWNrZ3JvdW5kSW1hZ2UiOjN9LCJyZXNvdXJjZXMiOnsiaW1hZ2VMaXN0IjpbeyJzcmMiOiJodHRwOi8vNDAubWVkaWEudHVtYmxyLmNvbS83N2U5YTBkZjQxZjVkYjc3MTJjY2YxMzkzMzlhY2I1Yy90dW1ibHJfbmxobTcxQ0YweDFzY3VkOWpvMV80MDAuanBnIiwicGFnZSI6IiIsImxhYmVsIjoibW9vbi1saW5pc3QifSx7InNyYyI6Imh0dHA6Ly80MS5tZWRpYS50dW1ibHIuY29tLzgyYWJlMjA4YTRiMTgyZjljNjEwODFkNWVhODFmYWMzL3R1bWJscl9ubGozbmx3ZjdmMXNjdWQ5am8xXzUwMC5qcGciLCJwYWdlIjoiIiwibGFiZWwiOiJ3aGl0ZSBiaXJjaCJ9LHsic3JjIjoiaHR0cDovLzQxLm1lZGlhLnR1bWJsci5jb20vdHVtYmxyX20wNjRmZnlPc3QxcWhleDc0bzFfMTI4MC5wbmciLCJwYWdlIjoiaHR0cDovL2FyY2hpbGxlY3QuY29tLzI2MTM5IiwibGFiZWwiOiJ0ZXJtaW5hbCJ9LHsic3JjIjoiaHR0cDovLzM2Lm1lZGlhLnR1bWJsci5jb20vNGJmYTQzZjU2OTIxYWExZTkwM2M5NGIyY2E3ZDZjNTUvdHVtYmxyX21rbDhpN2t5Vm4xcWRxNjcxbzFfMTI4MC5qcGciLCJwYWdlIjoiaHR0cDovL2FyY2hpbGxlY3QuY29tLzI2MTIxIiwibGFiZWwiOiJ0dW5uZWxpbiJ9XSwib2JqZWN0TGlzdCI6W3siaWQiOiJwZXRhbEZsb3dlciIsInN0YXRlcyI6eyJmaWxsSW1hZ2UiOjEsInBldGFscyI6NiwiYWNjZW50IjoxfX0seyJpZCI6InBldGFsRmxvd2VyIiwic3RhdGVzIjp7ImZpbGxJbWFnZSI6MiwicGV0YWxzIjo2LCJhY2NlbnQiOjJ9fSx7ImlkIjoicGV0YWxGbG93ZXIiLCJzdGF0ZXMiOnsiZmlsbEltYWdlIjozLCJwZXRhbHMiOjYsImFjY2VudCI6M319LHsiaWQiOiJ0ZXh0TGF5ZXIiLCJzdGF0ZXMiOnsiZmlsbEltYWdlIjotMSwiZm9udFNpemUiOiIyMiJ9fV19fQ=='
    // -----------End Canvas Kit Patch-----------
}