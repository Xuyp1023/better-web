/**=========================================================
 * 测试类-布局控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.test.query', MainController);

    MainController.$inject = ['$scope', 'BtUtilService', 'configVo','BtTipbar','$timeout','$q'];
    function MainController($scope, BtUtilService, configVo,BtTipbar,$timeout,$q) {

        activate();

        BtUtilService
            .get(configVo.BTServerPath.Test_Query_Pages)
            .then(function(jsonData){
                $timeout(function(){
                    $scope.tableParams1.setRowData(jsonData.data);
                },1);
            });

        BtUtilService
            .get(configVo.BTServerPath.Test_Query_Pages)
            .then(function(jsonData){
                $scope.rowDatas = jsonData.data;
            });

        //初始化方法开始
        function activate() {

            $scope.testClick = function(id){
                alert(id);
            };
            $scope.testGet = function(){
                console.log($scope.tableParams.getRowSelection('item.id'));
            }
            $scope.deleteItem = function(item,$event){
                BtTipbar
                    .tipbarDialog($event.target,'您是否确定删除该'+item.code+'吗？')
                    .then(function(){
                        alert('点击了确认按钮')
                    },function(error){});
            };

            
            $scope.tableParams = {
                parentScope:$scope,
                rowSelection:true,
                paginationControls:true,
                cols:[
                    {
                        title:'账单号码',
                        type:'template',
                        cellTemplate:'<a class="bt-table-button" ng-click="testClick({{item.id}})">{{code}}</a>',
                        width:'30%'
                    },{
                        title:'对账日期',
                        field:'start',
                        width:'15%'
                    },{
                        title:'账单金额',
                        field:'money',
                        filter:'money',
                        width:'20%'
                    },{
                        title:'状态',
                        field:'status',
                        filter:'status',
                        width:'15%'
                    },{
                        title:'操作',
                        type:'buttons',
                        width:'20%',
                        config:[{title:'查看详情'},{title:'删除'}]
                    }
                ],initOver: $q.defer(),
                rowIsOnOrOff:function(item){
                    return (item.status == 1);
                }
            };

            $scope.tableParams.initOver
                .promise.then(function (params) {
                    // 查询按钮事件
                    $scope.queryList = function($event){
                        $scope.tableParams.setDatasource({searchUrl:configVo.BTServerPath.Test_Query_Pages});
                    }

                    $scope.queryList();
                });

            $scope.tableParams1 = {
                parentScope:$scope,
                rowSelection:true,
                cols:[
                    {
                        title:'账单号码',
                        type:'template',
                        cellTemplate:'<a class="bt-table-button">{{code}}</a>',
                        width:'30%'
                    },{
                        title:'对账日期',
                        field:'start',
                        width:'15%'
                    },{
                        title:'账单金额',
                        field:'money',
                        filter:'money',
                        width:'20%'
                    },{
                        title:'状态',
                        field:'status',
                        filter:'status',
                        width:'15%'
                    },{
                        title:'操作',
                        type:'buttons',
                        width:'20%',
                        config:[{title:"查看详情",show:"row.status =='1'",event:'lookDetail'},{title:'删除',show:"row.status =='2'",event:'deleteItem'}]
                    }
                ]
            };

        } // 初始化结束
    }

})();
