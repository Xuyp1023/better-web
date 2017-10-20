/**=========================================================
 * 基金-资产信息
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('p.fund.info.fundAllInfo', MainController);

    MainController.$inject = ['$scope','BtUtilService','configVo'];
    function MainController($scope,BtUtilService,configVo) {

        activate();

        // 刷新交易账户列表
        BtUtilService
            .post(configVo.BTServerPath.TRADE_ACCOUNT_LIST)
            .then(function(jsonData){
                if(jsonData.code === 200){
                    $scope.TRADE_ACCOUNT_LIST = jsonData.data;
                }
            });

        reFreshFundAllInfoList();

        ////////////////
        //初始化方法开始
        function activate() {

            $scope.reFreshFundAllInfoList = reFreshFundAllInfoList;
            
        } // 初始化结束

        function reFreshFundAllInfoList(){
            // 初始化申购机构
            BtUtilService
                .post(configVo.BTServerPath.QUERY_BALANCE,{custNo:$scope.partmentId || ''})
                .then(function(jsonData){
                    if(jsonData.code === 200){
                        $scope.totalBind = jsonData.data.total;
                        $scope.fundHeadBind = jsonData.data.head;
                        $scope.fundDataBind = jsonData.data.fund.data;
						$scope.penguinHeadBind = jsonData.data.penguin.head;
						$scope.penguinDataBind = jsonData.data.penguin.data;
                    }
                });
        }
    }

})();
