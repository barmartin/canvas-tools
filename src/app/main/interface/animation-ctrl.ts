module cKit.app.ui.animation {
  export var NAME = "cKit.app.ui.animation";

  function animationController($scope) {
    var kit = $scope.kit;
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
  }
  export function run(){
    var mod = angular.module(NAME, []);
    mod.controller("animationController", animationController);
  }
}
cKit.app.ui.animation.run();