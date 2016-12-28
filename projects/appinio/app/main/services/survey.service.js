appinioService.factory('Survey', function ($http, $rootScope, appinioConfig) {

  return {
    createResponseForSurvey: function(postData, callbackFunc){
      var responsePromise = $http.post(appinioConfig.baseUrl + 'user/survey/response', postData);
      responsePromise.success(function (data, status, headers, config) {
        if(data && callbackFunc){
          callbackFunc(data);
        }
      });
    },
    getTutorialQuestions: function (callbackFunc) {
      var responsePromise = $http.get(appinioConfig.baseUrl + 'frontpage');
      responsePromise.success(function (data, status, headers, config) {
        callbackFunc(data);
      });
    },
    getOwnSurveys: function (callbackFunc) {
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/survey/own');
      responsePromise.success(function (data, status, headers, config) {
        if(data.success){
          callbackFunc(data.success);
        }
      });
    },
    getOwnSurveyUpdates: function (callbackFunc) {
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/survey/own/tick');
      responsePromise.success(function (data, status, headers, config) {
        if(data.success) {
          callbackFunc(data.success);
        }
      });
    },
    getCompanySurveys: function (callbackFunc, callbackFuncFail) {
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/survey/company');
      responsePromise.success(function (data, status, headers, config) {
        if(data) {
          callbackFunc(data);
        }
      }).error(callbackFuncFail);
    },
    getCompanySurveyDetails: function (id, callbackFunc, callbackFuncErr) {
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/survey/company/' + id);
      responsePromise.success(function (data, status, headers, config) {
        if (data) {
          var survey = data;

          // Randomize Questions
          if(_.findWhere(data.questions, {random:true}) !== undefined){
            var toShuffle = [];
            var shuffledArray = [];
            for (var i = 0; i < data.questions.length; i++) {
              if (data.questions[i].random !== false) {
                shuffledArray.push(null);
                toShuffle.push(data.questions[i]);
              } else {
                shuffledArray.push(data.questions[i]);
              }
            }
            toShuffle = _.shuffle(toShuffle);
            for (var i = 0; i < shuffledArray.length; i++) {
              if (shuffledArray[i] === null) {
                shuffledArray[i] = toShuffle[0];
                toShuffle.splice(0, 1);
              }
            }
            data.questions = shuffledArray;
          }

          $http.get(appinioConfig.baseUrl + 'user/survey/charities/' + id).success(function(response){
            data.charities = response.success;
            data.allVotes = 0;
            _.each(data.charities, function(e){
              data.allVotes += e.votes;
            });
            callbackFunc(data);
          });
        }
      }).error(function(){
        if(callbackFuncErr){
          callbackFuncErr();
        }
      });
    },
    getQuickies: function (callbackFunc) {
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/quickies');
      responsePromise.success(function (data, status, headers, config) {
        if(data.success) {
          callbackFunc(data.success);
        }
      });
    },
    getNextQuickies: function (blacklist, callbackFunc, callbackFuncErr) {
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/nextQuickie/' + JSON.stringify(blacklist));
      responsePromise.success(function (data, status, headers, config) {
        if(data.success) {
          callbackFunc(data.success);
        }
      }).error(function(data){
        if(callbackFuncErr){
          callbackFuncErr(data.error[0]);
        }
      });
    },
    getFriendsQuickies: function (callbackFunc) {
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/friendsSurveys');
      responsePromise.success(function (data, status, headers, config) {
        if(data.success) {
          callbackFunc(data.success);
        }
      });
    },
    getQuiz: function (callbackFunc) {
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/quiz');
      responsePromise.success(function (data, status, headers, config) {
        if(data.success) {
          callbackFunc(data.success);
        }
      });
    },
    getQuizDetails: function (id, callbackFunc) {
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/quiz/' + id);
      responsePromise.success(function (data, status, headers, config) {
        if(data.success) {
          callbackFunc(data.success);
        }
      });
    },
    getQuickieDetails: function (id, callbackFunc) {
      var responsePromise = $http.get(appinioConfig.baseUrl + 'user/quickies/' + id);
      responsePromise.success(function (data, status, headers, config) {
        if(data) {
          callbackFunc(data);
        }
      });
    },
    skipQuestion: function(id, callbackFunc){
      var responsePromise = $http.post(appinioConfig.baseUrl + 'user/quickie/skip', {surveyId: id});
      responsePromise.success(function (data, status, headers, config) {
        if(data.success){
          callbackFunc(data.success);
        }
      });
    },
    skipQuiz: function(id, callbackFunc){
      var responsePromise = $http.post(appinioConfig.baseUrl + 'user/quiz/skip', {surveyId: id});
      responsePromise.success(function (data, status, headers, config) {
        if(data.success){
          callbackFunc(data.success);
        }
      });
    },
    answerQuiz: function(surveyId, answerId, gender, callbackFunc){
      var responsePromise = $http.post(appinioConfig.baseUrl + 'user/quiz', {surveyId: surveyId, answerId:answerId, gender: gender});
      responsePromise.success(function (data, status, headers, config) {
        if(data.success){
          callbackFunc(data.success);
        }
      });
    },
    upvoteQuestion: function(id, callbackFunc){
      var responsePromise = $http.post(appinioConfig.baseUrl + 'user/survey/upvote', {surveyId: id});
      responsePromise.success(function (data, status, headers, config) {
        if(data.success){
          callbackFunc(data.success);
        }
      });
    },
    downvoteQuestion: function(id, callbackFunc){
      var responsePromise = $http.post(appinioConfig.baseUrl + 'user/survey/downvote', {surveyId: id});
      responsePromise.success(function (data, status, headers, config) {
        if(data.success){
          callbackFunc(data.success);
        }
      });
    },
    reportQuestion: function(id, callbackFunc){
      var responsePromise = $http.post(appinioConfig.baseUrl + 'user/survey/report', {surveyId: id});
      responsePromise.success(function (data, status, headers, config) {
        if(data.success){
          callbackFunc(data.success);
        }
      });
    },
    voteForCharity: function(surveyId, charityId, callbackFunc){
      var postData = {
        surveyId: surveyId,
        charityId: charityId
      };
      var responsePromise = $http.post(appinioConfig.baseUrl + 'user/survey/charity', postData);
      responsePromise.success(function (data, status, headers, config) {
        if(data.success){
          callbackFunc(data.success);
        }
      });
    },
    createQuestion: function (postData, callbackFunc, callbackFuncErr) {
      $http({
        method: 'POST',
        url: appinioConfig.baseUrl + 'user/survey',
        data: postData
      })
        .success(function (data) {
          if(data.success) {
            $rootScope.checkForUpdates(data.success);
            callbackFunc(data.success);
          }
        })
        .error(function (data) {
          if(callbackFuncErr){
            callbackFuncErr(data);
          }
        });
    }
  }
});
