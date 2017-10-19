
exports.installController = function(mainApp,common){

	mainApp.controller('sign.doController',['$scope','muiSupport','http','$rootScope','$route','cache','wx','$route',
		function($scope,muiSupport,http,$rootScope,$route,cache,wx,$route){
		
		/*VM绑定区域*/
		$scope.info = {};

		$scope.vCode = '';
		$scope.tradePwd = '';		

		//获取到票据详情
		$scope.queryInfo = function(appNo){

			http.post(BTPATH.QUERY_CONTRACT_DetailInfo,{appNo:appNo}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.contractInfo =wx.previewContractImg(true,appNo,data.data.data);
					});
					}else{
					mui.alert(/*4*/'未查询到对应详细信息,返回信息:\n'+data.message,'错误信息');
				}
			});
			
			http.post(BTPATH.FIND_ELECAGREEMENTINFO,{appNo:appNo}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data/*3*/;
					});
					}else{
					mui.alert(/*4*/'未查询到对应合同信息,返回信息:\n'+data.message,'错误信息');
				}
			});
		};

		//预览图片
		$scope.showAllImage = function(){
			wx.previewContractImg(false,$scope.contractInfo);
		};

		//获取验证码请求
		$scope.findValidCode = function(appNo,custType){
			http.post(BTPATH.FIND_VALIDCODE,{appNo:appNo,custType:custType}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data/*3*/;
					});
				}else{
					mui.alert(/*4*/'获取验证码失败,返回信息:\n'+data.message,'错误信息');
				}
			});
		};   
         
		//签约验证验证码
		$scope.sendValidCode = function(appNo,custType){
			
			http.post(BTPATH.SEND_VALIDCODE_SENDVALIDCODE,{appNo:$scope.info.appNo,vCode:$scope.vCode,custType:'0'}).success(function(data){
				
				if(data.code == 200 || data.code == '200'){
					
					window.location.href = '#/sign/';
					mui.alert('签约成功！','温馨提示');
				}else{
					
					mui.alert(/*4*/'验证码错误,返回信息:\n'+data.message,'错误信息');
				}
			});
		};    
    
		//放弃签署
		$scope.cancelElecAgreement = function(appNo,describe){
			http.post(BTPATH.CANCELELECAGREEMENT,{appNo:appNo,describe:describe}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data;
					});
					window.location.href = '#/sign/';
					mui.alert('已放弃签署！','温馨提示');
				}else{
					mui.alert(/*4*/'错误,返回信息:\n'+data.message,'错误信息');
				}
			});
		};   

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			// 获取到要传入的path变量
			var appNo = $route.current.pathParams.appNo;
			$scope.queryInfo(appNo);
		});
	}]);

};