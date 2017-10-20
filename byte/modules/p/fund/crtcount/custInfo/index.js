/**=========================================================
 * 基金-企业信息
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('p.fund.crtcount.custInfo', MainController);

    MainController.$inject = ['$scope','BtUtilService','configVo','BtTipbar'];
    function MainController($scope,BtUtilService,configVo,BtTipbar) {

        activate();

        // 刷新交易账户列表
        BtUtilService
            .post(configVo.BTServerPath.TRADE_ACCOUNT_LIST)
            .then(function(jsonData){
                if(jsonData.code === 200){
                    $scope.TRADE_ACCOUNT_LIST = jsonData.data;
                }
            });

        reFreshCustInfo();

        ////////////////
        //初始化方法开始
        function activate() {

            $scope.reFreshCustInfo = reFreshCustInfo;

            $scope.modifyCustInfo = function($event){

                var formBasic = $scope.formBasic.getValid()
                var formRelative = $scope.formRelative.getValid()
                if(!formBasic){
                    BtTipbar.tipbarWarning($event.target,'基本资料表单有错误');
                    console.log($scope.custInfo.personCount);
                    return;
                }else if(!formRelative){
                    BtTipbar.tipbarWarning($event.target,'相关资料表单有错误');
                    return;
                }

                BtUtilService
                    .post(configVo.BTServerPath.UPDATE_OpenedAccount,$scope.custInfo)
                    .then(function(jsonData){
                        if(jsonData.code === 200){
                            reFreshCustInfo();
                            BtTipbar.pop('success','提示信息','修改成功');
                        }
                    });
            };

            $scope.resetForm = function(){
                reFreshCustInfo();
            }

            $scope.BTDict = {
                RegCapitalRang:BTDict.RegCapitalRang.toArray(),
                InvestCorpVocate:BTDict.InvestCorpVocate.toArray(),
                OrganizationType:BTDict.OrganizationType.toArray(),
                EnterpriseNature:BTDict.EnterpriseNature.toArray()
            }

            $scope.formBasic = configVo.formBasic;
            $scope.formRelative = configVo.formRelative;

        } // 初始化结束

        function reFreshCustInfo() {
            // 初始化企业信息
            BtUtilService
                .post(configVo.BTServerPath.QUERY_ContacInfo,{custNo:$scope.partmentId || ''})
                .then(function(jsonData){
                    if(jsonData.code === 200){
                        $scope.custInfo = jsonData.data;
                    }
                });
            //初始化已开户基金公司
            BtUtilService
                .post(configVo.BTServerPath.QUERY_OpenedAccount,{custNo:$scope.partmentId || ''})
                .then(function(jsonData){
                    if(jsonData.code === 200){

                        $scope.existsFundCompBind = BTDict.SaleAgency.get(jsonData.data.fund);
                        $scope.existsScfCompBind = BTDict.ScfAgencyGroup.get(jsonData.data.scf);
                        $scope.existsMoneyCompBind = BTDict.SaleAgency.get(jsonData.data.money);
                    }
                });
        }
    }

})();
