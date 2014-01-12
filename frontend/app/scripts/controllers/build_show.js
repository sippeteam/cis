'use strict';

angular.module('frontendApp')
  .controller('BuildShowCtrl', function ($scope, $routeParams, Build) {
    var owner = $routeParams.owner || "";
    var repo = $routeParams.repo || "";
    var branch = $routeParams.branch || "";
    var build = $routeParams.build || "";

    $scope.build = Build.get({
      owner: owner,
      repo: repo,
      branch: branch,
      build: build
    });
  });
