appinioService.factory('Rating', function ($ionicPopup, $rootScope, $timeout, $cordovaInAppBrowser, Tracker) {
  return {
    rateApp: function () {
      var rating = 0;
      $rootScope.rating = 0;
      $rootScope.stepTwo = false;
      $rootScope.setRating = function(value){
        Tracker.trackEvent('rateAppStars', {stars: value});
        $rootScope.rating = value;
        rating = value;
        $timeout(function(){
          $rootScope.currentPopup.close();
          if(rating != 5){
            startFeedbackPopup();
          }else{
            startAppstorePopup();
          }
        }, 500);
      };

      $rootScope.currentPopup = $ionicPopup.alert({
        scope:$rootScope,
        cssClass:'no-buttons',
        templateUrl:'main/templates/popups/rate-app-popup.html'
      });

      var startAppstorePopup = function(){
        $rootScope.data = {
          feedback:'Dein Feedback an uns'
        };
        $rootScope.currentPopup = $ionicPopup.show({
          templateUrl:'main/templates/popups/appstore-popup.html',
          scope: $rootScope,
          cssClass:'two-buttons',
          buttons: [
            {
              text: 'Nein'
            },
            {
              text: 'Ja',
              onTap: function() {
                return true;
              }
            }
          ]
        });
        $rootScope.currentPopup.then(function(data){
          if(data){
            Tracker.trackEvent('rateInStore');
            if(ionic.Platform.isIOS()){
              $cordovaInAppBrowser.open('https://itunes.apple.com/de/app/appinio/id923798378?mt=8', '_system');
            }else{
              $cordovaInAppBrowser.open('https://play.google.com/store/apps/details?id=com.appinio.appinio', '_system');
            }
          }
        });
      };

      $rootScope.closeCurrentPopup = function(){
        $rootScope.currentPopup.close();
      };

      var startFeedbackPopup = function(){
        $rootScope.data = {};
        $rootScope.currentPopup = $ionicPopup.show({
          templateUrl:'main/templates/popups/feedback-app-popup.html',
          scope: $rootScope,
          cssClass:'two-buttons',
          buttons: [
            {
              text: 'Ok',
              onTap: function(e) {
                if (!$rootScope.data.feedback) {
                  e.preventDefault();
                } else {
                  return $rootScope.data.feedback;
                }
              }
            }
          ]
        });
        $rootScope.currentPopup.then(function(data){
          console.log(data);
          // API?!?!
        });
      }
    }
  };
});
