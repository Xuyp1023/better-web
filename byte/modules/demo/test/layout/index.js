/**=========================================================
 * 测试类-布局控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.test.layout', MainController);

    MainController.$inject = ['$scope', 'BtUtilService','configVo'];
    function MainController($scope, BtUtilService,configVo) {

        activate();

        BtUtilService
            .get(configVo.BTServerPath.Test_Query_Pages)
            .then(function(jsonData){
                $scope.rowDatas = jsonData.data;
            });

        ////////////////
        //初始化方法开始
        function activate() {

        } // 初始化结束
    }

})();
