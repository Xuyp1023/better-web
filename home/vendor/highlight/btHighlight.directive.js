/**=========================================================
 * 高亮显示的指令
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('btHighlight', btHighlight);

    btHighlight.$inject = [];
    function btHighlight() {

        var directive = {
            restrict: 'A',
            link: link,
            scope:{
            }
        };

        function link(scope, element, attrs,controller){

            hljs.highlightBlock(element[0].firstElementChild);
        }
        return directive;
    }
})();
