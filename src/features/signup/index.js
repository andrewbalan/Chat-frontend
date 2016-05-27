import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './signup.routes';
import SignupController from './signup.controller';
import auth from "../../services/auth.service.js";

export default angular.module('app.signup', [uirouter, auth])
  .config(routing)
  .controller('SignupController', SignupController)
  .name;