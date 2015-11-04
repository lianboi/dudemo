
devUp.controller('loginCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.login = function(){
		alert("login clicked!!!!");
	}
}]);



devUp.controller('loginPage', ['$scope', '$http', function($scope, $http) {
	$scope.submit = function(){
		$http.post('http://localhost:3000/test',{username:"lian", password:"thomte"}).then(function(res){
			console.log(res);
		}, function(err){
			console.log(err);
		})
	}
}]);
