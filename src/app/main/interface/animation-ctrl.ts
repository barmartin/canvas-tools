module cKit.app.ui.animation {
  export var NAME = "cKit.app.ui.animation";

  function animationController($scope) {
  }
  export function run(){
    var mod = angular.module(NAME, []);
    mod.controller("animationController", animationController);
  }
}
cKit.app.ui.animation.run();