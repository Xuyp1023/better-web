/**=========================================================
 * 测试类-消息提示控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.test.button', MainController);

    MainController.$inject = ['$scope', 'BtUtilService','BtValidate','BtTipbar','configVo'];
    function MainController($scope, BtUtilService,BtValidate,BtTipbar,configVo) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {

            $scope.testDisabled = function(){
                alert('按钮被禁用了');
            }

        } // 初始化结束
    }

})();
