angular.module('frontendApp').
  factory('Build', ['$resource', '$rootScope',
    function ($resource, $rootScope) {
      return $resource("http://enterprise.local:1337/:owner/:repo/:branch/:build");
    }])
