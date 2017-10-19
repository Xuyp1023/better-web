/*
/*
办理任务
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('applyFormController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){
			//参数传递
			$scope.$IN = {};
			$scope.$OUT = {};
			$scope.$init = function() {

			};


			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				common.resizeIframeListener();
				//获取修改对象

				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});
		}]);

	};

});