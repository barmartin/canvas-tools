define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.directive('interfaceMenu', function () {
    return {
      restrict: 'A',
      controller: 'interfaceController',
      templateUrl: 'views/interface/interface.html'
    };
  });

  angularAMD.directive('shapePanel', function () {
    return {
      restrict: 'A',
      controller: 'shapeController',
      templateUrl: 'views/interface/shape.html'
    };
  });

  angularAMD.directive('animationPanel', function () {
    return {
      restrict: 'A',
      controller: 'animationController',
      templateUrl: 'views/interface/animation.html'
    };
  });

  angularAMD.directive('loadingPanel', function () {
    return {
      restrict: 'A',
      controller: 'loadingController',
      templateUrl: 'views/interface/loading.html'
    };
  });

});