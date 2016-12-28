apb.factory('AuthenticationService', function($rootScope, $state) {
    return {
      authorize: function(event) 
      {
        console.log($rootScope.toState.authRequired);
        if ($rootScope.toState.authRequired && $rootScope.authenticated != 'true' && $rootScope.toState.name != 'login') {
          $rootScope.returnToState = $rootScope.toState;
          $rootScope.returnToStateParams = $rootScope.toStateParams;
          console.log('Redirecting to login page from ' + $rootScope.returnToState.name);
          $state.transitionTo('user');
          event.preventDefault();
        }
      }
    };
  });
