// angular.module('starter.controllers', [])

mongerApp.controller('DashCtrl', function($scope) {
  $scope.msg = 'ff';
  $scope.test = function() {
    console.log('foo bar');
    $window.alert('foo bar');
  }
})

.controller('HomeCtrl', function($scope, $state) {
  $scope.home = "Free Answers from Real People Anytime Anywhere";
  $scope.test = function() {
    $state.transitionTo('tab.main');
  }
    $scope.login = function() {
    $state.transitionTo('login');
  }

      $scope.signup = function() {
    $state.transitionTo('signup');
  }
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('QuestionsCtrl', function($scope, Friends) {
  $scope.questions = Friends.all();
})

.controller('QuestionsDetailCtrl', function($scope, Friends) {
  $scope.questions = Friends.all();
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('SkillsCtrl', function($scope, Skills) {
  $scope.skills = Skills.all();
});
