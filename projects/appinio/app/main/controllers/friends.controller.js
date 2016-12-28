appinioController.controller('FriendsCtrl', function($scope, User, $cordovaFacebook, $ionicPopup, Tracker, $timeout, PushNotification, $rootScope){

  $scope.migrateToFacebook = function(){
    $cordovaFacebook.login(["public_profile", "email", "user_friends", "user_birthday", "user_photos"])
      .then(function () {
        $cordovaFacebook.getAccessToken().then(function (success) {
          User.migrateToFacebook(success, function(){
            Tracker.trackEvent('migrateToFacebook', {type: 'friends'});
            $scope.loadFriends();
          });
        }, function () {
          $ionicPopup.alert({
            templateUrl:'main/templates/popups/error-popup.html'
          });
        });
      },
      function (error) {
        $ionicPopup.alert({
          templateUrl:'main/templates/popups/error-popup.html'
        });
      });
  };

  $scope.$on('load:friends', function(){
    $scope.searchedUsers = [];
    $scope.loadFriends();
    delete $scope.externalFriendFilter;
  });

  $scope.addFriend = function(user){
    User.addUserRelation(user._id, function(){
      Tracker.trackEvent('addFriend');
      user.relation = {state:0};
      $scope.popupPicture = user.avatar || user.imageUrl || './img/avatar/avatar03.png';
      $scope.popupName = user.nickname || 'Anonym';
      var popup = $ionicPopup.alert({
        scope:$scope,
        templateUrl:'main/templates/popups/confirm-add-popup.html'
      });
      $scope.searchedUsers = [];
      delete $scope.externalFriendFilter;

      popup.then(function(){
        $timeout(function(){
          PushNotification.start($rootScope.loggedInUser, 'sawPushPermissionFriends');
        }, 500);
      });

    });
  };

  $scope.loadFriends = function(){
    $rootScope.noFacebook = false;
    User.getFacebookSuggestion(function(data){
      if(data.noFacebook){
        $rootScope.noFacebook = true;
      }else{
        $scope.facebookFriends = data;
        $scope.removePendingFromLists();
      }
    });
    User.getUserPendingRelations(function(data){
      $scope.pendingRequests = data;
      $scope.removePendingFromLists();
    });
    User.getUserRelations(function(data){
      $scope.currentFriends = data;
      User.quickUpdate();
    });
  };

  $scope.removePendingFromLists = function(){
    if(!$scope.pendingRequests){
      return;
    }
    $scope.facebookFriends = _.filter($scope.facebookFriends, function(e){
      var find = false;
      for(var i = 0;i < $scope.pendingRequests.length; i++){
        if($scope.pendingRequests[i].user._id == e._id){
          find = true;
          break;
        }
      }
      return !find;
    });
    $scope.searchedUsers = _.filter($scope.searchedUsers, function(e){
      var find = false;
      for(var i = 0;i < $scope.pendingRequests.length; i++){
        if($scope.pendingRequests[i].user._id == e._id){
          find = true;
          break;
        }
      }
      return !find;
    });
  };

  $scope.acceptRequest = function(id){
    $scope.currentFriends.push(_.findWhere($scope.pendingRequests, {_id:id}));
    $scope.pendingRequests = _.filter($scope.pendingRequests, function(e){
      return (e._id != id);
    });
    User.acceptFriendRequest(id, function(){
      Tracker.trackEvent('acceptFriendRequest');
      User.quickUpdate();
      //$scope.loadFriends();
    });
  };

  $scope.rejectRequest = function(id){
    $scope.pendingRequests = _.filter($scope.pendingRequests, function(e){
      return (e._id != id);
    });
    User.declineFriendRequest(id, function(){
      Tracker.trackEvent('declineFriendRequest');
      //$scope.loadFriends();
    });
  };

  $scope.blurSearch = function(){
    Tracker.trackEvent('searchUser');
  };

  $scope.searchForUsers = function(text){
    if(text && text.length > 2){
      $scope.userLoading = true;
      User.searchOtherUsers(text, function(data){
        $scope.userLoading = false;
        $scope.searchedUsers = [];
        _.each(data, function(e){
          var find = false;
          for(var i = 0;i < $scope.currentFriends.length;i++){
            if($scope.currentFriends[i].user._id == e._id){
              find = true;
              break;
            }
          }
          if(!find){
            $scope.searchedUsers.push(e);
          }
        });
        $scope.removePendingFromLists();
      });
    }else{
      $scope.searchedUsers = [];
    }
  };

  $scope.loadFriends();

});
