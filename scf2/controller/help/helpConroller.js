/*
    帮助
    @author : herb
*/

define(function(require, exports, module) {

    exports.installController = function(mainApp, common, validate, tipbar, loading, comdirect, dialog) {

        mainApp.controller('helpConroller', ['$scope', 'http', '$rootScope', '$route', 'cache', function($scope, http, $rootScope, $route, cache) {
            /*  VM绑定区域  */
            $scope.info = {};

            /*  业务处理绑定区域  */




            /*!入口*/
            /*控制器执行入口*/
            $scope.$on('$routeChangeSuccess', function() {

                //调整iframe高度
                common.resizeIframeListener();

                /*公共绑定*/
                $scope.$on('ngRepeatFinished', function() {
                    common.resizeIframeListener();
                });

            });
        }]);

    };

});
