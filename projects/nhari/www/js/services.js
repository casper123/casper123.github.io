angular.module('App.services', [])

.factory('CurrentUser', function($http){
    return{
        setUser : function(user, callbackFunc){
            window.localStorage.setItem('user', JSON.stringify(user));
            
            if(callbackFunc == undefined || callbackFunc == null)
                return null;

            callbackFunc(user);
        },
        getUser : function(callbackFunc){
            var user = JSON.parse(window.localStorage.getItem('user'));
            
            if(callbackFunc == undefined || callbackFunc == null)
                return null;
            
            callbackFunc(user);
        },
        removeUser : function(callbackFunc){

            window.localStorage.removeItem('user');
            callbackFunc();
        }
    }
})

.factory('User', function($http){
    var baseUrl = 'http://www.nhari.nl/mobileapp/';
    return {
        register: function(postData, callBackFunc) {
            $http({
                method: 'POST',
                url: baseUrl + "index.php?r=api/UserSignup",
                data: postData,
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function (data){
                callBackFunc(data)
            })
            .error(function(){
                console.log("error");
            })
        },

        login: function(postData, callBackFunc) {
            $http({
                method: 'POST',
                url: baseUrl + "index.php?r=api/userlogin ",
                data: postData,
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function (data){
                callBackFunc(data)
            })
            .error(function(){
                console.log("error");
            })
        },

        editProfile: function(postData, callBackFunc) {
            $http({
                method: 'POST',
                url: baseUrl + "index.php?r=api/UserEdit",
                data: postData,
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function (data){
                callBackFunc(data)
            })
            .error(function(){
                console.log("error");
            })
        },

        getUser: function(userId, callBackFunc) {
            var responsePromise = $http.get(baseUrl + "index.php?r=api/UserView&id="+userId);
            responsePromise.success(function(data,status,headers,config){
                callBackFunc(data);
            });
        },
        getUserItems: function(userId, callBackFunc) {
            var responsePromise = $http.get(baseUrl + "index.php?r=api/UserItemList&id="+userId);
            responsePromise.success(function(data,status,headers,config){
                callBackFunc(data);
            });
        }
    }
})

.factory('Category', function($http){
    var baseUrl = 'http://www.nhari.nl/mobileapp/';
    return {
        list: function(callBackFunc) {
            var responsePromise = $http.get(baseUrl + "index.php?r=api/CategoryList");
            responsePromise.success(function(data,status,headers,config){
                callBackFunc(data);
            });
        }
    }
})

.factory('Product', function($http, $ionicLoading){
    var baseUrl = 'http://www.nhari.nl/mobileapp/';
    return {
        homePage: function(callBackFunc) {
            var responsePromise = $http.get(baseUrl + "index.php?r=api/LatestItem");
            responsePromise.success(function(data,status,headers,config){
                callBackFunc(data);
            });
        },

        productDetail: function(itemId, callBackFunc) {
            var responsePromise = $http.get(baseUrl + "index.php?r=api/ItemView&id="+itemId);
            responsePromise.success(function(data,status,headers,config){
                callBackFunc(data);
            });
        },

        productCateg: function(categId, callBackFunc) {
            var responsePromise = $http.get(baseUrl + "index.php?r=api/ItemList&id="+categId);
            responsePromise.success(function(data,status,headers,config){
                callBackFunc(data);
            });
        },

        productPost: function(postData, callBackFunc) {
            $http({
                method: 'POST',
                url: baseUrl + "index.php?r=api/ItemAdd",
                data: postData,
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function (data){
                callBackFunc(data)
            })
            .error(function(){
                $ionicLoading.hide();
                console.log("error");
            })   
        },

        productDelete: function(postData, callBackFunc) {
            $http({
                method: 'POST',
                url: baseUrl + "index.php?r=api/DeleteMyAd&id=" + postData,
                data: postData,
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function (data){
                callBackFunc(data)
            })
            .error(function(){
                console.log("error");
            })   
        },

        productEdit: function(postData, callBackFunc) {
            $http({
                method: 'POST',
                url: baseUrl + "index.php?r=api/ItemEdit",
                data: postData,
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function (data){
                callBackFunc(data)
            })
            .error(function(){
                console.log("error");
            })   
        },

        productPostComment: function(postData, callBackFunc) {
            $http({
                method: 'POST',
                url: baseUrl + "index.php?r=api/Comment",
                data: postData,
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function (data){
                callBackFunc(data)
            })
            .error(function(){
                console.log("error");
            })   
        },

        productGetComment: function(productId, callbackFunc){
            var responsePromise = $http.get(baseUrl + "index.php?r=api/ProductComments&id="+productId);
            responsePromise.success(function(data,status,headers,config){
                callbackFunc(data);
            });
        },

        deleteProductImg: function(ImageId, callbackFunc){
            var responsePromise = $http.get(baseUrl + "index.php?r=api/DeleteProductImg&item_image_id="+ImageId);
            responsePromise.success(function(data,status,headers,config){
                callbackFunc(data);
            });
        }
    }
})

.factory('General', function($http){
    var baseUrl = 'http://www.nhari.nl/mobileapp/';
    return{
        faq: function(callBackFunc) {
            var responsePromise = $http.get(baseUrl + "index.php?r=api/Faq");
            responsePromise.success(function(data,status,headers,config){
                callBackFunc(data);
            });
        },
        terms: function(callBackFunc) {
            var responsePromise = $http.get(baseUrl + "index.php?r=api/TermsCondition");
            responsePromise.success(function(data,status,headers,config){
                callBackFunc(data);
            });
        }
    }
})
.factory('ParseServices', function($rootScope) {
         
         return {        
             
         getAll: function(Class){
         
            var ParseString = Parse.Object.extend(Class);
            var query = new Parse.Query(ParseString);
            return query.find().then(function(response){
                return response;
            }, function(error){
                //something went wrong!
            });
         },
             
         getByTerm: function(Class, term1, term2, skip, limit){
         
            var ParseString = Parse.Object.extend(Class);
            var query = new Parse.Query(ParseString);
             query.equalTo(term1, term2);
             if(skip) { query.skip(skip); }
             if(limit) {query.limit(limit); }
             if(Class=="Items") { 
                query.equalTo("approved", true);
                query.equalTo("blocked", false);
                query.descending("createdAt");
             }
            return query.find().then(function(response){
                return response;
            }, function(error){
                //something went wrong!
            });
         },
             
        getFirst: function(Class, term1, term2){
         
            var ParseString = Parse.Object.extend(Class);
            var query = new Parse.Query(ParseString);
             query.equalTo(term1, term2);
             if(Class=="Items") { 
                query.equalTo("approved", true);
                query.equalTo("blocked", false);
                query.ascending("createdAt");
             }
            return query.first().then(function(response){
                return response;
            }, function(error){
                //something went wrong!
            });
        },
             
        getComments: function(item){
         
            var ParseString = Parse.Object.extend("Comments");
            var query = new Parse.Query(ParseString);
            query.equalTo("approved", true);
            if(item) {
            query.equalTo("item", item); }
            query.ascending("createdAt");
            query.include("user");
            query.include("item");
            return query.find().then(function(response){
                return response;
            }, function(error){
                //something went wrong!
            });
        },

         addToFavourites: function(item){

            var user = $rootScope.currentUser;
             var relation = user.relation("favourites");
             relation.add(item);
             return user.save().then(function(){
    
            }, function(error){
                //something went wrong!
            });
  
         },
         
         userFavourites: function(user){

             var relation = user.relation("favourites");
             return relation.query().find().then(function(response){
                return response;
            });
 
         },

             
         removeFavourite: function(item){

            var user = $rootScope.currentUser;
             var relation = user.relation("favourites");
             relation.remove(item);
             return user.save().then(function(){
            }, function(error){
                //something went wrong!
            });
  
         },
             
             
         nearMe: function(userObject, limit){
             
             var PlaceObject = Parse.Object.extend("Items");
             var userGeoPoint = userObject.get("coords");
             var query = new Parse.Query(PlaceObject);     
             query.near("itemCoords", userGeoPoint);
             query.limit(limit);
             
            return query.find().then(function(response){
                return response;
            }, function(error){
                //something went wrong!
            });
            
 
         },
     
        }
         
         })

        


.factory('locationService', function($http) {
         var locations = [];
         var latlng = "";
         
         return {
         getLocation: function(latlng){
         return $http({
                      url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&key=YourKeyHere", //*** location service ***
                      method: "GET",
                      }).then(function(response){
                              locations = response.data;
                              return locations;
                              }, function(error){
                              //something went wrong!
                              });
         }
         }
         })