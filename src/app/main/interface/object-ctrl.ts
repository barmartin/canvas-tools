module cKit.app.ui.object {
  export var NAME = "cKit.app.ui.object";

  function objectController($scope, kitService) {
    var kit = kitService;

    // Object, Shape, Image Selection, Removal
    /* Object attributes besides fillImage are handled by the sceneElement directive dynamically */
    $scope.changeObjectType = () => {
      kit.updateObjectType($scope.selectedObjectType);

    };
    $scope.selectedObjectType = kit.getSelectedObjectType();
    $scope.objectTypes = kit.getObjectTypes();
    $scope.$watch( () => {
      return kit.getSelectedObjectType();
    }, (value) => {
      $scope.selectedObjectType = (value)==-1?'':value;
    });

    $scope.addObject = () => {
      kit.addObject();
    };
    $scope.removeObject = () => {
      kit.removeObject();
    };

    $scope.getImage = () => {
      kit.getImage();
    };

    $scope.updateFill = () => {
      //console.log('update fill:' + $scope.selectedFill);
      kit.setFillImage($scope.selectedFill);
    };

    $scope.$watch( () => {
      return kit.getObjectAttribute('fillImage');
    }, (value) => {
      $scope.selectedFill = (value)==-1?'':value;
    });

  };
  export function run() {
    var mod = angular.module(NAME, []);
    mod.controller("objectController", objectController);
  }
}
cKit.app.ui.object.run();