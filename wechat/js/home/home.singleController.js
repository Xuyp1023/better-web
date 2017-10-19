exports.installController = function(mainApp,common){

	mainApp.controller('home.singleController',['$scope','muiSupport','http','$rootScope','$route','cache','$location',function($scope,muiSupport,http,$rootScope,$route,cache,$location){
		/*私有属性区域*/

        $scope.operCustInfo = {
            'operator':{},
            'custInfo':{}
        };

        $scope.unreadNotificationCount = '0';
		
        $scope.queryOperCustInfo = function() {
            http.post(BTPATH.FIND_OPERATOR_CUSTINFO,{})
            .success(function(data){
              if(common.isCurrentData(data)){
                $scope.$apply(function(){
                   $scope.operCustInfo = data.data;
                });
              }   
          });
        };

        //
        $scope.countUnreadNotification = function() {
            http.post(BTPATH.COUNT_UNREAD_NOTIFICATION,{})
            .success(function(data){
              if(common.isCurrentData(data)){
                $scope.$apply(function(){
                    http.post(BTPATH.COUNT_UNREAD_NOTICE,{})
                    .success(function(data1){
                      if(common.isCurrentData(data1)){
                        $scope.$apply(function(){
                          var count = data.data + data1.data;
                           if (count === 0)
                                $scope.unreadNotificationCount = '0';
                            else if (count < 100)
                                $scope.unreadNotificationCount = '' + count;
                            else if (count >= 100)
                                $scope.unreadNotificationCount = '99+';
                            else $scope.unreadNotificationCount = '0';
                        });
                      }   
                  });
                });
              }   
          });
        };


        //切换home页
        $scope.switch = function(flag){
          $location.path("home/"+flag);
        };

               
    		/*控制器执行入口*/
    		$scope.$on('$routeChangeSuccess',function(){
    			$scope.queryOperCustInfo();
                $scope.countUnreadNotification();
    		});

	}]);

};