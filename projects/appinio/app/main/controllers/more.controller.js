appinioController.controller('MoreCtrl', function ($scope, appinioConfig, $ionicActionSheet, $cordovaDevice, $ionicPopup, User, $state, $rootScope, $cordovaInAppBrowser, $cordovaEmailComposer, Rating, ShareText, Tutorial, $ionicHistory, Tracker, $cordovaFacebook) {

  $scope.openLinkFAQ = function () {
    Tracker.trackEvent('showFAQ');
    $cordovaInAppBrowser.open(appinioConfig.faqUrl, '_blank', {location: 'no'});
  };
  $scope.openLinkPrivacy = function () {
    Tracker.trackEvent('showPrivacy');
    $cordovaInAppBrowser.open(appinioConfig.privacyUrl, '_blank', {location: 'no'});
  };
  $scope.openLinkAGB = function () {
    Tracker.trackEvent('showAGB');
    $cordovaInAppBrowser.open(appinioConfig.agbUrl, '_blank', {location: 'no'});
  };

  $scope.deleteAccountPopup = function () {
    Tracker.trackEvent('deleteAccountCheck');
    var confirmPopup = $ionicPopup.confirm({
      templateUrl: 'main/templates/popups/confirm-deletion-popup.html',
      cssClass: 'two-buttons'
    });
    confirmPopup.then(function (res) {
      if(res) {
        $scope.deleteAccount();
      }
    });
  };

  $scope.migrateToFacebook = function(){
    $cordovaFacebook.login(["public_profile", "email", "user_friends", "user_birthday", "user_photos"])
      .then(function () {
          $cordovaFacebook.getAccessToken().then(function (success) {
            User.migrateToFacebook(success, function(){
              Tracker.trackEvent('migrateToFacebook', {type: 'more'});
              $scope.loadFriends();
            });
          }, function () {
            $ionicPopup.alert({
              templateUrl:'main/templates/popups/error-popup.html'
            });
          });
        },
        function (error) {
          $ionicPopup.alert({
            templateUrl:'main/templates/popups/error-popup.html'
          });
        });
  };

  $scope.deleteAccount = function () {
    Tracker.trackEvent('deleteAccount');
    User.delete(function () {
      $state.go('user.login');
      $ionicPopup.alert({
        templateUrl: 'main/templates/popups/deletion-complete-popup.html'
      });
      $rootScope.logoutReinit = true;
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache().then(function() {
        $rootScope.closeLinksList();
        $state.go('user.login');
        $rootScope.myBadges = null;
      });
      $rootScope.closeLinksList();
    });
  };

  $scope.rateTheApp = function () {
    Tracker.trackEvent('rateApp');
    Rating.rateApp();
    Tutorial.setFlag($rootScope.loggedInUser._id+'didRate');
/*    var hash = CryptoJS.SHA256('rating');
    User.checkEasteregg(hash.toString(CryptoJS.enc.Hex));*/
  };

  $scope.inviteToApp = function () {
    Tracker.trackEvent('inviteFriends');
    ShareText.inviteFriend($rootScope.loggedInUser.refText);
  };

  // TODO: übersetzen
  $scope.giveFeedback = function () {
    Tracker.trackEvent('chooseFeedback');
    $ionicActionSheet.show({
      buttons: [
        {text: 'Ein Problem melden'},
        {text: 'Einen Vorschlag machen'}
      ],
      titleText: 'Kontakt',
      cancelText: 'Zurück',
      cancel: function () {

      },
      buttonClicked: function (index) {
        // TODO: testen... !!
        if (index == 0) {
          Tracker.trackEvent('openSupportMail');
          $cordovaEmailComposer.open(
            {
              to: appinioConfig.supportEmail,
              subject: 'Support',
              isHtml: true,
              body: '<br/><br/><br/>------------<br/>Device Information: <br/>'
              /*              body: '\n\n\nDevice Information\n-----------------------\n' +
               'OS: '+ $cordovaDevice.getPlatform() + ' ' + $cordovaDevice.getVersion() + '\n' +
               'Model: ' + $cordovaDevice.getModel()*/
            }
          ).then(function () {
          }, function () {
          });
        }
        if (index == 1) {
          Tracker.trackEvent('openFeedbackMail');
          $cordovaEmailComposer.open(
            {
              to: appinioConfig.feedbackEmail,
              subject: 'Vorschlag'
            }
          ).then(function () {
          }, function () {
          });
        }
        return true;
      }
    });

  };

});
appinioController.controller('PushCtrl', function ($scope, $rootScope, User, ShareText, $http, appinioConfig, currentUser, Tutorial, PushNotification, Tracker) {

  $scope.push = {};
  currentUser.getUser(function (user) {
    if (!user || !user.pushPermission) {
      $scope.push = {};
      return;
    }
    $scope.push = user.pushPermission;
  });

  $scope.xptest = function(){
    $http.get(appinioConfig.baseUrl + 'user/xpdummy').success(function(response){
      $rootScope.checkForUpdates(response.success);
    });
  };

  $scope.updatePermission = function (value) {
    User.updatePush(value, $scope.push[value], function(){
      Tracker.trackEvent('changePush', {field: value, value:$scope.push[value]});
    });
    if ($scope.push[value] == true) {
      //Tutorial.deleteFlag('sawPushPermission');
      PushNotification.chooseStart($rootScope.loggedInUser, true);
    }

  };

});

