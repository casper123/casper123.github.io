angular.module('main', [
  'ionic',
  'angular-svg-round-progress', 
  'timer', 
  'http-auth-interceptor',
  'truncate',
  //'apn-app-questions', 
  'ngCordova',
  'ui.router',
  'pascalprecht.translate', 
  //'angular-encryption', 
  'main.directive',
  'main.service',
  'main.controller',
  'underscore'
  // TODO: load other modules selected during generation
])
.constant('appinioConfig', {
    'baseUrl': 'http://81.169.175.34/',
    'agbUrl': 'http://get-appinio.de/mobile/agb/',
    'privacyUrl': 'http://get-appinio.de/mobile/privacy/',
    'faqUrl': 'http://get-appinio.de/mobile/faq/',
    'supportEmail': 'support@appinio.de',
    'feedbackEmail': 'hello@appinio.de'
})
.run(function(
      $ionicPlatform, 
      $rootScope, 
      $timeout, 
      $ionicLoading, 
      $ionicModal, 
      $state, 
      $ionicHistory, 
      $cordovaPush,
      $http, 
      $window,
      $ionicScrollDelegate,
      User,
      currentUser, 
      Global, 
      appinioConfig, 
      PushNotification, 
      ShareText, 
      Badges, 
      Tutorial, 
      Rating,
      Tracker
      ){
        // 81.169.175.34
        $ionicPlatform.on('resume', function () {
          $rootScope.$broadcast('app:resume', true);
          User.resume();
        });
        $ionicPlatform.ready(function (){
          $window.addEventListener('CustomUrl', function(e) {
            //alert(e.detail.url);
          });

          if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
          }
          if (window.StatusBar) {
            //StatusBar.styleDefault();
            StatusBar.hide();
            ionic.Platform.fullScreen();
          }

          PushNotification.registerListener();

          Global.setGlobals();
          Tracker.init();

          currentUser.getUser(function (user) {
            $rootScope.loggedInUser = user;
          });

          $rootScope.$on('event:auth-loginRequired', function () {
            $state.go('user.login');
          });

          $rootScope.openSurveyList = function () {
            $rootScope.$broadcast('open:surveys', true);
          };

          $rootScope.openAvatarClick = function () {
            Tracker.trackEvent('clickAvatar');
            if($state.current.name == 'tabMenuMain.feed'){
              $rootScope.openSettingsModal();
            }else{
              $state.go('tabMenuMain.feed');
            }
          };

          $rootScope.checkForUpdates = function (data, skipBadge) {
            if (data) {
              if ($rootScope.loggedInUser.level && data.level > $rootScope.loggedInUser.level) {
                $rootScope.openLevelUpModal(data.level);
              }
              for (var k in data) {
                if ($rootScope.loggedInUser[k] != null) {
                  if (k == 'level' && data[k] > $rootScope.loggedInUser[k] && (data[k] == 3 || data[k] == 8)) {
                    $timeout(function () {
                      Tutorial.showLegendPopup($rootScope.loggedInUser._id + 'didRate', function () {
                        Rating.rateApp();
                      });
                    }, 4000);
                  }
                  $rootScope.loggedInUser[k] = data[k];
                }
              }
              currentUser.setUser($rootScope.loggedInUser);
              if (!skipBadge) {
                User.quickUpdate();
              }
            }
          };

          $rootScope.setScreen = function (name) {
            Tracker.trackScreen(name);

            try {
              if ($rootScope.loggedInUser && window.localStorage.getItem($rootScope.loggedInUser._id + 'screenBadge') != 'true') {
                var screens;
                if (window.localStorage.getItem($rootScope.loggedInUser._id + 'sawScreens') == null) {
                  screens = {}
                } else {
                  screens = JSON.parse(window.localStorage.getItem($rootScope.loggedInUser._id + 'sawScreens'));
                }
                screens[name] = true;
                window.localStorage.setItem($rootScope.loggedInUser._id + 'sawScreens', JSON.stringify(screens));
                if (Object.keys(screens).length > 13) {
                  var fields = [];
                  for (var k in screens) {
                    fields.push({field: k});
                  }
                  fields = _.sortBy(fields, 'field');
                  var hash = CryptoJS.SHA256(JSON.stringify(fields));
                  User.checkEasteregg(hash.toString(CryptoJS.enc.Hex), function () {
                    window.localStorage.setItem($rootScope.loggedInUser._id + 'screenBadge', true);
                  });
                }
              }
            } catch (err) {
              console.log(err);
            }
          };

          $rootScope.shareLevelUp = function () {
            Tracker.trackEvent('shareLevel');
            ShareText.level($rootScope.newLevel.level);
          };

          $rootScope.shareBadge = function () {
            Tracker.trackEvent('shareBadge');
            ShareText.badge($rootScope.newBadge.name);
          };

          $rootScope.logoutUser = function () {
            $rootScope.closeDropDown();
            User.logout(function () {
              Tracker.trackEvent('logout');
              $rootScope.closeLinksList();
              $state.go('user.login');
              $rootScope.logoutReinit = true;
              $ionicHistory.clearHistory();
              $ionicHistory.clearCache().then(function () {
                $rootScope.myBadges = null;
                $rootScope.justLoggedOut = true;
              });
            });
          };

          Global.setModals();

          $rootScope.headerDropdown = ($state.current.name == 'tabMenuMain.feed');
          
          $rootScope.$on('$stateChangeStart', function (event, toState) {
            $rootScope.headerDropdown = (toState.name == 'tabMenuMain.feed');
            $timeout(function () {
              $rootScope.quickieMode = !(toState.name.indexOf('tabMenuMain.quickies') == -1);
            }, 250);
          });

          $timeout(function () {
            $rootScope.quickieMode = !($state.current.name.indexOf('tabMenuMain.quickies') == -1);
          }, 50);

          $rootScope.showModal = false;

          $rootScope.$on('modal.shown', function(a, b){
            $rootScope.showModal = true;
            if(angular.element(b.modalEl).hasClass('profile-modal')){
              angular.element(b.el).css({'z-index':11});
            }
            if(angular.element(b.modalEl).hasClass('level-up-modal')){
              angular.element(b.el).css({'z-index':12});
            }
          });

          $rootScope.$on('modal.hidden', function(a, b){
            $timeout(function(){
              $rootScope.showModal = false;
            }, 1);
          });

          $ionicPlatform.onHardwareBackButton(function(event) {
            if($state.current.name.indexOf('tabMenuMain.') != -1){
              var backView = $ionicHistory.backView();
              if(backView && !$rootScope.showModal){
                if($ionicHistory.backView().stateName == 'user.login'){
                  event.preventDefault();
                  event.stopPropagation();
                  navigator.app.exitApp();
                }
              }
            }
          });

          $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            if (toState.name.indexOf('tabMenuMain.') != -1) {
              $rootScope.setScreen(toState.name.replace('tabMenuMain.', ''));
            }
            if (toState.name === 'tabMenuMain.ranking') {
              $rootScope.$broadcast('reload:ranking', true);
            }
            if (toState.name === 'tabMenuMain.feed') {
              $rootScope.$broadcast('reload:feed', true);
            }
          });

        });
    })

