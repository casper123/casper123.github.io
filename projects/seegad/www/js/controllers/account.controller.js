precurioApp

.controller('AccountCtrl', function($scope, $state, CurrentUser, Account) {
	$scope.user = {};

	$scope.logout = function(){
    CurrentUser.removeUser();
		$state.go('user.login')
	}

	Account.getUser(function (response){
  		$scope.user = response;
  	});
	$scope.update = false;
  	$scope.updateAccount = function(user){
  		var userData = {}
  		userData.firstName = user.firstName;
  		userData.lastName = user.lastName;
  		userData.email = user.email;
  		userData.mobilePhone = user.mobilePhone;
  		userData.jobTitle = user.jobTitle;
  		Account.update($scope.UTIL.serialize(userData), function (response){
	    	$scope.update = true;
	    	$scope.users = CurrentUser.getUser(response.id);
	    });
  	}

})
