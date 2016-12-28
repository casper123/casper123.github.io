apb.factory('ToastService', function ($ionicLoading, $translate) {
  var defaultDuration = 2000;

  return {
    error: function (error) {
      $ionicLoading.show({
        template: $translate.instant(error.messageKey),
        noBackdrop: true,
        duration: defaultDuration
      });
    },
    info: function (messageKey) {
      $ionicLoading.show({
        template: $translate.instant(messageKey),
        noBackdrop: true,
        duration: defaultDuration
      });
    }
  }
});