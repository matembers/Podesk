var app = angular.module('app', [
  'ngRoute',
  'ngSanitize',
  'appControllers'
]);


app.directive("ngAudio", function () {
    return function (scope, element, attrs) {
        scope.$watchCollection('[audioUrl, audioPlay]', function (value) {
            var audioUrl = value[0] || null;     
            var audioPlay = value[1];            
            if (audioUrl){   
                var player = new MediaElementPlayer(element,{
                    audioWidth: 1140
                }); 
                if (audioPlay) {
                    player.play();  
                }else {
                    player.pause();  
                }             
            }
                
        });
    };
});

app.run([ '$http', '$rootScope', '$sce', 
    function($http, $rootScope, $sce){
        
        $rootScope.title = 'Podesk';
        $rootScope.audioUrl = $sce.trustAsResourceUrl('http://feeds.soundcloud.com/stream/153521892-radionavo-damien-maric-et-ses-invites-parlent-de-leurs-choix-les-invites-de-mon-invite-sont-mes-invites.mp3');
        $rootScope.audioNom = "DAMIEN MARIC et ses invit\u00e9s parlent de leurs choix (Les Invit\u00e9s de mon Invit\u00e9 sont mes Invit\u00e9s)";
        $rootScope.audioPlay = false;
        $http.get("podcasts.json").success(function(response){
            $rootScope.podcasts = response.list;
            //console.log($rootScope.podcasts);
            $rootScope.listPodcast = [];
            angular.forEach(response.list, function(value, key) {
                $rootScope.listPodcast2 = [];
                $rootScope.listPodcast2['name'] = response.list[key].name;
                $rootScope.listPodcast2['cover'] = response.list[key].cover;
                $rootScope.listPodcast2['feed'] = response.list[key].feed;
                $rootScope.listPodcast2['description'] = response.list[key].description;
               $rootScope.listPodcast[response.list[key].alias] = $rootScope.listPodcast2;
            });
            console.log( $rootScope.listPodcast); 
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

        $rootScope.title = $rootScope.listPodcast[$routeParams.idPodcast].name+' - '+$rootScope.title;

        $scope.json = "podcasts/"+$routeParams.idPodcast+".json";

         
        $scope.cover = $rootScope.listPodcast[$routeParams.idPodcast].cover;
        $scope.nom = $rootScope.listPodcast[$routeParams.idPodcast].name;
        $scope.feed = $rootScope.listPodcast[$routeParams.idPodcast].feed;
        $scope.description = $rootScope.listPodcast[$routeParams.idPodcast].description;

        console.log( $rootScope.listPodcast); 

        $http.get($scope.json).success(function(data){
            var podcast = data.episodes;
            angular.forEach(podcast, function(value, key) {
               podcast[key].url = $sce.trustAsResourceUrl(podcast[key].url);
             });
            $scope.episodes = podcast;
            //console.log($scope.episodes);

            $scope.numLimitMax  = $scope.episodes.length;
        }).error(function(){

        });

        $scope.playPod = function(episode, e){
            //console.log('url : '+episode.url);
            $rootScope.audioNom = episode.title;
            $rootScope.audioUrl = episode.url;

            $elem = $(e.currentTarget);
            if ($elem.hasClass('active')) {
                $rootScope.audioPlay = false;
                $elem.removeClass('active').children('.glyphicon').addClass('glyphicon-play').removeClass('glyphicon-pause');
            }else{
                $rootScope.audioPlay = true;
                $('.play').removeClass('active').children('.glyphicon').addClass('glyphicon-play').removeClass('glyphicon-pause');
                $elem.addClass('active').children('.glyphicon').addClass('glyphicon-pause').removeClass('glyphicon-play');
            }
        }
        $scope.expand = function(e){
            
        }
    }
]);


