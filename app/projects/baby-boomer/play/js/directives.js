'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

angular.module('myApp.directives', []).
  directive('body', function() {
  return {
		restrict: 'EA',
		transclude: 'true',
		template: '<div><ul class="clist" ng-transclude></ul>',
		link: function (scope, element, attrs) {
            Hamster(element[0]).wheel(function(event, delta, deltaX, deltaY){
                event.preventDefault();
            });
		}
	};
});