/*
待办任务
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('task.backlogController',['$scope','http','$rootScope','$route','cache','$timeout',function($scope,http,$rootScope,$route,cache,$timeout){

			//待办任务列表
			$scope.infoList = [];
			//分页参数
			$scope.listPage = {
				pageNum: 1,
				pageSize: 10,
				pages: 1,
				total: 1
			};
			//查询条件
			$scope.searchData = {
				title:'',
				GTEauditDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
				LTEauditDate:new Date().format('YYYY-MM-DD')
			};

			//打开流程办理 详情页面
			$scope.openForm = function(item) {
				cache.put("WORKFLOW_TASK_FLAG", 'operate');
				cache.put("currentTask", item);
				cache.put("flow_origin_flag", {'flag':'waitHandle'});
				window.location.href="flow.html#" + item.workFlowNode.form;
			};

			//查看流程图
			$scope.showWorkFlowGraph = function(item) {
				window.location.href = "../WorkFlow/displayDiagram?processId=" + item.processId + "&orderId=" + item.orderId;
			};

			//查询待办列表
			$scope.queryList = function(flag) {
				$scope.listPage.flag = flag? 1 : 2;/*1*/
				$scope.searchData.status = $scope.searchData.businStatus;
				var $mainTable = $('#search_info .main-list');
				loading.addLoading($mainTable,common.getRootPath());
				return http.post(BTPATH.QUERY_WORKFLOW_CURRENT_TASK/*2*/,$.extend({},$scope.listPage,$scope.searchData))
					.success(function(data){
						//关闭加载状态弹幕
						loading.removeLoading($mainTable);
						if(common.isCurrentData(data)){
							$scope.$apply(function(){
								$scope.infoList = common.cloneArrayDeep(data.data);/*3*/
								$scope.listPage = data.page;/*4*/
							});
						} 	
				});
			};
			


			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				//获取修改对象
				$scope.queryList().success(function(){
					common.resizeIframeListener();
				});

				/*公共绑定*/
				$rootScope.$on('ngRepeatFinished',function(){
					$timeout(function(){
						common.resizeIframeListener();  
					});
				});
				
			});
		}]);

	};

});