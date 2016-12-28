angular.module('App.controllers', [])

.controller('AccountCtrl', function($scope, $rootScope, $ionicLoading, $ionicPopup, ParseServices, User, CurrentUser) {
 $scope.user = JSON.parse(window.localStorage.getItem('user'));
 $rootScope.searchMenu = false;

 $scope.done = function (user){
  console.log(user)
  user.user_id = $scope.user.user_id
  User.editProfile($scope.UTIL.serialize(user), function (response){
    if (response.done == true) {
      User.getUser($scope.user.user_id, function (response){
        CurrentUser.setUser(response.data, function (updated){
          if (response.done == true) {
            var alertPopup = $ionicPopup.alert({
              title:'Success',
              template:'Successfully updated your profile.'
            })
          }
          else {
            var alertPopup = $ionicPopup.alert({
              title:'Oops',
              template:'Something went wrong!!'
            })
          }
        })
      })
    }
    else {
      var alertPopup = $ionicPopup.alert({
        title:'Oops',
        template:'Something went wrong!!'
      })
    }
  })
}
})

.controller('AppCtrl', function($scope, $rootScope, $state, $timeout, $ionicSideMenuDelegate, $ionicLoading, $ionicModal, $ionicPopup, $ionicHistory, $ionicActionSheet, ParseServices, locationService, User, CurrentUser, Product) {
  //$scope.sortParam = 'itemDetails.price';
  
  $ionicModal.fromTemplateUrl('templates/contactUs.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.contactModal = modal;
  });

  CurrentUser.getUser(function (response){
    $rootScope.currentUser = response;
    if ($rootScope.currentUser == null) {
      console.log("no user")
    }
    else {
      if ($scope.currentUser.sell == 1) {
        $scope.postIcon = false;
      }
      else {
        $scope.postIcon = true
      }
    }

    if (response == null || response == "") {
      $scope.menuBtn = false;
    }
    else {
      $scope.menuBtn = true;
    }
  });

  $scope.redirect = function(){
    $state.go('app.editAccount')
    $scope.closeMenuLeft();
  }

  $scope.contact = function(){
    $scope.contactModal.show();
    $scope.closeMenuLeft();
  }
  $scope.closeContact = function(){
    $scope.contactModal.hide();
  }

  $scope.fillContact = function(){
    var alertPopup = $ionicPopup.alert({
      title: 'Thankyou',
      template: 'Review recieved. We will contact you shortly.'
    });

    alertPopup.then(function(res) {
      $scope.contactModal.hide();
    })
  }

  $('.menu-overlay').hide();
  $('.menu-left').addClass('menu-closed');

  $scope.openMenuLeft = function() {
    $timeout(function() {
      $scope.menuOpen = $('body').hasClass('menu-open');
      if($scope.menuOpen === true) {
        $('.menu-content').addClass('menu-open-3d');
        $('.menu-left').addClass('menu-left-open');
        $('.menu-left').removeClass('menu-closed');
        $('.menu-right').hide();
        $('.menu-overlay').show();
      } 
    }, 10);
  };
  
  $scope.closeMenuLeft = function() {
    $timeout(function() {
      $('.menu-content').removeClass('menu-open-3d');
      $('.menu-left').removeClass('menu-left-open');
      $('.menu-left').addClass('menu-closed');
      $('.menu-right').show('slow');
      $('.menu-overlay').hide();
      $ionicSideMenuDelegate.toggleLeft();
    }, 10);
  };

  // $scope.sortItems = function(){
  //   var hideSheet = $ionicActionSheet.show({
  //     buttons: [
  //     { text: 'Date ascending' },
  //     { text: 'Date descending' },
  //     { text: 'Price ascending' },
  //     { text: 'Price descending' },
  //     { text: 'Distance ascending' },
  //     { text: 'Distance descending' }
  //     ],
  //     cancelText: 'Close',
  //     buttonClicked: function(index) {
  //       if(index == 0)
  //         $scope.sortParam = 'itemDetails.create_date';
  //       else if(index == 1)
  //         $scope.sortParam = '-itemDetails.create_date';
  //       else if(index == 2)
  //         $scope.sortParam = 'itemDetails.price';
  //       else if(index == 3)
  //         $scope.sortParam = '-itemDetails.price';
  //       else if(index == 4)
  //         $scope.sortParam = 'itemDetails.distance';
  //       else if(index == 5)
  //         $scope.sortParam = '-itemDetails.distance';
  //       return true;
  //     }
  //   });    
  // }

  $scope.loginData = {};
  $scope.resetData = {};
  $scope.registerData = {};
  $scope.searchData = {};
  $rootScope.User = [];
  
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  }

  $scope.login = function() {
    $scope.loginModal.show();
    $scope.registerModal.hide();
  };

  $scope.userLogin = function() {
    User.login($scope.UTIL.serialize($scope.loginData), function (response){
      if(response.done == true){
        var alertPopup = $ionicPopup.alert({
          title: 'Success',
          template: response.message
        })
        window.localStorage.setItem('user', JSON.stringify(response.data));
        CurrentUser.getUser(function (response){
          console.log(response)
          $rootScope.currentUser = response;
          if ($rootScope.currentUser == null) {
            console.log("no user")
          }
          else {}

            if (response == null || response == "") {
              $scope.menuBtn = false;
            }
            else {
              $scope.menuBtn = true;
            }
          });
        $scope.loginModal.hide();
        $scope.closeMenuLeft();
      }
      else {
        console.log(response)
        var alertPopup = $ionicPopup.alert({
          title: 'Oops',
          template: response.message
        })
      }
    })
  };

  $scope.postAdd = function(){
    if ($rootScope.currentUser.sell == 1) {
      $state.go('app.add')
    }
    else {
      $ionicPopup.alert({
        title:'Login As Seller',
        template:'Your account is not eligeable to post Add. Kindly register as seller to post Adds on this application.'
      })
    }
  }

  $scope.doLogout = function() {
    CurrentUser.removeUser(function() {
      $state.transitionTo("app.home");
      $rootScope.currentUser = null;
      $scope.menuBtn = false;
      $scope.closeMenuLeft();
    });
  };

  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.registerModal = modal;
  });

  $scope.closeRegister = function() {
    $scope.registerModal.hide();
  };

  $scope.register = function(id) {
    $scope.registerModal.show();
    $scope.loginModal.hide();
    if (id == 1) {
      $scope.registerData.isSeller = false;
    }
    else{
      $scope.registerData.isSeller = true; 
    }
  };

  $scope.doRegister = function() {

    var newUser = {};
    navigator.geolocation.getCurrentPosition(
      function(position) {
        newUser.latitude = position.coords.latitude;
        newUser.longitude = position.coords.longitude;
        registerUser();
      },
      function() {
        registerUser();
        alert('Error getting location');
      }
    );

    function registerUser(){
      newUser.email = $scope.registerData.email;
      newUser.password = $scope.registerData.password;
      newUser.address = $scope.registerData.location;
      newUser.sell = $scope.registerData.isSeller;
      
      if (newUser.sell == undefined || newUser.sell == false) {
        newUser.sell = 0
      }
      else {
        newUser.sell = 1
      };
      
      if ($scope.registerData.password != $scope.registerData.Repassword) {
        $ionicPopup.alert({
          title:'Warning',
          template:'Password does not match.'
        })
        return false;
      }
      else {
        User.register($scope.UTIL.serialize(newUser), function (response){
          if (response.done == true) {
            User.getUser(response.data, function (response){
              CurrentUser.setUser(response.data, function (updated){
                if (response.done == true) {
                  $ionicPopup.alert({
                    title:'Success',
                    template:'Thank you for signing up'
                  })

                  $scope.registerModal.hide();
                }
                else {
                  $ionicPopup.alert({
                    title:'Oops',
                    template:'Something went wrong!!'
                  })
                }
              })
            })
          };
        })
      }
    }
  };

  $scope.comment = function (id){

    $ionicModal.fromTemplateUrl('templates/comments.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.commentsModal = modal;
      $scope.commentsModal.show();
    });

    $rootScope.itemId = id;

  }

  $scope.closeComments = function(){
    $scope.commentsModal.hide();
  }    


     $ionicModal.fromTemplateUrl('templates/reset.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.resetModal = modal;
    });

    // Triggered in the reset password modal to close it
    $scope.closeReset = function() {
      $scope.resetModal.hide();
    };

    // Open the reset password modal
    $scope.reset = function() {
      $scope.resetModal.show();
    };

    $ionicModal.fromTemplateUrl('templates/search.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.searchModal = modal;
    });

    // Triggered in the search modal to close it
    $scope.closeSearch = function() {
      $scope.searchModal.hide();
    };

    // Open the search modal
    $scope.search = function() {
      $scope.searchModal.show();
    };

    $ionicModal.fromTemplateUrl('templates/filter.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.filterModal = modal;
    });

    // Triggered in the search modal to close it
    $scope.closeFilter = function() {
      $scope.filterModal.hide();
    };

    // Open the search modal
    $scope.filter = function() {
      $scope.filterModal.show();
    };

    // Perform the search action when the user submits the search form
    $scope.doSearch = function() {
      $rootScope.searchTerms = $scope.searchData.terms;
      $state.transitionTo("app.searchResults");
      $scope.searchModal.hide();
    };

    $scope.minPrice = 0;
    $scope.maxPrice = 99999;
    $scope.searchTerms = '';
    $scope.distance = 100000;
    $scope.doFilter = function(filterData) {

      console.log(filterData);
      index = filterData.sortOrder;

      if(filterData.priceMax != undefined && filterData.priceMax > 0)
        $scope.maxPrice = filterData.priceMax;
      else
        $scope.maxPrice = 99999;

      if(filterData.priceMin != undefined && filterData.priceMin >= 0)
        $scope.minPrice = filterData.priceMin;
      else
        $scope.minPrice = 0;

      if(filterData.text != undefined && filterData.text != '')
        $scope.searchTerms = filterData.text;
      else
        $scope.searchTerms = '';

      if(filterData.distanceRange != undefined && filterData.distanceRange >= 0)
        $scope.distance = filterData.distanceRange;
      else
        $scope.distance = 100000;

      if(index == 3)
        $scope.sortParam = 'itemDetails.create_date';
      else if(index == 4)
        $scope.sortParam = '-itemDetails.create_date';
      else if(index == 1)
        $scope.sortParam = 'itemDetails.price';
      else if(index == 2)
        $scope.sortParam = '-itemDetails.price';
      else if(index == 5)
        $scope.sortParam = 'itemDetails.distance';
      else if(index == 6)
        $scope.sortParam = '-itemDetails.distance';
      else
        $scope.sortParam = '-itemDetails.create_date';

        $scope.filterModal.hide();
    }

    $scope.clearFilter = function() {
      $scope.maxPrice = 99999;
      $scope.minPrice = 0;
      $scope.distance = 100000;
      $scope.searchTerms = '';
      $scope.sortParam = '-itemDetails.create_date';
      $scope.filterModal.hide();
    }


    $scope.priceFilter = function (list) {
      if(list.itemDetails == undefined)
        return true;

      return (parseInt(list.itemDetails.price) >= $scope.minPrice && parseInt(list.itemDetails.price) <= $scope.maxPrice);
    }

    $scope.distanceFilter = function (list) {
      if(list.itemDetails == undefined)
        return true;

      return (parseInt(list.itemDetails.distance) <= $scope.distance);
    }
    
    
    
