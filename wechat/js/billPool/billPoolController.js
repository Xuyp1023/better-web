
exports.installController = function(mainApp,common){

	mainApp.controller('billPoolController',['$scope','muiSupport','http','$rootScope','$route','cache',function($scope,muiSupport,http,$rootScope,$route,cache){
		/*私有属性区域*/
		_statusPicker = {};
		_statusList = BTDict.BillNoteStatus.toArray('value','text');
		/*VM绑定区域*/
		$scope.searchData = {
			businStatus:''
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
					console.log(111); 
					console.log(items);
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


		//跳到申请融资
		$scope.applyFinance = function(){
			//  /financeBusi/apply
			var list = ArrayPlus($scope.infoList).objectChildFilter("isChecked",true);
			if(list.length==0){
				mui.alert("请选择票据！");
				return;
			}
			var ids = ArrayPlus(list).extractChildArray("id",true);
			cache.put("apply_finance_info", {'type': '2', 'id': ids});
			window.location.href = "#/financeBusi/apply";
			//window.location.href = '#/finance/do/bill/'+ $scope.info.id;
		};

		//跳到询价
		$scope.applyInquiry = function(){
			var list = ArrayPlus($scope.infoList).objectChildFilter("isChecked",true);
			if(list.length==0){
				mui.alert("请选择票据！");
				return;
			}else if(list.length>1){
				mui.alert("只能选择单张票据！");
				return;
			}
			var id = ArrayPlus(list).extractChildArray("id",true);
			window.location.href = '#/inquiry/do/'+ id;
		};

		//查询融资列表
		$scope.queryList = function(){
			muiSupport.showBar();
			return http.post(BTPATH.QUERY_LIST_BILL,$.extend({},$scope.listPage,{
				businStatus: $scope.searchData.businStatus,
				flag:1
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

		//打开详情
		$scope.showDetail = function(item){
			if((item.businStatus+'' === '0')||(item.businStatus+'' === '1')){/*1*/
				window.location.href="#/billPool/detail/unFi/"+item.id;/*2*/
			}else{
				window.location.href="#/billPool/detail/didFi/"+item.id;
			}
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
