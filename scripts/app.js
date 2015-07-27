var cKit;
(function (cKit) {
    var app;
    (function (app) {
        var nav;
        (function (nav) {
            nav.NAME = "cKit.app.nav";
            function navMenu() {
                return {
                    requires: [],
                    restrict: "A",
                    controller: 'navMenuController',
                    link: function (scope) {
                        console.log("testsas");
                    },
                    template: "<div>test</div>"
                };
            } //'main/templates/nav.html'
            function navMenuController($scope, $state) {
                $scope.isTabActive = function (tabName) {
                    // Check if there is sub-states
                    var stateName = $state.current.name, subStatePos = stateName.indexOf('.');
                    if (subStatePos > -1) {
                        stateName = stateName.substring(0, subStatePos);
                    }
                    if (tabName === stateName) {
                        return 'active';
                    }
                };
            }
            ;
            function run() {
                var mod = angular.module(nav.NAME, []);
                mod.controller("navMenuController", navMenuController);
                mod.directive("navMenu", navMenu);
            }
            nav.run = run;
        })(nav = app.nav || (app.nav = {}));
    })(app = cKit.app || (cKit.app = {}));
})(cKit || (cKit = {}));
cKit.app.nav.run();
var cKit;
(function (cKit_1) {
    var app;
    (function (app) {
        var services;
        (function (services) {
            services.NAME = "cKit.app.services";
            function kitService() {
                this.kit = cKit.kit;
                this.kit.initializeCanvas();
                return this.kit;
            }
            ;
            function run() {
                var mod = angular.module(services.NAME, []);
                mod.service("kitService", kitService);
            }
            services.run = run;
        })(services = app.services || (app.services = {}));
    })(app = cKit_1.app || (cKit_1.app = {}));
})(cKit || (cKit = {}));
cKit.app.services.run();
var cKit;
(function (cKit_2) {
    var app;
    (function (app) {
        var services;
        (function (services) {
            function initLibUI() {
                initColorPickers();
                initKeyboard();
            }
            services.initLibUI = initLibUI;
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
                }
                else if (currentSelector === 'scene-line-color') {
                    injectColor(currentSelector, color.substring(1));
                    $(currentSelector + '+ img').show();
                    kit.setSceneAttribute('lineColor', color.substring(1));
                    kit.redraw();
                }
                else if (currentSelector === 'object-line-color') {
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
                // OBJECT SELECTION
                if (keyPressed === '1') {
                    kit.selectObject(0);
                }
                else if (keyPressed === '2') {
                    kit.selectObject(1);
                }
                else if (keyPressed === '3') {
                    kit.selectObject(2);
                }
                else if (keyPressed === '4') {
                    kit.selectObject(3);
                }
                else if (event.keyCode == '37' || keyPressed == '%') {
                    kit.selectPrev();
                }
                else if (event.keyCode == '39' || keyPressed == "'") {
                    kit.selectNext();
                }
                else if (keyPressed == 'A') {
                    kit.stopScene();
                }
                else if (keyPressed == 'S') {
                    kit.play();
                }
                else if (keyPressed == 'Q') {
                    $('.edit-mode button').removeClass('active');
                    $('#edit-shape').addClass('active');
                    kit.editMode = cKit.events.controlModes.EDIT_SHAPE;
                    kit.redraw();
                }
                else if (keyPressed == 'W') {
                    $('.edit-mode button').removeClass('active');
                    $('#edit-transform').addClass('active');
                    kit.editMode = cKit.events.controlModes.EDIT_TRANSFORM;
                    kit.redraw();
                }
                else if (keyPressed == 'E') {
                    $('.edit-mode button').removeClass('active');
                    $('#edit-none').addClass('active');
                    kit.editMode = cKit.events.controlModes.EDIT_NONE;
                    kit.redraw();
                }
                kit.digest();
                return false;
            }
            function getSampleJSON() {
                var encodedPatch = sampleJSON; //.replace(cKit.app.ui.loading.prefixString, '').replace(cKit.app.ui.loading.postfixString, '');
                return $.parseJSON(JXG.Util.Base64.decode(encodedPatch));
            }
            services.getSampleJSON = getSampleJSON;
            var sampleJSON = 'eyJzY2VuZVNldHRpbmdzIjp7InNldHRpbmdTaGVsZiI6eyJlZGl0TW9kZSI6MCwidG9nZ2xlQ3VydmVDb2xvciI6ZmFsc2V9fSwia2V5ZnJhbWVzIjpbeyJvYmpTdGF0ZXMiOlt7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjAsInNjYWxlIjowLjM1MzE3MzMzMzMzMzMzMzQsImNlbnRlciI6eyJ4Ijo2MjIsInkiOjU5Mn19LCJjUFN0YXRlcyI6W3sieCI6MCwieSI6MH0seyJ4IjotMjEwLjAwMDAwMDAwMDA2LCJ5IjotMS4yODU4NzkxMzkxMDUwODgyZS0xNH0seyJ4IjotNzAsInkiOi0zMzR9LHsieCI6MCwieSI6LTQyMH1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjAsInNjYWxlIjowLjQ1MzMzMzMzMzMzMzMzMzMsImNlbnRlciI6eyJ4Ijo2MjAsInkiOjU5Mn19LCJjUFN0YXRlcyI6W3sieCI6LTE5NS40MjUsInkiOi0xMTIuODI5fSx7IngiOi0yMTAuMDAwMDAwMDAwMDYsInkiOi0xLjI4NTg3OTEzOTEwNTA4ODJlLTE0fSx7IngiOi01OSwieSI6LTE0fSx7IngiOjAsInkiOi00MjB9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjowLCJzY2FsZSI6MC41NDY2NjY2NjY2NjY2NjY2LCJjZW50ZXIiOnsieCI6NjIxLCJ5Ijo1OTR9fSwiY1BTdGF0ZXMiOlt7IngiOi01MC40NDgsInkiOjB9LHsieCI6LTIxMC4wMDAwMDAwMDAwNiwieSI6LTEuMjg1ODc5MTM5MTA1MDg4MmUtMTR9LHsieCI6MTcsInkiOjE4MH0seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MC4zMzI2NzM2NTUyMDIzNzQzNSwic2NhbGUiOjEuMDg1NDA5MzY2NTMzMzgxMywiY2VudGVyIjp7IngiOjEwMiwieSI6OTkwfSwidGV4dCI6IlciLCJmb250U2l6ZSI6IjMwIiwibGluZUNvbG9yIjoiMDEwMTAyIn0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfV19XSwidGltZXN0YW1wIjowfSx7Im9ialN0YXRlcyI6W3siYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MCwic2NhbGUiOjAuNTMwNzIyMjIyMjIyMjIyMiwiY2VudGVyIjp7IngiOjYyMCwieSI6NTkzfX0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfSx7IngiOi0yMTAuMDAwMDAwMDAwMDYsInkiOi0xLjI4NTg3OTEzOTEwNTA4ODJlLTE0fSx7IngiOi00MCwieSI6LTQyMH0seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6NS4yMzE5MzIzOTI5ODEzODUsInNjYWxlIjowLjY0LCJjZW50ZXIiOnsieCI6NjIwLCJ5Ijo1OTB9fSwiY1BTdGF0ZXMiOlt7IngiOi0xOTUuNDI1LCJ5IjotMTEyLjgyOX0seyJ4IjotMjEwLjAwMDAwMDAwMDA2LCJ5IjotMS4yODU4NzkxMzkxMDUwODgyZS0xNH0seyJ4IjotMTA1LjE0NTY3MDIyNTg4Mjk4LCJ5Ijo5MC4wOTA5OTg2MjIyMjU2N30seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MS4wNTM2Mjg0NDkzMzQ3NzU0LCJzY2FsZSI6MC41MiwiY2VudGVyIjp7IngiOjYyMiwieSI6NTkzfX0sImNQU3RhdGVzIjpbeyJ4IjotMzYyLjkyNywieSI6MH0seyJ4IjozNTYuMTI2MjEzNjcwOTMwMiwieSI6NzMuNzE2NDgzNDc4MzAzNX0seyJ4IjotMTk1Ljc3NDUyMDcwNDQ5NDkzLCJ5IjotMjc0LjcyMjI5MDc2NDU1Nn0seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6Ni4xMzYxMDY5NTE3OTExODM1LCJzY2FsZSI6MS4xMDY2NjY2NjY2NjY2NjY3LCJjZW50ZXIiOnsieCI6NzMsInkiOjEwNTJ9LCJ0ZXh0IjoiV2hvIiwibGluZUNvbG9yIjoiOGYzZGY0In0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfV19XSwidGltZXN0YW1wIjoxMDAwfSx7Im9ialN0YXRlcyI6W3siYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MCwic2NhbGUiOjAuMzU2Mzg2NzYxNDgxNDgxNCwiY2VudGVyIjp7IngiOjYyMCwieSI6NTkyfX0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfSx7IngiOi0yMTAuMDAwMDAwMDAwMDYsInkiOi0xLjI4NTg3OTEzOTEwNTA4ODJlLTE0fSx7IngiOi00MCwieSI6LTQyMH0seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6NC4xODMwNDY1Njk4MzE0MTg1LCJzY2FsZSI6MC41NTYwNzg4MTQ4MTQ4MTQ4LCJjZW50ZXIiOnsieCI6NjIxLCJ5Ijo1OTJ9fSwiY1BTdGF0ZXMiOlt7IngiOi0zOTkuMjk4LCJ5IjotMjMwLjUzNX0seyJ4IjotMzY0LjYwMjk2NTM3MjIxNjksInkiOi0zODQuNzcyMjQxMjU2ODA2NH0seyJ4IjotMTIzLjc5Mjk2NzUzMjY5MTA1LCJ5IjotMTIuMTc3ODk3NTc5MjI1MDgyfSx7IngiOjAsInkiOi00MjB9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjoyLjA5OTQ1MTY2MzkxNTcyMiwic2NhbGUiOjAuNTExMTQ0NDQ0NDQ0NDQ0NCwiY2VudGVyIjp7IngiOjYyMSwieSI6NTkyfX0sImNQU3RhdGVzIjpbeyJ4IjotNTAuNDQ4LCJ5IjowfSx7IngiOi0yNC43MTAyMjczMTI2NjMwNSwieSI6LTY1NC45NDYxMDgyMTUxMzl9LHsieCI6LTEwMC43NzM2NjU0MzY2MDMxMiwieSI6LTYxOC42MjMyMDM4NjAzNzIyfSx7IngiOjAsInkiOi00MjB9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjowLCJzY2FsZSI6MS45NiwiY2VudGVyIjp7IngiOjU3LCJ5IjoxMDg1fSwidGV4dCI6Ildob28iLCJsaW5lQ29sb3IiOiJhZWY0Y2UifSwiY1BTdGF0ZXMiOlt7IngiOjAsInkiOjB9XX1dLCJ0aW1lc3RhbXAiOjIwMDB9LHsib2JqU3RhdGVzIjpbeyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjowLCJzY2FsZSI6MC44ODMzMzMzMzMzMzMzMzMzLCJjZW50ZXIiOnsieCI6NjIwLCJ5Ijo1OTJ9fSwiY1BTdGF0ZXMiOlt7IngiOi0xMzQuMDc2LCJ5IjotMjMyLjIyNn0seyJ4IjotMjEwLjAwMDAwMDAwMDA2LCJ5IjotMS4yODU4NzkxMzkxMDUwODgyZS0xNH0seyJ4IjotNDAsInkiOi00MjB9LHsieCI6MCwieSI6LTE4MH1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjMuMTM3NTExMDQzNjAyNzk4LCJzY2FsZSI6MC44MTY2NjY2NjY2NjY2NjY3LCJjZW50ZXIiOnsieCI6NjIxLCJ5Ijo1OTN9fSwiY1BTdGF0ZXMiOlt7IngiOi0xOTUuNDI1LCJ5IjotMTEyLjgyOX0seyJ4IjotMjEwLjAwMDAwMDAwMDA2LCJ5IjotMS4yODU4NzkxMzkxMDUwODgyZS0xNH0seyJ4IjotMTU3LjY5MjU2Mzk5OTEwNjgyLCJ5IjoxNjkuMzU3NzcyOTUyMzczMjR9LHsieCI6MCwieSI6LTQyMH1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjMuMTM0NzkwMDM3NDM0OTg0Niwic2NhbGUiOjAuODQzMzMzMzMzMzMzMzMzNCwiY2VudGVyIjp7IngiOjYyMCwieSI6NTk0fX0sImNQU3RhdGVzIjpbeyJ4IjotNTAuNDQ4LCJ5IjowfSx7IngiOi0yMTAuMDAwMDAwMDAwMDYsInkiOi0xLjI4NTg3OTEzOTEwNTA4ODJlLTE0fSx7IngiOjE0OS45NDIxMDg4MzQ4Nzk5MiwieSI6LTI4NC45ODY2MDMxOTA2NTcwNH0seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MC4xNjU4MjcxMDMzNjIxMDI2OCwic2NhbGUiOjEuMzcsImNlbnRlciI6eyJ4Ijo0OSwieSI6MTEyOX0sInRleHQiOiJXaG9vIHJSIiwibGluZUNvbG9yIjoiZjRjMmQ2In0sImNQU3RhdGVzIjpbeyJ4IjowLCJ5IjowfV19XSwidGltZXN0YW1wIjozMDAwfSx7Im9ialN0YXRlcyI6W3siYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MCwic2NhbGUiOjEsImNlbnRlciI6eyJ4Ijo2MjAsInkiOjU5M319LCJjUFN0YXRlcyI6W3sieCI6MCwieSI6MH0seyJ4IjotMjEwLjAwMDAwMDAwMDA2LCJ5IjotMS4yODU4NzkxMzkxMDUwODgyZS0xNH0seyJ4IjoxNTMsInkiOjg4fSx7IngiOjAsInkiOjQyNH1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjIuMDkyNjk5NDI0OTk3NDcxNSwic2NhbGUiOjEsImNlbnRlciI6eyJ4Ijo2MjIsInkiOjU5MH19LCJjUFN0YXRlcyI6W3sieCI6LTE5NS40MjUsInkiOi0xMTIuODI5fSx7IngiOjIwLjAzMDE0MTIzNTI5ODAzMiwieSI6NjYuOTIzNzg4MzEyNDgyODN9LHsieCI6LTQwLCJ5IjotNDIwfSx7IngiOjAsInkiOi00MjQuMDA0NjMxMzc5NzEzMX1dfSx7ImF0dHJpYnV0ZXMiOnsicm90YXRpb24iOjQuMTg3MDIyMTA2NTY5Mzc0LCJzY2FsZSI6MSwiY2VudGVyIjp7IngiOjYyMCwieSI6NTg4fX0sImNQU3RhdGVzIjpbeyJ4IjotMjQ0Ljc1NSwieSI6MH0seyJ4IjozLjU5ODQ4MDg3NTY1ODgyNjcsInkiOi0wLjIyNTY4ODY5NjAzNDM1MTE2fSx7IngiOjQuNjAxNTQxNzQ2OTIyNjExLCJ5IjotMS45NTU5Njg2OTg5NjQzNzkyfSx7IngiOjAsInkiOi00MjB9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjo2LjEyODY4ODY5MDI0NTIwNSwic2NhbGUiOjEuMzgsImNlbnRlciI6eyJ4Ijo2NiwieSI6MTEzM30sInRleHQiOiJXaG9vIHJScnIiLCJsaW5lQ29sb3IiOiIyNGQ5ZjQifSwiY1BTdGF0ZXMiOlt7IngiOjAsInkiOjB9XX1dLCJ0aW1lc3RhbXAiOjQwMDB9LHsib2JqU3RhdGVzIjpbeyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjowLCJzY2FsZSI6MC43OTY2NjY2NjY2NjY2NjY2LCJjZW50ZXIiOnsieCI6NjIxLCJ5Ijo1OTJ9fSwiY1BTdGF0ZXMiOlt7IngiOi0yMzMuMDMxLCJ5IjotNDAzLjYyMX0seyJ4Ijo4NSwieSI6LTM4Mn0seyJ4IjozNiwieSI6LTQ5NX0seyJ4IjowLCJ5Ijo0MjR9XX0seyJhdHRyaWJ1dGVzIjp7InJvdGF0aW9uIjoxLjAzODc0MjQ5ODYyNDcxMzQsInNjYWxlIjowLjc3LCJjZW50ZXIiOnsieCI6NjIxLCJ5Ijo1OTR9fSwiY1BTdGF0ZXMiOlt7IngiOi0xOTUuNDI1LCJ5IjotMTEyLjgyOX0seyJ4IjoyMjAuNDc1NzYzMTIxMzAwOTMsInkiOi03MC45NjA4MTkzMDI0ODU0NX0seyJ4IjotODAuNDIzOTk2MjQ5OTMyMDYsInkiOi00MjkuMTE3Njc3MTMyMDMyMDR9LHsieCI6MCwieSI6LTQyNC4wMDQ2MzEzNzk3MTMxfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6NS4yMjMxMzk3Njk0ODcwMzksInNjYWxlIjowLjg2MzMzMzMzMzMzMzMzMzMsImNlbnRlciI6eyJ4Ijo2MjEsInkiOjU5M319LCJjUFN0YXRlcyI6W3sieCI6LTUwLjQ0OCwieSI6MH0seyJ4IjotMTk0LjI2MTk3ODM5Mjc5MDA3LCJ5IjotNTU5LjQzNDc4OTU0MjkwOTJ9LHsieCI6LTM4Ljk0ODY1ODA1MDI1OTk4LCJ5IjozOTguOTU0ODg3MjE5MTk5MX0seyJ4IjowLCJ5IjotNDIwfV19LHsiYXR0cmlidXRlcyI6eyJyb3RhdGlvbiI6MCwic2NhbGUiOjAuNzY2NjY2NjY2NjY2NjY2NywiY2VudGVyIjp7IngiOjk4LCJ5IjoxMTA0fSwidGV4dCI6Ildob29vIHJSUlIgZVdlZSIsImZvbnRTaXplIjoiMjIiLCJsaW5lQ29sb3IiOiI2YjZjZDgifSwiY1BTdGF0ZXMiOlt7IngiOjAsInkiOjB9XX1dLCJ0aW1lc3RhbXAiOjUwMDB9XSwic3RhZ2VDb25maWciOnsiZnJhbWVSYXRlIjo1MCwicGF1c2VUaW1lIjowLCJzZWFtbGVzc0FuaW1hdGlvblRpbWUiOjEwMDAsInNvdXJjZU1vZGUiOiJzb3VyY2UtYXRvcCIsImxpbmVDb2xvciI6IjUyM2I4ZCIsImJhY2tncm91bmRDb2xvciI6IjAxMDIwMSIsImJhY2tncm91bmRBbHBoYSI6MSwiYmFja2dyb3VuZEltYWdlIjozfSwicmVzb3VyY2VzIjp7ImltYWdlTGlzdCI6W3sic3JjIjoiaHR0cDovLzQwLm1lZGlhLnR1bWJsci5jb20vNzdlOWEwZGY0MWY1ZGI3NzEyY2NmMTM5MzM5YWNiNWMvdHVtYmxyX25saG03MUNGMHgxc2N1ZDlqbzFfNDAwLmpwZyIsInBhZ2UiOiIiLCJsYWJlbCI6Im1vb24tbGluaXN0In0seyJzcmMiOiJodHRwOi8vNDEubWVkaWEudHVtYmxyLmNvbS84MmFiZTIwOGE0YjE4MmY5YzYxMDgxZDVlYTgxZmFjMy90dW1ibHJfbmxqM25sd2Y3ZjFzY3VkOWpvMV81MDAuanBnIiwicGFnZSI6IiIsImxhYmVsIjoid2hpdGUgYmlyY2gifSx7InNyYyI6Imh0dHA6Ly80MS5tZWRpYS50dW1ibHIuY29tL3R1bWJscl9tMDY0ZmZ5T3N0MXFoZXg3NG8xXzEyODAucG5nIiwicGFnZSI6Imh0dHA6Ly9hcmNoaWxsZWN0LmNvbS8yNjEzOSIsImxhYmVsIjoidGVybWluYWwifSx7InNyYyI6Imh0dHA6Ly8zNi5tZWRpYS50dW1ibHIuY29tLzRiZmE0M2Y1NjkyMWFhMWU5MDNjOTRiMmNhN2Q2YzU1L3R1bWJscl9ta2w4aTdreVZuMXFkcTY3MW8xXzEyODAuanBnIiwicGFnZSI6Imh0dHA6Ly9hcmNoaWxsZWN0LmNvbS8yNjEyMSIsImxhYmVsIjoidHVubmVsaW4ifV0sIm9iamVjdExpc3QiOlt7ImlkIjoicGV0YWxGbG93ZXIiLCJzdGF0ZXMiOnsiZmlsbEltYWdlIjoxLCJwZXRhbHMiOjYsImFjY2VudCI6MX19LHsiaWQiOiJwZXRhbEZsb3dlciIsInN0YXRlcyI6eyJmaWxsSW1hZ2UiOjIsInBldGFscyI6NiwiYWNjZW50IjoyfX0seyJpZCI6InBldGFsRmxvd2VyIiwic3RhdGVzIjp7ImZpbGxJbWFnZSI6MywicGV0YWxzIjo2LCJhY2NlbnQiOjN9fSx7ImlkIjoidGV4dExheWVyIiwic3RhdGVzIjp7ImZpbGxJbWFnZSI6LTEsImZvbnRTaXplIjoiMzAifX1dfX0=';
        })(services = app.services || (app.services = {}));
    })(app = cKit_2.app || (cKit_2.app = {}));
})(cKit || (cKit = {}));
var cKit;
(function (cKit) {
    var app;
    (function (app) {
        var directives;
        (function (directives) {
            var utilDirectives;
            (function (utilDirectives) {
                utilDirectives.NAME = "cKit.app.directives.utilDirectives";
                function ngEnter() {
                    return function (scope, element, attrs) {
                        element.bind("keydown keypress", function (event) {
                            if (event.which === 13 || event.which === 27) {
                                scope.$apply(function () {
                                    scope.$eval(attrs.ngEnter, { 'event': event });
                                });
                                event.preventDefault();
                            }
                        });
                    };
                }
                var requires = [];
                var restrict = "AE";
                var scope = {};
                function stopEvents() {
                    return {
                        require: requires,
                        restrict: restrict,
                        scope: scope,
                        link: link
                    };
                }
                function link(scope, element, attrs) {
                    element.bind('click', function (e) {
                        e.stopPropagation();
                    });
                }
                function run() {
                    var mod = angular.module(utilDirectives.NAME, []);
                    mod.directive("stopEvents", stopEvents);
                    mod.directive("ngEnter", ngEnter);
                }
                utilDirectives.run = run;
            })(utilDirectives = directives.utilDirectives || (directives.utilDirectives = {}));
        })(directives = app.directives || (app.directives = {}));
    })(app = cKit.app || (cKit.app = {}));
})(cKit || (cKit = {}));
cKit.app.directives.utilDirectives.run();
var cKit;
(function (cKit) {
    var app;
    (function (app) {
        var ui;
        (function (ui) {
            ui.NAME = "cKit.app.ui";
            function objectPanel() {
                return {
                    restrict: 'A',
                    controller: 'objectController',
                    templateUrl: 'views/interface/object.html'
                };
            }
            function scenePanel() {
                return {
                    restrict: 'A',
                    controller: 'sceneController',
                    templateUrl: 'views/interface/scene.html'
                };
            }
            function animationPanel() {
                return {
                    restrict: 'A',
                    controller: 'animationController',
                    templateUrl: 'views/interface/animation.html'
                };
            }
            function loadingPanel() {
                return {
                    restrict: 'A',
                    controller: 'loadingController',
                    templateUrl: 'views/interface/loading.html'
                };
            }
            function uiPanelController($scope, kitService) {
                var self = this;
                var kit = kitService;
                $scope.kit = kit;
                function dig() {
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                    /* UI updates possibly needed after keypush UI or cKit auto changes */
                    //var fI = kit.getObjectAttribute('fillImage');
                    //$scope.selectedFill = (fI)==-1?'':fI;
                }
                ;
                /* Inject Method to update UI when canvas package changes */
                kit.setDigestFunc(dig);
                self.objectPanelActive = true;
                self.scenePanelActive = true;
                self.animationPanelActive = true;
                self.loadingPanelActive = false;
                $scope.togglePanel = function (panelName) {
                    if (panelName === 'objectPanel') {
                        self.objectPanelActive = !self.objectPanelActive;
                    }
                    else if (panelName === 'scenePanel') {
                        self.scenePanelActive = !self.scenePanelActive;
                    }
                    else if (panelName === 'animationPanel') {
                        self.animationPanelActive = !self.animationPanelActive;
                    }
                    else {
                        self.loadingPanelActive = !self.loadingPanelActive;
                    }
                };
                $scope.isActive = function (panelName) {
                    if (panelName === 'objectPanel') {
                        return self.objectPanelActive;
                    }
                    else if (panelName === 'scenePanel') {
                        return self.scenePanelActive;
                    }
                    else if (panelName === 'animationPanel') {
                        return self.animationPanelActive;
                    }
                    else {
                        return self.loadingPanelActive;
                    }
                };
                // Prevent Keyboard Action
                $scope.fieldFocus = function () {
                    $scope.kit.fieldFocus = true;
                };
                $scope.blurField = function ($event) {
                    $scope.kit.fieldFocus = false;
                    $event.target.blur();
                };
                $scope.unfocus = function () {
                    $scope.kit.fieldFocus = false;
                };
                /* Object Panel Header */
                $scope.objectSelector = kit.selectedObject;
                $scope.$watch(function () {
                    return kit.selectedObject;
                }, function (value) {
                    $scope.objectSelector = kit.selectedObject;
                });
                $scope.objectSelectorClasses = function (obj) {
                    if (obj >= kit.objectCount()) {
                        return 'disabled';
                    }
                    else if (obj === kit.selectedObject) {
                        return 'active';
                    }
                    else {
                        return '';
                    }
                };
                // Edit Mode: Shape, Transform, None
                $scope.editMode = kit.editMode;
                $scope.$watch(function () {
                    return kit.editMode;
                }, function (value) {
                    $scope.editMode = value;
                });
                $scope.setEditMode = function (newValue) {
                    kit.editMode = newValue;
                    kit.redraw();
                };
                $scope.editSelectorClasses = function (val) {
                    if (val === kit.editMode) {
                        return 'active';
                    }
                    else {
                        return '';
                    }
                };
                $scope.selectObject = function (newValue) {
                    kit.selectObject(newValue);
                };
                $scope.maxObjects = function () {
                    if ($scope.kit.objectCount() === kit.getConfigSetting('max-objects')) {
                        return 'disabled';
                    }
                };
                /* Animation panel header */
                // Animation Header
                $scope.play = function () {
                    kit.play();
                };
                $scope.stop = function () {
                    kit.stopScene();
                };
                $scope.selectFirst = function () {
                    kit.selectFirst();
                };
                $scope.selectPrev = function () {
                    kit.selectPrev();
                };
                $scope.selectNext = function () {
                    kit.selectNext();
                };
                $scope.selectLast = function () {
                    kit.selectLast();
                };
                $scope.removeKeyframe = function () {
                    kit.removeKeyframe();
                };
                $scope.removeLast = function () {
                    kit.removeLast();
                };
                $scope.getImageList = kit.getImageList.bind(kit);
                /*$scope.$watch(function() {
                  return kit.getImageList();
                }, function(value) {
                  $scope.imageList = kit.getImageList();
                });*/
                return this;
            }
            function run() {
                var mod = angular.module(ui.NAME, []);
                mod.controller("uiPanelController", uiPanelController);
                mod.directive("objectPanel", objectPanel);
                mod.directive("scenePanel", scenePanel);
                mod.directive("animationPanel", animationPanel);
                mod.directive("loadingPanel", loadingPanel);
            }
            ui.run = run;
        })(ui = app.ui || (app.ui = {}));
    })(app = cKit.app || (cKit.app = {}));
})(cKit || (cKit = {}));
cKit.app.ui.run();
var cKit;
(function (cKit) {
    var app;
    (function (app) {
        var directives;
        (function (directives) {
            var filters;
            (function (filters) {
                filters.NAME = "cKit.app.directives.filters";
                function objectFilter() {
                    return function (input, query) {
                        var result = {};
                        angular.forEach(input, function (value, key) {
                            if (value[query] === true)
                                result[key] = value;
                        });
                        return result;
                    };
                }
                function run() {
                    var mod = angular.module(filters.NAME, []);
                    mod.filter("objectFilter", objectFilter);
                }
                filters.run = run;
            })(filters = directives.filters || (directives.filters = {}));
        })(directives = app.directives || (app.directives = {}));
    })(app = cKit.app || (cKit.app = {}));
})(cKit || (cKit = {}));
cKit.app.directives.filters.run();
var cKit;
(function (cKit) {
    var app;
    (function (app) {
        var directives;
        (function (directives) {
            var objectElement;
            (function (objectElement_1) {
                objectElement_1.NAME = "cKit.app.directives.objectElement";
                function link(scope, element, attrs) {
                    var target = attrs['objectElement'];
                    element.val(scope.kit.getObjectAttribute(target));
                    scope.$watch(function () {
                        return scope.kit.getObjectAttribute(target);
                    }, function () {
                        element.val(scope.kit.getObjectAttribute(target));
                    });
                    element.bind('change', function () {
                        scope.kit.setObjectAttribute(target, this.value);
                    });
                }
                function objectElement() {
                    return {
                        restrict: "A",
                        link: link,
                    };
                }
                function run() {
                    var mod = angular.module(objectElement_1.NAME, []);
                    mod.directive("objectElement", objectElement);
                }
                objectElement_1.run = run;
            })(objectElement = directives.objectElement || (directives.objectElement = {}));
        })(directives = app.directives || (app.directives = {}));
    })(app = cKit.app || (cKit.app = {}));
})(cKit || (cKit = {}));
cKit.app.directives.objectElement.run();
var cKit;
(function (cKit) {
    var app;
    (function (app) {
        var directives;
        (function (directives) {
            var sceneElement;
            (function (sceneElement_1) {
                sceneElement_1.NAME = "cKit.app.directives.sceneElement";
                function link(scope, element, attrs) {
                    var target = element.attr('scene-element');
                    if (attrs.hasOwnProperty('labelOnly')) {
                        element.html(scope.kit.getSceneAttribute(target));
                        scope[target] = scope.kit.getSceneAttribute(target);
                        scope.$watch(function () {
                            return scope.kit.getSceneAttribute(target);
                        }, function () {
                            element.html(scope.kit.getSceneAttribute(target));
                        });
                    }
                    else if (attrs.type == 'checkbox') {
                        scope[target] = scope.kit.getSceneAttribute(target);
                        scope.$watch(function () {
                            return scope.kit.getSceneAttribute(target);
                        }, function () {
                            scope[target] = scope.kit.getSceneAttribute(target);
                        });
                        element.bind('change', function () {
                            if (scope.seamlessAnimation) {
                                scope.kit.setSceneAttribute(target, false);
                            }
                            else {
                                scope.kit.setSceneAttribute(target, true);
                            }
                        });
                    }
                    else {
                        element.val(scope.kit.getSceneAttribute(target));
                        scope.$watch(function () {
                            return scope.kit.getSceneAttribute(target);
                        }, function () {
                            element.val(scope.kit.getSceneAttribute(target));
                        });
                        element.bind('change', function () {
                            scope.kit.setSceneAttribute(target, this.value);
                        });
                    }
                }
                function sceneElement() {
                    return {
                        restrict: "A",
                        link: link
                    };
                }
                function run() {
                    var mod = angular.module(sceneElement_1.NAME, []);
                    mod.directive("sceneElement", sceneElement);
                }
                sceneElement_1.run = run;
            })(sceneElement = directives.sceneElement || (directives.sceneElement = {}));
        })(directives = app.directives || (app.directives = {}));
    })(app = cKit.app || (cKit.app = {}));
})(cKit || (cKit = {}));
cKit.app.directives.sceneElement.run();
var cKit;
(function (cKit) {
    var app;
    (function (app) {
        var ui;
        (function (ui) {
            var object;
            (function (object) {
                object.NAME = "cKit.app.ui.object";
                function objectController($scope, kitService) {
                    var kit = kitService;
                    // Object, Shape, Image Selection, Removal
                    /* Object attributes besides fillImage are handled by the sceneElement directive dynamically */
                    $scope.changeObjectType = function () {
                        kit.updateObjectType($scope.selectedObjectType);
                    };
                    $scope.selectedObjectType = kit.getSelectedObjectType();
                    $scope.objectTypes = kit.getObjectTypes();
                    $scope.$watch(function () {
                        return kit.getSelectedObjectType();
                    }, function (value) {
                        $scope.selectedObjectType = (value) == -1 ? '' : value;
                    });
                    $scope.addObject = function () {
                        kit.addObject();
                    };
                    $scope.removeObject = function () {
                        kit.removeObject();
                    };
                    $scope.getImage = function () {
                        kit.getImage();
                    };
                    $scope.updateFill = function () {
                        //console.log('update fill:' + $scope.selectedFill);
                        kit.setFillImage($scope.selectedFill);
                    };
                    $scope.$watch(function () {
                        return kit.getObjectAttribute('fillImage');
                    }, function (value) {
                        $scope.selectedFill = (value) == -1 ? '' : value;
                    });
                }
                ;
                function run() {
                    var mod = angular.module(object.NAME, []);
                    mod.controller("objectController", objectController);
                }
                object.run = run;
            })(object = ui.object || (ui.object = {}));
        })(ui = app.ui || (app.ui = {}));
    })(app = cKit.app || (cKit.app = {}));
})(cKit || (cKit = {}));
cKit.app.ui.object.run();
var cKit;
(function (cKit) {
    var app;
    (function (app) {
        var ui;
        (function (ui) {
            var state;
            (function (state) {
                state.NAME = "cKit.app.ui.state";
                var services = cKit.app.services;
                function sceneController($scope, kitService) {
                    var kit = kitService;
                    var constants = kit.constants;
                    var _u = kit._u;
                    $scope.highlightCurve = kit.highlightCurve;
                    $scope.highlightCurveChange = function () {
                        kit.highlightCurve = $scope.highlightCurve;
                        kit.redraw();
                    };
                    // Composition mode drop-down
                    $scope.sources = kit.getConfigSetting('source-modes');
                    $scope.sourceKeys = _u.getKeys(constants.SOURCE_MODES);
                    $scope.sourceMode = 'lighter';
                    $scope.updateCompositionMode = function () {
                        kit.setSceneAttribute('sourceMode', $scope.sourceMode);
                    };
                    $scope.$watch(function () {
                        return kit.getSceneAttribute('sourceMode');
                    }, function (value) {
                        $scope.sourceMode = value;
                    });
                    $scope.$watch(function () {
                        return kit.getSceneAttribute('backgroundImage');
                    }, function (value) {
                        $scope.selectedBackground = value;
                    });
                    $scope.updateBackground = function () {
                        kit.setSceneAttribute('backgroundImage', $scope.selectedBackground);
                    };
                    $scope.getImage = function () {
                        kit.getImage();
                    };
                    /* color picker . . */
                    services.initLibUI();
                }
                ;
                function run() {
                    var mod = angular.module(state.NAME, []);
                    mod.controller("sceneController", sceneController);
                }
                state.run = run;
            })(state = ui.state || (ui.state = {}));
        })(ui = app.ui || (app.ui = {}));
    })(app = cKit.app || (cKit.app = {}));
})(cKit || (cKit = {}));
cKit.app.ui.state.run();
var cKit;
(function (cKit) {
    var app;
    (function (app) {
        var ui;
        (function (ui) {
            var animation;
            (function (animation) {
                animation.NAME = "cKit.app.ui.animation";
                function animationController($scope) {
                }
                function run() {
                    var mod = angular.module(animation.NAME, []);
                    mod.controller("animationController", animationController);
                }
                animation.run = run;
            })(animation = ui.animation || (ui.animation = {}));
        })(ui = app.ui || (app.ui = {}));
    })(app = cKit.app || (cKit.app = {}));
})(cKit || (cKit = {}));
cKit.app.ui.animation.run();
var cKit;
(function (cKit) {
    var app;
    (function (app) {
        var ui;
        (function (ui) {
            var loading;
            (function (loading) {
                loading.NAME = "cKit.app.ui.loading";
                loading.prefixString = "----------Start Canvas Kit Patch----------" + '\n';
                loading.postfixString = '\n' + "-----------End Canvas Kit Patch-----------";
                function loadingController($scope) {
                    var kit = $scope.kit;
                    // Loading
                    // For the moment the JSON items are the only events that require JQuery
                    $scope.fieldData = '';
                    $scope.loadSample = function () {
                        kit.loadData(cKit.app.services.getSampleJSON());
                    };
                    $scope.loadPatch = function () {
                        if ($scope.fieldData === '') {
                            return;
                        }
                        var encodedPatch = $scope.fieldData.replace(loading.prefixString, '').replace(loading.postfixString, '');
                        var dataz = $.parseJSON(JXG.Util.Base64.decode(encodedPatch));
                        kit.loadData(dataz);
                    };
                    $scope.getPatchData = function () {
                        var data = kit.getData();
                        $scope.fieldData = loading.prefixString + JXG.Util.Base64.encode(JSON.stringify(data)) + loading.postfixString;
                    };
                    $scope.clearScene = function () {
                        kit.clearScene();
                    };
                    $scope.selectedRemovalImage = "";
                    $scope.removeImage = function () {
                        kit.removeImage($scope.selectedRemovalImage);
                        $scope.selectedRemovalImage = "";
                    };
                    $scope.addImage = function () {
                        kit.addImage($scope.newImageUrl, $scope.newImagePage, $scope.newImageLabel);
                        $scope.newImageUrl = "";
                        $scope.newImagePage = "";
                        $scope.newImageLabel = "";
                    };
                }
                function run() {
                    var mod = angular.module(loading.NAME, []);
                    mod.controller("loadingController", loadingController);
                }
                loading.run = run;
            })(loading = ui.loading || (ui.loading = {}));
        })(ui = app.ui || (app.ui = {}));
    })(app = cKit.app || (cKit.app = {}));
})(cKit || (cKit = {}));
cKit.app.ui.loading.run();
var cKit;
(function (cKit) {
    var app;
    (function (app_1) {
        app_1.NAME = "cKit.app";
        function run() {
            function configureRoutes($stateProvider) {
                //$urlRouterProvider.otherwise("/notFound/");
                var home = {
                    name: 'home',
                    url: '/',
                    templateUrl: 'views/home.html'
                };
                $stateProvider.state(home);
            }
            var app = angular.module(app_1.NAME, [
                "ui.router",
                cKit.app.ui.object.NAME,
                cKit.app.ui.state.NAME,
                cKit.app.ui.animation.NAME,
                cKit.app.ui.loading.NAME,
                cKit.app.services.NAME,
                cKit.app.directives.utilDirectives.NAME,
                cKit.app.directives.filters.NAME,
                cKit.app.directives.objectElement.NAME,
                cKit.app.directives.sceneElement.NAME,
                cKit.app.nav.NAME,
                cKit.app.ui.NAME
            ]);
            app.config(configureRoutes);
        }
        app_1.run = run;
    })(app = cKit.app || (cKit.app = {}));
})(cKit || (cKit = {}));
cKit.app.run();
///<reference path="typings/angularjs/angular.d.ts" />
///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/angular-ui/angular-ui-router.d.ts" />
///<reference path="src/app/main/nav_service.ts" />
///<reference path="src/app/main/services/kitService.ts" />
///<reference path="src/app/main/services/UIControls.ts" />
///<reference path="src/app/directives/utilDirectives.ts" />
///<reference path="src/app/main/interface/ui-panels.ts" />
///<reference path="src/app/directives/filters.ts" />
///<reference path="src/app/directives/objectElement.ts" />
///<reference path="src/app/directives/sceneElement.ts" />
///<reference path="src/app/main/interface/object-ctrl.ts" />
///<reference path="src/app/main/interface/scene-ctrl.ts" />
///<reference path="src/app/main/interface/animation-ctrl.ts" />
///<reference path="src/app/main/interface/loading-ctrl.ts" />
///<reference path="src/app/app.ts" />
/*define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.directive('stateName', ['$state', function ($state) {
    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        var state = $state.current.name;

        if ('stateName' in attr) {
          state = attr.stateName + ' ' + state;
        }
        elm.text(state);
      }
    };
  }]);
});*/
//# sourceMappingURL=app.js.map