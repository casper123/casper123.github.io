precurioApp.factory('TaskService', function(Task, User, $q, $filter, $rootScope) {

	var self = this;


	self.getHours = function(){

		var deferred = $q.defer();
		var subPromise = [];

		var days = [];

		User.getUser(function (responseUser){

		    var today = new Date();

		    for (var i = 1; i <= 7; i++) {
		       var day = {};
		       day.date = moment().day(i).toDate();

		       if(day.date.getDay() == today.getDay())
		        day.class = "day-active";
		      else
		        day.class = '';

		       day.day = $filter('date')(day.date, 'EEE');
		       days.push(day);
		    }

		    var totalWeekly = 0;
		    angular.forEach(days, function(value, key){
		      	subPromise.push(Task.getHoursLogged(responseUser.id, value.date.yyyymmdd() + ' 00:00:00', value.date.yyyymmdd() + ' 23:59:59').then(function(response) {
		      		
		         	var total = 0;
					angular.forEach(response.data, function(v, k){
						total += v.hours;
						totalWeekly += v.hours; 
					});

					value.totalHours = ("0" + (parseFloat(total)  / 60).toFixed(2)).slice(-2) + ':' + ("0" + (parseFloat(total)  % 60).toFixed(2)).slice(-2);
					days[key] = value;
					return days;
		      	}));
		    });

			//Task.getHoursLogged(responseUser.id, $rootScope.startOfWeek + ' 00:00:00', $rootScope.endOfWeek + ' 23:59:59'  ,function (responseTimesheet){

				// timeSpent = 0;
				// for (var i = 0; i < responseTimesheet.length; i++) {
				// 	timeSpent = timeSpent + responseTimesheet[i].hours;
				// };
			$q.all(subPromise).then(function() {

				bill = null;
				rate = null;

				bill = responseUser.billRate * totalWeekly;
				workingDays = responseUser.config;
				hoursPerPeriod = responseUser.hoursPerPeriod;
				periodInDays = $filter('date')(new Date(), 'EEEE');

				if (workingDays == null){
					workingDays = 6;
				};

				if (periodInDays == "Monday") {
					periodInDays = 1
				}
				else if (periodInDays == "Tuesday") {
					periodInDays = 2
				}
				else if (periodInDays == "Wednesday") {
					periodInDays = 3
				}
				else if (periodInDays == "Thursday") {
					periodInDays = 4
				}
				else if (periodInDays == "Friday") {
					periodInDays = 5
				}
				else if (periodInDays == "Saturday") {
					periodInDays = 6
				}
				else if (periodInDays == "Sunday") {
					periodInDays = 7
				}
				
				budgeted = (hoursPerPeriod/workingDays)*periodInDays;
				rate = (totalWeekly / budgeted)*100;
				
				if(isNaN(rate))
					rate = 0;

				deferred.resolve({rate:rate, budgeted:bill, days:days})
			})
		})

		return deferred.promise;
	}

	self.getTaskData = function() {

		var deferred = $q.defer();
		var tasklist = [];
		var projects = [];
		var category = [];

		Task.getAllProjects(function(data){
			projects = data;

			Task.getAllCategories(function(cateData){
				category = cateData;

				Task.getAll(function(response){

					angular.forEach(response, function(value, key){

						var option = $filter('filter')(projects, { id: value.projectId });
					    if (option[0] == undefined)
					      value.projectName = 'n/a';
					    else
					      value.projectName =  option[0].title; 
					    
					    var option = $filter('filter')(category, { id: value.categoryId });
					    if (option[0] == undefined) {
					      value.categoryName = 'n/a';
					    }
					    else{
					      value.categoryName = option[0].title; 
					    } 
					    if(value.dateDue != null)
					    {
					    	value.day = new Date(value.dateDue).getDay();
					    	value.day = $filter('date')(value.day, 'EEE');
					    }

					    value.sortOrder = 0;
						Task.getTaskHours(value.id, $rootScope.startOfWeek + ' 00:00:00', $rootScope.endOfWeek + ' 23:59:59').then(function(result){

							var total = 0;

							if(result.length == 0)
							{
								value.hours = 0;

							  	if(tasklist.indexOf(value) == -1)
			            			tasklist.push(value);

			            		if(key == (response.length-1))
							    {
							      deferred.resolve(tasklist);
							    }
							}

							for (var j in result) 
							{
								(function(i)
								{
								  	total += result[i].hours;
								  	value.hours = total.toFixed(2);

								  	if(tasklist.indexOf(value) == -1)
				            			tasklist.push(value);

								    if(key == (response.length-1))
								    {
								      deferred.resolve(tasklist);
								    }

								})(j);
							};
						});
					});
				});
			});
		});

      	return deferred.promise
	};

	return self;
});