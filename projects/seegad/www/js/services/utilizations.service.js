precurioApp
.factory('Utilizations', function($http, Configuration, $state, CurrentUser){
	var baseUrl = Configuration.getBaseUrl();
	var currentUser = null;
	
	CurrentUser.getUser(function(data){
		currentUser = data;
	})

	return{
		getAllUsers : function(callBackFunc, errorCallBack){
			$http({
				method: 'GET',
				url: baseUrl + "/users/"+ currentUser.userId +"/utilizations",
				headers: {
				 "content-type":"application/x-www-form-urlencoded", 
				 "accept" : "application/json",
				 "Authorization" :  window.localStorage.getItem('userId')
				}
			})
			.success(function (data){
				callBackFunc(data)
			})
			.error(function(){
				errorCallBack(data);
			})
		},
		getAllAccuonts : function(callBackFunc, errorCallBack){
			$http({
				method: 'GET',
				url: baseUrl + "/accounts/{accountId}/utilizations",
				headers: {
				 "content-type":"application/x-www-form-urlencoded", 
				 "accept" : "application/json",
				 "Authorization" :  window.localStorage.getItem('userId')
				}
			})
			.success(function (data){
				callBackFunc(data)
			})
			.error(function(){
				errorCallBack(data);
			})
		}
	}
})