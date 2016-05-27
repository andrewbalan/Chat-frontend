routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('about', {
      url: '/about',
      template: require('./about.jade'),
      controller: 'AboutController',
      controllerAs: 'about',
      data: {
        access: 'onlyLoggedIn'
      }
    });
}