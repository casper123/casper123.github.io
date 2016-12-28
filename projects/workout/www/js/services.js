angular.module('workoutfactory.services', [])

/**
 * A simple example service that returns some data.
 */
 .factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
  { id: 0, name: 'Scruff McGruff', image : 'https://fbstatic-a.akamaihd.net/rsrc.php/v2/yo/r/UlIqmHJn-SK.gif' },
  { id: 1, name: 'G.I. Joe', image : 'https://fbstatic-a.akamaihd.net/rsrc.php/v2/yo/r/UlIqmHJn-SK.gif' },
  { id: 2, name: 'Miss Frizzle', image : 'https://fbstatic-a.akamaihd.net/rsrc.php/v2/yo/r/UlIqmHJn-SK.gif' },
  { id: 3, name: 'Ash Ketchum', image : 'https://fbstatic-a.akamaihd.net/rsrc.php/v2/yo/r/UlIqmHJn-SK.gif' },
  { id: 4, name: 'Miss Frizzle', image : 'https://fbstatic-a.akamaihd.net/rsrc.php/v2/yo/r/UlIqmHJn-SK.gif' },
  { id: 5, name: 'Ash Ketchum', image : 'https://fbstatic-a.akamaihd.net/rsrc.php/v2/yo/r/UlIqmHJn-SK.gif' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

 .factory('Dashboard', function($http) {
  return {
    getAll: function(callbackFunc) {
      var responsePromise = $http.get("http://curiouslabx.com/projects/workoutfactory/workoutFactory/index.php/web_services/");

      responsePromise.success(function(data, status, headers, config) {
        //console.log(data);
		callbackFunc(data);
      });

      responsePromise.error(function(data, status, headers, config) {
        console.log("in fail");
      });
    },

    getItems: function(typeId, callbackFunc) {
      var responsePromise = $http.get("http://wahabkotwal.net/projects/bawarchi/index.php/webservice/get_latest_recipe/" + typeId);

      responsePromise.success(function(data, status, headers, config) {
        callbackFunc(data);
      });

      responsePromise.error(function(data, status, headers, config) {
        console.log("in fail");
      });
    },

    registerUser: function(device_id) {
      var responsePromise = $http.get("http://wahabkotwal.net/projects/bawarchi/index.php/webservice/save_device/" + device_id);
    }
  }
})


 .factory('Recipie', function($http) {
  return {
   getItems: function(typeId, callbackFunc) {
      var responsePromise = $http.get("http://curiouslabx.com/projects/workoutfactory/workoutFactory/index.php/web_services/getDietById/" + typeId);

      responsePromise.success(function(data, status, headers, config) {
        callbackFunc(data);
      });

      responsePromise.error(function(data, status, headers, config) {
        console.log("in fail");
      });
    },

    registerUser: function(device_id) {
      var responsePromise = $http.get("http://wahabkotwal.net/projects/bawarchi/index.php/webservice/save_device/" + device_id);
    }
  }
})


.factory('Category', function($http) {
  return {
    getAll: function(callbackFunc) {
      var responsePromise = $http.get("http://curiouslabx.com/projects/workoutfactory/workoutFactory/index.php/web_services/bodyparts");
		
      responsePromise.success(function(data, status, headers, config) {
        callbackFunc(data);
      });

      responsePromise.error(function(data, status, headers, config) {
        console.log("in fail");
      });
    },

    getCategoryItems: function(cat_id, callbackFunc) {
      var responsePromise = $http.get("http://curiouslabx.com/projects/workoutfactory/workoutFactory/index.php/web_services/muscle/"+ cat_id);
		
      responsePromise.success(function(data, status, headers, config) {
        //console.log(data);
		callbackFunc(data);
      });

      responsePromise.error(function(data, status, headers, config) {
        console.log("in fail");
      });
    },
  }
})

.factory('Item', function($http) {
  return {
    getItem: function(id, callbackFunc) {
      var responsePromise = $http.get("http://curiouslabx.com/projects/workoutfactory/workoutFactory/index.php/web_services/exercise/" + id);

      responsePromise.success(function(data, status, headers, config) {
        callbackFunc(data);
      });

      responsePromise.error(function(data, status, headers, config) {
        console.log("in fail");
      });
    },

    updateFavourite: function(id) {
      var responsePromise = $http.get("http://wahabkotwal.net/projects/bawarchi/index.php/webservice/update_favourite/" + id);
    }
  }
})

.factory('Bodyparts', function($http) {
  return {
    getAll: function(callbackFunc) {
      var responsePromise = $http.get("http://curiouslabx.com/projects/workoutfactory/workoutFactory/index.php/web_services/bodyparts");

      responsePromise.success(function(data, status, headers, config) {
       callbackFunc(data);
      });

      responsePromise.error(function(data, status, headers, config) {
        console.log("in fail");
      });
    }
}
})
