/**=========================================================
 * 字典下拉的指令
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('btDict', btDict);

    btDict.$inject = ['$parse', 'BtUtilService','$compile'];
    function btDict($parse, BtUtilService,$compile) {

        var directive = {
            restrict: 'EA',
            compile: compile,
            scope:{
                selectModel:'=ngModel'
            }
        };
        return directive;

         function compile(tElement, tAttrs, transclude){

            var btAttrs = tAttrs.$attr;

            var selectElement = angular.element('<select></select>');
            if(tAttrs['class']){
                selectElement.attr('class',tAttrs['class']);
            }
            selectElement.attr('ng-model',"selectModel");
            delete btAttrs.ngModel;
            if(btAttrs.options){//自定义下拉显示
                delete btAttrs.options;
                selectElement.attr('ng-options',btAttrs.options +" for g in selectAttr");
            }else{
                selectElement.attr('ng-options',"g.key as g.value for g in selectAttr");
            }
            angular.forEach(btAttrs,function(value,key){
                selectElement.attr(key,value);
            });
            
            return {
                pre: function(scope, iElement,iAttrs,controller){
                    if(tElement.children()){//自定义默认选项
                        selectElement.append(tElement.children());
                    }
                    var selectHtml = $compile(selectElement)(scope);
                    tElement.replaceWith(selectHtml[0]);
                },
                post: link
            }
        }

        function link(scope, element, attrs,controller){

            BtUtilService
              .cache(['server/btDict/'+attrs.btDict + '.json',attrs.url])
              .then(function(jsonData){
                    scope.selectAttr = jsonData.data;
              });
            
        }
    }
})();
