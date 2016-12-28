apb.controller('HomeCtrl', function($scope, $rootScope, UserService, serviceProviderId) {
	console.log(serviceProviderId);
  $scope.serviceProviderId = $rootScope.serviceProviderId;
})