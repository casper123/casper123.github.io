appinioService.factory('ShareText', function ($cordovaSocialSharing) {
  return {
    dummyShare: function (text, image, success, fail) {
      $cordovaSocialSharing
        .share(message, subject, file, link) // Share via native share sheet
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occured. Show a message to the user
        });
    },
    question: function (text, success, fail) {
      $cordovaSocialSharing
        .share(text, null, null)
        .then(function(result) {
          success();
          // Success!
        }, function(err) {
          success();
        });
    },
    inviteFriend: function (refText, success, fail) {
      var text = 'Ich hab eine coole App gefunden! Macht super viel Spaß und Du kannst Guthaben verdienen! Gib bei der Anmeldung meinen appinio-Werbecode @REF an, dann bekomme ich mehr Guthaben! Hier gehts zur App: http://www.get-appinio.de';
      text = text.replace("@REF", refText);
      $cordovaSocialSharing
        .share(text, null, null)
        .then(function(result) {

        }, function(err) {

        });
    },
    level: function (level, success, fail) {
      $cordovaSocialSharing
        .share('Hey ich bin jetzt Level ' + level, 'appinio Durchstarter', null, null)
        .then(function(result) {

        }, function(err) {

        });
    },
    badge: function (level, success, fail) {
      $cordovaSocialSharing
        .share('Hey ich hab jetzt ein Badge', null, null)
        .then(function(result) {

        }, function(err) {

        });
    }
  };
});
