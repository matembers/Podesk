function WeatherCtrl($scope, $http, geolocationService){
	$scope.panel = 0;

	$scope.search = function(){
		if($scope.city){
			var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q='+$scope.city+'&mode=json&units=metric&cnt=10';
			$scope.loader  = true;
			$http.get(url).success(httpSuccess).error(httpError);			
		}
	}
	$scope.expand = function(e){
		$elem = $(e.currentTarget);
		$elem.addClass('row_active').siblings().removeClass('row_active');
	}

	$scope.geolocate = function(){
		$scope.loader  = true;
		geolocationService.getCurrentPosition().then(function(position){
			$http.get('http://api.openweathermap.org/data/2.5/forecast/daily?lat='+position.coords.latitude+'&lon='+position.coords.longitude+'&mode=json&units=metric&cnt=10').success(httpSuccess).error(httpError);		
		}, function(){
			$scope.loader  = false;
			alert('IMpossible d\'obtenir');
		});

		/*geolocationService.getCurrentPosition(function(position){
			$http.get('http://api.openweathermap.org/data/2.5/forecast/daily?lat='+position.coords.latitude+'&lon='+position.coords.longitude+'&mode=json&units=metric&cnt=10').success(httpSuccess).error(httpError);		
		}, function(){
			$scope.loader  = false;
			alert('IMpossible d\'obtenir');
		});*/
	}

	httpSuccess = function(response){
		$scope.weather = response;
		if($scope.weather.cod != 404){
			$scope.panel = 1;
		}
		$scope.loader  = false;
	}
	httpError = function(){
		$scope.loader  = false;
		alert('Impossible');
	}
	//$scope.city = 'lyon';
	$scope.Math = Math;
}