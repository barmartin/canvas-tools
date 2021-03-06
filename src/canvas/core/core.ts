module cKit {
  import constants = cKit.constants;
  import _u = cKit.util;
  import objects = cKit.objects;
  import elements = cKit.elements;
  import Vector = cKit.elements.Vector;
  import stage = cKit.stage;
  import events = cKit.events;
  import controlModes = events.controlModes;

  export class CanvasKit {
    /* Stage is where all the keyframes & main animation cycle runs */
    stage:stage.Stage;
    /* Resources is a imageList, objList and ...? */
    resourceList:stage.ResourceList;

    encoder:any;
    digest:any;
    colorFunc:any;

    /* TODO make configurable & move into a general canvas config Class */
    canvas:any;
    context:any;
    // CANVAS SETTINGS
    canvasWidth:number = 1200;
    canvasHeight:number = 1200;

    midWidth:number = this.canvasWidth/2;
    midHeight:number = this.canvasHeight/2;

    /* control point edit mode */
    editMode:number = controlModes.EDIT_SHAPE;
    /* this just saves some time in drag events */
    dragMode:boolean = false;

    defaultObject:Dictionary<any>;
    initList:Array<Dictionary<any>>;
    selectedObject:number = 0;

    /* is fieldFocus just used by the UI? */
    fieldFocus:boolean = false;
    settingShelf:any;
    highlightCurve:boolean = false;
    /* idf remember how this works */
    toggleCurveColor:boolean = false;

    debugMode:boolean;

    tabletPlug:any;
    penAPI:any;

    /* Generic type needs to be changed in object inherited from baseObject
     * or you won't be able to create it from the interface
     */
    objectTypes: Dictionary<string> = cKit.objects.objectTypes;

    /* attaching for external libs to use if needed */
    _u:any = _u;
    constants:any = cKit.constants;
    constructor() {
      this.resourceList = new stage.ResourceList(this);
      this.stage = new stage.Stage(this);

      // Triggered after any event that needs to refresh UI (injected)
      this.digest = () => {};
      // Triggered after any event that needs to refresh color pickers UI (injected)
      this.colorFunc = () => {};

      // SETUP ID to all interface elements and setter methods in package
      this.settingShelf = {'toggleCurveColor': this.toggleCurveColor, 'editMode': this.editMode};

      /* TODO init with constructor arguments / configure somehow? */
      this.defaultObject = { id:'petalFlower', states: { petals: 6, accent: 1}};
      this.initList = [
        //{ id: 'imageLayer', index:3 },
        this.defaultObject
        //, { id: 'textLayer' }
        // { id: 'sketch' }
      ];

      // TESTING
      this.debugMode = true;
    }

    // Setup Canvas Events, Initialize Objects and Context
    initializeCanvas() {
      this.canvas = document.getElementById('canvas');
      this.context = this.canvas.getContext('2d');
      events.bindEvents();

      // Testing Code
      if (this.debugMode === true) {
        this.addImage("http://40.media.tumblr.com/77e9a0df41f5db7712ccf139339acb5c/tumblr_nlhm71CF0x1scud9jo1_400.jpg", "", "moon-linist");
        this.addImage("http://41.media.tumblr.com/82abe208a4b182f9c61081d5ea81fac3/tumblr_nlj3nlwf7f1scud9jo1_500.jpg", "", "white birch");
        this.addImage("http://41.media.tumblr.com/tumblr_m064ffyOst1qhex74o1_1280.png", "http://archillect.com/26139", "terminal");
        this.addImage("http://36.media.tumblr.com/4bfa43f56921aa1e903c94b2ca7d6c55/tumblr_mkl8i7kyVn1qdq671o1_1280.jpg", "http://archillect.com/26121", "tunnelin");
        //this.resourceList.addObject(new objects.ImageLayer(this, this.resourceList.images[0]));
        // var dataz = window.getSampleJSON();
        // this.loadData(dataz, false);
        // testing imageSmothing
        // this.context.imageSmoothingEnabled = false;
        this.tabletPlug = document.getElementById('wtPlugin');
        if(this.tabletPlug && typeof this.tabletPlug!='undefined') this.penAPI = this.tabletPlug.penAPI;
      }
      // Setup the scene
      this.build();
      this.redraw();
    }

    /* Tells AngularUI (or whatever UI) to check for updates */
    setDigestFunc(newFunc) {
      this.digest = newFunc;
    }

    setColorFunc(newFunc) {
      this.colorFunc = newFunc;
    }

    build() {
      var kit = this;
      kit.initList.forEach( kit.resourceList.addObject.bind(kit.resourceList) );
      this.stage.storeState();
    }


    // This function is used on every scene change
    redraw() {
      // Clear the canvas
      this.context.save();
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.restore();

      // Reset stroke style in case of highlighted shape
      this.context.strokeStyle = '#' + this.stage.stageConfig.lineColor;

      if (this.stage.stageConfig.backgroundImage && this.stage.stageConfig.backgroundImage.loaded) {
        this.context.drawImage(this.stage.stageConfig.backgroundImage.image, 0, 0, this.canvasWidth, this.canvasHeight);
      } else {
        var rgb = _u.toRGB(this.stage.stageConfig.backgroundColor);
        this.context.fillStyle = 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', ' + this.stage.stageConfig.backgroundAlpha + ')';
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      }

      var kit = this;
      _u.each(this.resourceList.objects, function (item) {  //: objects.baseObject) {
        kit.context.save();
        item.transform();
        item.draw();
        kit.context.restore();
      });
      // Always draw active control points on top (last)
      this.context.strokeStyle = '#' + this.stage.stageConfig.lineColor;
      if (this.editMode === controlModes.EDIT_SHAPE) {
        this.resourceList.objects[kit.selectedObject].drawControlPoints();
      }
      if (this.editMode === controlModes.EDIT_TRANSFORM) {
        this.resourceList.objects[kit.selectedObject].drawTransformPoints();
      }
    }

    /* Methods for the UI
     * Redraw and Digest where needed
     *
     */
    selectObject(obj) {
      obj = parseFloat(obj);
      if (this.selectedObject !== obj && obj < this.resourceList.objects.length
          && obj < constants.MAX_OBJECTS && obj >= 0) {
        this.selectedObject = obj;
        this.redraw();
        this.digest();
      }
    }

    getSelectedObject() {
      return this.resourceList.objects[this.selectedObject];
    }

    getSelectedObjectType() {
      return this.resourceList.objects[this.selectedObject].type;
    }

    getObjectTypes() {
      return this.objectTypes;
    }

    updateObjectType(objectType: string) {
      if(objectType!==this.resourceList.objects[this.selectedObject].type) {
        this.resourceList.changeObjectType(this.selectedObject, objectType);
        this.stage.clearStates(this.selectedObject);
        this.redraw();
      }
    }

    // Create a new object of the default type, update all keyframes with init configuration
    // Select the new object
    addObject() {
      if (this.resourceList.objects.length >= constants.MAX_OBJECTS) {
        return;
      }
      var index = this.resourceList.addObject(this.defaultObject);
      for (var i = 0; i < this.stage.keyframes.length; i++) {
        this.stage.keyframes[i].objStates.push(this.resourceList.objects[index].exportFrame());
      }
      this.selectedObject = index;
      this.redraw();
      this.digest();
    }

    // Remove the object currently selected
    removeObject() {
      if (this.resourceList.objects.length < 2) {
        return;
      }

      this.resourceList.removeObject(this.selectedObject);
      var kit = this;
      _u.each(this.stage.keyframes, function (keyframe) {
        _u.removeArrayEntry(keyframe.objStates, kit.selectedObject);
      });
      if (this.selectedObject === this.resourceList.objects.length) {
        this.selectedObject--;
      }
      this.redraw();
      this.digest();
    }

    removeImage(index:number) {
      if(index==-1) {
        return;
      }
      var images = this.resourceList.images;
      this.resourceList.objects.forEach((item)=>{
        if(_u.exists(item.fillImage) && images.indexOf(item.fillImage)===index) {
          item.fillImage = null;
        }
      });
      var bImg = this.stage.stageConfig.backgroundImage;
      if(_u.exists(bImg) && images.indexOf(bImg)===index) {
        this.stage.stageConfig.backgroundImage = null;
      }
      images.splice(index, 1);
      images.forEach( (item, index) => {
        item.id = index;
      });
      this.redraw();
      this.digest();
    }

    getImage() {
      this.setTempModes(controlModes.EDIT_NONE, false);
      this.redraw();
      window.open(this.canvas.toDataURL('image/png'));
      this.restoreModes();
      this.redraw();
    }

    /*
     * Used to set the canvas state with the keyframe interpolation scene states
     * //Objects in the scene are used to store temporary states,
     */
    loadFrame() {
      this.stage.loadState(this.stage.segment);
      this.redraw();
    }

    removeKeyframe() {
      if (this.stage.keyframes.length < 2) {
        return;
      }
      _u.removeArrayEntry(this.stage.keyframes, this.stage.segment);
      if (this.stage.segment === this.stage.keyframes.length) {
        this.stage.segment--;
      }
      this.stage.loadState(this.stage.segment);
      this.redraw();
      this.digest();
    }

    removeLast() {
      if (this.stage.keyframes.length < 2) {
        return;
      }
      _u.removeArrayEntry(this.stage.keyframes, this.stage.keyframes.length - 1);
      if (this.stage.segment === this.stage.keyframes.length) {
        this.stage.segment--;
      }
      this.stage.loadState(this.stage.segment);
      this.redraw();
      this.digest();
    }

    /* Below this point are completed methods re-written for 0.2.0  */
    /* These are all for interface use */
    clearScene() {
      this.selectedObject = 0;
      this.resourceList.clearResources();
      this.resourceList.addObject(this.defaultObject);
      this.stage.clearStage();
      this.redraw();
      this.digest();
    }

    setObjectAttribute(target, value) {
      if(_u.exists(this.resourceList.objects[this.selectedObject].uiTranslators[target])) {
        var value = this.resourceList.objects[this.selectedObject].setUIAttribute(target, value);
        if(this.resourceList.objects[this.selectedObject].animationAttributes.indexOf(target) !== -1) {
          this.stage.setKeyframeAttribute(target, this.stage.segment, this.selectedObject, value);
        }
        this.redraw();
      }
    }

    getObjectAttribute(target) {
      return this.resourceList.objects[this.selectedObject].getUIAttribute(target);
    }

    objectCount() {
      return this.resourceList.objects.length;
    }

    addImage(src:string, page:string='', label:string = '') {
      this.resourceList.addImage(src, page, label);
    }

    getImageList() {
      //var listImages = [];
      //this.resourceList.images.forEach(function (value, index) {
      //  listImages.push({ id: index, label: value.label });
      //});
      //return listImages;
      return this.resourceList.images;
    }

    /* Animation UI get ers and set ers
     * 'ATTRIBUTES' ARE FOR UI STRING ELEMENTS
     * 'STATES' ARE FOR INTERNAL USE
     * Everything below this point are for UI use
     * */

    setSceneAttribute(target, value) {
      if (target === 'timing') {
        this.stage.setSegmentTiming(value);
      } else {
        this.stage.stageConfig.setAttribute(target, value);
        this.redraw();
      }
    }

    getSceneAttribute(target) {
      if (target === 'timing') {
        return this.stage.getSegmentTiming();

        /* Segment is the frame being animated into
         * Timing is pulled from the previous segment
         * Currently considering altering use of 'segment'
         * this mod is super confusing and causes need for this accessor too much
         */
      } else if (target === 'segment') {
        return this.stage.segment;
      } else {
        return this.stage.stageConfig.getAttribute(target);
      }
    }

    setFillImage(index) {
      if(index === '' || index == null) {
        /* TODO frax this casting */
        this.resourceList.objects[this.selectedObject].fillImage = <elements.ImageResource>{};
      } else {
        var index = _u.parseIntOrDefault(index, 0);
        if (this.resourceList.images.length > index) {
          this.resourceList.objects[this.selectedObject].fillImage = this.resourceList.images[index];
        }
      }
      this.redraw();
    }

    selectFirst() {
      this.stage.segment = 0;
      this.stage.loadState(0);
      this.digest();
      this.colorFunc();
      this.redraw();
    }

    selectPrev() {
      if (this.stage.segment > 0) {
        this.stage.segment--;
        this.stage.loadState(this.stage.segment);
        this.digest();
        this.colorFunc();
        this.redraw();
      }
    }

    selectNext() {
      this.stage.segment++;
      if (this.stage.segment === this.stage.keyframes.length) {
        this.stage.newKeyframe();
      }
      this.stage.loadState(this.stage.segment);
      this.digest();
      this.colorFunc();
      this.redraw();
    }

    selectLast() {
      this.stage.segment = this.stage.keyframes.length - 1;
      this.stage.loadState(this.stage.segment);
      this.digest();
      this.colorFunc();
      this.redraw();
    }

    /* Animation
     *
     *
     * */
    play() {
      if(!this.stage.animationMode)
        this.loopInit();
      this.stage.sceneLoop();
    }

    stopScene() {
      this.sceneReset();
      this.restoreModes();
      this.redraw();
    }

    loopInit() {
      this.setTempModes(controlModes.EDIT_NONE, false);
      this.stage.init();
    }

    sceneReset() {
      this.stage.animationMode = false;
      this.stage.segment = 0;
      this.stage.loadState(0);
    }

    setTempModes(editMode, toggleCurveColor) {
      this.settingShelf = {'editMode': this.editMode, 'toggleCurveColor': this.toggleCurveColor};
      this.editMode = editMode;
      this.toggleCurveColor = toggleCurveColor;
    }

    restoreModes() {
      this.editMode = this.settingShelf.editMode;
      this.toggleCurveColor = this.settingShelf.toggleCurveColor;
    }

    getConfigSetting(setting:string):any {
      //if(setting==='height') {
      //  return this.canvasHeight.toString();
      //} else if(setting==='width') {
      //  return this.canvasWidth.toString();
      //} else
      if(setting==='max-objects') {
        return constants.MAX_OBJECTS;
      } else if(setting==='source-modes') {
        return constants.SOURCE_MODES;
      }
      //} else {
      //  return 'UNKOWN';
      //}
    }

    // JSON LOADING & PATCHOUT
    getData() {
      return {
        sceneSettings: this.exportSceneConfig(),
        keyframes: this.stage.exportKeyframes(),
        stageConfig: this.stage.stageConfig.exportStageConfig(),
        resources: this.resourceList.export()
      };
    }

    loadData(data) {
      this.resourceList.import(data.resources);
      this.stage.importFrames(data.keyframes);
      /* StageConfig requires the resourceList */
      this.stage.stageConfig.importStageConfig(data.stageConfig);
      this.importSceneConfig(data.sceneSettings);
      this.colorFunc();
      this.digest();
      this.redraw();
    }

    exportSceneConfig() {
      return {
        settingShelf: this.settingShelf
      }
    }

    importSceneConfig(config) {
      this.settingShelf = config.settingShelf;
    }
  }
  export var kit = new CanvasKit();
}


