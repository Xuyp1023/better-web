
exports.installController = function(mainApp,common){

	mainApp.controller('sign.recodeController',['$scope','muiSupport','http','$rootScope','$route','cache','wx','$route','$rootScope',
		function($scope,muiSupport,http,$rootScope,$route,cache,wx,$route,$rootScope){
		
		/*VM绑定区域*/
		$scope.infoList = {};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			$scope.infoList = cache.get('stubInfos');
		});
	}]);

};