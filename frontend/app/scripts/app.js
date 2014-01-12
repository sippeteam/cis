'use strict';

angular.module('frontendApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/:owner', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/:owner/:repo', {
        templateUrl: 'views/branches.html',
        controller: 'BranchCtrl'
      })
      .when('/:owner/:repo/:branch', {
        templateUrl: 'views/builds.html',
        controller: 'BuildCtrl'
      })
      .when('/:owner/:repo/:branch/:build', {
        templateUrl: 'views/build_show.html',
        controller: 'BuildShowCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
