novitrixApp
.controller('ConversationCtrl', function($scope, $ionicModal, $state, CurrentUser, Message) {
	$ionicModal.fromTemplateUrl('templates/conversation-detail.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
	    $scope.showDetail = modal;
	});

	var conversation_id = null;
	
	$scope.user = {};
	CurrentUser.getUser(function(u){
        $scope.user = u;
        Message.listMessage($scope.user.user_id, function(response){
			console.log(response)
			$scope.msgList = response.data;
		});
    });	

	$scope.msgArray = [];

	$scope.detail = function(id) {
		$scope.showDetail.show();
		Message.viewMessage(id, function(response){
			if (response.done == true) {
				$scope.msgDetail = response.data;
				conversation_id = id;
				console.log($scope.msgDetail);	
			}
		})
		console.log(id)
	}

	$scope.closeModal = function() {
		$scope.showDetail.hide();
	}

	$scope.send = function(message){
		
		var obj = {};
		obj.conversation_id = conversation_id;
		obj.message_desc = message;

		// if($scope.msgDetail[0].from_user_id == $scope.user.user_id) {
			
		// }
		obj.to_user_id = "";
		obj.from_user_id = $scope.user.user_id;

		Message.sendMessage($scope.UTIL.serialize(obj), conversation_id, function(response){
			console.log(response)
		});
	}
})