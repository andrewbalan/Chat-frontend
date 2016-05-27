import angular from 'angular';
import auth from '../../services/auth.service';
import './navbar.styl';

class Navbar {
  constructor($rootScope, auth) {
    this.$rootScope = $rootScope;
    this.auth = auth;
  }

  logout() {
    this.auth.logout();
  }
}

Navbar.$inject = ['$rootScope', 'auth'];

function navbar() {
  return {
    template: require('./navbar.jade'),
    restrict: 'E',
    scope: {},
    controller: Navbar,
    controllerAs: 'nav'
  }
}

export default angular.module('directives.navbar', [auth])
  .directive('navbar', navbar)
  .name;