novitrixApp
.factory('Add', function($http, Configuration, CurrentUser){
	var baseUrl = Configuration.getBaseUrl();
	return{
		// Post Add
      	postAdd : function(postData,callbackFunc){
	        $http({
	          method  : 'POST',
	          url     : baseUrl + '/Itemadd',
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
      	editAdd : function(postData,item_id,callbackFunc){
	        $http({
	          method  : 'POST',
	          url     : baseUrl + '/ItemEdit&id='+item_id+"",
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
      	deleteAdd : function(postData,callbackFunc){
	        $http({
	          method  : 'POST',
	          url     : baseUrl + '/DeleteMyAd&id='+postData+"",
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