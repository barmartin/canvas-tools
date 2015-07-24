module cKit.app.directives.stopEvents {
  export var NAME = "cKit.app.directives.stopEvents";

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

cKit.app.directives.stopEvents.run();