.config(function($ionicConfigProvider, 
                  $stateProvider, 
                  $cordovaFacebookProvider, 
                  $urlRouterProvider, 
                  $translateProvider, 
                  $httpProvider, 
                  appinioConfig){
                
                    $ionicConfigProvider.tabs.position('bottom');

                    $translateProvider.useSanitizeValueStrategy('sanitize');
                    $translateProvider.useStaticFilesLoader({
                      prefix: 'locale-',
                      suffix: '.json'
                    });

                    $translateProvider.use('de');
                    //$translateProvider.use('en');
                    
                    if (navigator) {
                      var lang = navigator.language || navigator.userLanguage;
                      if (lang) {
                        //$translateProvider.use(lang.replace("-", "_").split("_")[0]);
                      }
                    }
                    //$translateProvider.fallbackLanguage("de");
                    $translateProvider.fallbackLanguage("en");

                    $httpProvider.interceptors.push(function ($q) {
                      return {
                        'request': function (config) {
                          if (config.url.indexOf(appinioConfig.baseUrl) != -1 && window.localStorage.getItem('token') != undefined) {
                            config.headers['Authorization'] = 'Bearer ' + window.localStorage.getItem('token');
                          }
                          return config;
                        }
                      };
                    });
                    
                    // ROUTING with ui.router
                    $urlRouterProvider.otherwise('/user/login');
                    $stateProvider
                      // this state is placed in the <ion-nav-view> in the index.html
                      
                      .state('user', {
                        url: '/user',
                        abstract: true,
                        templateUrl: 'main/templates/user/user.html',
                        //controller: 'UserCtrl'
                      })
                      .state('user.login', {
                        url: '/login',
                        views: {
                          'userContent': {
                             templateUrl: 'main/templates/user/login.html'
                           }
                         }
                      })
                      .state('user.register', {
                        url: '/register',
                        views: {
                          'userContent': {
                            templateUrl: 'main/templates/user/register.html'
                          }
                        }
                      })
                      .state('user.registernew', {
                        url: '/registernew',
                        views: {
                          'userContent': {
                            templateUrl: 'main/templates/user/register-new.html'
                          }
                        }
                      })
                      .state('user.quickies', {
                        url: '/quickies',
                        views: {
                          'userContent': {
                            templateUrl: 'main/templates/user/quickies.html'
                          }
                        }
                      })
                      .state('user.name', {
                        url: '/name',
                        views: {
                          'userContent': {
                            templateUrl: 'main/templates/user/name.html'
                          }
                        }
                      })
                      .state('user.facebook', {
                        url: '/facebook',
                        views: {
                          'userContent': {
                            templateUrl: 'main/templates/user/facebook-register.html'
                          }
                        }
                      })
                      
                      .state('tabMenuMain', {
                        url: '/tabMenuMain',
                        abstract: true,
                        templateUrl: 'main/templates/menu-main/tabs-menu-main.html'
                      })
                      .state('tabMenuMain.answer', {
                        url: '/answer',
                        params: {surveyId: {dynamic: true}},
                        views: {
                          'tab-answer': {
                            templateUrl: 'main/templates/menu-main/answers/tab-answers.html',
                            controller: 'AnswerCtrl'
                          }
                        }
                      })
                      .state('tabMenuMain.feed', {
                        url: '/feed',
                        views: {
                          'tab-feed': {
                            templateUrl: 'main/templates/menu-main/feed/tab-feed.html',
                            controller: 'FeedCtrl'
                          }
                        }
                      })
                      .state('tabMenuMain.quickies', {
                        url: '/quickies',
                        params: {surveyId: {dynamic: true}},
                        views: {
                          'tab-quickies': {
                            templateUrl: 'main/templates/menu-main/quickies/tab-quickies.html',
                            controller: 'QuickiesCtrl'
                          }
                        }
                      })
                      .state('tabMenuMain.ranking', {
                        url: '/ranking',
                        views: {
                          'tab-ranking': {
                            templateUrl: 'main/templates/menu-main/ranking/ranking-main.html',
                            controller: 'RankingCtrl'
                          }
                        }
                      })
                      .state('main', {
                        url: '/main',
                        abstract: true,
                        templateUrl: 'main/templates/tabs.html'
                      })
                      .state('main.list', {
                        url: '/list',
                        views: {
                          'tab-list': {
                            templateUrl: 'main/templates/list.html',
                            // controller: 'SomeCtrl as ctrl'
                          }
                        }
                      })
                      .state('main.listDetail', {
                        url: '/list/detail',
                          views: {
                            'tab-list': {
                              templateUrl: 'main/templates/list-detail.html',
                              // controller: 'SomeCtrl as ctrl'
                          }
                        }
                      })
                      .state('main.debug', {
                        url: '/debug',
                        views: {
                          'tab-debug': {
                            templateUrl: 'main/templates/debug.html',
                            controller: 'DebugCtrl as ctrl'
                          }
                        }
                      });
  });
