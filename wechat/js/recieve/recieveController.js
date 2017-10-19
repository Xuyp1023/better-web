
exports.installController = function(mainApp,common){

	mainApp.controller('recieveController',['$scope','muiSupport','http','$rootScope','$route','cache',function($scope,muiSupport,http,$rootScope,$route,cache){
		/*私有属性区域*/
		_statusPicker = {};
		_statusList = BTDict.ReceivableNoteStatus.toArray('value','text');
		/*VM绑定区域*/
		$scope.searchData = {
			businStatus:_statusList[2].value
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
					$scope.searchData.businStatus = items[0].value;
				});
				$scope.infoList = [];
				$scope.listPage.pageNum = 1;
				$scope.queryList();
			});
		};

		$scope.selectedItem = function(item) {
			item.isChecked = !item.isChecked;
		};
			
		//查询融资列表
		$scope.queryList = function(){
			muiSupport.showBar();
			return http.post(BTPATH.QUERY_RECEIVABLEDO_WECHAT_QUERYRECEIVABLEDO,$.extend({},$scope.listPage,{
				businStatus: $scope.searchData.businStatus,
				flag:1,
				isCust:true
			})).success(function(data){
				muiSupport.hideBar();
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.infoList = $scope.infoList.concat(data.data);
						$scope.listPage = data.page;
					});
				}
			});
		};

		//跳到申请融资
		$scope.applyFinance = function(){ 
			//  /financeBusi/apply
			var list = ArrayPlus($scope.infoList).objectChildFilter("isChecked",true);			
			if(list.length==0){
				mui.alert("请选择应付账款！");
				return;
			}
			var temp = ArrayPlus(list).extractChildArray("id",false);
			var ids = temp[temp.length-1];		
			
			http.post(BTPATH.SAVE_RECEIVABLE_REQUEST_SAVEADDREQUESTTOTAL,{receivableId:ids}).success(function(data){
				
				if(common.isCurrentData(data)){
					cache.put('apply_finance_info',data.data);
					
					window.location.href = '#/model/financeApply/'+ data.data.requestNo;
				}
			});
			
			//window.location.href = '#/finance/do/bill/'+ $scope.info.id;
		};

		//打开详情
		$scope.showDetail = function(item){
			cache.put("recievInfo",item);
			window.location.href="#/recieve/detail/unFi/"+item.id;/*2*/
			
		};

		//

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//创建单项选择
			_statusPicker = muiSupport.singleSelect(_statusList);
			$scope.queryList();
		});
	}]);

}
