/**=========================================================
 * 基金类-基金理财
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('p.basic.fundInfo', MainController);

    MainController.$inject = ['$scope', 'BtUtilService','configVo'];
    function MainController($scope, BtUtilService,configVo) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {

            console.log(configVo);

        } // 初始化结束
    }

})();
