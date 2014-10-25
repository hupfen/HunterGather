'use strict';

angular.module('hunterGatherApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.posts = [];
    $scope.users = [];
    $scope.categories = [];
    $scope.selected = undefined;
    $scope.showLoad = false;
    $scope.showResults = false;

//    $http.get('/api/posts').success(function(posts) {
//      $scope.posts = posts;
//    });
//    $http.get('/api/users').success(function(users) {
//      $scope.users = users;
//    });
    $http.get('/api/cats').success(function(categorys) {
      $scope.categories = _.reject(categorys, function(cat) {
        return cat.number_of_organizations >= 1000;
      });
    });
    
    $scope.hunt = function() {
      $scope.showLoad = true;
      $scope.results = [];
      var send = {catUID: $scope.selected.category.uuid, location: $scope.selected.location};
      $http.get('/api/hunt/' + send.catUID + '/' + send.location).success(function(results) {
        $scope.results = results;
        $scope.showResults = true;
        $scope.showLoad = false;
      });
    };

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