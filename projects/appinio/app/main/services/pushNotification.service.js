appinioService.factory('PushNotification', function ($http, $rootScope, $cordovaPush, $ionicPopup, User, Tutorial, $state, Feed, Tracker) {
  return {
    chooseStart:function(user, skip){
      if(ionic.Platform.isIOS() && !skip){
        this.start(user);
      }else{
        this.instantStart();
      }
    },
    instantStart: function(){
      var iosConfig = {
        "badge": true,
        "sound": true,
        "alert": true
      };
      var androidConfig = {
        "senderID": "69232627546"
      };
      var isIOS = ionic.Platform.isIOS();
      var config;
      if (isIOS == true){
        config = iosConfig;
      }else{
        config = androidConfig;
      }
      $cordovaPush.register(config).then(function (deviceToken) {
        User.updateDeviceToken(deviceToken);
      }, function (err) {
      });
    },
    start: function (user, tag) {
      if(user && user.device && user.device.deviceToken && user.device.deviceToken.length > 2){
       //return;
      }
      for(var k in user.pushPermission){
        if(user.pushPermission[k] == true){
          return;
        }
      }
      Tutorial.showLegendPopup(tag, function(){
        var iosConfig = {
          "badge": true,
          "sound": true,
          "alert": true
        };
        var androidConfig = {
          "senderID": "69232627546"
        };
        var isIOS = ionic.Platform.isIOS();
        var config;
        if (isIOS == true){
          config = iosConfig;
        }else{
          config = androidConfig;
        }
        var confirmPopup = $ionicPopup.confirm({
          templateUrl: 'main/templates/popups/push-popup.html',
          cssClass:'two-buttons',
          buttons: [
            { text: 'Nein' },
            {
              text: 'Ja',
              onTap: function(e) {
                return true;
              }
            }
          ]
        });
        confirmPopup.then(function (res) {
          if (res) {
            Tracker.trackEvent('acceptedPush', {type: tag});
            $cordovaPush.register(config).then(function (deviceToken) {
              User.updateDeviceToken(deviceToken);
              User.activateAllPermissions();
            }, function (err) {
              // error case
            });
          }else{
            Tracker.trackEvent('declinedPush', {type: tag});
          }
        });

      });
    },
    stop: function () {
      $cordovaPush.unregister().then(function (result) {
        // Success!
      }, function (err) {
        // Error
      });
    },
    registerListener: function(){
      $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
        var isIOS = ionic.Platform.isIOS();
        if(isIOS){
          if($rootScope.userList.isShown()){
            $rootScope.$broadcast('load:friends', true);
          }
          if ($state.current.name === 'tabMenuMain.answer') {
            $rootScope.$broadcast('load:ownQuestions', true);
          }
          Feed.reloadFeed();

          if (notification.sound) {
            var snd = new Media(event.sound);
            snd.play();
          }
        }else {
          switch(notification.event) {
            case 'registered':
              if (notification.regid.length > 0 ) {
                User.updateDeviceToken(notification.regid);
                User.activateAllPermissions();
              }
              break;
            case 'message':
              if($rootScope.userList.isShown()){
                $rootScope.$broadcast('load:friends', true);
              }
              if ($state.current.name === 'tabMenuMain.answer') {
                $rootScope.$broadcast('load:ownQuestions', true);
              }
              Feed.reloadFeed();

              break;
            case 'error':
              //alert('GCM error = ' + notification.msg);
              break;
            default:
              //alert('An unknown GCM event has occurred');
              break;
          }
        }
      });
    }
  };
});
