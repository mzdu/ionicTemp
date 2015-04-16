'use strict'

mongerApp.controller('SignInCtrl', function ($rootScope, $scope, $state, AuthService, $window) {
    // if the user is already logged in, take him to his bucketlist
    // if ($rootScope.isSessionActive()) {
    //     $window.location.href = ('#/bucket/list');
    // }

    $scope.user = {
        email: "",
        password: ""
    };

    $scope.validateUser = function () {
        var email = this.user.email;
        var password = this.user.password;
        if(!email || !password) {
        	$rootScope.notify("Please enter valid credentials");
        	return false;
        }
        console.log(email);
        console.log(password);
        $rootScope.show('Please wait.. Authenticating');
        AuthService.signin({
            email: email,
            password: password
        }).success(function (data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            //$window.location.href = ('#/bucket/list');
            $state.go('tab.main');
        }).error(function (error) {
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    }

})

.controller('SignUpCtrl', function ($rootScope, $scope, $state, AuthService, $window) {
    $scope.user = {
        email: "",
        password: "",
        name: ""
    };

    $scope.createUser = function () {
    	var email = this.user.email;
        var password = this.user.password;
        var uName = this.user.name;
        if(!email || !password || !uName) {
        	$rootScope.notify("Please enter valid data");
        	return false;
        }
        $rootScope.show('Please wait.. Registering');
        AuthService.signup({
            email: email,
            password: password,
            name: uName
        }).success(function (data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            //$window.location.href = ('#/bucket/list');
            $state.go('tab.main');
        }).error(function (error) {
            $rootScope.hide();
            console.log(error);
        	if(error.error && error.error.code == 11000)
        	{
        		$rootScope.notify("A user with this email already exists");
        	}
        	else
        	{
        		$rootScope.notify("Oops something went wrong, Please try again!");
        	}
            
        });
    }
});