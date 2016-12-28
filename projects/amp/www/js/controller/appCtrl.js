apb.controller('AppCtrl', function($scope, $rootScope, $state, UserService) {
  
	$scope.logout = function() {
		UserService.logoutUser();
		$state.go('user');
	}

});