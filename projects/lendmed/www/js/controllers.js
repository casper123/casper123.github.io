angular.module('starter.controllers', ['ngCordova'])

.filter('myDateFormat', function myDateFormat($filter){
  return function(text){
    var  tempdate= new Date(text.replace(/-/g,"/"));
    return $filter('date')(tempdate, "mediumDate");
  }
})

.filter('myTimeFormat', function myDateFormat($filter){
  return function(text){
    var  tempdate= new Date(text.replace(/-/g,"/"));
    return $filter('date')(tempdate, "mediumTime");
  }
})

.controller('RequestCtrl', function($rootScope, $state, $q, $ionicPopup, $scope, $ionicActionSheet, $rootScope, $ionicModal, $ionicLoading, $ionicPush, $ionicUser, Request, Inventory,User,userDetails, $cordovaToast ) {
  $scope.requestdata = {};  
	$scope.currentUser=userDetails.getUser();
  $scope.acceptData = { estimatedTime : "" };
  $scope.requestdata.request_type = 0;
  $scope.totalIncoming = 0;
  $scope.totalOutgoing = 0;
  $scope.nonPharmAutoComplete = true;
  $scope.showNetwoks = true;
  $scope.hideDosage = false;
  $ionicModal.fromTemplateUrl('templates/updateRequest.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.updatemodal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeupdateRequest = function() {
    $scope.updatemodal.hide();
  };

  // Open the request modal
  $scope.updateRequest = function(requestId) {
    Request.getRequest($scope.currentUser.token, requestId,  function(response) {
      $scope.requestdata = response.data[0];
      //$scope.pvtNetworks = $scope.requestdata.pvtNetworks;
      
      //console.log($scope.pvtNetworks);
      if($scope.requestdata.is_driver == 1)
        $scope.requestdata.is_driver = true;
      else
        $scope.requestdata.is_driver = false;
        
      if($scope.requestdata.is_urgent == 1)
        $scope.requestdata.is_urgent = true;
      else
        $scope.requestdata.is_urgent = false;

      $scope.itemInventoryId =  $scope.requestdata.inventory_id;
      $scope.requestItem = $scope.requestdata.addeditem; 
      //$scope.requestdata.expiry_date = new Date($scope.requestdata.expiry_date);
      //$scope.requestdata.addeditem = response.data[0].inventory_id;
      $scope.showRequestType($scope.requestdata.request_type);
      
      // if($scope.requestdata.request_sub_type == 1)
      // {
      //   $scope.private = true;
      //   $scope.showCheckboxes = false;
      // }
      // if($scope.requestdata.request_sub_type == 2)
      // {
      //   $scope.direct = true;
      //   $scope.showDropdownList = false;
      // }
      $scope.showRequestTypeOption($scope.requestdata.request_sub_type);
      
      
      //$scope.updatemodal.show();
    });
  };



  // Create the add modal
  $ionicModal.fromTemplateUrl('templates/addRequest_modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.requestmodal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeAddRequest = function() {
    $scope.requestmodal.hide();
  };

  // Open the request modal
  $scope.addRequest = function(requestId) {
    
    $scope.data = {};
    $scope.requestdata = {};
    $scope.requestdata.pvtNetworkIds = [];

    if(requestId > 0)
    {
      $scope.updateRequest(requestId);
    }


    $scope.requestmodal.show();
    //$state.go("tab.newrequest");
    //console.log('x');
  };
  
  $scope.pharmAutoComplete = true;
  $scope.nonPharmAutoComplete = false;
  $scope.requestTypeName = 'Non Pharmaceutical';
  $scope.requestdata.request_type = 1;
  $scope.buttonPharma = "button-positive";
  $scope.buttonNonPharma = "button-calm";

  $scope.showRequestType = function(requestType)
  {
    $scope.requestType = requestType;
    $scope.requestdata.request_type = requestType;
    $scope.getPvtNetwork();
    if(requestType == 1)
    {
      $scope.requestTypeName = 'Pharmaceutical';
      $scope.pharmAutoComplete = false;
      $scope.nonPharmAutoComplete = true;
      $scope.hideDosage = false;

      $scope.buttonPharma = "button-positive";
      $scope.buttonNonPharma = "button-calm";
    }
    else
    {
      $scope.requestTypeName = 'Non Pharmaceutical';
      $scope.pharmAutoComplete = true;
      $scope.nonPharmAutoComplete = false;
      $scope.hideDosage = true;

      $scope.buttonPharma = "button-calm";
      $scope.buttonNonPharma = "button-positive";
    }
  }

  var cbm = function (query) {
  	
    var ritems;
    var defer = $q.defer();
    
    Inventory.search(query, $scope.currentUser.token,$scope.currentUser.user_id, function(response) {
      if(response.success == true)
      {
        $ionicLoading.hide();
        //$scope.requestmodal.hide();            
        defer.resolve(response.items) ;   
      }
      else
      {
        $ionicLoading.hide();
        defer.reject(response.message);
      } 
    });
    return defer.promise;
  };



  $scope.callbackMethod = function (query){
    //$scope.items =[];
    // if(data.length == 1){ ($scope.items).push(data);console.log($scope.items);}
    return cbm(query).then(function(data){  $scope.ndc_num = data[0].PRODUCTNDC;$scope.itemName=data[0].name; $scope.inventoryId=data[0].id;return data;});
  }

  $scope.clickedMethod = function (callback){
    // print out the selected item
    //console.log(callback.item); 
    // print out the component id
    //console.log(callback.componentId);
    // print out the selected items if the multiple select flag is set to true and multiple elements are selected
    //console.log(callback.selectedItems);
    $scope.items = callback.selectedItems;
  }
  

  $scope.requestdata.pvtNetworkIds = [];
  $scope.pvtNetworks = [];  
  //get user pvt network
  $scope.getPvtNetwork = function()
  {
    User.getUserPvtNetwork($scope.currentUser.token,$scope.currentUser.company_id,$scope.requestType,function(response){
      $scope.checkBoxes = [];
      if(response.success == true)
        $scope.pvtNetworks =  response.data;
        console.log($scope.pvtNetworks); 
    });
  }
  $scope.showRequestTypeOption = function(requestSubType)
  {
    if(requestSubType == 1)
    {
      $scope.getPvtNetwork();
      $scope.showCheckboxes = true;
      $scope.showDropdownList = false;
      $scope.showNetwoks = false;
    }
    else if(requestSubType == 2)
    {
      $scope.getPvtNetwork(); 
      $scope.showDropdownList = true;
      $scope.showCheckboxes = false;
      $scope.showNetwoks = true;
    }
    else
    {
      $scope.showDropdownList = false;
      $scope.showCheckboxes = false;
      $scope.showNetwoks = true;
    }  
  }


  $scope.doRequest = function(requestdata)
  {

    // if($scope.requestdata.photo == undefined || $scope.requestdata.photo == ''){
    //   alert("Please provide badge image");
    //   return;
    // }
    // if(requestdata.addeditem.length == 0)
    //   return $scope.errorMessage = 'Please select an item';
    if(requestdata.days_needed == 0)
      return $scope.errorMessage = 'Please insert days before needed';
    if(requestdata.addeditem == ''){
      requestdata.addeditem = $scope.itemName;
    }
    console.log(requestdata);
    

    if (requestdata.request_type == 0)
      requestdata.ndc_num = $scope.ndc_num;

    if(requestdata.request_sub_type > 0)
    {
      if(requestdata.pvtNetworkIds.length > 0)
      {
        requestdata.pvtNetworkIdsReal =[];
        var j = 0;
        for (var i = requestdata.pvtNetworkIds.length - 1; i >= 0; i--) 
        {
          if(requestdata.pvtNetworkIds[i] == true)
          {
            requestdata.pvtNetworkIdsReal[j] = $scope.pvtNetworks[i].id; 
            j++;
          }
        }; 
      }
    }

    //for update
    if(requestdata.request_id > 0)
    {
      if($scope.inventory_id == undefined)
        requestdata.addedNewItem = $scope.itemName;
    }

    $ionicLoading.show({
      template: '<i class="icon ion-ios7-reloading"></i>'
    });

    requestdata.photo = $scope.requestdata.photo;
    Request.add($scope.UTIL.serialize(requestdata), $scope.currentUser.token,$scope.currentUser.user_id, function(response) {
      if(response.success == true)
      {
	       $ionicLoading.hide();
         
        var alertPopup = $ionicPopup.alert({
           title: 'Success!',
           template: 'Your Request Has Been Saved Successfully'
        });

        $scope.doRefresh();

        if($scope.requestdata.request_id == undefined)
          $state.go("tab.request");
        else
        {
          $scope.updatemodal.hide();
          $scope.doRefresh();
        }
      }
      else
      {
        $ionicLoading.hide();
        return $scope.errorMessage = response.message;
      } 
    });

    $scope.requestmodal.hide();
  }
	
	$scope.getRequestsFunc=function(){
    Request.getExisting($scope.currentUser.token, $scope.currentUser.user_id, 'getExisting',  function(response) {
      $ionicLoading.show({
  		template: '<i class="icon ion-ios7-reloading"></i>'
      });
	  	//console.log(response);
		  if(response.success == true)
		  {   
		    $scope.requests = response.data;
        //console.log($scope.requests);
        $scope.totalOutgoing = response.data.length;
        $rootScope.ourRequestCount = response.data.length;
        $scope.$broadcast('scroll.refreshComplete');
		    $ionicLoading.hide();
		    
        $rootScope.incomingBadge = response.data.length;
		  }
		  else
		  {
		    $ionicLoading.hide();
		    $scope.$broadcast('scroll.refreshComplete');
		    return $scope.errorMessage = response.message;
		  }
    });
	}
  console.log();
  $scope.getIncomingRequestsFunc=function()
  {  
		Request.getRequests($scope.currentUser.token, $scope.currentUser.user_id, 'getRequests',  function(response) {
      $ionicLoading.show({
        template: '<i class="icon ion-ios7-reloading"></i>'
      });
      //console.log(response);
	    if(response.success == true)
      {
  	    $scope.incomingrequests = response.data;
        $scope.totalIncoming = 0;
        //console.log(response.data);
        for (var i=0; i<response.data.length; i++){
          if($scope.incomingrequests[i].request_type == $scope.currentUser.company_type){
            $scope.totalIncoming++;
            $rootScope.incomingCount++;
          }
        }
        //$rootScope.incomingCount = ($rootScope.incomingCount/2);
        //$scope.totalIncoming = response.data.length;

        //$rootScope.incomingCount = response.data.length;

        $scope.$broadcast('scroll.refreshComplete');
        $ionicLoading.hide();
      }
      else
      {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        return $scope.errorMessage = response.message;
      }
 	  });  
	}

  $scope.getClaimedRequestsFunc=function(){
    Request.getRequests($scope.currentUser.token, $scope.currentUser.user_id, 'getClaimed',  function(response) {
          if(response.success == true){
           $rootScope.claimedCount = response.data.length;
          }
          else
          {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            return $scope.errorMessage = response.message;
          }      
    });
  }
	
  $scope.getIncomingRequestsFunc();
  $scope.getClaimedRequestsFunc();
	$scope.getRequestsFunc();
	  
	$scope.doRefresh = function() 
  {
	  $scope.getRequestsFunc();
	  $scope.getIncomingRequestsFunc();
    $scope.getClaimedRequestsFunc();
  };


  $scope.acceptRequest = function(requestId)
  {
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="acceptData.estimatedTime" />',
      title: 'Please Enter Estimated Minutes Until Ready',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Claim</b>',
          type: 'button-balanced',
          onTap: function(e) {
            console.log($scope.acceptData.estimatedTime);
            if (!$scope.acceptData.estimatedTime) {
              e.preventDefault();
            } 
            else {
                Request.approve($scope.currentUser.user_id, requestId, $scope.acceptData.estimatedTime, $scope.currentUser.token, function(){
                  $scope.doRefresh();
                });
            }
          }
        }
      ]
    });
  }

  $scope.showActionsheet = function()
  {
    console.log('insdie camera');
    navigator.camera.getPicture(gotPic, onFail, {
      quality:50, 
      destinationType:navigator.camera.DestinationType.DATA_URL,
      sourceType:navigator.camera.PictureSourceType.CAMERA
    });
  }

  function gotPic(imageData) 
  {
    $ionicLoading.show({
      template: '<i class="icon ion-ios7-reloading"></i>'
    });

    $scope.requestdata.photo = 'data:image/jpeg;base64,' + imageData;
    $ionicLoading.hide();
    return;
  }

  function onFail(message) {
    navigator.notification.alert(message, null, "Failed", "Ok");
  }

 

})


