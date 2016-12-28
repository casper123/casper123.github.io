appinioController.controller('QuickiesCtrl', function ($stateParams, $scope, $ionicModal, Survey, $ionicActionSheet, $rootScope, $timeout, $ionicPopup, User, ShareText, Tracker) {

  $ionicModal.fromTemplateUrl('main/templates/menu-main/quickies/survey-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.surveyStartModal = modal;
  });
  $scope.$on('open:surveys', function(){
    Tracker.trackEvent('openSurveys',{
      surveys: JSON.stringify($rootScope.availableSurvey),
      verified: !$rootScope.companySurveysError  ? 'true':'false'
    });
    $rootScope.setScreen('surveys');
    $scope.surveyStartModal.show();
  });
  $scope.$on('show:nextQuestion', function(){
    $scope.nextQs();
    $scope.$apply();
  });
  $scope.hideLastQuestion = function(){
    $scope.showLast = false;
  };

  $scope.$on('$stateChangeSuccess', function (event, toState, toParams) {
    if(toState.name == 'tabMenuMain.quickies'){
      $scope.$broadcast('reload:surveys', true);
      //TODO: param wieder entfernen???
      if($scope.apnList){
        Survey.getFriendsQuickies(function(friendData){
          _.each(friendData, function(e){
            if(!(toParams.surveyId && !toParams.surveyId.dynamic && toParams.surveyId == e._id)){
              if(_.findWhere($scope.apnList, {surveyId:e._id}) == null){
                $scope.apnList.unshift({surveyId: e._id});
              }
            }
          });
          if(toParams.surveyId && !toParams.surveyId.dynamic){
            $scope.apnList.unshift({surveyId: toParams.surveyId});
          }
          if($scope.apnList.length > 0){
            $scope.quickieDayLimit = false;
          }
          $scope.nextQs(true);
        });
      }
      if($rootScope.justLoggedOut){
        $scope.loadQsList();
        $rootScope.justLoggedOut = true;
      }
    }
  });

  $scope.openOptions = function(lastQuickie){
    Tracker.trackEvent('openQuickieOptions');
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Teilen' }
      ],
      destructiveText: 'Melden',
      cancelText: 'Abbrechen',
      destructiveButtonClicked: function(){
        Tracker.trackEvent('reportQuestion');
        var surveyId = $scope.apnList[0].surveyId;
        if(lastQuickie){
          surveyId = $scope.lastQuestion.surveyId;
        }
        Survey.reportQuestion(surveyId, function(){
          $ionicPopup.alert({
            templateUrl:'main/templates/popups/report-popup.html'
          });
        });
        hideSheet();
      },
      buttonClicked: function(index) {
        if(index == 0){
          Tracker.trackEvent('shareQuestion');
          var text = $scope.apnList[0].question.text;
          if(lastQuickie){
            text = $scope.lastQuestion.question.text;
          }
          ShareText.question(text, function(){
            User.addShare(function(data){
              $rootScope.checkForUpdates(data);
            });
          });
        }
        return true;
      }
    });
  };


  $scope.loadQsList = function(){
    $scope.apnList = [];
    $scope.doNext = false;
    Survey.getFriendsQuickies(function(friendData){
      if(!$scope.apnList || $scope.apnList.length == 0){
        $scope.apnList = [];
      }
      _.each(friendData, function(e){
        $scope.apnList.unshift({surveyId: e._id});
      });
      if($scope.apnList.length > 0){
        $scope.quickieDayLimit = false;
        if(!$scope.doNext){
          $scope.doNext = true;
          $scope.nextQs(true);
        }
      }
    });
    $scope.quickieDayLimit = false;
    Survey.getNextQuickies([], function(data){
      if(!$scope.apnList || $scope.apnList.length == 0){
        $scope.apnList = data.survey;
        _.each($scope.apnList, function(e){
          if(e.gender != null) {
            e.quiz = true;
          }
        });
      }else{
        _.each(data.survey, function(e){
          if(e.gender != null){
            e.quiz = true;
          }
          $scope.apnList.push(e);
        });
      }
      $scope.lastLeft = data.left;
      if(!$scope.doNext){
        $scope.doNext = true;
        $scope.nextQs(true);
      }
    }, function(){
      $scope.quickieDayLimit = true;
    });
  };
  $scope.loadQsList();

  $scope.nextQs = function(noSplice){
    if(!noSplice){
     // $scope.answerQuestion();
      //$scope.lastQuestion = JSON.parse(JSON.stringify($scope.apnList[0]));
      $scope.apnList.splice(0, 1);
      $scope.fillPreview($scope.apnList[1]);
    }
    $scope.loadQsDetails();
  };

  $scope.$watch('apnList[0].question.valid', function() {
    if($scope.apnList && $scope.apnList[0] && $scope.apnList[0].question && $scope.apnList[0].question.valid){
      $scope.answerQuestion();
/*      var skipId = JSON.parse(JSON.stringify($scope.apnList[0].surveyId));
      $timeout(function(){
        if($scope.apnList[0] && $scope.apnList[0].surveyId == skipId){
          $scope.nextQs();
        }
      }, 1000);*/
    }
  });

  $scope.previewList = [];

  $scope.fillPreview = function(surveyObject){
    if(!surveyObject || !surveyObject.question){
      return;
    }
    for(var i=0;i < $scope.apnList.length;i++){
      if($scope.apnList[i].surveyId == surveyObject.question.surveyId && i == 1){
        $scope.previewList = [JSON.parse(JSON.stringify(surveyObject.question))];
        break;
      }
    }
  };

  $scope.loadSingleQuestion = function(surveyObject) {
    if (surveyObject && !surveyObject.details) {
      surveyObject.detailLoading = true;
      if(surveyObject.quiz != true){
        Survey.getQuickieDetails(surveyObject.surveyId, function (data) {
          surveyObject.data = data;
          surveyObject.question = data.questions[0];
          surveyObject.detailLoading = false;
          surveyObject.details = true;

          surveyObject.question.forFriends = data.forFriends;
          surveyObject.question.forCommunity = data.forCommunity;
          surveyObject.question.user = data.user;
          surveyObject.question.quiz = (surveyObject.gender != null);
          surveyObject.question.quizGender = surveyObject.gender;

          $scope.fillPreview(surveyObject);

        });
      }else{
        Survey.getQuizDetails(surveyObject.surveyId, function(data){
          surveyObject.data = data;
          surveyObject.question = data.questions[0];
          surveyObject.detailLoading = false;
          surveyObject.details = true;

          surveyObject.question.forFriends = data.forFriends;
          surveyObject.question.forCommunity = data.forCommunity;
          surveyObject.question.user = data.user;
          surveyObject.question.quiz = (surveyObject.gender != null);
          surveyObject.question.quizGender = surveyObject.gender;

          $scope.fillPreview(surveyObject);
        });
      }
    }
  };

  $scope.loadQsDetails = function(){
    if($scope.apnList && $scope.apnList.length > 0){
      $scope.loadSingleQuestion($scope.apnList[0]);
      $scope.loadSingleQuestion($scope.apnList[1]);
      $scope.loadSingleQuestion($scope.apnList[2]);
    }
    if($scope.apnList.length < 2 && $scope.lastLeft > 0){
      $scope.refillList();
    }else if($scope.apnList.length == 0 && (!$scope.lastLeft || $scope.lastLeft < 1)){
      $scope.quickieDayLimit = true;
    }
  };

  $scope.refillList = function(){
    var blackList = [];
    _.each($scope.apnList, function(e){
      blackList.push(e.surveyId);
    });
    $scope.quickieDayLimit = false;
    Survey.getNextQuickies(blackList, function(data){
      _.each(data.survey, function(e){
        if(e.gender != null){
          e.quiz = true;
        }
        $scope.apnList.push(e);
      });
      $scope.lastLeft = data.left;
      $scope.qsLoad = false;
      $scope.loadQsDetails();
    }, function(){
      if(!$scope.apnList ||  $scope.apnList.length==0){
        $scope.quickieDayLimit = true;
      }
    });
  };

  $scope.answerQuestion = function(){
    if($scope.apnList[0].question.valid){
      var find = _.findWhere($scope.apnList[0].data.questions[0].answers, {selected:true});
      if($scope.apnList[0].question.quiz){
        Survey.answerQuiz($scope.apnList[0].data._id, find._id, $scope.apnList[0].question.quizGender, function(data){
          Tracker.trackEvent('answerQuiz');
          $rootScope.checkForUpdates(data);
        });
      }else{
        var response = JSON.parse(JSON.stringify($scope.apnList[0].data.questions[0].response));
        response.questionId = $scope.apnList[0].data.questions[0]._id;
        var postData = { surveyId : $scope.apnList[0].data._id, responses : [response] };
        Survey.createResponseForSurvey(postData, function(data){
          Tracker.trackEvent('answerQuickie');
          $rootScope.checkForUpdates(data.success);
        });
      }
    }else{
      if($scope.apnList[0].data.quiz){
        Survey.skipQuiz($scope.apnList[0].data._id, function(){
          Tracker.trackEvent('skipQuiz');
        });
      }else{
        Survey.skipQuestion($scope.apnList[0].data._id, function(){
          Tracker.trackEvent('skipQuickie');
        });
      }
    }
  };

  $scope.questionTypeHelp = function(){
    Tracker.trackEvent('showQuestionHelp');
    var thisQuestion = $scope.apnList[0].question;
    $scope.help = {
      icon:'ion-social-apple',
      head:'help_appinio_popup',
      text:'help_appinio_popup_description'
    };
    if(thisQuestion.forFriends){
      $scope.help = {
        friend:{
          name:thisQuestion.user.nickname || '@'+thisQuestion.user.uniqueName,
          avatar:thisQuestion.user.avatar || thisQuestion.user.imageUrl || './img/avatar/avatar03.png'
        },
        icon:'ion-home',
        head:'help_friends_popup',
        text:'help_friends_popup_description'
      };
    }else if(thisQuestion.forCommunity){
      $scope.help = {
        icon:'ion-ios-people',
        head:'help_community_popup',
        text:'help_community_popup_description'
      };
    }else if(thisQuestion.quiz){
      $scope.help = {
        icon:'ion-help',
        head:'help_quiz_popup',
        text:'help_quiz_popup_description'
      };
    }
    $ionicPopup.alert({
      scope: $scope,
      templateUrl:'main/templates/popups/help-popup.html'
    });
  };

  $scope.upvoteQuickie = function(){
    Survey.upvoteQuestion($scope.apnList[0].surveyId, function(){
      Tracker.trackEvent('upvoteQuickie');
      $scope.apnList[0].question.hasVoted = true;
    });
  };


  $scope.initSteps = function(count){
    $scope.quickieData = {};
    $scope.quickieData.questionLength = $scope.quickies.length;
    if(count){
      $scope.quickieData.questionLength += (count-2);
    }
    $scope.quickieData.steps = [];
    for(var i = 0;i < $scope.quickieData.questionLength;i++){
      $scope.quickieData.steps.push({});
    }
    $scope.quickieData.questionsAnswered = 0;
    $scope.quickieData.leftQuetions = $scope.quickieData.questionLength;
  };

});

