
exports.installController = function(mainApp, common){

	mainApp.controller('news.personalController',['$scope','muiSupport','http','cache',function($scope,muiSupport,http,cache){
		//已读分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 3
		};		

		//列表消息
		$scope.infoList = [];

		//暂存
		$scope.unReadList = [];
		$scope.unReadPage = {};
		$scope.readList = [];
		$scope.readPage = {};
		//true|false  未读 |已读
		// $scope.right=false;		

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

		//获取到未读公告列表
		$scope.queryUnreadList = function(flag){			
			return http.post(BTPATH.QUERY_UNREAD_PERSONAL_LIST,$.extend({},$scope.listPage,{
				flag:1
			})).success(function(data){
				if(data && data.code==200){
					$scope.$apply(function(){						
						$scope.infoList= flag ? common.cloneArrayDeep(data.data):$scope.infoList.concat(data.data);
						$scope.listPage = data.page;
						//暂存
						$scope.unReadList = $scope.infoList;
						$scope.unReadPage = $scope.listPage;
					});
				}
			});
		};
		//获取到已读公告列表
		$scope.queryReadList = function(flag){			
			return http.post(BTPATH.QUERY_READ_PERSONAL_LIST,$.extend({},$scope.listPage,{
				flag:1
			})).success(function(data){
				if(data && data.code==200){
					$scope.$apply(function(){						
						$scope.infoList= flag ? common.cloneArrayDeep(data.data):$scope.infoList.concat(data.data);
						$scope.listPage = data.page;
						//暂存
						$scope.readList = $scope.infoList;
						$scope.readPage = $scope.listPage;
					});
				}
			});
		};
		// 切换到未读
		$scope.checkUnread=function(){
			$scope.right=false;
			if($scope.unReadList.length!=0){
				$scope.infoList = $scope.unReadList;
				$scope.listPage = $scope.unReadPage;
				return;
			}
			$scope.infoList=[];
			$scope.listPage={
				pageNum: 1,
				pageSize: 3
			}; 
			$scope.queryUnreadList(true);
			//$scope.queryUnreadNotificationCount();
		}
		// 切换到已读
		$scope.checkRead=function(){
			$scope.right=true;
			if($scope.readList.length!=0){
				$scope.infoList = $scope.readList;
				$scope.listPage = $scope.readPage;
				return;
			}
			$scope.infoList=[];
			$scope.listPage={
				pageNum: 1,
				pageSize: 3
			}; 
			$scope.queryReadList(true);
			//$scope.queryUnreadNotificationCount();
		}
 		//查询更多
		$scope.queryMore = function(flag){
			if($scope.right)
				return $scope.queryReadList(flag);
			else
				return $scope.queryUnreadList(flag);
				
		} 
		$scope.checkDetail=function(){
			//在查看详情时，保存right变量的值
			cache.put("right",{"readStatus":$scope.right});
		}
		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			$scope.right = (cache.get("right")&&cache.get("right").readStatus) || $scope.right;	
			if($scope.right){
				$scope.queryReadList(true);
				$scope.unReadPage=cache.get("total");
			}
			else{
				$scope.queryUnreadList(true).success(function(){
					cache.put("total",$scope.unReadPage);
				});								
			}
			
		});
	}]);

}; 