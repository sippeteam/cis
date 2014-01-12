'use strict';

angular.module('frontendApp')
  .controller('BuildCtrl', function ($scope, $routeParams, Build) {
    var owner = $routeParams.owner || ""
    var repo = $routeParams.repo || ""
    var branch = $routeParams.branch || ""

    $scope.builds = Build.query({ owner: owner, repo: repo, branch: branch });
    $scope.baseUrl = "#/" + owner + "/" + repo + "/" + branch;
  });
