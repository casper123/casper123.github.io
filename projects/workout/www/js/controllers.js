angular.module('workoutfactory.controllers', ['ngSanitize', 'wu.masonry'])

.controller('DashCtrl', function($scope, $location, $ionicLoading, $timeout, Dashboard) {

	/*$ionicLoading.show({
	    template: '<i class="icon ion-ios7-reloading">'
	});*/

	Dashboard.getAll(function(dashboard_data) {
		$scope.latest_recipe = dashboard_data["updatDate"];
                $scope.most_favourite = dashboard_data.favourite;
		$scope.random_recipe = dashboard_data.random;
		$scope.latest_recipe_forSlider = dashboard_data["recipie"];
		$scope.bottomExcersice = dashboard_data.bottom_excercise;
		
    });
})

.controller('RecipieCtrl', function($scope, $location, $ionicLoading, $stateParams, $timeout, Recipie) {
	
	Recipie.getItems($stateParams.itemId, function(data) {
		$scope.dietItem = data.diet;
		console.log($scope.dietItem);
    });

})


.controller('RecipeHomeCtrl', function($scope, $stateParams, $ionicLoading, Dashboard) {

	$ionicLoading.show({
	    template: '<i class="icon ion-ios7-reloading">'
	});

	$scope.selectedTab = "recent";

	if($stateParams.typeId == 1)
		$scope.tab_name = "Latest Workout";
	else
		$scope.tab_name = "Popular Workout";

	Dashboard.getItems($stateParams.typeId, function(data) {
        $scope.items = data;
        $ionicLoading.hide();
    });
})

.controller('RecipeCtrl', function($scope, $ionicLoading, $ionicSlideBoxDelegate, Category) {

	$ionicLoading.show({
	    template: '<i class="icon ion-ios7-reloading">'
	});

	$scope.next = function() {
		//console.log("next");
    	$ionicSlideBoxDelegate.next();
  	}

  	$scope.previous= function() {
  		//console.log("prev");
    	$ionicSlideBoxDelegate.previous();
  	}

	Category.getAll(function(bodypart) {
        $scope.category_list = bodypart["name"];
		console.log($scope.category_list);
        $ionicLoading.hide();
        $ionicSlideBoxDelegate.update();
    });
})

.controller('RecipeListCtrl', function($scope, $filter, $stateParams, $ionicLoading, Category) {

	var orderBy = $filter('orderBy');
	$ionicLoading.show({
	    template: '<i class="icon ion-ios7-reloading">'
	});

	$scope.selectedTab = "recent";
	$scope.predicate = "createDate";

	$scope.category_name = $stateParams.catName;

	Category.getCategoryItems($stateParams.catId,function(data) {
        var recipe_list = data;
        $scope.muscle = recipe_list["muscle"];
		$scope.recipe_list = recipe_list["details"];
		$scope.page_title = recipe_list["page_title"]; 
		$ionicLoading.hide();
    });
})

.controller('RecipeItemCtrl', function($scope, $location, $stateParams, $ionicLoading, Item) {

	$ionicLoading.show({
	    template: '<i class="icon ion-ios7-reloading">'
	});

	//console.log("shah pre: " + $scope.previousLocation);

	Item.getItem($stateParams.itemId, function(data) {
		$scope.item = data;
        $scope.equipments = data["equipments"];
		$scope.excercise = data["excercise"];
        $scope.images = data["images"];
		$scope.mainMuscle = data["mainMuscle"];
		$scope.moreExcercise = data["moreExcercise"];
        $scope.page_title = data["page_title"];
		
		//for Favourite
			$scope.excercise.id = data["excercise"][0]["id"];
			$scope.excercise.name =  data["excercise"][0]["name"];
			
		$ionicLoading.hide();

        var fav = JSON.parse(window.localStorage.getItem('favourite_recipe'));
    	if(fav == null)
    		fav = [];

    	for(var k in fav) 
    	{
    		var obj = JSON.parse(fav[k]);
		   	if(obj.id == $stateParams.itemId)
		   		$scope.isFavourite = true;
		} 
    });

	$scope.goHome = function() {
		$state.go('tab.home');
	}

    $scope.addFavorite = function() {
    	var item = JSON.stringify({
			id    : $scope.excercise.id,
			name  : $scope.item["excercise"][0]["name"],
			image : $scope.item["images"][0]["location"],
		});

    	//alert(JSON.stringify(item));

    	//alert(window.localStorage.getItem('favourite_recipe'));

    	var fav = JSON.parse(window.localStorage.getItem('favourite_recipe'));

    	//alert(fav);

    	if(fav == null)
    		fav = [];

    	//alert(window.localStorage.getItem('favourite_recipe'));

    	for(var k in fav) 
    	{
		   	if(JSON.stringify(fav[k]) == JSON.stringify(item))
		   	{
		   		navigator.notification.alert($scope.item['excercise'][0]['name'] + " is already added to Favourites!", null, 'Warning!', 'Ok' );
		   		return;
		   	}
		}

		fav.push(item);
		window.localStorage.setItem("favourite_recipe", JSON.stringify(fav));

		//alert(window.localStorage.getItem('favourite_recipe'));

		Item.updateFavourite($scope.item.id);
		angular.element(document.getElementById("add_favoutire_btn")).remove();
		navigator.notification.alert($scope.item['excercise'][0]['name'] + " has been added to your Favourite Workout", null, 'Success!', 'Ok' );
    };
})

