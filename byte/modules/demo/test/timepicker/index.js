/**=========================================================
 * 测试类-布局控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.test.timepicker', MainController);

    MainController.$inject = ['$scope', 'BtUtilService'];
    function MainController($scope, BtUtilService) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {

            $scope.searchData = {
                GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
                LTEregDate:new Date().format('YYYY-MM-DD')
            };

        } // 初始化结束
    }

})();
