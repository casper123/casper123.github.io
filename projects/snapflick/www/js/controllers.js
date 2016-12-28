angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope,$ionicHistory,$ionicLoading,$stateParams,$state,User,Settings){

	$scope.baseUrl = 'http://snapflick.co/';
	//get background image
	Settings.getBgImage(function(bgImageData){
		if(bgImageData.done == true)
		{
			$scope.bgImagePath = $scope.baseUrl + bgImageData.data[0].bg_image_path;
			$scope.bgImageTitle = bgImageData.data[0].bg_image_title;
		}
	});

	User.getCurrentUser(function(user) {
		$scope.userId = user.userId;
		$scope.userName = (user.firstName).charAt(0).toUpperCase() + (user.firstName).slice(1) + ' ' + (user.lastName).charAt(0).toUpperCase() + (user.lastName).slice(1);
		$scope.pointsEarned = user.pointsEarned;
	});
	
	User.getUserImages($scope.userId, function(images){
		if(images.done == true && images.data.length > 0)
			$scope.userImage = 'http://snapflick.co/' + images.data[0].path;
	});

	//tabs icon hover
	$scope.SavedIconImage = "img/saved.png";
	$scope.ProfileIconImage = "img/profile.png";
	$scope.TopMemberIconImage = "img/top-members.png";
	$scope.SettingIconImage = "img/settings.png";
	$scope.onTouchSavedIcon = function(event){
		$scope.SavedIconImage = "img/saved-press.png";
	}
	$scope.offTouchSavedIcon = function(event){
		$scope.SavedIconImage = "img/saved.png";
	}
	$scope.onTouchProfileIcon = function(event){
		$scope.ProfileIconImage = "img/profile-press.png";
	}
	$scope.offTouchProfileIcon = function(event){
		$scope.ProfileIconImage = "img/profile.png";
	}
	$scope.onTouchTopMemberIcon = function(event){
		$scope.TopMemberIconImage = "img/top-members-press.png";
	}
	$scope.offTouchTopMemberIcon = function(event){
		$scope.TopMemberIconImage = "img/top-members.png";
	}
	$scope.onTouchSettingIcon = function(event){
		$scope.SettingIconImage = "img/settings-press.png";
	}
	$scope.offTouchSettingIcon = function(event){
		$scope.SettingIconImage = "img/settings.png";
	}
})

.controller('DashCtrl', function($scope, $ionicHistory, $ionicLoading, $state, $ionicModal, $stateParams, $cordovaNetwork, User, Product, Movie) {
	$ionicHistory.clearHistory();
	$scope.footer = true;
	$scope.noNetwork = false;
	$scope.searchQuery = [];
	$scope.searchQuery.text = "";



	document.addEventListener("deviceready", function () {
		if($cordovaNetwork.isOffline() == true)
		{
			alert("It seems like you have poor or no internet connection");
			$scope.noNetwork = true;	
		}
	});

	$scope.searchItem = false;

	User.getCurrentUser(function(user) {
		$scope.user = user;
	});

	User.getUser($scope.user.userId,function(userData){
		$scope.user = userData.data; 
		//console.log($scope.user);
	});

	var doSearch = ionic.debounce(function(query) {
		Movie.searchMovie(query,function(movies) {
			$scope.items = movies.data;
			var dates = [];
			var month = new Array();
			month[0] = "Jan";
			month[1] = "Feb";
			month[2] = "Mar";
			month[3] = "Apr";
			month[4] = "May";
			month[5] = "Jun";
			month[6] = "Jul";
			month[7] = "Aug";
			month[8] = "Sep";
			month[9] = "Oct";
			month[10] = "Nov";
			month[11] = "Dec";
			for(var i = 0;i< $scope.items.length; i++)
			{
				dates[i] = new Date($scope.items[i].date);
				$scope.items[i].date = month[(dates[i]).getMonth()] + ' ' + (dates[i]).getDate()+ ', ' + (dates[i]).getFullYear();
			}
			console.log($scope.items[0].date);
		});
	}, 500);

	$scope.search = function() 
	{
		if($scope.searchQuery.text != "")
			$scope.searchItem = true;
		else
			$scope.searchItem = false;
		
		doSearch($scope.searchQuery.text);
	}

	$scope.removeSearch = function()
	{
		console.log("okey");
	}

	$scope.clearSearch = function(){
		$scope.searchItem = false;

		console.log($scope.searchQuery.text);
		$scope.searchQuery.text = "";	
		console.log($scope.searchQuery.text);
	}


	// Product.getMovieDetail(4, $scope.user.userId, function(data){
	// 					console.log(data.data.details.movie_synopsis);
	// 				});
	$scope.scanQr = function()
	{
		window.cordova.plugins.barcodeScanner.scan(
			function (result) 
			{
				$ionicLoading.show({
					template: '<i class="icon ion-ios7-reloading"></i>'
				});

				var id = result.text;
				console.log(id);
				if(id != undefined && parseInt(id) > 0)
				{
					Product.getMovieDetail(id, $scope.user.userId, function(data){
						console.log(data.data.details);

						$scope.prodctDetails = data.data.details;
						console.log($scope.prodctDetails);

						$ionicModal.fromTemplateUrl('templates/product-modal.html', {
							scope: $scope,
							animation: 'slide-in-up'
						}).then(function(modal) {
							$scope.modal = modal;
							$scope.modal.show();
							$ionicLoading.hide();
						});		
					});
				}
				else
				{
					$ionicLoading.hide();
					alert("We could not find a movie with this QR Code");				}
			}, 
			function (error) {
				alert("Scanning failed: " + error);
			});

			/*
			Product.getMovieDetail(6, function(data){
				
				$scope.prodctDetails = data.data.details;
				console.log($scope.prodctDetails);
				
				$ionicModal.fromTemplateUrl('templates/product-modal.html', {
				    scope: $scope,
				    animation: 'slide-in-up'
				}).then(function(modal) {
				    $scope.modal = modal;
				    $scope.modal.show();
				});		
			});
			*/
	}

	$scope.closeModal = function(){
		$scope.modal.hide();
	}

	$scope.addToFavourite = function()
	{
		var product = {};
		product.product_id = $scope.prodctDetails.movie_id;
		product.user_id = $scope.user.userId;

		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});
		Product.saveUserProduct($scope.UTIL.serialize(product), function(response) {
			console.log(response);
			if(response.done == true)
			{
				$ionicLoading.hide();
				$scope.modal.hide();
				$state.go("tab.movieDetail", { movieId: $scope.prodctDetails.movie_id, movieName: $scope.prodctDetails.movie_name });
			}
			else
			{
				$ionicLoading.hide();
				$scope.modal.hide();
				alert(response.message);
			}
		});
	}

	$scope.logout = function()
	{
		console.log("her2");
		window.localStorage.removeItem("user");
		console.log(window.localStorage.getItem("user"));
		$state.go('user.login');
	}

	$scope.browseIconImage= "img/browse-movie.png";
	$scope.onScreen = function(event){
		$scope.browseIconImage= "img/browse-movie-press.png";
	}
	$scope.offScreen = function(){
		$scope.browseIconImage= "img/browse-movie.png";
	}

	$scope.clearSearch();
})

