apb.controller('CourseListCtrl', function($scope, $rootScope, $state, CourseService) {

	$scope.listData = {};
	$scope.daysofWeek = [];
	$scope.daysofWeek[0] = "monday";
	$scope.daysofWeek[1] = "tuesday";
	$scope.daysofWeek[2] = "wednesday";
	$scope.daysofWeek[3] = "thursday";
	$scope.daysofWeek[4] = "friday";
	$scope.daysofWeek[5] = "saturday";
	$scope.daysofWeek[6] = "sunday";

	$scope.courseList = function(){
    CourseService.getAll(function(response) {
    	$scope.listData = response;
    	$scope.$broadcast('scroll.refreshComplete');
    });
	}

	$scope.courseList();
});

apb.controller('CourseDetailCtrl', function($scope, $rootScope, $state, $stateParams, CourseService) {
  
  $scope.listData = {};
  $scope.daysofWeek = [];
  $scope.daysofWeek[0] = "monday";
  $scope.daysofWeek[1] = "tuesday";
  $scope.daysofWeek[2] = "wednesday";
  $scope.daysofWeek[3] = "thursday";
  $scope.daysofWeek[4] = "friday";
  $scope.daysofWeek[5] = "saturday";
  $scope.daysofWeek[6] = "sunday";

  $scope.course = {};

  CourseService.getCourse($stateParams.courseId, function(response) {
    console.log(response);
    $scope.course = response;
  });

});

apb.controller('CourseSaveCtrl', function($scope, $rootScope, $state, $stateParams, CourseService) {
  
  $scope.daysofWeek = [];
  $scope.daysofWeek[0] = "monday";
  $scope.daysofWeek[1] = "tuesday";
  $scope.daysofWeek[2] = "wednesday";
  $scope.daysofWeek[3] = "thursday";
  $scope.daysofWeek[4] = "friday";
  $scope.daysofWeek[5] = "saturday";
  $scope.daysofWeek[6] = "sunday";

  $scope.repeatType = [{ name: "NONE", description: "none" },
                       { name: "WEEKLY_1", description: "weekly_1" },
                       { name: "WEEKLY_2", description: "weekly_2" },
                       { name: "WEEKLY_3", description: "weekly_3" },
                       { name: "WEEKLY_4", description: "weekly_4" }];


  $scope.course = {};
  $scope.course.days = [6];
      
  for (var i = 6; i >= 0; i--) 
    $scope.course.days[i] = false;

  $scope.showFailMessage = false;
  $scope.error = {};
  $scope.error.messageKey = null;

  if($stateParams.courseId)
  {
    CourseService.getCourse($stateParams.courseId, function(response) {
      
      $scope.course = response;
      $scope.course.days = [6];
      
      for (var i = 6; i >= 0; i--) 
        $scope.course.days[i] = false;
      
      for (var i = response.weekdays.length - 1; i >= 0; i--) {
        $scope.course.days[response.weekdays[i] - 1] = true;
      };

      console.log($scope.course.days);

    });
  }

  $scope.doNewCourse = function(newCourse) 
  {
    $scope.error.messageKey = null;
    $scope.showFailMessage = false;

    if(newCourse !== undefined && !newCourse.$valid) return;

    console.log($scope.course.days);
    
    var requestData = $scope.course;
    requestData.weekdays = [];

    //delete requestData.days;

    for (var i = $scope.course.days.length - 1; i >= 0; i--) {
      if($scope.course.days[i] == true)
        requestData.weekdays[i] = i+1;
    };

    requestData.repeatType = $scope.course.repeatType.name;
    console.log(requestData);

    //CourseService.saveCourse($scope.course, "POST", $scope.saveSuccess, $scope.savefail);
  };

  $scope.saveSuccess = function(response){
    ToastService.info("courseSaveSuccessful");
    $scope.modal.hide();
    $scope.load();
  }

  $scope.saveFail = function(response){
    $scope.showFailMessage = true;
    $scope.error.messageKey = response;
  }
});