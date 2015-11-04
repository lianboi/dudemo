
devUp.controller('loginCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.login = function(){
		alert("login clicked!!!!");
	}
}]);



devUp.controller('loginPage', ['$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.submit = function(){
		$http.post('http://localhost:3000/test',{username:"lian", password:"thomte"}).then(function(res){
			console.log(res);
		}, function(err){
			console.log(err);
		});
		$location.path('/main')
	}
}]);


devUp.controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.createApp = function(){
		$scope.createApp.show = true;
	}
	$scope.addApps = function(){
		var y={'id': 1, 'name': 'Jira'};
		console.log(y);
		$scope.createApp.selectedApps.push(y);
	}
	$scope.createApp.apps = [{'id':1, 'name':'Jira'},{'id':2, 'name':'Github'}];
	$scope.createApp.selectedApps = [];
}]);