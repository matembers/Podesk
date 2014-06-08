var app = angular.module('app', [
  'ngRoute',
  'appControllers'
]);




app.run([ '$http', '$rootScope', 
    function($http, $rootScope){
        $http.get("js/import.json").success(function(response){
            $rootScope.podcasts = response;
        }).error(function(){

        });
}]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
          when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
          }).
          when('/:podcast', {
            templateUrl: 'partials/podcast.html',
            controller: 'PodcastCtrl'
          }).
          otherwise({
            redirectTo: '/home'
          });
}]);


var appControllers = angular.module('appControllers', []);


appControllers.controller('HomeCtrl', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        $scope.panel = 0;
        $scope.loader  = false;
    }
]);

appControllers.controller('PodcastCtrl', ['$scope', '$http', '$sce','$rootScope', '$routeParams',
    function($scope, $http, $sce, $rootScope, $routeParams) {
        $scope.loader  = false;
        $scope.numLimit  = 10;

        $scope.nom = $rootScope.podcasts[$routeParams.podcast].nom;
        $scope.feed = "xml.php?url="+$rootScope.podcasts[$routeParams.podcast].feed;

        $http.get($scope.feed).success(function(data){

            var podcast = data;
            $scope.episodes = podcast.channel.item;
            angular.forEach($scope.episodes, function(value, key) {
               $scope.episodes[key].url = $sce.trustAsResourceUrl($scope.episodes[key].enclosure["@attributes"].url);
             });
            console.log($scope.episodes);

            $scope.numLimitMax  = $scope.episodes.length;
        }).error(function(){

        });
    }
]);