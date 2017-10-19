
exports.installController = function(mainApp,common){

	mainApp.controller('open.waitAuditController',['$scope','muiSupport','http','$rootScope','cache',function($scope,muiSupport,http,$rootScope,cache){
		/*私有属性区域*/
		

		/*获取数据区域*/
		

		


		

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			
			http.post(BTPATH.FIND_CUST_OPEN_ACCOUNT_TMP,{}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data;
					});
					cache.put("account_info",$scope.info);
				}
			});

		});
	}]);

};