appinioController.controller('QuickieDetailsCtrl', function ($scope, Survey, $rootScope, $ionicActionSheet, $ionicPopup, Tutorial, $ionicModal, $timeout, User) {

  $ionicModal.fromTemplateUrl('main/templates/menu-main/quickies/tutorial-modal.html', {
    scope: $scope,
    animation: 'jelly'
  }).then(function (modal) {
    $scope.tutorialModal = modal;
  });
  $scope.openTutorialModal = function (type) {
    $timeout(function(){
      $scope.helpType = type;
      $scope.tutorialModal.show();
    }, 1000);
  };
  $scope.closeTutorialModal = function () {
    $scope.tutorialModal.hide();
  };

  $scope.openTutorialPopup = function(){
    if(!$scope.currentQuickie || !$scope.currentQuickie.questions[0].qtype){
      return;
    }
    switch($scope.currentQuickie.questions[0].qtype){
      case 'thumbslider':
        Tutorial.showLegendPopup('saw'+$scope.currentQuickie.questions[0].qtype, function(){
          $scope.openTutorialModal('thumbslider');
        });
        break;
      case 'starslider':
        Tutorial.showLegendPopup('saw'+$scope.currentQuickie.questions[0].qtype, function(){
          $scope.openTutorialModal('starslider');
        });
        break;
      case 'numericslider':
        Tutorial.showLegendPopup('saw'+$scope.currentQuickie.questions[0].qtype, function(){
          $scope.openTutorialModal('numericslider');
        });
        break;
    }
  };

  $scope.isQuickie = true;

});

