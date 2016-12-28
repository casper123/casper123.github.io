appinioController
.controller('CreateQuestionCtrl', 
  function ($scope, 
              $ionicSlideBoxDelegate, 
              $ionicModal, 
              $state, 
              $rootScope, 
              $ionicLoading, 
              $ionicPlatform, 
              $ionicPopup, 
              $timeout, 
              User, 
              Survey, 
              currentUser, 
              ImagePicker, 
              //Tracker, 
              PushNotification) {

  $scope.$on('load:newQuestion', function(event, data){
    $scope.initCreation(data);
  });

  $scope.initCreation = function(user){

    $scope.participantOptions = [
      {participants: 50, price:50, unlocked:false},
      {participants: 100, price: 100, unlocked:false},
      {participants: 200, price:200, unlocked:false},
      {participants: 400, price:400, unlocked:false}
    ];
    $scope.nothingUnlocked = false;
    $scope.forUser = user;
    $scope.friendOnly = false;
    $scope.questionData = {};
    $scope.questionData.qtype = 'vsimage';
    $scope.questionData.answers = [{}, {}];
    $scope.questionData.text = '';
    $scope.questionData.participants = 0;
    $scope.questionData.friends = [];
    $scope.forFriends = null;
    $scope.slideIndex = 0;
    if(user != null){
      $scope.friendOnly = true;
      $scope.questionData.friends = [user._id];
    }
    User.getUserRelations(function (data) {
      $scope.friends = data;
    });
    currentUser.getUser(function (user) {
      if(user){
        $scope.loggedInUser = user;
        _.each($scope.participantOptions, function(e){
          e.unlocked = _.contains(user.unlocked, 'participants'+e.participants);
        });
        if($scope.participantOptions[0].price<=user.coins){
          $scope.participantOptions[0].selected = true;
        }
        $scope.unlockedTypes = {
          starslider: _.contains(user.unlocked, 'createstarslider'),
          thumbslider: _.contains(user.unlocked, 'createthumbslider'),
          vstext: _.contains(user.unlocked, 'createvstext'),
          vsimage: _.contains(user.unlocked, 'createvsimage'),
          mc: _.contains(user.unlocked, 'createmc')
        };
        if($scope.forUser != null && !$scope.unlockedTypes.vsimage){
          $scope.nothingUnlocked = true;
          $timeout(function(){
            $ionicPopup.alert({
              templateUrl:'main/templates/popups/nothing-unlocked-popup.html'
            });
          }, 1000);
        }
      }
    });

    try{
      $scope.creationDelegate.slide(0);
    }catch(err){}
  };

  // First Screen
  $scope.friendQuestionNext = function(){
    if($scope.lastValidation() && $scope.friends.length > 0){
      Tracker.trackEvent('friendQuestionNext');
      $scope.forFriends = true;
      $scope.nextStep();
    }
  };
  $scope.communityQuestionNext = function(){
    if($scope.lastValidation()){
      Tracker.trackEvent('communityQuestionNext');
      $scope.forFriends = false;
      $scope.nextStep();
    }
  };
  $scope.forFriendNext = function(){
    if($scope.lastValidation()){
      Tracker.trackEvent('directQuestion');
      $scope.questionData.friends = [{user:$scope.forUser}];
      $scope.createQuestion();
    }
  };
  $scope.lastValidation = function(){
    if($scope.unlockedTypes[$scope.questionData.qtype] == false){
      return false;
    }
    $scope.validateQuestion();
    if($scope.questionData.valid == false){
      $ionicPopup.alert({
        templateUrl:'main/templates/popups/question-error-popup.html'
      });
      return false;
    }
    return true;
  };
  $scope.validateQuestion = function(){
    var valid = true;
    if(!$scope.questionData.text || $scope.questionData.text.length < 3 || $scope.questionData.text.length > 100){
      valid = false;
    }
    if($scope.questionData.qtype == 'mc' || $scope.questionData.qtype == 'vstext'){
      _.each($scope.questionData.answers, function(e){
        if(e.text == null || e.text <= 1 || e.text > 40){
          valid = false;
        }
      });
      if($scope.questionData.answers.length<2){
        valid = false;
      }
    }
    if($scope.questionData.qtype == 'vsimage'){
      _.each($scope.questionData.answers, function(e){
        if(e.imageUrl == null || e.imageUrl<3){
          valid = false;
        }
      });
      if($scope.questionData.answers.length<2){
        valid = false;
      }
    }
    $scope.questionData.valid = valid;
  };

  // First Screen Options
  $scope.selectQuestionType = function(questionType){
    Tracker.trackEvent('selectQtype', {type: questionType, unlocked: $scope.unlockedTypes[$scope.questionData.qtype]});
    $scope.questionData.qtype = questionType;
    if (questionType == 'vstext' || questionType == 'vsimage') {
      $scope.questionData.answers = [{}, {}];
    } else if (questionType == 'mc') {
      $scope.questionData.answers = [{}, {}, {}];
    } else {
      delete $scope.questionData.answers;
    }
    if(questionType == 'vsimage' || questionType == 'mc'){
      $scope.questionData.media = null;
      $scope.questionData.mediaPreview = null;
    }
    $scope.validateQuestion();
  };
  $scope.setImageForMedia = function(){
    ImagePicker.pickImage(function(data, preview){
      console.log('jup');
      //$scope.questionData.media = data;
      $scope.questionData.mediaPreview = preview;
      $scope.validateQuestion();
    }, function(){}, 0.5, true);
  };
  $scope.setImageForAnswer = function(index){
    ImagePicker.pickImage(function(data, preview){
      $scope.questionData.answers[index].imageUrl = data;
      $scope.questionData.answers[index].preview = preview;
      $scope.validateQuestion();
    }, function(){}, 1);
  };
  $scope.deleteImageForMedia = function(){
    $scope.questionData.media = null;
    $scope.questionData.mediaPreview = null;
    $scope.questionData.mediaCropped = null;
  };

  // Second Screen Options
  $scope.selectAllFriends = function(friends){
    if(_.where(friends, {selected:true}).length == friends.length){
      _.each(friends, function(e){
        e.selected = false;
      });
    }else{
      _.each(friends, function(e){
        e.selected = true;
      });
    }
  };
  $scope.selectParticipants = function(value){
    var find = _.findWhere($scope.participantOptions, {participants: value});
    if(find != null && find.unlocked && $rootScope.loggedInUser.coins >= find.price){
      _.each($scope.participantOptions, function(e){
        e.selected = (e.participants == value);
      });
    }
  };

  // Second Screen
  $scope.createForFriends = function (friends) {
    if(friends){
      $scope.questionData.friends = _.where(friends, {selected: true});
    }
    $scope.createQuestion();
  };
  $scope.createForParticipants = function(){
    var participants = _.findWhere($scope.participantOptions, {selected:true});
    if(!participants || $rootScope.loggedInUser.coins < participants.price){
      $ionicPopup.alert({
        templateUrl:'main/templates/popups/no-coins-popup.html'
      });
      return;
    }
    $scope.questionData.participants = participants.participants;
    $scope.confirmData = {
      participants: participants.participants,
      coins: participants.price
    };
    $scope.finalConfirmPopup = $ionicPopup.alert({
      scope: $scope,
      templateUrl:'main/templates/popups/confirm-community-popup.html'
    });
    $scope.finalConfirmPopup.then(function(res){
      if(!res) return;
      $scope.createQuestion();
    });
  };

  $scope.closeConfirmationPopup = function(){
    $scope.finalConfirmPopup.close();
  };


  // Creation
  $scope.createQuestion = function () {
    _.each($scope.questionData.answers, function(e){
      delete e.preview;
    });
    $ionicLoading.show({
      template: '<div class="white-spinner"><ion-spinner icon="dots"></ion-spinner></div>'
    });
    if($scope.forFriends){
      var friendIds = [];
      _.each($scope.questionData.friends, function(e){
        friendIds.push(e.user._id);
      });
      $scope.questionData.friends = friendIds;
      $scope.questionData.participants = $scope.questionData.friends.length;
    } else{
      $scope.questionData.friends = [];
    }
    Survey.createQuestion($scope.questionData, function () {
      $state.go('tabMenuMain.answer');
      $rootScope.$broadcast('load:ownQuestions', true);
      $timeout(function(){
        $scope.closeCreateQuestionModal();
        $timeout(function(){
          $ionicLoading.hide();
          $timeout(function(){
            PushNotification.start($rootScope.loggedInUser, 'sawPushPermissionQuestion');
          }, 500);
        }, 250);
      }, 500);
      var price = 0;
      if($scope.confirmData){
        price = $scope.confirmData.coins;
      }
      Tracker.trackEvent('createQuestion', {
        direct: $scope.friendOnly ? 'true':'false',
        forCommunity: !$scope.forFriends  ? 'true':'false',
        forFriends: $scope.forFriends  ? 'true':'false',
        coins: JSON.stringify($rootScope.loggedInUser.coins),
        friends: JSON.stringify($scope.friends.length),
        selectedFriends: JSON.stringify($scope.questionData.friends.length),
        price: JSON.stringify(price)
      });
    }, function(data){
      if(data.error && data.error[0] && data.error[0].verified){
        $ionicLoading.hide();
        $ionicPopup.alert({
          templateUrl:'main/templates/popups/not-verified-popup.html'
        });
      }else{
        $ionicPopup.alert({
          templateUrl:'main/templates/popups/error-popup.html'
        });
        $timeout(function(){
          $scope.closeCreateQuestionModal();
          $timeout(function(){
            $ionicLoading.hide();
          }, 250);
        }, 500);
      }
    });
  };


  // Navigation
  $scope.nextStep = function () {
    $rootScope.backButtonDeregister = $ionicPlatform.registerBackButtonAction(
      function () { $scope.slideBack();}, 250
    );
    $scope.creationDelegate.next();

    if($scope.questionData.mediaCropped != null){
      ImagePicker.convertBase64ToUrl($scope.questionData.mediaCropped, function(data){
        $scope.questionData.media = data;
        console.log($scope.questionData.media);
      });
    }else if($scope.questionData.mediaPreview != null){
      ImagePicker.convertBase64ToUrl($scope.questionData.mediaPreview, function(data){
        $scope.questionData.media = data;
        console.log($scope.questionData.media);
      });
    }
  };
  $scope.slideBack = function () {
    if($rootScope.backButtonDeregister){
      $rootScope.backButtonDeregister();
    }
    $scope.creationDelegate.previous();
  };
  $scope.slideChanged = function (index) {
    $scope.slideIndex = index;
  };


  $scope.initCreation();
  $timeout(function(){
    $scope.creationDelegate = _.find($ionicSlideBoxDelegate._instances, function (e) {
      return e.$$delegateHandle === 'creation';
    });
    $scope.creationDelegate.enableSlide(false);
  }, 1);

});
