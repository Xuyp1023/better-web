/**=========================================================
 * 测试类-布局控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.test.select', MainController);

    MainController.$inject = ['$scope','BtUtilService','configVo'];
    function MainController($scope,BtUtilService,configVo) {

        activate();

        BtUtilService
            .post(configVo.BTServerPath.Query_Company_List)
            .then(function(jsonData){
                $scope.companyList = jsonData.data;
            });

        ////////////////
        //初始化方法开始
        function activate() {

            $scope.searchData = {};

            // 类型字典的数据源
            $scope.auditStatusList = BTDict.ContractTemplateAuditStatus.toArray('value','name');

            $scope.callback = function(cThis){
                var value = cThis.options[cThis.options.selectedIndex].value;
                alert(value);
            }

        } // 初始化结束
    }

})();
