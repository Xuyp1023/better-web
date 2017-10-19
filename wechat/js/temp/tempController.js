
exports.installController = function(mainApp,common){

	mainApp.controller('tempController',['$scope','muiSupport','http','$rootScope','$route','cache',function($scope,muiSupport,http,$rootScope,$route,cache){
		/*私有属性区域*/
		_statusPicker = {};
		_statusList = /*3*/BTDict.BillNoteStatus.toArray('value','text');
		/*VM绑定区域*/
		$scope.searchData = {
			businStatus:''
		};

		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10
		};

		//列表
		$scope.infoList = [];

		
		

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

		//查询融资列表
		$scope.queryList = function(){
			muiSupport.showBar();
			return http.post(BTPATH.QUERY_LIST_BILL/*1*/,/*2*/$.extend({},$scope.listPage,{
				businStatus: $scope.searchData.businStatus,
				flag:1
			})).success(function(data){
				muiSupport.hideBar(); //common.isCurrentResponse(data)
				if(/*!*/common.isCurrentData(data)){ 
					$scope.$apply(function(){
						$scope.infoList = $scope.infoList.concat(data.data);
						$scope.listPage = data.page;
					});
				}
			});
		};
		
		//打开详情
		$scope.showDetail = function(item){
			if((item.status+'' === '0')||(item.status+'' === '1')){
				window.location.href="#/bill/detail/"+item.id;
			}else{
				window.location.href="#/finance/detail/bill/"+item.id;
			}
		};

		/*!入口*/ /*控制器执行入口*/ 
		$scope.$on('$routeChangeSuccess',function(){
			//创建单项选择
			_statusPicker = muiSupport.singleSelect(_statusList);
			$scope.queryList();
		});
	}]);

}