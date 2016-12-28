angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope, $state, $ionicLoading, User) {
  var user =  {};
  user.id = window.localStorage.getItem("userId");
  user.userName =  window.localStorage.getItem("userName");
  user.hashKey =  window.localStorage.getItem("hasKey");
  user.token =  window.localStorage.getItem("token");
  user.status =  window.localStorage.getItem("status");
  $scope.currentUser = user;

  $scope.signout = function(){
    $state.go("user.login");
  };
})

.controller('HomeCtrl', function($scope, $state, $ionicLoading, User, Task) {
  
  User.getLoggedInUser(function(user){
    $scope.currentUser = user;

    Task.getAssignments($scope.currentUser.token, $scope.currentUser.id, "getUserAssignments", $scope.currentUser.latitude, $scope.currentUser.longitude, function(response) {
      $ionicLoading.show({
        template: '<i class="icon ion-ios7-reloading"></i>'
      });
      if(response.success == true)
      {
        $scope.assigned = response.data;
        $ionicLoading.hide();
      }
      else
      {
        $ionicLoading.hide();
        return $scope.errorMessage = response.message;
      } 
    });

    Task.getAssignments($scope.currentUser.token, $scope.currentUser.id, "getCompanyUnassign", $scope.currentUser.latitude, $scope.currentUser.longitude, function(response) {
      $ionicLoading.show({
        template: '<i class="icon ion-ios7-reloading"></i>'
      });

      if(response.success == true)
      {
        $scope.unassigned = response.data;
        $ionicLoading.hide();
      }
      else
      {
        $ionicLoading.hide();
        return $scope.errorMessage = response.message;
      } 
    });

    Task.getAssignments($scope.currentUser.token, $scope.currentUser.id, "getUserInProgress", $scope.currentUser.latitude, $scope.currentUser.longitude, function(response) {
      $ionicLoading.show({
        template: '<i class="icon ion-ios7-reloading"></i>'
      });

      if(response.success == true)
      {
        $scope.in_progress = response.data;
        $ionicLoading.hide();
      }
      else
      {
        $ionicLoading.hide();
        return $scope.errorMessage = response.message;
      } 
    });
  });
})

.controller('UserCtrl', function($scope, $stateParams) {
  
})

.controller('LoginCtrl', function($scope, $stateParams, $ionicLoading, $state, User) {

  $scope.user = {};
  $scope.doLogin = function(user)
  {
    console.log(JSON.stringify(user));
    if(!(user.username && user.password)) 
    {
      return $scope.errorMessage = 'Please supply a username and password';
    }
   
    $ionicLoading.show({
      template: '<i class="icon ion-ios7-reloading"></i>'
    });

    User.login($scope.UTIL.serialize(user), function(response) {
      console.log(JSON.stringify(response));
      if(response.success == true)
      {
        window.localStorage.setItem("userId", response.data.user_id);
        window.localStorage.setItem("loggedin", true);
        window.localStorage.setItem("userName", response.data.username);
        window.localStorage.setItem("hasKey", response.data.hash);
        window.localStorage.setItem("token", response.data.token);
        window.localStorage.setItem("status", response.data.status);
        $ionicLoading.hide();
        $state.go('app.home');
      }
      else
      {
        $ionicLoading.hide();
        return $scope.errorMessage = response.message;
      } 
    })
  };
})

.controller('LogoutCtrl', function($scope, $stateParams, $state) {
  //Clear storage here
  $state.go('user.login');
})

.controller('RegisterCtrl', function($scope, $stateParams, $ionicLoading, $state) {

  $scope.doRegister = function(user) {

    if(user.password !== user.confirmPassword) 
    {
      return $scope.errorMessage = "Passwords must match";
    }
    if(!(user.username && user.password)) 
    {
      return $scope.errorMessage = 'Please enter a username and password';
    }
    
    $ionicLoading.show({
      template: '<i class="icon ion-ios7-reloading"></i>'
    });

    $ionicLoading.hide();

  };

})

