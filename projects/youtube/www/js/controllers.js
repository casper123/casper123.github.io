angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

	//Regin API
	$http.get('https://www.googleapis.com/youtube/v3/i18nRegions?part=snippet&key=AIzaSyBLZzOnpbqkcg3qkNm9HNl5AZBNDhYbhmc').success(function(data, status, headers, config)
	{
		$scope.regions = data.items;
		//$state.go('app.playlists');
	}).error(function(error, status, headers, config) {
		console.log(status);
		console.log("Error occured");
	});
	  
  // Form data for the login modal
  $scope.loginData = {};

})

.controller('searchVideoCtrl', function($scope, $ionicModal, $http, $rootScope, $state,$stateParams) {
	
	$scope.searchKeyword = {};
	$scope.showList = false;
	$scope.regionName = "Worldwide";

	$scope.code = null;
	$scope.videoTitle = null;

	$ionicModal.fromTemplateUrl('templates/play.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });

	
	//Get video by Region API
	$scope.videos = [];
	//$scope.nextPageToken ='';
	if($stateParams.regionId == undefined)
		$scope.regionId = 'US';
	else
	{
		$scope.regionName = $stateParams.regionName;
		$scope.regionId = $stateParams.regionId;
	}

	$scope.nextPageToken = "";

	var fillVideos =  function(data)
	{
  		for(var j=0;j<data.items.length;j++)
	  	{
	  		$scope.videos.push(data.items[j]);
		}
		console.log($scope.videos);
  	};

	$scope.loadMore = function() {
		if($scope.nextPageToken == '')
			$scope.tokenParam = '';
		else
			$scope.tokenParam = '&pageToken='+$scope.nextPageToken;
		
		$http.get('https://www.googleapis.com/youtube/v3/videos?chart=mostPopular&key=AIzaSyAwsxG8fj-uWHs_-azyUcLAusn1g4TwRR0&part=statistics,snippet&regionCode='+$scope.regionId+'&maxResults=5'+$scope.tokenParam+'').success(function(data, status, headers, config) {
	    	//$scope.videos = data.items;
	    	console.log(data);
	    	fillVideos(data);
	    	$scope.nextPageToken = data.nextPageToken;		
	    	$scope.$broadcast('scroll.infiniteScrollComplete');
	    	
	    }).error(function(error, status, headers, config) {
			console.log(status);
			console.log("Error occured");
			$scope.noMoreItemsAvailable = true;
		});

		console.log('i');
    };

	$scope.doRefresh = function() 
  	{
  		$scope.loadMore();
  	}

  	$scope.playVideo = function(videoID){
  		VideoPlayer.play("https://www.youtube.com/watch?v="+videoID);
  	}
})

.controller('PlaylistsCtrl', function($scope, $rootScope) {
	
	$scope.listDetails = $rootScope.videoListData.items;
	console.log($scope.listDetails);
})

.controller('videoCtrl', function($scope, $stateParams, $http){
	
	
	$http.get('https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&part=contentDetails&id='+$stateParams.songId+'&key=AIzaSyBLZzOnpbqkcg3qkNm9HNl5AZBNDhYbhmc').success(function(data, status, headers, config)
		{
			$scope.videoDetails = data.items[0];
			console.log(data);
		}).error(function(error, status, headers, config) {
			console.log(status);
			console.log("Error occured");
		});
	
});
