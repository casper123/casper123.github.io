precurioApp
.controller('ExpenseCtrl', function($scope, $rootScope, $ionicModal, $state, $filter, CurrentUser, Expense, Modal) {
  
  $scope.showExpense = function(id){
    Modal.editExpense(id);
  };
  
  $scope.projects   = [];
  $scope.categories = [];
  $scope.getExpense = [];

  $rootScope.load = function(){
    Expense.getUserExpense($rootScope.startOfWeek, $rootScope.endOfWeek, function(response){
      Expense.getAllProjects(function(data){
        Expense.getAllCategories(function(cateData){
          $scope.projects   = data;
          $scope.categories = cateData;
          $scope.getExpense = response;
        });
      });
    });
  }

  $rootScope.load();

  $scope.getProjectName = function(projectId){
    var option = $filter('filter')($scope.projects, { id: projectId });
    return option[0].title;
  }

  $scope.getCategoryName = function(categoryId){
    var option = $filter('filter')($scope.categories, { id: categoryId });
    if (option[0] == undefined) {
      return null;
    }
    else{
      return option[0].title; 
    }      
  }
})