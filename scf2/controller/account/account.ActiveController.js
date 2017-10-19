/*

@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('account.ActiveController',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){

			//激活账户
			$scope.activeAccount = function(target){
				//确认代录
				http.post(BTPATH.ACTIVE_OPEN_ACCOUNT,{id:$scope.info.parentId}).success(function(data){
					if(common.isCurrentResponse(data)){
						if(data&&(data.code === 200)){
					 		tipbar.infoTopTipbar('激活成功!',{});
					 		window.location.href="#/account/success/";
						}else{
					 		tipbar.errorTopTipbar($(target),'操作失败,服务器返回信息'+data.message,3000,9996);
		 					$scope.$emiter('includeModalHide');
						}
					}
				});

			};

			//返回
			$scope.goBack = function() {
				window.history.back();
			}

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
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();
				});

			});
		}]);

	};

});
