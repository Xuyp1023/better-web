
exports.installController = function(mainApp,common){

	mainApp.controller('relation.coreDetailController',['$scope','muiSupport','http','$rootScope','cache',function($scope,muiSupport,http,$rootScope,cache){

		//VM绑定区域

		//关联的核心企业
		$scope.info = {
			relateCustname:''
		};
		/*获取数据区域*/

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//获取详情信息
			$scope.info = cache.get("detail_info");
		});
	}]);

};

