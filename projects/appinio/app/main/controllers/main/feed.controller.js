appinioController.controller('FeedCtrl', function($scope, Feed, $rootScope, $state, Tracker){

  $scope.$on('reload:feed', function(){
    Feed.readFeed();
    Feed.reloadFeed();
  });

  $scope.limit = 10;

  $scope.doRefresh = function(){
    console.log('asddas');
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.loadMore = function(){
    if($rootScope.feedData){
      if($rootScope.feedData.length > $scope.limit){
        $scope.limit += 8;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    }else{
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
  };

  $scope.decideAction = function(type, data){
    Tracker.trackEvent('jumpTo', {type: type});
    switch(type)
    {
      case 'friendsPending':
        $rootScope.openFriendList();
        break;

      case 'friendsAnswers':
        $state.go('tabMenuMain.answer', {surveyId:data.surveyId});
        break;

      case 'friendsQuestions':
        $state.go('tabMenuMain.quickies', {surveyId:data._id});
        break;

    }
  };

  Feed.readFeed();
  Feed.reloadFeed();

});
