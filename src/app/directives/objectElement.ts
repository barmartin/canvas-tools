module cKit.app.directives.objectElement {
  export var NAME = "cKit.app.directives.objectElement";

  function link(scope, element, attrs) {
    var target = attrs['objectElement'];
    element.val(scope.kit.getObjectAttribute(target));
    scope.$watch(function() {
      return scope.kit.getObjectAttribute(target)},
      function() {
        element.val(scope.kit.getObjectAttribute(target));
       });
    element.bind('change', function() {
      scope.kit.setObjectAttribute(target, this.value);
    });
  }

  function objectElement() {
    return {
      restrict: "A",
      link: link,
    }
  }

  export function run() {
    var mod = angular.module(NAME, []);
    mod.directive("objectElement", objectElement);
  }
}
cKit.app.directives.objectElement.run();