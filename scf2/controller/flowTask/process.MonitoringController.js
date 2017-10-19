/*
流程监控
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('process.MonitoringController',['$scope','http','$rootScope','$route','cache', '$timeout', 'commonService',function($scope,http,$rootScope,$route,cache,$timeout, commonService){

			//详情
			$scope.infoList = [];

			$scope.custList = [];
			
			$scope.listPage = {
				pageNum: 1,
				pageSize: 10,
				pages: 1,
				total: 1
			};

			//搜索所需信息
			$scope.searchData = {
				custNo:'',
				title:'',
				GTEauditDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
				LTEauditDate:new Date().format('YYYY-MM-DD')
			};

			$scope.showWorkFlowGraph = function(item) {
				// debugger;
				window.location.href = "../WorkFlow/displayDiagram?processId=" + item.processId + "&orderId=" + item.orderId;
			};

			//打开调配操作员模板
			$scope.assignOperatorBox = function(item){
				cache.put("CURRENT_WORKFLOW_ITEM", item);
				window.location.href="#/flowTask/assignOperator";
			};

			$scope.queryList = function(flag) {
				$scope.listPage.flag = flag? 1 : 2;/*1*/
				$scope.searchData.status = $scope.searchData.businStatus;
				var $mainTable = $('#search_info .main-list');
				loading.addLoading($mainTable,common.getRootPath());
				http.post(BTPATH.QUERY_WORKFLOW_MONITOR_TASK/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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

				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
					$scope.searchData.custNo = $scope.custList[0] ? $scope.custList[0].value : '';
					$scope.queryList(true);
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