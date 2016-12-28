appinioService
.service('Ranking', function($http, appinioConfig){
	return{
		getRanking: function(type, callbackFunc) {
	   		var responsePromise = $http.get(appinioConfig.baseUrl + "user/ranking/" + type);
		    responsePromise.success(function(data,status,headers,config){
		    	callbackFunc(data);
		    });
	   	}
	}
});
