routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      template: require('./home.jade'),
      controller: 'HomeController',
      controllerAs: 'home',
      data: {
        access: 'onlyLoggedIn',
        onStateChange: 'HomeController.disconnect'
      }
    });
}