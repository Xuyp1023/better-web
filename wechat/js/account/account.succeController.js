
exports.installController = function(mainApp,common){

	mainApp.controller('account.succeController',['$scope','muiSupport','http','$rootScope','cache',function($scope,muiSupport,http,$rootScope,cache){
		/*私有属性区域*/
		

		/*获取数据区域*/
		 
		$scope.openBusin = function() {
			window.location.href = '#/home/finance';
		}
		


		

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			http.post(BTPATH.FIND_SUCCESS_OPEN_ACCOUNT_TMP,{}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data;
					});
					cache.put("account_info",$scope.info);
				}
			});

		});
	}]);

}