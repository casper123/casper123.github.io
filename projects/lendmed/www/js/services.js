angular.module('starter.services',  [])

.service('userDetails', function () {
var user =  {};
  user.user_id = window.localStorage.getItem("userId");
  user.company_type = window.localStorage.getItem("company_type");
  user.company_id = window.localStorage.getItem("companyId");
  user.username = window.localStorage.getItem("userName");
  user.email =  window.localStorage.getItem("email");
  user.firstname =  window.localStorage.getItem("firstname")
  user.lastname =  window.localStorage.getItem("lastname");
  user.token =  window.localStorage.getItem("token");
  user.authentications_id =  window.localStorage.getItem("authenticationsId");
  user.status =  window.localStorage.getItem("status");
  user.loggedin =  window.localStorage.getItem("loggedin");
  //console.log(user);
          return {
            getUser: function () {
                return user;
            },
            setUser: function(value) {
                user= value;
            }
        };
    })

.factory('Visitor',function($http){

  return{
    getVisitorCount : function(visiterId,type,token,callbackFunc){
        $http({
          method:'GET',
          url:'http://45.55.183.61/methods.php?action=get_visitor_count&visitorId=' + visiterId +'&type='+type+'&token='+token+'',
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
          })
          .success(function(data) {
            callbackFunc(data);
          })
          .error(function(data){
            console.log("in error");
          });
    },
  }
})

.factory('Log',function($http){

  return{
    addLog : function(userId,companyId,requestId,logType,token,callbackFunc){
        $http({
          method:'GET',
          url:'http://45.55.183.61/methods.php?action=addLog&userId='+userId+'&companyId='+companyId+'&requestId='+requestId+'&logType='+logType+'&token='+token+'',
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
          })
          .success(function(data) {
            callbackFunc(data);
          })
          .error(function(data){
            console.log("in error");
          });
    },
    getLogs : function(requestId,token,callbackFunc){
      $http({
          method:'GET',
          url:'http://45.55.183.61/methods.php?action=getLogs&requestId='+requestId+'&token='+token+'',
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
          })
          .success(function(data) {
            callbackFunc(data);
          })
          .error(function(data){
            console.log("in error");
          });
    }
  }
})

.factory('Comment',function($http){

  return{
    saveComment : function(userId,token,requestId,comment,callbackFunc){
        $http({
          method:'GET',
          url:'http://45.55.183.61/methods.php?action=saveComment&userId='+userId+'&token='+token+'&requestId='+requestId+'&comment='+comment,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
          })
          .success(function(data) {
            callbackFunc(data);
          })
          .error(function(data){
            console.log("in error");
          });
    },
    getComments : function(requestId,token,callbackFunc)
    {
      $http({
          method:'GET',
          url:'http://45.55.183.61/methods.php?action=getComment&requestId='+requestId+'&token='+token+'',
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
          })
          .success(function(data) {
            callbackFunc(data);
          })
          .error(function(data){
            console.log("in error");
          });
    },
  }
})

