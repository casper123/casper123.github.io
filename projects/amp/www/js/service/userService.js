apb.factory('UserService', ['$resource', 'apiUrl', '$http', '$rootScope', '$state', 'serviceProviderId',
  function ($resource, apiUrl, $http, $rootScope, serviceProviderId, $state) {
    
    var member = null;
    return {
      loginUser: function (username, password, successCallback, failCallback) {
        
        var url = apiUrl + 'users/login';

        var credentials = {
          username: username,
          encodedPassword: Base64.encode(password)
        };

        console.log(credentials);

        member = null;

        console.log($rootScope.basicAuth);
        if($rootScope.basicAuth == 'Basic ') 
        {
          $http.defaults.headers.common['Authorization'] = $rootScope.basicAuth;
          $http({
            method  : 'POST',
            url     : url,
            data    : credentials,
          })
          .success(function(response) {
            member = response;
            $rootScope.serviceProviderId = member.serviceProviderId;
            console.log(serviceProviderId);

            $rootScope.authenticated = 'true';
            $rootScope.basicAuth = 'Basic ' + Base64.encode(username + ':' + password);
            if(successCallback) successCallback(member);
          })
          .error(function(response) {
            if(failCallback)
              failCallback();
          });
        }
      },

      logoutUser: function () 
      {
        member = null;
        $rootScope.authenticated = false;
        $rootScope.basicAuth = 'Basic ';
        $rootScope.serviceProviderId = null;
        window.localStorage.removeItem('username');
        window.localStorage.removeItem('password');
        window.localStorage.removeItem('save');
      },

      get: function (callback) {
        $http.defaults.headers.common['Authorization'] = $rootScope.basicAuth;
        var url = apiUrl + 'users/secure/me';
        $resource(url, {}, {get: {method: 'GET'}}).get().$promise.then(function (data) {
          member = data;
          if (callback) callback(data);
        });
      },

      identity: function () {
        return member;
      }
    };
  }]);