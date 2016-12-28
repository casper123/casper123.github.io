appinioService
  .factory('currentUser', function ($rootScope, LevelService) {
    return {
      getUser: function (callbackFunc) {
        $rootScope.loggedInUser = JSON.parse(window.localStorage.getItem("user"));
        if ($rootScope.loggedInUser) {
          $rootScope.colorTheme = $rootScope.loggedInUser.color;
        }
        if($rootScope.loggedInUser){
          $rootScope.progress = LevelService.getLevel($rootScope.loggedInUser.level, $rootScope.loggedInUser.xp);
          $rootScope.reverseProgress = LevelService.getReverseLevel($rootScope.loggedInUser.level, $rootScope.loggedInUser.xp);
        }
        callbackFunc($rootScope.loggedInUser);
      },
      setUser: function (user) {
        user.loginDate = new Date();
        window.localStorage.setItem("user", JSON.stringify(user));
        $rootScope.loggedInUser = user;
        $rootScope.colorTheme = user.color;
        LevelService.setFeatureList();
        $rootScope.progress = LevelService.getLevel($rootScope.loggedInUser.level, $rootScope.loggedInUser.xp);
        $rootScope.reverseProgress = LevelService.getReverseLevel($rootScope.loggedInUser.level, $rootScope.loggedInUser.xp);
      },
      removeUser: function () {
        window.localStorage.removeItem("user");
        $rootScope.loggedInUser = {};
      }
    }
  });