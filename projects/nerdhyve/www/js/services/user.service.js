novitrixApp
.factory('User', function($http, Configuration, CurrentUser){
	var baseUrl = Configuration.getBaseUrl();
	return {
		// User Login Service
		login : function(postData, callbackFunc){
			$http({
	          method  : 'POST',
	          url     : baseUrl + '/userLogin',
	          data    : postData,  // pass in data as strings
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
	        })
	        .success(function(data) {
	          callbackFunc(data);
	        })
	        .error(function() {
	          "in error";
	        });
		},
		// User Signup service
		userSignup : function(postData,callbackFunc) {
            $http({
              method  : 'POST',
              url     : baseUrl + '/userSignup',
              data    : postData,  // pass in data as strings
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
            })
            .success(function(data) {
              callbackFunc(data);
            })
            .error(function() {
              "in error";
            });
        },
        // User view Profile
        userViewProfile : function(usersId,callbackFunc){
      		var responsePromise = $http.get(baseUrl + "/userView&id="+usersId+"");
		    responsePromise.success(function(data,status,headers,config){
		      callbackFunc(data);
		    });
      	},
      	// Edit User Profile
      	editProfile : function(postData,callbackFunc){
	        $http({
	          method  : 'POST',
	          url     : baseUrl + '/userEdit',
	          data    : postData,  // pass in data as strings
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
	        })
	        .success(function(data) {
	          callbackFunc(data);
	        })
	        .error(function() {
	          "in error";
	        });
      	},
      	userViewAdd : function(usersId,callbackFunc){
      		var responsePromise = $http.get(baseUrl + "/UserItemList&id="+usersId+"");
		    responsePromise.success(function(data,status,headers,config){
		    	console.log(data);
		     	callbackFunc(data);
		    });
      	},
      	userTransaction : function(usersId,callbackFunc){
      		var responsePromise = $http.get(baseUrl + "/Transection&id="+usersId+"");
		    responsePromise.success(function(data,status,headers,config){
		      callbackFunc(data);
		    });
      	},
      	userTransactionDetail : function(cartId,callbackFunc){
      		var responsePromise = $http.get(baseUrl + "/TransectionDetails&id="+cartId+"");
		    responsePromise.success(function(data,status,headers,config){
		      callbackFunc(data);
		    });
      	},

      	forgotPassword : function(postData,callbackFunc){
	        $http({
	          method  : 'POST',
	          url     : baseUrl + '/ForgetPassword',
	          data    : postData,  // pass in data as strings
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
	        })
	        .success(function(data) {
	          callbackFunc(data);
	        })
	        .error(function() {
	          "in error";
	        });
      	}
	}
});