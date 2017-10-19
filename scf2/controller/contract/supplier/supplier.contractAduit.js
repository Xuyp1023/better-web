
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('supplier.contractAduit',['$scope','http','$rootScope','$route','cache','$location',function($scope,http,$rootScope,$route,cache,$location){
      /*  VM绑定区域  */
      $scope.infoList = [];
      $scope.info = {};
      //分页数据
  		$scope.listPage = {
  			pageNum: 1,
  			pageSize: 10,
  			pages: 1,
  			total: 1
  		};
      $scope.searchData={
        businStatus:'0'
      };

      $scope.statusList = [
      	{name:'登记',value:'0'},
      	{name:'生效',value:'1'}
      ];


      /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
  			//弹出弹幕加载状态
  			var $mainTable = $('#search_info .main-list');
  			loading.addLoading($mainTable,common.getRootPath());
  			$scope.listPage.flag = flag? 1 : 2;/*1*/
  			http.post(BTPATH.QUERY_CONTRACT_LEDGER/*2*/,$.extend({},$scope.listPage,$scope.searchData))
  				.success(function(data){
  					//关闭加载状态弹幕
  					loading.removeLoading($mainTable);
  					if(common.isCurrentData(data)){
  						$scope.$apply(function(){
  							$scope.infoList = common.cloneArrayDeep(data.data);/*3*/
  							if(flag/*1*/){
  								$scope.listPage = data.page;/*4*/
  							}
  						});
  					}
  			});
  		};

      //打开审核/取消审核页面
      $scope.showAduitPage = function(contractId,businStatus){

          $location.url("/supplierContract/aduitInfo/"+contractId+"/"+businStatus);
      };   

			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){

		        /*公共绑定*/
		        $scope.$on('ngRepeatFinished',function(){
		        	common.resizeIframeListener();
		        });

       			$scope.queryList(true);

			});

		}]);

	};

});
