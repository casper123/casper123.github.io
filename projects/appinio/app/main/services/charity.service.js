appinioService
.service('Charity', function($http,appinioConfig){
	return{
		getCharityList: function(callbackFunc) {
	   		var responsePromise = $http.get(appinioConfig.baseUrl + "user/charity");
		    responsePromise.success(function(data,status,headers,config){
          if(data.success){
            callbackFunc(data.success);
          }
		    });
	   	},
	   	getCharityDetail: function(charityId,callbackFunc){
	   		var responsePromise = $http.get(appinioConfig.baseUrl + "user/charity/"+charityId+"");
	   		responsePromise.success(function(data,status,headers,config){
          if(data.success){
            callbackFunc(data.success);
          }
	   		});
	   	}
	}
});
