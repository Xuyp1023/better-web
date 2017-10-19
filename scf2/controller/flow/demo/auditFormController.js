/*
/*
办理任务
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('auditFormController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){

			$scope.$GET_RESULT = function() {
				return {test:'Hello world'};
			};

			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				// common.resizeIframeListener();
				//获取修改对象

				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});
		}]);

	};

});