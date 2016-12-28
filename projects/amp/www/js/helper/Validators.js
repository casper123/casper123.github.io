angular.module('starter.helpers', [])

.directive('matches', function(){
  return {
    restrict:'A',
    scope:{
      matches:'=matches'
    },
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModelCtrl){
      ngModelCtrl.$validators.matches= function(value){
        return value === scope.matches;
      };

      scope.$watch('matches', function(){
        ngModelCtrl.$validate();
      });
    }
  };
});