appinioController.controller('SurveyDetailsCtrl', function ($scope, Survey, User, $ionicPopup, $rootScope, $cordovaDevice, Tracker, $ionicLoading, PushNotification) {

  $scope.$on('reload:surveys', function(){
    $scope.getCompanySurveys();
  });

  $scope.resendMail = function(){
    Tracker.trackEvent('resendMail');
    User.resendVerifyLink(function(){
      $ionicPopup.alert({
        templateUrl: 'main/templates/popups/mailsend-popup.html'
      });
    });
  };

  $scope.chooseSurvey = true;

  $scope.getCompanySurveys = function () {
    Survey.getCompanySurveys(function (response) {
      $rootScope.companySurveysError = false;
      $rootScope.availableSurvey = response.length;
      $scope.companySurveys = response;
      if($scope.companySurveys.length == 0){
        try{
          PushNotification.start($rootScope.loggedInUser, 'sawPushPermissionSurvey');
        }catch(err){}
      }

    }, function(){
      $scope.companySurveys = [];
      $rootScope.companySurveysError = true;
    });
  };

  $scope.getCompanySurveys();

  $scope.isQuickie = false;

  $scope.closeStartSurvey = function () {
    Tracker.trackEvent('closeSurveys');
    $scope.getCompanySurveys();
    $scope.currentSurvey = null;
    $scope.surveyStartModal.hide();
    $scope.chooseSurvey = true;
  };

  $scope.startSurvey = function (id) {
    $ionicLoading.show({
      template: '<div class="white-spinner"><ion-spinner icon="dots"></ion-spinner></div>'
    });
    $scope.currentSurvey = null;
    Survey.getCompanySurveyDetails(id, function (data) {
      Tracker.trackEvent('startSurvey');
      $scope.chooseSurvey = false;
      $ionicLoading.hide();
      $scope.initSurvey(data);
    }, function(){
      $ionicPopup.alert({
        templateUrl: 'main/templates/popups/survey-load-error-popup.html'
      });
      $ionicLoading.hide();
      $scope.getCompanySurveys();
    });
  };

  $scope.initSurvey = function(survey){
    $scope.currentSurvey = survey;
    $scope.currentSurvey.questionLength = $scope.currentSurvey.questions.length;
    $scope.currentSurvey.steps = [];
    for(var i = 0;i < $scope.currentSurvey.questionLength;i++){
      $scope.currentSurvey.steps.push({});
    }
    $scope.currentSurvey.minTime = $scope.calcMinTime($scope.currentSurvey.questions);
    $scope.currentSurvey.startTime = new Date();
    $scope.responses = [];
  };

  $scope.voteForCharity = function(charity){
    Tracker.trackEvent('voteCharity');
    Survey.voteForCharity($scope.currentSurvey._id, charity._id, function(res){
      charity.votes++;
      $scope.currentSurvey.allVotes++;
      $scope.currentSurvey.hasVoted = true;
    });
  };

  $scope.finishSurvey = function(){
    var timeDiff = Math.floor((Date.now() - $scope.currentSurvey.startTime)/1000);
    if(timeDiff < $scope.currentSurvey.minTime){
      User.responseTooFast();
      Tracker.trackEvent('tooFastSurvey');
      var timePopup = $ionicPopup.alert({
        templateUrl: 'main/templates/popups/fast-response-popup.html'
      });
      timePopup.then(function(){
        $scope.startSurvey($scope.currentSurvey._id);
      });
      return;
    }
    var uuid = '';
    if($cordovaDevice && $cordovaDevice.getDevice()) uuid = $cordovaDevice.getUUID();
    var appVersion = '0.0.0';
    if($scope.versionNum != null) {
      appVersion = $scope.versionNum;
    }
    var postData = {
      surveyId : $scope.currentSurvey._id,
      responses : $scope.responses,
      uuid : uuid,
      seconds: timeDiff,
      appstoreVersion: appVersion
    };
    Tracker.trackEvent('finishSurvey');
    //return;
    Survey.createResponseForSurvey(postData);
  };

  $scope.calcMinTime = function(questions){
    var minTime = 0;
    _.each(questions, function(e){
      minTime+=250+(e.text.split(' ').length*200);
      if(e.qtype=='vstext' || e.qtype=='mc' || e.qtype=='vsimage' || e.qtype=='image' || e.qtype=='ranking'){
        _.each(e.answers, function(e2){
          minTime+=(e2.text.split(' ').length*200);
        });
      }else minTime+=500;
      if(e.qtype=='freetext') minTime+=500;
      if(e.qtype=='ranking') minTime+=1000;
    });
    minTime = minTime/1000;
    return minTime;
  };

  $scope.nextQuestion = function () {
    var response = JSON.parse(JSON.stringify($scope.currentSurvey.questions[0].response));
    response.questionId = $scope.currentSurvey.questions[0]._id;
    $scope.responses.push(response);
    $scope.currentSurvey.questions.splice(0, 1);
    if($scope.currentSurvey.questions.length < 1){
      $scope.finishSurvey();
    }
  };

});
