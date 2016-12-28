appinioController.controller('UserCtrl', function ($scope, $state, $cordovaFacebook, $rootScope, $ionicLoading, User, sha256, currentUser, $http, appinioConfig, $ionicModal, Survey, $timeout, $ionicPopup, $cordovaGlobalization, $ionicPlatform, $cordovaInAppBrowser, Badges) {
    $scope.fbUser = null;
    console.log('okey');
          

    $scope.openLinkAGB = function(){
      $cordovaInAppBrowser.open(appinioConfig.agbUrl, '_blank', {location:'no'});
    };
    $scope.openLinkPrivacy = function(){
      $cordovaInAppBrowser.open(appinioConfig.privacyUrl, '_blank', {location:'no'});
    };

    $http.get(appinioConfig.baseUrl + 'user/loggedin', { ignoreAuthModule: true }).success(function(){
      //$scope.loggedinLoading = false;
      User.details(function(){});
      $state.go('tabMenuMain.quickies');
      $scope.loggedinLoading = false;
    }).error(function(){
      $scope.loggedinLoading = false;
    });

    // TODO: why is ready never called??
    $ionicPlatform.ready(function () {
      return;
      $scope.loggedinLoading = true;
      $http.get(appinioConfig.baseUrl + 'user/loggedin', { ignoreAuthModule: true }).success(function(){
        $scope.loggedinLoading = false;
        User.details(function(){});
        $state.go('tabMenuMain.quickies');
      }).error(function(){
        $scope.loggedinLoading = false;
      });
    });

    if ($rootScope.loggedInUser != undefined && $rootScope.loggedInUser.token != undefined) {
      $rootScope.colorTheme = $rootScope.loggedInUser.color;
      $rootScope.inGame = true;
      $state.go('tabMenuMain.quickies');
    }

    $scope.slideHasChanged = function (index) {
      $scope.currentsliderIndex = index;
    };

    $scope.signup = true;
    $scope.slider = false;
    $scope.startTutorial = function(){
      $scope.signup = true;
      $scope.slider = false;
      $state.go('user.quickies');
    };

    $scope.finishTutorial = function () {
      $scope.closeQuestionModal();
      $scope.signup = false;
      $scope.slider = true;
    };

    $scope.doLogin = function (user) {
      $ionicLoading.show({
        template: '<div class="white-spinner"><ion-spinner icon="dots"></ion-spinner></div>'
      });

      $scope.loginError = false;
      $scope.loginErrorLocked = false;
      $scope.loginErrorVersion = false;

      if (user.email && user.password) {
        user.appVersion = 20;
        User.login(user, function (response) {
          $scope.loginSuccess(response);
        }, function(data){
          $ionicLoading.hide();
          if(data.error && data.error[0] && data.error[0].failedLoginLocked){
            $scope.loginErrorLocked = true;
          }else if(data.error && data.error[0] && data.error[0].versionError){
            $scope.loginErrorVersion = true;
          }else{
            $scope.loginError = true;
          }
          $timeout(function(){
            $scope.loginErrorLocked = false;
            $scope.loginError = false;
            $scope.loginErrorVersion = false;
          }, 4000);
        });
      }else{
        $ionicLoading.hide();
      }
    };

    $scope.loadInitialQuestions = function(){
      $scope.surveyResponses = [];
      $scope.quickieResponses = [];
      Survey.getTutorialQuestions(function(data){
        $scope.quickieResponses = [];
        $scope.quickies = data;
        $scope.quickieData = {};
        $scope.currentQuickie = $scope.quickies;
        _.each(data, function(e){
          e.isQuickie = true;
        });
        $scope.currentQuickie.push({_id: 1, isQuickie:false, qtype: 'vstext', text: 'Ich bin...',
          answers: [
            {_id: 11, text: 'männlich', userCounter: 62},
            {_id: 12, text: 'weiblich', userCounter: 38}
          ]});
        $scope.currentQuickie.push({_id: 2, isQuickie:false, qtype: 'birthday', text: 'Wann bist Du geboren?'});
        $scope.currentQuickie.push({_id: 3, isQuickie:false, qtype: 'zipcode', text: 'Welche Postleitzahl hat Dein Wohnort?'});
        $scope.currentQuickie.push({_id: 4, isQuickie:false, qtype: 'vstext', text: 'Hat Dir ein Freund einen appinio Werbecode zugeschickt?',
          answers: [
            {_id: 11, text: 'Ja', userCounter: 27},
            {_id: 12, text: 'Nein', userCounter: 73}
          ]});

        $scope.quickieData.questionLength = $scope.quickies.length;
        $scope.quickieData.steps = [];
        for(var i = 0;i < $scope.quickieData.questionLength;i++){
          $scope.quickieData.steps.push({});
        }
        $scope.quickieData.questionsAnswered = 0;
        $scope.tutorialCounter = 0;
      });
    };

    $scope.loadInitialQuestions();

    $scope.nextQuestion = function(){
      if($scope.currentQuickie[0].isQuickie && $scope.currentQuickie[0].valid){
        $scope.quickieResponses.push({questionId:$scope.currentQuickie[0]._id, response:$scope.currentQuickie[0].response});
      }else if(!$scope.isQuickie){
        $scope.surveyResponses.push({questionId:$scope.currentQuickie[0]._id, response:$scope.currentQuickie[0].response});
      }
      $scope.currentQuickie.splice(0, 1);
      $scope.quickieData.questionsAnswered++;
      if($scope.currentQuickie.length == 0 && !$scope.isQuickie){
        $state.go('user.registernew');
        var findRefed = _.findWhere($scope.surveyResponses, {questionId:4});
        $scope.isRefed = (findRefed && findRefed.response.answers[0] == 11);
      }
    };

    $scope.setUserRegisterProperty = function(){
      var user = {};
      var findGender = _.findWhere($scope.surveyResponses, {questionId:1});
      if(findGender && findGender.response.answers[0] == 11){
        user.gender = 'm';
      }else{
        user.gender = 'f';
      }
      var findBirthday = _.findWhere($scope.surveyResponses, {questionId:2});
      if(findBirthday){
        user.birthday = findBirthday.response.value;
      }
      var findZip = _.findWhere($scope.surveyResponses, {questionId:3});
      if(findZip){
        user.zipcode = findZip.response.freetext;
      }
      return user;
    };

/*
    $scope.startSurvey = function(){
      $scope.isQuickie = false;
      $scope.surveyResponses = [];
      $scope.currentQuickie = [
        {_id: 1, qtype: 'vstext', text: 'Ich bin...',
          answers: [
            {_id: 11, text: 'männlich', userCounter: 5},
            {_id: 12, text: 'weiblich', userCounter: 2}
          ]},
        {_id: 2, qtype: 'birthday', text: 'Wann bist Du geboren?'},
        {_id: 3, qtype: 'zipcode', text: 'Welche Postleitzahl hat Dein Wohnort?'},
        {_id: 4, qtype: 'vstext', text: 'Hat Dir ein Freund einen appinio Werbecode zugeschickt?',
          answers: [
            {_id: 11, text: 'Ja', userCounter: 5},
            {_id: 12, text: 'Nein', userCounter: 2}
          ]}
      ];
      $scope.quickieData.questionLength = $scope.currentQuickie.length;
      $scope.quickieData.steps = [];
      for(var i = 0;i < $scope.quickieData.questionLength;i++){
        $scope.quickieData.steps.push({});
      }
      $scope.quickieData.questionsAnswered = 0;
      $scope.tutorialCounter = 1;
    };
*/

    $scope.startFacebookLogin = function () {
      $ionicLoading.show({
        template: '<div class="white-spinner"><ion-spinner icon="dots"></ion-spinner></div>'
      });
      $cordovaFacebook.getLoginStatus()
        .then(function (success) {
          if (success.status !== 'unknown' && success.authResponse && success.authResponse.accessToken) {
            $scope.loginViaFacebook(success.authResponse.accessToken);
          } else {
            $scope.facebookLoginPopup();
            $ionicLoading.hide();
          }
        }, function () {
          $scope.facebookLoginPopup();
          $ionicLoading.hide();
        });
    };

    $scope.facebookLoginPopup = function () {
      $cordovaFacebook.login(["public_profile", "email", "user_friends", "user_birthday", "user_photos"]).then(function (reponse) {
          $cordovaFacebook.getAccessToken().then(function (success) {
            $scope.loginViaFacebook(success);
          }, function (error) {
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

    $scope.setFacebookValues = function(data){
      $scope.fbUser = data;
      $scope.fbUser.values = {};
      if($scope.fbUser.gender == 'male'){
        $scope.fbUser.values.gender = 'Männlich';
      }else{
        $scope.fbUser.values.gender = 'Weiblich';
      }
      if($scope.fbUser.birthday){
        var ageDate = new Date(Date.now() - new Date($scope.fbUser.birthday).getTime());
        var age =  Math.abs(ageDate.getUTCFullYear() - 1970);
        $scope.fbUser.values.birthday = age + ' Jahre';
      }else{
        var ageDate = new Date(Date.now() - new Date('1990-01').getTime());
        var age =  Math.abs(ageDate.getUTCFullYear() - 1970);
        $scope.fbUser.birthday = ageDate;
        $scope.fbUser.values.birthday = age + ' Jahre';
      }
    };

    $scope.loginViaFacebook = function(token){
      $ionicLoading.show({
        template: '<div class="white-spinner"><ion-spinner icon="dots"></ion-spinner></div>'
      });
      $http.post(appinioConfig.baseUrl + 'user/facebook/loginCheck', {access_token: token}).success(function (data) {
        if(data.success.token){
          User.confirmLogin(data.succes);
          $scope.loginSuccess(data);
        }else if(data.success.gender){
          $ionicLoading.hide();
          data.success.token = token;
          $scope.setFacebookValues(data.success);
          $state.go('user.facebook');
        }
      }).error(function(){
        $ionicLoading.hide();
        $ionicPopup.alert({
            templateUrl:'main/templates/popups/fb-email-popup.html'
        });
      });
    };

    $scope.loginSuccess = function(data){
      window.localStorage.setItem('token', data.success.token);
      User.details(function () {
        $ionicLoading.hide();
        Badges.getGameBadges();
        $state.go('tabMenuMain.quickies');
      });
    };

    $scope.checkNamesAndStart = function(names){
      if(names.uniqueName !== $rootScope.loggedInUser.uniqueName && $scope.uniqueNameValid){
        User.updateUniqueName(names.uniqueName, function(){
        });
      }
      if(names.nickname && names.nickname !== $rootScope.loggedInUser.nickname && names.nickname.length > 0){
        User.updateNickname(names.nickname, function(){
        });
      }
      $state.go('tabMenuMain.quickies');
    };

    $scope.checkUniqueName = function(name){
      if(name && name.length>2){
        $http.get(appinioConfig.baseUrl + 'user/uniqueName/' + name).success(function(data){
          $scope.uniqueNameValid = (data && data.success && data.success.uniqueName == true);
        }).error(function(){
          $scope.uniqueNameValid = false;
        });
      }
    };

    $scope.registerSuccess = function(data){
      window.localStorage.setItem('token', data.success.token);
      User.details(function (data){
        $ionicLoading.hide();
        $scope.uniqueNameValid = true;
        $scope.userNames = {
          uniqueName: data.success.uniqueName,
          nickname: ''
        };
        $state.go('user.name');
      });
    };

    $scope.initRegisterError = function(){
      $scope.registerError = false;
      $scope.uuidError = false;
      $scope.emailError = false;
      $scope.otherError = false;
    };

    $scope.setRegisterError = function(data){
      $ionicLoading.hide();
      if (data.error) {
        $scope.registerError = true;
        $timeout($scope.initRegisterError, 4000);
        if (data.error[0].email) {
          $scope.emailError = true;
        } else if (data.error[0].uuid) {
          $scope.uuidError = true;
        } else {
          $scope.otherError = true;
        }
      }
    };
    $scope.checkZip = function(zip){
      if(!zip || zip.length<5){
        if($scope.zipValid){
          $scope.zipValid = false;
        }
        return;
      }
      $http.get(appinioConfig.baseUrl + 'user/zip/' + zip).success(function(data){
        $scope.zipValid = (data && data.success && data.success.zip == true);
      }).error(function(){
        $scope.zipValid = false;
      });
    };

    $scope.resetPassword = function(){
      $scope.data = {};
      $scope.resetPopup = $ionicPopup.show({
        templateUrl:'main/templates/popups/forgot-pw-popup.html',
        scope: $scope,
        buttons: [
          {
            text: 'Anfordern',
            onTap: function(e) {
              if (!$scope.data.email) {
                e.preventDefault();
              } else {
                return $scope.data.email;
              }
            }
          }
        ]
      });
      $scope.resetPopup.then(function(data){
        if(data){
          $http.post(appinioConfig.baseUrl + 'user/resetPassword/', {email: data}).success(function (data) {

          }).error(function(data){

          });
        }
      })
    };
    $scope.closeResetPopup = function(){
      $scope.resetPopup.close();
    };

    $scope.doFBRegister = function () {
      $scope.initRegisterError();
      var user = {};
      user.access_token = $scope.fbUser.token;
      user.birthday = $scope.fbUser.birthday;
      user.zipcode = $scope.fbUser.zipcode;
      if ($scope.fbUser.gender == 'male') {
        user.gender = 'm';
      } else if ($scope.fbUser.gender == 'female') {
        user.gender = 'f';
      }

      $ionicLoading.show({
        template: '<div class="white-spinner"><ion-spinner icon="dots"></ion-spinner></div>'
      });

      User.fbRegister(user, function (response) {
        $scope.registerSuccess(response);
      }, function (data) {
        $scope.setRegisterError(data);
      });
    };

    $scope.doRegister = function (user){
      $scope.initRegisterError();
      if (user.email && user.password) {
        var userData = $scope.setUserRegisterProperty();
        user.gender = userData.gender;
        user.zipcode = userData.zipcode;
        user.birthday = userData.birthday;

        $ionicLoading.show({
          template: '<div class="white-spinner"><ion-spinner icon="dots"></ion-spinner></div>'
        });

        User.register(user, function (response) {
          $scope.registerSuccess(response);
        }, function (data) {
          $scope.setRegisterError(data);
        });
      }
    };

  });

