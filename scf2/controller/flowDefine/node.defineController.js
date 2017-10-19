/*
@author herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('node.defineController',['$scope','http','$rootScope','$route','cache', 'commonService','$location',function($scope,http,$rootScope,$route,cache, commonService,$location){

			//节点列表
			$scope.nodeList = [];

			$scope.operList = [];

			$scope.searchData = {
				baseId:''
			};

			$scope.currentItem = {};

			$scope.selectOper = {operId: ''};

			$scope.readonly = false;

			//停用节点
			$scope.disableWorkFlowNode = function(item){
				http.post(BTPATH.DISABLE_WORKFLOW_NODE,{baseId:$scope.searchData.baseId, nodeId:item.id}).success(function(data){
					if(common.isCurrentData(data)){
						tipbar.infoTopTipbar('停用流程节点成功!',{});
						$scope.$apply(function(){
							$scope.queryList();
						});
					}
				});
			};
			// 启用节点
			$scope.enableWorkFlowNode = function(item) {
				http.post(BTPATH.ENABLE_WORKFLOW_NODE,{baseId:$scope.searchData.baseId, nodeId:item.id}).success(function(data){
					if(common.isCurrentData(data)){
						tipbar.infoTopTipbar('启用流程节点成功!',{});
						$scope.$apply(function(){
							$scope.queryList();
						});
					}
				});
			};

			//查询流程列表
			$scope.queryList = function(){
				http.post(BTPATH.QUERY_WORKFLOW_NODE_LIST,$scope.searchData).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.nodeList = data.data;
						});
					}
				});
			};


			// 打开步骤列表
			$scope.openDefineAuditStep = function(item) {
				cache.put("select_node", item);
				$location.path('/process/stepList');
				// window.location.href = '#/process/stepList/';
			};


			//打开 分配操作员 面板
			$scope.openAssignBox = function(item){
				$scope.currentItem = item;
				if (item.operId) {
					$scope.selectOper.operId = item.operId;
				} else {
					$scope.selectOper.operId = $scope.operList[0] ? $scope.operList[0].value : '';
				}
				$scope.openRollModal("assign_operate_box");
			};

			// 保存经办人
			$scope.assigneeOperator = function(target) {
				var $target = $(target);
				http.post(BTPATH.ASSIGNEE_WORKFLOW_NODE_OPER,{baseId:$scope.currentItem.baseId,nodeId:$scope.currentItem.id,operId:$scope.selectOper.operId}).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							tipbar.infoTopTipbar('分配经办人成功!',{});
							$scope.queryList();
							$scope.closeRollModal('assign_operate_box');
						});
					} else {
				 		tipbar.errorTopTipbar($target,'分配经办人失败,服务器返回:'+data.message,3000,9992);
					}
				});
			};

			$scope.goBack = function(){
				var flowInfo = cache.get("current_flow_info");
				if(!flowInfo || !flowInfo.custNo || !flowInfo.workFlowName){
					$location.path('/process/list');
					return;
				}
				$location.path('/process/versionList/' + flowInfo.custNo + "/" + flowInfo.workFlowName);
				// $location.path('/process/versionList/:custNo/:name');
			};

			
			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				$scope.searchData.baseId = cache.get("selected_flow").item.id;
				$scope.readonly = !!cache.get("selected_flow").readonly;

				commonService.queryBaseInfoList(BTPATH.QUERY_OPERATOR_BY_CUSTNO,{custNo:cache.get("selected_flow").custNo},$scope,'operList').success(function(){
				});

				$scope.queryList();

				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});

			});
		}]);

	};

});