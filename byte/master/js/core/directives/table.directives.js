(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('btTable', btTable) //表格控件的指令
        .controller('BulmaTableController',BulmaTableController)
        ;

    BulmaTableController.$inject = ['$scope','TableService'];
    function BulmaTableController ($scope,TableService) {

    }

    btTable.$inject = ['$compile','$parse','TableService'];
    function btTable ($compile,$parse,TableService) {

    	var directive = {
            restrict: 'A',
            link: link,
            scope:{
                tableParams:'=btTable'
            },
            controller: 'BulmaTableController'
        };
        return directive;

        function link(scope, element, attrs,controller){


            activate();

            //给table注册api
            //设置分页查询功能的接口
            //设置改变数据功能的接口

            function activate() {

                var headCheck;

                //如果表格配置参数不存在
                var tableParams = scope.tableParams;
                if(!tableParams) return;

                tableParams.tableName = attrs.btTable;
                var tableElement = angular.element('<table class="bt-table"></table>');
                var tableParent = angular.element('<div></div>');
                tableParent.append(tableElement);
                element.append(tableParent);

                var templateHeader = tableParams.rowSelection ? '<th class="header-check"><input type="checkbox" class="bt-table-check"></th>':'';
                tableParams.tmpTdElement = tableParams.rowSelection ? '<td><input type="checkbox" class="bt-table-check"></td>':'';
                angular.forEach(tableParams.cols ,function(row){
                    templateHeader += '<th width='+row.width+'>'+ row.title +'</th>';
                });
                //添加表头文件
                tableElement.prepend('<thead class="bt-table-header"><tr>'+ templateHeader +'</tr></thead>');

                //开始处理表体文件
                var templateBody = angular.element('<tbody class="bt-table-body"></tbody>');
                //如果数据存在，则初始化表格数据
                if(tableParams.rowData){
                    TableService.setRowData(tableParams ,templateBody);
                }
                tableElement.append(templateBody);
                // 提供给外部一个改变表格数据的方法
                tableParams.setRowData = function(rowData){
                    tableParams.rowData = rowData;
                    TableService.setRowData(tableParams ,templateBody,headCheck);
                };

                // 头部复选框事件
                if(tableParams.rowSelection){

                    var trList = tableElement[0].getElementsByTagName("tr");
                    headCheck = trList[0].firstChild.firstChild;
                    angular
                        .element(headCheck)
                        .on('click',function(){

                            var trList = tableElement[0].getElementsByTagName("tr");
                            if(headCheck.checked){
                                for (var i = trList.length - 1; i > 0; i--) {
                                    trList[i].firstChild.firstChild.checked = true;  
                                }
                            }else{
                                for (var i = trList.length - 1; i > 0; i--) {
                                    trList[i].firstChild.firstChild.checked = false;  
                                }
                            }
                        });
                    // 获取列表的选择的数据，返回[{},{}] 或 [key,key]
                    tableParams.getRowSelection = function(key){
                        var result = [];
                        // 遍历table元素
                        var trList = tableElement[0].getElementsByTagName("tr");
                        for (var i = trList.length - 1; i > 0; i--) {
                            if(trList[i].firstChild.firstChild.checked){
                                if(key){
                                    result.push(eval('tableParams.rowData[i-1].'+key));
                                }else{
                                    result.push(tableParams.rowData[i-1]);
                                }
                            }
                        }
                        return result;
                    };
                }

                //添加分页查询的条件
                if(tableParams.paginationControls){
                    var tmpPageElement = angular.element('<div class="bt-search-page"></div>');
                    element.append(tmpPageElement);

                    tmpPageElement.on('click',function(e){
                        //分页查询按钮点击事件
                        if(e.target.nodeName == 'BUTTON'){
                            var aElement = angular.element(e.target);

                            var tmpPageNum = tableParams.pageNum;
                            if(aElement.hasClass('pagination-link')){//具体的分页数
                                tmpPageNum = parseInt(aElement.text());
                            }else if(aElement.hasClass('pagination-previous')){//上一页
                                tmpPageNum--;
                            }else if(aElement.hasClass('pagination-next')){//下一页
                                tmpPageNum++;
                            }
                            if(tmpPageNum != tableParams.pageNum){
                                tableParams.pageNum = tmpPageNum;
                                TableService.searchRowData(tableParams ,tmpPageElement ,templateBody,headCheck);
                            }
                        }
                    });
                    
                    tableParams.setDatasource = function(params){

                        tableParams.pageNum = tableParams.initPageNum || 1;
                        tableParams.pageSize = tableParams.initPageSize || 10;

                        tableParams.queryVo = params.queryVo;
                        tableParams.searchUrl = params.searchUrl;

                        TableService.searchRowData(tableParams ,tmpPageElement ,templateBody,headCheck);
                    }

                    // 专门用来删除或修改后的刷新操作
                    tableParams.refreshSource = function(){
                        TableService.searchRowData(tableParams ,tmpPageElement ,templateBody,headCheck);
                    }

                }

                // 通知，表格控件已经初始化完成
                if(tableParams.initOver){
                    tableParams.initOver.resolve();
                }
                
            }
        	
        }
    }
})();