appinioController.controller('ProfileCtrl', function ($scope, User, $ionicActionSheet, $ionicPopup, $rootScope, Tracker, PushNotification, $timeout) {

  $scope.$on('load:profile', function(e, data){
    $scope.memberData = data;
    var badges = [];
    _.each(data.badges, function(e){
      var find = _.findWhere(badges, {type: e.type});
      if(find == null){
        badges.push(e);
      }else{
        if(e.level > find.level){
          find.level = e.level;
        }
      }
    });
    _.each(badges, function(e){
      var find = _.findWhere($rootScope.gameBadges, {type: e.type, level: e.level+1});
      if(find == null){
        e.done = true;
      }
    });

    // TODO: name mitgeben...
    // TODO: icon fixed color...
    data.badges = badges;
  });

  $scope.createQuestion = function(){
    Tracker.trackEvent('createQuestionFromProfile');
    $scope.closeProfileModal();
    $scope.closeFriendList();
    $scope.openCreateQuestionModal($scope.memberData);
  };

  $scope.addFriend = function(id){
    User.addUserRelation(id, function(){
      Tracker.trackEvent('addFriendFromProfile');
      $scope.popupPicture = $scope.memberData.avatar || $scope.memberData.imageUrl || './img/avatar/avatar03.png';
      $scope.popupName = $scope.memberData.nickname || 'Anonym';
      var popup = $ionicPopup.alert({
        scope:$scope,
        templateUrl:'main/templates/popups/confirm-add-popup.html'
      });
      $scope.loadUser(id);
      $rootScope.$broadcast('load:friends', true);
      popup.then(function(){
        $timeout(function(){
          PushNotification.start($rootScope.loggedInUser, 'sawPushPermissionFriends');
        }, 500);
      });
    });
  };

  $scope.loadUser = function(id){
    User.getUserProfile(id, function (response) {
      $scope.memberData = response.success;
    });
  };
  $scope.openProfileMenu = function (id, name, relation) {
    Tracker.trackEvent('showProfileOptions');
    var text = 'Entfreunden';
    if(relation.state === 0){
      if($rootScope.loggedInUser._id == relation.user1){
        text = 'Anfrage zurücknehmen';
      }else{
        text = 'Anfrage ablehnen';
      }
    }
    $ionicActionSheet.show({
      buttons: [
        {text: text}
      ],
      titleText: name,
      cancelText: 'Zurück',
      cancel: function () {},
      buttonClicked: function (index) {
        if (index == 0) {
          User.deleteFriend(id, function(){
            Tracker.trackEvent('deleteFriend');
            $scope.popupPicture = $scope.memberData.avatar || $scope.memberData.imageUrl || './img/avatar/avatar03.png';
            $scope.popupName = $scope.memberData.nickname || 'Anonym';
            $ionicPopup.alert({
              scope:$scope,
              templateUrl:'main/templates/popups/confirm-delete-popup.html'
            });
            $scope.loadUser($scope.memberData._id);
            $rootScope.$broadcast('load:friends', true);
          });
        }
        return true;
      }
    });
  }

});


