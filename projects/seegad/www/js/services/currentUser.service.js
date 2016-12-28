precurioApp
.factory('CurrentUser', function(Configuration){
	var baseUrl = Configuration.getBaseUrl();
	return{
		setUser : function(user, callbackFunc){
			window.localStorage.setItem('user', JSON.stringify(user));
			
			if(callbackFunc == undefined || callbackFunc == null)
				return;

			callbackFunc(user);
		},
		getUser : function(callbackFunc){
			var user = JSON.parse(window.localStorage.getItem('user'));

			if(callbackFunc == undefined || callbackFunc == null)
				return;
			
			callbackFunc(user);
		},
		removeUser : function(){
			window.localStorage.removeItem('user');
		}		
	}
});