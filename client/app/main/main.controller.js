'use strict';

angular.module('hunterGatherApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.posts = [];
    $scope.users = [];
    
    $http.get('/api/posts').then(function(posts) {
      $scope.posts = posts;
    }).then(function() {
      $http.get('/api/users/').then(function(users) {
        $scope.users = users;
      }).then(function() {
        
      });
    });
    
    

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/posts', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });