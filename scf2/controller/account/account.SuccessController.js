/*
	开户成功
	@anthor : herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('account.SuccessController',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){

			/*VM绑定区域*/

			//开户信息
			$scope.info={};

			

			//返回
			$scope.goBack = function() {
				window.history.back();
			};



			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				
				http.post(BTPATH.FIND_OPEN_ACCOUNT_INFO,{})
					.success(function(data){
						if(data&&(data.code === 200)){
							tipbar.infoTopTipbar('状态查询成功!',{});
							$scope.$apply(function(){
								$scope.info = data.data;
							});
							commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.info.batchNo},$scope,'uploadFileList');
						} else {
							tipbar.errorTopTipbar($target,'状态查询失败,服务器返回:'+data.message,3000,6662);
						}
				});

				common.resizeIframeListener();
			});


		}]);

	};

});