.controller('IncomingCtrl', function($scope, $ionicPopup, $rootScope, $ionicModal, $ionicLoading, $ionicPush, $ionicUser, Request, userDetails) {
			
      $scope.requestdata={};
			$scope.currentUser=userDetails.getUser();
      $scope.acceptData = { estimatedTime : "" };
    	//console.log( "x"+ window.localStorage.getItem("token"));
		// $scope.getRequestsFunc=function(){
		//     //console.log ($scope.action+$scope.originSearchKey);
  // 		Request.getRequests($scope.currentUser.token, $scope.currentUser.user_id, 'getRequests',  function(response) {
  //       $ionicLoading.show({
  //         template: '<i class="icon ion-ios7-reloading"></i>'
  //       });
  //   	  //console.log(response.data);
	  
  //       if(response.success == true)
  //       {
  // 	      $scope.requests = response.data;
  //         console.log($scope.requests);
  //         $scope.$broadcast('scroll.refreshComplete');
  //         $ionicLoading.hide();
  //         $scope.data = {
  //   		  badgeCount : response.data.length
  //   		  };
  //       }
  //       else
  //       {
  //         $ionicLoading.hide();
  //         $scope.$broadcast('scroll.refreshComplete');
  //         return $scope.errorMessage = response.message;
  //       }
  //     });
    $scope.requests = [];
      
			//console.log( "x"+ window.localStorage.getItem("token"));
		  $scope.getRequestsFunc=function(){

  		  //console.log ($scope.action+$scope.originSearchKey);
  		   
  		  Request.getRequests($scope.currentUser.token, $scope.currentUser.user_id, 'getRequests',  function(response) {
          $ionicLoading.show({
            template: '<i class="icon ion-ios7-reloading"></i>'
          });
	        //console.log(response.data);
	  
          if(response.success == true)
          {
            $scope.requests = response.data;
            //$scope.totalIncoming = 0;
            // for (var i=0; i<response.data.length; i++){
            //   if($scope.requests[i].request_type == $scope.currentUser.company_type)
            //     $rootScope.totalIncoming++;
            // }
            console.log($rootScope.totalIncoming);
            //$rootScope.incomingCount = response.data.length;
            $scope.$broadcast('scroll.refreshComplete');
            $ionicLoading.hide();
          }
          else
          {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            return $scope.errorMessage = response.message;
          }
      
	      });
	  
	  }

	  $scope.getRequestsFunc();
	  
	  
	  $scope.doRefresh = function() {
      console.log("i");
		  $scope.getRequestsFunc();
    	 };

    $scope.acceptRequest = function(requestId)
    {
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="acceptData.estimatedTime" />',
        title: 'Please Enter Estimated Minutes Until Ready',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Claim</b>',
            type: 'button-positive',
            onTap: function(e) {
              console.log($scope.acceptData.estimatedTime);
              if (!$scope.acceptData.estimatedTime) {
                e.preventDefault();
              } else {
                Request.approve($scope.currentUser.user_id, requestId, $scope.acceptData.estimatedTime, $scope.currentUser.token, function(){
                  $scope.getRequestsFunc();
                });
              }
            }
          }
        ]
      });

      /*Request.approve($scope.currentUser.user_id, requestId, $scope.currentUser.token, function(){
        $scope.getRequestsFunc();
      });*/
    }
	
})
.controller('ClaimedCtrl', function($scope, $rootScope, $ionicModal, $ionicLoading, $ionicPush, $ionicUser, Request, userDetails) {
			
      $scope.driverPhoto = "";

      $ionicModal.fromTemplateUrl('templates/addDriver.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.drivermodal = modal;
      });

      $ionicModal.fromTemplateUrl('templates/addDetail.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.addDetailmodal = modal;
      });

       //get currentUser
      $scope.requestdata={};
      $scope.currentUser=userDetails.getUser();
      //console.log( "x"+ window.localStorage.getItem("token"));
      
      $scope.showActionsheet = function()
      {
        navigator.camera.getPicture(gotPic, onFail, {
          quality:50, 
          destinationType:navigator.camera.DestinationType.DATA_URL,
          sourceType:navigator.camera.PictureSourceType.CAMERA
        });
        
      }

      function gotPic(imageData) 
      {
        $ionicLoading.show({
          template: '<i class="icon ion-ios7-reloading"></i>'
        });

        $scope.driverPhoto = 'data:image/jpeg;base64,' + imageData;
        $ionicLoading.hide();
        return;
      }

      function onFail(message) {
        navigator.notification.alert(message, null, "Failed", "Ok");
      }
      
      // Triggered in the login modal to close it
      $scope.closeupdateRequest = function() {
        $scope.drivermodal.hide();
      };

      $scope.addDriverModal = function(requestId){
        $scope.requestId = requestId;
        $scope.drivermodal.show();
      }

      $scope.addDriver = function(driverData){
        
        driverData.token = window.localStorage.getItem("token"); 
        driverData.driver_photo = $scope.driverPhoto; 

        //add custom image and sign
        //driverData.driver_photo ='iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAAAAAAcD2kOAAACRElEQVR4Xu3Y627aQBCG4d7at9rlILsVoERVMFScnKQUKCTYEAg+zY1XKHhjk4ZfHvJn3ht4tCuPd7Xf8EV9FSywwAILLLDAAgsssMACq/ZkuUuI4t1yfKOuBjsPERWKpu5V4PqfjM7KZk1+2EvoPyW/mGE9o09aaE7YPNOnBTU+WK/pQoFmg2d0sQUbvKTL9blgNy0yyXZz1tqwwB5wb9X9yLnWIdHMfsIc3thsqIFrwb9pp+HRsaQNGG8eBHPPAI2njW1cPawORCOokIjSNtA9rf3QBVop5UWqcrhDREkDbSIaAj7ZfGBAtk7l8OSIzIA57RW6VKgLtbOwXy1sZ7iFZjKEORThgykseVU5/LaoABi78KiUB8fC+8rhON9XDczL8ByIczipHD4hrwZAUIYDYEt5XDD5AMIyHAIbPjif1dQBFh9OpYhvq/cFpleGe6wf15N1OjBR0Y15x8m30FaV58mDemH8gdySbVg8H+ke6HP+MlVsqbQNeKfdjntALeI8JDAlW9QGTG8Rhou+AfBAtkdUD/+g99KBgs3JrJu5DHB5endDBwBcF/hLthk4YCelUvH2JU7q6JAtabDAGNCHRlAbsvWudq/e6+JIz8EFm5DK3RXvBGvNBqO+OT8Pfes+18AHw5R2u4VmavdZgxMGBm+Uvfq9lfQBZhhOPrdpE638KaIBfhj4Po2P3OR0B4of2R9fbPrWX4Uad8l+5d9oedkTWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUW+B+f8FQOzkc4pwAAAABJRU5ErkJggg==';
        //driverData.driver_sign ='iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAAAAAAcD2kOAAACRElEQVR4Xu3Y627aQBCG4d7at9rlILsVoERVMFScnKQUKCTYEAg+zY1XKHhjk4ZfHvJn3ht4tCuPd7Xf8EV9FSywwAILLLDAAgsssMACq/ZkuUuI4t1yfKOuBjsPERWKpu5V4PqfjM7KZk1+2EvoPyW/mGE9o09aaE7YPNOnBTU+WK/pQoFmg2d0sQUbvKTL9blgNy0yyXZz1tqwwB5wb9X9yLnWIdHMfsIc3thsqIFrwb9pp+HRsaQNGG8eBHPPAI2njW1cPawORCOokIjSNtA9rf3QBVop5UWqcrhDREkDbSIaAj7ZfGBAtk7l8OSIzIA57RW6VKgLtbOwXy1sZ7iFZjKEORThgykseVU5/LaoABi78KiUB8fC+8rhON9XDczL8ByIczipHD4hrwZAUIYDYEt5XDD5AMIyHAIbPjif1dQBFh9OpYhvq/cFpleGe6wf15N1OjBR0Y15x8m30FaV58mDemH8gdySbVg8H+ke6HP+MlVsqbQNeKfdjntALeI8JDAlW9QGTG8Rhou+AfBAtkdUD/+g99KBgs3JrJu5DHB5endDBwBcF/hLthk4YCelUvH2JU7q6JAtabDAGNCHRlAbsvWudq/e6+JIz8EFm5DK3RXvBGvNBqO+OT8Pfes+18AHw5R2u4VmavdZgxMGBm+Uvfq9lfQBZhhOPrdpE638KaIBfhj4Po2P3OR0B4of2R9fbPrWX4Uad8l+5d9oedkTWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUW+B+f8FQOzkc4pwAAAABJRU5ErkJggg==';
        
        Request.addDriverData($scope.requestId,$scope.UTIL.serialize(driverData), function(response) {
          if(response.data == true)
            $scope.drivermodal.hide();
        });
      } 

      $scope.addDetailModal = function(requestId){
        $scope.requestId = requestId;
        $scope.addDetailmodal.show();
      }
      
      $scope.addDetails = function(details)
      {
        var token = window.localStorage.getItem("token"); 
        
        if(details.exDate != undefined)
          details.expiry_date = details.exDate.getDate() +'-'+details.exDate.getMonth()+1 +'-'+details.exDate.getFullYear();
        
        Request.addMoreDetails($scope.UTIL.serialize(details),token,$scope.requestId, function(response) {
          if(response.data == true)
            $scope.addDetailmodal.hide();
        });
      }

      $scope.hideAddDetailsModal = function()
      {
        $scope.addDetailmodal.hide(); 
      }

		  $scope.getRequestsFunc=function(){

  		  //console.log ($scope.action+$scope.originSearchKey);
		   
  		  Request.getRequests($scope.currentUser.token, $scope.currentUser.user_id, 'getClaimed',  function(response) {
        $ionicLoading.show({
          template: '<i class="icon ion-ios7-reloading"></i>'
        });
  	 
        if(response.success == true){
          $scope.requests = response.data;
          $rootScope.claimedCount = $scope.requests.length;
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
          $scope.data = {
    		    badgeCount : response.data.length
    		  };
        }
        else
        {
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          return $scope.errorMessage = response.message;
        }
      
	   });
	  
	  }

	  $scope.getRequestsFunc();
    
    $scope.doRefresh = function() {
		  $scope.getRequestsFunc();
    };

    $scope.cancelClaimedRequest = function(requestId){
      Request.cancel($scope.currentUser.user_id, requestId, $scope.currentUser.token, function(){
        $scope.getRequestsFunc();
      });
    }

    $scope.updateRequest = function(requestId, status){
      Request.updateStatus(requestId, status, $scope.currentUser.token, function(){
        $scope.getRequestsFunc();
      });
    }

    $scope.statusClass = function(status) {
      if(status == 1)
        return "button-balanced";
      else if(status == 2)
        return "button-calm";
      else if(status == 3)
        return "button-royal";
      else if(status == 4)
        return "button button-positive";
    }
    
})

