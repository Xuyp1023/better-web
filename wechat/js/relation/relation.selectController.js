
exports.installController = function(mainApp,common){

	mainApp.controller('relation.selectController',['$scope','muiSupport','http','$rootScope','cache',function($scope,muiSupport,http,$rootScope,cache){

		//VM绑定区域

		//客户类型列表
		$scope.custTypeList = {};

		/*获取数据区域*/

		//查询客户类型列表
		$scope.findCustType = function(){
			return http.post(BTPATH.FIND_CUST_TYPE,$.extend()).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.custTypeList = data.data;
						// console.info(data.data);
					});
				}
			});
		};

		//缓存选择的客户类型
		$scope.cacheSelect = function(item){
			cache.put("related_cust",item);
		}


		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//获取客户类型列表
			$scope.findCustType();
		});
	}]);

};