.controller('UserCtrl', function($scope, $stateParams, $ionicLoading, $state, $cordovaFacebook, $cordovaNetwork, User){
	          
	$scope.noNetwork = false;

	document.addEventListener("deviceready", function () {
		if($cordovaNetwork.isOffline() == true)
		{
			alert("It seems like you have poor or no internet connection");
			$scope.noNetwork = true;	
		}
	});

	User.getCurrentUser(function(user) {
		$scope.user = user;

		if($scope.user != null || $scope.user != undefined)
		{
			$state.go("tab.home");
			return;
		}
	});

	$scope.user = {};
	$scope.days={};
	$scope.years = {};
	$scope.errorMessage = null;
	for(var year = 1940 ; year<=2014; year++)
	{
		$scope.years[year] = year;
	}
	for(var day = 1; day<=31; day++)
	{
		$scope.days[day] = day;
	}	

	$scope.register = function(user)
	{
		//$scope.formateDate(user.dob);

		//function to clac Age from DOB
		function calculateAge(birthday) 
		{ 
		    var ageDifMs = Date.now() - birthday.getTime();
		    var ageDate = new Date(ageDifMs); // miliseconds from epoch
		    return Math.abs(ageDate.getUTCFullYear() - 1970);
		}

		if(!(user.email || user.password))
			return $scope.errorMessage = 'Please supply a email and password';

		if(user.password != user.passwordVerify)
			return $scope.errorMessage = 'Your passwords do not match';
		
		if(user.city == '')
			return $scope.errorMessage = 'Please supply a city';
		
		if(user.state == '')
			return $scope.errorMessage = 'Please supply a state';
		
		if(user.country == '')
			return $scope.errorMessage = 'Please supply a country';

		var d = $scope.user.dob;
		$scope.user.dobConverted = 	d.getFullYear() + "-" + d.getMonth() + "-" +  d.getDate();
		var age = calculateAge($scope.user.dob);
		if(age < 13)
			return $scope.errorMessage = 'You must be atleast 13 years old to signup';


		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});

		user.gcm_regId = window.localStorage.getItem('deviceId');		

		
		User.addUser($scope.UTIL.serialize(user), function(response) {
				console.log(response);
				if(response.done == true)
				{
					var user = {	
						userId : response.data.user_id,
						email : response.data.email,
						password : response.data.password,
						loggedin : true,
						firstName : response.data.f_name,
						lastName : response.data.l_name,
						pointsEarned: response.data.points_earned,
						userImage: response.data.u_image,
					};
					window.localStorage.setItem("user" , JSON.stringify(user));
					$ionicLoading.hide();
					$state.go('tab.home');
				}
				else
				{
					$scope.errorMessage = response.message;
					$ionicLoading.hide();
				}
			});
		
		$ionicLoading.hide();	
	};

	$scope.doLogin = function(user)
	{
		if(!(user.email && user.password)) 
		{
			return $scope.errorMessage = 'Please supply a email address and password';
		}

		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});

		user.gcm_regId = window.localStorage.getItem('deviceId');
		User.login($scope.UTIL.serialize(user), function(response) {
			if(response.done == true)
			{			
				var user = {	
					userId : response.data.user_id,
					email : response.data.email,
					password : response.data.password,
					loggedin : true,
					firstName : response.data.f_name,
					lastName : response.data.l_name,
					pointsEarned: response.data.points_earned,
					userImage: response.data.u_image,
				};

				window.localStorage.setItem("user" , JSON.stringify(user));
				$ionicLoading.hide();
				$state.go('tab.home');
			}
			else
			{
				$ionicLoading.hide();
				return $scope.errorMessage = response.message;
			} 
		})
		$ionicLoading.hide();
	};

	$scope.facebookLogin = function()
	{
		$cordovaFacebook.login(["public_profile", "email", "user_friends", "user_birthday", "user_location", "user_photos"]).then(function(response) {

			$ionicLoading.show({
				template: '<i class="icon ion-ios7-reloading"></i>'
			});

			$cordovaFacebook.api("me", ["public_profile", "user_birthday", "user_location"]).then(function(success) {
				
				//console.log(success);
				
				if(success.location != undefined)
					success.loc = success.location.name;

				/*$cordovaFacebook.getAccessToken().then(function(success) {
			      	console.log(success);
			    }, function (error) {
			      	console.log(error);
			    });*/

				var gcm_regId = window.localStorage.getItem('deviceId');
				success.gcm_regId = gcm_regId;
				User.facebookLogin($scope.UTIL.serialize(success), function(response) {
					if(response.done == true)
					{
						var user = {	
							userId : response.data.user_id,
							email : response.data.email,
							password : response.data.password,
							loggedin : true,
							firstName : response.data.f_name,
							lastName : response.data.l_name,
							pointsEarned: response.data.points_earned,
							userImage: response.data.u_image,
							facebookLogin: true
						};
						
						window.localStorage.setItem("user" , JSON.stringify(user));
						$ionicLoading.hide();
						$state.go('tab.home');
					}
				})

			}, function (error) {
				console.log(error);
				$ionicLoading.hide();
			});
		}, 
		function (error) {
			console.log(error);
			$ionicLoading.hide();
		});
	}
})

.controller('EditUserCtrl', function($scope, $ionicModal, $stateParams, $ionicLoading, $state, User){

	$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});
	$scope.user = {};
	$scope.errorMessage = null;
	var userId = $stateParams.userId;
	
	/*
	$scope.days={};
	$scope.years = {};
	
	for(var year = 1940 ; year<=2014; year++)
		$scope.years[year] = year;

	for(var day = 1; day <= 31; day++)
		$scope.days[day] = day;
	*/

	User.getUser($stateParams.userId, function(data) {
		$scope.user = data.data;

		if($scope.user != undefined)
		{
			$scope.user.dob	= new Date($scope.user.dob);
		}
		$ionicLoading.hide();

	});

	$scope.editProfile = function(user)
	{
		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});
		//function to clac Age from DOB

		var d = $scope.user.dob;
		console.log($scope.user.dob);
		$scope.user.dobConverted = 	d.getFullYear() + "-" + d.getMonth() + "-" +  d.getDate();
		var age = calculateAge($scope.user.dob);
		if(age < 13)
			return $scope.errorMessage = 'You must be atleast 13 years old to signup';

		
		//console.log(dateOfBirth.getFullYear() +'-'+ (dateOfBirth.getMonth() + 1) + '-' + dateOfBirth.getDate());
		// alert("stop");
		//var d = new Date($scope.user.dob);
		//$scope.user.dob = 	d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
		console.log($scope.user.dob);
		User.editUser(userId,$scope.UTIL.serialize(user), function(response) {	
			if(response.done == true)
			{
				console.log(response.data);
				var user = {	
					userId : response.data.user_id,
					email : response.data.email,
					password : response.data.password,
					loggedin : true,
					userName : response.data.username,
					pointsEarned: response.data.points_earned,
					userImage: response.data.u_image,
					firstName : response.data.f_name,
					lastName : response.data.l_name,
					};
				
				window.localStorage.setItem("user", JSON.stringify(user));
				$ionicLoading.hide();
				$state.go("tab.home");
			}
		})
		
	}
	
})