.controller('ExistingCtrl', function($scope, $rootScope, $ionicModal, $ionicLoading, $ionicPush, $ionicUser, Request, userDetails) {
		$scope.requestdata={};
		$scope.currentUser=userDetails.getUser();
		$scope.getRequestsFunc=function(){
		  Request.getExisting($scope.currentUser.token, $scope.currentUser.user_id, 'getExisting',  function(response) {
        $ionicLoading.show({
        template: '<i class="icon ion-ios7-reloading"></i>'
        });
        if(response.success == true)
        {
          $scope.requests = response.data;
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.hide();
          $scope.data = {badgeCount : response.data.length};
        }
        else
        {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            return $scope.errorMessage = response.message;
          }
      });
	  }
	  
    $scope.getRequestsFunc();
	  
	  
	  $scope.doRefresh = function() {
		  $scope.getRequestsFunc();
    };

    $scope.cancelRequest = function(requestId) {
      Request.cancelOwn(requestId, $scope.currentUser.token, function(){
        $scope.getRequestsFunc();
      });
    }

    $scope.receivedRequest = function(requestId){
      Request.receivedOwn(requestId,$scope.currentUser.token,function(){
        $scope.getRequestsFunc();
      });
    }

    $scope.returnRequest = function(requestId){
      Request.returnOwn(requestId,$scope.currentUser.token,function(){
        $scope.getRequestsFunc();
      });
    }
})

