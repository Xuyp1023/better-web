/**=========================================================
 * scf-签约管理
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('scf.sign.manger', MainController);

    MainController.$inject = ['$scope', 'BtUtilService', 'configVo','BtTipbar','$timeout'];
    function MainController($scope, BtUtilService, configVo,BtTipbar,$timeout) {
        // VM绑定区域

        // 初始化合同下拉列表字典数据
        $scope.auditStatusList = BTDict.ContractStamperBusinStatus.toArray('value','name');
        // 初始化查询条件
        $scope.searchData={
            GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
            LTEregDate:new Date().format('YYYY-MM-DD'),
            type:$scope.auditStatusList[0].key
        }
        // 数据测试
        $scope.rowDatas=[{code:'1956234656'},{code:'12345785421'}];

        //分页数据
        $scope.listPage = {
            pageNum: 1,
            pageSize: 10,
            pages: 1,
            total: 1
        }; 

        BtUtilService
            .post(configVo.BTServerPath.Query_Company_List)
            .then(function(jsonData){
                $scope.companyList = jsonData.data;
                $scope.searchData.factorNo=$scope.companyList[0].key;
        }); 

        $scope.queryList=function(flag){
            BtUtilService
            .post(configVo.BTServerPath.Query_Sign_List)
            .then(function(jsonData){
                $scope.rowDatas = jsonData.data;
                if(flag){
                    $scope.listPage=jsonData.page;
                }                
            });
        }
        activate();
        function activate(){

        }

         /*BtUtilService
            .get(configVo.BTServerPath.Query_Sign_List)
            .then(function(jsonData){
                $timeout(function(){
                    $scope.tableParams1.setRowData(jsonData.data);
                });
            });

        BtUtilService
            .get(configVo.BTServerPath.Query_Sign_List)
            .then(function(jsonData){
                $scope.rowDatas = jsonData.data;
            });
       */
        
    }

})();
