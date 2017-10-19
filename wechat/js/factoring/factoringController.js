
exports.installController = function(mainApp,common){

	mainApp.controller('factoringController',['$scope','muiSupport','http','$rootScope',function($scope,muiSupport,http,$rootScope){
		/*私有属性区域*/
		_statusPicker = {};
		_statusList = BTDict.AcceptFinanceFlag.toArray('value','text');
		/*VM绑定区域*/
		$scope.searchData = {
			financeFlag:''
		};

		$scope.infoList = [];
		

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
			$('#progress').show();
			http.post(BTPATH.QUERY_LIST_BILL,{
				custNo: $rootScope.loginInfo.custNo,
				financeFlag: $scope.searchData.financeFlag
			}).success(function(data){
				setTimeout(function(){
					$('#progress').hide();
				},1000);
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.infoList = data.data;
					});
				}
			});
		};


		//打开详情
		$scope.showDetail = function(item){
			window.location.href = '#/inquiry/detail';
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//创建单项选择
			_statusPicker = muiSupport.singleSelect(_statusList);
			// $scope.queryList();
		});
	}]);

}