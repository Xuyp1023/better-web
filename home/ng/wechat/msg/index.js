/**=========================================================
 * 微信类-消息控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('wechat.msg', MainController);

    MainController.$inject = ['$scope', 'BtUtilService','configVo','BtTipbar'];
    function MainController($scope, BtUtilService,configVo,BtTipbar) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {

            $scope.msgVo = {};

            // 带表单效验的提交
            $scope.basicSubmit = function($event){

                if(!$scope.formParams.getValid()) {
                    BtTipbar.tipbarWarning($event.target,'表单有错误');
                    return;
                }
                BtUtilService
                    .post('/wechat/sendMsg',$scope.msgVo)
                    .then(function(jsonData){
                        console.log(jsonData);
                    })
            };

            // form表单验证的参数设置
            $scope.formParams = configVo.formParams || {};



        } // 初始化结束
    }

})();
