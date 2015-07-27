module cKit.app.ui {
  export var NAME = "cKit.app.ui";

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
      if(!$scope.$$phase) {
        $scope.$digest();
      }
      /* UI updates possibly needed after keypush UI or cKit auto changes */
      //var fI = kit.getObjectAttribute('fillImage');
      //$scope.selectedFill = (fI)==-1?'':fI;
    };
    /* Inject Method to update UI when canvas package changes */
    kit.setDigestFunc(dig);


    self.objectPanelActive = true;
    self.scenePanelActive = true;
    self.animationPanelActive = true;
    self.loadingPanelActive = false;
    $scope.togglePanel = function(panelName) {
      if (panelName === 'objectPanel') {
        self.objectPanelActive = !self.objectPanelActive;
      } else if(panelName ==='scenePanel') {
        self.scenePanelActive = !self.scenePanelActive;
      } else if(panelName === 'animationPanel') {
        self.animationPanelActive = !self.animationPanelActive;
      } else {
        self.loadingPanelActive = !self.loadingPanelActive;
      }
    };

    $scope.isActive = function (panelName) {
      if (panelName === 'objectPanel') {
        return self.objectPanelActive;
      } else if(panelName ==='scenePanel') {
        return self.scenePanelActive;
      } else if(panelName === 'animationPanel') {
        return self.animationPanelActive;
      } else {
        return self.loadingPanelActive;
      }
    };

    // Prevent Keyboard Action
    $scope.fieldFocus = function() {
      $scope.kit.fieldFocus = true;
    };

    $scope.blurField = ($event) => {
      $scope.kit.fieldFocus = false;
      $event.target.blur();
    };

    $scope.unfocus = function() {
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
      } else if (obj === kit.selectedObject) {
        return 'active';
      } else {
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
      } else {
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

  export function run(){
    var mod = angular.module(NAME, []);
    mod.controller("uiPanelController", uiPanelController);
    mod.directive("objectPanel", objectPanel);
    mod.directive("scenePanel", scenePanel);
    mod.directive("animationPanel", animationPanel);
    mod.directive("loadingPanel", loadingPanel);
  }
}
cKit.app.ui.run();
