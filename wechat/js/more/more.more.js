
exports.installController = function(mainApp){

	mainApp.controller('more.moreController',['$scope','$location','muiSupport',function($scope,$location,muiSupport){
		$scope.skipSecurity=function(){
			$location.path("more/security");
		}
		$scope.skipCompany=function(){
			$location.path("home/company");
		}
 
		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//创建轮播
			// muiSupport.slide('#slider');
		});
	}]);

}; 