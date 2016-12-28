precurioApp
.controller('TeamCtrl', function($scope, $ionicLoading,  $rootScope, $ionicPopover, $filter, md5, Team, User, Task) {

    $ionicPopover.fromTemplateUrl('templates/view-detail-modal.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function(popover) {
      $scope.detailModal = popover;
    });

    $scope.detail = null;
    $scope.resMembers = [];

    $ionicLoading.show();

    User.getUser(function (response){
      Team.getMembers(response.accountId, function (resMembers){
        angular.forEach(resMembers, function(value, key){
          Task.getHoursLogged(value.id, $rootScope.startOfWeek + ' 00:00:00', $rootScope.endOfWeek + ' 23:59:59').then(function(result){
            var total = 0;
            angular.forEach(result.data, function(v, k){
              total += v.hours;
            });
            value.totalHours = parseInt(total);
            $scope.resMembers[key] = value;
            // console.log(value);
          });
        })

        $ionicLoading.hide();
      })
    })

    Task.getAllProjects(function (response){
      $scope.projects = response; 
    });

    $scope.showDetail = function(userName){
      $scope.detail = $filter('filter')($scope.resMembers, { username: userName })[0];
      Team.getAllTask($scope.detail.id, function (response){
        $scope.userTasks = response;
        console.log(response)
      })
      $scope.detailModal.show();
    };

    $scope.getProjectName = function(projectId){
      var option = $filter('filter')($scope.projects, { id: projectId });
      if (option[0] == undefined) {
        return null;
      }
      else{
        return option[0].title; 
      } 
    };

    $scope.closeModal = function(){
      $scope.detailModal.hide();
    }
});