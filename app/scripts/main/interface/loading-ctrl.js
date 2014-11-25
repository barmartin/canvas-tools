define(['angularAMD', 'ui-bootstrap'], function (angularAMD) {
  'use strict';
  angularAMD.controller('loadingController', ['$scope', function ($scope) {
    $scope.kit = kit;
    // Loading
    // For the moment the JSON items are the only events that require JQuery
    $scope.fieldData = '';
    $scope.loadSample = function() {
      var dataz = $.parseJSON(sampleJSON);
      kit.loadData(dataz, false);
    }
    $scope.loadData = function() {
      if($scope.fieldData==='') {
        return;
      }
      var dataz = $.parseJSON($scope.fieldData);
      kit.loadData(dataz, false);
    }
    $scope.getLoadData = function() {
      var settings = kit.getSettings();
      $scope.fieldData = JSON.stringify([settings, kit.resourceList, kit.objTypes, kit.keyFrames]);
    }
    $scope.clearScene = function() {
      kit.clearScene();
    }

    // Resources
    $scope.backgroundImageSource = '';
    $scope.backgroundImageSourceChange = function() {
      if(kit.initialized) {
        kit.addBackgroundImage($scope.backgroundImageSource);
      } 
      kit.fieldFocus = false;
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        return kit.resourceList.backgroundImageSource;
      } else {
        return '';
      }
    }, function (value) {
      $scope.backgroundImageSource = value;
    });

    $scope.backgroundImagePage = '';
    $scope.backgroundImagePageChange = function() {
      if(kit.initialized) {
        kit.resourceList.backgroundImagePage = $scope.backgroundImagePage;
      }
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        return kit.resourceList.backgroundImagePage;
      } else {
        return '';
      }
    }, function (value) {
      $scope.backgroundImagePage = value;
    });

    $scope.fillImageSource = '';
    $scope.fillImageSourceChange = function() {
      if(kit.initialized) {
        kit.addFillImage($scope.fillImageSource);
      }
      kit.fieldFocus = false;
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        return kit.resourceList.fillImageSource;
      } else {
        return '';
      }
    }, function (value) {
      $scope.fillImageSource = value;
    });

    $scope.fillImagePage = '';
    $scope.fillImagePageChange = function() {
      if(kit.initialized) {
        kit.resourceList.fillImagePage = $scope.fillImagePage;
      }
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        return kit.resourceList.fillImagePage;
      } else {
        return '';
      }
    }, function (value) {
      $scope.fillImagePage = value;
    });
  }]);
});