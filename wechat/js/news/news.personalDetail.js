
exports.installController = function(mainApp){

	mainApp.controller('news.personalDetailController',['$scope','muiSupport','http','$route',function($scope,muiSupport,http,$route){

		$scope.detail={};	
		// 

		//获取到公告内容
		$scope.queryNewsDetail = function(id){
			//true|false 已读|未读  
			// var url = flag ? '' :BTPATH.QUERY_UNREAD_NOTICE_LIST;
			return http.post(BTPATH.QUERY_DETAIL_PERSONAL,{'id':id}).success(function(data){
				if(data && data.code==200){
					$scope.$apply(function(){						
						$scope.detail  = data.data;	
						document.getElementById("content").innerHTML=data.data.content;
					});
				}
			});
		};	


 
		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//创建轮播
			var id= $route.current.pathParams.id;	
			// muiSupport.slide('#slider');
			$scope.queryNewsDetail(id).success(function(data) {
				// 如果 未读，置已读  SET_READ_NOTIFICATION
				http.post(BTPATH.SET_READ_NOTIFICATION,{'id':id}).success(function(data) {

				});
			});
		});
	}]);

}; 