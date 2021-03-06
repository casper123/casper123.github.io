// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers']);

app.run(function($ionicPlatform, $rootScope) {
    moment.locale('zh-cn');

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
});

app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/template.html",
            controller: 'AppCtrl'
        })
        .state('app.register', {
            url: '/register',
            views: {
                'menuContent': {
                    templateUrl: 'templates/register.html'
                }
            }
        })
        .state('app.update-profile', {
            url: '/update-profile',
            views: {
                'menuContent': {
                    templateUrl: 'templates/update-profile.html',
                    controller: 'ProfileUpdateCtrl'
                }
            }
        })
        .state('app.detail', {
            url: '/detail/:postId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/detail.html',
                    controller: 'DetailCtrl'
                }
            }
        })
        .state('app.comment', {
            url: '/detail/:postId/comment/:replyId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/comment.html',
                    controller: 'DetailCtrl'
                }
            }
        })
        .state('app.post', {
            url: '/post',
            views: {
                'menuContent': {
                    templateUrl: 'templates/post.html',
                    controller: 'PostCtrl'
                }
            }
        })
        .state('app.browser', {
            url: '/browser',
            views: {
                'menuContent': {
                    templateUrl: 'templates/browser.html',
                    controller: 'BrowserCtrl'
                }
            }
        })
        .state('app.preference', {
            url: '/preference',
            views: {
                'menuContent': {
                    templateUrl: 'templates/preference.html',
                    controller: 'PreferenceCtrl'
                }
            }
        })
        .state('app.filter-tags', {
            url: '/filter-tags',
            views: {
                'menuContent': {
                    templateUrl: 'templates/filter-tags.html',
                    controller: 'FilterTagsCtrl'
                }
            }
        })
        .state('app.profile', {
            url: '/profile',
            views: {
                'menuContent': {
                    templateUrl: 'templates/profile.html',
                    controller: 'ProfileViewCtrl'
                }
            }
        })
        .state('app.profileOthers', {
            url: '/profile/:userId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/profile.html',
                    controller: 'ProfileViewCtrl'
                }
            }
        })
        .state('app.list', {
            url: '/list',
            views: {
                'menuContent': {
                    templateUrl: function() {
                        if (window.localStorage.preference__list == "LIST") {
                            return "templates/list.html";
                        } else {
                            return "templates/list-grid.html";
                        }

                    },
                    controller: 'ListCtrl'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/list');
}]);


app.factory('authInterceptor', ["$q", "$location", "$rootScope",
    function($q, $location, $rootScope) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if (config.url.match(/^http/)) {
                    if (window.localStorage.token) {
                        config.headers.Authorization = window.localStorage.token;
                    }
                }
                return config;
            },
            responseError: function(response) {
                if (response.config.url.match(/^http/)) {
                    if (response.status == 401) {
                        delete window.localStorage.token;
                        $rootScope.LOGIN_STATUS = false;
                    }
                }
                return $q.reject(response);
            }
        };
    }
]);

app.config(["$httpProvider",
    function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }
]);

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}
if (!window.guid) {
    window.guid = (function() {
        var s4 = function() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return function() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };
    })();
}
