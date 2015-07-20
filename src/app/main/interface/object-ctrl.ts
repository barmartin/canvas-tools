module cKit.app.ui.object {
  export var NAME = "cKit.app.ui.object";

  function objectController($scope, kitService) {
    var kit = kitService;

    // Object, Shape, Image Selection, Removal
    /* Object attributes besides fillImage are handled by the sceneElement directive dynamically */
    $scope.addObject = function () {
      kit.addObject();
    };
    $scope.removeObject = function () {
      kit.removeObject();
    };

    $scope.getImage = function () {
      kit.getImage();
    };

    $scope.updateFill = function() {
      //console.log('update fill:' + $scope.selectedFill);
      kit.setFillImage($scope.selectedFill);
    };
  };
  export function run() {
    var mod = angular.module(NAME, []);
    mod.controller("objectController", objectController);
  }
}
cKit.app.ui.object.run();