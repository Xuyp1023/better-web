
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('plat.custInfoController',['$scope','http','$rootScope','$route','cache','$location',function($scope,http,$rootScope,$route,cache,$location){
			/*VM绑定区域*/

			//分页数据
			$scope.listPage = {
				pageNum: 1,
				pageSize: 10,
				pages: 1,
				total: 1
			};

			$scope.queryList = function(flag) {
				$scope.listPage.flag = flag? 1 : 2;
				return http.post(BTPATH.QUERY_CUSTINFO_PLATFORM,$scope.listPage).success(function(data){
					if(data&&(data.code === 200)){
						$scope.$apply(function(){
							$scope.infoList = data.data;
							if(flag){
							  $scope.listPage = data.page;
							}
						});
					} else {
						tipbar.infoTopTipbar('状态查询失败，服务端返回信息:'+data.message,{
						    msg_box_cls : 'alert alert-warning alert-block',
						    during:2000
						});
					}
				});
			};

			//打开详情
			$scope.openInfo = function(item){
				$location.path("/plat/custInfoDetail/" + item.tmpInfo.id);
			};


			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){

				$scope.queryList(true).success(function(){
					common.resizeIframeListener();
				});

				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});
		}]);

	};

});