/**=========================================================
 * 测试类-布局控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('core.flow.define', MainController);

    MainController.$inject = ['$scope','BtUtilService','configVo'];
    function MainController($scope,BtUtilService,configVo) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {

            $scope.searchData = {
                custNo:'1'
            };

            $scope.query = function(){
                $scope.tableParams.setDatasource({searchUrl:configVo.BTServerPath.Test_Query_Pages});
            }

            $scope.tableParams = {
                // parentScope:$scope,
                paginationControls:true,
                cols:[
                    {
                        title:'流程名称',
                        field:'sdfsf',
                        width:'40%'
                    },{
                        title:'最新版本',
                        field:'start',
                        width:'20%'
                    },{
                        title:'操作',
                        type:'buttons',
                        width:'40%',
                        config:[{title:"查看详情",show:"row.status =='1'",event:'lookDetail'},{title:'删除',show:"row.status =='2'",event:'deleteItem'}]
                    }
                ]
            };

        } // 初始化结束
    }

})();
