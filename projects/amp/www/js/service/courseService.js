apb.factory('CourseService', ['$resource', 'apiUrl', '$http', '$rootScope', '$state', 'serviceProviderId',
  function ($resource, apiUrl, $http, $rootScope, serviceProviderId, $state) {
  
    var member = null;
    
    return {
      getAll: function (callback) {
        $http.defaults.headers.common['Authorization'] = $rootScope.basicAuth;
       
        var responsePromise = $http.get(apiUrl + 'courses/secure/all');
        responsePromise.success(function(data, status, headers, config) {
          if (callback) callback(data);
        });
      },

      getCourse: function(courseId, callback){
        $http.defaults.headers.common['Authorization'] = $rootScope.basicAuth;
       
        var responsePromise = $http.get(apiUrl + 'courses/secure/' + courseId);
        responsePromise.success(function(data, status, headers, config) {
          if (callback) callback(data);
        });
      },

      saveCourse: function(requestData, requestType, successCallback, failCallback){
        $http.defaults.headers.common['Authorization'] = $rootScope.basicAuth;
       
        $http({
          method  : requestType,
          url     : apiUrl + 'courses/secure/create',
          data    : requestData,  // pass in data as strings
        })
        .success(function(data) {
          if(successCallback)
            successCallback(data);
        })
        .error(function(error) {
          if(failCallback)
            failCallback(error);
        });
      }
    }
  }
]);
