novitrixApp
.controller('TransactionCtrl', function($scope, $rootScope, $ionicModal, User, CurrentUser){

    $ionicModal.fromTemplateUrl('templates/transaction-detail.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.transactionDetailModal = modal;
      });
    
	$scope.showBuy = true;
   	$scope.showSell = false;
    $scope.showTrade = false;

    CurrentUser.getUser(function(user){

        if(user == null || user == undefined)
        {
            $state.go("user.login");
            return;
        }

        User.userTransaction(user, function(response) {
            $scope.buy = response.buy;
            $scope.setStatus = function(status){
                if (status == 1) {
                   return "Pending";
                }
                else if (status == 2) {
                    return "En-route";
                }
                else if (status == 3) {
                    return "Cancel";
                }
                else if (status == 4) {
                    return "Delivered";
                }
                else if (status == 5) {
                    return "Returned"
                }
            };
            
            $scope.sell = response.sell;
            $scope.trade = response.trade;
        });
    });

    $scope.buyList = function() {
    	$scope.showBuy = true;
    	$scope.showSell = false;
    	$scope.showTrade = false;
    };

    $scope.sellList = function() {
    	$scope.showBuy = false;
    	$scope.showSell = true;
    	$scope.showTrade = false;
    };

    $scope.tradeList = function() {
    	$scope.showBuy = false;
    	$scope.showSell = false;
    	$scope.showTrade = true;
    };

    $scope.transactionDetail = function(id){
        console.log(id)
        User.userTransactionDetail(id, function(response){
            console.log(response.data)
            $scope.detail = response.data;
        })
        $scope.transactionDetailModal.show();
    }

    $scope.closeModal = function(){
        $scope.transactionDetailModal.hide();
    }
});