import auth from '../services/auth.service';

routing.$inject = [
  '$urlRouterProvider',
  '$locationProvider',
  '$httpProvider',
  '$provide',
  'authInterceptorProvider'
];

stateTransition.$inject = [
  '$rootScope',
  '$state',
  '$stateParams',
  'auth'
];

function routing(
  $urlRouterProvider,
  $locationProvider,
  $httpProvider,
  $provide,
  authInterceptorProvider
) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/login');

  $provide.factory('authInterceptor', function() {
    return authInterceptorProvider.$get();
  });
  
  $httpProvider.interceptors.push('authInterceptor');
}

function stateTransition(
  $rootScope,
  $state,
  $stateParams,
  auth
) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  
  if ($rootScope.isLoggedIn) auth.getUser();

  $rootScope.$on('$stateChangeStart',
    function (event, toState, toParams, fromState, fromParams) {
      auth.checkAccess(event, toState, toParams, fromState, fromParams);
    }
  );
}

export {routing, stateTransition};