// Getting Location 
$scope.getLocation = function() {
  var onGeoSuccess = function(position) {
    var latlng = position.coords.latitude + ', ' + position.coords.longitude;

        // Get location (city name, state)
        locationService.getLocation(latlng).then(function(location){
          var itemLocation = 
          location.results[0].address_components[4].long_name+
          ', ' +
          location.results[0].address_components[5].long_name;
          $scope.registerData.location = itemLocation;
          $scope.registerData.coords = new Parse.GeoPoint({latitude: position.coords.latitude, longitude: position.coords.longitude});
        },function(error){
                //Something went wrong!
              });
      };

        // onError Callback receives a PositionError object
        function onGeoError(error) {
          alert(error.message);
        }

        navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);   
      }

    })


.controller('SearchResultsCtrl', function($scope, $rootScope, $ionicLoading, $ionicSideMenuDelegate, ParseServices, Product) {

  $scope.getResults = function() {
    console.log($rootScope.searchTerms)
    Product.homePage(function (response){
      console.log(response)
      $scope.ItemsResutlts = response.data;
    })
  }
  $scope.getResults();

  $scope.nextPage = function() {
    $scope.pagenext = $scope.pagenext + 6;
    $ionicLoading.show({
      template: '<i class="material-icons">timelapse</i>'
    });
    $scope.getResults(); 
  }
})

