/**=========================================================
 * 表单效验的服务
 =========================================================*/
 (function() {
  'use strict';

  angular
      .module('app.core')
      .service('BtValidate', BtValidate);

  BtValidate.$inject = ['$timeout','BtRouterService','$parse','BtTipbar','$q'];
  function BtValidate($timeout,BtRouterService,$parse,BtTipbar,$q) {

      this.getFormEles = function(element){

          var formEles = {};

          var children = element[0].getElementsByTagName('*');
          var elements = new Array();
          for (var i = 0; i < children.length; i++) {
              var child = children[i];
              var eleValue = child.getAttribute('ng-model');
              if(eleValue && (child.getAttribute('required') === "" || 
                  child.getAttribute('ng-maxlength') || 
                  child.getAttribute('bt-pattern')) ){
                  formEles[eleValue] = {element:child};
              }
          }
          return formEles;
      }

}
})();