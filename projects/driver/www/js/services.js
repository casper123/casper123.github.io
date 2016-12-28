angular.module('starter.services', [])

.factory('User', function($http) {
  // Might use a resource here that returns a JSON array

  return {
    login: function(postData, callbackFunc) {
      console.log(postData);
      $http({
        method  : 'POST',
        url     : 'http://service.deliverto.com/methods.php',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function(data) {
        console.log(JSON.stringify(data));
        console.log("in error");
      });
    },

    activity_assign: function(postData, callbackFunc) {
      $http({
        method  : 'POST',
        url     : 'http://service.deliverto.com/methods.php',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },

    edit: function(postData, callbackFunc) 
    {
      $http({
        method  : 'POST',
        url     : 'http://wahabkotwal.net/projects/driverapp/login.php',
        data    : postData,  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },

    getLoggedInUser: function(callbackFunc) {
      var user = {};

      user.id = window.localStorage.getItem("userId");
      user.userName =  window.localStorage.getItem("userName");
      user.hashKey =  window.localStorage.getItem("hasKey");
      user.token =  window.localStorage.getItem("token");
      user.status =  window.localStorage.getItem("status");

      var onSuccess = function(position) {
        user.latitude = position.coords.latitude;
        user.longitude = position.coords.longitude;
        return callbackFunc(user);
      };
      
      function onError(error) {
          alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
      }

      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  }
})

.factory('Task', function($http) {
  // Might use a resource here that returns a JSON array

  return {
    assignTask: function(postData, callbackFunc) {
      $http({
        method  : 'POST',
        url     : 'http://service.deliverto.com/methods.php',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },

    beginTask: function(postData, callbackFunc) {
      $http({
        method  : 'POST',
        url     : 'http://service.deliverto.com/methods.php',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },

    completeTask: function(postData, callbackFunc) {
      $http({
        method  : 'POST',
        url     : 'http://service.deliverto.com/methods.php',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },

    delayedTask: function(postData, callbackFunc) {
      $http({
        method  : 'POST',
        url     : 'http://service.deliverto.com/methods.php',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },

    locationTask: function(postData, callbackFunc) {
      $http({
        method  : 'POST',
        url     : 'http://service.deliverto.com/methods.php',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },

    getAssignments: function(token, userId, type, latitude, longitude, callbackFunc) {
      $http({
        method  : 'GET',
        url     : 'http://service.deliverto.com/methods.php?pram1=' + type +'&pram2=' +  token + '&pram3=' + userId + "&latitude=" + latitude + "&longitude=" + longitude, 
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },

    getDetails: function(taskId, userId, token, latitude, longitude, callbackFunc) {
      $http({
        method  : 'GET',
        url     : 'http://service.deliverto.com/methods.php?pram1=activityDetails&pram2=' +  token + '&pram3=' + userId + '&pram4=' + taskId + "&latitude=" + latitude + "&longitude=" + longitude, 
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },
  }
})