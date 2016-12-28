novitrixApp
.controller('HomeCtrl', function($scope, $timeout, $ionicModal, $ionicLoading, Modal, $ionicSlideBoxDelegate, $rootScope, $ionicPopup, Add, Item, CurrentUser, Product) {
   
	$ionicLoading.show({template: '<img style="width:30px;" src="img/nerd-load.gif" />'});

    $scope.postAd = function(){
        Modal.showPostModal();
    }

    $scope.showProductModal = function(id) {
        Modal.showProductModal(id);
        setTimeout(function(){
          $ionicSlideBoxDelegate.update();
        },1000);
    }

    $scope.add  = {};

    Item.categorylist(function(response){
        $rootScope.list = response.data;
        $scope.image = response.data.cover_image;
        
        $timeout(function() {
            $ionicLoading.hide();
            $scope.showNow = true;
            $ionicSlideBoxDelegate.update();
        }, 3000);
    });

    Product.featuredItem(function(response) {
        $scope.featured = response.data;
        console.log(response);
    })

    $scope.recentList = [];
    $scope.recent = JSON.parse(window.localStorage.getItem('recent'));
    if ($scope.recent != null) {
        var count = 0
        for (var i = $scope.recent.length - 1; i >= 0 ; i--) {
            if(count <= 4)
            {
                Product.itemView($scope.recent[i].item_id, function(response){
                    $scope.recentList.push(response);
                    console.log($scope.recentList);
                });
            }
            count++;
        }
    }
    else {
        $scope.view = true;
    }
})