.controller('UserItemsCtrl', function($scope, $rootScope, $ionicPopup, $ionicLoading, ParseServices, CurrentUser, User, Product) {

  $scope.getUserItems = function() {
    CurrentUser.getUser(function (user){
      User.getUserItems(user.user_id, function (items){
        console.log(items)
        $scope.UserItems = items.data;
      })
    })
  }
  $scope.getUserItems();

  $scope.removeUserItem = function(itemId) {
    var confirmPopup = $ionicPopup.confirm({
      title:'Are you sure you want to delete this add?',
      template:'Once you deleted your add it cannot be retrive again.'
    })
    confirmPopup.then(function(res){
      $scope.getUserItems();
      if(res){
        Product.productDelete(itemId, function (response){
          console.log(response);
          if(response.done == true){
            var alertPopup = $ionicPopup.alert({
              title:'Success',
              template:'Your add has been deleted.'
            })
          }
        })  
      }
    })
  }
})

.controller('TermsCtrl', function($scope, $state, $ionicSlideBoxDelegate, General) {
  // $scope.nextSlide = function() {
  //   $ionicSlideBoxDelegate.next();
  // }
  // $scope.gotoHome = function() {
  //   $state.transitionTo("app.home");
  // }

  General.terms(function (response){
    console.log(response)
    $scope.terms = response.data;
  })
})

