declare module cKit.constants {
    var PI: number;
    var TWOPIDIV360: number;
    var TWOPI: number;
    var MAX_OBJECTS: number;
    var DEFAULT_RAYS: number;
    var DEFAULT_TIMING: number;
    var DEFAULT_PAUSETIME: number;
    var DEFAULT_INNER_RADIUS_SCALAR: number;
    var DEFAULT_OUTER_RADIUS_SCALAR: number;
    var CONTROL_POINT_RADIUS: number;
    var MAX_CP_SIGS: number;
    var BACKGROUND_COLOR: string;
    var BACKGROUND_ALPHA: number;
    var LINE_COLOR: string;
    var DEFAULT_FRAME_RATE: number;
    var MAX_CLICK_DISTANCE: number;
    var SOURCE_MODES: {
        'lighter': string;
        'darker': string;
        'xor': string;
        'source-atop': string;
        'source-out': string;
        'source-over': string;
        'destination-atop': string;
        'destination-out': string;
    };
}
declare module cKit.util {
    function getPosition(e: any, canvas: any): elements.Vector;
    function clone(obj: any): any;
    function encodeToHex(floatString: any): number;
    function decodeFromHex(str: any): number;
    function dnexist(item: any): boolean;
    function exists(item: any): boolean;
    function reduceSig(num: number, sig: number): number;
    function degreesToRadians(angle: number): number;
    function toRGB(str: String): number[];
    function msTime(): number;
    function each(obj: any, func: any): any;
    function getKeys(obj: any): string[];
    function dicMap(dic: any, func: any, context?: any): void;
    function range(st: any, end: any): any[];
    function indexOf(obj: any, item: any): number;
    function removeArrayEntry(arr: any, index: any): void;
    function parseIntOrDefault(i: any, def: any): any;
    function parseFloatOrDefault(f: any, def: any): any;
    class AsArray {
        key: string;
        value: any;
        constructor(key: string, value: any);
    }
    function getRotationMatrix(angle: any): number[];
}
interface Date {
    compare(x: Date): number;
}
declare class Dictionary<T> {
    [index: string]: T;
}
declare module cKit.elements {
    class Vector {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        multiply(vector: Vector, scaleFactor: number): void;
        add(vector2: Vector): void;
        rotate(thisAngle: number, center?: Vector): void;
        rotateIntoNewVector(thisAngle: number, center?: Vector): Vector;
        distance(pointB?: Vector): number;
        getRadians(center: any): number;
        getDegrees(center: any): number;
        clone(): Vector;
        static zeroVector(): Vector;
        static newZeroVector(): Vector;
        static reflectMatrix(theta: any): number[];
        static getPolarPoint(radius: number, angle: number, center?: Vector): Vector;
    }
}
declare module cKit.elements {
    import Vector = cKit.elements.Vector;
    class CPoint extends Vector {
        inDrag: boolean;
        constructor(x: number, y: number, inDrag?: boolean);
        draw(index: any, context: any, parentRotation: number, editMode: number): void;
        mouseInside(point: Vector, parentObjectScale: number): boolean;
    }
}
declare module cKit.elements {
    class Transform {
        position: any;
        scale: number;
        rotation: number;
        constructor(position: any, scale: any, rotation: any);
        getMatrix: () => any[];
    }
}
declare module cKit.elements {
    class ImageResource {
        kit: any;
        src: string;
        page: string;
        label: string;
        image: any;
        loaded: boolean;
        id: number;
        constructor(kit: CanvasKit, src: any, page: any, label: any);
        exportImage(): {
            src: string;
            page: string;
            label: string;
        };
    }
}
declare module cKit.elements {
    class Keyframe {
        objStates: Array<KeyState>;
        timestamp: number;
        constructor(objStates: Array<KeyState>, timestamp: number);
        export(): {
            objStates: KeyState[];
            timestamp: number;
        };
    }
    class KeyState {
        cPStates: Array<Vector>;
        attributes: Dictionary<any>;
        constructor(cpStates: Array<Vector>, attributes: Dictionary<any>);
    }
}
declare module cKit.elements {
    enum TYPES {
        NUMBER = 0,
        STRING = 1,
        VECTOR = 2,
    }
    enum CONSTRAINTS {
        NONE = 0,
        MOD = 1,
        MINMAX = 2,
    }
    class UITranslatorBase {
        label: string;
        type: number;
        display: boolean;
        constructor(type: any, label: any);
    }
    interface UITranslator {
        label: string;
        type: number;
        display: boolean;
        import(value: any): any;
        export(value: any): any;
    }
    class UINumber extends UITranslatorBase implements UITranslator {
        multiplier: number;
        maxSigFigs: number;
        constraint: number;
        minimum: number;
        modOrMax: number;
        constructor(label: string, multiplier?: number, maxSigFigs?: number, constraint?: number, modOrMax?: number, minimum?: number);
        export(value: number): number;
        import(value: number): number;
    }
    enum UIStringContraints {
        NONE = 0,
        LIST = 1,
    }
    class UIString extends UITranslatorBase implements UITranslator {
        constraint: number;
        possibleValues: Array<string>;
        constructor(label: string, constraint?: UIStringContraints, possibleValues?: any[]);
        export(value: string): string;
        import(value: string): string;
    }
    class UIVector extends UITranslatorBase implements UITranslator {
        multiplier: number;
        maxSigFigs: number;
        constraint: number;
        minimum: number;
        modOrMax: number;
        constructor(label: string, multiplier?: number, maxSigFigs?: number, constraint?: number, modOrMax?: number, minimum?: number);
        export(vector: Vector): Vector;
        import(vector: Vector): Vector;
    }
}
declare module cKit.elements {
    class ObjState {
        id: string;
        states: Dictionary<any>;
        constructor(id: string, states: Dictionary<any>);
    }
}
declare module cKit.events {
    enum controlModes {
        EDIT_SHAPE = 0,
        EDIT_TRANSFORM = 1,
        EDIT_NONE = 2,
    }
    function bindEvents(): void;
}
declare module cKit.objects {
    import elements = cKit.elements;
    import Vector = elements.Vector;
    import CPoint = elements.CPoint;
    import UITranslator = elements.UITranslator;
    class baseObject implements baseInterface {
        kit: cKit.CanvasKit;
        rotation: number;
        scale: number;
        center: Vector;
        uiTranslators: Dictionary<UITranslator>;
        animationAttributes: Array<string>;
        stateAttributes: Array<string>;
        type: string;
        lastScale: number;
        scaleDistance: number;
        cPoints: Array<CPoint>;
        transformPoints: Array<CPoint>;
        fillImage: elements.ImageResource;
        lineColor: string;
        constructor(kit: any);
        draw(): void;
        getUIAttribute(target: string): any;
        setUIAttribute(target: string, newValue: any): any;
        getControlPoint(index: any): Vector;
        setControlPoints(newControlPoints: Array<Vector>): void;
        setControlPointFromUI(index: number, point: Vector): void;
        setTransformPointFromUI(index: number, point: Vector): void;
        setItemFromUI(target: string, newValue: any): void;
        drawControlPoints(): void;
        drawTransformPoints(): void;
        setScale(xPosition: any): void;
        transform(): void;
        translateTranform(): void;
        reverseTransformPoint(point: any): Vector;
        exportControlPoints(): Array<Vector>;
        exportAnimationAttributes(): any;
        getStates(): Dictionary<any>;
        exportObject(): elements.ObjState;
        exportFrame(): elements.KeyState;
    }
}
declare module cKit.objects {
    import elements = cKit.elements;
    interface baseInterface {
        setUIAttribute(target: string, newValue: string): any;
        getUIAttribute(target: string): any;
        setControlPoints(newControlPoints: Array<elements.Vector>): any;
        setControlPointFromUI(index: number, newPoint: elements.Vector): any;
    }
}
declare module cKit.objects {
    import elements = cKit.elements;
    import Vector = elements.Vector;
    class PetalFlower extends baseObject {
        petals: number;
        accent: number;
        allPetals: Array<Array<Vector>>;
        firstPetal: Array<Vector>;
        maxRadius: number;
        increment: number;
        firstInnerAngle: number;
        constructor(kit: any, petals?: number, accent?: number, innerRadius?: number, outerRadius?: number);
        transform(): void;
        draw(): void;
        drawPetalFill(transform: any): void;
        createPetals(): void;
        updateIncrement(): void;
        updatePetal(index: number, newPoint: Vector): void;
        rebuild(): void;
        updateFirstPetal(): void;
        accentRadialPoint(centerScale: any): void;
        updateRadialPoint(): void;
        setUIAttribute(target: string, newValue: string): any;
        setControlPoints(newControlPoints: Array<elements.Vector>): void;
        setControlPointFromUI(index: any, newPoint: any): void;
        getControlPoint(index: any): Vector;
    }
}
declare module cKit.objects {
    import elements = cKit.elements;
    class ImageLayer extends baseObject {
        constructor(kit: any, imageResource?: elements.ImageResource);
        draw(): void;
        setState(target: string, newValue: any): void;
        setControlPointFromUI(index: any, newPoint: any): void;
    }
}
declare module cKit.objects {
    class Text extends baseObject {
        text: string;
        fontSize: number;
        textAlign: string;
        constructor(kit: any, text?: string);
        draw(): void;
        setState(target: string, newValue: any): void;
        setControlPointFromUI(index: any, newPoint: any): void;
    }
}
declare module cKit.stage {
    import objects = cKit.objects;
    import elements = cKit.elements;
    class ResourceList {
        kit: cKit.CanvasKit;
        objects: Array<objects.baseObject>;
        images: Array<elements.ImageResource>;
        constructor(kit: CanvasKit);
        addImage(src: any, page?: string, label?: string): void;
        addObject(itemConfig: any): number;
        changeObjectType(selectedObject: any, itemType: any): void;
        removeObject(index: number): void;
        clearResources(): void;
        export(): {
            imageList: any[];
            objectList: any[];
        };
        import(resources: any): void;
    }
}
declare module cKit.stage {
    import elements = cKit.elements;
    import Keyframe = cKit.elements.Keyframe;
    enum sceneModes {
        SCENE_NORMAL = 0,
        SCENE_GIF = 1,
    }
    class Stage {
        kit: cKit.CanvasKit;
        keyframes: Array<Keyframe>;
        stageConfig: StageConfig;
        sceneMode: number;
        animationMode: boolean;
        loopStartTime: number;
        segmentStartTime: number;
        segment: number;
        constructor(kit: any);
        init(): void;
        clearStage(): void;
        sceneLoop(): void;
        updateSegment(delta: number, segmentLength: number): void;
        exportKeyframes(): any[];
        importFrames(frames: Array<elements.Keyframe>): void;
        setKeyframeAttribute(target: string, segment: number, objIndex: number, value: any): void;
        getState(): elements.KeyState[];
        storeState(): void;
        clearStates(objectIndex?: number): void;
        loadState(segment: number): void;
        newKeyframe(): void;
        getSegmentTiming(): any;
        setSegmentTiming(value: any): void;
    }
    class StageConfig {
        kit: CanvasKit;
        uiTranslators: Dictionary<elements.UITranslator>;
        pauseTime: number;
        paused: boolean;
        seamlessAnimationTime: number;
        backgroundColor: string;
        backgroundAlpha: number;
        backgroundImage: elements.ImageResource;
        lineColor: string;
        sourceMode: string;
        frameRate: number;
        constructor(kit: CanvasKit);
        setAttribute(target: string, value: number): void;
        getAttribute(target: string): any;
        exportStageConfig(): any;
        importStageConfig(config: any): void;
    }
}
declare module cKit {
    import objects = cKit.objects;
    import elements = cKit.elements;
    import stage = cKit.stage;
    class CanvasKit {
        stage: stage.Stage;
        resourceList: stage.ResourceList;
        encoder: any;
        digest: any;
        colorFunc: any;
        canvas: any;
        context: any;
        canvasWidth: number;
        canvasHeight: number;
        midWidth: number;
        midHeight: number;
        editMode: number;
        dragMode: boolean;
        defaultObject: Dictionary<any>;
        initList: Array<Dictionary<any>>;
        selectedObject: number;
        fieldFocus: boolean;
        settingShelf: any;
        highlightCurve: boolean;
        toggleCurveColor: boolean;
        debugMode: boolean;
        objectTypes: Dictionary<string>;
        _u: any;
        constants: any;
        constructor();
        initializeCanvas(): void;
        setDigestFunc(newFunc: any): void;
        setColorFunc(newFunc: any): void;
        build(): void;
        redraw(): void;
        selectObject(obj: any): void;
        getSelectedObject(): objects.baseObject;
        getSelectedObjectType(): string;
        getObjectTypes(): Dictionary<string>;
        updateObjectType(objectType: string): void;
        addObject(): void;
        removeObject(): void;
        removeImage(index: number): void;
        getImage(): void;
        loadFrame(): void;
        removeKeyframe(): void;
        removeLast(): void;
        clearScene(): void;
        setObjectAttribute(target: any, value: any): void;
        getObjectAttribute(target: any): any;
        objectCount(): number;
        addImage(src: string, page?: string, label?: string): void;
        getImageList(): elements.ImageResource[];
        setSceneAttribute(target: any, value: any): void;
        getSceneAttribute(target: any): any;
        setFillImage(index: any): void;
        selectFirst(): void;
        selectPrev(): void;
        selectNext(): void;
        selectLast(): void;
        play(): void;
        stopScene(): void;
        loopInit(): void;
        sceneReset(): void;
        setTempModes(editMode: any, toggleCurveColor: any): void;
        restoreModes(): void;
        getConfigSetting(setting: string): any;
        getData(): {
            sceneSettings: {
                settingShelf: any;
            };
            keyframes: any[];
            stageConfig: any;
            resources: {
                imageList: any[];
                objectList: any[];
            };
        };
        loadData(data: any): void;
        exportSceneConfig(): {
            settingShelf: any;
        };
        importSceneConfig(config: any): void;
    }
    var kit: CanvasKit;
}
