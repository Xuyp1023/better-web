
exports.installController = function(mainApp){

	mainApp.controller('lead.enquiryController',['$scope','$location','muiSupport',function($scope,$location,muiSupport){

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//创建轮播
			// muiSupport.slide('#slider');
		});
	}]);

}; 