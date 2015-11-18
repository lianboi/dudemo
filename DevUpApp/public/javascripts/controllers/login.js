devUp.controller('loginCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.login = function() {
        alert("login clicked!!!!");
    }
}]);

devUp.controller('loginPage', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.submit = function() {
        $scope.temp = {};
        $scope.temp.username = $scope.user.name;
        $scope.temp.password = $scope.user.password;
        $scope.user = $scope.temp;
        console.log($scope.user);
        $http.post('http://localhost:3000/login', {
            data: {
                user: $scope.user
            }
        }).then(function(res) {
            var data = res.data;
            if (data.status == "Ok") {
            	sessionStorage.sessionData = JSON.stringify({"user":{"user_id":data.data.user_id}})
                $location.path('/main');
            } else {
                console.log(data);
            }


        }, function(err) {
            console.log(err);
        });
        //$location.path('/main')
    }
}]);

devUp.controller('mainCtrl', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {
    var session = JSON.parse(sessionStorage.sessionData);
   	console.log(sessionStorage.sessionData);
    $scope.createApp = function() {
        $scope.createApp.show = true;
        $scope.hidedashboard = true;
    };
    $scope.viewDashboard = function(){
    	$scope.createApp.show = false;
        $scope.hidedashboard = false;
    };
    $scope.checkappname = function(){
    	if($scope.app.name){
    		$http.post("http://localhost:3000/check_insert_app", {data:{user_id:1, appname:$scope.app.name}}).then(function(response){
    			console.log(response);
    			if(response.data.status == "Ok"){
    				$scope.showappselection  = true;
    				//console.log(response);
    				session.app = {};
    				session.app.appname = $scope.app.name;
    				session.app.id = response.data.data.app_id;
    				sessionStorage.sessionData = JSON.stringify(session);
    				console.log(sessionStorage.sessionData);
    			}
    		}, function(err){});
    	}
    };
    
    $scope.addApps = function(evt, x, z) {
        var y = {
            'id': x,
            'name': z
        };
        console.log(x, z);

        $mdDialog.show({
            controller: DialogController,
            templateUrl: '/views/dialogTemplate/jiralogin.html',
            locals: {
                id: x,
                name: z
            }
        }).then(function(answer) {
            if (answer) {
                $scope.createApp.selectedApps.push(y);
                $http.get("http://localhost:3000/jiraproject", {
                    params: {
                        user_id: 1
                    }
                }).then(function(response) {
                    $scope.stepTwo = true;
                    $scope.jiraprojects = response.data;
                    console.log(response);
                }, function(err) {});
            }

            console.log(answer);
        });
    };
    $scope.submitApp = function(){
    	var data = JSON.parse(sessionStorage.sessionData);
    	data.jira = $scope.selectedproject;
    	$http.post("http://localhost:3000/createApp",{data:data}).then(function(res){
    		console.log(res);
    	}, function(err){
    		console.log(err);
    	});
    };

    $http.get("http://localhost:3000/externalapp").then(function(res) {
        $scope.createApp.apps = res.data;
    }, function(err) {});
    // = [{'id':1, 'name':'Jira'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'}];
    $scope.createApp.selectedApps = [];

    $scope.toStep2 = function() {
            $http.get("http://localhost:3000/jiraproject", {
                params: {
                    user_id: 1
                }
            }).then(function(response) {
                $scope.stepTwo = true;
                $scope.jiraprojects = response.data;
                console.log(response);
            }, function(err) {});
        }
        //createapp.stepTwo
}]);

function DialogController($scope, $rootScope, $http, $mdDialog, locals) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        //$mdDialog.cancel();
        $scope.answer("abc");
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
    console.log(locals);
    $scope.currentapp = locals;
    $scope.submit = function() {
        $scope.data = {
            'jira': $scope.jira,
            'user_id': 1,
            'externalApp_id': locals.id

        };
        $http.post('http://localhost:3000/authenticateExternalApp', {
            data: $scope.data
        }).then(function(res) {
            console.log(res.data);
            $scope.answer(res.data);
        }, function(err) {
            console.log(err);
        });
    }
}

devUp.controller('githubOauthCtrl', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {
    $scope.createApp = function() {
        $scope.createApp.show = true;
    }
    $scope.addApps = function(evt, x, z) {
        var y = {
            'id': x,
            'name': z
        };
        console.log(x, z);
        $scope.createApp.selectedApps.push(y);
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '/views/dialogTemplate/jiralogin.html',
            locals: {
                id: x,
                name: z
            }
        }).then(function(answer) {
            console.log(answer);
        });
    }
    $http.get("http://localhost:3000/externalapp").then(function(res) {
        $scope.createApp.apps = res.data;
    }, function(err) {});
    // = [{'id':1, 'name':'Jira'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'},{'id':2, 'name':'Github'}];
    $scope.createApp.selectedApps = [];
}]);