.controller('HelpCtrl', function($scope, $state, $ionicSlideBoxDelegate, General) {
  // $scope.nextSlide = function() {
  //   $ionicSlideBoxDelegate.next();
  // }
  // $scope.gotoHome = function() {
  //   $state.transitionTo("app.home");
  // }

  General.faq(function (response){
    console.log(response)
    $scope.faq = response.data;
  })
})


.controller('HomeCtrl', function($scope, $rootScope, $timeout, $ionicHistory, $ionicLoading, $ionicModal, $ionicPopup, $state, ParseServices, CurrentUser, User, Product, haversine) {
  $ionicLoading.show({
    template: '<i class="material-icons">timelapse</i>'
  });

  $rootScope.searchMenu = true;

  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();

  var start = {};
  var end = {};

  $scope.getHomeItems = function() {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        start.latitude = position.coords.latitude;
        start.longitude = position.coords.longitude;
      },
      function() {
        alert('Error getting location');
        $scope.getHomeItems();
      }
      );
    Product.homePage(function (response){
      if (response.done == true) {
        $ionicLoading.hide();
        $scope.homeList = response.data;
        
        for(i=0; i<$scope.homeList.length; i++){
          if ($scope.homeList[i].type == "item") {
            end.latitude = $scope.homeList[i].itemDetails.latitude;
            end.longitude = $scope.homeList[i].itemDetails.longitude;
            $scope.homeList[i].itemDetails.distance = haversine(start, end, {unit:'km'});

            console.log($scope.homeList[i].itemDetails.distance);
          }
        }
      }
      else {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title:'Oops',
          template:'Something went wrong. Please try again or try refreshing page.'
        })
      }
    });

    // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.getHomeItems();
})


.controller('CategsCtrl', function($rootScope, $scope, Category) {
  Category.list(function (response){
    $rootScope.categories = response.data
  });    
})

