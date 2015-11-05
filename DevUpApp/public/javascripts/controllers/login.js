
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


devUp.controller('mainCtrl', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {
	$scope.createApp = function(){
		$scope.createApp.show = true;
	}
	$scope.addApps = function(){
		var y={'id': 1, 'name': 'Jira'};
		console.log(y);
		$scope.createApp.selectedApps.push(y);
		$mdDialog.show({
            controller: DialogController,
            templateUrl: '/views/dialogTemplate/jiralogin.html',
        });
	}
	$scope.createApp.apps = [{'id':1, 'name':'Jira'},{'id':2, 'name':'Github'}];
	$scope.createApp.selectedApps = [];
}]);

function DialogController($scope, $rootScope, $http, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
    $scope.submit = function(){
    	$scope.data = {
    		'jira': $scope.jira,
    		'user_id':1,
    		'externalApp_id':1

    	};
    	$http.post('http://localhost:3000/authjira',{data:$scope.data}).then(function(res){
    		console.log(res.data);
    	}, function(err){
    		console.log(err);
    	})
    }
}