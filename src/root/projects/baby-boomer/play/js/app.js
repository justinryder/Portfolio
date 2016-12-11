'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/menu', {templateUrl: 'partials/menu.html', controller: 'MenuCtrl'})
  .when('/game', {templateUrl: 'partials/game.html', controller: 'GameCtrl'})
  .when('/highscores', {templateUrl: 'partials/highscores.html', controller: 'HighScoresCtrl'})
  .when('/credits', {templateUrl: 'partials/credits.html', controller: 'CreditsCtrl'})
  .otherwise({redirectTo: '/menu'});
}]);
