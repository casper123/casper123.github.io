novitrixApp
.controller('UserCtrl', function($scope, $ionicLoading, $state, $rootScope, $ionicPopup, $cordovaFacebook, User, Modal, CurrentUser){

    
    CurrentUser.getUser(function(u){
        if (u != null) {
            $rootScope.currentUser = u;
            $state.go('tab.home');
        }
    });  

    
    $scope.user = { username : null, password : null };
	$scope.login = function(user) {
        if(user.username != null && user.password != null) {
            $ionicLoading.show({
                template: '<img style="width:30px;" src="img/nerd-load.gif" />'
            });
            User.login($scope.UTIL.serialize(user),function(response){
                if(response.done == true) {
                    response.data.loggedIn = true;
                    //console.log(response.data);
                    //CurrentUser.setUser(response.data);
                    window.localStorage.setItem('user', JSON.stringify(response.data));
                    $rootScope.currentUser = response.data;
                    $ionicLoading.hide();
                    
                    // var push = PushNotification.init({
                    //     android: {
                    //         senderID: "853647514112"
                    //     }
                    // });

                    // push.on('registration', function(data) {
                    //      data.registrationId
                    //      alert(data.registrationId);
                    // });

                    // push.on('notification', function(data) {
                    //     // data.message,
                    //     // data.title,
                    //     // data.count,
                    //     // data.sound,
                    //     // data.image,
                    //     // data.additionalData
                    // });

                    // push.on('error', function(e) {
                    //      e.message
                    // });
                    $state.go('tab.home');
                }
                else {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: '<h2 class="title">Error</h2>',
                        template: 'Invalid UserName or Password.'
                    }); 
                    return false;
                }
            }); 
        } 
        else {
            // $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Please fill the required fields.'
            });
        }
    }


    $scope.confirmSignup = function(signupType){
        console.log('h');
        var confirmPopup = $ionicPopup.confirm({
            template: 'By signing up, you confirm to agree our <a href="" ng-click="openTerms()">terms and conditions</a> of NerdHyve'
        });
        confirmPopup.then(function(res){
            if(res)
            {
                if(signupType == 'facebook')
                    $scope.facebookLogin();
                else if(signupType == 'gplus')
                    $scope.googleSignIn();
            }
        });
    }

    $scope.facebookLogin = function() {

        var appID = 598814510268635;
        var version = "v2.6";
        //$cordovaFacebook.browserInit(appID, version);

        $cordovaFacebook.login(["public_profile", "email"]).then(function(response) {
        
            $ionicLoading.show({template: '<img style="width:30px;" src="img/nerd-load.gif" />'});
            user = {facebook_id : response.authResponse.userID};
            console.log(JSON.stringify(user));

            $cordovaFacebook.api("/" + response.authResponse.userID + "?fields=id,email,first_name,last_name", ["public_profile", "email"]).then(function(success) {
                console.log(JSON.stringify(success));

                User.login($scope.UTIL.serialize(user),function(response){
                    console.log(JSON.stringify(response));

                    if(response.done == true) {
                        response.data.loggedIn = true;
                        CurrentUser.setUser(response.data);
                        $rootScope.currentUser = response.data;
                        $ionicLoading.hide();
                        $state.go('tab.home');
                    }
                    else
                    {
                        //Register user
                        user.first_name = success.first_name;
                        user.last_name = success.last_name;
                        user.username = user.facebook_id;
                        user.email = success.email;
                        user.password = user.facebook_id;
                        user.buy = 1;
                        user.sell = 1;
                        user.trade = 1;
                        user.gcm_id = window.localStorage.getItem('push_id');
                        user.udid = device.uuid;

                        console.log(JSON.stringify(user));

                        User.userSignup($scope.UTIL.serialize(user),function(response){
                            console.log(JSON.stringify(response));
                            if(response.done == true) {
                                console.log(response);
                                user.loggedIn = true;
                                user.user_id = response.data;
                                CurrentUser.setUser(user, function(){
                                    $rootScope.currentUser = response.data;
                                    $state.go('tab.home');
                                    $ionicLoading.hide();
                                });
                            }
                            else
                            {
                                alert('An error occured! Please try again later');
                                $ionicLoading.hide();
                            }
                        });
                    }
                });
            }, function (error) {
              console.log(JSON.stringify(error));
              $ionicLoading.hide();
            });

        }, function (error) {
            console.log(error);
            $ionicLoading.hide();
        });
    }

    $scope.googleSignIn = function() {
        
        window.plugins.googleplus.login(
          {},
          function (user_data) {

            console.log(JSON.stringify(user_data));

            $ionicLoading.show({template: '<img style="width:30px;" src="img/nerd-load.gif" />'});
            user = {email : user_data.email, googleplus : 1};

            User.login($scope.UTIL.serialize(user),function(response){
                console.log(JSON.stringify(response));

                if(response.done == true) {
                    response.data.loggedIn = true;
                    CurrentUser.setUser(response.data);
                    $rootScope.currentUser = response.data;
                    $ionicLoading.hide();
                    $state.go('tab.home');
                }
                else
                {
                    //Register user
                    user.first_name = user_data.displayName;
                    user.last_name = user_data.displayName;
                    user.username = user_data.email;
                    user.email = user_data.email;
                    user.password = user_data.email;
                    user.buy = 1;
                    user.sell = 1;
                    user.trade = 1;
                    user.gcm_id = window.localStorage.getItem('push_id');
                    user.udid = device.uuid;

                    console.log(JSON.stringify(user));

                    User.userSignup($scope.UTIL.serialize(user),function(response){
                        console.log(JSON.stringify(response));

                        if(response.done == true) {
                            user.loggedIn = true;
                            user.user_id = response.data;
                            CurrentUser.setUser(user);
                            $rootScope.currentUser = response.data;
                            $state.go('tab.home');
                            $ionicLoading.hide();
                        }
                        else
                        {
                            alert('An error occured! Please try again later');
                            $ionicLoading.hide();
                        }
                    });
                }
            }); 
          },
          function (msg) {
            console.log(JSON.stringify(msg));
            $ionicLoading.hide();
          }
        );
    };
    
    $scope.forgot = function() {
        Modal.showForgotModal();
    }
})