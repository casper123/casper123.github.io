var app = angular.module('starter.controllers', ['ionic', 'angularFileUpload', 'starter.services', 'ngTagsInput', 'wu.masonry']);

app.controller('AppCtrl', ["$rootScope", "$scope", "$ionicModal", "$timeout", "$state", "opService", "$ionicNavBarDelegate",
    function($rootScope, $scope, $ionicModal, $timeout, $state, opService, $ionicNavBarDelegate) {
        // Form data for the login modal
        $scope.loginData = {};

        // Form data for the register modal
        $scope.registerData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.showLogin = function() {
            $scope.modal.show();
        };

        $scope.profile = {};

        var __getUserProfile = function() {
            $scope.profile = {};
            opService.getUserProfile().success(
                function(data) {
                    if (data.profile.profilePicture) 
                    {
                        $scope.profile.pictureOriginal = data.profile.profilePicture;
                        $scope.profile.picture = $scope.profile.pictureOriginal + opService.CONSTS.DETAIL_SCALE;
                    }
                    else
                        $scope.profile.picture = "img/profile-default.png";


                    $scope.profile.username = data.profile.username;
                });
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            opService.login($scope.loginData.username, $scope.loginData.password).success(
                function(data) {
                    $scope.setLogin(data.sessionId + "#" + data.sessionKey);
                    $scope.closeLogin();
                    __getUserProfile();
                    if ($state.current.name != "app.list" && $state.current.name != "app.detail") {
                        $scope.gotoList();
                    } else {
                        opService.refresh();
                    }
                }).error(function(data) {
                $scope.loginData.password = null;
                $scope.clearLogin();
                opService.alertError("登陆失败！");
                $scope.closeLogin();
            });
        };

        // Perform the register action when the user submits the register form
        $scope.doRegister = function() {
            opService.register($scope.registerData.username, $scope.registerData.password).success(
                function(data) {
                    $scope.setLogin(data.sessionId + "#" + data.sessionKey);
                    __getUserProfile();
                    $scope.gotoUpdateProfile();
                }).error(function(data) {
                $scope.clearLogin();
                opService.alertError("注册失败！");
            });
        };

        // Clear the login status
        $scope.logout = function() {
            $scope.clearLogin();
            $scope.gotoList();
        };

        $scope.setLogin = function(token) {
            window.localStorage.token = token;
            $rootScope.LOGIN_STATUS = true;
        };

        $scope.clearLogin = function() {
            delete window.localStorage.token;
            delete window.localStorage.preference;
            $rootScope.LOGIN_STATUS = false;
        };

        $scope.isLoggedIn = function() {
            return $rootScope.LOGIN_STATUS;
        };

        $scope.register = function() {
            $scope.closeLogin();
            $scope.gotoRegister();
        };

        $scope.doFollow = function(actUserId) {
            if (!$scope.isLoggedIn()) {
                $scope.showLogin();
            } else {
                opService.follow(actUserId).success(
                    function(data) {
                        opService.alertError("关注成功！");

                        $scope.follow.beingFollowedCount += data.affected;
                        $scope.follow.followedFlag = true;

                    });
            }
        };

        $scope.doUnFollow = function(actUserId) {
            if (!$scope.isLoggedIn()) {
                $scope.showLogin();
            } else {
                opService.unfollow(actUserId).success(
                    function(data) {
                        opService.alertError("取消关注成功！");

                        $scope.follow.beingFollowedCount -= data.affected;
                        $scope.follow.followedFlag = false;
                    });
            }
        };

        $scope.getFollowStatus = function(actUserId) {
            $scope.follow = {};
            opService.followStatus(actUserId).success(
                function(data) {
                    $scope.follow = data.follow;
                    $scope.follow.beingFollowedCount = parseInt($scope.follow.beingFollowedCount);
                });
        };

        $scope.gotoRegister = function() {
            opService.transitionTo("app.register", true);
        };

        $scope.gotoProfile = function() {
            opService.transitionTo("app.profile");
        };

        $scope.gotoProfileOthers = function(userId) {
            opService.transitionTo("app.profileOthers", false, {
                'userId': userId
            });
        };

        $scope.gotoUpdateProfile = function() {
            opService.transitionTo("app.update-profile", true);
        };

        $scope.gotoList = function() {
            opService.transitionTo("app.list", true);
        };

        $scope.gotoDetail = function(id) {
            opService.transitionTo("app.detail", false, {
                "postId": id
            });
        };

        $scope.gotoPreference = function() {
            opService.transitionTo("app.preference");
        };


        $scope.gotoFilterTags = function() {
            opService.transitionTo("app.filter-tags");
        };

        $scope.gotoPost = function() {
            if (!$scope.isLoggedIn()) {
                $scope.showLogin();
            } else {
                opService.transitionTo("app.post");
            }
        };

        $scope.gotoComment = function(postId, replyId) {
            if (!$scope.isLoggedIn()) {
                $scope.showLogin();
            } else {
                opService.transitionTo("app.comment", false, {
                    "postId": postId,
                    "replyId": replyId
                });
            }
        };

        $scope.gotoBrowser = function(uri, extractFlag) {
            if (!$scope.isLoggedIn()) {
                $scope.showLogin();
            } else {
                $rootScope.ROOT_URI = uri;
                $rootScope.ROOT_EXTRACT_FLAG = extractFlag;
                opService.transitionTo("app.browser");
            }
        };

        $scope.gotoPrevious = function() {
            $ionicNavBarDelegate.back();
        }

        if (window.localStorage.token && !$rootScope.LOGIN_STATUS) {
            $rootScope.LOGIN_STATUS = true;
            __getUserProfile();
        }
    }
]);

