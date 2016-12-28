precurioApp
.factory('Task', function($q, $http, $filter, $state, Configuration, CurrentUser){
	var baseUrl = Configuration.getBaseUrl();
	var user = null;
	
	CurrentUser.getUser(function (response){
		user = response;
	})

	return{
		getProjects : function(callBackFunc) {
			var responsePromise = $http.get(baseUrl + "/users/"+user.userId+"/projects", {
			    headers: {'Authorization': user.id}
			});
		    responsePromise.success(function(data,status,headers,config){
		      callBackFunc(data);
		    });
		},
		create : function(postData, callBackFunc){
			$http({
				method: 'PUT',
				url: baseUrl + "/tasks",
				data: postData,
				headers: {
				 "content-type":"application/json", 
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
		edit : function(id, postData, callBackFunc){
			$http({
				method: 'PUT',
				url: baseUrl + "/tasks/"+ id,
				data: postData,
				headers: {
				 "content-type":"application/json", 
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
		complete : function(postData, callBackFunc){
			$http({
				method: 'PUT',
				url: baseUrl + "/tasks/"+ postData +"/complete",
				headers: {
				 "content-type":"application/json", 
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
		comment : function(postData, callBackFunc){
			$http({
				method: 'PUT',
				url: baseUrl + "/tasks/{id}/discussions",
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

			var firstDate = $filter('date')(moment().day(1).toDate(), 'yyyy-MM-dd');

			$http({
				method: 'GET',
				url: baseUrl + "/users/"+ user.userId +"/tasks?filter[where][status]=ACTIVE&[where][dateDue][gt]=" + firstDate + ' 00:00:00',
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
		logForToday : function(taskId, postData, callBackFunc, errorCallBack){
			$http({
				method: 'PUT',
				url: baseUrl + "/tasks/"+ taskId +"/log",
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
		},
		removeComment : function(postData, callBackFunc, errorCallBack){
			$http({
				method: 'POST',
				url: baseUrl + "/tasks/discussions/delete",
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
				errorCallBack(data);
			})
		},
		postComment : function(taskId, postData, callBackFunc, errorCallBack){
			$http({
				method: 'PUT',
				url: baseUrl + "/tasks/"+ taskId +"/discussions",
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
			.error(function (data){
				errorCallBack(data);
			})
		},
		getComment : function(id, callBackFunc, errorCallBack){
			$http({
				method: 'GET',
				url: baseUrl + "/tasks/" + id + "/discussions",
				headers: {
				 "content-type":"application/x-www-form-urlencoded", 
				 "accept" : "application/json",
				 "Authorization" : window.localStorage.getItem('userId')
				}
			})
			.success(function (data){
				callBackFunc(data)
			})
			.error(function (data){
				errorCallBack(data);
			})
		},
		userDetails : function(userId, callBackFunc, errorCallBack){
			$http({
				method: 'GET',
				url: baseUrl + "/users/" + userId,
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
		
		getAllProjects : function(callBackFunc){
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
			.error(function (data){
				console.log(data);
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
			.error(function (data){
				errorCallBack(data);
			})
		},
		taskDetail : function(id, callBackFunc, errorCallBack){
			$http({
				method: 'GET',
				url: baseUrl + "/tasks/"+ id,
				headers: {
				 "content-type":"application/x-www-form-urlencoded", 
				 "accept" : "application/json",
				 "Authorization" : window.localStorage.getItem('userId')
				}
			})
			.success(function (data){
				callBackFunc(data)
			})
			.error(function (data){
				errorCallBack(data);
			})
		},
		loadAssignTask : function(taskId, callBackFunc, errorCallBack){
			$http({
				method: 'GET',
				url: baseUrl + "/tasks/"+ taskId +"/users",
				headers: {
				 "content-type":"application/x-www-form-urlencoded", 
				 "accept" : "application/json",
				 "Authorization" : window.localStorage.getItem('userId')
				}
			})
			.success(function (data){
				callBackFunc(data)
			})
			.error(function (data){
				errorCallBack(data);
			})
		},
		assignTaskTo : function(taskId, postData, callBackFunc, errorCallBack){
			$http({
				method: 'PUT',
				url: baseUrl + "/tasks/"+ taskId +"/users",
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
			.error(function (data){
				errorCallBack(data);
			})
		},
		getHoursLogged: function(userId, startDate, endDate, callBackFunc, errorCallBack){
			
			if(user == null)
			{
				var deferred = $q.defer();
				CurrentUser.getUser(function (response){
					user = response;

					var request = $http({
						method: 'GET',
						url: baseUrl + "/users/"+ userId +"/timesheets?filter[where][startTime][gt]="+ startDate +"&filter[where][endTime][lt]=" + endDate,
						headers: {
						 "content-type":"application/x-www-form-urlencoded", 
						 "accept" : "application/json",
						 "Authorization" : window.localStorage.getItem('userId')
						}
					})
					.success(function (data){
						return data
					})
					.error(function (data){
						return data;
					})

					deferred.resolve(request);
				})
			}
			else
			{
				return $http({
					method: 'GET',
					url: baseUrl + "/users/"+ userId +"/timesheets?filter[where][startTime][gt]="+ startDate +"&filter[where][endTime][lt]=" + endDate,
					headers: {
					 "content-type":"application/x-www-form-urlencoded", 
					 "accept" : "application/json",
					 "Authorization" : window.localStorage.getItem('userId')
					}
				})
				.success(function (data){
					return data;
				})
				.error(function (data){
					return  data;
				})
			}

			return deferred.promise;
		},
		getTaskHistory: function(taskId, callBackFunc, errorCallBack){
			$http({
				method: 'GET',
				url: baseUrl + "/tasks/"+ taskId +"/timesheets",
				headers: {
				 "content-type":"application/x-www-form-urlencoded", 
				 "accept" : "application/json",
				 "Authorization" : window.localStorage.getItem('userId')
				}
			})
			.success(function (data){
				callBackFunc(data)
			})
			.error(function (data){
				console.log(data);
			})
		},
		getTaskHours: function(taskId, startTime, endTime){
			var deferred = $q.defer();

			$http({
				method: 'GET',
				url: baseUrl + "/tasks/"+ taskId +"/timesheets?filter[where][userId]=" + user.userId + "&filter[where][startTime][gt]="+ startTime +"&filter[where][endTime][lt]=" + endTime,
				headers: {
				 "content-type":"application/x-www-form-urlencoded", 
				 "accept" : "application/json",
				 "Authorization" : window.localStorage.getItem('userId')
				}
			})
			.success(function (data){
				deferred.resolve(data)
			})
			.error(function (data){
				deferred.resolve(data);
			})

			return deferred.promise;
		}
	}
})