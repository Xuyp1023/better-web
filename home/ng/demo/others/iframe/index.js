/**=========================================================
 * iframe跨域-布局控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.test.iframe', MainController);

    MainController.$inject = ['$scope','BtUtilService'];
    function MainController($scope,BtUtilService) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {

           
            // 同源并且同applicationModuleName，使用angualr嵌套会出现bug，$scope重复
            $scope.openIframe = function(){
                              
                angular.element(document.body).append(angular.element('<div class="modal">'+
                    '<div class="modal-background"></div>'+
                    '<div class="modal-content">'+
                        '<iframe name="content_spin" src="home1_1.html#/demo/test/query" marginheight="0" marginwidth="0" frameborder="0" width="100%"></iframe>'+
                    '</div>'+
                    '<span class="bt-pop-close" ng-click="closeThisDialog()">'+
                '</div>'));
            }

        } // 初始化结束
    }

})();
