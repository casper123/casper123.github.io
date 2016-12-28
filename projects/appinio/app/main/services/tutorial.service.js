appinioService.factory('Tutorial', function () {
  return {
    showLegendPopup: function (text, callback) {
      if(window.localStorage.getItem(text) != 'true'){
        window.localStorage.setItem(text, true);
        if(callback){
          callback();
        }
      }
    },
    setFlag: function (text) {
      window.localStorage.setItem(text, true);
    },
    deleteFlag: function(text){
      window.localStorage.setItem(text, false);
    }
  };
});
