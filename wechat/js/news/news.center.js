
exports.installController = function(mainApp, common){

	mainApp.controller('news.cneterController',['$scope','$location','muiSupport','http',function($scope,$location,muiSupport,http){
		/*VM绑定区域*/

		//提醒列表
		$scope.unreadNotificationCount = '0';
		$scope.unreadNoticeCount = '0';

		// 实现公告消息和个人消息页面的跳转
		$scope.skipPublic=function(){
			$location.path('/news/notice');
		}
		$scope.skipPersonal=function(){
			$location.path('/news/personal');
		}
	
			
		$scope.queryUnreadNotificationCount = function() {
			http.post(BTPATH.COUNT_UNREAD_NOTIFICATION,{})
		    .success(function(data){
		      if(common.isCurrentData(data)){
		        $scope.$apply(function(){
		        	if (data.data && data.data === 0)
		        		$scope.unreadNotificationCount = '0';
		        	else if (data.data && data.data < 100)
						$scope.unreadNotificationCount = '' + data.data;
					else if (data.data && data.data >= 100)
						$scope.unreadNotificationCount = '99+';
					else $scope.unreadNotificationCount = '0';
		        });
		      }   
		  });
		};

		$scope.queryUnreadNoticeCount = function() {
			http.post(BTPATH.COUNT_UNREAD_NOTICE,{})
		    .success(function(data){
		      if(common.isCurrentData(data)){
		        $scope.$apply(function(){
		        	if (data.data && data.data === 0)
		        		$scope.unreadNoticeCount = '0';
		        	else if (data.data && data.data < 100)
						$scope.unreadNoticeCount = '' + data.data;
					else if (data.data && data.data >= 100)
						$scope.unreadNoticeCount = '99+';
					else $scope.unreadNoticeCount = '0';
		        });
		      }   
		  });
		};

 
		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			$scope.queryUnreadNotificationCount();
			$scope.queryUnreadNoticeCount();		
		});
	}]);

}; 