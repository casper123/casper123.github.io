novitrixApp
.controller('FavouriteCtrl', function($scope, Modal, $ionicLoading, $state, Product){
	
	$scope.showfav = false;
	$scope.list = [];
	$scope.favourite = JSON.parse(window.localStorage.getItem('favourite'));

	if ($scope.favourite != null) {
		for (var i = 0; i < $scope.favourite.length; i++) {
			Product.itemView($scope.favourite[i].item_id, function(response){
		    	$scope.list.push(response);
		    });
		}
	}
	else {
		$scope.showfav = true;
	}


	$scope.showProductModal = function(id) {
        Modal.showProductModal(id);
        setTimeout(function(){
          $ionicSlideBoxDelegate.update();
        },1000);
    }

});