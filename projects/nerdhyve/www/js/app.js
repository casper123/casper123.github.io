// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var novitrixApp = angular.module('starter',['ionic', 'ksSwiper', 'ngCordova', 'ionicLazyLoad', 'jett.ionic.filter.bar', 'starter.services',])

.run(function($ionicPlatform, $rootScope, $state, Configuration, PaypalService) {
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
        }
    }

    Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();
    return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
   };


  $ionicPlatform.ready(function() {
    $rootScope.keyBoardShow = false;
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

    window.addEventListener('native.keyboardshow', keyboardShowHandler);

    function keyboardShowHandler(e){
      $rootScope.keyBoardShow = true;
      $rootScope.keyBoardHeight = e.keyboardHeight;
      console.log('show');
      console.log($rootScope.keyBoardHeight);
    }

    window.addEventListener('native.keyboardhide', keyboardHideHandler);

    function keyboardHideHandler(e){
      $rootScope.keyBoardShow = false;
      $rootScope.keyBoardHeight = 0;
      console.log('hide');
      console.log($rootScope.keyBoardHeight);
    }


    var push = PushNotification.init({
        android: {
            senderID: "853647514112"
        }
    });

    PushNotification.hasPermission(function(data) {
        if (data.isEnabled) {
            console.log('isEnabled');
        }
    });
    
    push.on('registration', function(data) {
        console.log(data.registrationId);
        window.localStorage.setItem('push_id', data.registrationId);
    });
    
    push.on('notification', function(data) {
        console.log(JSON.stringify(data));
        if(data.additionalData.notification_type == 'buy')
          $state.go('tab.transaction');
        else if(data.additionalData.notification_type == 'trade_request')
          $state.go('tab.request');
        else if(data.additionalData.notification_type == 'trade_approve')
          $state.go('tab.request');
        else if(data.additionalData.notification_type == 'item_approve')
          $state.go('tab.user-add');
    });

    push.on('error', function(e) {
        console.log(e.message);
    });

    $rootScope.openTerms = function(){
      cordova.InAppBrowser.open('http://www.nerdhyve.com/policies/terms/', '_blank', 'location=yes');
    }
    
  });

   
})

.config(function($stateProvider, $urlRouterProvider, $ionicFilterBarConfigProvider, $ionicConfigProvider, $cordovaFacebookProvider) {

  //$cordovaFacebookProvider.browserInit(598814510268635, 'v2.0');
  $ionicConfigProvider.tabs.position('bottom');

  //loadingProvider.load({});
  //$ionicFilterBarConfigProvider.theme = 'light';
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('user', {
      url: '/user',
      templateUrl: 'templates/user.html',
    })
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
    .state('user.signup', {
      url: '/signup',
      cache:false,
      views: {
        'user-content': {
          templateUrl: 'templates/signup.html',
          controller:'SignupCtrl'
        }
      }
    })
    
    // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      cache:false,
      abstract: true,
      templateUrl: 'templates/tabs.html',
      controller : 'MainCtrl'
    })
    // Each tab has its own nav history stack:
    .state('tab.home', {
      url: '/home',
      cache:false,
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-home.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state('tab.searchProductsHOME', {
      url: '/home/searchProducts/:id/:name',
      cache:false,
      views: {
        'tab-home': {
          templateUrl: 'templates/product-search.html',
          controller: 'ProductCtrl'
        }
      }
    })
    .state('tab.featuredProductDetail', {
      url: '/home/featuredProductDetail/:productId',
      cache:false,
      views: {
        'tab-home': {
          templateUrl: 'templates/product-detail.html',
          controller: 'MainCtrl'
        }
      }
    })
    .state('tab.homeCategoryDetail', {
      url: '/home/homeCategoryDetail/:categoryId',
      cache:false,
      views: {
        'tab-home': {
          templateUrl: 'templates/product-home.html',
          controller: 'MainCtrl'
        }
      }
    })
    .state('tab.favourite', {
      url: '/favourite',
      cache:false,
      views: {
        'tab-favourite': {
          templateUrl: 'templates/tab-favourite.html',
          controller: 'FavouriteCtrl'
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
    .state('tab.profile', {
      url: '/account/profile',
      cache:false,
      views: {
        'tab-account': {
          templateUrl: 'templates/profile.html',
          controller: 'MainCtrl'
        }
      }
    })
    .state('tab.transaction', {
      url: '/account/transaction',
      cache:false,
      views: {
        'tab-account': {
          templateUrl: 'templates/transaction.html',
          controller: 'TransactionCtrl'
        }
      }
    })
    .state('tab.editProfile', {
      url: '/account/editProfile',
      cache:false,
      views: {
        'tab-account': {
          templateUrl: 'templates/edit-profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('tab.user-add', {
      url: '/account/userAdd/:id',
      cache:false,
      views: {
        'tab-account': {
          templateUrl: 'templates/user-add.html',
          controller: 'ViewAddCtrl'
        }
      }
    })
    .state('tab.conversation',{
      url : '/account/conversations',
      cache:false,
      views: {
        'tab-account': {
          templateUrl: 'templates/conversations.html',
          controller :'ConversationCtrl'
        }
      }
    })
    .state('tab.request',{
      url : '/account/request',
      cache:false,
      views: {
        'tab-account': {
          templateUrl: 'templates/trade-requests.html',
          controller :'TradeCtrl'
        }
      }
    })
    .state('tab.settings',{
      url : '/account/settings',
      cache:false,
      views: {
        'tab-account': {
          templateUrl: 'templates/settings.html',
          controller: 'MainCtrl'
        }
      }
    })
    .state('tab.termAndCondition', {
      url: '/account/settings/termAndCondition',
      cache:false,
      views: {
        'tab-account': {
          templateUrl: 'templates/terms-and-conditions.html',
        }
      }
    })
    .state('tab.privacyPolicy', {
      url: '/account/settings/privacyPolicy',
      cache:false,
      views: {
        'tab-account': {
          templateUrl: 'templates/privacy-policy.html',
        }
      }
    })
    .state('tab.post', {
      url: '/post',
      cache:false,
      views: {
        'tab-home': {
          templateUrl: 'templates/post.html',
          controller: 'MainCtrl'
        }
      }
    })
    .state('tab.product', {
      url: '/product',
      cache:false,
      views: {
        'tab-home': {
          templateUrl: 'templates/product.html',
          controller: 'MainCtrl'
        }
      }
    })
    .state('tab.checkout', {
      url: '/checkout',
      cache:false,
      views: {
        'tab-home': {
          templateUrl: 'templates/checkout.html',
          controller: 'MainCtrl'
        }
      }
    })
    .state('tab.trade', {
      url: '/trade',
      cache:false,
      views: {
        'tab-home': {
          templateUrl: 'templates/trade.html',
          controller: 'TradeCtrl'
        }
      }
    })
    .state('tab.confirm-trade', {
      url: '/confirm-trade',
      cache:false,
      views: {
        'tab-home': {
          templateUrl: 'templates/confirm-trade.html',
          controller: 'TradeCtrl'
        }
      }
    })
    .state('tab.search', {
      url: '/search',
      cache:false,
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'ProductCtrl'
        }
      }
    })
    .state('tab.searchProducts', {
      url: '/search/searchProducts/:id/:name',
      cache:false,
      views: {
        'tab-search': {
          templateUrl: 'templates/product-search.html',
          controller: 'ProductCtrl'
        }
      }
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/user/login');

});
