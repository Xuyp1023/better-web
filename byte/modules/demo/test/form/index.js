/**=========================================================
 * 测试类-布局控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.test.form', MainController);

    MainController.$inject = ['$scope', 'BtUtilService','BtTipbar','configVo'];
    function MainController($scope, BtUtilService,BtTipbar,configVo) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {

            $scope.searchData = {
                fileList:[]
            };

            // 列表的删除按钮事件
            $scope.deleteFileList = function(index,fileList){
                fileList.splice(index,1);
            }

            // 带表单效验的提交
            $scope.basicSubmit = function($event){

                if(!$scope.formParams.getValid()) {
                    BtTipbar.tipbarWarning($event.target,'表单有错误');
                    return;
                }
                BtUtilService
                    .post('server/menus/sidebar-menu1.json',{})
                    .then(function(jsonData){
                        console.log('请求成功');
                    })
            };

            // form表单验证的参数设置
            $scope.formParams = configVo.formParams;

        } // 初始化结束
    }

})();
