define(['angularAMD', 'ui-bootstrap'], function (angularAMD) {
  'use strict';
  angularAMD.controller('interfaceController', ['$scope', '$state', function ($scope, $state) {
  	// 1:shape, 2:animation, 3:loading
    $scope.panelTab = '1';
    $scope.kit = kit;

    // This injected function allows the canvas package to trigger a UI refresh
    kit.digest = function() {
      if(!$scope.$$phase) {
    	  $scope.$digest();
      }
    }
    $scope.isPanelActive = function (panelName) {
      if ($scope.panelTab === panelName) {
        return 'active';
      }
    };


    $scope.$watch('panelTab', function (newValue) {
      if (newValue) {
      	$scope.panelTab = newValue;
      }
    });

    // Prevent Keyboard Action
    $scope.fieldFocus = function() {
      kit.fieldFocus = true;
    }
    $scope.unfocus = function() {
      kit.fieldFocus = false;
    }

    // Object, Shape, Image Selection, Removal
    $scope.objectSelector = kit.selectedObject;
		$scope.$watch(function () {
		  return kit.selectedObject;
		}, function (value) {
    	$scope.objectSelector = kit.selectedObject;
    });
    $scope.objectSelectorClasses = function (obj) {
    	if(obj >= kit.objList.length) {
    		return 'disabled';
    	}
    }
    $scope.selectObject = function(newValue) {
      kit.selectObject(newValue);
		};
    $scope.maxObjects = function () {
      if ($scope.kit.objList.length === constants.MAX_OBJECTS) {
        return 'disabled';
      }
    };
    $scope.petalCount = 6;
    $scope.petalChange = function() {
      kit.updatePetalCount(kit._u.parseIntOrDefault($scope.petalCount, constants.DEFAULT_RAYS));
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        return kit.objList[kit.selectedObject].petalCount;
      } else {
        return 6;
      }
    }, function (value) {
      $scope.petalCount = value;
    });

    $scope.radialAccent = 1;
    $scope.radialChange = function() {
      kit.updateRadialAccent(kit._u.parseFloatOrDefault($scope.radialAccent, 1));
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        return kit.objList[kit.selectedObject].radialAccent;
      } else {
        return 6;
      }
    }, function (value) {
      $scope.radialAccent = value;
    });

    $scope.addObject = function() {
    	kit.addObject();
    }
    $scope.removeObject = function() {
    	kit.removeObject();
    }
    $scope.getImage = function() {
      kit.getImage();
    }

    // Edit Mode: Shape, Transform, None
    $scope.editMode = kit.editMode;
    $scope.$watch(function () {
      return kit.editMode;
    }, function (value) {
      $scope.editMode = kit.editMode;
    });
    $scope.setEditMode = function(newValue) {
      kit.setEditMode(newValue);
    };

    // Animation
    $scope.play = function() {
      kit.loopInit();
      kit.sceneLoop();
    }
    $scope.stop = function() {
      kit.stopScene();
    }

    $scope.segment = kit.segment;
		$scope.$watch(function () {
		  return kit.segment;
		}, function (value) {
    	$scope.segment = value;
    });
   	$scope.selectFirst = function() {
    	kit.selectFirst();
    }
   	$scope.selectPrev = function() {
    	kit.selectPrev();
    }
   	$scope.selectNext = function() {
    	kit.selectNext();
    }
   	$scope.selectLast = function() {
    	kit.selectLast();
    }

    $scope.removeKeyframe = function() {
    	kit.removeKeyframe();
    }
    $scope.removeLast = function() {
    	kit.removeLast();
    }

    // Segment is the frame being animated into
    // Timing is pulled from the previous segment
    // Currently considering altering this functionality
    $scope.length = 1;
    $scope.lengthChange = function() {
      if(kit.initialized) {
        kit.keyFrames[segment].timing = kit._u.parseFloatOrDefault($scope.length, 1);
      }
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        var thisSegment = kit.segment;
        if(kit.animationMode) {
          thisSegment = (thisSegment+kit.keyFrames.length-1)%kit.keyFrames.length;
        }
        return kit.keyFrames[thisSegment].timing;
      } else {
        return 1;
      }
    }, function (value) {
      $scope.length = value;
    });

    $scope.rotation = 0;
    $scope.rotationChange = function() {
      if(kit.initialized) {
        kit.objList[kit.selectedObject].rotation = (kit._u.parseFloatOrDefault($scope.rotation, 0)*kit.constants.PI/180)%(2*kit.constants.PI);
      }
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        return (kit.objList[kit.selectedObject].rotation/kit.constants.PI*180)%360
      } else {
        return 0;
      }
    }, function (value) {
      $scope.rotation = value;
    });



    // Loading
    // For the moment these are the only events that require JQuery
    $scope.fieldData = '';
    $scope.loadSample = function() {
      var dataz = $.parseJSON(sampleJSON);
      kit.loadData(dataz, false);
    }
    $scope.loadData = function() {
      var dataz = $.parseJSON($scope.fieldData);
      kit.loadData(dataz, false);
    }
    $scope.getLoadData = function() {
      var settings = kit.getSettings();
      $scope.fieldData = JSON.stringify([settings, kit.resourceList, kit.objTypes, kit.keyFrames]);
    }
    $scope.clearScene = function() {
      kit.clearScene();
    }

    // Resources
    $scope.backgroundImageSource = '';
    $scope.backgroundImageSourceChange = function() {
      if(kit.initialized) {
        kit.addBackgroundImage($scope.backgroundImageSource);
      } 
      kit.fieldFocus = false;
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        return kit.resourceList.backgroundImageSource;
      } else {
        return '';
      }
    }, function (value) {
      $scope.backgroundImageSource = value;
    });

    $scope.backgroundImagePage = '';
    $scope.backgroundImagePageChange = function() {
      if(kit.initialized) {
        kit.resourceList.backgroundImagePage = $scope.backgroundImagePage;
      }
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        return kit.resourceList.backgroundImagePage;
      } else {
        return '';
      }
    }, function (value) {
      $scope.backgroundImagePage = value;
    });

    $scope.fillImageSource = '';
    $scope.fillImageSourceChange = function() {
      if(kit.initialized) {
        kit.addFillImage($scope.fillImageSource);
      }
      kit.fieldFocus = false;
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        return kit.resourceList.fillImageSource;
      } else {
        return '';
      }
    }, function (value) {
      $scope.fillImageSource = value;
    });

    $scope.fillImagePage = '';
    $scope.fillImagePageChange = function() {
      if(kit.initialized) {
        kit.resourceList.fillImagePage = $scope.fillImagePage;
      }
    }
    $scope.$watch(function () {
      if(kit.initialized) {
        return kit.resourceList.fillImagePage;
      } else {
        return '';
      }
    }, function (value) {
      $scope.fillImagePage = value;
    });

    /* TODO last UI of functionality to transfer into AngularAMD
    $('#shapeColor').prop("checked", kit.toggleCurveColor);
    $('#shapeColor').click( function() {
      if(this.checked) {
        kit.toggleCurveColor = true;
      } else {
        kit.toggleCurveColor = false;
      }
      kit.redraw();
      return true;
    });

    $('#myCanvas').mousedown(function(event) {
      event.preventDefault();
    });

    $('#bgAlpha').change(function() {
      var newAlpha = parseFloat($(this).val());
      if( kit._u.dnexist(newAlpha) || newAlpha > 1 ) {
        kit.backgroundAlpha = 1.0;
        $(this).val('1.0');
      } else if( newAlpha < 0) {
        kit.backgroundAlpha = 0.0;
        $(this).val('0.0');
      } else {
        kit.backgroundAlpha = newAlpha;
      }
      kit.redraw();
    });

    var index = 0;
    var dropdownHTML = '';
    kit._u.each(kit.constants.SOURCE_MODES, function(label, mode) {
      dropdownHTML += '<option value="'+index+'">'+label+'</option>\n'
      index++;
    });
    $('#sourceMode').html(dropdownHTML).change(function() {
      var key = kit._u.getKeys(kit.constants.SOURCE_MODES)[this.value];
      kit.sourceMode = key;
      kit.redraw();
    });
    $('#seamless').click( function() {
      if(this.checked) {
        kit.seamlessAnimation = true;
      } else {
        kit.seamlessAnimation = false;
      }
      kit.redraw();
      return true;
    });
    $('#playSegment').click(function() {
      kit.animationMode = true;
      if(kit.segment === 0) {
        if(kit.keyFrames.length < 2) {
          return;
        }
      } else {
        kit.segment--;
      }
      kit.setState();
      kit.segment++;
      kit.setTime = 0;
      kit.loopStartTime = new Date().getTime();
      $(this).attr('disabled', true);
      $('#playSegment, #playAll, #makeGIF').attr('disabled', true);
      $('#stop').attr('disabled', false);
      kit.segmentLoop();
    });
    
    $('#makeGIF').click(function() {
      $('#playSegment, #playAll, #makeGIF').attr('disabled', true);
      kit.gifInit();
      kit.sceneLoop();
    });
    */
  }]);
});
