/**=========================================================
 * 测试类-高亮显示控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.test.highlight', MainController);

    MainController.$inject = ['$scope','$timeout'];
    function MainController($scope,$timeout) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {


        } // 初始化结束
    }

})();
