
exports.installController = function(mainApp,common){

	mainApp.controller('sign.detailController',['$scope','muiSupport','http','$rootScope','$route','cache','wx','$route',
		function($scope,muiSupport,http,$rootScope,$route,cache,wx,$route){
		
		/*VM绑定区域*/
		$scope.info = {};

		//获取到票据详情
		$scope.queryInfo = function(id){

			http.post(BTPATH.QUERY_CONTRACT_DetailInfo,{appNo:id}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.contractInfo =wx.previewContractImg(true,id,data.data.data);
					});
					}else{
					mui.alert(/*4*/'未查询到对应详细信息,返回信息:\n'+data.message,'错误信息');
				}
			});

			http.post(BTPATH.FIND_ELECAGREEMENTINFO/*1*/,{appNo:id}/*2*/).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data/*3*/;
					});
					}else{
					mui.alert(/*4*/'未查询到对应合同信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//预览图片
		$scope.showAllImage = function(){
			wx.previewContractImg(false,$scope.contractInfo);
		};

		//跳转签约
		$scope.skipSign = function(){
			cache.put('stubInfos',$scope.info.stubInfos);
			window.location.href = '#/sign/record';
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			// 获取到要传入的path变量
			var id = $route.current.pathParams.id;
			$scope.queryInfo(id);
		});
	}]);

};