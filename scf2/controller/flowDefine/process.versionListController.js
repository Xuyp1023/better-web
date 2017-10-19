/*

@author herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('process.versionListController',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){

			//查询所需信息
			$scope.searchData = {
				custNo:'',
				workFlowName:''
			};

			$scope.custList = [];
			//流程列表
			$scope.processList = [];
			
			//查询单个流程 所有版本
			$scope.queryList = function(flag){
				http.post(BTPATH.QUERY_HISTORY_WORKFLOW_BASE_LIST,$scope.searchData).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.processList = data.data;
						});
					}
				});
			};

			//缓存数据
			$scope.cacheData = function(data,name){
				cache.put(name,data);
			};

			// 发布流程
			$scope.publishWorkFlow = function(item) {
				http.post(BTPATH.PUBLISH_WORKFLOW_BASE,{baseId:item.id}).success(function(data){
					if(common.isCurrentData(data)){
						tipbar.infoTopTipbar('发布流程成功!',{});
						$scope.$apply(function(){
							$scope.queryList();
						});
					}
				});
			};

			// 禁用流程
			$scope.disableWorkFlow = function(item) {
				http.post(BTPATH.DISABLE_WORKFLOW_BASE,{baseId:item.id}).success(function(data){
					if(common.isCurrentData(data)){
						tipbar.infoTopTipbar('停用流程成功!',{});
						$scope.$apply(function(){
							$scope.queryList();
						});
					}
				});
			};

			// 启用流程
			$scope.enableWorkFlow = function(item) {
				http.post(BTPATH.ENABLE_WORKFLOW_BASE,{baseId:item.id}).success(function(data){
					if(common.isCurrentData(data)){
						tipbar.infoTopTipbar('启用流程成功!',{});
						$scope.$apply(function(){
							$scope.queryList();
						});
					}
				});
			};


			// 创建流程
			$scope.createWorkFlow = function(target){
				// ADD_NEWVERSION_WORKFLOW_BASE
				var $target = $(target);

				http.post(BTPATH.ADD_NEWVERSION_WORKFLOW_BASE/*1*/,{workFlowName:$scope.searchData.workFlowName, custNo:$scope.searchData.custNo}/*2*/)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		tipbar.infoTopTipbar('新增流程成功!',{});
				 		// window.history.back();
				 		$scope.queryList();
				 	}else{
				 		tipbar.errorTopTipbar($target,'新增流程失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
			};	

			$scope.goBack = function() {
				$location.path('/process/list');
			};

			// 定义流程结点
			$scope.defineNode = function(item)  {
				cache.put("selected_flow", {
					item:item,
					custNo:$scope.searchData.custNo
				});
				$location.path('/process/nodeDefine');
			};			

			// 查看流程结点
			$scope.showWorkFlow = function(item)  {
				cache.put("selected_flow", {
					item:item,
					custNo:$scope.searchData.custNo,
					readonly:true
				});
				$location.path('/process/nodeDefine');
			};

			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				common.resizeIframeListener();

				$scope.searchData.custNo = $route.current.pathParams.custNo;
				$scope.searchData.workFlowName = $route.current.pathParams.name;
				
				cache.put("current_flow_info",{
					'custNo':$route.current.pathParams.custNo,
					'workFlowName':$route.current.pathParams.name
				})

				$scope.queryList();

				
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});
		}]);

	};

});