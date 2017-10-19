/*
	放弃报价
*/
exports.installController = function(mainApp,common){

	mainApp.controller('inquiry.abandonController',['$scope','muiSupport','http','$rootScope','$route','cache','wx','$route',
		function($scope,muiSupport,http,$rootScope,$route,cache,wx,$route){
		/*私有属性区域*/
		_statusPicker = {};
		_statusList = BTDict.AcceptFinanceFlag.toArray('value','text');
		$scope.dropReason = BTDict.DropReason.toArray('value','text');

		/*VM绑定区域*/

		$scope.info = {};

		//询价对象
		$scope.enquiryObject = {};

		//放弃
		$scope.abandon = {};

		/*获取数据区域*/

		//获取到询价详情
		$scope.queryInfo = function(enquiryNo){
			return http.post(BTPATH.QUERY_BILL_ENQUIRY_DETAIL,{enquiryNo:enquiryNo}).success(function(data){
				if(common.isCurrentResponse(data)){

					$scope.$apply(function(){
						/*//初始化可选reason
						var reasonArray = ['1','3'];//data.data.reason.split(',');
						$scope.dropReason = ArrayPlus($scope.dropReason).addKey4ArrayObj('isChecked',false);
						$scope.dropReason = ArrayPlus($scope.dropReason).linkAnotherArray(reasonArray,'value','isChecked',true);*/
						$scope.info = data.data;
					});
				}else{
					mui.alert('未查询到对应询价信息,服务端\n返回信息:'+data.message,'错误信息');
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

		//放弃报价
		$scope.saveAbandon = function(){
			var dropReasonArray = ArrayPlus($scope.dropReason).objectChildFilterByBoolean('isChecked',true);
			$scope.abandon.dropReason = ArrayPlus(dropReasonArray).extractChildArray('value',true);
			$scope.abandon.offerId=$scope.enquiryObject.offerId;
			$scope.abandon.enquiryNo=$scope.enquiryObject.enquiryNo;
			return http.post(BTPATH.CUST_DROP_ENQUIRY,$scope.abandon).success(function(data){
				if(common.isCurrentResponse(data)){
					mui.alert('信息保存成功！','温馨提示',function(){
							window.history.back();
					});
				}else{
					mui.alert('信息保存失败,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//切换选择
		$scope.toggleCheckItem = function(item){
			item.isChecked = !item.isChecked;
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//初始化可选reason
			$scope.dropReason = ArrayPlus($scope.dropReason).addKey4ArrayObj('isChecked',false);

			// 获取到要传入的path变量
			var params = $route.current.pathParams.id.split(',');
			var enquiryNo = params[0];
			var factorNo = params[1];
			$scope.queryInfo(enquiryNo);
			$scope.queryEnquiryObject(enquiryNo, factorNo);
		});
	}]);

};