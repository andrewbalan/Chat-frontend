import angular from 'angular';
import uirouter from 'angular-ui-router';

import ngEnter from '../../directives/ngEnter';

import './home.styl';
import routing from './home.routes';
import HomeController from './home.controller';

import chat from '../../services/chat.service';
import io from '../../services/io.service';
import auth from '../../services/auth.service';

export default angular.module('app.home', [
    uirouter,
    chat,
    io,
    auth,
    ngEnter
  ])
  .config(routing)
  .controller('HomeController', HomeController)
  .name;