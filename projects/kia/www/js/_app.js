// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'google-maps'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function(PushProcessingService) {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    /*device = ionic.Platform.device();
    device_id = device.uuid;
   
    var pushNotification = window.plugins.pushNotification;
    pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"824841663931","ecb":"app.onNotificationGCM"});

    document.addEventListener('push-notification', function(event) {
        var title = event.notification.title;
        var userData = event.notification.userdata;
      
        $timeout(function(){
          $rootScope.$apply(function() {
            $location.path("/app/home/");
          });
        });
    });*/
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('user', {
      url: "/user",
      abstract: true,
      templateUrl: "templates/user.html",
      controller: 'UserCtrl'
    })

    // .state('user.edit_profile', {
    //   url: "/edit_profile",
    //   abstract: true,
    //   templateUrl: "templates/editProfile.html",
    //   controller: 'UserCtrl'
    // })
     .state('app.edit_profile', {
      url: "/edit_profile",
      views: {
        'menuContent' :{
          templateUrl: "templates/editProfile.html",
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('user.home', {
      url: "/home",
      views: {
        'userContent' :{
          templateUrl: "templates/home.html"
        }
      }
    })

    .state('user.login', {
      url: "/login",
      views: {
        'userContent' :{
          templateUrl: "templates/login.html"
        }
      }
    })

    .state('user.register', {
      url: "/register",
      views: {
        'userContent' :{
          templateUrl: "templates/register.html"
        }
      }
    })

    .state('user.terms', {
      url: "/terms",
      views: {
        'userContent' :{
          templateUrl: "templates/terms.html"
        }
      }
    })
    .state('user.activate', {
      url: "/activate",
      views: {
        'userContent' :{
          templateUrl: "templates/activate.html"
        }
      }
    })

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.benefit', {
      url: "/benefit",
      views: {
        'menuContent' :{
          templateUrl: "templates/benefit.html"
        }
      }
    })

    .state('app.benefitDetails', {
      url: "/benefit/details/:id",
      views: {
        'menuContent' :{
          templateUrl: "templates/benefitDetails.html",
          controller: 'BenefitCtrl'
        }
      }
    })

    .state('app.alliesDetails', {
      url: "/allies/details/:id",
      views: {
        'menuContent' :{
          templateUrl: "templates/allieDetails.html",
          controller: 'AlliesCtrl'
        }
      }
    })

    .state('app.benefitMap', {
      url: "/benefit/map/:position_id/:id",
      views: {
        'menuContent' :{
          templateUrl: "templates/benefitMap.html",
          controller: "BenefitMapCtrl"
        }
      }
    })

    .state('app.recomendation', {
      url: "/recomendation",
      views: {
        'menuContent' :{
          templateUrl: "templates/recomendation.html"
        }
      }
    })

    .state('app.redkia', {
      url: "/redkia",
      views: {
        'menuContent' :{
          templateUrl: "templates/redkia.html",
          controller: 'RedKiaCtrl'
        }
      }
    })

    .state('app.chat', {
      url: "/chat",
      views: {
        'menuContent' :{
          templateUrl: "templates/chat.html",
          controller: 'ChatCtrl'
        }
      }
    })

    .state('app.suggestion', {
      url: "/suggestion",
      views: {
        'menuContent' :{
          templateUrl: "templates/suggestion.html",
          controller: 'MiscCtrl'
        }
      }
    })

    .state('app.clubk', {
      url: "/clubk",
      views: {
        'menuContent' :{
          templateUrl: "templates/clubk.html",
          controller: 'RedKiaCtrl'
        }
      }
    })

    .state('app.profile', {
      url: "/profile",
      views: {
        'menuContent' :{
          templateUrl: "templates/profile.html",
          controller: 'ProfileCtrl'
        }
      }
    })

    .state('app.logout', {
      url: "/logout",
      views: {
        'menuContent' :{
          templateUrl: "templates/logout.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.reminder', {
      url: "/reminder",
      views: {
        'menuContent' :{
          templateUrl: "templates/push_notifications.html",
          controller: 'PlaylistCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/user/home');
});

