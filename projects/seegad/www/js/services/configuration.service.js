precurioApp
.service('Configuration', function($rootScope){
	
	this.getBaseUrl = function(){
		return 'https://sandbox.seegad.com:3001/api';
	}

	this.startOfWeek = function() {
		return $rootScope.startOfWeek;
	}

	this.endOfWeek = function() {
		return $rootScope.endOfWeek;
	}
	
})
