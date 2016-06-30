import angular from 'angular';

function fileModel($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      let model       = $parse(attrs.fileModel);
      let modelSetter = model.assign;

      element.bind('change', function(){
          scope.$apply(function(){
              modelSetter(scope, element[0].files[0]);
          });
      });
    }
  };
}

fileModel.$inject = ['$parse'];

export default angular.module('directives.fileModel', [])
  .directive('fileModel', fileModel)
  .name;