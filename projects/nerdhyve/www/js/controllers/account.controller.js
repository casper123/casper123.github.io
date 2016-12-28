novitrixApp
.controller('AccountCtrl', function($scope, $ionicModal, User, CurrentUser, Modal){
	
    var userID = null;

    CurrentUser.getUser(function(user){
        userID = user.user_id;
    });

    $ionicModal.fromTemplateUrl('templates/profile.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.profileModal = modal;
    });

    $scope.showProfileModal = function(){
        $scope.profileModal.show();
        
        User.userViewAdd(userID, function(response) {
            $scope.userAdd = response.data;
        });

        User.userViewProfile(userID, function(response) {
            console.log(response)
            $scope.user = response.data;
            $scope.trade = response.trade_count;
            $scope.buy = response.cart_count;
            $scope.product = response.products_count;
        
            if ($scope.user.gender == 0) {
                $scope.user.gender = "Male"
            }
            else if ($scope.user.gender == 1) {
                $scope.user.gender = "Female"
            }
            else{
                $scope.user.gender == "Other"
            };
        });
    }

    $scope.showProductModal = function(id) {
        Modal.showProductModal(id);
        setTimeout(function(){
          $ionicSlideBoxDelegate.update();
        },1000);
    }

    $scope.closeProfileModal = function() {
        $scope.profileModal.hide();
    }
});