.factory('User', function($http) {
  // Might use a resource here that returns a JSON array

  return {
    login: function(postData, callbackFunc) {
      //console.log(postData);
      $http({
        method  : 'POST',
        url     : 'http://45.55.183.61/methods.php?action=location_login',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function(data, status) {
        console.log(status);
        console.log(JSON.stringify(data));
        console.log("in error");
      });
    },
   

    
       editProfile: function(postData, token, callbackFunc) {
      //console.log(postData);
      $http({
        method  : 'POST',
        url     : 'http://45.55.183.61/methods.php?action=saveUser&token='+token,
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
	      //console.log(data);
        callbackFunc(data);
      })
      .error(function(data) {
        console.log(JSON.stringify(data));
        console.log("in error");
      });
    },

    saveToken: function(pushToken, token, callbackFunc) {
      
      $http({
        method  : 'GET',
        url     : 'http://45.55.183.61/methods.php?action=savePushToken&token='+ token + '&pushToken=' + pushToken, 
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      
      .success(function(data) {
        callbackFunc(data);
        //console.log(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });

    },

    getLoggedInUser: function(callbackFunc) {
      var user = {};

      user.id = window.localStorage.getItem("userId");
      user.email =  window.localStorage.getItem("email");
      user.hashKey =  window.localStorage.getItem("hasKey");
      user.token =  window.localStorage.getItem("token");
      user.status =  window.localStorage.getItem("status");

      var onSuccess = function(position) {
        user.latitude = position.coords.latitude;
        user.longitude = position.coords.longitude;
        return callbackFunc(user);
      };
      
      function onError(error) {
          console.log('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
      }

      
    },

    getUserPvtNetwork: function(token,companyId,requestType,callbackFunc) {
      $http({
        method  : 'GET',
        url     : 'http://45.55.183.61/methods.php?action=getUserPvtNetwork&token='+ token + '&company_id=' + companyId+'&requestType='+ requestType+'',
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      
      .success(function(data) {
        callbackFunc(data);
        //console.log(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },


  }
})

.factory('Request', function($http) {
  // Might use a resource here that returns a JSON array

  return {
  
  
    add: function(postData, token, userID, callbackFunc) {
      //console.log("x"+postData);
      $http({
        method  : 'POST',
        url     : 'http://45.55.183.61/methods.php?action=addRequest&token='+token+'&',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        console.log(JSON.stringify(data));
        callbackFunc(data);
      })
      .error(function(data) {
        console.log(JSON.stringify(data));
        console.log("in error");
      });
    },
    
    getHelp: function(callbackFunc) {
	
	    
      $http({
        method  : 'GET',
        url     : 'http://45.55.183.61/methods.php?action=getHelp&', 
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      
      .success(function(data) {
        callbackFunc(data);
        //console.log(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },

    getRequests: function(token, userId, action, callbackFunc) {
      $http({
        method  : 'GET',
        url     : 'http://45.55.183.61/methods.php?action='+action+'&token='+token, 
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  
        // set the headers so angular passing info as form data (not request payload)
      })
      
      .success(function(data) {
        callbackFunc(data);
        //console.log(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },

    getRequest: function(token, requestId, callbackFunc) {
      $http({
        method  : 'GET',
        url     : 'http://45.55.183.61/methods.php?action=getRequest&request_id='+requestId+'&token='+token, 
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  
        // set the headers so angular passing info as form data (not request payload)
      })
      
      .success(function(data) {
        callbackFunc(data);
        //console.log(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },

    getRequestDetails: function(requestId,callbackFunc){
      $http({
        method  :  'GET',
        url     :  'http://45.55.183.61/methods.php?action=getRequestDetails&request_id='+ requestId ,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  
      })
      .success(function(data){
        callbackFunc(data);
      })
      .error(function(){
        console.log("error");
      });
    },

    approve: function(userID, requestID, estimatedTime, token, callbackFunc) {
  
      
      $http({
        method  : 'GET',
        url     : 'http://45.55.183.61/methods.php?action=approveRequest&token='+token+'&user_id='+ userID +'&request_id=' + requestID + '&estimated_time=' + estimatedTime, 
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      
      .success(function(data) {
        callbackFunc(data);
        //console.log(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },


    cancel: function(userID, requestID, token, callbackFunc) {
  
      
      $http({
        method  : 'GET',
        url     : 'http://45.55.183.61/methods.php?action=cancelRequest&token='+token+'&user_id='+ userID +'&request_id=' + requestID, 
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      
      .success(function(data) {
        callbackFunc(data);
        //console.log(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },

    updateStatus: function(requestID, status, token, callbackFunc) {
  
      
      $http({
        method  : 'GET',
        url     : 'http://45.55.183.61/methods.php?action=updateStatus&token='+token+'&status='+ status +'&request_id=' + requestID, 
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      
      .success(function(data) {
        callbackFunc(data);
        //console.log(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },

    


    cancelOwn: function(requestID, token, callbackFunc) {
  
      
      $http({
        method  : 'GET',
        url     : 'http://45.55.183.61/methods.php?action=cancelOwn&token='+token+'&request_id=' + requestID, 
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      
      .success(function(data) {
        callbackFunc(data);
        //console.log(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },

    receivedOwn: function(requestID, token, callbackFunc) {
  
      
      $http({
        method  : 'GET',
        url     : 'http://45.55.183.61/methods.php?action=receivedOwn&token='+token+'&request_id=' + requestID, 
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      
      .success(function(data) {
        callbackFunc(data);
        //console.log(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },
    
    returnOwn: function(requestID, token, callbackFunc) {
  
      
      $http({
        method  : 'GET',
        url     : 'http://45.55.183.61/methods.php?action=returnOwn&token='+token+'&request_id=' + requestID, 
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      
      .success(function(data) {
        callbackFunc(data);
        //console.log(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },
    
	
	  getExisting: function(token, userId, action, callbackFunc) {

	   	    
	    
      $http({
        method  : 'GET',
        url     : 'http://45.55.183.61/methods.php?action='+action+'&token='+token, 
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  
        // set the headers so angular passing info as form data (not request payload)
      })
      
      .success(function(data) {
        callbackFunc(data);
        //console.log(data);
      })
      .error(function(data) {
        console.log("error");
        console.log(data);
      });
    },

    addDriverData: function(requestId,postData,callbackFunc){
       $http({
        method  : 'POST',
        url     : 'http://45.55.183.61/methods.php?action=addDriverData&requestId='+requestId+'',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function(data) {
        //console.log(JSON.stringify(data));
        console.log("in error");
      });
    },

    addMoreDetails: function(postData,token,requestId,callbackFunc){
       $http({
        method  : 'POST',
        url     : 'http://45.55.183.61/methods.php?action=addMoreDetails&requestId='+requestId+'&token='+token+'',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function(data) {
        //console.log(JSON.stringify(data));
        console.log("in error");
      });
    }

  }
})

.factory('Kiosk', function($http){
  return{
    saveKiosk:function(postData,token,callbackFunc){
      $http({
        method  : 'POST',
        url     : 'http://45.55.183.61/methods.php?action=saveKiosk&token='+token+'&',
        data    : postData,  // pass in data as strings
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        console.log(JSON.stringify(data));
        callbackFunc(data);
      })
      .error(function(data) {
        console.log(JSON.stringify(data));
        console.log("in error");
      });
    }
  }
})

.factory('Inventory', function($http) {
  // Might use a resource here that returns a JSON array

  return {
  
  
    search: function(query, token, userID, callbackFunc) {
      //console.log("x"+query);
      $http({
        method  : 'POST',
        url     : 'http://45.55.183.61/methods.php?action=listInventory&token='+token+'&searchstring='+query,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        callbackFunc(data);
      })
      .error(function(data) {
        console.log(JSON.stringify(data));
        console.log("in error");
      });
    }
    


  }
})