.controller('UserCtrl', function($scope,$state, $rootScope, $ionicUser, $ionicPush, $ionicLoading, User, userDetails) {
	
	$scope.user = {};
  $scope.doLogin = function(user)
  { //console.log(JSON.stringify(user));
    if(!(user.location_id)) 
    {
      return $scope.errorMessage = 'Please supply a location ID';
    }
   
    $ionicLoading.show({
      template: '<i class="icon ion-ios7-reloading"></i>'
    });

    User.login($scope.UTIL.serialize(user), function(response) {
      if(response.success == true)
      {
        console.log(response);
        window.localStorage.setItem("userId", response.data.user_id);
        window.localStorage.setItem("companyId", response.data.company_id);
        window.localStorage.setItem("company_type", response.data.company_type);
        window.localStorage.setItem("loggedin", true);
        window.localStorage.setItem("userName", response.data.username);
        window.localStorage.setItem("userImage", response.data.user_image);
        window.localStorage.setItem("hasKey", response.data.hash);
        window.localStorage.setItem("token", response.data.token);
        window.localStorage.setItem("authenticationsId", response.data.authentications_id);
        window.localStorage.setItem("status", response.data.status);
        
        console.log('here0');
        User.saveToken($rootScope.token, window.localStorage.getItem("token"), function(response){
          console.log("token saved in server");
          $ionicLoading.hide();
          $state.go('tab.request');
        });
      }
      else
      {
        $ionicLoading.hide();
        return $scope.errorMessage = response.message;
      } 
    })
  };
  
  
  var user =  {};
  user.user_id = window.localStorage.getItem("userId");
  user.company_id = window.localStorage.getItem("companyId");
  user.company_type = window.localStorage.getItem("company_type");
  user.username = window.localStorage.getItem("userName");
  user.email =  window.localStorage.getItem("email");
  user.firstname =  window.localStorage.getItem("firstname")
  user.lastname =  window.localStorage.getItem("lastname");
  user.token =  window.localStorage.getItem("token");
  user.authentications_id =  window.localStorage.getItem("authenticationsId");
  user.status =  window.localStorage.getItem("status");
  user.loggedin =  window.localStorage.getItem("loggedin");
  $scope.currentUser=user;
 	userDetails.setUser(user);
  
  //console.log("token:"+$scope.currentUser.token);
  
  /**
   * Identifies a new user with the Ionic User service (read the docs at http://docs.ionic.io/identify/). This should be
   * called before any other registrations take place.
   **/
  $scope.identifyUser = function() {
    console.log('Ionic User: Identifying with Ionic User service');

    var user = $ionicUser.get();
    if(!user.user_id) {
      // Set your user_id here, or generate a random one.
      user.user_id = $ionicUser.generateGUID()
    };

    // Add some metadata to your user object.
    angular.extend(user, {
      name: 'Ionitron',
      message: 'I come from planet Ion'
    });

    // Identify your user with the Ionic User Service
    $ionicUser.identify(user).then(function(){
      alert('Successfully identified user ' + user.name + '\n ID ' + user.user_id);
    });
  };
})

