// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'ngCordova',
  'ionic.service.core',
  'ionic.service.push',
  'ionic.service.deploy',
  'starter.controllers',
  'starter.services',
  'ion-autocomplete'])

.run(function($ionicPlatform, $rootScope, User, Log, Kiosk, $ionicUser, $ionicPush) {


  $rootScope.UTIL = {
    serialize : function(data) {
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
      return "http://45.55.183.61/methods.php/";
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

    setInterval(function(){ 
      console.log('inside');
      //var connection = window.navigator.connection || window.navigator.mozConnection || null;
      //var batterCharging= window.navigator.battery.charging;
      var connection = 'WIFI';
      var batteryCharging = 10;
      var authenticationsData =[];
      authenticationsData.kiosk_status_connection = connection;
      authenticationsData.kiosk_status_battery = batteryCharging;
      authenticationsData.kiosk_id = window.localStorage.getItem("authenticationsId");
      
      Kiosk.saveKiosk($rootScope.UTIL.serialize(authenticationsData),window.localStorage.getItem("token"),function(response){
        //console.log(response);
      });
      if(batteryCharging == false)
      {
        Log.addLog(window.localStorage.getItem("userId"),window.localStorage.getItem("companyId"),0,14,window.localStorage.getItem("token"), function(response){});
      }

    }, 10000); 

    $rootScope.incomingCount = 0;
    $rootScope.claimedCount = 0;
    $rootScope.ourRequestCount = 0;
    
    var user = $ionicUser.get();
    if(!user.user_id) {
      // Set your user_id here, or generate a random one.
      user.user_id = $ionicUser.generateGUID();
      console.log("insdie no user");
    };


    // Identify your user with the Ionic User Service
    $ionicUser.identify(user).then(function(){
      $rootScope.identified = true;
      //alert('Identified user ' + user.name + '\n ID ' + user.user_id);
      $ionicPush.register({
        canShowAlert: true, //Can pushes show an alert on your screen?
        canSetBadge: true, //Can pushes update app icon badges?
        canPlaySound: true, //Can notifications play a sound?
        canRunActionsOnWake: true, //Can run actions outside the app,
        onNotification: function(notification) {
          console.log(JSON.stringify(notification));
          return true;
        }
      });
    });
  });

  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
    console.log(JSON.stringify(data));
    console.log('Ionic Push: Got token ', data.token, data.platform);
    $rootScope.token = data.token;
  });
  
})
  
.config(['$ionicAppProvider', function($ionicAppProvider) {
  // Identify app
  $ionicAppProvider.identify({
    // The App ID (from apps.ionic.io) for the server
    app_id: '6a61ab23',
    // The public API key all services will use for this app
    api_key: 'b54332d94527e90b73ca17a62bbddffde093f5ec6dff5a11',
    // The GCM project ID (project number) from your Google Developer Console (un-comment if used)
    gcm_id: '87232049422',
    dev_push: false
  });
}])

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.navBar.alignTitle('center')
})

.run(function($rootScope, $ionicDeploy, $ionicPlatform, $cordovaStatusbar) {

  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    // Color the iOS status bar text to white
    if (window.StatusBar) {
      $cordovaStatusbar.overlaysWebView(true);
      $cordovaStatusBar.style(1); //Light
    }

    // Default update checking
    $rootScope.updateOptions = {
      interval: 2 * 60 * 1000
    };

    // Watch Ionic Deploy service for new code
    /*$ionicDeploy.watch($rootScope.updateOptions).then(function() {}, function() {}, function(hasUpdate) {
      $rootScope.lastChecked = new Date();
      console.log('WATCH RESULT', hasUpdate);
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

  .state('user.login', {
    url: "/login",
    views: {
      'userContent' :{
        templateUrl: "templates/login.html",
        controller: 'UserCtrl'
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
    
  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    controller: 'RequestCtrl'
  })

  // Each tab has its own nav history stack:

  // request tab
  .state('tab.request', {
    url: '/request',
    cache: false,
    views: {
      'tab-request': {
        templateUrl: 'templates/tab-request.html',
        controller: 'RequestCtrl'
      }
    }
  })

  .state('tab.requestDetails', {
    url: '/request/requestDetails/:requestId',
    cache: false,
    views: {
      'tab-request': {
        templateUrl: 'templates/request-details.html',
        controller: 'RequestDetailCtrl'
      }
    }
  })

  

 
  
  
    .state('tab.newrequest_modal', {
    url: '/newrequest_modal',
    views: {
      'tab-newrequest_modal': {
        templateUrl: 'templates/addRequest_modal.html',
        controller: 'RequestCtrl'
      }
    }
  })

  // Ionic User tab
  .state('tab.incoming', {
    url: '/incoming',
    cache: false,
    views: {
      'tab-incoming': {
        templateUrl: 'templates/tab-incoming.html',
        controller: 'IncomingCtrl'
      }
    }
  })

   .state('tab.requestDetailsIncoming', {
    url: '/incoming/requestDetails/:requestId',
    cache: false,
    views: {
      'tab-incoming': {
        templateUrl: 'templates/request-details.html',
        controller: 'RequestDetailCtrl'
      }
    }
  })

    .state('tab.claimed', {
    url: '/claimed',
    cache: false,
    views: {
      'tab-claimed': {
        templateUrl: 'templates/tab-claimed.html',
        controller: 'ClaimedCtrl'
      }
    }
  })

    .state('tab.requestDetailsClaimed', {
    url: '/claimed/requestDetails/:requestId',
    cache: false,
    views: {
      'tab-claimed': {
        templateUrl: 'templates/request-details.html',
        controller: 'RequestDetailCtrl'
      }
    }
  })


    .state('tab.existing', {
    url: '/existing',
    cache: false,
    views: {
      'tab-existing': {
        templateUrl: 'templates/tab-existing.html',
        controller: 'ExistingCtrl'
      }
    }
  })

    .state('tab.requestDetailsExisting', {
    url: '/existing/requestDetails/:requestId',
    cache: false,
    views: {
      'tab-existing': {
        templateUrl: 'templates/request-details.html',
        controller: 'RequestDetailCtrl'
      }
    }
  })


  // Ionic Push tab
  .state('tab.push', {
    url: '/push',
    views: {
      'tab-push': {
        templateUrl: 'templates/tab-push.html',
        controller: 'PushCtrl'
      }
    }
  })

  // Ionic Deploy tab
  .state('tab.deploy', {
    url: '/deploy',
    views: {
      'tab-deploy': {
        templateUrl: 'templates/tab-deploy.html',
        controller: 'DeployCtrl'
      }
    }
  })

  // Ionic Analytics tab
  .state('tab.analytics', {
    url: '/analytics',
    views: {
      'tab-analytics': {
        templateUrl: 'templates/tab-analytics.html',
        controller: 'AnalyticsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/user/login');

});
