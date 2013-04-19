'use strict';

/* Controllers */
var base_url = 'http://localhost:3010/'

function LoginCornerCtrl($scope, $http){
	console.log("Authenticating...")
	if(document.cookie){
		$http.get(base_url+'authenticate').success(function(data){
			console.log("user authenticated.")
			$scope.loggedIn=true
		}).error(function(data,status,headers,config){
			console.log("user not authenticated.")
			$scope.loggedIn=false
		})
	}else{
		console.log("Auth non existant.")
		$scope.loggedIn=false
	}
	$scope.loggedIn=false
	$scope.username="Dan"
	$scope.userLink="#/users/dan"
}

function RegisterCtrl($scope, $http){
	$scope.register = function(user){
		if(user.password!==user.confirm){
			$scope.error.repeat = "Passwords must match."
		}else{
			$scope.error.repeat = ""
		}
	}	
}

function UserListCtrl($scope, $http){
	// console.log("Booting up users...")
	$scope.users = []
	$http.get(base_url+'users.json').success(function(data){
		// console.log("Returned: "+data[0])
	    for(var i=0; i<data.length; i++){
	    	var user = JSON.parse(data[i])
	    	//console.log("User created."+ user);
	    	$scope.users.push(JSON.parse(data[i]))
	    }
	    // console.log("Users: "+typeof data[1])
	}).error(function(data, status, headers,config){
		console.log("Failure!"+data+status+headers+JSON.stringify(config))
		$scope.users=[{username:"Philbert"},{username:"Denehede"}]
	})
}

function UserDetailCtrl($scope, $routeParams, $http) {
  $scope.userId = $routeParams.userId;
  $http.get('http://localhost:3010/users/'+$scope.userId).success(function(data){
	    $scope.user=JSON.parse(JSON.parse(data))
	    
	}).error(function(data, status, headers,config){
		console.log("Failure!"+data+status+headers+JSON.stringify(config))
		$scope.user={username:"Failure",position:"To Load"}
	})
}