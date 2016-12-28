//angular.module('starter.controllers', [])
novitrixApp
.controller('MainCtrl', function($scope, $ionicHistory, $ionicLoading, $ionicPopup, $state, $ionicFilterBar, $ionicHistory, $ionicActionSheet, $ionicModal, CurrentUser){

  $scope.showBuy = true;


  $ionicModal.fromTemplateUrl('templates/privacy-policy.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.privacyModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/terms-and-conditions.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.termsModal = modal;
  });

  $scope.showProductModal = function(){
    $scope.productModal.show();
  }

  $scope.showTerms = function(){
    $scope.termsModal.show();
  }

  $scope.showPrivacy = function(){
    $scope.privacyModal.show();
  }

  $scope.closeModal = function(){
    
    $scope.termsModal.hide();
    $scope.privacyModal.hide();
  }

  $scope.buyProduct = function(){
    
  }

  $scope.filter = function(){
    //show filter dialog
  }

  $scope.goBack = function(){
    $ionicHistory.goBack();

  }

  $scope.select = function(){
    $state.go('tab.confirm-trade');
  }

  $scope.yes = function(){
     var alertPopup = $ionicPopup.alert({
      title: 'Confirm',
      template: 'Your message has been sent. Wait for trade approval. We will notify you shortly.'
    });

    alertPopup.then(function(res) {
      $state.go('tab.home');
    });
  };

  $scope.signout = function(){
    CurrentUser.removeUser();
    $state.go('user.login');
  };
})

.controller('TradeCtrl', function($scope, $state) {
  $scope.select = function(){
    $state.go('tab.confirm-trade');
  }
})

.controller('ConfirmTradeCtrl', function($scope, $state, $ionicPopup) {
  $scope.yes = function(){
     var alertPopup = $ionicPopup.alert({
       title: 'Confirm',
       template: 'Your message has been sent. Wait for trade approval. We will notify you shortly.'
     });

     alertPopup.then(function(res) {
       $state.go('tab.home');
     });
  };
});
