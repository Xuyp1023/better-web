/*
菜单与接口等相关信息做关联
@author binhg
*/
define(function(require, exports, module) {

    exports.installController = function(mainApp, common, validate, tipbar, loading, comdirect, dialog) {

        mainApp.controller('auth.authTreeController', ['$scope', 'http', '$rootScope', '$route', 'cache', 'commonService','easyPlugin', function($scope, http, $rootScope, $route, cache, commonService,easy) {
            /*	VM设置	*/

            /*	方法绑定	*/
            //获取系统菜单
            $scope.queryAllMenu = function() {
                return http.post(BTPATH.QUERY_LIST_MENU, {/*  params  */});
            };

            /*!入口*/
            /*控制器执行入口*/
            $scope.$on('$routeChangeSuccess', function() {
              using('tree',function(){
                $scope.queryAllMenu().success(function(data){
                  if(common.isCurrentData(data)){
                    $('.menuList').tree({
          						animate:true,
          						checkbox:false,
          						data:data.data,
                      onClick:function(node){
                        if(node.children) return;
                        window.location.href = '#/auth/apiBind/'+node.id;
                      }
          					});
                  }
                });
              });
            });

        }]);

    };

});
