
exports.installController = function(mainApp,common){

	mainApp.controller('inquiry.detailController',['$scope','muiSupport','http','$rootScope','$route','cache','wx','$route',
		function($scope,muiSupport,http,$rootScope,$route,cache,wx,$route){
		/*私有属性区域*/
		_statusPicker = {};
		_statusList = BTDict.AcceptFinanceFlag.toArray('value','text');
		
		/*VM绑定区域*/

		$scope.info = {};

		//报价列表
		$scope.objectList = {};

		//附件列表
		$scope.upLoadList = [];
		

		/*获取数据区域*/

		//获取到询价详情
		$scope.queryInfo = function(enquiryNo){
			return http.post(BTPATH.QUERY_BILL_ENQUIRY_DETAIL,{enquiryNo:enquiryNo}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data;
					});
				}else{
					mui.alert('未查询到对应询价信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//获取报价列表
		$scope.queryObjectList = function(enquiryNo){
			return http.post(BTPATH.QUERY_OFFER_BY_ENQUIRY_OBJECT,{enquiryNo:enquiryNo}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.objectList = data.data;
					});
				}else{
					mui.alert('未查询到对应报价信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//申请融资
		$scope.applyFinance = function(item){

			/*$scope.info.billId = $scope.info.id;
			//文件上传，打包文件ID
			$scope.info.fileList = ArrayPlus($scope.upLoadList).extractChildArray('id',true);

			http.post(BTPATH.APPLY_FINANCE,$scope.info).success(function(data){
				if(common.isCurrentResponse(data)){
					window.location.href = '#/finance/success';
				}else{
					mui.alert('申请失败,请联系客服人员,服务端\n返回信息:'+data.message,'错误信息');
				}
			});*/
			cache.put("apply_finance_info", {'type': '2', 'id': $scope.info.orders, 'factorNo':item.factorNo, 'factorName':item.factorName, 'balance':item.offer.balance});
			window.location.href = "#/financeBusi/apply";
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			// 获取到要传入的path变量
			var enquiryNo = $route.current.pathParams.enquiryNo/*3*/;
			$scope.queryInfo(enquiryNo);
			$scope.queryObjectList(enquiryNo);
			//文件缓存读取
			var preUploadList = cache.get('pre_upload_list');
			if(preUploadList){
				$scope.upLoadList = preUploadList;
				cache.put('pre_upload_list',[]);
			}

		});
	}]);

};