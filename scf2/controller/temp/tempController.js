
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('tempController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){

			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();  
				});
				
			});
		}]);

	};

});