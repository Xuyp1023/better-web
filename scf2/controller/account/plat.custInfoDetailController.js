
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('plat.custInfoDetailController',['$scope','http','$rootScope','$route','cache','$location','commonService',function($scope,http,$rootScope,$route,cache,$location,commonService){

			$scope.goBack = function(){
				$location.path("/plat/custInfo/");
     		};

			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){

				http.post(BTPATH.FIND_OPENACCOUNT_INFO,{id:$route.current.pathParams.id}).success(function(data){
						if(data&&(data.code === 200)){
							tipbar.infoTopTipbar('状态查询成功!',{});
							$scope.$apply(function(){
								$scope.info = data.data;
							});
							commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.info.batchNo},$scope,'uploadFileList');
						} else {
							// tipbar.errorTopTipbar($target,'状态查询失败,服务器返回:'+data.message,3000,6662);
							tipbar.infoTopTipbar('状态查询失败!',{});
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