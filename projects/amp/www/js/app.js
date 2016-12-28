var apb = angular.module('starter', ['ionic', 'starter.constants', 'ngResource', 'ngSanitize', 'ngCordova', 'ngMessages', 'pascalprecht.translate'])

.run(function($ionicPlatform, $rootScope, $state, $stateParams, AuthenticationService, UserService, $translate) {

  console.log(window.localStorage['username']);
  console.log(window.localStorage['password']);
  console.log(window.localStorage['save_credentials']);

  $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
    
    $rootScope.showAddMember = false;
    $rootScope.showEditMember = false;

    $rootScope.toState = toState;
    $rootScope.toStateParams = toStateParams;
    AuthenticationService.authorize(event);
  });
  
  $ionicPlatform.ready(function() {

    $rootScope.appName = 'Appointman';
    $rootScope.showAddMember = false;
    $rootScope.showEditMember = false;
    
    $rootScope.basicAuth = 'Basic ';

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if(typeof navigator.globalization !== "undefined") {
      navigator.globalization.getPreferredLanguage(function(language) {
        $translate.use((language.value).split("-")[0])
      }, null);
    }
  });

  if($rootScope.basicAuth == 'Basic ' && window.localStorage['save_credentials'] == 'true' && window.localStorage['username'] != undefined && window.localStorage['password'] != undefined)
  {
    UserService.loginUser(window.localStorage['username'], window.localStorage['password'], function() {
      $state.go('app.home');
      return;
    });
  }
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {

  $translateProvider.useStaticFilesLoader({
    prefix: 'locale-',
    suffix: '.json'
  });

  $translateProvider.use('en');

  if (navigator) {
    var lang = navigator.language || navigator.userLanguage;
    if (lang) {
      $translateProvider.use(lang.replace("-", "_").split("_")[0]);
    }
  }

  $translateProvider.fallbackLanguage("en");
  
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl',
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
      }
    },
    authRequired: true
  })

  .state('app.course', {
    url: "/course",
    views: {
      'menuContent': {
        templateUrl: "templates/course/list.html",
        controller: 'CourseListCtrl'
      }
    },
    authRequired: true
  })

  .state('app.courseDetail', {
    url: "/course/detail/:courseId",
    views: {
      'menuContent': {
        templateUrl: "templates/course/detail.html",
        controller: 'CourseDetailCtrl'
      }
    },
    authRequired: true
  })

  .state('app.newCourse', {
    url: "/course/newCourse",
    views: {
      'menuContent': {
        templateUrl: "templates/course/new-course.html",
        controller: "CourseSaveCtrl"
      }
    },
    authRequired: true
  })

  .state('app.editCourse', {
    url: "/course/newCourse/:courseId",
    views: {
      'menuContent': {
        templateUrl: "templates/course/new-course.html",
        controller: "CourseSaveCtrl"
      }
    },
    authRequired: true
  })

  .state('app.schedule', {
    url: "/schedule",
    views: {
      'menuContent': {
        templateUrl: "templates/schedule.html"
      }
    },
    authRequired: true
  })

  .state('app.member', {
    url: "/member",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/member/members.html",
        controller: "MemberCtrl"
      }
    },
    authRequired: true
  })

  .state('app.memberDetail', {
    url: "/member/memberDetail/:memberId",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/member/member-detail.html",
        controller: 'MemberDetailCtrl'
      }
    },
    authRequired: true
  })

  .state('app.newMember', {
    url: "/newMember",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/member/new-member.html",
        controller: "NewMemberCtrl"
      }
    },
    authRequired: true
  })

  .state('app.setting', {
    url: "/setting",
    views: {
      'menuContent': {
        templateUrl: "templates/setting.html",
      }
    },
    authRequired: true
  })

  .state('user', {
    url: "/user",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/user');
});
