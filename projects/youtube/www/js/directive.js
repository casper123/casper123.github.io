angular.module('starter.directive', [])

.directive("youtubeDirective", function($compile){
	return function(scope, element, attrs){
	};
})


.directive('myYoutube', function($sce) {
  return {
    restrict: 'EA',
    scope: { code:'=' },
    replace: true,
    template: '<div class="video-container"><iframe src="{{url}}" frameborder="0" width="560" height="315" style="pointer-events: none;"></iframe></div>',
    link: function (scope) {
        scope.$watch('code', function (newVal) {
        	console.log(newVal);
           if (newVal) {
               scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
           }
        });
    }
  };
});


