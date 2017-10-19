/*
	开户审核
	@anthor : herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('plat.AuditController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){

			/*VM绑定区域*/


			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				common.resizeIframeListener();

				http.post(BTPATH.FIND_OPEN_ACCOUNT_INFO,{})
					.success(function(data){
						if(data&&(data.code === 200)){
							tipbar.infoTopTipbar('状态查询成功!',{});
							$scope.$apply(function(){
								$scope.info = data.data;
							});
						} else {
							tipbar.errorTopTipbar($target,'状态查询失败,服务器返回:'+data.message,3000,6662);
						}
				});
			});


		}]);

	};

});