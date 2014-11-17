(function() {

  var app = angular.module('ck', [ ]);

  app.directive('controlPanels', function(){
    return {
      'restrict': 'E',
      'templateUrl': 'templates/control-panels.html',
      controller: function(){
        this.tab = 1;
        this.selectTab = function(newTab) {
          this.tab = newTab;
        };
        this.isSelected = function(checkTab) {
          return this.tab === checkTab;
        };
      },
      controllerAs: 'tabCtrl'
    }
  });

  app.directive('shapeTab', function(){
    return {
      'restrict': 'E',
      'templateUrl': 'templates/shape.html',
      controller: function(){
        
      },
      controllerAs: 'shapeCtrl'
    }
  });

  app.directive('animationTab', function(){
    return {
      'restrict': 'E',
      'templateUrl': 'templates/animation.html',
      controller: function(){
        
      },
      controllerAs: 'animationCtrl'
    }
  });

  app.directive('loadingTab', function(){
    return {
      'restrict': 'E',
      'templateUrl': 'templates/loading.html',
      controller: function(){
        
      },
      controllerAs: 'loadingCtrl'
    }
  });

  app.controller('SceneController', function() {
    this.canvasLoaded = true;
  });


  app.controller('ConsoleController', function() {
  
  });

})();