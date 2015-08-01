module cKit.app.ui.state {
  export var NAME = "cKit.app.ui.state";

  import services = cKit.app.services;

  function sceneController($scope, kitService) {
    var kit = kitService;
    var constants = kit.constants;
    var _u = kit._u;

    $scope.highlightCurve = kit.highlightCurve;
    $scope.highlightCurveChange = function () {
      kit.highlightCurve = $scope.highlightCurve;
      kit.redraw();
    };


    // Composition mode drop-down
    $scope.sources = kit.getConfigSetting('source-modes');
    $scope.sourceKeys = _u.getKeys(constants.SOURCE_MODES);
    $scope.sourceMode = 'lighter';
    $scope.updateCompositionMode = function () {
      kit.setSceneAttribute('sourceMode', $scope.sourceMode);
    };
    $scope.$watch(function() {
      return kit.getSceneAttribute('sourceMode');
    }, function(value) {
      $scope.sourceMode = value;
    });

    $scope.$watch(function() {
      return kit.getSceneAttribute('backgroundImage');
    }, function(value) {
      $scope.selectedBackground = value;
    });

    $scope.updateBackground = function(selectedBackground) {
      kit.setSceneAttribute('backgroundImage', selectedBackground);
    };

    $scope.getImage = function () {
      kit.getImage();
    };

    /* color picker . . */
    services.initLibUI();
  };
  export function run() {
    var mod = angular.module(NAME, []);
    mod.controller("sceneController", sceneController);
  }
}
cKit.app.ui.state.run();