.controller('PushCtrl', function($http, $scope, $rootScope, $ionicPush, $ionicApp) {
  // Put your private API key here to be able to send push notifications from within the app.
  // TODO: Add your private API key here if you want to push from your device.
  $scope.privateKey = '';

  // Write your own code here to handle new device tokens from push notification registration as they come in.
  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
    alert("Successfully registered token " + data.token);
    console.log('Ionic Push: Got token ', data.token, data.platform);
    $scope.token = data.token;
  });

  /**
   * Registers the currently identified Ionic User for push notifications on the current device. This should either pass
   * a user object to identify or be called after $ionicUser.identify()
   * (read the docs at http://docs.ionic.io/push/installation/).
   **/
  $scope.pushRegister = function() {
    console.log('Ionic Push: Registering user');

    // Register with the Ionic Push service.  All parameters are optional.
    $ionicPush.register({
      canShowAlert: true, //Should new pushes show an alert on your screen?
      canSetBadge: true, //Should new pushes be allowed to update app icon badges?
      canPlaySound: true, //Should notifications be allowed to play a sound?
      canRunActionsOnWake: true, // Whether to run auto actions outside the app,
      onNotification: function(notification) {
        // Handle new push notifications here
        // console.log(notification);
        return true;
      }
    }).then(function(deviceToken) {
      //Save the device token, if necessary
    });
  };

  /**
   * If you've added your Private API Key, you can send a push notification directly fro the current device.  Since the
   * app iwll be open when this happens, you probably will not see the notification handled by the OS, but it should
   * still be handled by whatever function you define.
   **/
  $scope.sendPush = function() {
    if ($scope.privateKey) {
      alert('A notification will be sent to you 5 seconds after you close this alert.  They can take a few minutes to arrive.');
      var appId = $ionicApp.getApp().app_id;
      var auth = btoa($scope.privateKey + ':'); // Base64 encode your key
      var req = {
        method: 'POST',
        url: $ionicApp.getValue('push_api_server') + '/api/v1/push',
        headers: {
          'Content-Type': 'application/json',
          'X-Ionic-Application-Id': appId,
          'Authorization': 'basic ' + auth
        },
        data: {
          "tokens": [$scope.token],
          "notification": {
            "alert":"Hello World!"
          }
        }
      };

      setTimeout(function(){
        $http(req).success(function(resp){
            console.log("Ionic Push: Push success!");
          }).error(function(error){
            console.log("Ionic Push: Push error...");
          });
      }, 5000);
    } else {
      alert('Uh-oh!  To use this function, add your Private API Key to line 36 of controllers.js');
    }
  };
})

