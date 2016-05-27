import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './about.routes';
import AboutController from './about.controller';
// import randomNames from '../../services/randomNames.service';


export default angular.module('app.about', [uirouter/*, randomNames*/])
  .config(routing)
  .controller('AboutController', AboutController)
  .name;