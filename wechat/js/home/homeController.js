
exports.installController = function(mainApp){

	mainApp.controller('homeController',['$scope','muiSupport',function($scope,muiSupport){
		/*VM绑定区域*/
		$scope.name = '小明1';
		$scope.person = {
			age:19
		};

 
		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//创建轮播
			muiSupport.slide('#slider');
		});
	}]);

};