.controller('MiscCtrl',function($rootScope, $scope, $ionicModal,$stateParams, $ionicLoading, $state,Misc, User){
	
	$scope.tabsTop = true;

	User.getCurrentUser(function(user) {
		$scope.user = user;
	});

	$scope.changePasswordModal = function(){
		$ionicModal.fromTemplateUrl('templates/change-password-modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});	
	};

	$scope.changeEmailModal = function(){
		$ionicModal.fromTemplateUrl('templates/change-email-modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});	
	};

	$scope.contactUsModal = function(){
		$ionicModal.fromTemplateUrl('templates/contact-us-modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});	
	};
	
	$scope.close = function() {
		$scope.modal.hide();
	};

	$scope.contactUs = function(contactType){
		$state.go('tab.contactUs',{ subject: contactType});
		$scope.modal.hide();
	};

	$scope.changeEmail= function(userData)
	{
		User.getCurrentUser(function(user) {
			$scope.user = user;
		});


		userData.userId = $scope.user.userId;
		userData.old_email = $scope.user.email; 
		
		if(userData.new_email == userData.verify_email)
		{
			$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
			});
		
			User.changeEmail($scope.UTIL.serialize(userData), function(response) {	
				if(response.done == true)
				{
					var user = {	
						userId : response.data[0].user_id,
						email : response.data[0].email,
						password : response.data[0].password,
						loggedin : true,
						firstName : response.data[0].f_name,
						lastName : response.data[0].l_name,
						pointsEarned: response.data[0].points_earned,
						userImage: response.data[0].u_image,
					};
					
					window.localStorage.removeItem("user");
					window.localStorage.setItem("user" , JSON.stringify(user));

					$ionicLoading.hide();
					$scope.successMessage = response.message;
					$scope.modal.hide();	
				}
				else
				{
					$ionicLoading.hide();
					$scope.errorMessage = response.message;	
				}
			})	
		}
		else
		{
			$scope.errorMessage = 'This emails does not match';
		}
	};

	$scope.changePassword= function(userData)
	{
		userData.userId = $scope.user.userId;
		if(userData.new_password == userData.verify_password)
		{
			$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
			});
		
			User.changePassword($scope.UTIL.serialize(userData), function(response) {	
				if(response.done == true)
				{
					$scope.successMessage = response.message;
					$ionicLoading.hide();
					$scope.modal.hide();	
				}
				else
				{
					$ionicLoading.hide();
					$scope.errorMessage = response.message;
				}
			})	
		}
		else
		{
			$scope.errorMessage = 'Your passwords does not match';
		}
	};

	$scope.logout = function()
	{
		console.log("her1");
		window.localStorage.removeItem("user");
		console.log(window.localStorage.getItem("user"));
		$state.go('user.welcome');
	}
})

.controller('ProfileCtrl',function($scope,$ionicLoading,$ionicSlideBoxDelegate, $ionicModal, $stateParams, $ionicLoading,$ionicScrollDelegate, $state, User){

	$ionicLoading.show({
	    template: '<i class="icon ion-ios7-reloading">'
	});
	$scope.connection_data = {};
	$scope.noOfConnections = 0;
	$scope.zoomWidth = 640;
	$scope.zoomHeight = 640;

	var user_id = 0;
	
	User.getCurrentUser(function(user) 
	{
		$scope.user = user;
		if($stateParams.id == null)
		{
			user_id = $scope.user.userId;
			$scope.userFlag= false;
		}
		else
		{
			user_id = $stateParams.id;
			$scope.userFlag= true;
		}

		User.getUser(user_id, function(user_data) {
			$scope.user_data = user_data.data;
			//console.log($scope.user_data);
			//if($scope.user_data.u_image == "")
			//	$scope.user_data.u_image = "images/furley_bg.png";
		});

		User.getConnections(user_id, function(user_data) {
			$scope.connection_data = user_data.data;
			//console.log($scope.connection_data);
			if($scope.connection_data != null)
			{
				//console.log($scope.connection_data[0].image_path);
				$scope.noOfConnections = $scope.connection_data.length;
			}
		});

		User.getUserImages(user_id, function(userImages){
			if(userImages.message == "success")
			{
				console.log(userImages.data);
				$scope.images = [];
				var baseUrl = 'http://snapflick.co/';
				for(var i = 0 ; i<userImages.data.length; i++)
				{
					var path = {};
					var check = userImages.data[i].path.match(/files/);
					if(check != null)
						path.url = baseUrl + userImages.data[i].path; 
					else
						path.url = userImages.data[i].path;

					path.imageId = userImages.data[i].id;
					$scope.images.push(path);
				}

				//console.log($scope.images[0].imageId);
				
				if($scope.images.length == 0)
				{
					var path = {};
					path.url = "img/placeholder.jpg";
					$scope.images.push(path);
				}

				$ionicSlideBoxDelegate.update();
			}

			$ionicLoading.hide();
		});

	});

	$scope.openProfileGallery = function(zoomImage){
		
		$ionicLoading.show({
	    	template: '<i class="icon ion-ios7-reloading">'
		});
		$ionicModal.fromTemplateUrl('templates/profile-photo-modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.zoomImage = zoomImage;
			$scope.modal = modal;
			$scope.modal.show();
		});
		
		$ionicLoading.hide();

		//$state.go("tab.viewImage");
	};

	$scope.openImage = function(imageId)
	{
		$state.go('tab.viewImage',{imageId:imageId});	
	}

	$scope.close = function()
	{
		$scope.modal.hide();
	}

	$scope.onPinch = function(e) {

		console.log("pinch");
		if(e.scale <= 3)
			$scope.transform = e.scale;
		else if(e.scale > 3)
			$scope.transform = 3;

		if(e.scale < 1)
			$scope.transform = 1;

		if($scope.transform < 3)
    		$scope.transform = $scope.transform + 1;
    	else
    		$scope.transform = 1;

		console.log($scope.transform);

		if($scope.transform == 1)
		{
			$scope.zoomWidth = 640;
			$scope.zoomHeight = 640;
		}
		else
		{
			var sizeRatio = $scope.transform / 3;
			$scope.zoomWidth = $scope.zoomWidth * sizeRatio;
			$scope.zoomHeight = $scope.zoomHeight * sizeRatio;
		}
    };

    $scope.onTap = function(e) 
    {
    	if($scope.transform < 3)
    		$scope.transform = $scope.transform + 1;
    	else
    		$scope.transform = 1;

		console.log($scope.transform);

		if($scope.transform == 1)
		{
			$scope.zoomWidth = 640;
			$scope.zoomHeight = 640;
		}
		else
		{
			$scope.zoomWidth = $scope.zoomWidth * $scope.transform;
			$scope.zoomHeight = $scope.zoomHeight * $scope.transform;
		}
    };

    $scope.maxZoom = function(e)
    {
    	
    };

	$ionicLoading.hide();
        		
})

