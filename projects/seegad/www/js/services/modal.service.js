precurioApp
.service('Modal', function ($http, $filter, $ionicLoading, $ionicModal, $ionicPopover, $ionicActionSheet, $rootScope, $ionicPopup, User, Task, CurrentUser, Expense, Team) {

	var modalService = this;
	var currentModal = null;

	$scope = $rootScope.$new();
  $scope.selectables = [1,2,3,4,5];
  $scope.expense = {};

	$ionicModal.fromTemplateUrl('templates/shortcut-modal.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function (modal) {
      $scope.shortcutModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/create-expense-modal.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function (modal) {
      $scope.expenseModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/create-task-modal.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function (modal) {
      $scope.taskModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/time-modal.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function (modal) {
      $scope.timeModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/time-modal-step-two.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function (modal) {
      $scope.timeModalStepTwo = modal;
    });

    $ionicPopover.fromTemplateUrl('templates/time-popover.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function(popover) {
      $scope.timePopOver = popover;
    });

    modalService.showShortcut = function () {
      $scope.shortcutModal.show();
    }

    $scope.showExpense = function(){
      Expense.getCategory(function (response){
        $scope.category = response;
        // console.log(response)
      })
      Expense.getMilestone(function (response){
        $scope.milestone = response;
        console.log(response)
      })
      Task.getProjects(function (response){
        $scope.projects = response;
        // console.log($scope.projects)
      })
      $scope.expenseModal.show();
    }

    modalService.editExpense = function(id){
      $scope.expenseId = id;

      Expense.getCategory(function (response){
        $scope.category = response;
      })

      Expense.getMilestone(function (response){
        $scope.milestone = response;
      })

      Task.getProjects(function (response){
        $scope.projects = response;
      })

      Expense.getSpecific(id, function (response){
        $scope.expense.id = response.id;
        $scope.expense.amount = parseFloat(response.amount);
        $scope.expense.projectId = response.projectId;
        $scope.expense.categoryId = response.categoryId;
        $scope.expense.milestoneId = response.milestoneId;
        $scope.expense.notes = response.notes;
        console.log($scope.expense);  
      })
      
      $scope.expenseModal.show();
    }

    $scope.saveExpense = function (data){
      var option = $filter('filter')($scope.projects, { id: data.projectId });
      console.log(option);
      var request = {};
      request.amount = data.amount;
      request.customerId = option[0].customerId;
      request.userId = option[0].userId;
      request.accountId = option[0].accountId;
      request.title = option[0].title
      request.projectId = data.projectId;
      request.categoryId = data.categoryId;
      request.milestoneId = data.milestoneId;
      request.notes = data.notes;
      if(data.id != undefined)
        request.id = data.id;

      // request.expenseDate = new Date(data.date).yyyymmdd();
      
      Expense.create($scope.UTIL.serialize(request), function (response){
        var alertPopup =  $ionicPopup.alert({
          template:'Expense has been successfully created'
        })
        $rootScope.load();
        $scope.expenseModal.hide();
      })
    }

    $scope.showTask = function(){
      $scope.task = {};
      Task.getProjects(function (response){
        $scope.projects = response;
      })
      Expense.getMilestone(function (response){
        $scope.milestone = response;
      })
      $scope.taskModal.show();
      
      $scope.detail = null;
      $scope.resMembers = [];

      User.getUser(function (response){
        Team.getMembers(response.accountId, function (resMembers){
          angular.forEach(resMembers, function(value, key) {
            value.assign = false;
            $scope.resMembers.push(value);
          })
        })
      })
    }
    
    $scope.saveTask = function (task){
      $scope.addTask = {};
      $scope.assign = [];

      var dateStart = new Date(task.dateStart);
      var dateDue = new Date(task.dateDue);
      var option = $filter('filter')($scope.milestone, { projectId: task.projectId });
      
      CurrentUser.getUser(function (response){
        $scope.user = response;

        $scope.addTask.title = task.title;
        $scope.addTask.dateStart = new Date().yyyymmdd();
        $scope.addTask.dateDue = dateDue.yyyymmdd();
        $scope.addTask.estDateEnd = dateDue.yyyymmdd();
        $scope.addTask.milestoneId = option[0].id;
        $scope.addTask.customerId = "KL54il8"; 
        $scope.addTask.projectId = task.projectId;
        $scope.addTask.userId = $scope.user.userId;
        $scope.addTask.keyUserId = option[0].keyUserId;

        if(task.important == true) {
          $scope.addTask.dateDue    = new Date().yyyymmdd();
          $scope.addTask.estDateEnd = new Date().yyyymmdd();
        }

        Task.create($scope.addTask, function (response){

          var assingnedMembers = [];

          angular.forEach($scope.resMembers, function(value, key){
            if(value.assign == true)
              assingnedMembers.push({userId: value.id});
          });

          Task.assignTaskTo(response.id, assingnedMembers, function(responseTask){
            console.log(response);
            console.log(responseTask)
          });

          var alertPopup = $ionicPopup.alert({
            title:'',
            template:'Task has been saved successfully'
          });

          $scope.closeModal();

        })
      });

    }

    $scope.showTime = function(){
      $scope.timeModal.show();
    }

    $scope.timeStepTwo = function(){
      $scope.timeModalStepTwo.show();
    } 

   	$scope.closeModal = function(){
      $scope.shortcutModal.hide();
      $scope.expenseModal.hide();
      $scope.taskModal.hide();
      $scope.timeModal.hide();
      $scope.timeModalStepTwo.hide();
    }   

    $scope.showTimerPop = function(){
      $scope.timePopOver.show();
    }
});