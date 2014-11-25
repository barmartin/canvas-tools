define(['angularAMD', 'ui-bootstrap'], function (angularAMD) {
  'use strict';
  angularAMD.controller('animationController', ['$scope', function ($scope) {
    $scope.kit = kit;

    // Object, Shape, Image Selection, Removal
    $scope.objectSelector = kit.selectedObject;
    $scope.$watch(function () {
      return kit.selectedObject;
    }, function (value) {
      $scope.objectSelector = kit.selectedObject;
    });
    $scope.objectSelectorClasses = function (obj) {
      if(obj >= kit.objList.length) {
        return 'disabled';
      } else if(obj===kit.selectedObject){
        return 'active';
      } else {
        return '';
      }
    }
    $scope.selectObject = function(newValue) {
      kit.selectObject(newValue);
    };
    $scope.maxObjects = function () {
      if($scope.kit.objList.length === constants.MAX_OBJECTS) {
        return 'disabled';
      }
    };

    // Animation
    $scope.play = function() {
      kit.loopInit();
      kit.sceneLoop();
    }
    $scope.stop = function() {
      kit.stopScene();
    }

    $scope.segment = kit.segment;
    $scope.$watch(function () {
      return kit.segment;
    }, function (value) {
      $scope.segment = kit.getSegment();
    });
    $scope.selectFirst = function() {
      kit.selectFirst();
    }
    $scope.selectPrev = function() {
      kit.selectPrev();
    }
    $scope.selectNext = function() {
      kit.selectNext();
    }
    $scope.selectLast = function() {
      kit.selectLast();
    }

    $scope.removeKeyframe = function() {
      kit.removeKeyframe();
    }
    $scope.removeLast = function() {
      kit.removeLast();
    }

    // Edit Mode: Shape, Transform, None
    $scope.editMode = kit.editMode;
    $scope.$watch(function () {
      return kit.editMode;
    }, function (value) {
      $scope.editMode = kit.editMode;
    });
    $scope.setEditMode = function(newValue) {
      kit.editMode = newValue;
      kit.redraw();
    };
    $scope.editSelectorClasses = function(val) {
      if(val===kit.editMode){
        return 'active';
      } else {
        return '';
      }
    };

    $scope.length = 1;
    $scope.lengthChange = function() {
      if(kit.initialized) {
        kit.keyFrames[kit.getSegment()].timing = kit._u.parseFloatOrDefault($scope.length, 1);
      }
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        return kit.keyFrames[kit.getSegment()].timing;
      } else {
        return 1;
      }
    }, function (value) {
      $scope.length = value;
    });

    $scope.rotation = 0;
    $scope.rotationChange = function() {
      if(kit.initialized) {
        kit.setRotation($scope.rotation);
      }
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        return kit.objList[kit.selectedObject].rotation;
      } else {
        return 0;
      }
    }, function (value) {
      $scope.rotation = kit._u.reduceSig((value/kit.constants.PI*180)%360, 2);
    });

    $scope.seamlessAnimation = kit.seamlessAnimation;
    $scope.seamlessChange = function() {
      kit.seamlessAnimation = $scope.seamlessAnimation;
    }
    $scope.highlightCurve = kit.highlightCurve;
    $scope.highlightCurveChange = function() {
      kit.highlightCurve = $scope.highlightCurve;
      kit.redraw();
    }
    // TODO
    /*
    $('#makeGIF').click(function() {
      $('#playSegment, #playAll, #makeGIF').attr('disabled', true);
      kit.gifInit();
      kit.sceneLoop();
    });
    */
  }]);
});