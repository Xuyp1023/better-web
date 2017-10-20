/**=========================================================
 * 测试类-布局控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.test-jgs.prompt', MainController);

    MainController.$inject = ['$scope', 'BtUtilService','BtPopInfo','$q','$timeout'];
    function MainController($scope, BtUtilService,BtPopInfo,$q,$timeout) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {

            $scope.test=function(){
                BtPopInfo.propmpt('添加产品成功!',{});                
                BtUtilService.go('demo/test-jgs/tipMsg',{});
            }           
            

            $scope.testError = function(evnet) {
                var $target = $(evnet.target);
                BtPopInfo.errorTopTipbar($target,'添加产品不成功，服务器返回505');
            }

            $scope.testLoading = function(){
                BtPopInfo.loadding();
                setTimeout(function(){
                    BtPopInfo.loadding();
                },3000)
            }

           


        } // 初始化结束
    }

})();