.controller('ItemsCtrl', function($scope, $rootScope, $state, $stateParams, $ionicLoading, $ionicActionSheet, ParseServices, Product, haversine) {
  $ionicLoading.show({
    template: '<i class="material-icons">timelapse</i>'
  });
  $rootScope.searchMenu = true;
  $scope.sortParam = 'itemDetails.price';
  $scope.showNoListing = false;
  var start = {};
  var end = {};
  navigator.geolocation.getCurrentPosition(
    function(position) {
      start.latitude = position.coords.latitude;
      start.longitude = position.coords.longitude;
    },
    function() {
      alert('Error getting location');
      $scope.getHomeItems();
    }
    );
  Product.productCateg($stateParams.id, function (response){
    if(response.done == true){
      $scope.items = response.data;
      for(i=0; i<$scope.items.length; i++){
        if ($scope.items[i].type == "item") {
          end.latitude = $scope.items[i].itemDetails.latitude;
          end.longitude = $scope.items[i].itemDetails.longitude;
          $scope.items[i].itemDetails.distance = haversine(start, end, {unit:'km'});
        }
      }
      $ionicLoading.hide();
    }
    console.log($scope.items)
    
    if($scope.items == null){
      $scope.showNoListing = true;
      $ionicLoading.hide();
    }
  })
})

.controller('ItemCtrl', function($scope, $state, $rootScope, $ionicModal, $ionicPopup, $stateParams, $ionicHistory, $ionicLoading, $ionicScrollDelegate, $timeout, $ionicSlideBoxDelegate, Product, CurrentUser) {

    $ionicLoading.show({
      template: '<i class="material-icons">timelapse</i>'
    });

    // setTimeout(function() {
    //     $('#mapDisplay').hide('fast');
    // }, 1000); // <-- time in milliseconds

    $scope.getItemDetails = function(id) {
      Product.productDetail($stateParams.id, function (response){
        console.log(response)
        $scope.item = response.data
        $scope.image_data = response.image_data;

        setTimeout(function(){
          $ionicSlideBoxDelegate.update();
          $ionicLoading.hide();
        },2000);
      })
    }

    $scope.addToFavourites = function(id) {
      var favouriteItem = [{item_id: ''}];

      var favouriteItem = JSON.parse(window.localStorage.getItem('favourite'));
      if (favouriteItem == null) 
      {
        favouriteItem =[{item_id: id}]
        window.localStorage.setItem('favourite', JSON.stringify(favouriteItem));
      }
      else {
        var itemToAdd = {item_id: id};

        for(var k in favouriteItem) {
          if(JSON.stringify(favouriteItem[k]) == JSON.stringify(itemToAdd))
          { 
            var alertPopup = $ionicPopup.alert({
              title:'',
              template:'This item already is in your list.'
            });
            return false;
          }
        }

        favouriteItem.push(itemToAdd);
        window.localStorage.setItem('favourite', JSON.stringify(favouriteItem));
      }

      var alertPopup = $ionicPopup.alert({
        title: 'Success!',
        template: 'Item has been added to your favourite list'
      });
    }
    
    
    
  //// Details Modal ///
  // Create the modal
  $ionicModal.fromTemplateUrl('templates/itemDetails.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.detailsModal = modal;
  });

  ////Zoom Modal ///
  // Create the modal
  $ionicModal.fromTemplateUrl('templates/zoomImage.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.zoomModal = modal;
  });

  // Triggered in the modal to close it
  $scope.closeDetails = function() {
    $scope.detailsModal.hide();
  };

  // Triggered in the modal to close it
  $scope.closeZoom = function() {
    $scope.zoomModal.hide();
  };

  $scope.zoom = function (img){
    $scope.imageSrc = img;
    $scope.zoomModal.show();
  }

  // Open modal
  $scope.itemDetails = function() {
    $scope.detailsModal.show();
  };
  
  $scope.onShare = function() {     
    window.plugins.socialsharing.share($scope.item.item_title + '\n$' + $scope.item.price, null, 'http://www.nhari.nl/mobileapp/'+$scope.image_data[0].item_image, null)
  };    

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };  

})


