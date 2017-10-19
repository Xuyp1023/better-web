
exports.installController = function(mainApp,common){

	mainApp.controller('account.successController',['$scope','muiSupport','http','$rootScope','cache','wx',function($scope,muiSupport,http,$rootScope,cache,wx){

		/*获取数据区域*/
		$scope.toHome = function(){
			window.location.href = BTServerPath+'/Wechat/wxRequest/toHome';
		}


		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
		});
	}]);

}