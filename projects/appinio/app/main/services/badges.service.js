appinioService
  .service('Badges', function ($http, appinioConfig, $rootScope) {

    var badgeService = this;

    badgeService.getSocialBadges = function (callbackFunc) {
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/badges/social');
      responsePromise.success(function (data, status, headers, config) {
        if (data.success) {
          callbackFunc(data.success);
        }
      });
    };
    badgeService.getGameBadges = function (callbackFunc) {
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/badges/game');
      responsePromise.success(function (data) {
        if (data.success) {
          var newBadge = badgeService.checkNewBadges(data.success);
          if(newBadge != null && $rootScope.myBadges != null){
            var findSuccessor = _.findWhere(data.success, {type:newBadge.type, level:newBadge.level+1});
            if(findSuccessor == null){
              newBadge.done = true;
            }
            $rootScope.$broadcast('badge:rewarded', newBadge);
          }
          $rootScope.gameBadges = [];
          _.each(data.success, function(e){
            if(e.progress > e.amount){
              e.progress = e.amount;
            }
            if(e.level == 1 && e.rewarded != true){
              $rootScope.gameBadges.push(e);
            }else if(e.level == 1 && e.rewarded == true){
              var find = _.findWhere(data.success, {type: e.type, level:2});
              if(find != null){
                if(find.rewarded != true){
                  $rootScope.gameBadges.push(find);
                }else{
                  var findLast = _.findWhere(data.success, {type: e.type, level:3});
                  if(findLast != null){
                    if(findLast.rewarded == true){
                      findLast.progress = findLast.amount;
                    }
                    $rootScope.gameBadges.push(findLast);
                  }else{
                    $rootScope.gameBadges.push(find);
                  }
                }
              }else{
                e.done = true;
                // TODO: ???
                e.progress = e.amount;
                $rootScope.gameBadges.push(e);
              }
            }
          });

          _.each($rootScope.gameBadges, function(e){
            e.reverseProgress = 100-(100*(e.progress / e.amount));
          });

          //$rootScope.gameBadges = data.success;
          $rootScope.badgePreview = [];
          _.each($rootScope.gameBadges, function (e) {
            if(((e.level == 1 && e.rewarded) || e.level > 1) && $rootScope.badgePreview.length < 4) {
              var find = _.findWhere($rootScope.badgePreview, {type: e.type});
              if(!find){
                $rootScope.badgePreview.push(e);
              }else if(find.level < e.level){
                find.level = e.level;
              }
            }
          });
          if ($rootScope.badgePreview.length < 4) {
            for (var i = 0; i < $rootScope.gameBadges.length; i++) {
              if ($rootScope.gameBadges[i].level == 1 && $rootScope.badgePreview.length < 4) {
                $rootScope.badgePreview.push($rootScope.gameBadges[i]);
              }
              if ($rootScope.badgePreview.length >= 4) {
                break;
              }
            }
          }
          $rootScope.myBadges = _.where($rootScope.gameBadges, {rewarded: true}).length;
          if (callbackFunc) {
            callbackFunc(data.success);
          }
        }
      });
    };
    badgeService.checkNewBadges = function(data){
      if(!$rootScope.gameBadges){
        return null;
      }
      var newBadge = null;
      for(var i = 0;i < data.length;i++){
        if(data[i].rewarded){
          if(_.findWhere($rootScope.gameBadges, {_id: data[i]._id, rewarded:false})){
            newBadge = _.findWhere($rootScope.gameBadges, {_id: data[i]._id, rewarded:false});
            break;
          }
        }
      }
      return newBadge;

    };
    badgeService.checkForBadges = function () {
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/badges/count');
      responsePromise.success(function (data) {
        if(data.success && $rootScope.myBadges != null && data.success > $rootScope.myBadges) {
          badgeService.getGameBadges();
        }
      });
    };
  });
