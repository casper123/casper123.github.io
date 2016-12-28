// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.directive', 'ionic-material', 'ionMdInput', 'youtube-embed'])

  /* .value('GoogleApp', {
    apiKey: 'AIzaSyBLZzOnpbqkcg3qkNm9HNl5AZBNDhYbhmc',
    clientId: '675005927730-l2nun9c239h4v2k4ds14nofs5thf5ifm.apps.googleusercontent.com',
    scopes: [
      // whatever scopes you need for your app, for example:
      'https://www.googleapis.com/auth/youtube'
    ]
  })
 */

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
	
	
  });
})

.filter('youtubeEmbedUrl', function ($sce) {
  return function(videoId) {
    return $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + videoId);
  };
})

.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider) {

  $sceDelegateProvider.resourceUrlWhitelist([
     'self',
     "http://www.youtube.com/embed/**"
  ]);

  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
		controller: 'searchVideoCtrl'
	  }
    }
  })

  .state('app.searchByRegion', {
    url: '/search/:regionId/:regionName',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
    controller: 'searchVideoCtrl'
    }
    }
  })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.songDetails', {
    url: '/songDetails/:songId',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'videoCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/search');
});
