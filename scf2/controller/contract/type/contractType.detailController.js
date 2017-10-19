
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contractType.detailController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){
      /*  VM绑定区域  */
      $scope.info = {};

      /*  业务处理绑定区域  */

			$scope.goBack = function() {
				window.location.href = '#/contractType/contractTypeQuery';
			}



			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
					common.resizeIframeListener();
					$scope.info = cache.get("info");

				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

			});
		}]);

	};

});
