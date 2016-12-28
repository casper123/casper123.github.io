angular.module('main.directive', [])
  .directive('hideTabs', function ($rootScope) {
    return {
      restrict: 'A',
      link: function ($scope, $el) {
        $rootScope.hideTabs = 'tabs-item-hide';
        $scope.$on('$destroy', function () {
          $rootScope.hideTabs = '';
        });
      }
    };
  })
  .directive('cropImage', function ($document, $ionicHistory, $ionicGesture) {
    return {
      restrict: 'A',
      scope:{
        cropImage:"="
      },
      link: function ($scope, $element) {

        var startX, dragDistance;
        $scope.newImage = $element;

        $element.bind("load", function () {
          var image = this;
          $scope.imgSRC =  image.src;

          $scope.imgHeightClient = image.clientHeight;
          $scope.imgHeight = image.naturalHeight;
          $scope.imgWidth = image.naturalWidth;
          $scope.imgHeightNegative = -Math.abs(image.clientHeight);

          $scope.wrapHeight = 160; //this is wrapper height
          $scope.wrapWidth = 411; //this is wrapper width
          $scope.widthRatio = $scope.wrapWidth / $scope.imgWidth;
          $scope.heightRatio = $scope.imgHeightClient / $scope.imgHeight;

          $scope.imgOffset = $scope.imgHeightNegative + $scope.wrapHeight;
        });

        function createCanvas() {
          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');

          canvas.width = $scope.wrapWidth/$scope.widthRatio;
          canvas.height = $scope.wrapHeight/$scope.widthRatio;

          var imageObj = new Image();

          imageObj.onload = function() {
            // draw cropped image
            var sourceX = 0;
            var sourceY = 0;
            var sourceWidth =  $scope.imgWidth;
            var sourceHeight = $scope.imgHeight;
            var destWidth = sourceWidth;
            var destHeight = sourceHeight;
            var destX = 0;
            var destY = $scope.dragY/$scope.heightRatio;
            context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            // canvas to Base64
            $scope.cropedImage = canvas.toDataURL('image/png');
            $scope.cropImage = canvas.toDataURL('image/png');
            $scope.$apply();
          };
          imageObj.src = $scope.imgSRC;
        }
        function onDragStart(e){
          startX = e.gesture.touches[0].pageY;
        }
        function onDrag(e){
          dragDistance = e.gesture.touches[0].pageY - startX;
          //console.log(dragDistance);
          if (dragDistance >= 0) {
            dragDistance = 0;
          }
          else if (dragDistance <= $scope.imgOffset) {
            dragDistance = $scope.imgOffset;
          }
          $scope.dragY = dragDistance;
          //console.log('$scope.dragDistance:' + $scope.dragY);
          // change position
          $scope.newImage.css("-webkit-transform", "translate3d(0,"+ dragDistance + "px,0)");
        }
        function onDragEnd(){
          createCanvas();
        }
        $ionicGesture.on('dragstart', onDragStart, $element);
        $ionicGesture.on('drag', onDrag, $element);
        $ionicGesture.on('dragend', onDragEnd, $element);
      }
    }
  })
  .directive('questionGesture', function ($document, $ionicHistory, $ionicGesture, $rootScope) {

    return {
      restrict: 'A',
      link: function ($scope, $element, $attr) {

        var contents, doDrag;
        var startY, dragDistance;

/*        function onSwipe(e) {
          console.log(e.gesture.direction);
        }*/
        function onDragStart(e){
          //console.log(e.gesture.target);
          //console.log(angular.element(e.gesture.target).hasClass('question-text'));
          //console.log(angular.element(e.gesture.target)[0].hasClass('wrapper'));
          //apn-drag-block
          if(e.gesture.touches[0].pageX<200 || true){
            doDrag = true;
            contents = $document[0].body.querySelectorAll('.current-question-wrapper')[0];
            ionic.requestAnimationFrame(function () {
              angular.element(contents).addClass('is-leaving');
            });
            startY = e.gesture.touches[0].pageX;
          }else{
            doDrag = false;
          }
        }
        function onDragEnd(e){
          if(contents && doDrag){
            if(dragDistance<-75){
              $rootScope.$broadcast('show:nextQuestion', true);
            }else{
              ionic.requestAnimationFrame(function () {
                contents.style[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)';
              });
            }
          }
        }
        function onDrag(e){
          if(contents && doDrag){
            dragDistance = e.gesture.touches[0].pageX - startY;
            var changeDistance = dragDistance;
            if(changeDistance > 0){
              changeDistance = 0;
            }
            ionic.requestAnimationFrame(function () {
              contents.style[ionic.CSS.TRANSFORM] = 'translate3d('+ changeDistance +'px, 0, 0)';
            });
          }
        }

        $element.bind('touchstart', function(e) {
          e.preventDefault();
        });

/*        $ionicGesture.on('swipe', onSwipe, $element);*/
        $ionicGesture.on('dragstart', onDragStart, $element);
        $ionicGesture.on('dragend', onDragEnd, $element);
        $ionicGesture.on('drag', onDrag, $element);
      }
    }
  })
  .directive('shrinkHeader', function ($document, $ionicHistory, $ionicGesture, $ionicScrollDelegate, $rootScope) {

    return {
      restrict: 'A',
      link: function ($scope, $element, $attr) {

        var fadeAmt = y = prevDistance = startY = dragDistance = 0;

        var headerWrapper, headerAvatar, headerAvatar2, userIndicatorLeft, userIndicatorRight;
        var initHeight = 0;
        var container = $element[0];
        var contents = $document[0].body.querySelectorAll('.main-scroll-content');
        var header = $document[0].body.querySelectorAll('.main-header-bar');

        function setTransition(argument) {
          var dropdown = false;
          for (var i = contents.length - 1; i >= 0; i--) {
            //contents[i].style.WebkitTransition = 'all 0 linear';
            //contents[i].style[ionic.CSS.TRANSFORM] = 'top';
          }
          for (var i = header.length - 1; i >= 0; i--) {
            //header[i].style.WebkitTransition = 'all 0 linear';
            //header[i].style[ionic.CSS.TRANSFORM] = 'min-height';
            //header[i].style[ionic.CSS.TRANSFORM] = 'scale';

/*            if(parseInt(header[i].style.minHeight.replace('px',''))>200){
              dropdown = true;
            }*/
          }

/*          if(dropdown || true){
            $timeout(function(){
              var header1 = $document[0].body.querySelectorAll('.main-header');
              for (var i = header1.length - 1; i >= 0; i--) {
                console.log(header1[i]);
                angular.element(header1[i]).removeClass('apn-dropdown');
                angular.element(header1[i]).removeClass('apn-collapse');
              }
            }, 1);
          }*/

        }

        setTransition();

        if (header[0].style.minHeight == "260px") {
          //It means header is already in active state
          for (var i = contents.length - 1; i >= 0; i--) {
            contents[i].style[ionic.CSS.TRANSFORM] = 'translate3d(0, 216px, 0)';
            //contents[i].style.top = '260px';
          }
        }

        function zoomOut() {

          for (var i = contents.length - 1; i >= 0; i--) {
            contents[i].style[ionic.CSS.TRANSFORM] = 'translate3d(0, 0px, 0)';
            //contents[i].style.top = '44px';
          }
          for (var i = header.length - 1; i >= 0; i--) {
            header[i].style.minHeight = '44px';
          }

          ionic.requestAnimationFrame(function () {
            var headerWrapper = $document[0].body.querySelectorAll('.headerWrapper');
            var headerAvatar = $document[0].body.querySelectorAll('.header-avatar');
            for (var i = headerWrapper.length - 1; i >= 0; i--) {
              //headerWrapper[i].style.WebkitTransition = 'all 0.2s linear';
              headerWrapper[i].style[ionic.CSS.TRANSFORM] = 'translate3d(0, -44px, 0)';
              if(headerAvatar[i]){
                //headerAvatar[i].style.WebkitTransition = 'all 0.2s linear';
                headerAvatar[i].style[ionic.CSS.TRANSFORM] = 'scale(0.375)';
              }
            }
          });

          container.setAttribute('zoom', false);
          $ionicScrollDelegate.freezeAllScrolls(false);
        }

        function zoomIn() {
          for (var i = header.length - 1; i >= 0; i--) {
            header[i].style.minHeight = '260px';
          }
          for (var i = contents.length - 1; i >= 0; i--) {
            contents[i].style[ionic.CSS.TRANSFORM] = 'translate3d(0, 216px, 0)';
            //contents[i].style.top = '260px';
          }

          ionic.requestAnimationFrame(function () {
            var headerWrapper = $document[0].body.querySelectorAll('.headerWrapper');
            var headerAvatar = $document[0].body.querySelectorAll('.header-avatar');
            for (var i = headerWrapper.length - 1; i >= 0; i--) {
              //headerWrapper[i].style.WebkitTransition = 'all 0.2s linear';
              headerWrapper[i].style[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)';
              if(headerAvatar[i]){
                //headerAvatar[i].style.WebkitTransition = 'all 0.2s linear';
                headerAvatar[i].style[ionic.CSS.TRANSFORM] = 'scale(1)';
              }
            }
          });

          $rootScope.headerDropdown = true;
          container.setAttribute('zoom', true);
          $ionicScrollDelegate.freezeAllScrolls(false);
        }


        function onSwipe(e) {

          contents = $document[0].body.querySelectorAll('.main-scroll-content');
          header = $document[0].body.querySelectorAll('.main-header-bar');

          setTransition();

          var position = $ionicScrollDelegate.getScrollPosition();

          ionic.requestAnimationFrame(function () {
            for (var i = contents.length - 1; i >= 0; i--) {
              angular.element(contents[i]).addClass('animated');
            }
            for (var i = header.length - 1; i >= 0; i--) {
              angular.element(header[i]).addClass('animated');
            }
            if (e.gesture.direction == "up"){
              var header1 = $document[0].body.querySelectorAll('.main-header');
              for (var i = header1.length - 1; i >= 0; i--) {
                angular.element(header1[i]).addClass('apn-collapse');
              }
              zoomOut();
            }
            else if (e.gesture.direction == "down") {
              if (position.top <= 0) {
                var header1 = $document[0].body.querySelectorAll('.main-header');
                for (var i = header1.length - 1; i >= 0; i--) {
                  //angular.element(header1[i]).addClass('apn-dropdown');
                }
                zoomIn();
              }
            }

          });

          $rootScope.headerDropdown = false;

          dragDistance = 0;
          $ionicScrollDelegate.freezeAllScrolls(false);
        }

        function onDragStart(e) {

          contents = $document[0].body.querySelectorAll('.main-scroll-content');
          header = $document[0].body.querySelectorAll('.main-header-bar');
          headerWrapper = $document[0].body.querySelectorAll('.headerWrapper');
          headerAvatar = $document[0].body.querySelectorAll('.header-avatar');
          headerAvatar2 = $document[0].body.querySelectorAll('.header-avatar2');
          userIndicatorLeft = $document[0].body.querySelectorAll('.indicator-left');
          userIndicatorRight = $document[0].body.querySelectorAll('.indicator-right');
          initHeight = 0;

          var header1 = $document[0].body.querySelectorAll('.main-header');
          for (var i = header1.length - 1; i >= 0; i--) {
            angular.element(header1[i]).removeClass('apn-dropdown');
            angular.element(header1[i]).removeClass('apn-collapse');
          }
          for (var i = header.length - 1; i >= 0; i--) {
            if(header[i].offsetHeight>0){
              initHeight = header[i].offsetHeight;
            }
          }
          for (var i = contents.length - 1; i >= 0; i--) {
            angular.element(contents[i]).removeClass('animated');
          }
          for (var i = header.length - 1; i >= 0; i--) {
            angular.element(header[i]).removeClass('animated');
          }
          setTransition();
          startY = e.gesture.touches[0].pageY;
          dragDistance = 0;
          //console.log($ionicScrollDelegate.getScrollPosition());

          started = false;
          dragCorrection = 0;
        }

        var dragCorrection = 0;
        var started = false;
        function onDrag(e) {

          // $rootScope.headerDropdown = null;
          position = $ionicScrollDelegate.getScrollPosition();
          dragDistance = e.gesture.touches[0].pageY - startY;

          if(header[0].offsetHeight>0){
            height = header[0].offsetHeight;
          }else{
            height = initHeight;
          }
          var startHeight = height;
          if (e.gesture.direction == "down" && position.top <= 0){
            var correctedDistance = dragDistance-dragCorrection;
            if(correctedDistance < 0){
              correctedDistance = 0;
            }
            height = height + Math.abs(correctedDistance);
          }else if (e.gesture.direction == "up"){
            height = height - Math.abs(dragDistance);
            if(position.top <= 0){
              $ionicScrollDelegate.freezeAllScrolls(false);
            }
          }
          if(position.top>15 && e.gesture.direction == "down"){
            return;
            if(!started){
              dragCorrection = dragDistance;
              started = true;
              return;
            }
          }
          height = initHeight+dragDistance;
          //console.log(dragDistance, height);
          if(startHeight != height){
            if(height <= 44){
              height = 44;
            }
            if(height >= 260){
              height = 260;
            }
            if(e.gesture.direction == "up" && position.top <= 0 && height == 44){
              $ionicScrollDelegate.freezeAllScrolls(false);
            }
            if(startHeight != height){
              $ionicScrollDelegate.freezeAllScrolls(true);
            }else{
              $ionicScrollDelegate.freezeAllScrolls(false);
            }
            ionic.requestAnimationFrame(function () {
              for (var i = header.length - 1; i >= 0; i--) {
                header[i].style.minHeight = height + 'px';
              }
              for (var i = contents.length - 1; i >= 0; i--) {
                contents[i].style[ionic.CSS.TRANSFORM] = 'translate3d(0, '+ (height-44) +'px, 0)';
                //contents[i].style.top = (height) + 'px';
              }
              var factor = (height-44)/216;
              for (var i = headerWrapper.length - 1; i >= 0; i--) {
                headerWrapper[i].style[ionic.CSS.TRANSFORM] = 'translate3d(0, '+ (-1 * (44 - (factor*44))) +'px, 0)';
                if(headerAvatar[i]){
                  headerAvatar[i].style[ionic.CSS.TRANSFORM] = 'scale('+(0.375+factor*0.625)+')';
                }
                if(headerAvatar2[i]){
                  headerAvatar2[i].style[ionic.CSS.TRANSFORM] = 'scale('+(0.65+factor*0.35)+')';
                }
                if(userIndicatorRight[i]){
                  //translate3d(-10px,-30px,0);
                  userIndicatorRight[i].style[ionic.CSS.TRANSFORM] = 'translate3d(-'+((1-factor)*20)+'px,-'+((1-factor)*30)+'px,0)';
                  //userIndicatorRight[i].style[ionic.CSS.TRANSFORM] = 'scale('+(0.65+factor*0.35)+')';
                }
                if(userIndicatorLeft[i]){
                  userIndicatorLeft[i].style[ionic.CSS.TRANSFORM] = 'translate3d('+((1-factor)*20)+'px,-'+((1-factor)*30)+'px,0)';
                }
              }

            });
          }

        }

        $ionicGesture.on('dragstart', onDragStart, $element);
        $ionicGesture.on('dragend', onSwipe, $element);
        $ionicGesture.on('swipe', onSwipe, $element);
        $ionicGesture.on('drag', onDrag, $element);
      }
    }
  });
angular.module('main.directive')
  .filter('niceDate', function($rootScope, $filter){
    return function(input){
      var returnValue = 'unbekannt';
      if(input){
        var diff = ($rootScope.currentTime - new Date(input).getTime())/1000;
        if(diff<900){
          returnValue = 'Gerade eben';
        }else if(diff<3600){
          returnValue = 'vor ' +Math.floor(diff/60)+ ' Min';
        }else if(diff<86400){
          returnValue = 'vor ' +Math.floor(diff/3600)+ ' Std';
        }else{
          var now = new Date($rootScope.currentTime);
          now.setDate(now.getDate()-1);
          var then = new Date(input);
          if(now.getDate() == then.getDate()){
            returnValue = 'Gestern';
          }else{
            returnValue = $filter('date')(input, 'dd.MM.yyyy');
          }
        }

      }
      return returnValue;
    };
});
