
exports.installController = function(mainApp,common){

	mainApp.controller('recieve.detailUnController',['$scope','muiSupport','http','$rootScope','$route','cache','wx','$route','$location',
		function($scope,muiSupport,http,$rootScope,$route,cache,wx,$route,$location){
		/*私有属性区域*/
		

		$scope.info = {};	

		//跳到申请融资
		$scope.applyFinance = function(){

			http.post(BTPATH.SAVE_RECEIVABLE_REQUEST_SAVEADDREQUESTTOTAL,{receivableId:$scope.info.id}).success(function(data){
				
				if(common.isCurrentData(data)){
					cache.put('apply_finance_info',data.data);
					
					window.location.href = '#/model/financeApply/'+ data.data.requestNo;
				}
			});

			
		};	
		// 融资详情
		$scope.showDetail = function() {


			$location.path('/model/financeDetail/'+$scope.info.refNo+'/'+$scope.info.version);
		}
			

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			
			$scope.info = cache.get('recievInfo') ? cache.get('recievInfo') : {};
		});
	}]);

};
