
exports.installController = function(mainApp,common){

	mainApp.controller('tableView.Swiper',['$scope','muiSupport','http','$rootScope',function($scope,muiSupport,http,$rootScope){

		//删除提示操作
		$scope.delThisItem = function(data){
			mui.confirm("是否确认删除此项?","温馨提示",function(){
				//to do it！
			});
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//创建单项选择
			
		});
	}]);

}
