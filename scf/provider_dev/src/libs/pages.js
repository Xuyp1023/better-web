/**
 * Angularjs环境下分页组件
 * name: pages
 * Version: 1.0.0
 * Author herb
 */

define(function(require,exports,module){
    var tipbar = require("./tooltip");

    angular.module('pagination',[]).directive('btPagination',[function(){
        return {
            restrict: 'EA',
            transclude:true,
            template: 
                        '<div id="fund_list_page" class="Spage Spage_blue" style="padding:10px">'+
                          '<ul>'+
                            '<li class="previous hidden" ng-show="conf.pageNum<=1"><span>首页</span></li>'+
                            '<li class="previous" ng-show="conf.pageNum>1" ng-click="pageEmitter.firstPage()"><a href="#">首页</a></span></li>'+
                            '<li class="previous hidden" ng-show="conf.pageNum<=1"><span>上一页</span></li>'+
                            '<li class="previous" ng-show="conf.pageNum>1" ng-click="pageEmitter.prevPage()"><a href="#">上一页</a></li>'+
                            '<li class="next hidden" ng-show="conf.pageNum>=conf.pages"><span>下一页</span></li>'+
                            '<li class="next" ng-show="conf.pageNum<conf.pages" ng-click="pageEmitter.nextPage()"><a href="#">下一页</a></li>'+
                            '<li class="next hidden" ng-show="conf.pageNum>=conf.pages"><span>尾页</span></li>'+
                            '<li class="next" ng-show="conf.pageNum<conf.pages" ng-click="pageEmitter.endPage()"><a href="#">尾页</a></li>'+
                            '<li>共<span ng-bind="conf.pageNum"></span>/<span ng-bind="conf.pages"></span>页</li>'+
                            '<li>共<span ng-bind="conf.total"></span>条记录</li>'+
                            '<li class="toPage">'+
                                '<div>'+
                                  '<span>跳转到&nbsp;</span>'+
                                  '<input type="text"  ng-model="conf.skipToNum" name="skipToPageNum" ng-disabled="conf.pages<=1">'+
                                  '<span>&nbsp;页</span>'+
                                  '<button class="btn" ng-disabled="conf.pages<=1" ng-click="pageEmitter.skipPage($event)">跳转</button>'+
                                '</div>'+
                            '</li>'+
                          '</ul>'+
                        '</div>',
            replace: true,
            //分页参数配置
            scope: {
                conf: '=conf'
            },
            link: function(scope, element, attrs){

                //预跳转页数
                scope.conf.skipToNum = '';

                scope.pageEmitter={
                    //分页事件
                    firstPage : function(){
                        scope.conf.pageNum=1;
                    },
                    endPage : function(){
                        scope.conf.pageNum=scope.conf.pages;
                    },
                    prevPage : function(){
                        scope.conf.pageNum--;
                    },
                    nextPage : function(){
                        scope.conf.pageNum++;
                    },
                    skipPage : function(event){
                        var num = scope.conf.skipToNum;
                        if(isNaN(num)||num.split('.').length>1||Number(num)<1||Number(num)>scope.conf.pages){
                            scope.conf.skipToNum = '';
                            tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000);
                            return;
                        }
                        scope.conf.pageNum = scope.conf.skipToNum;
                        scope.conf.skipToNum = '';
                    }
                };

            }


        };
    }]);

});