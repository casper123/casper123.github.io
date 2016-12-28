appinioController
.controller('BadgeCtrl', 
  function($scope, 
            $ionicSlideBoxDelegate, 
            $ionicPopup, 
            Tracker,
            Badges ){

  Badges.getSocialBadges(function(data){
    $scope.socialBadges = data;
    _.each($scope.socialBadges.charities, function(e){
      e.counter = 0;
      var find = _.where($scope.socialBadges.votes, {charity: e._id});
      if(find && find.length>0){
        e.counter += find.length;
      }
    });
    _.each($scope.socialBadges.transactions, function(e){
      var find = _.findWhere($scope.socialBadges.charities, {_id: e._id});
      e.details = find;
    });
  });

  Badges.getGameBadges();

  $scope.showSocialBadgeDetails = function(badge){
    Tracker.trackEvent('showSocialBadge');
    $scope.badgeDetails = {};
    if(badge.counter == 0 || badge.counter){
      $scope.badgeDetails = badge;
      $scope.badgeDetails.new = true;
    }else{
      $scope.badgeDetails = badge.details;
      $scope.badgeDetails.new = false;
      $scope.badgeDetails.amount = badge.appinioAmount + badge.sumAmount;
    }
    $ionicPopup.alert({
      scope: $scope,
      templateUrl: 'main/templates/popups/badge-social-popup.html'
    });
  };

  $scope.showGameBadgeDetails = function(badge){
    Tracker.trackEvent('showGameBadge');
    $scope.badgeDetail = badge;
    $ionicPopup.alert({
      scope: $scope,
      templateUrl: 'main/templates/popups/badge-game-popup.html'
    });
  };

});

