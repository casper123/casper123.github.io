angular.module('workoutfactory.directive', [])

.directive('onLastRepeat', function() {
	return function(scope, element, attrs) {
		//console.log("directive shahper");
		if (scope.$last) {
			setTimeout(function(){$(".flipster").flipster({ style: 'carousel', start: 0 });}, 1);
			var hammertime = new Hammer(document.getElementById('flipster_div'));
		}
	};
})

.directive('onChangeFormat', function() {
	return function(scope, element, attrs) {
		//console.log("directive shahper");
	};
})

.directive('onLastItem', function() {
	return function(scope, element, attrs) {
		//console.log("directive shahper");
		if (scope.$last) {
			var container = document.querySelector('#container');
			var msnry = new Masonry( container, {
			  itemSelector: '.list-block-container'
			});

			imagesLoaded( document.querySelector('#container'), function() {
			  msnry.layout();
			});
		}
	};
})