.controller('AnalyticsCtrl', function($scope, $ionicAnalytics) {

  // Track a fake purchase event.
  $scope.trackPurchase = function() {
    console.log("Ionic Analytics: Tracking a fake purchase.");
    $ionicAnalytics.track('purchase', {
      item_id: 101,
      item_name: 'A-Trak player'
    });
    alert('Tracked purchase of A_Trak player ID 101.');
  };

  // Track a fake review event
  $scope.trackReview = function() {
    console.log("Ionic Analytics: Tracking a fake review.");
    $ionicAnalytics.track('review', {
      star_rating: 5,
      reviewer_name: 'John',
      content: 'Awesome app!'
    });
    alert('Tracked 5-star review from John, "Awesome app!"');
  };
})

.controller('DeployCtrl', function($scope, $rootScope, $ionicDeploy) {
  $scope.updateMinutes = 2;

  // Handle action when update is available
  $rootScope.$on('$ionicDeploy:updateAvailable', function() {
    console.log('Ionic Deploy: New update available!');
    $scope.hasUpdate = true;
  });

  // Stop checking for updates form Ionic Deploy
  $scope.stopCheckingForUpdates = function() {
    $ionicDeploy.unwatch();
  };

  // Update app code with new release from Ionic Deploy
  $scope.doUpdate = function() {
    $ionicDeploy.update().then(function(res) {
      console.log('Ionic Deploy: Update Success! ', res);
    }, function(err) {
      console.log('Ionic Deploy: Update error! ', err);
    }, function(prog) {
      console.log('Ionic Deploy: Progress... ', prog);
    });
  };

  // Check Ionic Deploy for new code
  $scope.checkForUpdates = function() {
    console.log('Ionic Deploy: Checking for updates');
    $ionicDeploy.check().then(function(hasUpdate) {
      console.log('Ionic Deploy: Update available: ' + hasUpdate);
      $rootScope.lastChecked = new Date();
      $scope.hasUpdate = hasUpdate;
    }, function(err) {
      console.error('Ionic Deploy: Unable to check for updates', err);
    });
  }
})

