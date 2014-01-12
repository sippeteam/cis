'use strict';

angular.module('frontendApp')
  .controller('BranchCtrl', function ($scope, $routeParams, Branch) {
    var owner = $routeParams.owner || "";
    var repo = $routeParams.repo || "";

    $scope.branches = Branch.query({ owner: owner, repo: repo });
    $scope.baseUrl = "#/" + owner + "/" + repo;
  });
