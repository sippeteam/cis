angular.module('frontendApp').
  factory('Repository', ['$resource', '$rootScope',
    function ($resource, $rootScope) {
      return $resource("http://enterprise.local:1337/:owner");
    }])
