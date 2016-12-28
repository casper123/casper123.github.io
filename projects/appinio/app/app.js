'use strict';

var appinioApp;
var appinioController;
var appinioService;

appinioController = angular.module('main.controller',[]);
appinioService = angular.module('main.service',[]);

appinioApp = angular.module('appinioApp', [
  // load your modules here
  'main', // starting with the main module
]);
