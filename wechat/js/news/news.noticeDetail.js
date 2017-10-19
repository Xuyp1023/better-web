
exports.installController = function(mainApp,common,base64){

	mainApp.controller('news.noticeDetailController',['$scope','muiSupport','http','$route',function($scope,muiSupport,http,$route){

		$scope.detail={};		

		//获取到公告内容
		$scope.queryNewsDetail = function(id){
			//true|false 已读|未读  
			// var url = flag ? '' :BTPATH.QUERY_UNREAD_NOTICE_LIST;
			return http.post(BTPATH.QUERY_DETAIL_NOTICE,{'id':id}).success(function(data){
				if(data && data.code==200){
					$scope.$apply(function(){						
						$scope.detail  = data.data;		
						document.getElementById("content").innerHTML=base64.uriBase64Decode(data.data.content);		
						
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
				// 公告置已读 SET_READ_NOTICE	
				http.post(BTPATH.SET_READ_NOTICE,{'id':id}).success(function(data) {

				});
			});
		});
	}]);

}; 