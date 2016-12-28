novitrixApp
.controller('ProfileCtrl', function($scope, $rootScope, $ionicPopup, $cordovaCamera, $ionicActionSheet, $ionicLoading, $state, User, CurrentUser){
    
    $scope.user = {};

    CurrentUser.getUser(function(user){
        $scope.user = user;

        $scope.user.password = null;
        $scope.user.dob = new Date($scope.user.dob);
    });

    $scope.itemPhoto = [];
    var cameraOptions = {
      quality: 80,
      destinationType: 0,
      sourceType: 1,
      allowEdit: false,
      encodingType: 0,
      saveToPhotoAlbum: true,
      correctOrientation:true
    };

    $scope.uploadPostPhoto = function(){
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Take Photo' }, 
                { text: 'Upload From Gallery' },
            ],
            cancelText: 'Close',
            buttonClicked: function(index) {
                if(index == 0)
                {
                    cameraOptions.sourceType = 1;
                    $cordovaCamera.getPicture(cameraOptions).then(function(imageData) {
                        var image = "data:image/jpeg;base64," + imageData;
                        $scope.user.profile_image = image;
                    }, function(err) {
                        console.log(err);
                    });
                }
                else if(index == 1)
                {
                    cameraOptions.sourceType = 0;
                    $cordovaCamera.getPicture(cameraOptions).then(function(imageData) {
                        var image = "data:image/jpeg;base64," + imageData;
                        $scope.user.profile_image = image;
                    }, function(err) {
                        console.log(err);
                    });
                }
                return true;
            }
        });
    }

	$scope.editProfile = function(user){
        $ionicLoading.show({template: '<img style="width:30px;" src="img/nerd-load.gif" />'});
        console.log(user.pass+ "<br>" + user.retype)
        if(user.pass != user.retype) {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
              title: '<h2 class="title">Error</h2>',
              template:'Password not matched.'
            })
            user.pass = null;
            user.retype = null;
            return false;
        }
        else {
            if (user.username !=null) {
        		User.editProfile($scope.UTIL.serialize(user),function(response){
                    if(response.done == true){
                        var alertPopup = $ionicPopup.alert({
                            title:'',
                            template:'Your profile has ben updated successfully'
                        });

                        $ionicLoading.hide();
                        CurrentUser.setUser(user);
                        $scope.userData = response.data;
                    }
                    else{
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title:'',
                            template:response.message
                        });
                    }
                });
            }
            else {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title:'',
                    template:'Required Fields!!'
                }); 
            }
        }
    }
})