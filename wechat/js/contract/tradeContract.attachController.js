
/*
	合同附件查看
	@author : herb
*/

exports.installController = function(mainApp,common){

	mainApp.controller('tradeContract.attachController',['$scope','muiSupport','http','$rootScope','$route','cache','wx',function($scope,muiSupport,http,$rootScope,$route,cache,wx){

		/*私有属性区域*/

		$scope.agreeList = [];
		$scope.info={};
		$scope.contractInfo={};
		
		//获取合同附件列表
		$scope.queryContractList = function(contractId){
			var promise = http.post(BTPATH.FIND_CONTRACT_LEDGER_FILEINFO,{contractId:contractId}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.agreeList = data.data.custFileList;
						$scope.contractInfo = data.data;
					});
				} 
			});
			return promise;
		};


		//====================================== 附件相关操作 start ===========================================
	
		//预览图片
		$scope.preImg = function(item){
			//缓存数据
			cache.put('agree_list',$scope.agreeList);
			cache.put('contract_info',$.extend({preImg:true},$scope.info));
			window.location.href = '#/preImg/'+item.id;
		};

		//====================================== 附件相关操作 end ===========================================



		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){

			var contractId = $route.current.pathParams.contractId;

			//从图片预览页面返回
			var preInfo = cache.get('contract_info');
			var agreeList = cache.get('agree_list');
			if(preInfo && preInfo.preImg){
				$scope.agreeList = agreeList;
				$scope.info = preInfo;
				cache.put('agree_list',[]);
				cache.put('contract_info',{});
			}

			//查询附件列表
			$scope.queryContractList(contractId);

		});

	}]);

};