.controller('ViewImageCtrl',function($scope, $state, $stateParams, $ionicLoading, User){
	//console.log("okey");
	User.getCurrentImage($stateParams.imageId, function(image){
		console.log(image.data);
		$scope.image = image.data;
	});

	$scope.onPinch = function(e) {

		console.log("pinch");
		if(e.scale <= 3)
			$scope.transform = e.scale;
		else if(e.scale > 3)
			$scope.transform = 3;

		if(e.scale < 1)
			$scope.transform = 1;

		if($scope.transform < 3)
    		$scope.transform = $scope.transform + 1;
    	else
    		$scope.transform = 1;

		console.log($scope.transform);

		if($scope.transform == 1)
		{
			$scope.zoomWidth = 640;
			$scope.zoomHeight = 640;
		}
		else
		{
			var sizeRatio = $scope.transform / 3;
			$scope.zoomWidth = $scope.zoomWidth * sizeRatio;
			$scope.zoomHeight = $scope.zoomHeight * sizeRatio;
		}
    };

    $scope.onTap = function(e) 
    {
    	if($scope.transform < 3)
    		$scope.transform = $scope.transform + 1;
    	else
    		$scope.transform = 1;

		console.log($scope.transform);

		if($scope.transform == 1)
		{
			$scope.zoomWidth = 640;
			$scope.zoomHeight = 640;
		}
		else
		{
			$scope.zoomWidth = $scope.zoomWidth * $scope.transform;
			$scope.zoomHeight = $scope.zoomHeight * $scope.transform;
		}

		$scope.apply();
    };
})

.controller('CategoryCtrl', function($scope, $ionicModal,$stateParams, $ionicLoading, $state, Category){
	
	Date.prototype.yyyymmdd = function() {
	   var yyyy = this.getFullYear().toString();
	   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	   var dd  = this.getDate().toString();
	   return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
	  };

	d = new Date();
	

	$scope.todayDate = d.yyyymmdd();
	//console.log($scope.todayDate);

	$scope.categoryName = $stateParams.catName;
	$ionicLoading.show({
		template: '<i class="icon ion-ios7-reloading"></i>'
		});
	Category.getAll(function(categories) {
		$scope.categories = categories.data;
	});
	$ionicLoading.hide();
	
	
	if($stateParams.catId != undefined)
	{
		Category.getMoviebyCategory($stateParams.catId, function(movies) {
			$scope.items = movies.data;
			var currentDate = new Date();
			for(var i = 0; i < $scope.items.length; i++)
			{
				for(var j = 0; j < $scope.items[i].movies.length; j++)
				{
					var releaseDate = new Date($scope.items[i].movies[j].movie_release_date);

					if (currentDate.getTime() > releaseDate.getTime()) 
					  	$scope.items[i].movies[j].current_status = 1;
		      		else
		      			$scope.items[i].moives[j].current_status = 0;
				}
	      	}

			$ionicLoading.hide();
		});
	}	
})

.controller('SubCategoryCtrl',function($scope,$state,$stateParams,$ionicLoading,Category){

	$ionicLoading.show({
		template: '<i class="icon ion-ios7-reloading"></i>'
	});	
	Category.getSubCategories($stateParams.catId, function(response){
		if(response.done == true)
			$scope.categories = response.data;
		console.log($scope.categories);
		
	});
	$ionicLoading.hide();
})

.controller('SearchCtrl',function($scope, $ionicModal,$stateParams, $ionicLoading, $state, Movie, User){
	
	$ionicLoading.show({
		template: '<i class="icon ion-ios7-reloading"></i>'
	});	

	Movie.searchMovie("",function(movies) {
		$scope.items = movies.data;
		$ionicLoading.hide();
	});

	var doSearch = ionic.debounce(function(query) {
		Movie.searchMovie(query,function(movies) {
			$scope.items = movies.data;
			$ionicLoading.hide();
		});
	}, 500);

	$scope.search = function() {
		doSearch($scope.query);
	}
})

.controller('FacebookAlbumCtrl',function($scope, $ionicLoading, $cordovaFacebook, $stateParams, $ionicLoading, User){

	$ionicLoading.show();

	$cordovaFacebook.login(["public_profile", "email", "user_friends", "user_birthday", "user_location", "user_photos"]).then(function(response) {

		$cordovaFacebook.api("me/albums", ["user_photos"]).then(function(success) {
			$scope.facebookAlbums = success.data;
			console.log($scope.facebookAlbums);
			$ionicLoading.hide();
		},
		function(error){
			console.log(error);
		});

	});

	$scope.tabType = $stateParams.tabType;
	
	/*User.getCurrentUser(function(user){
		if(user.facebookLogin == true)
		{
			$cordovaFacebook.api("me/albums", ["user_photos"]).then(function(success) {
				$scope.facebookAlbums = success.data;
				$ionicLoading.hide();
			},
			function(error){
				console.log(error);
			});
		}
		else
		{
			$cordovaFacebook.login(["public_profile", "email", "user_friends", "user_birthday", "user_location", "user_photos"]).then(function(response) {

				$cordovaFacebook.api("me/albums", ["user_photos"]).then(function(success) {
					$scope.facebookAlbums = success.data;
					console.log($scope.facebookAlbums);
					$ionicLoading.hide();
				},
				function(error){
					console.log(error);
				});

			});
		}
	});*/
})

.controller('FacebookPhotoCtrl',function($scope, $ionicLoading, $cordovaFacebook, $stateParams, $ionicLoading,$state, User, $jrCrop, ImageCrop){

	$ionicLoading.show({
		template: '<i class="icon ion-ios7-reloading"></i>'
	});

	User.getCurrentUser(function(user) {
		$scope.user = user;
	});

	$cordovaFacebook.api("/"+ $stateParams.albumId +"/photos", ["user_photos"]).then(function(success) {
		if(success.data.length != 0)
		{
			$scope.facebookPhotos = success.data;
		}
		else
		{
			$ionicLoading.hide();
			return	$scope.errorMessage = 'You have no photos to upload from this album" when a user clicks on an FB photo album that has no pictures';	
		}
			
		$ionicLoading.hide();
	});

	$scope.addPicture = function(imagePath)
	{
		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});

		var data = {};
		data.image = imagePath;
		data.imageType = 2;
		data.userId = $scope.user.userId;

		User.addUserImage($scope.UTIL.serialize(data), function(response) {	
			if(response.done == true)
			{
				$ionicLoading.hide();
				alert(response.message);
				$scope.imageId = response.data;
				$state.go('tab.transformPhoto',{imageId : $scope.imageId});
				
				// ImageCrop.getCurrentImage(response.data, function(userImage) {
				// 	$scope.userImage = userImage.data;
					
					/*if($scope.userImage.type == 1)
						var baseUrl = "http://snapflick.co/";
					else*/
						
					//var baseUrl = "http://snapflick.co/";
					
				// 	$scope.imageSrc = baseUrl + $scope.userImage.path;
				//     $scope.crop($scope.imageSrc);

				//     $ionicLoading.hide();
				// });
				//$state.go("tab.profileEditPhoto", { imageId:response.data });
			}
			else
			{
				$ionicLoading.hide();
				alert(response.message);
			}
		})	
	};

	$scope.crop = function(image) {
        $jrCrop.crop({
        	url: image,
        	width: 200,
        	height: 200,
        	title: 'Move to Crop'
        }).then(function(result) {
        	console.log(result);

        	$scope.cords = {};
        	$scope.cords.x = result.sourceX;
        	$scope.cords.y = result.sourceY;
        	$scope.cords.w = result.canvasWidth;
        	$scope.cords.h = result.canvasHeight;
        	$scope.cords.id = $scope.imageId;

        	console.log($scope.cords);
        	ImageCrop.cropImage($scope.UTIL.serialize($scope.cords), function(response){
				$ionicLoading.hide();
				$state.go('tab.transformPhoto',{imageId: $scope.imageId});
			});
        });
    };
})