.controller('DetailCtrl', function($scope, $stateParams, $ionicLoading, $state, Task, User) {
  
  $scope.map = {center: {latitude: 4.624335, longitude: -74.063644 }, zoom: 6, bounds: {} };
  var task = {};

  $ionicLoading.show({
    template: '<i class="icon ion-ios7-reloading"></i>'
  });

  $scope.assignTask = function() {
    task.claim = 1;
    Task.beginTask($scope.UTIL.serialize(task), function(response){
      if(response.success == true)
      {
        $scope.task = response.data;
      }
      else
      {
        console.log('error');
      }
    });
  };

  $scope.beginTask = function(){
    task.beginning = 1;
    Task.beginTask($scope.UTIL.serialize(task), function(response){
      if(response.success == true)
      {
        $scope.task = response.data;
      }
      else
      {
        console.log('error');
      }
    });
  };

  $scope.delayedTask = function(){

    task.beginning = 0;
    task.complete = 0;
    task.delayed = 1;

    Task.delayedTask($scope.UTIL.serialize(task), function(response){
      if(response.success == true)
      {
        $scope.task = response.data;
      }
      else
      {
        console.log('error');
      }
    });
  };

  $scope.locationTask = function(){
    Task.assignTask($scope.UTIL.serialize(locationTask), function(response){
      if(response.success == true)
      {
        console.log('success');
      }
      else
      {
        console.log('error');
      }
    });
  };

  User.getLoggedInUser(function(user){
    $scope.currentUser = user;

    $scope.map = {center: {latitude: $scope.currentUser.latitude, longitude: $scope.currentUser.longitude }, zoom: 6, bounds: {}};
    
    task = {activity_id : $stateParams.id, user_id : $scope.currentUser.id, token : $scope.currentUser.token};
    console.log(JSON.stringify($scope.currentUser));

    Task.getDetails($stateParams.id, $scope.currentUser.id, $scope.currentUser.token, $scope.currentUser.latitude, $scope.currentUser.longitude, function(response) {
      if(response.success == true)
      {
        $scope.task = response.data[0];
        //$scope.map = {center: {latitude: $scope.task.latitude, longitude: $scope.task.longitude }};
        $scope.marker = {
          id: 1,
          coords: {
            latitude: $scope.task.latitude,
            longitude: $scope.task.longitude
          },
        };

        $ionicLoading.hide();
      }
      else
      {
        $ionicLoading.hide();
        return $scope.errorMessage = response.message;
      } 
    });

  });
})

.controller('DelayedCtrl', function($scope, $stateParams, User, Task) {
  $scope.task_id = $stateParams.id;
  var task = {};

  $scope.delayTask = function(){
    task.notes = $scope.notes;
    task.delayed = 1;
    task.activity_id = $scope.task_id;
    task.user_id = $scope.currentUser.id;
   
    console.log(JSON.stringify(task));

    Task.delayedTask($scope.UTIL.serialize(task), function(response){
      if(response.success == true)
      {
        $scope.task = response.data;
        alert("This task has been marked as delayed");
      }
      else
      {
        console.log('error');
      }
    });
  };

   User.getLoggedInUser(function(user){
    $scope.currentUser = user;
    task = {activity_id : $stateParams.id, user_id : $scope.currentUser.id, token : $scope.currentUser.token};
  });
})

.controller('CompleteCtrl', function($scope, $stateParams, User, Task) {
  $scope.clearVal = 0;
  $scope.saveVal = 0;
  $scope.task_id = $stateParams.id;
  var task = {};

  $scope.clear = function () {
    $scope.clearVal += 1;
  }

  $scope.saveToImage = function () { 
    $scope.saveVal = 99;
  }

  $scope.completeTask = function(){
    $scope.saveToImage();

    task.complete = 1;
    task.sign = $scope.check_id;
    task.imgData = $scope.sign;
    
    Task.completeTask($scope.UTIL.serialize(task), function(response){
      if(response.success == true)
      {
        $scope.task = response.data;
      }
      else
      {
        console.log('error');
      }
    });
  };

   User.getLoggedInUser(function(user){
    $scope.currentUser = user;
    task = {activity_id : $stateParams.id, user_id : $scope.currentUser.id, token : $scope.currentUser.token};
  });
});
