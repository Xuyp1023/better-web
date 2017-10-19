/*
菜单与接口等相关信息做关联
@author binhg
*/
define(function(require, exports, module) {

    exports.installController = function(mainApp, common, validate, tipbar, loading, comdirect, dialog) {

        mainApp.controller('auth.apiBindController', ['$scope', 'http', '$rootScope', '$route', 'cache', 'commonService', function($scope, http, $rootScope, $route, cache, commonService) {
            /*	VM设置	*/
            //为选择功能列表
            $scope.unSelectList = [];
            //已选择功能列表
            $scope.selectedList = [];
            //选定菜单IdVM
            $scope.menuId = '';

            /*	方法绑定	*/
            //查询未选择列表
            $scope.queryUnselectList = function() {
                http.post( /*	path	*/ , { /*	params	*/ }).success(function(data) {
                    if (common.isCurrentData(data)) {
                        $scope.$apply(function() {
                            $scope.unSelectList = data.data;
                            $scope.unSelectList = ArrayPlus($scope.unSelectList).addKey4ArrayObj('isChecked', false);
                        });
                    }
                })
            };
            //查询已选择列表
            $scope.querySelectedList = function() {
                http.post( /*	path	*/ , { /*	params	*/ }).success(function(data) {
                    if (common.isCurrentData(data)) {
                        $scope.$apply(function() {
                            $scope.selectedList = data.data;
                            $scope.selectedList = ArrayPlus($scope.selectedList).addKey4ArrayObj('isChecked', false);
                        });
                    }
                })
            };

            //添加功能选项
            $scope.addSelectList = function() {
                //获取已选择项
                var selectedList = ArrayPlus($scope.unSelectList).objectChildFilterByBoolean('isChecked', true);
                selectedList = ArrayPlus(selectedList).extractChildArray( /*	需要提取的字段	*/ , true);
                http.post( /*	path	*/ , { /*	params	*/ }).success(function(data) {
                    if (common.isCurrentData(data)) {
                        $scope.queryUnselectList();
                        $scope.querySelectedList();
                    }
                });
            };

            //删除功能选项
            $scope.delSelectList = function() {
                //获取已选择项
                var selectedList = ArrayPlus($scope.selectedList).objectChildFilterByBoolean('isChecked', true);
                selectedList = ArrayPlus(selectedList).extractChildArray( /*	需要提取的字段	*/ , true);
                http.post( /*	path	*/ , { /*	params	*/ }).success(function(data) {
                    if (common.isCurrentData(data)) {
                        $scope.queryUnselectList();
                        $scope.querySelectedList();
                    }
                });
            }

            /*!入口*/
            /*控制器执行入口*/
            $scope.$on('$routeChangeSuccess', function() {
                $scope.menuId = $route.current.pathParams.id;
                //初始化数据
                $scope.queryUnselectList();
                $scope.querySelectedList();
            });

        }]);

    };

});
