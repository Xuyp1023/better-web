/*
已办任务
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('task.finishedController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){

			//已办任务列表
			$scope.infoList = [];
			
			$scope.listPage = {
				pageNum: 1,
				pageSize: 10,
				pages: 1,
				total: 1
			};

			$scope.searchData = {
				title:'',
				GTEauditDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
				LTEauditDate:new Date().format('YYYY-MM-DD')
			};

			$scope.showDetail = function(item) {
				cache.put("WORKFLOW_TASK_FLAG", 'readonly');
				cache.put("currentTask", item);
				cache.put("flow_origin_flag", {'flag':'finished'});
				window.location.href="flow.html#" + item.workFlowBase.form;
			};

			//查看流程图
			$scope.showWorkFlowGraph = function(item) {
				// debugger;
				window.location.href = "../WorkFlow/displayDiagram?processId=" + item.processId + "&orderId=" + item.orderId;
			};

			//查询已办任务列表
			$scope.queryList = function(flag) {
				$scope.listPage.flag = flag? 1 : 2;/*1*/
				$scope.searchData.status = $scope.searchData.businStatus;
				var $mainTable = $('#search_info .main-list');
				loading.addLoading($mainTable,common.getRootPath());
				http.post(BTPATH.QUERY_WORKFLOW_HISTORY_TASK/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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
				common.resizeIframeListener();
				//获取修改对象
				$scope.queryList();

				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});
		}]);

	};

});