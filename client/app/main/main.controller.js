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
      $http.get('/api/hunt/' + send.catUID + '/' + send.location).success(function(companies) {
        $http.get('/api/posts').success(function(posts) {
          var users = _.map(_.select(posts, function(c){    
              return companies.indexOf(c.name) != -1;
          }), 'user_id');
          users.forEach(function (user) {
            $http.get('/api/users/'+user).success(function(hunter) {
              $scope.results.push(hunter[0]);
            });
          });
          $scope.showResults = true;
          $scope.showLoad = false;
        });
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