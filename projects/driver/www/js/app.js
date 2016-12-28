// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.services', 'starter.controllers', 'starter.directive', 'ngCordova', 'google-maps'.ns()])



.run(function($ionicPlatform, $rootScope) {


  $rootScope.UTIL = {
    serialize: function(data) {
      if ( ! angular.isObject( data ) )
      return( ( data == null ) ? "" : data.toString() );

      var buffer = [];
      // Serialize each key in the object.
      for (var name in data) 
      {
      if(!data.hasOwnProperty(name))
        continue;
       
      var value = data[ name ]; 
      buffer.push(encodeURIComponent( name ) + "=" + encodeURIComponent( ( value == null ) ? "" : value ));
       
      }
       
      // Serialize the buffer and clean it up for transportation.
      var source = buffer.join( "&" ).replace( /%20/g, "+" );
       
      return(source);
    },

    webServiceUrl: function() {
      return "http://localhost/delivery/methods.php/";
    }
  }

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $stateProvider

    $stateProvider
    .state('user', {
      url: "/user",
      abstract: true,
      templateUrl: "templates/user.html",
      controller: 'UserCtrl'
    })

    .state('user.login', {
      url: "/login",
      views: {
        'userContent' :{
          templateUrl: "templates/login.html",
          controller: 'LoginCtrl'
        }
      }
    })

    .state('user.logout', {
      url: "/logout",
      views: {
        'userContent' :{
          templateUrl: "templates/login.html",
          controller: 'LogoutCtrl'
        }
      }
    })

    .state('user.register', {
      url: "/register",
      views: {
        'userContent' :{
          templateUrl: "templates/register.html",
          controller: 'RegisterCtrl'
        }
      }
    })

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })


    .state('app.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html",
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.detail', {
      url: "/detail/:id",
      views: {
        'menuContent' :{
          templateUrl: "templates/detail.html",
          controller: 'DetailCtrl'
        }
      }
    })

    .state('app.complete', {
      url: "/complete/:id",
      views: {
        'menuContent' :{
          templateUrl: "templates/complete.html",
          controller: 'CompleteCtrl'
        }
      }
    })
    
    .state('app.delayed', {
      url: "/delay/:id",
      views: {
        'menuContent' :{
          templateUrl: "templates/delay.html",
          controller: 'DelayedCtrl'
        }
      }
    })

    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/user/login');
});


