/*
核心企业新增关联客户
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('core.addRelationController',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){

			//详情
			$scope.custTypeList = {};

			//当前选择
			$scope.currData = {
				selectedType:''
			};

			//跳转映射
			$scope.skipList = {
				'CORE_USER':'customerRelation/coreRelateSupplier',
				'SUPPLIER_USER':'customerRelation/coreRelateSupplier',
				'SELLER_USER':'customerRelation/coreRelateSupplier',
				'FACTOR_USER':'customerRelation/openFactorBusi',
			};


			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				$scope.findCustType();
			});

			//跳转页面
			$scope.skipPage = function(){
				if(!$scope.currData.selectedType) return ;
				//缓存选择 的关联客户类型
				cache.put('related_cust_type',$scope.currData.selectedType);
				var url = $scope.skipList[$scope.currData.selectedType];
				// window.location = '#/' + url;
				$location.url('/' + url);
			};


			//查询类型列表
			$scope.findCustType = function(){
				return http.post(BTPATH.FIND_CUST_TYPE,$.extend()).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.custTypeList = data.data;
						});
					}
				});
			};

		}]);

	};

});