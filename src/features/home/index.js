import angular from 'angular';
import uirouter from 'angular-ui-router';

import ngEnter from '../../directives/ngEnter';
import filemodel from '../../directives/filemodel';

import './home.styl';
import routing from './home.routes';
import HomeController from './home.controller';

import io from '../../services/io.service';
import ioStream from '../../services/ioStream.service';
import auth from '../../services/auth.service';

export default angular.module('app.home', [
    uirouter,
    io,
    ioStream,
    auth,
    ngEnter,
    filemodel
  ])
  .config(routing)
  .controller('HomeController', HomeController)
  .name;