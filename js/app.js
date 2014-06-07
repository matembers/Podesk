

document.addEventListener('deviceready', function(){
    navigator.splashscreen.hide();
}, false);

var app = angular.module('app', []);

/*
app.factory('cordovaReady', function() {
  return function (fn) {

    var queue = [];

    var impl = function () {
      queue.push(Array.prototype.slice.call(arguments));
    };

    document.addEventListener('deviceready', function () {
      queue.forEach(function (args) {
        fn.apply(this, args);
      });
      impl = fn;
    }, false);

    return function () {
      return impl.apply(this, arguments);
    };
  };
});

app.factory('geolocationService', function ($rootScope, cordovaReady) {
  return {
    getCurrentPosition: cordovaReady(function (onSuccess, onError, options) {
      navigator.geolocation.getCurrentPosition(function () {
        var that = this,
          args = arguments;

        if (onSuccess) {
          $rootScope.$apply(function () {
            onSuccess.apply(that, args);
          });
        }
      }, function () {
        var that = this,
          args = arguments;

        if (onError) {
          $rootScope.$apply(function () {
            onError.apply(that, args);
          });
        }
      },
      options);
    })
  };
});


app.factory('GeolocationService', function($window, $q, $rootScope){
    var geolocation = $window.navigator.geolocation;
    return {
        getCurrentPosition : function(onSuccess, onError){
            geolocation.getCurrentPosition(function(position){
                $rootScope.$apply(function(){
                   onSuccess(position);
                });
            }, function(){
                $rootScope.$apply(function(){
                    onError();
                })
            })
            return true;
        }
    }
})*/

app.factory('geolocationService', function($window, $q, $rootScope){
    var geolocation = $window.navigator.geolocation;
    return {
        getCurrentPosition : function(){
            var defer = $q.defer();
            geolocation.getCurrentPosition(function(position){
                $rootScope.$apply(function(){
                   defer.resolve(position);
                });
            }, function(){
                $rootScope.$apply(function(){
                    defer.reject();
                })
            },{
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            })
            return defer.promise;
        }
    }
})


app.config(function($routeProvider){
    $routeProvider
        .when('/home', {templateUrl:'partials/home.html'})
        .when('/about', {templateUrl:'partials/about.html'})
        .otherwise({redirectTo:'/home'})
})