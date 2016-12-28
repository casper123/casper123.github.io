apb.controller('MemberCtrl', function($scope, $state, $rootScope, MemberService, fileUrl) {
  
  $rootScope.showAddMember = true;
  $scope.listData = {};
  $scope.fileUrl = fileUrl;
  $scope.query = "";

  $scope.memberList = function(){
    MemberService.getMemberList(function(response) {
     $scope.listData = response;
     $scope.$broadcast('scroll.refreshComplete');
    });
  }
  
  $scope.memberList();
});

apb.controller('MemberDetailCtrl', function($scope, $state, $rootScope, $stateParams, MemberService, ToastService, fileUrl, $ionicModal) {
  
  $scope.showFailMessage = false;
  $scope.buttonTitle = "edit";

  $scope.error = {};
  $scope.error.messageKey = null;

  $scope.member = {};
  $rootScope.showEditMember = true;
  $scope.fileUrl = fileUrl;

  $scope.load = function(){
    MemberService.getMember($stateParams.memberId, function(responseData) {
      $scope.member = responseData;

      $scope.member.firstname = responseData.attributes.firstname;
      $scope.member.surname = responseData.attributes.lastname;
      $scope.member.dateOfBirth = new Date(responseData.attributes.birthday * 1000);
      $scope.member.memberSince = new Date(responseData.attributes.memberSince * 1000);
      $scope.member.emailAddress = responseData.attributes.email;
      $scope.member.mobile = responseData.attributes.mobile;
      $scope.member.phone = responseData.attributes.phone;
      $scope.member.address = responseData.attributes.address;
      $scope.member.note = responseData.attributes.notes;
      console.log($scope.member);
    });
  }

  $ionicModal.fromTemplateUrl('templates/member/edit-member.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $rootScope.openEditModal = function() {
    $scope.modal.show();
  };

  $scope.doEditMember = function(editMember) {

    $scope.error.messageKey = null;
    $scope.showFailMessage = false;
    
    if(editMember !== undefined && !editMember.$valid) return;
    
    var requestData = {};
    requestData.attributes = {};

    requestData.id = $stateParams.memberId;
    requestData.memberNumber = $scope.member.memberNumber;
    requestData.attributes.firstname = $scope.member.firstname;
    requestData.attributes.lastname = $scope.member.surname;
    
    requestData.attributes.birthday = Math.floor($scope.member.dateOfBirth.getTime() / 1000);
    requestData.attributes.birthday = requestData.attributes.birthday.toString();
    
    requestData.attributes.memberSince = Math.floor($scope.member.memberSince.getTime() / 1000);
    requestData.attributes.memberSince = requestData.attributes.memberSince.toString();
    
    requestData.attributes.email = $scope.member.emailAddress;
    requestData.attributes.mobile = $scope.member.mobile;
    requestData.attributes.phone = $scope.member.phone;
    requestData.attributes.address = $scope.member.address;
    requestData.attributes.notes = $scope.member.note;

    console.log(requestData);
    MemberService.saveMember(requestData, "PUT", $scope.editSuccess, $scope.editFail);
  };

  $scope.editSuccess = function(response){
    ToastService.info("memberEditSuccessful");
    $scope.modal.hide();
    $scope.load();
  }

  $scope.editFail = function(response){
    $scope.showFailMessage = true;
    $scope.error.messageKey = response;
  }

  $scope.load();
});

apb.controller('NewMemberCtrl', function($scope, $rootScope, $state, $rootScope, MemberService, ToastService) {
  
    $scope.buttonTitle = "create";
    $scope.pageTitle = "newMember";
    $scope.showFailMessage = false;

  	$scope.member = {};
  	$scope.error = {};
  	$scope.error.messageKey = null;

  	$scope.doNewMember = function(newMember) {

  		$scope.error.messageKey = null;
      $scope.showFailMessage = false;
  		
      if(newMember !== undefined && !newMember.$valid) return;
  		
      var requestData = {};
      requestData.attributes = {};

      //requestData.providerId = $rootScope.serviceProviderId;
      
      requestData.memberNumber = $scope.member.memberNumber;
      requestData.attributes.firstname = $scope.member.firstname;
      requestData.attributes.lastname = $scope.member.surname;
      
      requestData.attributes.birthday = Math.floor($scope.member.dateOfBirth.getTime() / 1000);
      requestData.attributes.birthday = requestData.attributes.birthday.toString();
      
      requestData.attributes.memberSince = Math.floor($scope.member.memberSince.getTime() / 1000);
      requestData.attributes.memberSince = requestData.attributes.memberSince.toString();
      
      requestData.attributes.email = $scope.member.emailAddress;
      requestData.attributes.mobile = $scope.member.mobile;
      requestData.attributes.phone = $scope.member.phone;

      //requestData.createdAt = Math.floor(Date.now() / 1000);
      //requestData.updatedAt = Math.floor(Date.now() / 1000);
      //requestData.attributes.birthday = 1431800371;
      
      requestData.attributes.address = $scope.member.address;
      requestData.attributes.notes = $scope.member.note;

      console.log(requestData);
      MemberService.saveMember(requestData, "POST", $scope.insertSuccess, $scope.insertFail);
  	};

    $scope.insertSuccess = function(response){
      ToastService.info("memberSaveSuccessful");
      $state.go("app.member");
    }

    $scope.insertFail = function(response){
      $scope.showFailMessage = true;
      $scope.error.messageKey = response;
    }
});