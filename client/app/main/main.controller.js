'use strict';

angular.module('hunterGatherApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.posts = [];
    $scope.users = [];
    $scope.categories = [];
    $scope.selected = undefined;
//    
//    $http.get('/api/posts').then(function(posts) {
//      $scope.posts = posts.data;
//    }).then(function() {
//      $http.get('/api/users/').then(function(users) {
//        $scope.users = users.data;
//      }).then(function() {
//        $scope.posts = $scope.posts.map(function(post) {
//          post.user = _.find($scope.users, function(usr) {
//            return usr.id === post.user_id;
//          });
//          return post;
//        });
//      });
//    });
//    
    $http.get('/api/posts').success(function(posts) {
      $scope.posts = posts;
    });
    $http.get('/api/users').success(function(users) {
      $scope.users = users;
    });
    $http.get('/api/cats').success(function(categorys) {
      $scope.categories = _.reject(categorys, function(cat) {
        return cat.number_of_organizations >= 1000;
      });
    });

//    $scope.addThing = function() {
//      if($scope.newThing === '') {
//        return;
//      }
//      $http.post('/api/posts', { name: $scope.newThing });
//      $scope.newThing = '';
//    };
//
//    $scope.deleteThing = function(thing) {
//      $http.delete('/api/things/' + thing._id);
//    };
  });