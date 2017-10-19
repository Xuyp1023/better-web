/**
 * Angularjs环境下分页组件
 * name: pages
 * Version: 1.0.0
 * Author herb
 */

define(function(require,exports,module){
    var tipbar = require("tooltip");

    angular.module('pagination',[]).directive('btPagination',['$parse',function($parse){
        return {
            restrict: 'EA',
            transclude:true,
            template: 
                        '<div id="fund_list_page" class="Spage Spage_blue" style="padding:10px">'+
                          '<ul>'+
                            '<li class="previous hidden" ng-show="conf.pageNum<=1"><span>首页</span></li>'+
                            '<li class="previous" ng-show="conf.pageNum>1" ng-click="pageEmitter.firstPage()"><a href="javascript:void(0);">首页</a></span></li>'+
                            '<li class="previous hidden" ng-show="conf.pageNum<=1"><span>上一页</span></li>'+
                            '<li class="previous" ng-show="conf.pageNum>1" ng-click="pageEmitter.prevPage()"><a href="javascript:void(0);">上一页</a></li>'+
                            '<li class="next hidden" ng-show="conf.pageNum>=conf.pages"><span>下一页</span></li>'+
                            '<li class="next" ng-show="conf.pageNum<conf.pages" ng-click="pageEmitter.nextPage()"><a href="javascript:void(0);">下一页</a></li>'+
                            '<li class="next hidden" ng-show="conf.pageNum>=conf.pages"><span>尾页</span></li>'+
                            '<li class="next" ng-show="conf.pageNum<conf.pages" ng-click="pageEmitter.endPage()"><a href="javascript:void(0);">尾页</a></li>'+
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
                conf: '=conf',
                func: '&func'
            },
            link: function(scope, element, attrs){
                
                
                //预跳转页数
                scope.conf.skipToNum = '';

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
                    skipPage : function(event){
                        var num = scope.conf.skipToNum;
                        if(isNaN(num)||num.split('.').length>1||Number(num)<1||Number(num)>scope.conf.pages){
                            scope.conf.skipToNum = '';
                            tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000,9999);
                            return;
                        }
                        scope.conf.pageNum = scope.conf.skipToNum;
                        scope.conf.skipToNum = '';
                        reFreshBindList();
                    }
                };

                //监听
                // scope.$watch('conf.pageNum', function(newValue,oldValue){
                //     if(newValue && newValue!==oldValue){

                //     }
                // });

            }


        };
    }]).directive('btPaginationx',['$parse',function($parse){
        return {
            restrict: 'EA',
            transclude:true,
            template: 
                        '<div id="fund_list_page" class="Spage Spage_blue" style="padding:10px 0">'+
                          '<ul style="margin-left: 0px;margin-right: 0px;">'+
                            '<li class="previous hidden" ng-show="conf.pageNum<=1"><span>首页</span></li>'+
                            '<li class="previous" ng-show="conf.pageNum>1" ng-click="pageEmitter.firstPage()"><a href="javascript:void(0);">首页</a></span></li>'+
                            '<li class="previous hidden" ng-show="conf.pageNum<=1"><span>上一页</span></li>'+
                            '<li class="previous" ng-show="conf.pageNum>1" ng-click="pageEmitter.prevPage()"><a href="javascript:void(0);">上一页</a></li>'+
                            '<li class="next hidden" ng-show="conf.pageNum>=conf.pages"><span>下一页</span></li>'+
                            '<li class="next" ng-show="conf.pageNum<conf.pages" ng-click="pageEmitter.nextPage()"><a href="javascript:void(0);">下一页</a></li>'+
                            '<li class="next hidden" ng-show="conf.pageNum>=conf.pages"><span>尾页</span></li>'+
                            '<li class="next" ng-show="conf.pageNum<conf.pages" ng-click="pageEmitter.endPage()"><a href="javascript:void(0);">尾页</a></li>'+
                            '<li>共<span ng-bind="conf.pageNum"></span>/<span ng-bind="conf.pages"></span>页</li>'+
                            '<li>共<span ng-bind="conf.total"></span>条记录</li>'+
                            '<li class="toPage" style="margin-left: 0px;margin-right: 0px;">'+
                                '<div>'+
                                  '<span>每页&nbsp;</span><select ng-model="conf.pageSize" ng-change="pageEmitter.setPages($event)" ng-options="size for size in pageSizeList"></select>'+
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
                conf: '=conf',
                func: '&func',
                funcx: '&funcx'
            },
            link: function(scope, element, attrs){
                
                scope.pageSizeList = [10,20,50,100];
                //预跳转页数
                scope.conf.skipToNum = '';

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
                    skipPage : function(event){
                        var num = scope.conf.skipToNum;
                        if(isNaN(num)||num.split('.').length>1||Number(num)<1||Number(num)>scope.conf.pages){
                            scope.conf.skipToNum = '';
                            tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000,9999);
                            return;
                        }
                        scope.conf.pageNum = scope.conf.skipToNum;
                        scope.conf.skipToNum = '';
                        reFreshBindList();
                    },
                    setPages : function(){
                        scope.conf.pageNum=1;
                        var func = attrs.funcx;
                        $parse(attrs.funcx)(scope.$parent);
                    }
                };

                //监听
                // scope.$watch('conf.pageNum', function(newValue,oldValue){
                //     if(newValue && newValue!==oldValue){

                //     }
                // });

            }


        };
    }]).directive('btSearch', ['$timeout','http','$compile','$document','$parse',function($timeout,http,$compile,$document,$parse){
        var directive = {
            restrict: 'A',
            link: link
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

            scope.select = function(item){
                $parse(attrs.ngModel).assign(scope,item.orgFullName);
                $parse(attrs.refer).assign(scope,item.paySysNum);
            }

            var cpLock = false;
            element
                .bind('input propertychange',function () {
                    if (!cpLock) {
                        searchAndShow(getElementVaule());
                    }
                });

            element
                .bind('compositionstart',function () {
                    cpLock = true;
                });

            element
                .bind('compositionend',function () {
                    cpLock = false;
                    searchAndShow(getElementVaule());
                });

            element
                .bind('click', function (e) { e.stopPropagation(); })
                .bind('click',function (e) {
                    searchAndShow(getElementVaule());
                    if(downdEle.hasClass('bt-hidden')){
                        downdEle.removeClass('bt-hidden');
                        $timeout(function(){
                            $document.bind('click', closeDropdown);
                        },1);
                    }
                });

            var timeout;
            function searchAndShow(value){
                if(timeout) $timeout.cancel(timeout);
                timeout = $timeout(function(){
                    // 请求后台
                    http
                        .post((attrs.btSearch || 'server/http/test/test-input-search.json'),{bankName:value})
                        .success(function(jsonData){
                            if(jsonData.code !== 200) return;
                            scope.$apply(function(){
                                scope.listData = jsonData.data;
                            });
                            
                        });
                },100);
                return timeout;
            }

            function getElementVaule() {
                var value = element[0].value;
                if(value) return value;
                var options= $("#"+attrs.referId+" option:selected")
                return options.text();
            }

            function closeDropdown(){
                downdEle.addClass('bt-hidden');
                $document.unbind('click', closeDropdown);
            }
            
        }
    }]);

});