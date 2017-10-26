/**=========================================================
 * 测试类-布局控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.test.upload', MainController);

    MainController.$inject = ['$scope'];
    function MainController($scope) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {

            $scope.fileList0 = [];
            $scope.fileList1 = [];
            $scope.fileList3 = [];

            $scope.fileList2 = [
                {fileName:'新建文件夹11',fileLength:62288,fileType:'xxxxx'},
                {fileName:'新建文件夹',fileLength:62288,fileType:'jpg'},
                {fileName:'新建文件夹',fileLength:62288,fileType:'png'},
                {fileName:'新建文件夹',fileLength:62288,fileType:'gif'}
            ];

            // 列表的删除按钮事件
            $scope.deleteFileList = function(index,fileList){
                fileList.splice(index,1);
            }

        } // 初始化结束
    }

})();
