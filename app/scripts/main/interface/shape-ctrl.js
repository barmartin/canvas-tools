define(['angularAMD', 'ui-bootstrap'], function (angularAMD) {
  'use strict';
  angularAMD.controller('shapeController', ['$scope', function ($scope) {
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
    $scope.petalCount = 6;
    $scope.petalChange = function() {
      kit.updatePetalCount(kit._u.parseIntOrDefault($scope.petalCount, constants.DEFAULT_RAYS));
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        return kit.objList[kit.selectedObject].petalCount;
      } else {
        return 6;
      }
    }, function (value) {
      $scope.petalCount = value;
    });

    $scope.radialAccent = 1;
    $scope.radialChange = function() {
      kit.updateRadialAccent(kit._u.parseFloatOrDefault($scope.radialAccent, 1));
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        return kit.objList[kit.selectedObject].radialAccent;
      } else {
        return 6;
      }
    }, function (value) {
      $scope.radialAccent = value;
    });

    $scope.addObject = function() {
      kit.addObject();
    }
    $scope.removeObject = function() {
      kit.removeObject();
    }
    
    $scope.backgroundAlpha = kit.backgroundAlpha;
    $scope.backgroundAlphaChange = function() {
      kit.setAlpha($scope.backgroundAlpha);
      kit.redraw();
      $scope.unfocus();
    }
    $scope.$watch(function () {
      return kit.backgroundAlpha;
    }, function (value) {
      $scope.backgroundAlpha = value;
    });

    // Composition mode drop-down
    $scope.sources = constants.SOURCE_MODES;
    $scope.sourceKeys = kit._u.getKeys(constants.SOURCE_MODES);
    $scope.sourceMode = '';
    $scope.updateCompositionMode = function() {
      kit.sourceMode = $scope.sourceMode;
      kit.redraw();
    }
    $scope.$watch(function () {
      return kit.sourceMode;
    }, function (value) {
      $scope.sourceMode = kit.sourceMode;
    });

    $scope.getImage = function() {
      kit.getImage();
    }
  }]);
});