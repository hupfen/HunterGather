'use strict';

angular.module('hunterGatherApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.categories = [];
    $scope.selected = undefined;
    $scope.showLoad = false;
    $scope.showResults = false;
    $scope.reverse = true;

    $http.get('/api/cats').success(function(categorys) {
      $scope.categories = _.reject(categorys, function(cat) {
        return cat.number_of_organizations >= 1000;
      });
    });
    
    $scope.hunt = function() {
      $scope.showLoad = true;
      $scope.showResults = false;
      $scope.results = [];
      var send = {catUID: $scope.selected.category.uuid, location: $scope.selected.location};
      $http.get('/api/hunt/cat/' + send.catUID).success(function(companies) {
        $http.get('/api/posts').success(function(posts) {
          var users = _.map(_.select(posts, function(c){    
              return companies.indexOf(c.name) != -1;
          }), 'user_id');
          users.forEach(function (user) {
            var u = {};
            $http.get('/api/users/'+user).success(function(hunter) {
              u = hunter[0];
              $http.get('/api/votes/user/'+user).success(function(votes) {
                u.votes = _.select(votes, function(v) {
                  return companies.indexOf(v.post_name) != -1;
                });
                $scope.results.push(u);
              });
            });
          });
                $scope.showResults = true;
                $scope.showLoad = false;
        });
      });
    };

  });