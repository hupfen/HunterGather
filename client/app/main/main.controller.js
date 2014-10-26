'use strict';

angular.module('hunterGatherApp')
.filter('unique', function () {

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var hashCheck = {}, newItems = [];

      var extractValueToCompare = function (item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };

      angular.forEach(items, function (item) {
        var valueToCheck, isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
})
  .controller('MainCtrl', function ($scope, $http, $q) {
    $scope.categories = [];
    $scope.selected = undefined;
    $scope.project = '';
    $scope.address = '';
    $scope.showLoad = false;
    $scope.showResults = false;
    $scope.reverse = true;

    $http.get('/api/cats').success(function(categorys) {
      $scope.categories = _.reject(categorys, function(cat) {
        return cat.number_of_organizations >= 1000;
      });
    });
    
    $scope.hunt = function() {
      var cos = [];
      var users = [];
      $scope.showLoad = true;
      $scope.showResults = false;
      $scope.results = [];
      var send = {catUID: $scope.selected.category.uuid, location: $scope.selected.location};
      $http.get('/api/hunt/cat/' + $scope.selected.category.uuid).then(function(companies) {
        cos = companies.data; //companies of that category
      })
      .then(function() {
          cos.forEach(function (co) {
          $http.get('/api/posts/byCompany/'+co).then(function(posts) {
            var post = posts.data;
            if (post.length > 0) {
              post = post[0];
              var u = [];
              $http.get('/api/users/'+post.user_id).then(function(hunter) {
                u.push(hunter.data[0]);
              })
              .then(function() {
                // get people who've voted for this, but not submitted
                $http.get('/api/votes/post/'+post.id).success(function(votes) {
                  var voters = _.map(votes, function(v) {
                    return v.user_id;
                  });
                  voters.forEach(function(voter) {
                    $http.get('/api/users/'+voter).success(function(h) {
                        var us = h[0];
                        if (_.any(u, {'id': us.id})) {
                          us.posted = 1000;
                        }
                      else {
                        us.posted = 0;
                      }
                        $scope.results.push(us);
                      });
                  });
                });
              })
              .then(function() {
                $scope.showResults = true;
                $scope.showLoad = false;
              });
            }
          });
        });
      });
    };
    
    $scope.$watchCollection('results', function(newValue, oldValue) {
      $scope.votecount = _.countBy($scope.results, function(u) {
        return u.id;
      });
    });
  });