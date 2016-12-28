novitrixApp
.controller('ViewAddCtrl', function($scope, $ionicLoading, $ionicModal, $stateParams, $rootScope, $ionicPopup, Add, User, CurrentUser, Product, Item){

	var id = null;
    CurrentUser.getUser(function(u){

        if(u == null || u == undefined)
        {
            $state.go("user.login");
            return;
        }

        id = u.user_id;

        User.userViewAdd(id, function(response) {
            $scope.userAdd = response.data;
        });
    }); 

	$ionicModal.fromTemplateUrl('templates/product-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
	    $scope.productModal = modal;
	});

	$ionicModal.fromTemplateUrl('templates/edit-add-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
	    $scope.editAddModal = modal;
	});

    $scope.showProductModal = function(id) {
    	$scope.sold = false;
	    $scope.buy = false;
	    $scope.trade = false;

    	Product.itemView(id, function(response){
	    	$scope.productModal.show();
	      	$scope.item = response.data;
	      	$scope.image = response.image_data;
	      	$scope.buy = true;
	      	$scope.trade = true;
	      	$scope.own = true;
	    });
    }

    $scope.showEditPost = function(id) {
    	$scope.editAddModal.show();

    	Item.categorylist(function(response){
    		$scope.list = response.data;
    	});

    	Product.itemView(id, function(response){
    	   $scope.item = response.data;
    	   // $scope.list.category = response.data.category;
    	   $scope.image = response.image_data;
           console.log($scope.image)
    	   if ($scope.item.is_buyer == 1) {
            $scope.item.is_buyer = true;
           }
           else {
            $scope.item.is_buyer = false;
           };
           if ($scope.item.is_trade == 1) {
            $scope.item.is_trade = true;
           }
           else {
            $scope.item.is_trade = false;
           }
        });
    }

    $scope.update = function(item){
        console.log(item.category_id);
    	$ionicLoading.show({template: '<img style="width:30px;" src="img/nerd-load.gif" />'});
    	if (item.is_buyer == true) {
    		item.is_buyer = 1;
    	}
    	else {
    		item.is_buyer = 0;
    	};

    	if (item.is_trade == true) {
    		item.is_trade = 1;
    	}
    	else {
    		item.is_trade = 0;
    	}
        // ABC = "aklsjkljsklajsljl"
        // $scope.item.item_image=[ABC];
       

    	Add.editAdd($scope.UTIL.serialize(item), item.item_id, function(response){
    		console.log(response)
    		if (response.done == true) {
    			$ionicLoading.hide();
    			var alertPopup = $ionicPopup.alert({
    				title:'',
    				template:'Your add has been updated'
    			});
    			$scope.editAddModal.hide();
    		}
    		else {
    			$ionicLoading.hide();
    			var alertPopup = $ionicPopup.alert({
    				title:'',
    				template:'ERROR!! Something went wrong.'
    			});
    		}
    	});
    }

    $scope.deleteAd = function(item_id){
    	console.log(item_id)
	    var confirmPopup = $ionicPopup.confirm({
	    	title: 'Confirm Delete',
	     	template: 'Are you sure you want to delete this product?'
	   	});
		confirmPopup.then(function(res) {
	    	if(res) {
	       		Add.deleteAdd($scope.UTIL.serialize(item_id),function(response){
	       			if(response.done == true) {
	       				var alertPopup = $ionicPopup.alert({
	       					title:'',
	       					template:'Your Add has been deleted successfuly.'
	       				});
                        User.userViewAdd(id, function(response) {
                            $scope.userAdd = response.data;
                        });
	       				
	       			}
	       			else {
	       				var alertPopup = $ionicPopup.alert({
	       					title:'',
	       					template:'Something went wrong. Try again later.'
	       				});
	       			}
	       		});
	     	}
	   	});
	}

    $scope.deleteImage = function(image_id, item_id) {
        var confirmPopup = $ionicPopup.confirm({
            title:'',
            template:'Are you sure to delete this image?'
        })
        confirmPopup.then(function(res){
            if (res) {
                Product.itemDelete($scope.UTIL.serialize(image_id), function(response){
                    if (response.done == true) {
                        var alertPopup = $ionicPopup.alert({
                            title:'',
                            template: response.message
                        });
                        Product.itemView(item_id, function(response){
                            $scope.image = response.image_data;   
                        })
                    }
                    else {
                        var alertPopup = $ionicPopup.alert({
                            title:'',
                            template:response.message
                        }) 
                    }
                });
            };
        })
    }

    $scope.closeModal = function() {
    	$scope.productModal.hide();
		$scope.editAddModal.hide();    	
    }
});