appinioController.controller('RankingCtrl', function ($scope, $ionicModal, $rootScope, $stateParams, $ionicSlideBoxDelegate, Ranking, User, currentUser, $ionicScrollDelegate, Tracker) {

  $scope.ranking = {};
  $scope.currentSlider = -1;

  $scope.$on('reload:ranking', function(){
    try{
      $ionicScrollDelegate.freezeAllScrolls(false);
    }catch(err){}
    if($scope.ranking.global != null){
      currentUser.getUser(function (user) {
        if(user.nickname != $scope.lastLoad.nickname
          || user.xp != $scope.lastLoad.xp
          || user.color != $scope.lastLoad.color
          || user.unlocked.length != $scope.lastLoad.unlocked){
          $scope.getRankingList();
        }
      });
    }
  });

  $scope.getRankingList = function () {

    currentUser.getUser(function (user) {
      $scope.lastLoad = {
        xp: $rootScope.loggedInUser.xp,
        nickname: $rootScope.loggedInUser.nickname,
        unlocked: $rootScope.loggedInUser.unlocked.length,
        color: user.color
      };
      $scope.globalUnlocked = _.contains($rootScope.loggedInUser.unlocked, 'rankingGlobal');
      $scope.monthlyUnlocked = _.contains($rootScope.loggedInUser.unlocked, 'rankingMonthly');
      $scope.friendsUnlocked = _.contains($rootScope.loggedInUser.unlocked, 'rankingFriends');
    });

    Ranking.getRanking('global', function (response) {
      $scope.ranking.global = response.success;
      $scope.marginGlobal = (((response.success.length * 4)/(response.success.length * 4 / 2))*100)/1.125 + '%';
    });

    Ranking.getRanking('monthly', function (response) {
      $scope.ranking.month = response.success;
      $scope.marginMonth = (((response.success.length * 4)/(response.success.length * 4 / 2))*100)/1.125 + '%';
    });

    Ranking.getRanking('friends', function (response) {
      $scope.ranking.friend = response.success;
      $scope.marginFriend = (((response.success.length * 4)/(response.success.length * 4 / 2))*100)/1.125 + '%';
    });

  };

  $scope.getMemberProfile = function (memberId) {
    $rootScope.openProfileModal(memberId);
  };

  $scope.sliderChanges = function(index){
    Tracker.trackEvent('showRanking', {index: index});
    $scope.currentSlider = index;
  };

  $scope.goToSlide = function (index) {
    $scope.currentSlider = index - 1;
    $ionicSlideBoxDelegate.slide(index);
  };

  Tracker.trackEvent('showRanking', {index: -1});
  $scope.getRankingList();

});