.controller('RequestDetailCtrl', function($scope,$state,$stateParams,$ionicLoading,Request,userDetails,Visitor,Log,Comment){

  $scope.currentUser = userDetails.getUser();
  $ionicLoading.show({
        template: '<i class="icon ion-ios7-reloading"></i>'
    });
  //get request comments
  Comment.getComments($stateParams.requestId,$scope.currentUser.token,function(comments){
    if(comments.success == true)
      $scope.comments = comments.data;
  });

  $scope.getRequestDetail = function()
  {
    $ionicLoading.show({
        template: '<i class="icon ion-ios7-reloading"></i>'
    });
     //get request details
    Request.getRequest($scope.currentUser.token,$stateParams.requestId,function(response){
      if(response.success == true)
      {
        $scope.requestDetails = response.data[0];
        console.log($scope.requestDetails);
        if($scope.requestDetails.request_type == 0)
        {
          $scope.requestDetails.request_type_name = 'Pharmaceutical';
          $scope.requestDetails.lot_no = $scope.requestDetails.lot_no;
          $scope.requestDetails.ndc_num = $scope.requestDetails.ndc_num;
          $scope.requestDetails.views = $scope.requestDetails.views;
          $scope.requestDetails.userViews = $scope.requestDetails.user_views;
          $scope.requestDetails.companyViews = $scope.requestDetails.company_views;
        } 
        else
          $scope.requestDetails.request_type_name = 'Non Pharmaceutical';
      }
    });
    //Get visitors
    Visitor.getVisitorCount($scope.currentUser.user_id,1,$scope.currentUser.token,function(users){
      if(users.success == true)
        $scope.userVisits = users.data.users;
    });

    //get commanies visits on request
    Visitor.getVisitorCount($scope.currentUser.user_id,2,$scope.currentUser.token,function(companies){
      if(companies.success == true)
        $scope.companyVisits = companies.data.companies;  
    });
   
    //insert visiting log
    Log.addLog($scope.currentUser.user_id,$scope.currentUser.company_id,$stateParams.requestId,1,$scope.currentUser.token,function(response){
    });

    $ionicLoading.hide();
  }

  

  $scope.getRequestDetail();

  //get acivity log
  Log.getLogs($stateParams.requestId,$scope.currentUser.token, function(logs){
    //console.log(logs);
    if(logs.success == true)
      $scope.logs = logs.data;
  });

  //insert comment on request
  $scope.postComment = function(comment)
  {
    console.log('jere');
    $ionicLoading.show({
      template: '<i class="icon ion-ios7-reloading"></i>'
    });

    var token = window.localStorage.getItem("token"); 
    Comment.saveComment($scope.currentUser.user_id,token,$stateParams.requestId,comment.text,function(response){
        console.log(response);
        if(response.success == true)
        {
          $scope.comments = response.data.comments;
          $scope.logs = response.data.logs;
        }
    });
    $ionicLoading.hide();
  };


  $ionicLoading.hide();



  // Request.getRequestDetails($stateParams.requestId , function(response){
  //   console.log(response);
  // });
});


/*angular.factory('Toast', function($rootScope, $timeout, $ionicPopup, $cordovaToast) {
	    return {
	        show: function (message, duration, position) {
	        	message = message || "There was a problem...";
	        	duration = duration || 'short';
	        	position = position || 'top';
 
	        	if (!!window.cordova) {
	        		// Use the Cordova Toast plugin
					$cordovaToast.show(message, duration, position);	        		
	        	}
	        	else {
                    if (duration == 'short') {
                        duration = 2000;
                    }
                    else {
                        duration = 5000;
                    }
 
  					var myPopup = $ionicPopup.show({
  						template: "<div class='toast'>" + message + "</div>",
  						scope: $rootScope,
  						buttons: []
  					});
  
  					$timeout(function() {
  						myPopup.close(); 
  					}, duration);
	        	}
			}
		};
	});
*/
