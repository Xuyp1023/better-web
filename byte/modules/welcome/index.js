/**=========================================================
 * 合同类-电子合同控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('welcome', MainController);

    MainController.$inject = ['$scope', 'BtUtilService'];
    function MainController($scope, BtUtilService) {

        activate();

        

        ////////////////
        //初始化方法开始
        function activate() {

            /**
             * 测试按钮点击事件
             */
            $scope.testClick = function(){
                BtUtilService
                    .cache(Api_Global_Var.BTServerPath.Query_Orders)
                    .then(function (jsonData) {
                        console.log(jsonData);
                    })
            };


        } // 初始化结束
    }

})();
