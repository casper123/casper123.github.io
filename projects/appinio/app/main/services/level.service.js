appinioService.factory('Level', function ($http, appinioConfig, $rootScope) {
  return {
    init: function () {
      if (!$rootScope.featureList) {
        $rootScope.featureList = JSON.parse(window.localStorage.getItem("featureList"));
        var responsePromise = $http.get(appinioConfig.baseUrl + 'user/levelFeatures');
        responsePromise.success(function (data, status, headers, config) {
          if (data.success) {
            $rootScope.featureList = data.success;
            window.localStorage.setItem("featureList", JSON.stringify($rootScope.featureList));
          }
        });
      }
    },
    getUnlockLevel: function (text) {
      if (!$rootScope.featureList) {
        this.init();
      }
      var find = _.findWhere($rootScope.featureList, {unlock: text});
      if (find) {
        return find.level;
      }
      return 0;
    }
  };
});

appinioService.service('LevelService', function LevelService($timeout, $http, appinioConfig) {

  var levelService = this;

  levelService.levels = {

  };
  levelService.feature = {

  };

  levelService.setFeatureList = function () {
    _.each(levelService.levels.data, function(e){
      if(e.unlock){
        levelService.feature[e.unlock] = e.level;
      }
    });
  };

  levelService.getLevel = function(lvl, xp){
    if(levelService.levels && levelService.levels.data){
      var findLevel = _.findWhere(levelService.levels.data, {level:lvl});
      if(findLevel){
        return 100 * (xp - findLevel.xpfrom)/(findLevel.xpto - findLevel.xpfrom);
      }
    }
    return 0;
  };
  levelService.getReverseLevel = function(lvl, xp){
    if(levelService.levels && levelService.levels.data){
      var findLevel = _.findWhere(levelService.levels.data, {level:lvl});
      if(findLevel){
        return 100 -(100 * (xp - findLevel.xpfrom)/(findLevel.xpto - findLevel.xpfrom));
      }
    }
    return 100;
  };

  levelService.init = function () {
    if (!levelService.levels.data) {
      levelService.levels.data = JSON.parse(window.localStorage.getItem("levels"));
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/level');
      responsePromise.success(function (data) {
        if (data.success) {
          levelService.levels.data = data.success;
          window.localStorage.setItem("levels", JSON.stringify(levelService.levels.data));
          levelService.setFeatureList();
        }
      });
    }
  }

});
