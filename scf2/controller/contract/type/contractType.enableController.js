
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contractType.enableController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){
      /*  VM绑定区域  */
      $scope.info = {};

      /*  业务处理绑定区域  */
			$scope.enable = function(target, data) {
				var $target = $(target);

				http.post(BTPATH.ENABLE_AGREEMENTTYPE,{id:data.id})
				.success(function(data){
					if(data&&(data.code === 200)){
						tipbar.infoTopTipbar('启用合同类型成功!',{});
						window.location.href = '#/contractType/contractTypeAudit';
					}else{
						tipbar.errorTopTipbar($target,'启用合同类型失败,服务器返回:'+data.message,3000,9992);
					}
				});
			}

			$scope.goBack = function(){
				window.location.href = '#/contractType/contractTypeAudit';
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