.controller('ProfilePhotoCtrl',function($scope,$ionicLoading,$ionicSlideBoxDelegate, $ionicModal, $cordovaFacebook, $ionicActionSheet, $stateParams, $ionicLoading, $state, User, $jrCrop, $ionicHistory, ImageCrop){
	
	$ionicLoading.show({
	    template: '<i class="icon ion-ios7-reloading">'
	});
	
	if($stateParams.done == true)
		$state.go('tab.profile');
	
	if($stateParams.deleteHistory)
	{
		$ionicHistory.clearHistory();
	}

	$scope.getUserImages = function(user_id) {
		$ionicLoading.show();
		User.getUserImages(user_id, function(userImages)
		{
			console.log(userImages);
			if(userImages.message == "success")
			{
				$scope.noOfImages = userImages.data.length;
				
				$scope.images = [];
				var baseUrl = 'http://snapflick.co/';
				for(var i = 0 ; i<userImages.data.length; i++)
				{
					var path = {};
					var check = userImages.data[i].path.match(/files/);
					if(check != null)
						path.url = baseUrl + userImages.data[i].path; 
					else
						path.url = userImages.data[i].path;

					path.imageId = userImages.data[i].id;
					$scope.images.push(path);
				}
			}

			$ionicLoading.hide();
		});
	};

	$scope.getUserImages($scope.userId );
	

	$scope.zoomImageModal = function(imageId)
	{
		$ionicModal.fromTemplateUrl('templates/modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
			var baseUrl = "http://snapflick.co/";
			if(imageId > 0)
			{
				$scope.imageId = imageId;
				User.getCurrentImage(imageId, function(response){
					if(response.done == true)
					{
						console.log(response);
						$scope.path = baseUrl + response.data.path;
					}
				});
			}
		});	
	};
	
	$scope.close = function() {
		$scope.modal.hide();
	};

	
	var user_id = 0;
	User.getCurrentUser(function(user) 
	{
		$scope.user = user;
		if($stateParams.id == null)
			user_id = $scope.user.userId;
		else
			user_id = $stateParams.id;
		$ionicSlideBoxDelegate.update();
	});
	
	$scope.deleteImage = function(userImageId)
	{
		$ionicLoading.show();
		var image = [];
		image["image_id"] = $scope.imageId;
		image["user_id"] = $scope.userId;
		
		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});
		
		User.deleteUserImages($scope.UTIL.serialize(image),function(response) {
			if(response.done == true)
			{
				$scope.getUserImages(user_id);
				$scope.modal.hide();
				$ionicLoading.hide();
			}
		});
	};

	$scope.showActionsheet = function()
	{
		$ionicActionSheet.show({
			titleText: 'Change Profile Picture',
			buttons: 
			[
				{ text: 'Take a Picture' },
				{ text: 'Upload from Library' },
				{ text: 'Upload from Facebook' }
			],
			cancelText: 'Cancel',
			cancel: function() {
				console.log('CANCELLED');
			},
			buttonClicked: function(index) 
			{
				if(index == 0)
				{
					navigator.camera.getPicture(gotPic, failHandler, {
						quality:50, 
						destinationType:navigator.camera.DestinationType.DATA_URL,
						sourceType:navigator.camera.PictureSourceType.CAMERA
					});
				}
				else if(index == 1)
				{
					navigator.camera.getPicture(gotPic, failHandler, {
						quality:50, 
						destinationType:navigator.camera.DestinationType.DATA_URL,
						sourceType:navigator.camera.PictureSourceType.PHOTOLIBRARY
					});
				}
				else if(index == 2)
				{
					if($stateParams.tabType == "profile")
    					$state.go("tab.profileFacebookAlbum", {tabType : "profile"});
    				else
    					$state.go("tab.facebookAlbum", {tabType : "misc"});
				}
			}
		});
	}

	function gotPic(imageData) 
	{
		console.log("casper: in got pic");

		var data = {};
		data.image = 'data:image/jpeg;base64,' + imageData;
		data.imageType = 1;
		data.userId = user_id;

		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});

		User.addUserImage($scope.UTIL.serialize(data), function(response){
			if(response.done == true)
			{
				alert("Image uploaded successfully");
				
				$scope.imageId = response.data;
				$state.go('tab.transformPhoto',{imageId : $scope.imageId});
			}
			
			$scope.getUserImages(user_id);
			$ionicLoading.hide();
		});
	}

	$scope.crop = function(image) {
        $jrCrop.crop({
        	url: image,
        	width: 200,
        	height: 200,
        	title: 'Move to Crop'
        }).then(function(result) {
        	console.log(result);

        	$scope.cords = {};
        	$scope.cords.x = result.sourceX;
        	$scope.cords.y = result.sourceY;
        	$scope.cords.w = result.canvasWidth;
        	$scope.cords.h = result.canvasHeight;
        	$scope.cords.id = $scope.imageId;

        	console.log($scope.cords);
        	ImageCrop.cropImage($scope.UTIL.serialize($scope.cords), function(response){
				$ionicLoading.hide();
				$state.go('tab.transformPhoto',{imageId: $scope.imageId});
			});
        });
    };

	function failHandler(e)
	{
		alert(e);
	}

	$scope.setMainImage = function()
	{
		User.setMainImage($scope.imageId, user_id, function(response){
			alert(response.message);
			$scope.modal.hide();
			$scope.getUserImages(user_id);
		});
	}

	$scope.editImage = function()
	{
		$scope.modal.hide();
		$state.go("tab.profileEditPhoto", { imageId: $scope.imageId });
	}

	$ionicLoading.hide();
        
})

.controller('TransformPhotoCtrl', function($scope,$ionicLoading,$state,$stateParams,$jrCrop,User,ImageCrop){
	
	$ionicLoading.show({
	    template: '<i class="icon ion-ios7-reloading">'
	});

	$scope.angle = 0;
	$scope.imageId = $stateParams.imageId;
	ImageCrop.getCurrentImage($scope.imageId, function(userImage) {
		$scope.imagePath = "http://snapflick.co/" + userImage.data.path;
		$ionicLoading.hide();
	});

	$scope.rotateLeft = function()
	{
		if($scope.angle!=360)
		{
			$scope.angle -= 90;
			$scope.transform = "rotateZ(" + $scope.angle + "deg)";
		}
	};

	$scope.rotateRight = function()
	{
		if($scope.angle != 360)
		{
			$scope.angle += 90;
			//console.log($scope.angle);
			$scope.transform = "rotateZ(" + $scope.angle + "deg)";	
		}
		//else
		//{
		//	$scope.angle = 0;
		//}

		//console.log($scope.transform);
	};

	$scope.doneRotating = function()
	{
		ImageCrop.saveRotatedImage($scope.imageId, $scope.angle, function(image){
			if(image.done == true)
			{
				ImageCrop.getCurrentImage(image.data.id, function(userImage) {
					$scope.userImage = userImage.data;
					var baseUrl = "http://snapflick.co/";
					
					$scope.imageSrc = baseUrl + $scope.userImage.path;
				    $scope.crop($scope.imageSrc);

				    $ionicLoading.hide();
				});
			}
		});
	};

	$scope.crop = function(image){
        $jrCrop.crop({
        	url: image,
        	width: 200,
        	height: 200,
        	title: 'Move to Crop'
        }).then(function(result) {
        	console.log(result);

        	$scope.cords = {};
        	$scope.cords.x = result.sourceX;
        	$scope.cords.y = result.sourceY;
        	$scope.cords.w = result.canvasWidth;
        	$scope.cords.h = result.canvasHeight;
        	$scope.cords.id = $scope.imageId;

        	console.log($scope.cords);
        	ImageCrop.cropImage($scope.UTIL.serialize($scope.cords), function(response){
				$ionicLoading.hide();
				//$state.go('tab.transformPhoto',{imageId: $scope.imageId});
				$state.go('tab.profilePhotoProfileDone',{done: true });
			});
        });
    };

	$ionicLoading.hide();
})

