precurioApp
.factory('User', function($http, Configuration, CurrentUser){
	var baseUrl = Configuration.getBaseUrl();
	var currentUser = null;
	var user = null;

	CurrentUser.getUser(function(data){
		user = data;
	})

	return{
		create : function(postData, callBackFunc){
			$http({
				method: 'POST',
				url: baseUrl + "/users/invite",
				data: postData
			})
			.success(function (data){
				callBackFunc(data)
				console.log(data);
			})
			.error(function(){
				console.log("error");
				return "in error"
			})
		},

		login : function(postData, callBackFunc, errorCallBack){
			$http({
			 	method: 'POST',
			  	url: baseUrl + "/users/login" ,
			  	data: postData
			})
			.success(function (data) {
			  callBackFunc(data);
			})
			.error(function(data){
				errorCallBack(data);
			});
		},

		remove : function(postData, callBackFunc){
			$http({
				method: 'PUT',
				url: baseUrl + "/",
				data: postData
			})
			.success(function (data){
				callBackFunc(data)
			})
			.error(function (){
				return "in error"
			});
		},

		forgot : function(postData, callBackFunc, errorCallBack){
			$http({
			 	method: 'POST',
			  	url: baseUrl + "/users/reset" ,
			  	data: postData
			})
			.success(function (data) {
			  callBackFunc(data);
			})
			.error(function(data){
				errorCallBack(data);
			});

		}, 

		getUser : function(callBackFunc, userId){
			
			CurrentUser.getUser(function(data){
				user = data;
				var id;
				if(userId == undefined)
					id = user.userId;
				else
					id = userId;

				$http({
					method: 'GET',
					url: baseUrl + "/users/" + id,
					headers: {
					 "content-type":"application/x-www-form-urlencoded", 
					 "accept" : "application/json",
					 "Authorization" :  window.localStorage.getItem('userId')
					}
					
				})
				.success(function (data){
					callBackFunc(data);
				})
				.error(function(){
					console.log("error");
					return "in error"
				})
			})			
		},
		getUserTimesheet : function(callBackFunc){
			$http({
				method: 'GET',
				url: baseUrl + "/users/"+ user.userId +"/timesheets",
				headers: {
				 "content-type":"application/x-www-form-urlencoded", 
				 "accept" : "application/json",
				 "Authorization" :  window.localStorage.getItem('userId')
				}
				
			})
			.success(function (data){
				callBackFunc(data);
			})
			.error(function(){
				console.log("error");
				return "in error"
			})
		}
	}
})