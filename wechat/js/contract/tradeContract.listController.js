
/*
	合同列表
	@author : herb
*/

exports.installController = function(mainApp,common){

	mainApp.controller('tradeContract.listController',['$scope','muiSupport','http','$rootScope','$route','cache',function($scope,muiSupport,http,$rootScope,$route,cache){

		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10
		};

		//合同列表
		$scope.contractList = [];
		
		//重新查询 从首页开始
		$scope.queryList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryContractList(true);
		};

		//查询合同列表
		$scope.queryContractList = function(flag){
			muiSupport.showBar();
			$scope.listPage.flag = flag ? 1 : 2;
			//@todo
			return http.post(BTPATH.QUERY_CONTRACT_LEDGER,$.extend({},$scope.listPage)).success(function(data){
				muiSupport.hideBar();
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.contractList = $scope.contractList.concat(data.data);
						if(flag){
							$scope.listPage = data.page;
						}
					});
				}
			});
		};

		//删除合同
		$scope.deleteContract = function(item){
			mui.confirm("确认删除贸易合同?","温馨提示",'',function(e){
 				if (e.index != 1) return;
				$.post(BTPATH.DELETE_CONTRACT_LEDGER,{contractId:item.id},function(data){
					if(data&&(data.code === 200)){	
						$scope.$apply(function(){
							$scope.contractList = ArrayPlus($scope.contractList).delChild("id",item.id);
						});
						mui.toast('删除成功！');			
						window.location.href = '#/tradeContract/list';
					}else{
						mui.alert('删除失败，服务端返回信息:'+data.message,'错误信息');
					}
				},'json');

			});
		};

		//新增合同
		$scope.openAdd = function(){
			window.location.href = '#/tradeContract/add';
		};


		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//查询合同列表
			$scope.queryContractList(true);
		});
	}]);

};