.controller('EditPhotoCtrl',function($scope, $window, $ionicHistory, $ionicNavBarDelegate, $timeout, $ionicModal, $stateParams, $ionicLoading, $state, User, ImageCrop, returnToState, $jrCrop){
	
	$scope.angle = 360;
	$scope.rotate = function(r) 
	{
        $scope.angle = r;
        console.log($scope.angle);
	}

	var imageId = $stateParams.imageId;
	var scope = this;

	$ionicLoading.show();

	ImageCrop.getCurrentImage(imageId, function(userImage) {
		$scope.userImage = userImage.data;
		
		var baseUrl = "http://snapflick.co/";
		
		$scope.imageSrc = baseUrl + $scope.userImage.path;
		$scope.imageId = $stateParams.imageId;
		
	    $scope.crop($scope.imageSrc);

	    $ionicLoading.hide();
	});
	
	$scope.cropImage = function(){

		$ionicLoading.show();
		if($scope.cords != undefined)
			$scope.cords.id = $scope.imageId;
		else
		{
			$scope.cords = {};
			$scope.cords.id = $scope.imageId;
		}

		ImageCrop.cropImage($scope.UTIL.serialize($scope.cords), function(response){
			$ionicLoading.hide();
			$state.go('tab.transformPhoto',{imageId: $scope.imageId});
		});
	}

	$scope.crop = function(image) {
        $jrCrop.crop({
        	url: image,
        	width: 480,
        	height: 480
        }).then(function(result) {
        	document.querySelector('.cropped-canvas').appendChild(result.canvas);
        	console.log(result);

        	$scope.cords = {};
        	$scope.cords.x = result.sourceX;
        	$scope.cords.y = result.sourceY;
        	$scope.cords.w = result.canvasWidth;
        	$scope.cords.h = result.canvasHeight;
        	$scope.cords.id = $scope.imageId;

        	console.log($scope.cords);
        	ImageCrop.cropImage($scope.UTIL.serialize($scope.cords), function(response){
				$ionicLoading.hide();
				$state.go('tab.transformPhoto',{imageId: $scope.imageId});
			});
        });
    };

	$scope.getDegree = function(degree) {
        $scope.degree = degree;
        console.log($scope.degree);
    };

	$scope.goBack = function(){
		$ionicHistory.goBack();
	}
})

.controller('TopEarnersCtrl',function($scope, $ionicModal,$stateParams, $ionicLoading,  $ionicActionSheet,$state, User,Product){

	$scope.topEarners = {};
	$ionicLoading.show({
		template: '<i class="icon ion-ios7-reloading"></i>'
	});
			
	$scope.getTopEarners = function()
	{
		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});
		User.getTopEarners(function(topEarners) {
			$scope.topEarners = topEarners.data;
			console.log(topEarners);
		});
		$ionicLoading.hide();
	};

	User.getCurrentUser(function(user) {
		$scope.getTopEarners();
		$scope.user = user;
	});

	$scope.showActionsheet = function() {
		$ionicActionSheet.show({
			titleText: 'Share Movie with Friends',
			buttons: [
			{ text: '<i class="icon ion-social-facebook-outline"></i> Friends on Facebook' },
			{ text: '<i class="icon ion-social-twitter-outline"></i> Friends on Twitter' },
			{ text: '<i class="icon ion-ios7-email-outline"></i> Friends via SMS' },
			{ text: '<i class="icon ion-ios7-email-outline"></i> Friends via WhatsApp' },
			{ text: '<i class="icon ion-ios7-email-outline"></i> Friends via Email' },
			],
			cancelText: 'Cancel',
			cancel: function() {
				console.log('CANCELLED');
			},
			buttonClicked: function(index) 
			{
				var sharelink = "http://snapflick.co/" + "index.php/user/register_user/0/" + $scope.userId;
				var title = "Check out Snap Flix! Its awesome!";

				if(index == 0)
					window.plugins.socialsharing.shareViaFacebook(title, null, sharelink, function() {}, function(errormsg){alert('error:' + errormsg)});
				else if(index == 1)
					window.plugins.socialsharing.shareViaTwitter(title, null, sharelink);
				else if(index == 2)
					window.plugins.socialsharing.shareViaSMS(title + "You can check it here:" + sharelink, null, function(msg) {}, function(msg) {alert('error: ' + msg)});
				else if(index == 3)
					window.plugins.socialsharing.shareViaWhatsApp(title + "You can check it here:" + sharelink, null, sharelink, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
				else if(index == 4)
					window.plugins.socialsharing.shareViaEmail('Message', 'Subject', null, null, null, null, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});

				return true;
			}
		});
	};
	$ionicLoading.hide();
	
})

