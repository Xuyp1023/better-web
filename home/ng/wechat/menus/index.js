/**=========================================================
 * 微信类-菜单控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('wechat.menus', MainController);

    MainController.$inject = ['$scope', 'BtUtilService','configVo','BtTipbar'];
    function MainController($scope, BtUtilService,configVo,BtTipbar) {

        activate();

        BtUtilService
            .get('/wechat/menus')
            .then(function(jsonData){
                $scope.menuVo.content = JSON.stringify(jsonData,undefined, 2);
            });

        ////////////////
        //初始化方法开始
        function activate() {

            $scope.menuVo = {};

            // 带表单效验的提交
            $scope.basicSubmit = function($event){

                if(!$scope.formParams.getValid()) {
                    BtTipbar.tipbarWarning($event.target,'表单有错误');
                    return;
                }
                BtUtilService
                    .post('/wechat/menus',$scope.menuVo.content)
                    .then(function(jsonData){
                        if(jsonData.errcode){
                            BtTipbar.pop('error','微信公众号',jsonData.errmsg);
                        }else {
                            BtTipbar.pop('success','微信公众号',jsonData.errmsg);
                        }
                    })
            };

            // form表单验证的参数设置
            $scope.formParams = configVo.formParams || {};



        } // 初始化结束
    }

})();
