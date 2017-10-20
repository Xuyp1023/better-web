/**=========================================================
 * 基金类-余利宝控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('p.fund.yulibao', MainController);

    MainController.$inject = ['$scope', 'BtUtilService','configVo','$interval'];
    function MainController($scope, BtUtilService,configVo,$interval) {

        activate();

        // 是否获取到了支付宝的权限
        BtUtilService
            .post(configVo.BTServerPath.Ali_Pay_Auth,{custNo:""})
            .then(function(jsonData){
                $scope.aliPayInfo = {
                    authStatus:jsonData.data.authStatus,
                    authPath:jsonData.data.authPath
                };
            });

        // 双向绑定完成之后，请求后台
        BtUtilService
            .post(configVo.BTServerPath.Query_Yuebao_BasicInfo,$scope.searchBalance)
            .then(function(jsonData){
                // 绑定基本信息显示
                $scope.basicInfo = jsonData.data;
                $scope.findFundDay();
            });

        $scope.queryDealDetail();
        $scope.queryHistoryProfit();

        ////////////////
        //初始化方法开始
        function activate() {

            // 类型字典的数据源
            $scope.auditStatusList = BTDict.YlbSaleBusinFlag.toArray('value','name');

            // 控制页面元素的vo
            $scope.pageCtrlInfo = {
                showId:'dealDetail',     //默认显示交易明细查询
                dealDetail:{},
                historyProfit:{}
            };

            $scope.searchBalance = {
                custNo:"",
                agencyNo:"ylb"
            };

            $scope.listPage = {
                pageNum: 1,
                pageSize: 10,
                pages: 1,
                total: 1
            };

            // 查询条件
            $scope.searchDetail = {
                pageSize:10,pageNum: 1,
                GTEtradeDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
                LTEtradeDate:new Date().format('YYYY-MM-DD'),
                fundCode:"001529",
                agencyNo:"ylb",
                tradeStatus:"06"
            };
            $scope.searchHistory = {
                pageSize:10,pageNum: 1,
                GTEtradeDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
                LTEtradeDate:new Date().format('YYYY-MM-DD'),
                fundCode:"001529",
                agencyNo:"ylb",
                tradeStatus:"06",
                flag:"0"
            };

            $scope.searchFundDay = {
                fundCode:"001529",
                agencyNo:"ylb"
            };

            var poll = null;
            // 轮询事件
            $scope.aliPayPoll = function(){

                poll = poll || $interval(function(){
                    BtUtilService
                        .post(configVo.BTServerPath.Ali_Pay_Auth,{custNo:""})
                        .then(function(jsonData){
                            if(jsonData.data.authStatus !=="0"){
                                $interval.cancel(poll);
                                $scope.aliPayInfo.authStatus = jsonData.data.authStatus;
                            }
                        });
                },2000);
            }

            /**
             * 选项卡点击事件
             */
            $scope.switchTabs = function(showId){
                $scope.pageCtrlInfo.showId = showId;
                BtUtilService.freshIframe();
            };

            $scope.fundDayInfo={};

            /**
             * 交易明细查询
             */
            $scope.queryDealDetail = function(){

                BtUtilService
                    .post(configVo.BTServerPath.Query_Yuebao_DealInfo,$scope.searchDetail)
                    .then(function(jsonData){
                        $scope.dealDetailList = jsonData.data;

                        refreshPages('dealDetail',jsonData.page);
                    });
            };

            /**
             * 历史收益率查询
             */
            $scope.queryHistoryProfit = function(){
                BtUtilService
                    .post(configVo.BTServerPath.Query_Yuebao_HistoryInfo,$scope.searchHistory)
                    .then(function(jsonData){
                        $scope.historyDetailList = jsonData.data;

                        refreshPages('historyProfit',jsonData.page);
                    });
            };

            /**
             * 查询最近收益年化率信息
             */
            $scope.findFundDay = function(){
                BtUtilService
                    .post(configVo.BTServerPath.Query_Yuebao_FundDays,$scope.searchFundDay)
                    .then(function(jsonData){
                        $scope.fundDayInfo = jsonData.data[0];
                    });
            };

            function refreshPages(flag,pageVo){

                $scope.pageCtrlInfo[flag].nextPage = (pageVo.pages > pageVo.pageNum );
                $scope.pageCtrlInfo[flag].prePage = (1 < pageVo.pageNum );
                BtUtilService.freshIframe();

            }


        } // 初始化结束

        // 轮询
        // function
    }

})();