.controller('ProductCtrl', function($scope, $sce,$ionicLoading, $ionicModal, $state, $stateParams, $ionicActionSheet, $ionicSlideBoxDelegate,Reminder, User, Product) {

	
	$scope.movieName = $stateParams.movieName;
	
	$ionicLoading.show({
		template: '<i class="icon ion-ios7-reloading"></i>'
	});


	$scope.transform = 1;
	$scope.zoomWidth = 640;
	$scope.zoomHeight = 640;
	$scope.showDefault = false;

	User.getCurrentUser(function(user) {
		$scope.user = user;
		Product.getMovieDetail($stateParams.movieId, $scope.user.userId, function(movieDetail) {
			if(movieDetail.done == true)
			{
				var releaseDate = new Date(movieDetail.data.details.movie_release_date);
				//console.log(releaseDate);
				var split = releaseDate.toString().split(' ');
				$scope.release_date = split[1] +" "+ split[2] +", "+split[3];
				$scope.movieDetail = movieDetail.data.details;
				$scope.images = movieDetail.data.images;
				
				if($scope.images.length == 0)
					$scope.showDefault = true;

				$scope.videos = movieDetail.data.videos;
				//console.log($scope.videos[0].video_file);
				$scope.category = movieDetail.data.details.category;
				$scope.favourite = movieDetail.data.favourite;
				$scope.embedCodes = movieDetail.data.embedCodes;
				var noOfDirectors  = ($scope.movieDetail.movie_director.match(/,/g) || []).length + 1;
				var noOfWritters  = ($scope.movieDetail.movie_writter.match(/,/g) || []).length + 1;
				if(noOfDirectors > 1)
					$scope.director ='Directors';
				else
					$scope.director ='Director';
				if(noOfWritters > 1)
					$scope.writter = 'Writters';
				else
					$scope.writter = 'Writter';

				//console.log(noOfWritters);
				//console.log(($scope.movieDetail.movie_director.match(/,/g) || []).length); //logs 3
				$ionicSlideBoxDelegate.update();
				$ionicLoading.hide();
			}
		});
	});

	$scope.playVideo = function(videoUrl)
	{

		YoutubeVideoPlayer.openVideo(videoUrl);
		return;
		
		var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
		var match = videoUrl.match(regExp);
		if (match && match[2].length == 11) 
		{
			console.log(match[2]);
			YoutubeVideoPlayer.openVideo(match[2]);
		}
	}

	$scope.openVideo = function(code)
	{
		$ionicModal.fromTemplateUrl('templates/open-video.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.videoUrl = $sce.trustAsResourceUrl('http://www.youtube.com/embed/'+ code +'?rel=0&controls=0&showinfo=0');
			$scope.modal = modal;
			$scope.modal.show();
		});	
	}

	$scope.openGallery = function(zoomImage){
		$ionicModal.fromTemplateUrl('templates/photo-gallery-modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.zoomImage = zoomImage;
			$scope.modal = modal;
			$scope.modal.show();
		});	
	};

	$scope.close = function()
	{
		$scope.modal.hide();
	}
	
	$scope.addToFavourite = function()
	{
		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});
		var product = {};
		product.product_id = $scope.movieDetail.movie_id;
		product.user_id = $scope.user.userId;
		product.movie_cat_id = $scope.movieDetail.movie_cat_id;
		
		Product.saveUserProduct($scope.UTIL.serialize(product), function(response) {
			$scope.favourite = true;
			$ionicLoading.hide();
			navigator.notification.alert(
			    $scope.movieName + ' is now saved in your favourite movies.',
			    null,
			    'Saved!',
			    'Done'
			);
		});

		var reminder = {};
		reminder.movie_id = $scope.movieDetail.movie_id;
		reminder.user_id = $scope.user.userId;
		Reminder.addReminder($scope.UTIL.serialize(reminder), function(response) {
			//console.log(response);
		});

		
	}

	$scope.removeToFavourite = function()
	{
		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});
		var product = {};
		product.movie_id = $scope.movieDetail.movie_id;
		product.user_id = $scope.user.userId;
		Product.deleteUserProduct($scope.UTIL.serialize(product), function(response) {
			
			$ionicLoading.hide();

			if(response.done == true)
			{
				$scope.favourite = false;
			
				navigator.notification.alert(
			    'Movie is now deleted in your favourite movies.',
			    null,
			    'Saved!',
			    'Done'
				);
			}
		});

		var reminder = {};
		reminder.user_id = $scope.user.userId;
		reminder.movie_id = $scope.movieDetail.movie_id;
		Reminder.deleteReminder($scope.UTIL.serialize(reminder), function(response) {
			console.log(response);
		});
	}

	$scope.showActionsheet = function() {
		$ionicActionSheet.show({
			titleText: 'Share Movie with Friends',
			buttons: [
			{ text: '<i class="icon ion-social-facebook-outline"></i> Share on Facebook' },
			{ text: '<i class="icon ion-social-twitter-outline"></i> Share on Twitter' },
			{ text: '<i class="icon ion-ios7-email-outline"></i> Share via SMS' },
			{ text: '<i class="icon ion-ios7-email-outline"></i> Share via WhatsApp' },
			{ text: '<i class="icon ion-ios7-email-outline"></i> Share via Email' },
			],
			cancelText: 'Cancel',
			cancel: function() {
				console.log('CANCELLED');
			},
			buttonClicked: function(index) 
			{
				var sharelink = "http://snapflick.co/" + "index.php/user/register_user/" + $scope.movieDetail.movie_id + "/" + $scope.user.userId;
				var image = "http://snapflick.co/files/" + $scope.movieDetail.movie_main_img;
				
				var message = $scope.movieDetail.movie_name + " is coming out soon. Use Snapflix to watch the trailer and get reminded when it's out in theatres! " + sharelink;
				
				if(index == 0)
					window.plugins.socialsharing.shareViaFacebook(message, null, sharelink, function() {}, function(errormsg){alert(errormsg)});
				else if(index == 1)
					window.plugins.socialsharing.shareViaTwitter(message, null, sharelink);
				else if(index == 2)
					window.plugins.socialsharing.shareViaSMS(message, null, function(msg) {}, function(msg) {alert('error: ' + msg)});
				else if(index == 3)
					window.plugins.socialsharing.shareViaWhatsApp(message, null, sharelink, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
				else if(index == 4)
					window.plugins.socialsharing.shareViaEmail(message, $scope.movieDetail.movie_name, null, null, null, null, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});

				return true;
			}
		});
	}

	$scope.gotoIMDB = function()
	{
		window.open($scope.movieDetail.imdb_link, '_system');
	}

	$scope.onPinch = function(e) {

		if(e.scale <= 3)
			$scope.transform = e.scale;
		else if(e.scale > 3)
			$scope.transform = 3;

		if(e.scale < 1)
			$scope.transform = 1;

		console.log($scope.transform);

		if($scope.transform == 1)
		{
			$scope.zoomWidth = 640;
			$scope.zoomHeight = 640;
		}
		else
		{
			var sizeRatio = $scope.transform / 3;
			$scope.zoomWidth = $scope.zoomWidth * sizeRatio;
			$scope.zoomHeight = $scope.zoomHeight * sizeRatio;
		}
    };

    $scope.onTap = function(e) {

    	if($scope.transform < 3)
    		$scope.transform = $scope.transform + 1;
    	else
    		$scope.transform = 1;

		console.log($scope.transform);

		if($scope.transform == 1)
		{
			$scope.zoomWidth = 640;
			$scope.zoomHeight = 640;
		}
		else
		{
			$scope.zoomWidth = $scope.zoomWidth * $scope.transform;
			$scope.zoomHeight = $scope.zoomHeight * $scope.transform;
		}
    };

})

.controller('ContactCtrl',function($scope, $ionicModal,$stateParams, $ionicLoading, $state, User, Misc){

	$ionicLoading.show({
		template: '<i class="icon ion-ios7-reloading"></i>'
	});

	User.getCurrentUser(function(user) {
		$scope.user = user;
	});
	
	$scope.contact = {};
	$scope.contact.subject = $stateParams.subject;
	$scope.contact.from = $scope.user.email;
	
	$scope.contactUs = function(contact){
		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});
		Misc.sendMessage($scope.UTIL.serialize(contact), function(response) {
			if(response.done == true)
			{
				$ionicLoading.hide();
				alert(response.message);
			}
		});
	}
	$ionicLoading.hide();	
})

