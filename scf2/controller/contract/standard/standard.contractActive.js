
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('standard.contractActive',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){
      /*  VM绑定区域  */
      $scope.info = {};

      /*  业务处理绑定区域  */

			$scope.enable = function(target) {
				var $target = $(target);

				http.post(BTPATH.ENABLE_CONTRANCT_STANDARD,{id:$scope.info.id})
					.success(function(data){
						if(data&&(data.code === 200)){
							tipbar.infoTopTipbar('启用标准合同成功!',{});
							window.location.href = '#/standardContract/aduit';
						}else{
							tipbar.errorTopTipbar($target,'启用标准合同失败,服务器返回:'+data.message,3000,9992);
						}
					});
			}

			$scope.goBack = function(){
				window.location.href = '#/standardContract/aduit';
			}

			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){

				$scope.info = cache.get("info");
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

			});
		}]);

	};

});
