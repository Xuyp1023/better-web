/**=========================================================
 *基金-资产信息
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('p.fund.info.fundInfo', MainController);

    MainController.$inject = ['$scope','BtUtilService','configVo'];
    function MainController($scope,BtUtilService,configVo) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {

            // 初始化申购机构
            BtUtilService
                .post(configVo.BTServerPath.QUERY_BALANCE,{custNo:''})
                .then(function(jsonData){
                    if(jsonData.code === 200){
                        $scope.fundAllInfo = jsonData.data;
                    }
                });

        } // 初始化结束
    }

})();
