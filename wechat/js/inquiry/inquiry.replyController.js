
exports.installController = function(mainApp,common){

	mainApp.controller('inquiry.replyController',['$scope','muiSupport','http','$rootScope','$route','cache','wx',
		function($scope,muiSupport,http,$rootScope,$route,cache,wx){
		/*私有属性区域*/
		_statusPicker = {};
		_statusList = BTDict.AcceptFinanceFlag.toArray('value','text');
		
		/*VM绑定区域*/

		
		$scope.info = {};

		//报价回复对象
		$scope.relyInfo = {};

		//报价列表
		$scope.offerList = {};

		//询价对象
		$scope.enquiryObject = {};


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

		//获取报价记录列表
		$scope.queryOfferList = function(enquiryNo, factorNo){
			return http.post(BTPATH.SEARCH_OFFER_LIST,{enquiryNo:enquiryNo, factorNo:factorNo}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.offerList = data.data;
					});
				}else{
					mui.alert('未查询到对应报价信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//获取询价发送的某个对象
		$scope.queryEnquiryObject = function(enquiryNo,factorNo){
			return http.post(BTPATH.QUERY_ENQUIRY_OBJECT,{enquiryNo:enquiryNo, factorNo:factorNo}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.enquiryObject = data.data;
					});
				}else{
					mui.alert('未查询到对应询价信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//保存报价回复
		$scope.saveReply = function(){
			$scope.relyInfo.offerId=$scope.enquiryObject.offerId;
			return http.post(BTPATH.ADD_OFFER_REPLY,$scope.relyInfo).success(function(data){
				if(common.isCurrentResponse(data)){
					mui.alert('回复报价成功！','温馨提示',function(){
							window.history.back();
					});
				}else{
					mui.alert('回复报价失败,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			// 获取到要传入的path变量
			var params = $route.current.pathParams.id.split(',');
			var enquiryNo = params[0];
			var factorNo = params[1];
			$scope.queryInfo(enquiryNo);
			$scope.queryEnquiryObject(enquiryNo, factorNo);
			$scope.queryOfferList(enquiryNo, factorNo);
			
		});
	}]);

};