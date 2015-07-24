module cKit.app.ui.loading {
  export var NAME = "cKit.app.ui.loading";

  declare var JXG;

  export var prefixString = "----------Start Canvas Kit Patch----------" + '\n';
  export var postfixString = '\n' + "-----------End Canvas Kit Patch-----------";

  function loadingController($scope) {
    var kit = $scope.kit;
    // Loading
    // For the moment the JSON items are the only events that require JQuery
    $scope.fieldData = '';
    $scope.loadSample = function () {
      kit.loadData(cKit.app.services.getSampleJSON());

    };
    $scope.loadPatch = function () {
      if ($scope.fieldData === '') {
        return;
      }
      var encodedPatch = $scope.fieldData.replace(prefixString, '').replace(postfixString, '');
      var dataz = $.parseJSON(JXG.Util.Base64.decode(encodedPatch));
      kit.loadData(dataz);
    };
    $scope.getPatchData = function () {
      var data = kit.getData();
      $scope.fieldData = prefixString + JXG.Util.Base64.encode(JSON.stringify(data)) + postfixString;
    };

    $scope.clearScene = function () {
      kit.clearScene();
    };

    $scope.selectedRemovalImage = "";
    $scope.removeImage = function() {
      kit.removeImage($scope.selectedRemovalImage);
      $scope.selectedRemovalImage = "";
    };

    $scope.addImage = function(){
      kit.addImage($scope.newImageUrl, $scope.newImagePage, $scope.newImageLabel);
      $scope.newImageUrl = "";
      $scope.newImagePage = "";
      $scope.newImageLabel = "";
    }
  }
  export function run(){
    var mod = angular.module(NAME, []);
    mod.controller("loadingController", loadingController);
  }
}
cKit.app.ui.loading.run();