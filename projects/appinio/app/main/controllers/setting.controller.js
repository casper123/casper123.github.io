appinioController.controller('SettingCtrl', function($scope, $ionicSlideBoxDelegate, $ionicBackdrop, $cordovaCamera, $state, $rootScope, $ionicModal, User,currentUser, appinioConfig, $ionicPopup, ImagePicker, Tracker){

  currentUser.getUser(function(user){
    $scope.user = {};
    $scope.user = $rootScope.loggedInUser;
  });

  $scope.closeCurrentPopup = function(){
    $scope.currentPopup.close();
  };

  $scope.changeNicknamePopup = function(){
    $scope.data = {};
    $scope.currentPopup = $ionicPopup.show({
      templateUrl:'main/templates/popups/change-name-popup.html',
      scope: $scope,
      cssClass:'two-buttons',
      buttons: [
        {
          text: 'Speichern',
          onTap: function(e) {
            if (!$scope.data.nickname || $scope.data.nickname.length > 15) {
              e.preventDefault();
            } else {
              return $scope.data.nickname;
            }
          }
        }
      ]
    });
    $scope.currentPopup.then(function(data){
      if(!data) return;
      $scope.changeNickname(data);
    })
  };

  $scope.changeUniqueNamePopup = function(){
    $scope.data = {};
    $scope.currentPopup = $ionicPopup.show({
      templateUrl:'main/templates/popups/change-uniquename-popup.html',
      scope: $scope,
      cssClass:'two-buttons',
      buttons: [
        {
          text: 'Speichern',
          onTap: function(e) {
            if (!$scope.data.name || $scope.data.name.length>15) {
              e.preventDefault();
            } else {
              return $scope.data.name;
            }
          }
        }
      ]
    });
    $scope.currentPopup.then(function(data){
      if(!data) return;
      $scope.changeUniqueName(data);
    })
  };

  $scope.changeEmailPopup = function(){
    $scope.data = {};
    $scope.currentPopup = $ionicPopup.show({
      templateUrl:'main/templates/popups/change-email-popup.html',
      scope: $scope,
      cssClass:'two-buttons',
      buttons: [
        {
          text: 'Speichern',
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
    $scope.currentPopup.then(function(data){
      if(!data) return;
      $scope.changeEmail(data);
    })
  };

  $scope.changePasswordPopup = function(){
    $scope.data = {};
    $scope.currentPopup = $ionicPopup.show({
      templateUrl:'main/templates/popups/change-password-popup.html',
      scope: $scope,
      cssClass:'two-buttons',
      buttons: [
        {
          text: 'Speichern',
          onTap: function(e) {
            if (!$scope.data.password) {
              e.preventDefault();
            } else {
              return $scope.data.password;
            }
          }
        }
      ]
    });
    $scope.currentPopup.then(function(data){
      if(!data) return;
      $scope.changePassword(data);
    })
  };

  $scope.changeZipcodePopup = function(){
    $scope.data = {};
    $scope.currentPopup = $ionicPopup.show({
      templateUrl:'main/templates/popups/change-zip-popup.html',
      scope: $scope,
      cssClass:'two-buttons',
      buttons: [
        {
          text: 'Speichern',
          onTap: function(e) {
            if (!$scope.data.zipcode) {
              e.preventDefault();
            } else {
              return $scope.data.zipcode;
            }
          }
        }
      ]
    });
    $scope.currentPopup.then(function(data){
      if(!data) return;
      $scope.changeZipcode(data);
    })
  };

  $scope.changeNickname = function(nickname){
    if(nickname && nickname.length > 0){
      User.updateNickname(nickname, function(response) {
        console.log(response);
      }, function(){
        $scope.showErrorPopup();
      });
    }
  };

  $scope.changeUniqueName = function(name){
    if(name && name.length > 0){
      User.updateUniqueName(name, function(response) {
        Tracker.trackEvent('changeUniqueName');
      }, function(){
        $ionicPopup.alert({
          scope: $scope,
          okText: 'Schade',
          templateUrl:'main/templates/popups/uniquename-error-popup.html'
        });
      });
    }
  };

  $scope.changeEmail = function(email){
    if(email && email.length > 0){
      User.updateEmail(email, function(response) {
        Tracker.trackEvent('changeEmail');
      }, function(){
        $scope.showErrorPopup();
      });
    }
  };

  $scope.changePassword = function(password){
    if(password && password.length > 0){
      User.updatePassword(password, function(response) {
        $ionicPopup.alert({
          templateUrl:'main/templates/popups/password-complete-popup.html'
        });
        Tracker.trackEvent('changePassword');
      }, function(){
        $scope.showErrorPopup();
      });
    }
  };

  $scope.changeZipcode = function(zipcode){
    if(zipcode && zipcode.length > 0){
      User.updateZipcode(zipcode, function(response) {
        Tracker.trackEvent('changeZipcode');
      }, function(){
        $scope.showErrorPopup();
      });
    }
  };

  $scope.showErrorPopup = function(){
    $ionicPopup.alert({
      scope: $scope,
      okText: 'Schade',
      templateUrl:'main/templates/popups/error-popup.html'
    });
  };

	$scope.closeModal = function() {
		$scope.modal.hide();
	};

  $scope.updatePhoto = function() {
    ImagePicker.pickImage(function(data){
      User.updateAvatar(data, function() {
        Tracker.trackEvent('changeAvatar');
      });
    }, function(){
      $scope.showErrorPopup();
    });
  };

  $scope.colorChangeHistory = '';
  $scope.checkSecret = function(color){
    if(color == 'green'){
      $scope.colorChangeHistory += '1';
    }else if(color == 'blue'){
      $scope.colorChangeHistory += '2';
    }else if(color == 'red'){
      $scope.colorChangeHistory += '3';
    }
    if($scope.colorChangeHistory.length>5){
      $scope.colorChangeHistory = $scope.colorChangeHistory.substr($scope.colorChangeHistory.length-5, 5);
    }
    if($scope.colorChangeHistory.length > 4){
      var hash = CryptoJS.SHA256($scope.colorChangeHistory);
      User.checkEasteregg(hash.toString(CryptoJS.enc.Hex));
    }
  };

  $scope.saveTheme = function(color){
    $rootScope.colorTheme = color;
    $scope.checkSecret(color);
    User.updateColor(color, function(response) {
      Tracker.trackEvent('changeColor');
    }, function(){
      $scope.showErrorPopup();
    });
  }

});