.controller('NearMeCtrl', function($scope, $state, $rootScope, ParseServices) {
  ParseServices.nearMe($rootScope.currentUser, 100).then(function(response) {

    $scope.nearItems = [];

    for (var i = 0; i < response.length; i++) {
      $scope.nearItems.push({
        name: response[i].get('itemName'),
        coords: response[i].get('itemCoords').latitude + ',' + response[i].get('itemCoords').longitude,
        location: response[i].get('itemLocation'),
        id: response[i].id,
        i: i,

      })


    }
    console.log($scope.nearItems);

    $scope.$apply();
  })



})


.controller('CommentsCtrl', function($scope, $rootScope, $ionicModal, $ionicPopup, $ionicLoading, Product) {
  // Perform the action when the user submits the form
  $scope.loadComment = function(){
    $ionicLoading.show({
      template: '<i class="material-icons">timelapse</i>'
    });
    Product.productGetComment($rootScope.itemId, function(data){
      if(data.done == true){
        $scope.comments = data.product_comments;
        $ionicLoading.hide()  
      }
      else{
        $ionicLoading.hide();
        $ionicPopup.alert({
          title:'Oops',
          template:'Something went wrong.'
        })
      }
    });
  }

  $scope.loadComment();

  $scope.doComment = function(item) {
    $ionicLoading.show({
      template: '<i class="material-icons">timelapse</i>'
    });
    var comment = {};

    comment.user_id = $rootScope.currentUser.user_id;
    comment.item_id = $rootScope.itemId;
    comment.comment_message = $scope.commentData.comment;

    Product.productPostComment($scope.UTIL.serialize(comment), function (response){
      if (response.done == true) {
        $scope.loadComment();
        $ionicLoading.hide()
      }
      else{
        $ionicLoading.hide();
        $ionicPopup.alert({
          title:'Oops',
          template:'Something went wrong. Try again later.'
        })
      }
    })

  }
})


.controller('SettingsCtrl', function($scope, $rootScope, $ionicPopup, ParseServices, locationService) {
  $scope.User = [];
  ParseServices.getFirst('User', "email", $rootScope.currentUser.get('email')).then(function(response) {
    if(response.get('avatar')) { var avatar = response.get('avatar')._url; } else { var avatar = 'img/avatar.png';} 
    $scope.User.push({
      email: response.get('email'),
      avatar: avatar,
      location: response.get('location'),
      phone: response.get('phone'),
    })

    $scope.$apply();

  },function(error){
                //Something went wrong!
              });


    // Getting the image
    $scope.getImage = function() {
      console.log('work')
      navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit:true,
        destinationType: Camera.DestinationType.DATA_URL
      });
    }
    
    $scope.getCamera = function() {
      navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        allowEdit:true,
        destinationType: Camera.DestinationType.DATA_URL
      });
    }
    
    
    function onSuccess(imageData) {
      document.getElementById('myAvatar').src="data:image/jpeg;base64," + imageData;
      var base64pic = "data:image/jpeg;base64," + imageData;
      var parseFile = new Parse.File("picture", {base64:base64pic});
      $scope.parseFile = parseFile; 
      parseFile.save().then(function() {

        var user = $scope.currentUser;
        user.set("avatar", $scope.parseFile);
        user.save();
        $ionicPopup.alert({
          title: "Success",
          content: "Your new profile picture was saved."
        }).then(function() {

        })
      }, function(error) {
        // The file either could not be read, or could not be saved to Parse.
      });
    } 
    
    function onFail(message) {
      alert('Failed because: ' + message);
    }
    
   // Getting Location 
   $scope.getLocation = function() {

    $scope.userData = {};

    var onGeoSuccess = function(position) {
      var latlng = position.coords.latitude + ', ' + position.coords.longitude;

        // Get location (city name, state)
        locationService.getLocation(latlng).then(function(location){
          var itemLocation = 
          location.results[0].address_components[1].long_name + ', ' + location.results[0].address_components[2].long_name;
          $scope.userData.location = itemLocation;
          $scope.$apply();
          $scope.userData.coords = new Parse.GeoPoint({latitude: position.coords.latitude, longitude: position.coords.longitude});

          var user = $scope.currentUser;
          user.set("coords", $scope.userData.coords);
          user.set("location", $scope.userData.location)
          user.save();

        },function(error){
                //Something went wrong!
              });
      };

        // onError Callback receives a PositionError object
        function onGeoError(error) {
          alert(error.message);
        }

        navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError); 
        
      }

    })

