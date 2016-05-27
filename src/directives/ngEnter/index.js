import angular from 'angular';

function ngEnter() {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
}

export default angular.module('directives.ngEnter', [])
  .directive('ngEnter', ngEnter)
  .name;