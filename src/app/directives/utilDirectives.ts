module cKit.app.directives.utilDirectives {
  export var NAME = "cKit.app.directives.utilDirectives";

  function ngEnter(){
    return (scope, element, attrs) => {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13 || event.which === 27) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter, {'event': event});
          });

          event.preventDefault();
        }
      });
    }
  }

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
    mod.directive("ngEnter", ngEnter);
  }
}

cKit.app.directives.utilDirectives.run();