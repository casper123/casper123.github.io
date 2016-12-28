novitrixApp
.controller('CheckoutCtrl', function($scope, $state, $ionicPopup) {
  $scope.harvest = function(){
    var confirmPopup = $ionicPopup.confirm({
     title: 'Confirm Checkout?',
     template: 'The item will shiped to the address you have entered.'
   });

   confirmPopup.then(function(res) {
     if(res) {
       $state.go('tab.home');
     } 
     else {
       
     }
   });
  }
});