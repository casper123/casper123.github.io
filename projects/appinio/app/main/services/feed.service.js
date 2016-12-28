appinioService.factory('Feed', function ($http, appinioConfig, $rootScope) {
  return {
    initFeed: function () {
      $rootScope.currentTime = new Date().getTime();
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/feed');
      responsePromise.success(function (data) {
        if (data.success) {
          $rootScope.feedData = data.success;
          if($rootScope.loggedInUser){
            var lastCheck = new Date(window.localStorage.getItem($rootScope.loggedInUser._id + 'readFeed'));
            var counter = 0;
            _.each($rootScope.feedData, function(e){
              if((new Date(e.date)).getTime()>lastCheck.getTime()) {
                counter++;
              }
            });
            $rootScope.feedCounter = counter;
          }
        }
      });
    },
    reloadFeed: function () {
      $rootScope.currentTime = new Date().getTime();
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/feed');
      responsePromise.success(function (data) {
        if (data.success) {
          $rootScope.feedData = data.success;
          if($rootScope.loggedInUser){
            var lastCheck = new Date(window.localStorage.getItem($rootScope.loggedInUser._id + 'readFeed'));
            var counter = 0;
            _.each($rootScope.feedData, function(e){
              if((new Date(e.date)).getTime()>lastCheck.getTime()) {
                counter++;
              }
            });
            $rootScope.feedCounter = counter;
          }
        }
      });
    },
    readFeed: function(){
      if($rootScope.loggedInUser){
        window.localStorage.setItem($rootScope.loggedInUser._id + 'readFeed', new Date());
      }
    }
  };
});
