precurioApp
.factory('Expense', function($http, $rootScope, CurrentUser, Configuration){
	
	var baseUrl = Configuration.getBaseUrl();
	var user = null;
	
	CurrentUser.getUser(function (response){
		user = response;
	})
	
	return{
		getCategory : function(callBackFunc) {
			var responsePromise = $http.get(baseUrl + "/Expenses/categorys", {
			    headers: {'Authorization': window.localStorage.getItem('userId')}
			});
		    responsePromise.success(function(data,status,headers,config){
		      callBackFunc(data);
		    });
		},
		getMilestone : function(callBackFunc) {
			var responsePromise = $http.get(baseUrl + "/milestones", {
			    headers: {'Authorization': window.localStorage.getItem('userId')}
			});
		    responsePromise.success(function(data,status,headers,config){
		      callBackFunc(data);
		    });
		},
		create : function(postData, callBackFunc){
			$http({
				method: 'PUT',
				url: baseUrl + "/expenses",
				data: postData,
				headers: {
			    	"content-type":"application/x-www-form-urlencoded", 
			    	"accept" : "application/json",
			    	"Authorization" : window.localStorage.getItem('userId')
			    }
			})
			.success(function (data){
				callBackFunc(data)
			})
			.error(function(){
				return "in error"
			})
		},

		update : function(postData, callBackFunc){
			$http({
				method: 'PUT',
				url: baseUrl + "/",
				data: postData
			})
			.success(function (data){
				callBackFunc(data)
			})
			.error(function(){
				return "in error"
			})
		},

		getAll : function(callBackFunc, errorCallBack){
			$http({
				method: 'GET',
				url: baseUrl + "/expenses",
				headers: {
				 "content-type":"application/x-www-form-urlencoded", 
				 "accept" : "application/json",
				 "Authorization" : window.localStorage.getItem('userId')
				}
			})
			.success(function (data){
				callBackFunc(data)
			})
			.error(function(data){
				errorCallBack(data);
			})
		},

		getSpecific : function(id, callBackFunc, errorCallBack){
			$http({
				method: 'GET',
				url: baseUrl + "/expenses/"+id,
				headers: {
				 "content-type":"application/x-www-form-urlencoded", 
				 "accept" : "application/json",
				 "Authorization" : window.localStorage.getItem('userId')
				}
			})
			.success(function (data){
				callBackFunc(data)
			})
			.error(function(data){
				errorCallBack(data);
			})
		},
		getUserExpense : function(startWeek, endWeek, callBackFunc, errorCallBack){
			console.log(startWeek);

			CurrentUser.getUser(function (response){
				user = response;

				$http({
					method: 'GET',
					url: baseUrl + "/users/"+ user.userId +"/expenses?filter[where][expenseDate][gt]="+ startWeek + "&filter[expenseDate][lt]=" + endWeek,
					headers: {
					 "content-type":"application/x-www-form-urlencoded", 
					 "accept" : "application/json",
					 "Authorization" : window.localStorage.getItem('userId')
					}
				})
				.success(function (data){
					callBackFunc(data)
				})
				.error(function(data){
					console.log(data);
				})
			})
		},

		detail : function(postData, callBackFunc){
			$http({
				method: 'PUT',
				url: baseUrl + "/",
				data: postData
			})
			.success(function (data){
				callBackFunc(data)
			})
			.error(function(){
				return "in error"
			})
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

		getAllProjects : function(callBackFunc, errorCallBack){
			$http({
				method: 'GET',
				url: baseUrl + "/projects",
				headers: {
				 "content-type":"application/x-www-form-urlencoded", 
				 "accept" : "application/json",
				 "Authorization" : window.localStorage.getItem('userId')
				}
			})
			.success(function (data){
				callBackFunc(data)
			})
			.error(function(){
				errorCallBack(data);
			})
		},

		getAllCategories : function(callBackFunc, errorCallBack){
			$http({
				method: 'GET',
				url: baseUrl + "/categorys",
				headers: {
				 "content-type":"application/x-www-form-urlencoded", 
				 "accept" : "application/json",
				 "Authorization" : window.localStorage.getItem('userId')
				}
			})
			.success(function (data){
				callBackFunc(data)
			})
			.error(function(){
				errorCallBack(data);
			})
		},
	}
})