app.controller('PreferenceCtrl', ["$rootScope", "$scope", "$ionicModal", "$timeout", "$upload", "opService",
    function($rootScope, $scope, $ionicModal, $timeout, $upload, opService) {
        if (!window.localStorage.preference__list) {
            window.localStorage.preference__list = "GRID";
        }

        if (!window.localStorage.preference__hide_comments) {
            window.localStorage.preference__hide_comments = "F";
        }

        $scope.preference = {
            'list': window.localStorage.preference__list,
            'hideComments': window.localStorage.preference__hide_comments == "T" ? true : false
        };

        $scope.$watch('preference', function() {
            if ($scope.preference.list) {
                window.localStorage.preference__list = $scope.preference.list;
            }
            if ($scope.preference.hideComments) {
                window.localStorage.preference__hide_comments = "T";
            } else {
                window.localStorage.preference__hide_comments = "F";
            }
        }, true);
    }
]);

app.controller('ProfileUpdateCtrl', ["$rootScope", "$scope", "$ionicModal", "$timeout", "$upload", "opService",
    function($rootScope, $scope, $ionicModal, $timeout, $upload, opService) {
        $scope.onProfilePictureUpload = function(files) {
            if (files) {
                $scope.uploadfile = true;
                var file = files[0];
                $upload.upload({
                    url: opService.CONSTS.FILE_UPLOAD_SERVICE,
                    file: file,
                    progress: function(e) {}
                }).then(function(data, status, headers, config) {
                    $scope.uploadfile = false;
                    if (data.data.uploaded) {
                        for (var key in data.data.uploaded) {
                            $scope.profile.pictureOriginal = data.data.uploaded[key];
                            $scope.profile.picture = $scope.profile.pictureOriginal + opService.CONSTS.DETAIL_SCALE;
                        }
                    }
                });
            }
        };

        // Perform the register action when the user submits the register form
        $scope.doUpdateProfile = function() {
            opService.updateUserProfile($scope.profile.pictureOriginal, $scope.profile.email, $scope.profile.mobile).success(
                function(data) {
                    $scope.gotoList();
                }).error(function(data) {
                opService.alertError("更换头像失败！");
            });
        };
    }
]);

app.controller('ProfileViewCtrl', ["$rootScope", "$scope", "$ionicModal", "$timeout", "$upload", "opService", "$state",
    function($rootScope, $scope, $ionicModal, $timeout, $upload, opService, $state) {
        $scope.getProfile = function() {
            $scope.profileView = {};
            $scope.profileUserId = $state.params.userId;

            $scope.getFollowStatus($state.params.userId);
            opService.getUserProfile($state.params.userId).success(
                function(data) {
                    if (data.profile.profilePicture) {
                        $scope.profileView.pictureOriginal = data.profile.profilePicture;
                        $scope.profileView.picture = $scope.profileView.pictureOriginal + opService.CONSTS.DETAIL_SCALE;
                    }

                    $scope.profileView.username = data.profile.username;

                    if (data.activity) {
                        $scope.profileView.activity = [];
                        for (var idx in data.activity) {
                            $scope.profileView.activity.push(opService.convertActivityItem(data.activity[idx]));
                        }
                    }

                    if ($state.params.userId) {
                        $scope.title = $scope.profileView.username + "的动态";
                    }
                });
        };

        $scope.getProfile();
        $scope.title = "您的动态";
    }
]);


