precurioApp
.factory('Account', function($http, Configuration, CurrentUser){
	var baseUrl = Configuration.getBaseUrl();
	
	return{
		
		update : function(postData, callBackFunc, errorCallBack){

			CurrentUser.getUser(function(data){
				currentUser = data;
				$http({
					method: 'PUT',
					url: baseUrl + "/users/" + currentUser.userId,
					data: postData,
					headers: {
					 "content-type":"application/x-www-form-urlencoded", 
					 "accept" : "application/json",
					 "Authorization" : currentUser.id
					}
				})
				.success(function (data){
					callBackFunc(data);
				})
				.error(function (data){
					errorCallBack(data);
				})
			});
		},

		getUser : function(callBackFunc, errorCallBack){

			CurrentUser.getUser(function(data){
				currentUser = data;
				$http({
					method: 'GET',
					url: baseUrl + "/users/" + currentUser.userId
				})
				.success(function (data){
					callBackFunc(data);
				})
				.error(function(){
					errorCallBack(data);
				})
			});
		}
	}
})