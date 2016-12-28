precurioApp
.controller('UserCtrl', function($scope, $state, $ionicLoading, $ionicPopup, $cordovaNetwork, User, CurrentUser) {
	
	$scope.selectables = [1,2,3,4,5];

	function checkConnection(){
	   	var networkState = navigator.connection.type;

	   	var states = {};
	   	states[Connection.UNKNOWN]  = 'Unknown connection';
	   	states[Connection.ETHERNET] = 'Ethernet connection';
	   	states[Connection.WIFI]     = 'WiFi connection';
	   	states[Connection.CELL_2G]  = 'Cell 2G connection';
	   	states[Connection.CELL_3G]  = 'Cell 3G connection';
	   	states[Connection.CELL_4G]  = 'Cell 4G connection';
	   	states[Connection.CELL]     = 'Cell generic connection';
	   	states[Connection.NONE]     = 'No network connection';

	   	if(states[networkState].indexOf("WiFi") != -1 || states[networkState].indexOf("Cell") != -1)
	        return true;
	   	else 
	   		return false;
	}
  	
  	$scope.login = function(user){
  		$scope.err = false;
  		$scope.internet = false;
  		$ionicLoading.show();
  		if(true){
		    User.login($scope.UTIL.serialize(user), function (response){
		    	window.localStorage.setItem('userId', response.id);
		    	CurrentUser.setUser(response);
		    	$ionicLoading.hide();
		     	$state.go('tab.task');
		    }, function (response) {
		    	$ionicLoading.hide();
		    	$scope.err = true;
		    	}
		    );
		}
		else {
			$ionicLoading.hide();
			$scope.internet = true
		}
  	}	

  	$scope.forgot = function(user){
  		$scope.internet = false;
  		$scope.req = false;
  		$scope.req1 = false;
  		$ionicLoading.show();
  		if(navigator.network.connection.type != Connection.NONE){
	  		User.forgot($scope.UTIL.serialize(user), function (response){
	  			$ionicLoading.hide();
	  			$scope.req = true;
	  			console.log(response)
		    }, function (response) {
		    		$ionicLoading.hide();
			    	$scope.msg = response.error.message;
			    	$scope.req1 = true;
		    	}
		    );
  		}
  		else {
  			$ionicLoading.hide();
			$scope.internet = true;
  		}
  	}

  	$scope.create = function(user){
  		$ionicLoading.show();
  		User.create($scope.UTIL.serialize(user), function (response){
  			$ionicLoading.hide();
	    	CurrentUser.setUser(response);
	    }, function (response) {
	    		$ionicLoading.hide();
			    var alertPopup = $ionicPopup.alert({
			    	template: response
			    });  	
	    	}
	    );
  	}
})
