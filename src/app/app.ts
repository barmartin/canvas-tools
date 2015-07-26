module cKit.app {
  export var NAME = "cKit.app";
  export function run(){
    function configureRoutes($stateProvider){
      //$urlRouterProvider.otherwise("/notFound/");
      var home = {
        name: 'home',
        url: '/',
        templateUrl: '/views/home.html'
      };
      $stateProvider.state(home);
    }

    var app = angular.module(NAME, [
      "ui.router",

      cKit.app.ui.object.NAME,
      cKit.app.ui.state.NAME,
      cKit.app.ui.animation.NAME,
      cKit.app.ui.loading.NAME,
      cKit.app.services.NAME,

      cKit.app.directives.utilDirectives.NAME,
      cKit.app.directives.filters.NAME,
      cKit.app.directives.objectElement.NAME,
      cKit.app.directives.sceneElement.NAME,

      cKit.app.nav.NAME,
      cKit.app.ui.NAME
    ]);

    app.config(configureRoutes);
  }
}
cKit.app.run();
