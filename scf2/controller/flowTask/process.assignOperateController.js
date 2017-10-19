/*
分配操作员
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('process.assignOperateController',['$scope','http','$rootScope','$route','cache','commonService', '$location',function($scope,http,$rootScope,$route,cache,commonService, $location){

			$scope.info = {operator:''};
			$scope.operatorList = [];

			$scope.assignOperator = function() {
				http.post(BTPATH.ASSIGN_WORKFLOW_OPERATOR,{taskId:$scope.info.taskId, operId:$scope.info.operator}).success(function(data){
					if(common.isCurrentData(data)){
						tipbar.infoTopTipbar('分配操作员成功!',{});
						$scope.$apply(function(){
							$location.path("/flowTask/processMonitoring");
						});
					}
				});
			};

			//返回
			$scope.goBack = function(){
				//window.history.back();
				$location.path("/flowTask/processMonitoring");
			};

			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				common.resizeIframeListener();
				//获取修改对象
				$scope.info = cache.get("CURRENT_WORKFLOW_ITEM");

				commonService.queryBaseInfoList(BTPATH.QUERY_OPERATOR_BY_CUSTNO,{custNo:$scope.info.workFlowBase.custNo},$scope,'operatorList').success(function(){
					$scope.$apply(function() {
						var actorArray = $scope.info.actors[0].split(':');
						if (actorArray[0] === 'OperId') {
							$scope.info.operator = actorArray[1];
						} else {
							$scope.info.operator = common.filterArrayFirst($scope.operatorList);
						}
					});
				});

				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});
		}]);

	};

});