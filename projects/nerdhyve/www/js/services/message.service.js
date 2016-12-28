novitrixApp
.factory('Message', function($http, Configuration){
	var baseUrl = Configuration.getBaseUrl();
	return {
		sendMessage: function(postData, id, callbackFunc){
      		$http({
	          method  : 'POST',
	          url     : baseUrl + '/Conversation&id=' + id,
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
      	newMessage: function(postData, callbackFunc){
      		$http({
	          method  : 'POST',
	          url     : baseUrl + '/PostMessage',
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
      	listMessage: function(id, callbackFunc){
      		var responsePromise = $http.get(baseUrl + "/GetAllMessages&to="+id+"&from="+id);
		    responsePromise.success(function(data,status,headers,config){
		     	callbackFunc(data);
		    });
      	},
      	viewMessage: function(id, callbackFunc) {
      		var responsePromise = $http.get(baseUrl + "/GetMessage&id="+id);
      		responsePromise.success(function(data,status,headers,config){
      			callbackFunc(data);
      		});
      	}


    }
});