novitrixApp
.controller('SearchCtrl', function($scope,$ionicLoading,$state){
	$scope.login = function(user) {
    	$state.go('tab.home');
  	}
})