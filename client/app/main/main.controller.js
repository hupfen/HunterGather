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
    $scope.allUsers = [];
    $scope.allPosts = [];
    $scope.selected = undefined;
    $scope.project = '';
    $scope.address = '';
    $scope.showLoad = false;
    $scope.showResults = false;
    $scope.showError = false;
    $scope.reverse = true;

    $http.get('/api/cats').success(function(categorys) {
      $scope.categories = _.reject(categorys, function(cat) {
        return cat.number_of_organizations >= 1000;
      });
    });
    
    $http.get('/api/users').success(function(users) {
      $scope.allUsers = _.reject(users, function(us) {
        return (us.id === 2) || (us.posts_count === 0 && us.maker_of_count === 0 && us.comments_count === 0);
        // filters out Ryan and non-submitters
      });
    });
    
    $http.get('/api/posts').success(function(posts) {
      $scope.allPosts = posts;
    });
    
    $scope.hunt = function() {
      var cos = [];
      var users = [];
      $scope.showLoad = true;
      $scope.showResults = false;
      $scope.showError = false;
      $scope.results = [];
      var send = {catUID: $scope.selected.category.uuid, location: $scope.selected.location};
      $http.get('/api/hunt/cat/' + $scope.selected.category.uuid).then(function(companies) {
        cos = companies.data; //companies of that category
      })
      .then(function() {
        if (cos.length === 0) {
          $scope.showResults = true;
          $scope.showLoad = false;
          $scope.showError = true;
          return;
        }
        var huntedHere = [];
        var posts = [];
        _.filter($scope.allPosts, function(post) {
          return _.contains(cos, post.name);
        }).forEach(function(post) {
          huntedHere.push(_.find($scope.allUsers, function(u) {
            return u.id === post.user_id;
          }));
          posts.push(post.id);
        });
        huntedHere; //not having this here breaks things, because Javascript
        huntedHere = _.compact(huntedHere);
        posts.forEach(function(postId) {
          $http.get('/api/votes/post/'+postId).success(function(votes) {
            var voters = _.map(votes, function(v) {
              return v.user_id;
            });
            _.filter($scope.allUsers, function(u) {
              return _.contains(voters, u.id);
            })
            .forEach(function(user) {
              huntedHere; //not having this here breaks things, because Javascript
                if (_.any(huntedHere, {'id': user.id})) {
                  user.posted = 1000;
                }
              else {
                user.posted = 0;
              }
              $scope.results.push(user);
            });
          }); 
        });
        $scope.showResults = true;
        $scope.showLoad = false;
        $scope.showError = false;
      });
    };
    
    $scope.$watchCollection('results', function(newValue, oldValue) {
      $scope.votecount = _.countBy($scope.results, function(u) {
        return u.id;
      });
    });
  });