
exports.installController = function(mainApp,common){

	mainApp.controller('flowRecordController',['$scope','muiSupport','http','$rootScope','$route','cache',function($scope,muiSupport,http,$rootScope,$route,cache){
		/*私有属性区域*/
		

		$rootScope.resultDict = [{value:0, name:'通过'},{value:1, name:'驳回'},{value:2, name:'作废'}];

		$rootScope.auditRecord = [];

		$rootScope.currentTask = cache.get("currentTask");

		$rootScope.auditListPage = {
			pageNum: 1,
			pageSize: 10
		};

		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10
		};




		//查询融资列表
		$rootScope.queryAuditRecord = function(flag) {
			$rootScope.auditListPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_WORKFLOW_AUDIT_LIST,$.extend({businessId:$rootScope.currentTask.workFlowBusiness.businessId}, $rootScope.auditListPage)).success(function(data){
				if(common.isCurrentData(data)){
					$rootScope.$apply(function(){
						$rootScope.auditRecord = data.data;
						if(flag/*1*/){
							$rootScope.auditListPage = data.page;/*4*/
						}
					});
				}
			});
		};

	
		//

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			$scope.queryAuditRecord(true);
		});
	}]);

}
