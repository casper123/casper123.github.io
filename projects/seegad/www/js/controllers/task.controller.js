precurioApp
.controller('TaskCtrl', function($scope, $interval, $rootScope, $ionicModal, $ionicLoading, $filter, $ionicPopup, md5, focus, Task, CurrentUser, User, moment, TaskService, Expense) {
  
  $ionicModal.fromTemplateUrl('templates/edit-task-modal.html', {
    scope: $scope,
    animation: 'mh-slide'
  }).then(function (modal) {
    $scope.editTaskModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/history-modal.html', {
    scope: $scope,
    animation: 'mh-slide'
  }).then(function (modal) {
    $scope.historyModal = modal;
  });

  $scope.showFooter = false;
  $scope.days = [];
  
  $scope.today = new Date();
  $scope.taskId = null;
  $scope.projectId = null;

  $scope.getExpense = [];
  $scope.taskList = [];
  $scope.taskHistory = [];

  $scope.message = null;
  $scope.projects = null;
  $scope.fetchComments = null;
  $scope.task = null;
  $scope.assignTo = null;
  $scope.milestone = null;
 

  window.addEventListener('native.keyboardhide', keyboardHideHandler);

  function keyboardHideHandler(e){
      $scope.showFooter = false;
  }
    
  $ionicLoading.show();
  
  ////////// Onpage Load //////////
  User.getUser(function (response){
    $scope.users = response
  })

  TaskService.getHours().then(function(result){

    TaskService.getTaskData().then(function(resultTask){
      $scope.taskList = resultTask;
      $scope.days = result.days;
      $scope.rate = result.rate;
      $scope.bill = result.budgeted;

      console.log(result);
      today = new Date().getDay();
      today = $filter('date')(today, 'EEE');
      $scope.sortTasks(today);
      $ionicLoading.hide();
      setTimeInterval();

    });
  });

  $scope.sortTasks = function(day){
    angular.forEach($scope.taskList, function(value, key){
      if(day == value.day){
        $scope.taskList[key].sortOrder = 100;
      }
      else
       $scope.taskList[key].sortOrder = 0; 

    });
  }

  /////////////////////////////////
  
  $scope.checkTimer = function(taskId){
    var time = JSON.parse(window.localStorage.getItem('time'));
    if(time != null){
      var option = $filter('filter')(time, { taskId: taskId });
   
      if (option.length == 0) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false
    }
  }

  $scope.start = function (taskId){
    var d = new Date();
    var startTime =(d.getMonth()+1) +"/"+d.getDate()+"/"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    var time = [{taskId: '', startTime: ''}];

    var time = JSON.parse(window.localStorage.getItem('time'));
    if (time == null){
        time = [{taskId: taskId, startTime: startTime}]
        window.localStorage.setItem('time', JSON.stringify(time));
    }
    else {
      var itemToAdd = {taskId: taskId, startTime: startTime};

      for(var k in time) {
        if(JSON.stringify(time[k].taskId) == JSON.stringify(itemToAdd.taskId)){ 
          var alertPopup = $ionicPopup.alert({
            title:'',
            template:'Timer is already runing of this task.'
          });
          return false;
        }
      }

      time.push(itemToAdd);
      window.localStorage.setItem('time', JSON.stringify(time));
    }

    var alertPopup = $ionicPopup.alert({
            title: '',
            template: 'Timer Started Successfuly.'
        });
  }

  $scope.stop = function (taskId){
    var d = new Date();
    var stopTime = (d.getMonth()+1) +"/"+d.getDate()+"/"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();

    var time = JSON.parse(window.localStorage.getItem('time'));
    var option = $filter('filter')(time, { taskId: taskId });

    var diff = moment.duration(moment(stopTime).diff(moment(option[0].startTime)));
    var sec  = diff._milliseconds/1000
    var min  = sec/60
    var hour = min/60
    
    var postData = {};
    postData.startTime = option[0].startTime;
    postData.endTime = stopTime;
    postData.hours = hour;
    
    for(i=0; i <= time.length; i++){
      if(taskId == time[i].taskId) {
        time.splice(i, 1)
        window.localStorage.setItem('time', JSON.stringify(time));
        break;
      }
    }

    Task.logForToday(taskId, $scope.UTIL.serialize(postData), function (response){
      console.log(response)
    })
  }

  $scope.showEdit = function (id, userId, projectId) {
    $ionicLoading.show();
    $scope.taskId = id;
    $scope.projectId = projectId;

    Task.getProjects(function (responseProj){
      Task.getComment(id, function (response){
        Task.taskDetail(id, function (data){
          Task.loadAssignTask(id, function (assign){
            Expense.getMilestone(function (responseMilestone){
              $scope.projects = responseProj;
              $scope.fetchComments = response;
              $scope.task = data;
              $scope.assignTo = assign
              $scope.milestone = responseMilestone;
              $ionicLoading.hide();
            })
          })  
        })
      })
    });
    
    $scope.editTaskModal.show();
  }

  $scope.hideDate = function (important) {
    if (task == true) {
      $scope.date = true;
    }
    else {
      $scope.date = false
    }
  }

  $scope.saveEditTask = function (task){
    $ionicLoading.show();
    var data = {};
    data.id = $scope.task.id
    data.title = task.title;
    data.projectId = task.projectId;

    Task.create(data, function (response){
      $ionicLoading.hide()
    })
  }

  $scope.send = function (message) {

    $scope.addComment = {};
    $scope.addComment.message = message;
    $scope.addComment.projectId = $scope.projectId;

    Task.postComment($scope.taskId, $scope.UTIL.serialize($scope.addComment), function (response){
      Task.getComment($scope.taskId, function (response){
        console.log(response)
        $scope.fetchComments = response;
        $scope.message = '';
      });
    })
  }

  $scope.assignTaskTo = function (userId){

    var objAssignTo = {"userId": userId}
    var arrAssignTo = [];
    arrAssignTo.push(objAssignTo);

  }

  $scope.writeComment = function() {
    $scope.showFooter = true;
    focus('commentText');
  }

  $scope.tellvalue = function(id){
    console.log(id)
  }

  $scope.viewHistory = function (taskId){
    console.log(taskId);

    Task.getTaskHistory(taskId, function (response){
      angular.forEach(response, function(value, key){

        if(value.hours > 0) {
          User.getUser(function(r){
            value.firstname = r.firstName;
            value.lastname = r.lastName;

            $scope.taskHistory.push(value);
          }, value.userId);
        }
      });
    })
    $scope.historyModal.show();
  }

  $scope.editTaskClose = function(){

    if($scope.showFooter == true)
    {
      cordova.plugins.Keyboard.close();
      $scope.showFooter = false;
      return;
    }
    
    $scope.editTaskModal.hide();
  }

  $scope.historyClose = function(){

    if($scope.showFooter == true)
    {
      cordova.plugins.Keyboard.close();
      $scope.showFooter = false;
      return;
    }
    $scope.historyModal.hide();
  }

  
  $scope.complete = function (status, id){
    if(status == true) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Complete Task',
        template: 'Are you sure you want mark this task complete?',
        cancelText:'No',
        cancelType:'assertive',
        okText:'YES'
      });

      confirmPopup.then(function(res) {
        if(res) {
          var key;
          if($scope.taskId != null){
            key = $scope.taskId;
          } else {
            key = id;
          };
          Task.complete(key, function (response){
            console.log(response)
          })
        } else {
          status = false;
        }
      });
    }
  }

  function setTimeInterval(argument) {
    $interval( function () {
        var time = JSON.parse(window.localStorage.getItem('time'));
        if (time == null || time == undefined){
          console.log("empty")
          return false
        }
        else {
          for (var i = 0; i <= time.length - 1; i++) {
            var option = $filter('filter')($scope.taskList, { id: time[i].taskId})
            
            var d = new Date();
            var stopTime = (d.getMonth()+1) +"/"+d.getDate()+"/"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            var diff = moment.duration(moment(stopTime).diff(moment(time[i].startTime)));
            
            //var timeSpent = ("0" + (diff._data.hours  / 60).toFixed(2)).slice(-2)+":"+ ("0" + (diff._data.minutes  / 60).toFixed(2)).slice(-2) +":"+ ("0" + (diff._data.seconds  / 60).toFixed(2)).slice(-2)
            var timeSpent = diff.asHours().toFixed(2);
            
            var index = $scope.taskList.indexOf(option[0]);
            $scope.taskList[index].timeSpent = timeSpent;
          }
        }
      }, 1000);
  }
})