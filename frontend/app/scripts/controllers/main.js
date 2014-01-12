'use strict';

angular.module('frontendApp')
  .controller('MainCtrl', function ($scope, $routeParams, Repository) {
    var owner = $routeParams.owner || ""

    $scope.repositories = Repository.query({ owner: owner });
  });
