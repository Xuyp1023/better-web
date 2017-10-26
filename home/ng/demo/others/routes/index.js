/**=========================================================
 * 测试类-布局控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.test.routes', MainController);

    MainController.$inject = ['$scope', 'BtUtilService','configVo'];
    function MainController($scope, BtUtilService,configVo) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {


            $scope.open = function(){
                BtUtilService.open({templateUrl:'modules/demo/test/routes/hello.html',scope:$scope});
            };

            $scope.open1 = function(){
                BtUtilService.open({templateUrl:'modules/demo/test/routes/hello1.html',scope:$scope});
            };

            $scope.open2 = function(){
                BtUtilService.open({templateUrl:'modules/demo/test/routes/hello1.html',scope:$scope},function(){
                    BtUtilService.close({closeIndex:-1});
                });
            };
            

            $scope.testGo = function(){
                BtUtilService.go('demo/test/button',{name:11,test:22});
            };

        } // 初始化结束
    }

})();
