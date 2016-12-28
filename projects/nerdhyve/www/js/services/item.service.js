novitrixApp
.factory('Item', function($http, Configuration){
	var baseUrl = Configuration.getBaseUrl();
	return{
		categorylist : function(callbackFunc){
      		var responsePromise = $http.get(baseUrl + "/categoryList");
		    responsePromise.success(function(data,status,headers,config){
		      callbackFunc(data);
		    });
      	}
	}
});