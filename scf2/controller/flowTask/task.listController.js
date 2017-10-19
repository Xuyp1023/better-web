/*
查看任务
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('task.listController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){

			//详情
			$scope.info = {};

			


			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				common.resizeIframeListener();
				//获取修改对象
				$scope.info = cache.get("process_edit_info");

				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});
		}]);

	};

});