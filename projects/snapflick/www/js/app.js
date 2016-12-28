// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'starter.directive', 'videosharing-embed', 'jrCrop', 'rwdImageMaps'])

.run(function($ionicPlatform, $rootScope, $cordovaPush, $state) {

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
      return "http://snapflick.co/";
    }
  }

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  document.addEventListener("deviceready", function(){
  
      var options = {"senderID":"1042205287257","ecb":"onNotification"};

      pushNotification = window.plugins.pushNotification;

      function successHandler (result) {
        console.log(result);
        window.localStorage.setItem('deviceId', result);
      }

      function errorHandler (error) {
        console.log(error);
      }

      window.onNotification = function(e)
      {
        switch(e.event)
        {
          case 'registered':
              if ( e.regid.length > 0 )
              {
                  window.localStorage.setItem('deviceId', e.regid);
              }
              break;

          case 'message':
            if ( e.foreground )
            {
              var soundfile = e.soundname || e.payload.sound;
              var my_media = new Media("/android_asset/www/"+ soundfile);
              my_media.play();
            }
            else
            {
               if(e.payload.data.user_id != undefined)
               {
                $state.go("tab.profileConnection", {id: e.payload.data.user_id});
               }
               else if(e.payload.data.movie_id != undefined)
               {
                $state.go("tab.releaseMovieReminder", {movieId: e.payload.data.movie_id});
               }
            }
            break;

          case 'error':
              console.log(e.msg);
              break;

          default:
              console.log("default");
              break;
        }
      }

      function successHandlerUn (result) {
        console.log('un result = ' + result);
      }

      function errorHandlerUn (error) {
        console.log('un error = ' + error);
      }

      pushNotification.register(successHandler,errorHandler,options);
  }, false);

})

