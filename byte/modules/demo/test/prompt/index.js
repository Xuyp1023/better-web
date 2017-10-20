/**=========================================================
 * 测试类-布局控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('test.prompt', MainController);

    MainController.$inject = ['$scope', 'BtUtilService','BtPopInfo','$q'];
    function MainController($scope, BtUtilService,BtPopInfo,$q) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {

            $scope.test=function(){
                BtPopInfo.propmpt('添加产品成功!',{});
            }

           


        } // 初始化结束
    }

})();