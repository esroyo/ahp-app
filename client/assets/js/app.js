(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',
    'LocalForageModule',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .constant('_', window._)
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider', '$localForageProvider'];
  function config($urlProvider, $locationProvider, $localForageProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');

    $localForageProvider.config({
        name: 'ahpApp',
        storeName: 'ahpApp'
    });
  }

  run.$inject = ['$rootScope'];
  function run($rootScope) {
    FastClick.attach(document.body);
    $rootScope._ = window._;
  }

})();
