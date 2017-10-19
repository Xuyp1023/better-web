/*

@author herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('process.listController',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){

			//搜索所需信息
			$scope.searchData = {
				custNo:''
			};

			// $scope.selectCustInfo = {};

			$scope.custList = [];
			//流程列表
			$scope.processList = [];
			
			//分页数据
			$scope.listPage = {
				pageNum: 1,
				pageSize: 10
			};

			//查询流程列表
			$scope.queryList = function(flag){
				$scope.listPage.flag = flag? 1 : 2;
				http.post(BTPATH.QUERY_WORKFLOW_BASE_LIST,$.extend($scope.searchData,$scope.listPage)).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.processList = data.data;
							if(flag/*1*/){
								$scope.listPage = data.page;/*4*/
							}
						});
					}
				});
			};

			//缓存数据
			$scope.cacheData = function(data,name){
				cache.put(name,data);
			};


			// 创建流程
			$scope.createWorkFlow = function(){
				var custName = ArrayPlus($scope.custList).objectChildFilter("value",$scope.searchData.custNo)[0].name;
				cache.put("selected_cust",{
					custName:custName,
					custNo:$scope.searchData.custNo
				});
				$location.path('/process/create');
			};	
			

			//查看历史版本
			$scope.showHistoryVersion = function(item){
				$location.path('/process/versionList/' + item.custNo + "/" + item.name);
			};

			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				common.resizeIframeListener();
				$scope.listPage.flag = 1;


				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
					$scope.searchData.custNo = $scope.custList[0] ? $scope.custList[0].value : '';
					$scope.queryList(true);
				});

				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});
		}]);

	};

});