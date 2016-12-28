appinioController.controller('AnswerCtrl', function ($scope, $ionicModal, Survey, $timeout, $ionicSlideBoxDelegate, $filter, $state, $stateParams, $rootScope, $ionicPopup) {

  $scope.$on('$stateChangeSuccess', function (event, toState, toParams) {
    if(toState.name == 'tabMenuMain.answer'){
      $scope.checkForUpdates(toParams.surveyId);
    }
  });

  $scope.$on('load:ownQuestions', function(){
    $scope.checkForUpdates();
  });

  $scope.slideHasChanged = function(index){
    $scope.currentIndex = index+1;
  };

  $ionicModal.fromTemplateUrl('main/templates/menu-main/answers/results-details.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.resultDetailModal = modal;
  });
  $scope.openResultModal = function (data) {
    if(data.forFriends && data.userCounter == 0){
      $ionicPopup.alert({
        templateUrl:'main/templates/popups/no-answers-popup.html'
      });
      return;
    }else if(data.forCommunity){
      $ionicPopup.alert({
        templateUrl:'main/templates/popups/community-answers-popup.html'
      });
      return;
    }
    $scope.detailSurvey = data;
    $scope.detailQuestion = data.questions[0];
    if($scope.detailQuestion.qtype == 'mc' || $scope.detailQuestion.qtype == 'vstext' || $scope.detailQuestion.qtype == 'vsimage'){
      _.each($scope.detailQuestion.answers, function(e){
        e.rep = [];
        e.users = [];
        _.each($scope.detailSurvey.responseSet, function(e2){
          if(e2.responses[0].answer[0] == e._id){
            e.rep.push(e2);
            e.users.push(e2.userId);
          }
        });
      });
/*      _.each($scope.detailSurvey.responseSet, function(e){
        e.answerDetails = _.findWhere($scope.detailQuestion.answers, {_id: e.responses[0].answer[0]});
        e.answerDetails.index = _.indexOf($scope.detailQuestion.answers, e.answerDetails);
      });*/
    }else{
      $scope.detailQuestion.stars = [
        {value:1},
        {value:2},
        {value:3},
        {value:4},
        {value:5}
      ];
      _.each($scope.detailQuestion.stars, function(e){
        e.rep = [];
        e.users = [];
        _.each($scope.detailSurvey.responseSet, function(e2){
          console.log(e2);
          if(e2.responses[0].value == e.value){
            e.rep.push(e2);
            e.users.push(e2.userId);
          }
        });
      });
    }
    $scope.resultDetailModal.show();
  };
  $scope.closeResultModal = function () {
    $scope.resultDetailModal.hide();
  };

/*
  $ionicModal.fromTemplateUrl('main/templates/menu-main/answers/results-modal.html', {
    scope: $scope,
    animation: 'jelly'
  }).then(function (modal) {
    $scope.resultDetailsModal = modal;
  });

  $scope.openAnswerDetails = function (id) {
    $scope.survey = null;
    $scope.question = null;
    $scope.resultDetailsModal.show();
    $scope.getSlider(true);
    Survey.getOwnSurveyDetails(id, function (data) {
      // TODO: ...
      console.log(data);
      $scope.survey = data;
      $scope.question = $scope.survey.questions[0];
      if($scope.question.qtype == 'mc' || $scope.question.qtype == 'vstext' || $scope.question.qtype == 'vsimage'){
        _.each($scope.survey.responses, function(e){
          e.answerDetails = _.findWhere($scope.question.answers, {_id: e.responses[0].answer[0]});
          e.answerDetails.index = _.indexOf($scope.question.answers,e.answerDetails);
        });
      }
    });
  };
*/

  $scope.checkForUpdates = function(id){
    if($scope.ownSurveys != null){
      Survey.getOwnSurveyUpdates(function(data){
        if($scope.ownSurveys.length != data.length){
          $scope.updateAllSurveys(id);
        }else{
          for(var i = 0;i < data.length; i++){
            var find = _.findWhere($scope.ownSurveys, {_id:data[i]._id, userCounter:data[i].userCounter});
            if(!find){
              $scope.updateAllSurveys(id);
              break;
            }
          }
        }
      });
    }
  };

  $scope.updateAllSurveys = function (id) {
    Survey.getOwnSurveys(function (response) {
      _.each(response, function(e){
        var find = _.findWhere($scope.ownSurveys, {_id: e._id});
        if(find && find.userCounter != e.userCounter){
          find.userCounter = e.userCounter;
          find.questions[0].userCounter = e.userCounter;
          find.questions[0].sumvalues = e.questions[0].sumvalues;
          find.questions[0].answers = e.questions[0].answers;
          find.responseSet = e.responseSet;
          $rootScope.$broadcast(find._id + ':reload', true);
        }else if(find == null){
          $scope.surveysLoaded = false;
          e.enddateTime = ((new Date(e.enddate)).getTime() - (new Date()).getTime()) / 1000;
          e.questions[0].userCounter = e.userCounter;
          $scope.ownSurveys.push(e);
          $ionicSlideBoxDelegate.update();
          $timeout(function(){
            $scope.surveysLoaded = true;
          }, 100);
        }
      });
      if(id){
        $timeout(function(){
          $scope.slideToSurvey(id);
        }, 1);
      }
    });
  };

  $scope.getUserOwnSurveys = function (id) {
    $scope.surveysLoaded = false;
    Survey.getOwnSurveys(function (response) {
      $scope.ownSurveys = response;
      _.each(response, function(e){
        e.questions[0].userCounter = e.userCounter;
        e.enddateTime = ((new Date(e.enddate)).getTime() - (new Date()).getTime()) / 1000;
      });
      $ionicSlideBoxDelegate.update();
      if(id){
        $timeout(function(){
          $scope.slideToSurvey(id);
        }, 1);
      }
      $timeout(function(){
        $scope.surveysLoaded = true;
      }, 100);
    });
  };

  $scope.getUserOwnSurveys($stateParams.surveyId);

  $scope.slideToSurvey = function(surveyId){
    var orderedSurveys = $filter('orderBy')($scope.ownSurveys, '-date');
    for(var i = 0; i < orderedSurveys.length;i++){
      if(orderedSurveys[i]._id === surveyId){
        $ionicSlideBoxDelegate.$getByHandle('resultlist').slide(i, 1);
        break;
      }
    }
  };

});
