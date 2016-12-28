precurioApp
.factory('Team', function($http, Configuration, CurrentUser){
	var baseUrl = Configuration.getBaseUrl();
	CurrentUser.getUser(function (response){
		user = response;
	})
	return{
		getMembers : function(accountId, callBackFunc) {

			CurrentUser.getUser(function (response){
				user = response;

				var responsePromise = $http.get(baseUrl + "/accounts/"+ accountId +"/employees ", {
				    headers: {'Authorization': window.localStorage.getItem('userId')}
				});
			    responsePromise.success(function(data,status,headers,config){
			      callBackFunc(data);
			    });
			})
			
		},
		getAllTask : function(userId, callBackFunc) {
			var responsePromise = $http.get(baseUrl + "/users/"+ userId +"/tasks?filter[where][status]=ACTIVE", {
			    headers: {'Authorization': window.localStorage.getItem('userId')}
			});
		    responsePromise.success(function(data,status,headers,config){
		      callBackFunc(data);
		    });
		}
	}
})