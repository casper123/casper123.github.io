angular.module('starter.directive', [])

.directive("sign", function($rootScope){
  return {
    restrict: "A",
    link: function(scope, element, attrs){
      
      $rootScope.signatureTemp = [];
      $rootScope.sign = "";
      
      var canvas = document.getElementById("canvas");
      var signaturePad = new SignaturePad(canvas, {
      'onEnd' : function(){
          var imagedata = signaturePad.toDataURL();
          $rootScope.sign = imagedata;
      }});

      attrs.$observe("saveVal", function(newValue, dnid) {
          var imagedata = signaturePad.toDataURL();
          $rootScope.sign = imagedata;
          //$rootScope.signatureTemp.push({'dnid':dnid, 'signature':imagedata});
          //console.log("casper");
          //console.log($rootScope.sign);
      });

      /*signaturePad.onEnd(function(){
          var imagedata = signaturePad.toDataURL();
          $rootScope.sign = imagedata;
          //$rootScope.signatureTemp.push({'dnid':dnid, 'signature':imagedata});
          console.log("casper");
          console.log($rootScope.sign);
      });*/

      function resizeCanvas() 
      {
        var ratio = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
      }

      window.onresize = resizeCanvas;
      resizeCanvas();
    }
  };
});
