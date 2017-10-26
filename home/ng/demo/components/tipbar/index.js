/**=========================================================
 * 测试类-消息提示控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.test.tipbar', MainController);

    MainController.$inject = ['$scope', 'BtUtilService','BtValidate','BtTipbar','configVo'];
    function MainController($scope, BtUtilService,BtValidate,BtTipbar,configVo) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {

            $scope.testInfo = function(){
                BtTipbar.pop('info','提示信息','测测ccccccccc11111111111111111111111111111111111111111111111111111111111111111111111111111111111111');
            };

            $scope.testError = function(){
                BtTipbar.pop('error','提示信息','测测ccccccccc11111111111111111111111111111111111111111111111111111111111111111111111111111111111111');
            };

            $scope.testSuccess = function(){
                BtTipbar.pop('success','提示信息','测测ccccccccc11111111111111111111111111111111111111111111111111111111111111111111111111111111111111');
            };

            $scope.testWarning = function(){
                BtTipbar.pop('warning','提示信息','测测ccccccccc11111111111111111111111111111111111111111111111111111111111111111111111111111111111111');
            };

            $scope.testBtnWarning = function($event){
                BtTipbar.tipbarWarning($event.target,'测试上所所所所');
            };

            $scope.testBtnConfirm = function($event){
                BtTipbar
                    .tipbarDialog($event.target,'您是否确定删除该项目111111111111111111111111111111吗？','sdfsd帝国时代噶十多个十大歌手的感受到')
                    .then(function(){
                        alert('点击了确认按钮')
                    },function(error){});
            };


        } // 初始化结束
    }

})();
