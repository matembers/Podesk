var app = angular.module('app', []);

app.run(function($http, $rootScope){
    $http.get("js/import.json").success(function(response){
        $rootScope.podcasts = response;
    }).error(function(){

    });
});


app.config(function($routeProvider){
    $routeProvider
        .when('/home', {
            templateUrl:'partials/home.html',
            controller: "HomeCtrl"
        })
        .when('/:podcast', {
            templateUrl:'partials/podcast.html',
            controller: "PodcastCtrl"
        })
        .otherwise({redirectTo:'/home'})
});

function HomeCtrl($scope, $http, $rootScope){
    $scope.panel = 0;
    $scope.loader  = false;
}

function PodcastCtrl($scope, $http, $routeParams, $rootScope){
    $scope.loader  = false;

    $scope.nom = $rootScope.podcasts[$routeParams.podcast].nom;
    $scope.feed = "xml.php?url="+$rootScope.podcasts[$routeParams.podcast].feed;


    $http.get($scope.feed).then(function(response) {
        var chapters = [];
     
        /*setting up the response*/
        var podcast = response.data;
        console.log(podcast);
        console.log(podcast.channel.item[0].enclosure["@attributes"].url);
        $scope.episodes = podcast.channel.item;
        /*chapters = courseDef.course.navigation.chapter;
     
        var numOfPages = chapters[chapter].length;
        var thisChapter = chapters[chapter];
        var numOfPages = thisChapter.page.length;
     
        for (var i = 0; i < numOfPages; i++) {
          pages.push({
            name: thisChapter.page[i]
          });
        }
     
        $scope.pages = pages;
        $scope.chapterName = thisChapter.name;
        */


      });
}