.controller('FavouriteCtrl', function($scope, $ionicScrollDelegate, filterFilter) {

var letters = $scope.letters = [];
   var contacts = $scope.contacts = [];
   var currentCharCode = 'A'.charCodeAt(0) - 1;
   var recipes = [];

   favourite_recipe = JSON.parse(window.localStorage.getItem('favourite_recipe'));
   //console.log(favourite_recipe);

   if(favourite_recipe == null)
    return;

   favourite_recipe.sort(function(a, b) 
   {
     return a.name > b.name ? 1 : -1;
   })
   .forEach(function(person) 
   {
    person = JSON.parse(person);
    //Get the first letter of the last name, and if the last name changes
    //put the letter in the array
    //var personCharCode = person.name.toUpperCase().charCodeAt(o);
    //We may jump two letters, be sure to put both in
    //(eg if we jump from Adam Bradley to Bob Doe, add both C and D)
    //var difference = personCharCode - currentCharCode;
    //for(var i = 1; i <= difference; i++) {
      //addLetter(currentCharCode + i);
    //}
    //currentCharCode = personCharCode;
    recipes.push(person);
    });

    //for (var i = currentCharCode + 1; i <= 'Z'.charCodeAt(o); i++) {
     //addLetter(i);
   //}

   /*function addLetter(code) {
     var letter = String.fromCharCode(code);
     recipes.push({
        isLetter: true,
        letter: letter
     });
     letters.push(letter);
   }*/

   //Letters are shorter, everything else is 52 pixels
   $scope.getItemHeight = function(item) {
     return item.isLetter ? 40 : 80;
   };

   $scope.getItemWidth = function(item) {
     return '100%';
   };

   $scope.scrollBottom = function() {
     $ionicScrollDelegate.scrollBottom(true);
   };

   var letterHasMatch = {};
   $scope.getRecipe = function() {
     letterHasMatch = {};
     //Filter contacts by $scope.search.
     //Additionally, filter letters so that they only show if there
     //is one or more matching contact
     return recipes.filter(function(item) {
        var itemDoesMatch = !$scope.search || item.isLetter ||
          item.name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

      //Mark this person's last name letter as 'has a match'
      if(!item.isLetter && itemDoesMatch) {
          var letter = item.name.charAt(0).toUpperCase();
          //letterHasMatch[letter] = true;
      }

        return itemDoesMatch;
     }).filter(function(item) {
       //Finally, re-filter all of the letters and take out ones that don't
       //have a match
       //if (item.isLetter && !letterHasMatch[item.letter]) {
         //return false;
       //}
       return true;
     });
   };

   $scope.clearSearch = function() {
     $scope.search = '';
   };

   $scope.favourite_question = JSON.parse(window.localStorage.getItem('favourite_question'));
})

.controller('MoreCtrl', function($scope, $ionicActionSheet) {
  
  	$scope.clearFavourite = function() {
		window.localStorage.clear();
		navigator.notification.alert("Your Favourite Workout are now cleared!", null, 'Success!', 'Ok' );
	};

	$scope.showActionsheet = function() {
	    $ionicActionSheet.show({
	     	titleText: 'Share Bawarchi with Friends',
	      	buttons: [
	        	{ text: '<i class="icon ion-social-facebook-outline"></i> Share on Facebook' },
	        	{ text: '<i class="icon ion-social-twitter-outline"></i> Share on Twitter' },
	        	{ text: '<i class="icon ion-ios7-email-outline"></i> Share via SMS' },
	      	],
	      	cancelText: 'Cancel',
	      	cancel: function() {
	        	//console.log('CANCELLED');
	      	},
	      	buttonClicked: function(index) 
	      	{
	      		var sharelink = "market://details?id=com.curiouslabx.workoutfactory";
	      		var title = "Workout - Factory made you Healthy";
	      		var image = "http://wahabkotwal.net/projects/bawarchi/images/logo.png";

	        	if(index == 0)
	        		window.plugins.socialsharing.shareViaFacebook(title, null, sharelink, function() {}, function(errormsg){alert(errormsg)});
	        	else if(index == 1)
	        		window.plugins.socialsharing.shareViaTwitter(title, null, sharelink);
	        	else if(index == 2)
	        		window.plugins.socialsharing.shareViaSMS(title + ".. You can download this here:" + sharelink, null, function(msg) {}, function(msg) {alert('error: ' + msg)});
	        	
	        	return true;
	      	}
	    });
	};
})

.controller('AboutCtrl', function($scope) {
  
})

.controller('HelpCtrl', function($scope) {
  
})



.controller('SettingCtrl', function($scope) {
  
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
})
 //Rxzx Additon
 .controller('BodyPartCtrl',function($scope, $stateParams,Bodyparts){
	$scope.bodyPart = Bodyparts.getAll(function(bodyPart_data){
	$scope.item =  bodyPart_data["name"];
	console.log($scope.item);
	});
});