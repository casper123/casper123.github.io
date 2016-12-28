angular.module('starter.services', [])

.factory('User', function($http) {

  var baseUrl = "http://snapflick.co/";

  return { 
  	login : function(postData,callbackFunc){
  		$http({
        method  : 'POST',
        url     : baseUrl + 'index.php/web_services/login',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function() {
        "in error";
      });
    },

    addUser: function(postData,callbackFunc){
     $http({
      method  : 'POST',
      url     : baseUrl + 'index.php/web_services/register',
          data    : postData,  // pass in data as strings
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
          callbackFunc(data);
        })
        .error(function() {
          "in error";
        });
   },

   facebookLogin : function(postData,callbackFunc){
    $http({
      method  : 'POST',
      url     : baseUrl + 'index.php/web_services/facebook_login',
              data    : postData,  // pass in data as strings
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function() {
        "in error";
      });
  },

  editUser : function(userId,postData,callbackFunc){
    $http({
      method  : 'POST',
      url     : baseUrl + 'index.php/web_services/edit_user/' + userId,
              data    : postData,  // pass in data as strings
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
            })
    .success(function(data) {
      callbackFunc(data);
    })
    .error(function() {
      "in error";
    });
  },

  changePassword : function(postData,callbackFunc){
    $http({
      method  : 'POST',
      url     : baseUrl + 'index.php/web_services/change_password',
                data    : postData,  // pass in data as strings
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
              })
    .success(function(data) {
      callbackFunc(data);
    })
    .error(function() {
      "in error";
    });
  },

  changeEmail : function(postData,callbackFunc){
    $http({
      method  : 'POST',
      url     : baseUrl + 'index.php/web_services/change_email',
                data    : postData,  // pass in data as strings
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
              })
    .success(function(data) {
      callbackFunc(data);
    })
    .error(function() {
      "in error";
    });
  },

  getTopEarners : function(callbackFunc){
    var responsePromise = $http.get(baseUrl + "index.php/web_services/get_top_earners");

    responsePromise.success(function(data,status,headers,config){
      callbackFunc(data);
    });
  },

  getCurrentUser : function(callbackFunc){
    var user = window.localStorage.getItem("user");
    callbackFunc(JSON.parse(user));
  },

  getConnections : function(userId,callbackFunc){

    var responsePromise = $http.get(baseUrl + "index.php/web_services/get_connections_of_user/" + userId);

    responsePromise.success(function(data, status, headers, config) {
      callbackFunc(data);
    });
  },

  getUser: function(userId, callbackFunc) {

   var responsePromise = $http.get(baseUrl + "index.php/web_services/get_user/" + userId);

    responsePromise.success(function(data, status, headers, config) {
      callbackFunc(data);
    });
  },

  getUserImages: function(userId, callbackFunc) {

    var responsePromise = $http.get(baseUrl + "index.php/web_services/get_user_images/" + userId);

    responsePromise.success(function(data, status, headers, config) {
      callbackFunc(data);
    })
  },
  
  getCurrentImage : function(imageId, callbackFunc){
    var responsePromise = $http.get("http://snapflick.co/" + "index.php/web_services/get_current_image/" + imageId);

    responsePromise.success(function(data,status,headers,config){
      callbackFunc(data);
    });
  },

  deleteUserImages: function(postData, callbackFunc) {
    $http({
      method  : 'POST',
      url     : baseUrl + "index.php/web_services/delete_image",
                data    : postData,  // pass in data as strings
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
              })
    .success(function(data) {
      callbackFunc(data);
    })
    .error(function() {
      "in error";
    });
  },

  addUserImage: function(postData, callbackFunc){
    $http({
      method  : 'POST',
      url     : baseUrl + "index.php/web_services/add_user_image",
                data    : postData,  // pass in data as strings
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
              })
    .success(function(data) {
      callbackFunc(data);
    })
    .error(function() {
      "in error";
    });
  },

  setMainImage : function(imageId, userId, callbackFunc){
    var responsePromise = $http.get(baseUrl + "index.php/web_services/set_main_image/" + imageId + "/" + userId);


    responsePromise.success(function(data,status,headers,config){
      callbackFunc(data);
    });
  },
}
})

.factory('Settings', function($http){
  var baseUrl = "http://snapflick.co/";
  return{
    getBgImage : function(callbackFunc){
      var responsePromise = $http.get(baseUrl + 'index.php/web_services/get_bg_image');
      responsePromise.success(function(data,status,headers,config){
        callbackFunc(data)
      });
    },
  };
})

.service('ScrollRender', function() {
    this.render = function(content) {
        return (function(global) {

            var docStyle = document.documentElement.style;

            var engine;
            if (global.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
                engine = 'presto';
            } else if ('MozAppearance' in docStyle) {
                engine = 'gecko';
            } else if ('WebkitAppearance' in docStyle) {
                engine = 'webkit';
            } else if (typeof navigator.cpuClass === 'string') {
                engine = 'trident';
            }

            var vendorPrefix = {
                trident: 'ms',
                gecko: 'Moz',
                webkit: 'Webkit',
                presto: 'O'
            }[engine];

            var helperElem = document.createElement("div");
            var undef;

            var perspectiveProperty = vendorPrefix + "Perspective";
            var transformProperty = vendorPrefix + "Transform";

            if (helperElem.style[perspectiveProperty] !== undef) {

                return function(left, top, zoom) {
                    content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
                };

            } else if (helperElem.style[transformProperty] !== undef) {

                return function(left, top, zoom) {
                    content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
                };

            } else {

                return function(left, top, zoom) {
                    content.style.marginLeft = left ? (-left / zoom) + 'px' : '';
                    content.style.marginTop = top ? (-top / zoom) + 'px' : '';
                    content.style.zoom = zoom || '';
                };

            }
        })(this);
    };

})

.factory('ImageCrop', function($http){

  var baseUrl = "http://snapflick.co/";

  return {
    getCurrentImage : function(imageId, callbackFunc){
      var responsePromise = $http.get(baseUrl + "index.php/web_services/get_current_image/" + imageId);

      responsePromise.success(function(data,status,headers,config){
        callbackFunc(data);
      });
    },

    cropImage: function(postData, callbackFunc){
      $http({
        method  : 'POST',
        url     : baseUrl + "index.php/web_services/image_cropping",
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
        })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function() {
        "in error";
      });
    },

    saveRotatedImage : function(imageId,degree,callbackFunc){
      var responsePromise = $http.get(baseUrl + "index.php/web_services/save_rotated_image/" + imageId + "/" + degree);

      responsePromise.success(function(data,status,headers,config){
        callbackFunc(data);
      });
    },    
  }
    
})
.factory('Reminder',function($http){
  var baseUrl = "http://snapflick.co/";
  return{
    
    remindMe: function(userId,movieId,type,callbackFunc){
     var responsePromise = $http.get(baseUrl + "index.php/web_services/remind_me/"+userId+"/"+movieId+"/"+type);
     responsePromise.success(function(data, status, headers, config) {
       callbackFunc(data);
     });
    },

    addReminder: function(postData,callbackFunc){
      $http({
          method  : 'POST',
          url     : baseUrl + 'index.php/web_services/add_reminder',
          data    : postData,  // pass in data as strings
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
          callbackFunc(data);
        })
        .error(function() {
          "in error";
        });
    },
    deleteReminder:function(postData, callbackFunc){
      $http({
          method  : 'POST',
          url     : baseUrl + 'index.php/web_services/delete_reminder',
          data    : postData,  // pass in data as strings
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
          callbackFunc(data);
        })
        .error(function() {
          "in error";
        });
    }



  }
})

.factory('Category', function($http) {

  var baseUrl = "http://snapflick.co/";

  return {
    getAll: function(callbackFunc) {

      var responsePromise = $http.get(baseUrl + "index.php/web_services/get_all_category");

      responsePromise.success(function(data, status, headers, config) {
        callbackFunc(data);
      });

      responsePromise.error(function(data, status, headers, config) {
        console.log("in fail");
      });
    },

    getMoviebyCategory: function(catId, callbackFunc) {

      var responsePromise = $http.get(baseUrl + "index.php/web_services/get_category_products/"+ catId);

      responsePromise.success(function(data, status, headers, config) {
        //console.log(data);
        callbackFunc(data);
      });

      responsePromise.error(function(data, status, headers, config) {
        console.log("in fail");
      });
    },
    getSubCategories: function(catId,callbackFunc){
      var responsePromise = $http.get(baseUrl + "index.php/web_services/get_sub_categories/"+ catId);

      responsePromise.success(function(data, status, headers, config) {
        //console.log(data);
        callbackFunc(data);
      });

      responsePromise.error(function(data, status, headers, config) {
        console.log("in fail");
      });
    },
  }
})

.factory('Movie', function($http) {

  var baseUrl = "http://snapflick.co/";

  return {
    getAll: function(keyword,callbackFunc) {

     var responsePromise = $http.get(baseUrl + "index.php/web_services/wild_search/" + keyword);


     responsePromise.success(function(data, status, headers, config) {
       callbackFunc(data);
     });

     responsePromise.error(function(data, status, headers, config) {
       console.log("in fail");
     });
    },

    getSavedMovies: function(userId,callbackFunc){

      var responsePromise = $http.get(baseUrl + "index.php/web_services/get_user_product/" + userId);

      
      responsePromise.success(function(data, status, headers, config) {
       callbackFunc(data);
     });

      responsePromise.error(function(data, status, headers, config) {
       console.log("in fail");
     });
    },

    deleteSavedMovies: function(postData,callbackFunc){
      $http({
          method  : 'POST',
          url     : 'http://snapflick.co/index.php/web_services/delete_user_product',
          data    : postData,  // pass in data as strings
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
          callbackFunc(data);
        })
        .error(function() {
          "in error";
        });
    },

    getMovieDetail: function(movieId, callbackFunc) {

      console.log(baseUrl + "index.php/web_services/get_product/"+ movieId);
      var responsePromise = $http.get(baseUrl + "index.php/web_services/get_product/"+ movieId);
      
      responsePromise.success(function(data, status, headers, config) {
        callbackFunc(data);
      });

      responsePromise.error(function(data, status, headers, config) {
        console.log("in fail");
      });
    },

    searchMovie: function(keyword,callbackFunc) {

     var responsePromise = $http.get(baseUrl + "index.php/web_services/wild_search/" + keyword);


     responsePromise.success(function(data, status, headers, config) {
       callbackFunc(data);
     });

     responsePromise.error(function(data, status, headers, config) {
       console.log("in fail");
     });
    },

    getDateMovies: function(userId, date, callbackFunc){

      var responsePromise = $http.get(baseUrl + "index.php/web_services/get_user_release_date_product/" + userId + "/" + date);

      responsePromise.success(function(data, status, headers, config) {
       callbackFunc(data);
      });

      responsePromise.error(function(data, status, headers, config) {
       console.log("in fail");
      });
    },
  }
})

.factory('Misc', function($http) {
  return {
    sendMessage: function(postData,callbackFunc){
      $http({
        method  : 'POST',
        url     : 'http://snapflick.co/index.php/web_services/send_message',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
        console.log(data); 
      })
      .error(function() {
        "in error";
      });
    }
  }
})

.factory('Product', function($http) {

  var baseUrl = "http://snapflick.co/";


  return { 
    saveUserProduct : function(postData,callbackFunc){
      $http({
        method  : 'POST',
        url     : baseUrl + 'index.php/web_services/insert_user_product',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function() {
        "in error";
      });
    },
    deleteUserProduct : function(postData,callbackFunc){
      $http({
        method  : 'POST',
        url     : baseUrl + 'index.php/web_services/delete_user_product',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function() {
        "in error";
      });
    },
    getMovieDetail: function(movieId, userId, callbackFunc) {

      //console.log(baseUrl + "index.php/web_services/get_product/"+ movieId + "/" + userId);
      var responsePromise = $http.get(baseUrl + "index.php/web_services/get_product/"+ movieId + "/" + userId);

      responsePromise.success(function(data, status, headers, config) {
        //console.log(data);
        callbackFunc(data);
      });

      responsePromise.error(function(data, status, headers, config) {
        console.log("in fail");
      });
    },

    getProduct : function(productId, callbackFunc){

      var responsePromise = $http.get(baseUrl + "index.php/web_services/get_product/" + productId);

      responsePromise.success(function(data, status, headers, config) {
        callbackFunc(data);
      });

      responsePromise.error(function(data, status, headers, config) {
        console.log("in fail");
      });
    }, 
  }
})

.service('returnToState', function($ionicHistory){
  return function(stateName){
    var historyId = $ionicHistory.currentHistoryId();
    var history = $ionicHistory.viewHistory().histories[historyId];
    for (var i = history.stack.length - 1; i >= 0; i--){
      if (history.stack[i].stateName == stateName){
        $ionicHistory.backView(history.stack[i]);
        $ionicHistory.goBack();
      }
    }
  }
})