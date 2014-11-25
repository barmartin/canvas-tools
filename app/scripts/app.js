define(['common'], function (angularAMD) {
  'use strict';
  var app = angular.module('canvasKit', ['ui.router', 'ngResource']);

  app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', angularAMD.route({
        url: '/home',
        templateUrl: 'views/home.html',
        // controllerUrl: 'main/interface/interface-ctrl'
      }));

    // Else
    $urlRouterProvider
      .otherwise('/home');
  }]);

  return angularAMD.bootstrap(app);
});
