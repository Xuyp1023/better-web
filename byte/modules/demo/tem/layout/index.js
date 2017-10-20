/**=========================================================
 * 测试类-布局控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.tem.layout', MainController);

    MainController.$inject = ['$scope', 'BtUtilService'];
    function MainController($scope, BtUtilService) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {

        } // 初始化结束
    }

})();
