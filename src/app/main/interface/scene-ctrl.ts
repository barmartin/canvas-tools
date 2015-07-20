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
      kit.sourceMode = $scope.sourceMode;
      kit.redraw();
    };

    $scope.updateBackground = function() {
      //console.log('update background:' + $scope.selectedBackground);
      kit.setBackgroundImage($scope.selectedBackground);
    };

    /* SourceMode is only modded in UI....
    $scope.$watch(function () {
      return kit.sourceMode;
    }, function (value) {
      $scope.sourceMode = kit.sourceMode;
    }); */

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