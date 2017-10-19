
/*
    帮助中心
    @author : herb
*/

define(function(require, exports, module) {

    exports.installController = function(mainApp, common, validate, tipbar, loading, comdirect, dialog) {

        mainApp.controller('helpCenterConroller', ['$scope', 'http', '$rootScope', '$route', 'cache', function($scope, http, $rootScope, $route, cache) {

            /*  VM绑定区域  */
            $scope.info = {};
            // 帮助手手册列表
            $scope.fileList = [];

            /*  业务处理绑定区域  */

            //分页数据
            $scope.listPage = {
                pageNum: 1,
                pageSize: 10,
                pages: 1,
                total: 1
            };


            //查询帮助手册列表
            $scope.queryList = function(flag){
                $scope.listPage.flag = flag? 1 : 2;
                var promise = http.post(BTPATH.XXXXXXXXXX,$.extend({},$scope.listPage)).success(function(data){
                    if(common.isCurrentData(data)){
                        $scope.$apply(function(){
                            $scope.fileList = data.data;
                            if(flag){
                                $scope.listPage = data.page;
                            }
                        });
                    }
                });
                return promise;
            };



            /*!入口*/
            /*控制器执行入口*/
            $scope.$on('$routeChangeSuccess', function() {
                //查询列表
                // $scope.queryList(true);
                $scope.fileList = [{
                    name:'供应链金融业务操作手册_V2.0'
                }];
                /*公共绑定*/
                $scope.$on('ngRepeatFinished', function() {
                    common.resizeIframeListener();
                });

            });
        }]);

    };

});
