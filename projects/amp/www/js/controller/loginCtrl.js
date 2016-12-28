apb.controller('LoginCtrl', function($scope, $state, $rootScope, UserService, ToastService) {
  
  	$scope.userCredentials = {};
  	$scope.error = {};
  	$scope.error.messageKey = null;

	$scope.doLogin = function(user) {

		console.log(user);
		console.log($scope.userCredentials);
		console.log(user.$valid);

		$scope.error.messageKey = null;
		if (user !== undefined && !user.$valid) return;
		UserService.loginUser($scope.userCredentials.username, $scope.userCredentials.password, $scope.loginSucess, $scope.loginFail);

	};

	$scope.loginSucess = function(loggedInUser){

		console.log("insdie Seuccs");
		console.log($rootScope.authenticated);
		if($rootScope.authenticated == 'true') 
		{
			console.log("insdie auth");
	        if($scope.userCredentials.save) 
	        {
	          window.localStorage['username'] = $scope.userCredentials.username;
	          window.localStorage['password'] = $scope.userCredentials.password;
	        } 
	        else
	        {
	          window.localStorage.removeItem('username');
	          window.localStorage.removeItem('password');
	        }

	        window.localStorage['save_credentials'] = $scope.userCredentials.save;
	        $state.go('app.home');
	    }
	};

	$scope.loginFail = function() {
		$scope.error.messageKey = 'error_login_failed';
	};
})