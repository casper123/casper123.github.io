novitrixApp
.controller('SettingCtrl', function($scope, $ionicLoading, $state, CurrentUser){
	$scope.logout = function(){
		CurrentUser.removeUser();
		$state.go('user.login');
	}
})