.config(function($stateProvider, $urlRouterProvider, $cordovaFacebookProvider, $ionicConfigProvider) {

  var appID = 401359470029083;
  var version = "v2.0";
  $cordovaFacebookProvider.setAppID(appID, version);

  $ionicConfigProvider.tabs.position('bottom');
  
  $stateProvider
  .state('user', {
      url: "/user",
      abstract: true,
      templateUrl: "templates/user.html",
      controller: 'UserCtrl'
    })
  .state('user.welcome',{
    url:"/welcome",
    views: {
      'userContent' :{
        templateUrl:"templates/welcome.html"
      }
    }
  })
  .state('user.login', {
    url: "/welcome/login",
    views: {
      'userContent' :{
        templateUrl: "templates/login.html"
      }
    }
  })

  .state('user.registerLogin', {
    url: "/login/registerLogin",
    views: {
      'userContent' :{
        templateUrl: "templates/signUp.html"
      }
    }
  })

  .state('user.logout', {
      url: "/logout",
      views: {
        'userContent' :{
          templateUrl: "templates/login.html"
        }
      }
  })

  .state('user.register', {
    url: "/welcome/register",
    views: {
     'userContent' :{
        templateUrl: "templates/signUp.html",
      }
    }
  })

  .state('user.termsOfUse',{
    url:"/register/termsOfUse",
    views: {
      'userContent' :{
        templateUrl: "templates/terms-of-use.html",
      }
    }
  })

  .state('user.privacyPolicy',{
    url:"/register/privacyPolicy",
    views: {
      'userContent' :{
        templateUrl: "templates/privacy-policy.html",
      }
    }
  })
	
	.state('user.setting', {
      url: "/setting",
      views: {
        'userContent' :{
          templateUrl: "templates/setting.html"
        }
      }
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    cache: false,
    controller: "MainCtrl"
  })

  .state('tab.home', {
    url: '/dash',
    cache: false,
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dashboard.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.productDetail', {
    url: '/productDetail/:id',
    cache: false,
    views: {
      'tab-dash': {
        templateUrl: 'templates/product-detail.html',
        controller: 'ProductCtrl'
      }
    }
  })

  .state('tab.misc', {
    url: '/dash/misc',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-misc.html',
        controller: 'MiscCtrl'
      }
    }
  })

  .state('tab.editProfileMisc', {
      url: "/dash/misc/editprofile/:userId",
      cache: false,
      views: {
        'tab-dash' :{
          templateUrl: "templates/edit-profile.html",
		      controller: 'EditUserCtrl'
        }
      }
  })

  .state('tab.inviteFriend', {
    url: "/dash/inviteFriend",
    views: {
        'tab-dash' :{
          templateUrl: "templates/invite-friend-list.html",
          controller: "InviteFriendCtrl",
        
        }
      }
  })

  .state('tab.profilePhotoMisc', {
      url: "/dash/misc/profilePhoto/:tabType/:deleteHistory",
      cache: false,
      views: {
        'tab-dash' :{
          templateUrl: "templates/profile-photo.html",
          controller: 'ProfilePhotoCtrl'
        }
      }
  })  

  .state('tab.profileEditPhoto', {
      url: "/dash/misc/profileEditPhoto/:imageId",
      views: {
        'tab-dash' :{
          templateUrl: "templates/edit-photo.html",
          controller: 'EditPhotoCtrl'
        }
      }
  }) 
  
  .state('tab.transformPhoto',{
    url:"/dash/misc/profileTransformPhoto/:imageId",
    views:{
      'tab-dash':{
        templateUrl:"templates/transform-photo.html",
        controller:"TransformPhotoCtrl"
      }
    }
  })
  
  .state('tab.facebookAlbum', {
      url: "/dash/misc/facebookAlbum/:tabType",
      views: {
        'tab-dash' :{
          templateUrl: "templates/facebook-album.html",
          controller: 'FacebookAlbumCtrl'
        }
      }
  })

  .state('tab.facebookPhoto', {
      url: "/dash/misc/facebookPhoto/:albumId",
      views: {
        'tab-dash' :{
          templateUrl: "templates/facebook-photo.html",
          controller: 'FacebookPhotoCtrl'
        }
      }
  })

  .state('tab.releaseMovieReminder', {
    url: "/dash/releaseMovieReminder/:movieId",
    views: {
        'tab-dash' :{
          templateUrl: "templates/movie-release-reminder.html",
          controller: "ReminderCtrl",
        }
      }
  })

  .state('tab.termsOfUse', {
      url: "/dash/misc/termsOfUse",
      views: {
        'tab-dash' :{
          templateUrl: "templates/terms-of-use.html"
        }
      }
  })

  .state('tab.privacyPolicy', {
      url: "/dash/misc/privacyPolicy",
      views: {
        'tab-dash' :{
          templateUrl: "templates/privacy-policy.html"
        }
      }
  })

  .state('tab.about', {
      url: "/dash/misc/about",
      views: {
        'tab-dash' :{
          templateUrl: "templates/about.html",
        }
      }
  })

  .state('tab.contactUs', {
      url: "/dash/misc/contactUs/:subject",
      views: {
        'tab-dash' :{
          templateUrl: "templates/contact-us-form.html",
          controller:"ContactCtrl"
        }
      }
  })

  .state('tab.browse', {
      url: "/dash/browse",
      cache: false,
      views: {
        'tab-dash' :{
          templateUrl: "templates/browse.html",
          controller: 'CategoryCtrl'
        }
      }
  })

  .state('tab.subCategories', {
      url: "/dash/subCategories/:catName/:catId",
      cache: false,
      views: {
        'tab-dash' :{
          templateUrl: "templates/browse-sub-categories.html",
          controller: 'SubCategoryCtrl'
        }
      }
  })
  .state('tab.moviesByCat', {
      url: "/dash/moviesByCat/:catName/:catId",
      cache: false,
      views: {
        'tab-dash' :{
          templateUrl: "templates/movies-by-category.html",
          controller: 'CategoryCtrl'
        }
      }
  })

  .state('tab.movieDetail', {
      url: "/dash/movieDetail/:movieId/:movieName",
      cache: false,
      views: {
        'tab-dash' :{
          templateUrl: "templates/detail.html",
          controller: 'ProductCtrl'
        }
      }
  })

 
  .state('tab.search', {
      url: "/dash/search",
      views: {
        'tab-dash' :{
          templateUrl: "templates/search.html",
          controller: 'SearchCtrl'
        }
      }
  })

  .state('tab.detail', {
      url: "/dash/detail",
      cache: false,
      views: {
        'tab-dash' :{
          templateUrl: "templates/detail.html"
        }
      }
  })

  .state('tab.save', {
    url: '/dash/save',
    cache: false,
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-save.html',
        controller: 'FavouriteCtrl'
      }
    }
  })

  .state('tab.savemovieDate', {
      url: "/dash/save/movieDate/:releaseDate",
      cache: false,
      views: {
        'tab-dash' :{
          templateUrl: "templates/favourite-date-list.html",
          controller: 'FavouriteDateCtrl'
        }
      }
  })

  .state('tab.saveMovieDetail', {
      url: "/dash/save/movieDetail/:movieId/:movieName",
      cache: false,
      views: {
        'tab-dash' :{
          templateUrl: "templates/detail.html",
          controller: 'ProductCtrl'
        }
      }
  })

  .state('tab.topEarners', {
    url: '/dash/topEarners',
    cache: false,
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-top-earners.html',
        controller: 'TopEarnersCtrl'
      }
    }
  })

  .state('tab.topEarnersProfile', {
    url: '/dash/profile/:id',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('tab.profile', {
    url: '/dash/profile',
    cache: false,
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('tab.viewImage',{
    url: '/dash/profile/viewImage/:imageId',
    views:{
      'tab-dash': {
        templateUrl: 'templates/view-image.html',
        controller: 'ViewImageCtrl'
      }
    }
  })

  .state('tab.profileConnection', {
    url: '/dash/profile/:id',
    cache: false,
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('tab.profilePhotoProfile', {
      url: "/dash/profilePhoto/:tabType",
      cache:false,
      views: {
        'tab-dash' :{
          templateUrl: "templates/profile-photo.html",
          controller: 'ProfilePhotoCtrl'
        }
      }
  })

  .state('tab.profilePhotoProfileDone', {
      url: "/dash/profilePhoto/:done",
      views: {
        'tab-dash' :{
          templateUrl: "templates/profile-photo.html",
          controller: 'ProfilePhotoCtrl'
        }
      }
  })

  .state('tab.editProfileProfile', {
      url: "/dash/editProfile/:userId",
      views: {
        'tab-dash' :{
          templateUrl: "templates/edit-profile.html",
          controller: 'EditUserCtrl'
        }
      }
  })

  .state('tab.profileFacebookAlbum', {
    url: "/dash/profile/facebookAlbum/:tabType",
    views: {
      'tab-dash' :{
        templateUrl: "templates/facebook-album.html",
        controller: 'FacebookAlbumCtrl'
      }
    }
  })

  .state('tab.profileFacebookPhoto', {
    url: "/dash/profile/facebookPhoto/:albumId",
    views: {
      'tab-dash' :{
        templateUrl: "templates/facebook-photo.html",
        controller: 'FacebookPhotoCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/user/welcome');

});
