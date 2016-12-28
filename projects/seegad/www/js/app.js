// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var precurioApp = angular.module('starter', ['ionic', 'ionic-modal-select', 'ksSwiper', 'fabDirective', 'rwdImageMaps', 'starter.services', 'starter.directive', 'angular-md5', 'angularMoment', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $ionicModal, $ionicPopover, Modal, moment) {
  
  $rootScope.UTIL = {
    serialize: function(data) {
      if ( ! angular.isObject( data ) )
      return( ( data == null ) ? "" : data.toString() );

      var buffer = [];
      // Serialize each key in the object.
      for (var name in data) {
        if(!data.hasOwnProperty(name))
          continue;
          var value = data[ name ]; 
          buffer.push(encodeURIComponent( name ) + "=" + encodeURIComponent( ( value == null ) ? "" : value ));
        }
        // Serialize the buffer and clean it up for transportation.
        var source = buffer.join( "&" ).replace( /%20/g, "+" );
          return(source);
    }
  }
  
  Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();
    return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
   };

   $rootScope.startOfWeek = moment().startOf('isoweek').toDate().yyyymmdd();
   $rootScope.endOfWeek = moment().endOf('isoweek').toDate().yyyymmdd();

  console.log($rootScope.startOfWeek);
  $ionicPlatform.ready(function() {
    
  $rootScope.showShortcut = function () {
    Modal.showShortcut();
  }

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $httpProvider, $urlRouterProvider, $ionicConfigProvider) {

    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

  $ionicConfigProvider.tabs.position('bottom');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('user', {
      url: '/user',
      templateUrl: 'templates/user.html',
    })
    
  .state('tab', {
    url: '/tab',
    abstract: true,
    cache:false,
    templateUrl: 'templates/tabs.html',
    controller: 'UserCtrl'
  })

  // Each tab has its own nav history stack:

  .state('user.login', {
      url: '/login',
      cache:false,
      views: {
        'user-content': {
          templateUrl: 'templates/login.html',
          controller:'UserCtrl'
        }
      }
    })

  .state('user.forgot', {
      url: '/forgot',
      cache:false,
      views: {
        'user-content': {
          templateUrl: 'templates/forgot.html',
          controller:'UserCtrl'
        }
      }
    })

  .state('user.signup', {
      url: '/signup',
      cache:false,
      views: {
        'user-content': {
          templateUrl: 'templates/signup.html',
          controller:'UserCtrl'
        }
      }
    })

  .state('tab.task', {
    url: '/task',
    cache:false,
    views: {
      'tab-task': {
        templateUrl: 'templates/tab-task.html',
        controller: 'TaskCtrl'
      }
    }
  })

  .state('tab.expense', {
      url: '/expense',
      cache:false,
      views: {
        'tab-expense': {
          templateUrl: 'templates/tab-expense.html',
          controller: 'ExpenseCtrl'
        }
      }
    })
    .state('tab.account', {
      url: '/account',
      cache:false,
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })

  .state('tab.team', {
    url: '/team',
    cache:false,
    views: {
      'tab-team': {
        templateUrl: 'templates/tab-team.html',
        controller: 'TeamCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/user/login');

})

.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});
