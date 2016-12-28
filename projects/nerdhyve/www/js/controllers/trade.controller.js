
novitrixApp
.controller('TradeCtrl', function($scope, $state, $rootScope, $ionicPopup, $ionicModal, CurrentUser, User, Product, PaypalService){

	$ionicModal.fromTemplateUrl('templates/trade-approval.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function (modal) {
	    $scope.approvalModal = modal;
	});

	$ionicModal.fromTemplateUrl('templates/trade-approval-detail.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function (modal) {
	    $scope.approvalDetailModal = modal;
	});

    $ionicModal.fromTemplateUrl('templates/dispute.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.disputeModal = modal;
    });

    $scope.userAdd = [];
    $scope.trades = [];
    //// Trade List of a User ////
	CurrentUser.getUser(function(user){

        if(user == null || user == undefined)
        {
            $state.go("user.login");
            return;
        }

        Product.itemTradeList(user.user_id, function (response){
            $scope.trades = response.data;
            console.log($scope.trades[0].items.my_item.trade_quantity)
        })
    });

    //// Trade Approval ////
    $scope.approve = function(trade_id, status, price) {
        var params = {};
        params.trade_id = trade_id;
        params.status = status;
        console.log(params)
    	var confirmPopup = $ionicPopup.confirm({
    		template: 'Once you approve this request, your account will be charged with the value of the product as a security deposit. This deposit will be returned after deducting processing fee once your item has been delivered to the other party. <br/><Br/>Are you sure you want to approve this request?'
    	})
    	confirmPopup.then(function(res){
    		if(res){
                Product.itemTradeApproval(params, function (response){
                    console.log(response)
                    if (response.done = true) {
                        //Send to paypal here - $scope.approvalModal.show();

                        PaypalService.initPaymentUI().then(function () {
                            PaypalService.makePayment(price, 'title').then(function(resp){
                              console.log(resp);

                                Product.itemBuy($rootScope.UTIL.serialize(user),function(response){
                                    if(response.done == true){
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Success',
                                            template: '"Your trade has been confirmed. We will now put a temporary hold on the funds. <br/><br/>Please understand this is one of the many precautionary measures NerdHyve takes to ensure successful trade transactions.<br/><br/>Thanks for using NerdHyve'
                                        });
                                        currentModal.hide();
                                        currentModal = $scope.productModal;
                                    }
                                });
                            });
                        });

                        CurrentUser.getUser(function(user){
                            Product.itemTradeList(user.user_id, function (response){
                                $scope.trades = response.data;
                                console.log($scope.trades)
                            })
                        });
                          
                    }
                    else {
                        var alertPopup = $ionicPopup.alert({
                            template: 'Some Error Accurde'
                        })
                    }
                });
    		}
    	})
    	
    }

    $scope.cancel = function(trade_id, status) {
        var params = {};
        params.trade_id = trade_id;
        params.status = status;
        console.log(params)
        var confirmPopup = $ionicPopup.confirm({
            template: 'Are you sure you want to cancel this request?'
        })
        confirmPopup.then(function(res){
            if(res){
                Product.itemTradeApproval(params, function (response){
                    console.log(response)
                    if (response.done = true) {
                        CurrentUser.getUser(function(user){
                            Product.itemTradeList(user.user_id, function (response){
                                $scope.trades = response.data;
                                console.log($scope.trades)
                            })
                        });
                          
                    }
                    else {
                        var alertPopup = $ionicPopup.alert({
                            template: 'Some Error Accurde'
                        })
                    }
                });
            }
        })
        
    }

    $scope.detail = function (trade_id) {
    	$scope.approvalDetailModal.show();
        CurrentUser.getUser(function(user){
            Product.itemTradeDetails(user.user_id, trade_id, function (response){
                $scope.details = response.data;
                ////Payment Status////
                if ($scope.details.myTradeItem.payment_status == 0) {
                    $scope.details.myTradeItem.payment_status = "Pending"
                }
                else {
                    $scope.details.myTradeItem.payment_status = "Paid"
                };
                if ($scope.details.userTradeItem.payment_status == 0) {
                    $scope.details.userTradeItem.payment_status = "Pending"
                }
                else {
                    $scope.details.userTradeItem.payment_status = "Paid"
                };
                ////Shiiping Status////
                if ($scope.details.myTradeItem.shipping_status == 0) {
                    $scope.details.myTradeItem.shipping_status = "Pending"
                }
                else if ($scope.details.myTradeItem.shipping_status == 2) {
                    $scope.details.myTradeItem.shipping_status = "En Route"
                }
                else if ($scope.details.myTradeItem.shipping_status == 3) {
                    $scope.details.myTradeItem.shipping_status = "Cancelled"
                }
                else if ($scope.details.myTradeItem.shipping_status == 4) {
                    $scope.details.myTradeItem.shipping_status = "Delivered"
                }
                else {
                    $scope.details.myTradeItem.shipping_status = "Package Returned"   
                };

                if ($scope.details.userTradeItem.shipping_status == 0) {
                    $scope.details.userTradeItem.shipping_status = "Pending"
                }
                else if ($scope.details.userTradeItem.shipping_status == 2) {
                    $scope.details.userTradeItem.shipping_status = "En Route"
                }
                else if ($scope.details.userTradeItem.shipping_status == 3) {
                    $scope.details.userTradeItem.shipping_status = "Cancelled"
                }
                else if ($scope.details.userTradeItem.shipping_status == 4) {
                    $scope.details.userTradeItem.shipping_status = "Delivered"
                }
                else {
                    $scope.details.userTradeItem.shipping_status = "Package Returned"   
                }
                
                console.log($scope.details)
            })
        });
    }

    $scope.saveData = function (trade_id, id, add) {
        if (add.status == undefined) {
            add.status == null
        }
        else if (add.status == "Pending") {
            add.status = 1
        }
        else if (add.status == "En Route") {
            add.status = 2
        }
        else {
            add.status = 4
        }
        var update = {}
        update.tracking_code = add.tracking;
        update.shipping_status = add.status;
        console.log(update)

        Product.updateNumber(id, $scope.UTIL.serialize(update), function (response){
            if (response.done == true) {
                $scope.detail(trade_id);
            };
        })
    }

    $scope.dispute = function () {
        $scope.disputeModal.show();
    }

    $scope.closeModal = function() {
    	$scope.approvalModal.hide();
    	$scope.approvalDetailModal.hide();
        $scope.disputeModal.hide();
    }
});