appinioController.controller('VoucherCtrl', function($scope, $rootScope, Voucher, $ionicSlideBoxDelegate, $timeout, $ionicPopup, $cordovaClipboard, $ionicPlatform, Tracker){

  $scope.loadVouchers = function(){
    Voucher.getVoucherList(function(data){
      $scope.vouchers = data;
      $scope.setCodesForVouchers();
    });

    Voucher.getUsersVoucherList(function(data){
      $scope.orders = data;
      $scope.setCodesForVouchers();
    });
  };

  $scope.setCodesForVouchers = function(){
    if($scope.vouchers && $scope.vouchers.length > 0 && $scope.orders && $scope.orders.length > 0){
      _.each($scope.vouchers, function(e){
        e.codes = [];
      });
      _.each($scope.orders, function(e){
        var find = _.findWhere($scope.vouchers, {_id: e.productId._id});
        if(find){
          find.codes.push(e.code);
        }
      });
    }
  };

  $scope.voucherLoading = false;
  $scope.showVoucher = function(voucher){
    $rootScope.setScreen('voucherDetails');
    Tracker.trackEvent('showVoucherDetails');
    $rootScope.backButtonDeregister = $ionicPlatform.registerBackButtonAction(
      function () { $scope.backToList();}, 250
    );
    $scope.voucherDetails = voucher;
    $scope.showDetails = true;
    $scope.voucherDelegate.next();
    $scope.voucherLoading = false;
  };

  $scope.backToList = function(){
    if($rootScope.backButtonDeregister){
      $rootScope.backButtonDeregister();
    }
    $scope.voucherDelegate.slide(0);
    $scope.showDetails = false;
    $scope.voucherDetails = null;
    $scope.voucherLoading = true;
  };

  $scope.copyCode = function(code) {
    Tracker.trackEvent('copyVoucherCode');
    $cordovaClipboard
      .copy(code)
      .then(function () {
        $ionicPopup.alert({
          templateUrl:'main/templates/popups/copy-popup.html'
        });
      });
  };

  $scope.showConditions = function(name, condition){
    Tracker.trackEvent('showVoucherConditions');
    $scope.links = [];
    var linkIndex = 0;
    var conditionText = condition;
    var find = conditionText.indexOf('(www.');
    while (find!=-1) {
      if(find!=-1){
        var linkStart = conditionText.substring(find, conditionText.length);
        var link = conditionText.substring(find+1, find+linkStart.indexOf(')'));
        $scope.links.push(link);
        conditionText = conditionText.replace('('+link+')', '(<span class="link" ng-click="openLink(links['+linkIndex+'])">'+link+'</span>)');
        linkIndex++;
      }
      find = conditionText.indexOf('(www.');
    }
    $ionicPopup.alert({
      title: name,
      scope: $scope,
      template: conditionText
    });
  };

  $scope.closeBuyPopup = function(){
    $scope.buyPopup1.close();
  };

  $scope.buyCoupon = function(item) {
    $scope.item = item;
    if(item.price<=$rootScope.loggedInUser.coins){
      $scope.buyPopup1 = $ionicPopup.confirm({
        scope: $scope,
        cssClass: 'two-buttons',
        buttons: [
          {
            text: 'Ok',
            onTap: function() {
              return true;
            }
          }
        ],
        templateUrl:'main/templates/popups/buy-popup.html'
      });
      $scope.buyPopup1.then(function(res) {
        if(res) {
          Tracker.trackEvent('buyVoucher');
          Voucher.buy(item._id, function(data){
            $rootScope.checkForUpdates(data);
            $scope.loadVouchers();
            $ionicPopup.alert({
              templateUrl: 'main/templates/popups/buy-complete-popup.html'
            });
          }, function(){
            $ionicPopup.alert({
              templateUrl: 'main/templates/popups/buy-fail-popup.html'
            });
          });
        }
      });
    }else{
      $ionicPopup.alert({
        templateUrl: 'main/templates/popups/buy-fail-popup.html'
      });
    }
  };

  $scope.$on('reload:vouchers', function(){
    $scope.loadVouchers();
  });

  $scope.loadVouchers();

  $timeout(function(){
    $scope.voucherDelegate = _.find($ionicSlideBoxDelegate._instances, function (e) {
      return e.$$delegateHandle === 'voucher';
    });
    $scope.voucherDelegate.enableSlide(false);
  }, 1);

});

appinioController.controller('CharityCtrl', function($scope, $ionicModal, $ionicSlideBoxDelegate, User, Charity, $cordovaInAppBrowser, $timeout, $rootScope, $ionicPlatform, Tracker){

  $scope.getCharityList = function(){
    Charity.getCharityList(function(response){
      $scope.charities = response;
    });
  };

  $scope.getCharityDetails = function(charityId){
    $rootScope.setScreen('charityDetails');
    Tracker.trackEvent('showCharityDetails');
    $rootScope.backButtonDeregister = $ionicPlatform.registerBackButtonAction(
      function () { $scope.backToList();}, 250
    );
    $scope.charityLoading = true;
    $scope.cd = {};
    Charity.getCharityDetail(charityId,function(response){
      $scope.charityLoading = false;
      $scope.cd = response;
    });
    $scope.showDetails = true;
    $scope.charityDelegate.next();
  };

  $scope.openCharityLink = function(link){
    Tracker.trackEvent('openCharityLink');
    $cordovaInAppBrowser.open(link, '_blank', {location: 'no'});
  };

  $scope.backToList = function(){
    if($rootScope.backButtonDeregister){
      $rootScope.backButtonDeregister();
    }
    $scope.charityDelegate.slide(0);
    $scope.showDetails = false;
  };

  $timeout(function(){
    $scope.charityDelegate = _.find($ionicSlideBoxDelegate._instances, function (e) {
      return e.$$delegateHandle === 'charity';
    });
    $scope.charityDelegate.enableSlide(false);
  }, 1);

  $scope.getCharityList();

});
