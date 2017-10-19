
exports.installController = function(mainApp,common){

	mainApp.controller('open.waitActiveController',['$scope','muiSupport','http','$rootScope','cache',function($scope,muiSupport,http,$rootScope,cache){
		/*私有属性区域*/
		

		/*获取数据区域*/
		
		$scope.info={
			active:false,
		};
		
		//阅读并同意
		$scope.readAndAgree = true;

		//激活账户
		$scope.activeAccount = function(target){
			//勾选 -阅读并同意协议
			if(!$scope.readAndAgree){
				mui.alert('请阅读并同意协议','温馨提示');
				return;
			}
		//确认代录
		// http.post(BTPATH.PASS_CONFIRM_INSTEAD_APPLY,{id:$scope.info.parentId})
		// 	 .success(function(data){
		// 	 	if(common.isCurrentResponse(data)){
		// 	 		//提交
		// 	 		http.post(BTPATH.CONFIRM_MAININSTEAD_LIST,{id:$scope.info.parentId})
		// 				 .success(function(data){
		// 				 	if(data&&(data.code === 200)){
		// 				 		tipbar.infoTopTipbar('激活成功!',{});
		// 				 	}else{
		// 				 		tipbar.errorTopTipbar($(target),'操作失败,服务器返回信息'+data.message,3000,9996);
		// 	 					$scope.$emiter('includeModalHide');
		// 				 	}
		// 				 });
		// 	 	}else{
		// 	 		tipbar.errorTopTipbar($(target),'操作失败,服务器返回信息'+data.message,3000,9996);
		// 	 		$scope.$emiter('includeModalHide');
		// 	 	}
		// 	 });



			 http.post(BTPATH.ACTIVE_OPEN_ACCOUNT,{id:$scope.info.parentId}).success(function(data){
				if(common.isCurrentResponse(data)){
					if(data&&(data.code === 200)){
				 		mui.alert('激活成功','温馨提示');
				 		window.location.href = BTServerPath+'/Wechat/Platform/toSuccess';
					}else{
				 		tipbar.errorTopTipbar($(target),'操作失败,服务器返回信息'+data.message,3000,9996);
	 					mui.alert('激活失败,服务端\n返回信息:'+data.message,'错误信息');
					}
				}
			});
			 
		};

		

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			// $scope.info =  cache.get("account_info");
			// $scope.applyInfo =  cache.get("apply_info");
			
			http.post(BTPATH.FIND_CUST_OPEN_ACCOUNT_TMP,{}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data;
					});
					cache.put("account_info",$scope.info);
				}
			});

		});
	}]);

};