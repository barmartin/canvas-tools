module caffeine.common.directives.stopEvents {
  export var NAME = "caffeine.common.directives.stopEvents";

  var requires = [];
  var restrict = "AE";
  var scope = {};

  function stopEvents(){
    return {
      require: requires,
      restrict: restrict,
      scope: scope,
      link: link
    }
  }

  function link(scope, element, attrs) {
    element.bind('click', function(e) {
      e.stopPropagation();
    });
  }

  export function run(){
    var mod = angular.module(NAME, []);
    mod.directive("stopEvents", stopEvents);
  }
}

caffeine.common.directives.stopEvents.run();