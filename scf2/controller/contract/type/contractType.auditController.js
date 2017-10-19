
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contractType.auditController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){
      /*  VM绑定区域  */
      $scope.info = {};

			//分页数据
			$scope.listPage = {
				pageNum: 1,
				pageSize: 10
			};


      /*  业务处理绑定区域  */
			//查询合同类型
			$scope.queryList = function(flag){
				$scope.listPage.flag = flag? 1 : 2;
				http.post(BTPATH.QUERY_UNENABLE_AGREEMENTTYPE,$.extend({},$scope.listPage)).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.infoList = data.data;
							if(flag){
								$scope.listPage = data.page;
							}
						});
					}
				});
			};

			//启用合同类型
			$scope.audit = function(data) {
				cache.put("info",data);
				window.location.href = '#/contractType/contractTypeEnable';
			}



			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				common.resizeIframeListener();
				$scope.listPage.flag = 1;

				$scope.queryList(true);
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

			});
		}]);

	};

});
