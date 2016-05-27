import 'bulma/css/bulma.css';
import 'font-awesome/css/font-awesome.css';
import angular from 'angular';
import uirouter from 'angular-ui-router';
import {routing, stateTransition} from './app.config';

import navbar from '../directives/navbar';
import auth from '../services/auth.service';

import login from '../features/login';
import about from '../features/about';
import signup from '../features/signup';
import home from '../features/home';


let app = () => {
  return {
    template: require('./app.jade'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor() {}
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [
    uirouter,
    auth,
    login,
    about,
    signup,
    home,
    navbar
  ])
  .config(routing)
  .directive('app', app)
  .controller('AppCtrl', AppCtrl)
  .run(stateTransition);

export default MODULE_NAME;