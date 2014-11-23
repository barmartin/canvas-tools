define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home.state', {
        url: '/state',
        templateUrl: 'views/home/state.html'
      })
      .state('home.animation', {
        url: '/animation',
        templateUrl: 'views/home/animation.html'
      })
      .state('home.loading', {
        url: '/loading',
        templateUrl: 'views/home/loading.html'
      })
    ;

    // Else -- This is not working for some reason:
    $urlRouterProvider
      .when('/home', '/home/state');

  }]);

});
