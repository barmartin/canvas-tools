module cKit.app.directives.sceneElement {
  export var NAME = "cKit.app.directives.sceneElement";

  function link(scope, element, attrs) {
    var target = element.attr('scene-element');
    if(attrs.hasOwnProperty('labelOnly')){
      element.html(scope.kit.getSceneAttribute(target));
      scope[target] = scope.kit.getSceneAttribute(target);
      scope.$watch(function() {
            return scope.kit.getSceneAttribute(target)},
          function() {
            element.html(scope.kit.getSceneAttribute(target));
          });

    } else if (attrs.type == 'checkbox') {
      scope[target] = scope.kit.getSceneAttribute(target);
      scope.$watch(function() {
            return scope.kit.getSceneAttribute(target)},
          function() {
            scope[target] = scope.kit.getSceneAttribute(target);
          });
      element.bind('change', function () {
        if(scope.seamlessAnimation) {
          scope.kit.setSceneAttribute(target, false);
        } else {
          scope.kit.setSceneAttribute(target, true);
        }
      });
    } else {
      element.val(scope.kit.getSceneAttribute(target));
      scope.$watch(function () {
            return scope.kit.getSceneAttribute(target)
          },
          function () {
            element.val(scope.kit.getSceneAttribute(target));
          });
      element.bind('change', function () {
        scope.kit.setSceneAttribute(target, this.value);
      });
    }
  }

  function sceneElement() {
    return {
      restrict: "A",
      link: link
    }
  }

  export function run() {
    var mod = angular.module(NAME, []);
    mod.directive("sceneElement", sceneElement);
  }
}
cKit.app.directives.sceneElement.run();