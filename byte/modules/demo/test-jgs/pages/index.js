/**=========================================================
 * 测试类-布局控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.test-jgs.pages', MainController);

    MainController.$inject = ['$scope', 'BtUtilService','$q'];
    function MainController($scope, BtUtilService,$q) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {

            /*$scope.test=function(){
                BtPopInfo.propmpt('添加产品成功!',{});
            }*/

           


        } // 初始化结束
        //分页数据
        $scope.listPage = {
            pageNum: 1,
            pageSize: 5,
            pages: 1            
        };   
    }

})();