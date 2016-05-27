routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      template: require('./login.jade'),
      controller: 'LoginController',
      controllerAs: 'login',
      data: {
        access: 'onlyNotLoggedIn'
      }
    });
}