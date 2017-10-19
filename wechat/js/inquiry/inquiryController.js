
exports.installController = function(mainApp,common){

	mainApp.controller('inquiryController',['$scope','muiSupport','http','$rootScope',function($scope,muiSupport,http,$rootScope){
		/*私有属性区域*/
		_statusPicker = {};
		_statusList = BTDict.AcceptFinanceFlag.toArray('value','text');
		/*VM绑定区域*/
		$scope.searchData = {
			financeFlag:''
		};

		$scope.infoList = [];
		
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10
		};

		/*获取数据区域*/
		//切换查询条件
		$scope.changeStatus = function(){
			_statusPicker.show(function(items){
				$scope.$apply(function(){
					$scope.searchData.financeFlag = items[0].value;
				});
				$scope.queryList();
			});
		};

		//查询融资列表
		$scope.queryList = function(){
			muiSupport.showBar();
			return http.post(BTPATH.QUERY_BILL_ENQUIRY_LIST,$.extend({},$scope.listPage,{
				businStatus: $scope.searchData.businStatus,
				flag:1
			})).success(function(data){
				muiSupport.hideBar();
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.infoList = data.data;
						$scope.listPage = data.page;
					});
				}
			});
		};

		//打开详情
		$scope.showDetail = function(item){
			window.location.href = '#/inquiry/detail/'+item.enquiryNo;
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//创建单项选择
			_statusPicker = muiSupport.singleSelect(_statusList);
			 $scope.queryList();
		});
	}]);

}