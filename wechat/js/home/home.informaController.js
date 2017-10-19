exports.installController = function(mainApp,common){

	mainApp.controller('home.informaController',['$scope','muiSupport','http','$rootScope','$route','cache',function($scope,muiSupport,http,$rootScope,$route,cache){
		/*私有属性区域*/
		
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

}