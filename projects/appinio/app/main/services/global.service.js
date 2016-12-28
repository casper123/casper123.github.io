appinioService
.service('Global', 
    function (
      $http, 
      $rootScope, 
      $ionicModal, 
      $ionicHistory, 
      $state, 
      $cordovaAppVersion, 
      $cordovaSplashscreen, 
      $timeout, 
      $ionicLoading, 
      $ionicScrollDelegate,
      Feed, 
      LevelService, 
      Badges, 
      User, 
      currentUser, 
      appinioConfig, 
      Tracker
      ) {

  return {
    setModals: function(){
      $ionicModal.fromTemplateUrl('main/templates/modals/me-modal.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $rootScope.meModal = modal;
      });
      $rootScope.openMeModal = function () {
        Badges.getGameBadges();
        $rootScope.setScreen('badges');
        $ionicScrollDelegate.freezeAllScrolls(false);
        $rootScope.meModal.show();
      };
      $rootScope.closeMeModal = function () {
        $rootScope.meModal.hide();
      };

      $ionicModal.fromTemplateUrl('main/templates/modals/profile-modal.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $rootScope.rankerProfileModal = modal;
      });
      $rootScope.closeProfileModal = function(){
        $rootScope.rankerProfileModal.hide();
      };
      $rootScope.openProfileModal = function(id){
        if($rootScope.loggedInUser && id == $rootScope.loggedInUser._id){
          return;
        }
        $rootScope.setScreen('otheruser');
        $ionicLoading.show({
          template: '<div class="white-spinner"><ion-spinner icon="dots"></ion-spinner></div>'
        });
        User.getUserProfile(id, function (response) {
          $rootScope.$broadcast('load:profile', response.success);
          $timeout(function(){
            $ionicLoading.hide();
            $rootScope.rankerProfileModal.show();
          }, 200);
        });
      };

      $ionicModal.fromTemplateUrl('main/templates/dropdown/links-list.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $rootScope.linksList = modal;
      });
      $rootScope.openLinksList = function () {
        $rootScope.setScreen('links');
        $rootScope.linksList.show();
      };
      $rootScope.closeLinksList = function () {
        $rootScope.linksList.hide();
      };

      $ionicModal.fromTemplateUrl('main/templates/dropdown/charity-list.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $rootScope.charityList = modal;
      });
      $rootScope.openCharityList = function () {
        $rootScope.setScreen('charity');
        $rootScope.charityList.show();
      };
      $rootScope.closeCharityList = function () {
        if($rootScope.backButtonDeregister){
          $rootScope.backButtonDeregister();
        }
        $rootScope.charityList.hide();
      };

      $ionicModal.fromTemplateUrl('main/templates/dropdown/notification-list.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $rootScope.notificationList = modal;
      });
      $rootScope.openNotificationList = function () {
        $rootScope.setScreen('notifications');
        $rootScope.notificationList.show();
      };
      $rootScope.closeNotificationList = function () {
        $rootScope.notificationList.hide();
      };

      $ionicModal.fromTemplateUrl('main/templates/dropdown/settings-modal.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $rootScope.settingsModal = modal;
      });
      $rootScope.openSettingsModal = function () {
        $rootScope.setScreen('settings');
        $rootScope.settingsModal.show();
      };
      $rootScope.closeSettingsModal = function () {
        $rootScope.settingsModal.hide();
      };

      $ionicModal.fromTemplateUrl('main/templates/modals/create-question.html', {
        scope: $rootScope,
        focusFirstInput:false,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $rootScope.createQuestionModal = modal;
      });
      $rootScope.openCreateQuestionModal = function (data) {
        $rootScope.setScreen('createquestion');
        $rootScope.$broadcast('load:newQuestion', data);
        $rootScope.createQuestionModal.show();
      };
      $rootScope.closeCreateQuestionModal = function () {
        if($rootScope.backButtonDeregister){
          $rootScope.backButtonDeregister();
        }
        $rootScope.createQuestionModal.hide();
      };

      $ionicModal.fromTemplateUrl('main/templates/modals/friend-list.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $rootScope.userList = modal;
      });
      $rootScope.openFriendList = function () {
        $rootScope.$broadcast('load:friends', true);
        $rootScope.setScreen('friends');
        $ionicScrollDelegate.freezeAllScrolls(false);
        $rootScope.userList.show();
      };
      $rootScope.closeFriendList = function () {
        $rootScope.userList.hide();
      };

      $ionicModal.fromTemplateUrl('main/templates/modals/migrate.html', {
        scope: $rootScope,
        backdropClickToClose:false,
        hardwareBackButtonClose:false,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $rootScope.migrateModal = modal;
      });
      $rootScope.openMigrateModal = function () {
        $timeout(function(){
          $rootScope.migrateModal.show();
        }, 500);
      };
      $rootScope.closeMigrateModal = function () {
        $http.get(appinioConfig.baseUrl + 'user/xpmigrate').success(function(response){
          $rootScope.checkForUpdates(response.success);
          $rootScope.migrateModal.hide();
        });
      };
      $rootScope.$on('migrate', function () {
        $rootScope.openMigrateModal();
      });

      $ionicModal.fromTemplateUrl('main/templates/menu-main/dropdown-modal.html', {
        scope: $rootScope,
        animation: 'slide-in-down'
      }).then(function (modal) {
        $rootScope.downdown = modal;
      });
      $rootScope.openDropDown = function () {
        if($rootScope.logoutReinit){
          $rootScope.$broadcast('reload:vouchers', true);
          $rootScope.logoutReinit = false;
        }
        $ionicScrollDelegate.freezeAllScrolls(false);
        $rootScope.downdown.show();
      };
      $rootScope.closeDropDown = function () {
        $rootScope.downdown.hide();
      };

      $ionicModal.fromTemplateUrl('main/templates/dropdown/voucher-list.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $rootScope.voucherList = modal;
      });
      $rootScope.openVoucherList = function () {
        $rootScope.setScreen('voucher');
        $rootScope.voucherList.show();
      };
      $rootScope.closeVoucherList = function () {
        if($rootScope.backButtonDeregister){
          $rootScope.backButtonDeregister();
        }
        $rootScope.voucherList.hide();
      };

      $ionicModal.fromTemplateUrl('main/templates/modals/level-up.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $rootScope.levelUpModal = modal;
      });

      $rootScope.openLevelUpModal = function (level) {
        $http.get(appinioConfig.baseUrl + 'user/level/' + level).success(function (data) {
          $rootScope.newLevel = data.success;
        });
        $rootScope.showBadge = false;
        $rootScope.blockModal = true;
        $timeout(function(){
          $rootScope.levelUpModal.show();
        }, 100);
      };
      $rootScope.$on('badge:rewarded', function (e, data) {
        if(!$rootScope.levelUpModal.isShown() && !$rootScope.blockModal){
          $rootScope.newBadge = data;
          $rootScope.showBadge = true;
          $rootScope.blockModal = true;
          $timeout(function(){
            $rootScope.levelUpModal.show();
          }, 100);
        }
      });
      $rootScope.closeLevelUpModal = function () {
        $rootScope.blockModal = false;
        $rootScope.levelUpModal.hide();
      };

    },
    setGlobals: function () {

      $rootScope.headerDropdown = false;

      LevelService.init();
      Feed.initFeed();

      $rootScope.$on('app:resume', function () {
        Feed.reloadFeed();
      });

      $rootScope.userFeatures = LevelService.feature;

      $timeout(function(){
        try{
          $cordovaSplashscreen.hide();
        }catch(err){}
      }, 250);

      $rootScope.colorTheme = 'green';
      $rootScope.appVersion = 20;

      try {
        $cordovaAppVersion.getVersionNumber().then(function (version) {
          if(!version){
            $rootScope.appstoreVersion = '0.0.0';
          }else{
            $rootScope.appstoreVersion = version;
          }
        });
      } catch (err) {
        $rootScope.appstoreVersion = '0.0.0';
      }

      $rootScope.UTIL = {
        serialize: function (data) {
          if (!angular.isObject(data))
            return ( ( data == null ) ? "" : data.toString() );

          var buffer = [];
          for (var name in data) {
            if (!data.hasOwnProperty(name))
              continue;
            var value = data[name];
            buffer.push(encodeURIComponent(name) + "=" + encodeURIComponent(( value == null ) ? "" : value));
          }
          var source = buffer.join("&").replace(/%20/g, "+");
          return (source);
        }
      };

    }
  }
});
