/*
菜单与接口等相关信息做关联
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('core.addRelationController',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
			/*	VM设置	*/
			//为选择功能列表
			$scope.unSelectList = [];
			//已选择功能列表
			$scope.selectedList = [];

			/*	方法绑定	*/
			$scope.queryUnselectList = function(){

			};

			$scope.querySelectedList = function(){

			};

			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){

			});

		}]);

	};

});
