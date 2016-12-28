angular.module('starter.directive', [])

.directive('searchBar', [function () {
	return {
		scope: {
			ngModel: '=',
		},
		require: ['^ionNavBar', '?ngModel'],
		restrict: 'E',
		replace: true,
		template: '<ion-nav-buttons side="right">'+
						'<div class="searchBar">'+
							'<div class="searchTxt" ng-show="ngModel.show">'+
						  		'<div class="bgdiv"></div>'+
						  		'<div class="bgtxt">'+
						  			'<input type="text" placeholder="Search Movies" ng-model="ngModel.txt">'+
						  		'</div>'+
					  		'</div>'+
						  	'<i class="icon placeholder-icon" ng-click="ngModel.txt=\'\';ngModel.show=!ngModel.show"></i>'+
						'</div>'+
					'</ion-nav-buttons>',
		
		compile: function (element, attrs) 
		{
			var icon=attrs.icon
					|| (ionic.Platform.isAndroid() && 'ion-android-search')
					|| (ionic.Platform.isIOS()     && 'ion-ios7-search')
					|| 'ion-search';
			angular.element(element[0].querySelector('.icon')).addClass(icon);
			
			return function($scope, $element, $attrs, ctrls) {
				var navBarCtrl = ctrls[0];
				$scope.navElement = $attrs.side === 'right' ? navBarCtrl.rightButtonsElement : navBarCtrl.leftButtonsElement;
				
			};
		},
		controller: ['$scope','$ionicNavBarDelegate', function($scope,$ionicNavBarDelegate){
			var title, definedClass;
			$scope.$watch('ngModel.show', function(showing, oldVal, scope) 
			{
				if(showing !== oldVal) 
				{
					console.log("show");
					if(showing) 
					{
						$scope.searchItem = "Showing";
						
						if(!definedClass) 
						{
							//var numicons=$scope.navElement.children().length;
							//angular.element($scope.navElement[0].querySelector('.searchBar')).addClass('numicons'+numicons);
						}
						
						title = $ionicNavBarDelegate.getTitle();
						$ionicNavBarDelegate.setTitle('');
					} 
					else 
					{
						$ionicNavBarDelegate.setTitle(title);
					}
				} 
				else
				{	
					$scope.searchItem = "Hidden";
					//if(!title) 
						//title = $ionicNavBarDelegate.getTitle();
				}
			});
		}]
	};
}])

.directive('imgCropped', function($window) {
    var bounds = {};

    return {
      restrict: 'E',
      replace: true,
      scope: { src:'=', selected:'&' },
      link: function (scope, element) {
        var myImg
          , clear = function() {
              if (myImg) {
                myImg.next().remove();
                myImg.remove();
                myImg = undefined;
              }
            }
          ;

        scope.$watch('src', function (nv) {
          clear();

            console.log(nv);
            if (!nv) { // newValue
                return;
            }
          
            element.after('<img style="max-width: 100%;"/>');
            myImg = element.next();
            myImg.attr('src', nv);
            setTimeout(function()
            { 
                var selectionWidth = 0;

                if(myImg.prop('clientWidth') < myImg.prop('clientHeight'))
                {
                    selectionWidth = myImg.prop('clientWidth');
                    startY = (myImg.prop('clientHeight') - selectionWidth) / 2;
                    startX = 0;
                }
                else
                {
                    selectionWidth = myImg.prop('clientHeight');
                    startX = (myImg.prop('clientWidth') - selectionWidth) / 2;
                    startY = 0;
                }

                $window.jQuery(myImg).Jcrop({ 
                    trackDocument: true, 
                    onSelect: function(cords) {
                        scope.$apply(function() {
                          scope.selected({cords: cords});
                        });
                    }, 
                    setSelect: [startX, startY, selectionWidth, selectionWidth],
                    minSize: [selectionWidth, selectionWidth],
                    allowSelect: false,
                    aspectRatio: 1,
                    trueSize: [element.attr("dataWidth"), element.attr("dataHeight")]
                }, 
                function() {
                  var boundsArr = this.getBounds();
                  bounds.x = boundsArr[0];
                  bounds.y = boundsArr[1];
                }
              );
            }, 1000);
        });
        
        scope.$on('$destroy', clear);
      }
 };
})

.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            $rootScope.showTabs = 'hide-footer';
        }
    };
})

.directive('showTab', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            $rootScope.showTabs = '';
        }
    };
})

.directive('hideFooter', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            $rootScope.showFooter = 'tabs-item-hide';
            $scope.$on('$destroy', function() {
                $rootScope.showFooter = '';
            });
        }
    };
})
.directive('rotate', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) 
        {
            console.log(element);
            scope.$watch(attrs.degrees, function (rotateDegrees) {
                console.log(rotateDegrees);
                var r = 'rotate(' + rotateDegrees + 'deg)';
                element.css({
                    '-moz-transform': r,
                    '-webkit-transform': r,
                    '-o-transform': r,
                    '-ms-transform': r
                });
            });
        }
    }
})

.directive('zoomable', function(ScrollRender) {
    return {
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                // Intialize layout
                var container = document.getElementById("container");
                var content = document.getElementById("content");
                var clientWidth = 0;
                var clientHeight = 0;

                // Initialize scroller
                var scroller = new Scroller(ScrollRender.render(content), {
                    scrollingX: true,
                    scrollingY: true,
                    animating: true,
                    bouncing: true,
                    locking: true,
                    zooming: true,
                    minZoom: 0.5,
                    maxZoom: 2
                });

                // Initialize scrolling rect
                var rect = container.getBoundingClientRect();
                scroller.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);
                
                var image = document.getElementById('image-scrollable');
                var contentWidth = image.width;
                var contentHeight = image.height;

                // Reflow handling
                var reflow = function() {
                    clientWidth = container.clientWidth;
                    clientHeight = container.clientHeight;
                    scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);
                };

                window.addEventListener("resize", reflow, false);
                reflow();

                if ('ontouchstart' in window) {

                    container.addEventListener("touchstart", function(e) {
                        // Don't react if initial down happens on a form element
                        if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
                            return;
                        }

                        scroller.doTouchStart(e.touches, e.timeStamp);
                        e.preventDefault();
                    }, false);

                    document.addEventListener("touchmove", function(e) {
                        scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
                    }, false);

                    document.addEventListener("touchend", function(e) {
                        scroller.doTouchEnd(e.timeStamp);
                    }, false);

                    document.addEventListener("touchcancel", function(e) {
                        scroller.doTouchEnd(e.timeStamp);
                    }, false);

                } else {

                    var mousedown = false;

                    container.addEventListener("mousedown", function(e) {
                        if (e.target.tagName.match(/input|textarea|select/i)) {
                            return;
                        }

                        scroller.doTouchStart([{
                            pageX: e.pageX,
                            pageY: e.pageY
                        }], e.timeStamp);

                        mousedown = true;
                    }, false);

                    document.addEventListener("mousemove", function(e) {
                        if (!mousedown) {
                            return;
                        }

                        scroller.doTouchMove([{
                            pageX: e.pageX,
                            pageY: e.pageY
                        }], e.timeStamp);

                        mousedown = true;
                    }, false);

                    document.addEventListener("mouseup", function(e) {
                        if (!mousedown) {
                            return;
                        }

                        scroller.doTouchEnd(e.timeStamp);

                        mousedown = false;
                    }, false);

                    container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" : "mousewheel", function(e) {
                        scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
                    }, false);
                }
            });
        }
    };
});
