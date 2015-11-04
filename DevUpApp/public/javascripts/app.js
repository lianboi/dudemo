var devUp = angular.module('devUp', ['ngRoute','ngMaterial']);

devUp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/test', {
            templateUrl: 'views/test.html',
            controller: 'test'
        })/*.
        when('/',{
        	templateUrl: 'views/login.html',
        	controller: 'loginCtrl'
        })*/
    }
]);

devUp.controller('httptest', ['$scope', '$http', function($scope, $http) {
    $scope.testclick = function() {
        console.log("hello test!!");
        $http.get("http://localhost:3000/httpcalltest").then(function(res) {
            console.log(res);
        }, function(err) {
            console.log(err);
        })
    }
}]);

devUp.controller('test', ['$scope', function($scope){
	
}])