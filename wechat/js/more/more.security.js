
exports.installController = function(mainApp){

	mainApp.controller('more.securityController',['$scope','muiSupport','http',function($scope,muiSupport,http){
		// 个人信息
		$scope.info = {};


	      //获取数据列表
	      $scope.queryinforma = function(){
	      	 http.post(BTPATH.FIND_OPERATOR_INFO,{}).success(function(data){
	      		if(data && data.code==200){
	      			$scope.$apply(function(){
						$scope.info = data.data;
	      			});
	      		}
	      	});
	      }
	               
			/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			$scope.queryinforma();
		});
      
	}]);

}; 