.controller('UserFavouritesCtrl', function($scope, $state, $rootScope, $ionicPopup, $ionicLoading, Product) {

  $scope.items = [];
  $scope.getFavourites = function() {
    $scope.items = [];
    var favouriteItem = JSON.parse(window.localStorage.getItem('favourite'));
    console.log(favouriteItem);
    for (var i = favouriteItem.length - 1; i >= 0; i--) {
      if(favouriteItem[i].item_id != undefined)
      {
        Product.productDetail(favouriteItem[i].item_id, function(result){
          $scope.items.push(result);
        });
      }
    }
  }

  $scope.getFavourites();


  $scope.removeFavourite = function(item) {
    var favouriteItem = JSON.parse(window.localStorage.getItem('favourite'));
    for (var i = favouriteItem.length - 1; i >= 0; i--) {

      if(favouriteItem[i].item_id == item){
        favouriteItem.splice(i, 1);
        break;
      }
    }

    window.localStorage.setItem('favourite', JSON.stringify(favouriteItem));
    $scope.getFavourites();
  }
})


.controller('AddCtrl', function($scope, $state, $rootScope, $ionicPopup, $ionicLoading, ParseServices, locationService, Product, CurrentUser) {
  $scope.item = {};
  $scope.itemPhotos = [];

  $('#myImage').attr("src", 'img/item-sample.png');

     // Getting Location 
     $scope.getLocation = function() {
      var onGeoSuccess = function(position) {
        var latlng = position.coords.latitude + ', ' + position.coords.longitude;

                    // Get location (city name, state)
                    locationService.getLocation(latlng).then(function(location){
                      var itemLocation = 
                      location.results[0].address_components[1].long_name + ', ' + location.results[0].address_components[2].long_name;
                      $scope.item.location = itemLocation;
                      $scope.item.coords = new Parse.GeoPoint({latitude: position.coords.latitude, longitude: position.coords.longitude});
                    },function(error){
                    //Something went wrong!
                  });
                  };
            // onError Callback receives a PositionError object
            //
            function onGeoError(error) {
              alert(error.message);
            }
            navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);   
          }

     // Getting the image
     $scope.getImage = function() {
      navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit:true,
        destinationType: Camera.DestinationType.DATA_URL
      });  
    }
    
    $scope.getCamera = function() {
      navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        allowEdit:true,
        destinationType: Camera.DestinationType.DATA_URL
      });
    }
    
    
    function onSuccess(imageData) {
      var image = "data:image/jpeg;base64," + imageData;
      $scope.itemPhotos.push(image);
    } 
    
    function onFail(message) {
      alert('Failed because: ' + message);
    }

    $scope.removeImage = function($index){
      $scope.itemPhotos.splice($index, 1);
      alert('working')
    }

    $scope.send = function(item) {
      console.log(item)
      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirmation',
        template: 'Are you sure to post this add?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          $ionicLoading.show({
            template: '<i class="material-icons">timelapse</i>'
          });
          CurrentUser.getUser(function (response){
            if (response != null) {
              var itemToAdd = {};
              itemToAdd.user_id = response.user_id;
              itemToAdd.item_title = item.item_title;
              itemToAdd.category_id = item.category_id;
              itemToAdd.description = item.description;
              itemToAdd.price = item.price;
              itemToAdd.item_image = JSON.stringify($scope.itemPhotos);
              if (item.accept == true) {
                Product.productPost($scope.UTIL.serialize(itemToAdd), function (response){
                  if (response.done == true) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                     title: 'Congratulations',
                     template: 'Your add has been posted.'
                   });
                    $state.go('app.useritems');
                    return false;
                  }
                  else {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                     title: 'Oops',
                     template: 'Some error accured.'
                   });
                    return false;
                  }
                })
              }
              else {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                  title:'Attention!!',
                  template:'Without accepting terms and condition your add could not be posted.'
                })
                return false;
              }
            }
            else {
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title:'Oops',
                template:'Your are not Logged in. Login to post add'
              })
              return false;
            }
          })
        }
      })
    }
  })

