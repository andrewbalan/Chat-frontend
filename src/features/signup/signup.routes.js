routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('signup', {
      url: '/signup',
      template: require('./signup.jade'),
      controller: 'SignupController',
      controllerAs: 'signup',
      data: {
        access: 'onlyNotLoggedIn'
      }
    });
}