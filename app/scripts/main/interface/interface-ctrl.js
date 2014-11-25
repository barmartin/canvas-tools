define(['angularAMD', 'ui-bootstrap'], function (angularAMD) {
  'use strict';
  angularAMD.controller('interfaceController', ['$scope', function ($scope) {
    $scope.kit = kit;
    $scope.initializeUI = function() {
      initInterface();
      // This injected function allows the canvas package to trigger a UI refresh
      kit.digest = function() {
        if(!$scope.$$phase) {
          $scope.$digest();
        }
      }
    }


    $scope.panelTab = '1';
    $scope.setPanel = function(panelName) {
      $scope.panelTab = panelName;
    }
    $scope.isPanelActive = function (panelName) {
      if ($scope.panelTab === panelName) {
        return 'active';
      }
    };

    // Prevent Keyboard Action
    $scope.fieldFocus = function() {
      kit.fieldFocus = true;
    }
    $scope.unfocus = function() {
      kit.fieldFocus = false;
    }

  }]);
});