.controller('EditAddCtrl', function($scope, $ionicPopup, $stateParams, $ionicLoading, Product, CurrentUser) {
  $scope.itemPhotos = [];
  $scope.images = [];

  $scope.getDetail = function () {

    $ionicLoading.show({
      template: '<i class="material-icons">timelapse</i>'
    });

    Product.productDetail($stateParams.id, function (response){
      if (response.done == true) {
        $scope.item = response.data;
        if(response.image_data[0] != 'images/no-image.jpeg')
          $scope.images = response.image_data;

        $ionicLoading.hide();  
      }
      else{
        var alertPopup = $ionicPopup.alert({
          title:'Oops',
          template:'We are unable to get details. Sorry for the inconvenience'
        })
        alertPopup.then(function(){
          $state.go('app.useritems')
          $ionicLoading.hide();
          return false;
        })
      }
    })
  }
  $scope.getDetail();

  $scope.update = function (item){

    var confirmPopup = $ionicPopup.confirm({
      title:'Confirmation',
      template:'Are you sure, you want to edit details?'
    })
    confirmPopup.then(function(res){
      if(res){
        $ionicLoading.show({
          template: '<i class="material-icons">timelapse</i>'
        });

        item.item_id = $scope.item.item_id;
        item.item_image = JSON.stringify($scope.itemPhotos);
        console.log(item)
        Product.productEdit($scope.UTIL.serialize(item), function (response){
          if (response.done == true) {
            $ionicPopup.alert({
              title:'Success',
              template:'Successfully edit info'
            })
            $scope.getDetail();
            $ionicLoading.hide();
          }
        })
      }
    })
  }

  $scope.getImageEdit = function() {

    var total = $scope.itemPhotos.length + $scope.images.length;
    if (total == 5) {
      var alertPopup = $ionicPopup.alert({
        title:'Cant Upload',
        template:'Max picture limit(5) reached.'
      })
      return false;
    }
    else{
      // navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
      //   sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
      //   allowEdit:true,
      //   destinationType: Camera.DestinationType.DATA_URL
      // });
      var image = "data:image/jpeg;base64,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";
      //var test = JSON.stringify(image);
      $scope.itemPhotos.push(image);
    }
  }

  $scope.getCameraEdit = function() {

    var total = $scope.itemPhotos.length + $scope.images.length;
    if (total == 5) {
      var alertPopup = $ionicPopup.alert({
        title:'Cant Upload',
        template:'Max picture limit(5) reached.'
      })
      return false;
    }
    else{
      navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        allowEdit:true,
        destinationType: Camera.DestinationType.DATA_URL
      });
    }
  }

  function onSuccess(imageData) {
    var image = "data:image/jpeg;base64," + imageData;
    $scope.itemPhotos.push(image);
  } 

  function onFail(message) {
    var alertPopup = $ionicPopup.alert({
      title:'Failed because',
      template: message
    })
  }

  $scope.removeImage = function(id){

    var confirmPopup = $ionicPopup.confirm({
      title:'Are you sure?',
      template:'You are about to delete an image. This action cannot be revert back.'
    })

    confirmPopup.then(function(res){
      if(res){
        Product.deleteProductImg(id, function (response){
          if (response.done == true) {
            $ionicPopup.alert({
              title:'Success',
              template:response.message
            })
            $scope.getDetail();
          };
        })
      }
    })
  }
})  
