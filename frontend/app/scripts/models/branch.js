angular.module('frontendApp').
  factory('Branch', ['$resource', '$rootScope',
    function ($resource, $rootScope) {
      return $resource("http://enterprise.local:1337/:owner/:repo");
    }])
