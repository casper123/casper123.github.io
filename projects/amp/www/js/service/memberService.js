apb.factory('MemberService', ['$resource', 'apiUrl', '$http', '$rootScope', '$state', 'serviceProviderId',
  function ($resource, apiUrl, $http, $rootScope, serviceProviderId, $state) {
  
    var member = null;
    
    return {
      getMemberList: function (callback) {
        $http.defaults.headers.common['Authorization'] = $rootScope.basicAuth;
       
        var responsePromise = $http.get(apiUrl + 'members');
        responsePromise.success(function(data, status, headers, config) {
          if (callback) callback(data);
        });
      },

      getMember: function (memberId, callback) {
        $http.defaults.headers.common['Authorization'] = $rootScope.basicAuth;

        var responsePromise = $http.get(apiUrl + 'members/' + memberId);
        responsePromise.success(function(data, status, headers, config) {
          if (callback) callback(data);
        });
      },

      saveMember: function(requestData, requestType, successCallback, failCallback){
        $http.defaults.headers.common['Authorization'] = $rootScope.basicAuth;
        //$http.defaults.headers.common['Content-Type'] = "application/json";

        $http({
          method  : requestType,
          url     : apiUrl + 'members',
          data    : requestData,  // pass in data as strings
        })
        .success(function(data) {
          if(successCallback)
            successCallback(data);
        })
        .error(function(error) {
          console.log("in error - loginUser");
          if(failCallback)
            failCallback(error);
        });
      }
    };
  }]);