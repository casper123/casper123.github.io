apb.filter('duration', ['$translate', '$rootScope', '$timeout', function ($translate, $rootScope, $timeout) {
  var translation = {};

  var trans = function() {
    $timeout(function() {
      $translate(['minute', 'minutes', 'hour', 'hours', 'min', 'h']).then(function (result) {
        translation = result;
      });
    });
  };
  $rootScope.$watch("$translateChangeSuccess", trans);

  trans();

  return function (value, type) {

      var minutesName = translation.minutes;
      var minuteName = translation.minute;
      var hoursName = translation.hours;
      var hourName = translation.hour;

      if (type === "short") {
        minuteName = minutesName = translation.min;
        hourName = hoursName = translation.h;
      }

      var total = value;
      var minutes = total % 60;
      var hours = parseInt(total / 60);

      if (hours == 0 && minutes != 1) {
        return minutes + hours * 60 + " " + minutesName;
      } else if (hours == 0 && minutes == 1) {
        return minutes + " " + minuteName;
      }

      if (minutes == 0) {
        if (hours == 1) {
          return hours + " " + hourName;
        }
        return hours + " " + hoursName;
      }

      if (minutes == 30) {
        return hours + ".5 " + hoursName;
      }

      return hours + " " + translation.h + " "+ minutes + " " + translation.min;
  }
}]);