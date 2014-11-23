define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.controller('interfaceController', ['$scope', '$state', function ($scope, $state) {
    $scope.isTabActive = function (tabName) {
      // Check if there is sub-states
      var stateName = $state.current.name,
        subStatePos = stateName.indexOf('.');

      if (subStatePos > -1) {
        stateName = stateName.substring(0,subStatePos);
      }

      if (tabName === stateName) {
        return 'active';
      }
    };

    $scope.$on('$viewContentLoaded', function() {
      window.kit = new window.kit();
      window.initInterface();
    });

  }]);

  angularAMD.directive('interfaceMenu', function () {
    return {
      restrict: 'A',
      controller: 'interfaceController',
      templateUrl: 'views/interface.html'
    };
  });
});