.controller('FavouriteCtrl',function($scope, $ionicModal,$stateParams, $ionicLoading, $state, $ionicActionSheet , Movie, User){
	$scope.showList = true;
		
	$scope.getSavedMovies = function(){	
		
		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});

		Movie.getSavedMovies($scope.user.userId,function(movies){
			$scope.items = movies.data.list_data;
			if($scope.items.length == 0)
			{
				$scope.showMessage = true;
				$scope.message = "You don't have any movies saved just yet.... Browse the network and save any movie you like to be reminded when it comes out in theatres!";
			}

			var currentDate = new Date();
			for(var i = 0; i < $scope.items.length; i++)
			{
				for(var j = 0; j < $scope.items[i].movies.length; j++)
				{
					var releaseDate = new Date($scope.items[i].movies[j].movie_release_date);

					if (currentDate.getTime() > releaseDate.getTime()) 
					  	$scope.items[i].movies[j].current_status = 1;
		       		//else
		       		//	$scope.items[i].moives[j].current_status = 0;
				}
	      	}
	      	
			// $scope.movies = movies.data.list_data;
			// $scope.movieCount = $scope.movies.length;
			// if($scope.movieCount == 0)
			// 	$scope.message ="You don't have any movies saved just yet.... Browse the network and save any movie you like to 	be reminded when it comes out in theatres!";
			
			$scope.calender = movies.data.calendar_data;
			// if($scope.movieCount == 1)
			// {
			// 	//$state.go('tab.saveMovieDetail',{movieId :$scope.movies[0].movie_id});
			// }
			$ionicLoading.hide();
		});
	}

	User.getCurrentUser(function(user) {
		$scope.user = user;
		$scope.getSavedMovies();
	});

	$scope.showCalList = function()
	{
		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});

		$scope.showList = true;
		
		setTimeout(function() {
			$ionicLoading.hide();
		}, 1500);
	}

	$scope.showCalender = function()
	{
		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});

		$scope.showList = false;

		setTimeout(function() {
			$ionicLoading.hide();
		}, 1500);
	}

	$scope.deleteMovie = function(um_id)
	{
		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});

		var postData =[];
		postData['userId'] = $scope.user.userId;
		postData['um_id'] = um_id;
		Movie.deleteSavedMovies($scope.UTIL.serialize(postData), function(response) {
			if(response.done == true)
			{
				$ionicLoading.hide();
				$scope.getSavedMovies();
				$ionicLoading.hide();
			}
		});

	};
	
})

.controller('InviteFriendCtrl', function($scope,$ionicActionSheet, $ionicModal, $stateParams, $ionicLoading, $state, Movie, User){
	$scope.connection_data = {};
	$scope.noOfConnections = 0;

	$ionicLoading.show({
		template: '<i class="icon ion-ios7-reloading"></i>'
	});

	User.getCurrentUser(function(user) {
		$scope.user = user;
	});

	User.getConnections($scope.user.userId, function(connections_data) {
		if(connections_data.done == true)
		{
			$scope.connections = connections_data.data;
			$scope.noOfConnections = $scope.connections.length;			
			//console.log($scope.connections);
		}
	});

	$scope.showActionsheet = function() {
		$ionicActionSheet.show({
			titleText: 'Invite Friends and Earn $$$',
			buttons: [
			{ text: '<i class="icon ion-social-facebook-outline"></i> Friends on Facebook' },
			{ text: '<i class="icon ion-social-twitter-outline"></i> Friends on Twitter' },
			{ text: '<i class="icon ion-ios7-email-outline"></i> Friends via SMS' },
			{ text: '<i class="icon ion-ios7-email-outline"></i> Friends via WhatsApp' },
			{ text: '<i class="icon ion-ios7-email-outline"></i> Friends via Email' },
			],
			cancelText: 'Cancel',
			cancel: function() {
				console.log('CANCELLED');
			},
			buttonClicked: function(index) 
			{
				var sharelink = "http://snapflick.co/" + "index.php/user/register_user/0/" + $scope.user.userId;
				var title = "Use SnapFlix to save your favorite movie trailers.. never forget about a movie again!";

				console.log(sharelink);

				if(index == 0)
					window.plugins.socialsharing.shareViaFacebook(title, null, sharelink, function() {}, function(errormsg){alert('error:' + errormsg)});
				else if(index == 1)
					window.plugins.socialsharing.shareViaTwitter(title, null, sharelink);
				else if(index == 2)
					window.plugins.socialsharing.shareViaSMS(title + "You can check it here:" + sharelink, null, function(msg) {}, function(msg) {alert('error: ' + msg)});
				else if(index == 3)
					window.plugins.socialsharing.shareViaWhatsApp(title + " You can check it here:" + sharelink, null, sharelink, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
				else if(index == 4)
					window.plugins.socialsharing.shareViaEmail(title + " You can check it here:" + sharelink, 'SnapFlix', null, null, null, null, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});

				return true;
			}
		});
	};
	$ionicLoading.hide();


})

.controller('ReminderCtrl', function($scope,$ionicLoading,$state,$stateParams,$ionicModal,User,Movie,Reminder){
	$scope.connection_data = {};
	$scope.noOfConnections = 0;

	$ionicLoading.show({
		template: '<i class="icon ion-ios7-reloading"></i>'
	});

	Movie.getMovieDetail($stateParams.movieId,function(movie){
		$scope.movie = movie.data.details;
		
		//console.log($scope.movie.movie_id);
		var Today 	= new Date();
		$scope.daysLeft = DayDiff(Today);
		if($scope.daysLeft == 0)
			$scope.daysLeftNow = true;
		else if($scope.daysLeft > 0)
			$scope.movieRelease = true;
		// else if($scope.daysLeft < 0)
		// {
		// 	$scope.dayAgo = Math.abs($scope.daysLeft);	
		// 	$scope.daysAgo = true;
		// 	$scope.daysLeftNow = false;
		// 	$scope.movieRelease = false;
		// 	console.log($scope.daysLeft);
		// }
		
	});

	User.getCurrentUser(function(user) {
		$scope.user = user;
	});
	
	function DayDiff(CurrentDate)
	{
		var TYear=CurrentDate.getFullYear();
	        var TDay=new Date($scope.movie.movie_release_date);
	        TDay.getFullYear(TYear);
	        var DayCount=(TDay-CurrentDate)/(1000*60*60*24);
	        DayCount=Math.round(DayCount); 
	    return(DayCount);
	}

	$scope.remindMeAgain = function(type)
	{
		Reminder.remindMe($scope.user.userId,$scope.movie.movie_id,type,function(response){
			console.log(response);
		});
	}
	
	$ionicLoading.hide();
})

.controller('FavouriteDateCtrl',function($scope, $ionicModal, $stateParams, $ionicLoading, $state, Movie, User){
	
	$scope.showList = true;
	$scope.movies = {};
	$scope.categoryName = $stateParams.releaseDate;
	
	$ionicLoading.show({
		template: '<i class="icon ion-ios7-reloading"></i>'
	});
	$scope.deleteMovie = function(um_id)
	{
		$ionicLoading.show({
			template: '<i class="icon ion-ios7-reloading"></i>'
		});

		var postData =[];
		postData['userId'] = $scope.user.userId;
		postData['um_id'] = um_id;
		Movie.deleteSavedMovies($scope.UTIL.serialize(postData), function(response) {
			if(response.done == true)
			{
				Movie.getDateMovies($scope.user.userId, $stateParams.releaseDate, function(movies){
					$scope.movies = movies.data;
				});
				$ionicLoading.hide();
			}
		});

	};

	User.getCurrentUser(function(user) {
		$scope.user = user;	
		Movie.getDateMovies($scope.user.userId, $stateParams.releaseDate, function(movies){
			$scope.movies = movies.data;
			//console.log($scope.user.userId);
			if($scope.movies.length == 1)
				$state.go('tab.saveMovieDetail',{movieId :$scope.movies[0].movie_id});

			// else if($scope.movies.length > 1)
			// 	$state.go('tab.save');

		});
	});

	$ionicLoading.hide();
});