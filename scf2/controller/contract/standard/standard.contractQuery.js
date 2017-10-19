
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('standard.contractQuery',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
      $scope.infoList = [];

      $scope.typeList = [];

       $scope.List = [];

      $scope.businessTypeList = [];

      $scope.info = {};
			$scope.searchData = {
				typeId:''
			};



      /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
  			//弹出弹幕加载状态
  			var $mainTable = $('#search_info .main-list');
  			loading.addLoading($mainTable,common.getRootPath());
  			http.post(BTPATH.QUERY_CONTRACT_STANDARD_TYPE_LIST/*2*/,$.extend({},$scope.searchData))
  				.success(function(data){
  					//关闭加载状态弹幕
  					loading.removeLoading($mainTable);
  					if(common.isCurrentData(data)){
  						$scope.$apply(function(){
  							$scope.infoList = common.cloneArrayDeep(data.data);/*3*/
  					
  						});
  					}
  			});
  		};

			$scope.detail = function(data) {
				cache.put("info",data);
				window.location.href = '#/standardContract/detail';
			}


			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
          
          commonService.queryBaseInfoList(BTPATH.FIND_ENABLE_AGREEMENTTYPE,{},$scope,'List').success(function(){
            commonService.queryBaseInfoList(BTPATH.QUERY_BUSINESS_TYPE_SIMPLE_LIST,{},$scope,'businessTypeList','BusinessTypeListDict').success(function(){
              $scope.queryList();
          
            });
				 });
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

			});
		}]);

	};

});
