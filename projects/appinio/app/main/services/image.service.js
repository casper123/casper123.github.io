appinioService.factory('ImagePicker', function ($ionicActionSheet, $cordovaCamera, $http) {
  return {
    convertBase64ToUrl: function(base64, cb){
      var imageServerUrl = 'http://appinio-files.de';
      $http.post(imageServerUrl + '/base64', {image: base64})
        .success(function (response) {
          if(cb){
            var url = 'http://appinio-files.de/uploads/' + response.data;
            cb(url);
          }
        }).error(function(){

        });
    },
    pickImage: function (success, fail, ratio, previewOnly) {
      var width = 300;
      var height = 300;

      if(ratio != null){
        width = Math.round(width);
        height = Math.round(height*ratio);
      }

      $ionicActionSheet.show({
        buttons: [
          {text: 'Aus Fotoalbum'},
          {text: 'Foto aufnehmen'}
        ],
        cancelText: 'Abbrechen',
        buttonClicked: function (index) {
          var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.PNG,
            targetWidth: width,
            targetHeight: height,
            saveToPhotoAlbum: false
          };
          if (index == 0) {
            options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
          } else if (index == 1) {
            options.sourceType = Camera.PictureSourceType.CAMERA;
          }
          if (index == 0 || index == 1) {
            $cordovaCamera.getPicture(options).then(function (imageData) {
              if(previewOnly){
                success(null, "data:image/png;base64," + imageData);
                return;
              }
              var imageServerUrl = 'http://appinio-files.de';
              $http.post(imageServerUrl + '/imageupload/base64', {image: "data:image/png;base64," + imageData})
                .success(function (response) {
                  var url = 'http://appinio-files.de/uploads/' + response.data;
                  if (success) {
                    success(url, "data:image/png;base64," + imageData);
                  }
                })
                .error(function () {
                  if (fail) {
                    fail();
                  }
                });
            }, function(){
              if (fail) {
                fail();
              }
            });
          }
          return true;
        }
      });

    }
  };
});
