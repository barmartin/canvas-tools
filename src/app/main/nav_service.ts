module cKit.app.nav {
  export var NAME = "cKit.app.nav";

  function navMenu(){
    return {
      requires: [],
      restrict: "A",
      controller: 'navMenuController',
      link: function(scope) {

        console.log("testsas");
      },
      template: "<div>test</div>"
    }
  } //'main/templates/nav.html'


  function navMenuController($scope, $state) {
    $scope.isTabActive = function (tabName) {
      // Check if there is sub-states
      var stateName = $state.current.name,
          subStatePos = stateName.indexOf('.');

      if (subStatePos > -1) {
        stateName = stateName.substring(0, subStatePos);
      }

      if (tabName === stateName) {
        return 'active';
      }
    };
  };

  export function run(){
    var mod = angular.module(NAME, []);
    mod.controller("navMenuController", navMenuController);
    mod.directive("navMenu", navMenu);
  }
}
cKit.app.nav.run();