app.controller('ListCtrl', ["$scope", "$rootScope", "opService",
    function($scope, $rootScope, opService) {
        $scope.clearDeals = function() {
            $scope.fromRankCount = 0;
            $scope.fromFollowTs = 0;
            $scope.fromTs = 0;
            $scope.canLoadFlag = true;
            $scope.deals = [];
            $scope.dd = {};
            $scope.activateData = {};
        };
        $scope.canLoad = function() {
            return $scope.canLoadFlag;
        };
        $scope.load = function() {
            opService.getDeals($scope.listMode, $scope.fromRankCount, $scope.fromFollowTs, $scope.fromTs).success(
                function(data) {
                    if (!data.deals.length) {
                        $scope.canLoadFlag = false;
                    } else {
                        for (var idx in data.deals) {
                            var arrItem = data.deals[idx];
                            var item = opService.convertDealItem(arrItem);
                            if (!$scope.dd[item.id]) {
                                $scope.dd[item.id] = true;

                                $scope.fromTs = arrItem.postTime;
                                $scope.fromFollowTs = arrItem.postTime;
                                $scope.fromRankCount++;

                                $scope.deals.push(item);
                            }
                        }
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };

        $scope.switchToPopular = function() {
            $scope.listMode = "popular";
            $scope.clearDeals();
            $scope.load();
        };

        $scope.switchToLatest = function() {
            $scope.listMode = "latest";
            $scope.clearDeals();
            $scope.load();
        };

        $scope.switchToFollowed = function() {
            if (!$scope.isLoggedIn()) {
                $scope.showLogin();
            } else {
                $scope.listMode = "follow";
                $scope.clearDeals();
                $scope.load();
            }
        };

        $scope.switchToPopular();
    }
]);


app.controller('DetailCtrl', ["$scope", "$rootScope", "$state", "opService", "$ionicSlideBoxDelegate",
    function($scope, $rootScope, $state, opService, $ionicSlideBoxDelegate) {
        $scope.fromTs = 0;
        $scope.comments = [];
        $scope.cd = {};
        $scope.deal = {};
        $scope.canLoadFlag = true;
        $scope.hideCommentsFlag = window.localStorage.preference__hide_comments == "T" ? true : false;

        $scope.commentData = {};

        $scope.load = function() {
            opService.getDealDetail($state.params.postId).success(
                function(data) {
                    $scope.deal = opService.convertDealItem(data.deal);
                    $scope.getFollowStatus(data.deal.authorId);

                    $ionicSlideBoxDelegate.update();
                });

            opService.getDealComments($state.params.postId, $scope.fromTs).success(
                function(data) {
                    if (!data.comments.length) {
                        $scope.canLoadFlag = false;
                    } else {
                        for (var idx in data.comments) {

                            var arrItem = data.comments[idx];
                            var item = opService.convertCommentItem(arrItem);

                            if (!$scope.cd[item.id]) {
                                $scope.cd[item.id] = true;

                                $scope.fromTs = arrItem.commentTime;
                                $scope.comments.push(item);
                            }

                        }
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };
        $scope.canLoad = function() {
            return $scope.canLoadFlag;
        };
        $scope.postComment = function() {
            opService.postDealComment($state.params.postId, $scope.commentData.title, $scope.commentData.comment, $state.params.replyId).success(
                function(data) {
                    opService.transitionTo("app.detail", false, {
                        "postId": $state.params.postId
                    });
                });

        };

        $scope.lastClicked = -1;

        $scope.clickUp = function() {
            if (!$scope.isLoggedIn()) {
                $scope.showLogin();
                return;
            }

            if ($scope.deal && moment().unix() - $scope.lastClicked > 10) {
                $scope.lastClicked = moment().unix();

                if ($scope.deal.voteUpFlag) {
                    opService.voteCancel($state.params.postId).success(
                        function(data) {
                            $scope.deal.voteUpFlag = false;
                            $scope.deal.upCount--;

                            $scope.lastClicked = -1;
                        });
                } else {
                    opService.voteUp($state.params.postId).success(
                        function(data) {
                            $scope.deal.voteUpFlag = true;
                            $scope.deal.upCount++;

                            if ($scope.deal.voteDownFlag) {
                                $scope.deal.voteDownFlag = false;
                                $scope.deal.downCount--;
                            }

                            $scope.lastClicked = -1;
                        });
                }
            }
        };

        $scope.clickDown = function() {
            if (!$scope.isLoggedIn()) {
                $scope.showLogin();
                return;
            }

            if ($scope.deal && moment().unix() - $scope.lastClicked > 10) {
                $scope.lastClicked = moment().unix();

                if ($scope.deal.voteDownFlag) {
                    opService.voteCancel($state.params.postId).success(
                        function(data) {
                            $scope.deal.voteDownFlag = false;
                            $scope.deal.downCount--;


                            $scope.lastClicked = -1;
                        });
                } else {
                    opService.voteDown($state.params.postId).success(
                        function(data) {
                            $scope.deal.voteDownFlag = true;
                            $scope.deal.downCount++;

                            if ($scope.deal.voteUpFlag) {
                                $scope.deal.voteUpFlag = false;
                                $scope.deal.upCount--;
                            }


                            $scope.lastClicked = -1;
                        });
                }
            }
        };
        $scope.load();
    }
]);

app.controller('PostCtrl', ["$scope", "$rootScope", "$upload", "opService", "$q",
    function($scope, $rootScope, $upload, opService, $q) {
        $scope.deal = {};

        if ($rootScope.ROOT_DEAL) 
        {
            if ($rootScope.ROOT_DEAL.uri) {
                $scope.deal.uri = $rootScope.ROOT_DEAL.uri;
            }
            if ($rootScope.ROOT_DEAL.vendor) {
                $scope.deal.vendor = $rootScope.ROOT_DEAL.vendor;
            }
            if ($rootScope.ROOT_DEAL.title) {
                $scope.deal.title = $rootScope.ROOT_DEAL.title;
            }
            if ($rootScope.ROOT_DEAL.regularPrice) {
                $scope.deal.regularPrice = $rootScope.ROOT_DEAL.regularPrice;
            }
            if ($rootScope.ROOT_DEAL.discountedPrice) {
                $scope.deal.discountedPrice = $rootScope.ROOT_DEAL.discountedPrice;
            }

            delete($rootScope.ROOT_DEAL);
        }

        $scope.$watch('deal.vendor', function() {
            if ($scope.deal.vendor && opService.CONSTS.VENDOR_URI_START[$scope.deal.vendor]) {
                $scope.deal.vendorUri = opService.CONSTS.VENDOR_URI_START[$scope.deal.vendor];
            }
        }, true);

        $scope.onDealPictureUpload = function($files) 
        {
            $scope.uploadfile = true;
            $scope.pictureUrls = [];

            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                $scope.uploadfile = true;
                $upload.upload({
                    url: opService.CONSTS.FILE_UPLOAD_SERVICE,
                    file: $file,
                    progress: function(e) {}
                }).then(function(data, status, headers, config) {
                    if (data.data.uploaded) 
                    {
                        for (var key in data.data.uploaded) {
                            $scope.pictureUrls.push(data.data.uploaded[key]);

                        }
                    }

                    console.log($scope.pictureUrls);
                    $scope.uploadfile = false;
                });
            }
        };

        $scope.postDeal = function() {
            opService.postDeal($scope.deal, $scope.pictureUrls).success(
                function(data) {
                    opService.transitionTo("app.list", true);
                });

        };

        $scope.loadTags = function(query) {
            var d = $q.defer();

            opService.getDealTags(query).success(function(data) {
                var tags = [];
                tags.push({
                    "text": query
                });
                for (var idx in data.tags) {
                    tags.push({
                        "text": data.tags[idx]
                    });
                }
                d.resolve(tags);
            });
            return d.promise;
        };
    }
]);

app.controller('BrowserCtrl', ["$scope", "$rootScope", "$upload", "opService", "$ionicNavBarDelegate", "$sce",
    function($scope, $rootScope, $upload, opService, $ionicNavBarDelegate, $sce) {
        $scope.clickSubmit = function() {
            if ($scope.input.srco && !$scope.input.srco.match("^http[s]?://")) {
                $scope.input.srco = "http://" + $scope.input.srco;
            }

            $scope.input.src = $sce.trustAsResourceUrl($scope.input.srco);
        };

        $scope.clickBack = function() {
            var externalContent = document.getElementById('ifm').contentWindow;
            if (externalContent) {
                var content = externalContent.document.body.innerHTML;
                var url = externalContent.location.href;
                var title = externalContent.document.getElementsByTagName("title")[0].innerHTML.trim();

                var matches;
                var myRegexp;
                var vendor = "";
                var regularPrice;
                var discountedPrice;

                myRegexp = /^(http:\/\/m.jd.com\/product\/\d+\.html).*/g;
                matches = myRegexp.exec(url);
                if (matches) {
                    vendor = "京东";
                    url = matches[1];

                    var arr = title.split("\n");
                    title = arr[0].trim();

                    discountedPrice = parseFloat(externalContent.document.getElementById("price").innerHTML.trim().replace("¥", "").trim());

                }


                $rootScope.ROOT_DEAL = {
                    'uri': url,
                    'title': title,
                    'vendor': vendor,
                    'regularPrice': regularPrice,
                    'discountedPrice': discountedPrice
                };
            }
            $ionicNavBarDelegate.back();
        };

        $scope.input = {
            'srco': $rootScope.ROOT_URI,
            'extractFlag': $rootScope.ROOT_EXTRACT_FLAG,
            'windowHeight': window.innerHeight - 160
        };

        delete($rootScope.ROOT_URI);
        delete($rootScope.ROOT_EXTRACT_FLAG);

        $scope.clickSubmit();
        $scope.canGoBack = false;

        if ($scope.$viewHistory.backView) {
            $scope.canGoBack = true;
        }

        $scope.buttonText = "获取并返回";
        if (!$scope.input.extractFlag) {
            $scope.buttonText = "返回";
        }
    }
]);
