/**=========================================================
 * 分页组件的指令
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('jgsPagation', jgsPagation);

    jgsPagation.$inject = ['$parse', 'BtUtilService','$timeout'];
    function jgsPagation($parse, BtUtilService,$timeout) {

        return {
            restrict:'A',
            transclude:true,
            replace: true,
            template:'<ul class="pagination">'+
                        '<li class="first" ng-class="disabled:conf.pageNum<=1">'+
                            '<a href="javascript:;">First</a>'+
                        '</li>'+
                        '<li class="prev" ng-class="disabled:conf.pageNum<=1">'+
                            '<a href="javascript:;">Previous</a>'+
                        '</li>'+
                        '<li class="page">'+
                            '<a href="javascript:;">1</a>'+
                        '</li>'+
                        '<li class="page">'+
                            '<a href="javascript:;">2</a>'+
                        '</li>'+
                        '<li class="page">'+
                            '<a href="javascript:;">3</a>'+
                        '</li>'+
                        '<li class="page">'+
                            '<a href="javascript:;">4</a>'+
                        '</li>'+
                        '<li class="page">'+
                            '<a href="javascript:;">5</a>'+
                        '</li>'+
                        '<li class="next ">'+
                            '<a href="javascript:;">Next</a>'+
                        '</li>'+
                        '<li class="last">'+
                            '<a href="javascript:;">Last</a>'+
                        '</li>'+
                     '</ul>',   
            scope:{
                conf: '=conf',
                func: '&func'
            },
            link:function(scope, element, attrs){

                function reFreshBindList(){
                    var func = attrs.func;
                    var pageFunc = $parse(func);
                    pageFunc(scope.$parent);
                }

                scope.pageEmitter={
                    //分页事件
                    firstPage : function(){
                        scope.conf.pageNum=1;
                        reFreshBindList();
                    },
                    endPage : function(){
                        scope.conf.pageNum=scope.conf.pages;
                        reFreshBindList();
                    },
                    prevPage : function(){
                        scope.conf.pageNum--;
                        reFreshBindList();
                    },
                    nextPage : function(){
                        scope.conf.pageNum++;
                        reFreshBindList();
                    },
                    tabPage : function(e){
                        
                    }

                }
            }
        };
    }
})();
