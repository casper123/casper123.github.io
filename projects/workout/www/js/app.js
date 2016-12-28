// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('workoutfactory', ['ionic', 'workoutfactory.controllers', 'workoutfactory.services', 'workoutfactory.directive', 'rn-lazy'])

.run(function($http, $ionicPlatform, $location, $timeout, $rootScope) {
  $ionicPlatform.ready(function() {

    $rootScope.$on('$locationChangeSuccess', function(object, newLocation, previousLocation) {
      $rootScope.previousLocation = previousLocation;
    });

    /*$timeout(function(){
      $rootScope.$apply(function() {
        $location.path("/tab/home/home_item/112");
      });
    });*/

    //device = ionic.Platform.device();

    //device_id = device.uuid;
    //console.log("casper:" + device_id);
    //var responsePromise = $http.get("http://wahabkotwal.net/projects/bawarchi/index.php/webservice/save_device/" + device_id);
    //responsePromise.success(function(data, status, headers, config) {
    //  //console.log(data.data.session_count);
    //  if(parseInt(data.data.session_count) == 2)
    //    navigator.apprate.promptForRating();
    //});

    //Push Notification
    //var pushNotification = window.plugins.pushNotification;
    //console.log("shahpar" + JSON.stringify(pushNotification));

    //set push notifications handler
    //document.addEventListener('push-notification', function(event) {
    //    var title = event.notification.title;
    //    var userData = event.notification.userdata;
    //  
    //    $timeout(function(){
    //      $rootScope.$apply(function() {
    //        $location.path("/tab/home/home_item/" + userData.recipe_id);
    //      });
    //    });
    //});
 
    //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
    //pushNotification.onDeviceReady({ projectid: "694434922830", appid : "37D5F-74EE6" });
 
    //register for pushes
    //pushNotification.registerDevice(
    //    function(status) {
    //        var pushToken = status;
    //        //console.log('shahpar push token: ' + pushToken);
    //    },
    //    function(status) {
    //        //console.log("shahpar" + JSON.stringify(['failed to register ', status]));
    //    }
    //);

    ionic.Platform.fullScreen(false);
    //navigator.splashscreen.show();

    //setTimeout(function() {
    //  navigator.splashscreen.hide();
    //}, 5000);

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    //setTimeout(function(){FastClick.attach(document.body);}, 3000);
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.favourite', {
      url: '/favourite',
      views: {
        'tab-favourite': {
          templateUrl: 'templates/tab-favourite.html',
          controller: 'FavouriteCtrl'
        }
      }
    })

    .state('tab.favourite-item', {
      url: '/favourite/favourite_item/:itemId',
      views: {
        'tab-favourite': {
          templateUrl: 'templates/tab-recipe-list-item.html',
          controller: 'RecipeItemCtrl'
        }
      }
    })

    .state('tab.recipe', {
      url: '/recipe',
      views: {
        'tab-recipe': {
          templateUrl: 'templates/tab-recipe.html',
          controller: 'RecipeCtrl',
        }
      }
    })

    .state('tab.recipe-list', {
      url: '/recipe/list/:catId/:catName',
      views: {
        'tab-recipe': {
          templateUrl: 'templates/tab-recipe-list.html',
          controller: 'RecipeListCtrl'
        }
      }
    })

    .state('tab.recipe-list-item', {
      url: '/recipe/list_item/:itemId',
      views: {
        'tab-recipe': {
          templateUrl: 'templates/tab-recipe-list-item.html',
          controller: 'RecipeItemCtrl'
        }
      }
    })

    .state('tab.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-home.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.home-item-list', {
      url: '/home/home_item_list/:typeId',
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-recipe-list-home.html',
          controller: 'RecipeHomeCtrl'
        }
      }
    })

    .state('tab.home-item', {
      url: '/home/home_item/:itemId',
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-recipe-list-item.html',
          controller: 'RecipeItemCtrl'
        }
      }
    })
	
  .state('tab.home-recipe-item', {
      url: '/home/recipie_details/:itemId',
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-recipe-item.html',
          controller: 'RecipieCtrl'
        }
      }
    })

    .state('tab.tips', {
      url: '/tips',
      views: {
        'tab-tips': {
          templateUrl: 'templates/tab-tips.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.more', {
      url: '/more',
      views: {
        'tab-more': {
          templateUrl: 'templates/tab-more.html',
          controller: 'MoreCtrl'
        }
      }
    })

    .state('tab.about', {
      url: '/more/about',
      views: {
        'tab-more': {
          templateUrl: 'templates/tab-about.html',
          controller: 'AboutCtrl'
        }
      }
    })

    .state('tab.help', {
      url: '/more/help',
      views: {
        'tab-more': {
          templateUrl: 'templates/tab-help.html',
          controller: 'HelpCtrl'
        }
      }
    })

    .state('tab.setting', {
      url: '/more/setting',
      views: {
        'tab-more': {
          templateUrl: 'templates/tab-setting.html',
          controller: 'SettingCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});

