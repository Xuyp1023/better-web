
exports.installController = function(mainApp,common){

	mainApp.controller('relation.factorShowController',['$scope','muiSupport','http','$rootScope','cache',function($scope,muiSupport,http,$rootScope,cache){

		//VM绑定区域

		//列表
		$scope.factorList = [];

		/*获取数据区域*/

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//获取申请列表
			$scope.factorList = cache.get("apply_related_factor");
			setTimeout(function(){
				location.href = '#/relation/manage';
			},5000);
		});
	}]);

};