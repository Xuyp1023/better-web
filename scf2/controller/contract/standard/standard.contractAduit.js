
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('standard.contractAduit',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){
      /*  VM绑定区域  */
			$scope.businStatusList = BTDict.ContractStandardTypeBusinStatus.toArray('value','name');
      $scope.infoList = [];
      $scope.info = {};
			$scope.searchData= {
				businStatus:''
			};
      //分页数据
  		$scope.listPage = {
  			pageNum: 1,
  			pageSize: 10,
  			pages: 1,
  			total: 1
  		};

      /*  业务处理绑定区域  */
      $scope.queryList = function(flag){
  			//弹出弹幕加载状态
  			var $mainTable = $('#search_info .main-list');
  			loading.addLoading($mainTable,common.getRootPath());
  			$scope.listPage.flag = flag? 1 : 2;
/*  			http.post(BTPATH.QUERY_AGREEMENT_CONTRANCT_BYSTATUS,$.extend({},$scope.listPage,$scope.searchData))
*/  			http.post(BTPATH.QUERY_ALL_CONTRACT_STANDARD_LIST,$.extend({},$scope.listPage,$scope.searchData))
  				.success(function(data){
  					//关闭加载状态弹幕
  					loading.removeLoading($mainTable);
  					if(common.isCurrentData(data)){
  						$scope.$apply(function(){
  							$scope.infoList = common.cloneArrayDeep(data.data);
  							if(flag){
  								$scope.listPage = data.page;
  							}
  						});
  					}
  			});
  		};

			//控制显示
			$scope.isCanDisable = function(data) {
				var businStatus = data.businStatus;
				return ArrayPlus(['1']).isContain(businStatus);
			}
			$scope.isCanEnable = function(data) {
				var businStatus = data.businStatus;
				return ArrayPlus(['0','2']).isContain(businStatus);
			}

			$scope.statusQuery = function() {
				$scope.queryList(true);
			}

			$scope.enable = function(data) {
				cache.put("info",data);
				window.location.href = '#/standardContract/active';
			}

			$scope.disable = function(data) {
				cache.put("info",data);
				window.location.href = '#/standardContract/cancel';
			}



			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				$scope.queryList(true);
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

			});
		}]);

	};

});
