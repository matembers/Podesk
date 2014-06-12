var app = angular.module('app', [
  'ngRoute',
  'ngSanitize',
  'appControllers'
]);


app.directive("ngAudio", function () {
    return function (scope, element, attrs) {
        scope.$watch("audioUrl", function (value) {
            var val = value || null;            
            if (val){ 
                var player = new MediaElementPlayer(element,{
                    audioWidth: 1140,
                    success: function (mediaElement) { 
                        mediaElement.addEventListener('loadeddata', function(e) {             
                            //mediaElement.play();  
                        }, false);                    
                    }
                });   
                //player.play();         
            }
                
        });
    };
});

app.run([ '$http', '$rootScope', '$sce', 
    function($http, $rootScope, $sce){
        
        $rootScope.title = 'Podesk';
        $rootScope.audioUrl = $sce.trustAsResourceUrl('http://feeds.soundcloud.com/stream/153521892-radionavo-damien-maric-et-ses-invites-parlent-de-leurs-choix-les-invites-de-mon-invite-sont-mes-invites.mp3');
        $http.get("podcasts.json").success(function(response){
            $rootScope.podcasts = response.list;
            console.log($rootScope.podcasts);
            $rootScope.listPodcast = []
            angular.forEach(response.list, function(value, key) {
               $rootScope.listPodcast[response.list[key].alias] = response.list[key].cover;
             });
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

        $rootScope.title = 'Podesk';
        
    }
]);

appControllers.controller('PodcastCtrl', ['$scope', '$http', '$sce','$rootScope', '$routeParams',
    function($scope, $http, $sce, $rootScope, $routeParams) {
        $scope.loader  = false;
        $scope.numLimit  = 5; 

        $scope.feed = "podcasts/"+$routeParams.idPodcast+".json";

        //keyyy = jQuery.inArray($routeParams.idPodcast, $.makeArray( $rootScope.podcasts))   ; 
        // 
        $scope.cover = $rootScope.listPodcast[$routeParams.idPodcast];
        console.log($scope.cover); 
        $http.get($scope.feed).success(function(data){

            $rootScope.title = data.channel.title+' - '+$rootScope.title;
            $scope.nom = data.channel.title;
            $scope.description = data.channel.description;

            var podcast = data.channel.item;
            //console.log(data);
            angular.forEach(podcast, function(value, key) {
               podcast[key].url = $sce.trustAsResourceUrl(podcast[key].enclosure["@attributes"].url);
                date = new Date(podcast[key].pubDate);
               podcast[key].dateTs = date.getTime();
                dateString = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth()+1)).slice(-2) + '/' + date.getFullYear();
               podcast[key].dateFr = dateString;
             });
            $scope.episodes = podcast;
            //console.log($scope.episodes);

            $scope.numLimitMax  = $scope.episodes.length;
        }).error(function(){

        });

        $scope.playPod = function(episode){
            //console.log('url : '+episode.url);
            $rootScope.audioUrl = episode.url;
        }
    }
]);


