(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('btSearch', btSearch) // 搜索
        ;

    btSearch.$inject = ['$timeout','BtUtil','$compile','$document'];
    function btSearch ($timeout,BtUtil,$compile,$document) {

        var directive = {
            restrict: 'A',
            link: link,
            scope:{
                selectData:'=ngModel',
                reqUrl:'@btSearch'
            }
        };
        return directive;

        function link(scope, element, attrs,controller){

            var downdHtml = '<div class="bt-hidden bt-search-downdrop">'+
                            '<li ng-repeat="item in listData" ng-click="select(item)">'+
                            '<span ng-bind="item.orgFullName"></span>'+
                            '</li>'+
                            '</div>';
            var downdEle =  angular.element(downdHtml);
            $compile(downdEle)(scope);
            element.after(downdEle);

            searchAndShow();

            scope.select = function(item){
                scope.selectData = item.orgFullName;
            }

            var cpLock = false;
            element
                .on('input propertychange',function () {
                    if (!cpLock) {
                        searchAndShow(element[0].value);
                    }
                });

            element
                .on('compositionstart',function () {
                    cpLock = true;
                });

            element
                .on('compositionend',function () {
                    cpLock = false;
                    searchAndShow(element[0].value);
                });

            element
                .on('click', function (e) { e.stopPropagation(); })
                .on('click',function (e) {
                    if(downdEle.hasClass('bt-hidden')){
                        downdEle.removeClass('bt-hidden');
                        $timeout(function(){
                            $document.on('click', closeDropdown);
                        },1);
                    }
                });

            var timeout;
            function searchAndShow(value){
                if(timeout) $timeout.cancel(timeout);
                timeout = $timeout(function(){
                    // 请求后台
                    BtUtil
                        .post([(scope.reqUrl || 'server/http/test/test-input-search.json')],{value:value})
                        .then(function(jsonData){
                            scope.listData = jsonData.data;
                        });
                },100);
                return timeout;
            }

            function closeDropdown(){
                downdEle.addClass('bt-hidden');
                $document.off('click', closeDropdown);
            }
            
        }
    }
})();