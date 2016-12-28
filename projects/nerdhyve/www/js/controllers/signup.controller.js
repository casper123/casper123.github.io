novitrixApp
.controller('SignupCtrl', function($scope, $ionicLoading, $rootScope, $state, $ionicPopup, User, CurrentUser){

  $scope.formSubmit = false;

	$scope.signup = function(user){

      var confirmPopup = $ionicPopup.confirm({
          template: 'By signing up, you confirm to agree our <a href="" ng-click="openTerms()">terms and conditions</a> of NerdHyve'
      });

      confirmPopup.then(function(res){
          if(!res)
            return false;

          $scope.formSubmit = true;
      
          user.gcm_id = window.localStorage.getItem('push_id');
          user.udid = device.uuid;
          
          //user.gcm_id = '11';
          //user.udid = '22';

          if(user.buy != undefined)
            user.buy = 1;

          if(user.sell != undefined)
            user.sell = 1;

          if(user.trade != undefined)
            user.trade = 1;
            //User.profile_picture = $scope.user.profile_picture;
            $ionicLoading.show({template: '<img style="width:30px;" src="img/nerd-load.gif" />'});
            if(user.password != user.retype) {
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                  title: '<h2 class="title">Error</h2>',
                  template:'Password not matched.'
                })
                user.password = null;
                user.retype = null;
                return false;
            }

            else {
              User.userSignup($scope.UTIL.serialize(user),function(response){

                if (response.data == null) {
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                    title: '<h2 class="title">Error</h2>',
                    template:response.message
                  })
                  user.email = null;
                  return false;
                };

                if(response.done == true) {
                  user.user_id = response.data;
                  user.loggedIn = true;
                  CurrentUser.setUser(user);
                  $rootScope.currentUser = user;
                  $scope.userData = response.data;
                  $ionicLoading.hide();
                  $state.go('tab.home');
                }
                else {
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                    title: '<h2 class="title">Error</h2>',
                    template: 'Some error accured.'
                  })
                }
              });
            }

      });

  }
})