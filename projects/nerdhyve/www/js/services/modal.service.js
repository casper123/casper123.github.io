novitrixApp
.service('Modal', function ($http, $ionicLoading, $ionicModal, $cordovaCamera, $ionicSlideBoxDelegate, $ionicActionSheet, $rootScope, $ionicPopup, Add, Item, Product, CurrentUser, User, Message, PaypalService) {

	var modalService = this;
	var currentModal = null;

	$scope = $rootScope.$new();
	CurrentUser.getUser(function(u){
        $rootScope.currentUser = u;
        console.log($rootScope.currentUser);
    }); 

	$scope.item = null;
	$scope.itemPhoto = [];
	$scope.email = null;

	$scope.showUserItem = false;
	$scope.showDisclaimer = false;

	var cameraOptions = {
      quality: 80,
      destinationType: 0,
      sourceType: 1,
      allowEdit: false,
      encodingType: 0,
      saveToPhotoAlbum: true,
      correctOrientation:true
    };

	$ionicModal.fromTemplateUrl('templates/product-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function (modal) {
	    $scope.productModal = modal;
	});

	$ionicModal.fromTemplateUrl('templates/buy-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.buyModal = modal;
	});

	$ionicModal.fromTemplateUrl('templates/trade.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.tradeModal = modal;
	});

	$ionicModal.fromTemplateUrl('templates/forgot.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function (modal) {
	    $scope.forgotModal = modal;
	});

	modalService.showPostModal = function(){
		$scope.stepOne = true;

		$ionicModal.fromTemplateUrl('templates/post.html', {
		   	scope: $scope,
		   	animation: 'slide-in-up'
		}).then(function (modal) {
		   	$scope.postModal = modal;
		   	$scope.postModal.show();
			currentModal = $scope.postModal;
		});
	}

	modalService.closeModal = function(){
		currentModal.hide();
	}

	modalService.showProductModal = function(id){

	    $scope.sold = false;
	    $scope.buy = false;
	    $scope.trade = false;
	    $scope.own = false;
	    Product.itemView(id, function(response){

			$scope.item = response.data;
			$scope.image = response.image_data;
		 	// console.log($rootScope.currentUser.user_id)

		 	if ($scope.item.user_id == $rootScope.currentUser.user_id) {
		 		$scope.buy = true;
				$scope.trade = true;
				$scope.own = true;
		 	};
			if ($scope.item.is_buyer == 0) {
				$scope.buy = true;
			};

			if ($scope.item.is_trade == 0) {
				$scope.trade = true;
			};

			if($scope.item.quantity == 0 || $scope.item.quantity == null) {
				$scope.sold = true;
				$scope.buy = true;
				$scope.trade = true;
			};

			$scope.productModal.show();
			setTimeout(function(){
	          $ionicSlideBoxDelegate.update();
	        },2000);
			
		});

		currentModal = $scope.productModal;

		var recentItem = JSON.parse(window.localStorage.getItem('recent'));
	    if (recentItem == null) {
	      recentItem =[{item_id: id}];
	      window.localStorage.setItem('recent', JSON.stringify(recentItem));
	    }
	    else {
	      	var itemToAdd = {item_id: id};

	      	for(var k in recentItem) 
			{
			   	if(JSON.stringify(recentItem[k]) == JSON.stringify(itemToAdd))
			   	{
			   		return;
			   	}
			}

	      	recentItem.push(itemToAdd);
	      	window.localStorage.setItem('recent', JSON.stringify(recentItem));
	    }
	}

	modalService.showBuyModal = function(){
	    $rootScope.currentUser.quantity = 1;
	    $scope.user = $rootScope.currentUser;
	    $scope.err = false;
	    $scope.buyModal.show();
	    //currentModal = $scope.buyModal;
	}

	modalService.showTradeModal = function(id){
		
    	$scope.currentUserItemId = id;
	    User.userViewAdd($rootScope.currentUser.user_id, function(response) {
	        $scope.userAdd = response.data;
	        $scope.tradeModal.show();
	    });
	}

	modalService.showConfirm = function(id) {
		
		$ionicModal.fromTemplateUrl('templates/confirm-trade.html', {
		scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.confirmTradeModal = modal;

			Product.itemView($scope.currentUserItemId, function(response) {
			  	$scope.currentUserItem = response.data;
			  	
			  	Product.itemView(id, function(response){
				  $scope.myItem = response.data;
				  if(response.image_data[0])
				  	$scope.myImage = response.image_data[0].item_image;

				  $scope.confirmTradeModal.show();
				});
			  	
			  	if(response.image_data[0].item_image != undefined)
			  		$scope.currentUserImage = response.image_data[0].item_image;
			});
		});		
	}

	modalService.postAd = function(add){
		$ionicLoading.show();
		if (add.is_buyer == true) {
            add.is_buyer = 1
        }
        else{ 
            add.is_buyer = 0
        };

        if (add.is_trade == true) {
            add.is_trade = 1
        }
        else{ 
            add.is_trade = 0
        };

        add.user_id = $rootScope.currentUser.user_id;
        add.item_image = JSON.stringify($scope.itemPhoto);
        // console.log(add);
		Add.postAdd($rootScope.UTIL.serialize(add),function(response){
        	if(response.done == true) {
        		$ionicLoading.hide();
             	var alertPopup = $ionicPopup.alert({
            	    title: 'Your add is posted',
                	template: 'Your add will be live shortly.'
                }); 
                add.is_trade = false;
                add.is_buyer = false;
                $scope.add = {};
                currentModal.hide();
            }
            else {
            	$ionicLoading.hide();
           	    var alertPopup = $ionicPopup.alert({
            	    title: 'Error',
                	template: 'Some Error accured'
                });
            }
		})
	}

	modalService.buy = function(user){
		user.item_id = $scope.item.item_id;
	    user.buyer_id = $rootScope.currentUser.user_id;
	    user.seller_id = $scope.item.user_id;
	    user.price = $scope.item.price * parseInt(user.quantity);
	    user.zipcode = user.zip_code;
	    user.contact_number = user.number;

	    if (user.quantity == 0 || user.quantity == null) {
	        user.quantity = 1;
	    }
	    
	    if (parseInt(user.quantity) > parseInt($scope.item.quantity)) {
	      $scope.err = true;
	      return false;
	    }

	    else if (user.quantity <= $scope.item.quantity) 
	    {
	      var confirmPopup = $ionicPopup.show({
	        title: '',
	        template: 'Are you sure you want to purchase'+" "+user.quantity+" "+ 'item(s) of' +" "+ $scope.item.item_title +" "+ 'for' +" $"+ user.price + '?',
	        scope: $scope,
	        buttons: [
						{ 
					      	text: 'No' 
					    },
					    {
					        text: '<b>Yes</b>',
					        type: 'button-positive',
					        onTap: function(e) {
					        	PaypalService.initPaymentUI().then(function () {
							        PaypalService.makePayment(user.price, 'title').then(function(resp){
							          console.log(resp);

							        	Product.itemBuy($rootScope.UTIL.serialize(user),function(response){
								            if(response.done == true){
									            var alertPopup = $ionicPopup.alert({
									                title: '',
									            	template: 'Your purchase has been confirmed. You will be notified once the package is on its way. <Br/>Thanks for using NerdHyve'
									            });
									            currentModal.hide();
									            currentModal = $scope.productModal;
								          	}
								        })
							        });
							    }); 

							    // Product.itemBuy($rootScope.UTIL.serialize(user),function(response){
								   //          if(response.done == true){
									  //           var alertPopup = $ionicPopup.alert({
									  //               title: '',
									  //           	template: 'Thank you for placing your order using NerdHyve. Our representative will contact you shortly.'
									  //           });

									  //           CurrentUser.getUser(function(currentUser){
									  //           	currentUser.address = user.address;
									  //           	currentUser.city = user.city;
									  //           	currentUser.state = user.state;
									  //           	currentUser.zip_code = user.zip_code;
									  //           	currentUser.number = user.number;
									  //           	currentUser.country = user.country;
											// 		CurrentUser.setUser(currentUser);
									            	
									  //           	currentModal.hide();
									  //           	currentModal = $scope.productModal;
        			// 							});
								   //        	}
								   //      })
					        }
				      	}
					]
	      	});
	      // confirmPopup.then(function(res){
	      // 	console.log(res)
	      //   if (res) {
	          
	      //   }
	      //   else {
	      //     var alertPopup = $ionicPopup.alert({
	      //       title: 'Error',
	      //       template: 'Some Error accured'
	      //     }); 
	      //     return false;
	      //   }
	      // });
	    };
	}

	modalService.addFavourite = function(id){
		var favouriteItem = [{item_id: ''}];

		var favouriteItem = JSON.parse(window.localStorage.getItem('favourite'));
		if (favouriteItem == null) 
		{
		    favouriteItem =[{item_id: id}]
		    window.localStorage.setItem('favourite', JSON.stringify(favouriteItem));
		}
		else 
		{
			var itemToAdd = {item_id: id};

	      	for(var k in favouriteItem) 
			{
			   	if(JSON.stringify(favouriteItem[k]) == JSON.stringify(itemToAdd))
			   	{	
			   		var alertPopup = $ionicPopup.alert({
			   			title:'',
			   			template:'This item already is in your list.'
			   		});
			   		return false;
			   	}
			}

		  	favouriteItem.push(itemToAdd);
		  	window.localStorage.setItem('favourite', JSON.stringify(favouriteItem));
		}

		var alertPopup = $ionicPopup.alert({
            title: 'Success!',
            template: 'Item has been added to your favourite list'
        });
	}

	modalService.tradeItem = function(user_id, userItem_id, my_id, myItem_id, userQty, myQty){
		
		var item = {};
		User.userViewProfile(user_id, function(response) {
		  	var userItemDetails = response.data;
			item.UserTrade = {
	            item_id: userItem_id,
	            user_id: user_id,
	            address: userItemDetails.address,
	            city: userItemDetails.city,
	            state: userItemDetails.state,
	            zipcode: userItemDetails.zip_code,
		 		contact_number: userItemDetails.number,
		 		quantity: userQty
			};
		  
		  	User.userViewProfile(my_id, function(response) {
		    	myItemDetails = response.data;

				item.MyTrade = {
    		        item_id: myItem_id,
    		        user_id: my_id,
    		        address: myItemDetails.address,
    		        city: myItemDetails.city,
    		        state: myItemDetails.state,
    		        zipcode: myItemDetails.zip_code,
    		        contact_number: myItemDetails.number,
    		        quantity: myQty
				};
		   		
		   		item.user_request = my_id;
		    
		    	var test = JSON.stringify(item);
		    	var data = {data : test};
		    	console.log(data)
		    	Product.itemTrade($scope.UTIL.serialize(data) ,function(response) {
			  	if(response.done == true){
				    var alertPopup = $ionicPopup.alert({
				      title: 'Success',
				      template: 'Your request has been submitted to the trader successfully. Once this trade is approved, we will put a temporary hold on funds. <br/><br/>Please understand that this is one of the many precautionary measures NerdHyve takes to ensure successful trade transactions.<br/><Br/>Thanks for using NerdHyve.'
				    });

				    $scope.closeConfirmTradeModal();
			  	}
			  	else
			  	{
			  		var alertPopup = $ionicPopup.alert({
				      title: 'Error',
				      template: 'An error occured while porcessing your request. Please try again later'
				    });
			   	}
			});

			modalService.closeModal();
			currentModal = $scope.tradeModal;
			modalService.closeModal();
			currentModal = $scope.productModal;
		    
		  	});                  
		});
	}

	modalService.showForgotModal = function(){
		$scope.forgotModal.show();
		currentModal = $scope.forgotModal;
	}

	modalService.resetPassword = function(d) {
        console.log(d.email)
        $ionicLoading.show();
        var postData = {email : d.email};
        User.forgotPassword($scope.UTIL.serialize(d), function(response){
            console.log(response)
            if(response.done == false){
                var alertPopup = $ionicPopup.alert({
                    title:'',
                    template:response.message
                });
                $ionicLoading.hide();
            }
            else {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title:'',
                    template:'Recovery password has been sent on your email address.'
                });
                modalService.closeModal();
            }
        });
    }

    $scope.removeImage = function($index){
    	$scope.itemPhoto.splice($index, 1);
	}

    $scope.reset = function(d) {
    	modalService.resetPassword(d);
    }

	$scope.closeModal = function(){
		currentModal.hide();
	}

	$scope.showTradeModal = function(id) {
		modalService.showTradeModal(id);
	}

	$scope.showBuyModal = function(id){
	    modalService.showBuyModal();
	}

	$scope.postAdd = function(add){
        modalService.postAd(add);
	};

	$scope.harvest = function(user){
	    modalService.buy(user);
	}

	$scope.showConfirm = function(id){
		modalService.showConfirm(id);
	}

	$scope.closeModal = function(){
		modalService.closeModal();
	}

	$scope.closeBuyModal = function(){
		$scope.buyModal.hide();
	}

	$scope.closeTradeModal = function(){
		$scope.tradeModal.hide();
	}

	$scope.closeConfirmTradeModal = function(){
		$scope.confirmTradeModal.remove();
	}

	$scope.closePostModal = function(){
		$scope.postModal.remove();
	}

	$scope.addFavourite = function(id){
		modalService.addFavourite(id);
	}

	$scope.done = function(user_id, userItem_id, my_id, myItem_id, msg, userQty, myQty){

		//modalService.tradeItem(user_id, userItem_id, my_id, myItem_id, userQty, myQty);

		// if(msg != undefined && msg != "") 
		// {
		// 	var user = {};
		// 	user.from_user_id = my_id;
		// 	user.to_user_id = user_id;
		// 	user.message_desc = msg;

		// 	Message.newMessage($scope.UTIL.serialize(user), function(response){
		// 		console.log(response)
		// 	});
		// }
		// else {
		// 	console.log("EMPTY")
		// }

		var confirmPopup = $ionicPopup.confirm({
    		template: 'Once your request is approved by the seller; we will deduct the value of your item from your account as security deposit. Your deposit will be returned after deducting processing fee once your item bas been delivered to the other party.<br/><br/>Are you sure you want to request the trade?'
    	})
    	confirmPopup.then(function(res){
    		if(res)
    		{
    			modalService.tradeItem(user_id, userItem_id, my_id, myItem_id);
				if(msg != undefined && msg != "") 
				{
					var user={};
					user.from_user_id = my_id;
					user.to_user_id = user_id;
					user.message_desc = msg;

					Message.newMessage($scope.UTIL.serialize(user), function(response){
						console.log(response)
					});
				}
				else {
					console.log("EMPTY")
				}

				$scope.confirmTradeModal.remove();
    		}
    	});
	}

	$scope.showForgotModal = function(){
	    modalService.showForgotModal();
	}	

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
					    $scope.itemPhoto.push(image);
				    }, function(err) {
				      	console.log(err);
				    });
				}
				else if(index == 1)
				{
					cameraOptions.sourceType = 0;
					$cordovaCamera.getPicture(cameraOptions).then(function(imageData) {
					    var image = "data:image/jpeg;base64," + imageData;
					    $scope.itemPhoto.push(image);
				    }, function(err) {
				      	console.log(err);
				    });
				}
				return true;
			}
		});
	}
});