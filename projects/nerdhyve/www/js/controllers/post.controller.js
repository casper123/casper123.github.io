novitrixApp
.controller('PostCtrl', function($scope, $rootScope, $ionicPopup, Add, Item, CurrentUser) {
    //var user = Currentuser.getUser();
    $scope.add  = {};
    var user = null;

    CurrentUser.getUser(function(u){
        user = u
    });

    Item.categorylist(function(response){
        $rootScope.list = response.data;
        console.log(response)
    });

	$scope.postAdd = function(add){
        if ($scope.add.is_buyer == true) {
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
        add.user_id = user.user_id;
        console.log(add)
		// Add.postAdd($scope.UTIL.serialize(add),function(response){
  //       	if(response.done == true){
  //            	var alertPopup = $ionicPopup.alert({
  //           	    title: 'Your add is posted',
  //               	template: 'Your add will be live shortly.'
  //               }); 
  //               add.is_trade = false;
  //               add.is_buyer = false;
  //               $scope.add = {};
  //           }
  //           else {
  //          	    var alertPopup = $ionicPopup.alert({
  //           	    title: 'Error',
  //               	template: 'Some Error accured'
  //               }); 
  //               return false;
  //           }
		// })
	}
})