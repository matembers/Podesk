var app = angular.module('app', [
  'ngRoute',
  'appControllers'
]);


app.directive("ngAudio", function () {
    return function (scope, element, attrs) {
        scope.$watch("episode.url", function (value) {
            var val = value || null;            
            if (val){
                //console.log(value);
                element.mediaelementplayer({audioWidth: 700});              
            }
                
        });
    };
});

app.run([ '$http', '$rootScope', 
    function($http, $rootScope){
        $http.get("js/import.json").success(function(response){
            $rootScope.podcasts = response;
        }).error(function(){

        });
}]);

app.config(['$routeProvider', '$sceDelegateProvider',
    function($routeProvider, $sceDelegateProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: 'partials/home.html',
                controller: 'HomeCtrl'
            }).
            when('/:idPodcast', {
                templateUrl: 'partials/podcast.html',
                controller: 'PodcastCtrl'
            }).
            otherwise({
                redirectTo: '/home'
            });
        /*$sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://feeds.soundcloud.com/stream/**']);*/
}]);


var appControllers = angular.module('appControllers', []);


appControllers.controller('HomeCtrl', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        $scope.panel = 0;
        $scope.loader  = false;
        $scope.notSorted = function(obj){
            if (!obj) {
                return [];
            }
            return Object.keys(obj);
        }

    }
]);

appControllers.controller('PodcastCtrl', ['$scope', '$http', '$sce','$rootScope', '$routeParams',
    function($scope, $http, $sce, $rootScope, $routeParams) {
        $scope.loader  = false;
        $scope.numLimit  = 5;        

        $scope.nom = $rootScope.podcasts[$routeParams.idPodcast].name;
        $scope.cover = $rootScope.podcasts[$routeParams.idPodcast].cover;
        $scope.feed = "xml.php?nom="+$routeParams.idPodcast+"&url="+$rootScope.podcasts[$routeParams.idPodcast].feed;

        $http.get($scope.feed).success(function(data){

            var podcast = data;
            console.log(data);
            $scope.episodes = podcast.channel.item;
            angular.forEach($scope.episodes, function(value, key) {
               $scope.episodes[key].url = $sce.trustAsResourceUrl($scope.episodes[key].enclosure["@attributes"].url);
                date = new Date($scope.episodes[key].pubDate);
                dateString = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth()+1)).slice(-2) + '/' + date.getFullYear();
               $scope.episodes[key].dateFr = dateString;
             });
            //console.log($scope.episodes);

            $scope.numLimitMax  = $scope.episodes.length;
        }).error(function(){

        });

        $scope.playPod = function(e){
            console.log('podcast'+e);
            //$('#podcast'+e+' audio').audioPlayer();
            $('#podcast'+e+' audio').mediaelementplayer({audioWidth: 400});
            /*$elem = $($scope);
            $elem.audioPlayer();*/
        }
    }
]);