novitrixApp
.controller('ProductCtrl', function($scope, Modal, $ionicActionSheet, $stateParams, $ionicSlideBoxDelegate, $state, $ionicFilterBar, $ionicPopup, $ionicModal, $rootScope, Item, Product, CurrentUser, User) {

  $scope.sortParam = 'itemDetails.price';
  $scope.productList = [];
  $scope.products = [];
  //Category List//
  if($stateParams.id == undefined)
  {
    Item.categorylist(function(response){
      $scope.list = response.data;
    });
  }

  //Product Listing//
  if($stateParams.id != undefined)
  {
    Product.productlist($stateParams.id, function(response){
      $scope.categoryName = $stateParams.name;
      $scope.productList = response.data;
      angular.forEach($scope.productList, function(value, key){
        var v = value;
        v.text = value.itemDetails.item_title;
        $scope.products.push(v);
      });

      console.log($scope.products);
    });
  }

  //Product View//
  $scope.showProductModal = function(id) {
      Modal.showProductModal(id);
      setTimeout(function(){
        $ionicSlideBoxDelegate.update();
      },1000);
  }

  $scope.search = function(){
    $ionicFilterBar.show({
      filter: '',
      items: $scope.products,
      update: function (filteredItems, filterText) {
        console.log(filterText);
        $scope.products = filteredItems;
        if (filterText) {
          console.log(filterText);
        }
      }
    });
  }

  $scope.sortItems = function(){
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Recent' },
        { text: 'Price Ascending' },
        { text: 'Price Descending' },
      ],
      cancelText: 'Close',
      buttonClicked: function(index) {
        if(index == 0)
          $scope.sortParam = 'itemDetails.create_date';
        else if(index == 1)
          $scope.sortParam = 'itemDetails.price';
        else if(index == 1)
          $scope.sortParam = '-itemDetails.price';

        console.log($scope.sortParam);
        return true;
      }
    });
  }
})
