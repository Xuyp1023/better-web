
exports.installController = function(mainApp,common){

	mainApp.controller('inquiry.doController',['$scope','muiSupport','http','$rootScope','$route','cache','wx','$route',
		function($scope,muiSupport,http,$rootScope,$route,cache,wx,$route){
		/*私有属性区域*/
		_statusPicker = {};
		_statusList = BTDict.AcceptFinanceFlag.toArray('value','text');
		$scope.enquiryStrategy = BTDict.ScfEnquiryStrategy.toArray('value','text');
		
		/*VM绑定区域*/

		//询价的票据信息
		$scope.info = {};

		//保理公司下拉
		$scope.factorList = {};

		//询价对象
		$scope.inquiry = {}; 


		/*获取数据区域*/

		//获取到票据详情
		$scope.queryInfo = function(id){
			return http.post(BTPATH.QUERY_ONE_BILL,{id:id}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data;
						$scope.inquiry.endDate = new Date().getSubDate('DD',-1).format('YYYY-MM-DD');
					});
				}else{
					mui.alert('未查询到对应票据信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//获取到保理公司下拉数据详情
		$scope.queryFactor = function(){
			return http.post(BTPATH.CUST_RELATION).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.factorList = data.data;
					});
				}else{
					mui.alert('未查询到对应保理公司信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//保存询价
		$scope.applyInquiry = function(){
			var enquiryStrategyArray = ArrayPlus($scope.enquiryStrategy).objectChildFilterByBoolean('isChecked',true);
			$scope.inquiry.strategy = ArrayPlus(enquiryStrategyArray).extractChildArray('value',true);

			var factorArray = ArrayPlus($scope.factorList).objectChildFilterByBoolean('isChecked',true);
			if(!factorArray || factorArray.length===0){
				mui.alert('请选择金融机构！','温馨提示');
				return false;
			}

			$scope.inquiry.factors = ArrayPlus(factorArray).extractChildArray('value',true);
			$scope.inquiry.orders = $scope.info.id;
			$scope.inquiry.enquiryMethod = 2;//主动询价
			$scope.inquiry.requestType = 2;

			http.post(BTPATH.ADD_ENQUIRY,$scope.inquiry).success(function(data){
				if(common.isCurrentResponse(data)){
					mui.alert('询价成功！','温馨提示',function(){
							window.history.back();
					});
				}else{
					mui.alert('询价失败,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//切换日期
		$scope.changeDate = function(){
			var config = {
				value:new Date().getSubDate('DD',-1).format('YYYY-MM-DD'),
				type:'date'
			};
			var picker = muiSupport.dateSelect(config);
			picker.show(function(res){
				$scope.$apply(function(){
					$scope.inquiry.endDate = res.text;
				});
			});
		};

		//单选 切换选择
		$scope.singleToggleItem = function(item,list){
			ArrayPlus(list).setKeyArrayObj("isChecked",false);
			ArrayPlus(list).setKeyArrayObj("isChecked",true,"value",item.value);
		};

		//切换选择
		$scope.toggleCheckItem = function(item){
			item.isChecked = !item.isChecked;
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//初始化可选-询价策略
			$scope.enquiryStrategy = ArrayPlus($scope.enquiryStrategy).addKey4ArrayObj('isChecked',false);

			// 获取到要传入的path变量
			var id = $route.current.pathParams.id/*3*/;
			$scope.queryInfo(id);
			$scope.queryFactor();
		});
	}]);

};