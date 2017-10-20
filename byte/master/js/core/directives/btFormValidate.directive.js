/**=========================================================
 * form表单验证的指令
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('btFormValidate', btFormValidate)
        ;

    btFormValidate.$inject = ['$parse', 'BtValidate','$compile'];
    function btFormValidate($parse, BtValidate,$compile) {

        var directive = {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs,controller){

            var formParams = $parse(attrs.btFormValidate)(scope) || {};
            if(!formParams) return;

            var formEles = BtValidate.getFormEles(element);

            formParams.validateInput = function(name, type){

                if(!formEles[name]) return false;
                var element = formEles[name].element;
                var inputDirty = (element.className.indexOf('ng-dirty') !== -1);
                var inputValid = true;
                if(type){
                    inputValid = (element.className.indexOf('ng-invalid-'+ type) !== -1);
                }else{
                    inputValid = (element.className.indexOf('ng-invalid') !== -1);
                }

                if((formParams.dirty || inputDirty) && inputValid){
                    return true;
                }else{
                    return false;
                }
            }

            formParams.getValid = function(){

                if(!formParams.dirty) formParams.dirty = true;
                element.addClass('bt-dirty');
                if(validateForm()){
                    return true;
                }else{
                    return false;
                }
            }

            function validateForm(){

                var result = true;
                angular.forEach(formEles,function(value, key){
                    if(value.element.className.indexOf('ng-invalid') !== -1){
                        result = false;
                    }
                });
                return result;
            }
            
        }
        return directive;
    }
})();
/**=========================================================
 *  1、非view层的修改model需要在input框中添加ng-dirty的class
    2、ng-model属性的才能进行表单验证
 =========================================================*/
