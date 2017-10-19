/*
合同原型
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contract.prototypeController',['$scope','http','commonService','$rootScope','$route','cache','$timeout','$location',function($scope,http,commonService,$rootScope,$route,cache,$timeout,$location){

			//VM绑定区域
			//保理公司列表
			$scope.custList = [];
			//合同模板类型
			$scope.contractTempTypes = BTDict.ContractTempType.toArray("value","name");

			//查询条件
			$scope.searchData = {
				'factorNo':'',
				'templateType':''/*common.filterArrayFirst($scope.contractTempTypes)*/
			};

			

			//合同列表
			$scope.infoList = [];

			//分页参数
			$scope.listPage = {
				pageNum: 1,
				pageSize: 10,
				pages: 1,
				total: 1
			};

			//页面初始化
			/*$scope.initPage = function(){
				
			};*/


	       //开启编辑合同
	       $scope.editInfo = function(item){
	       		cache.put("modify_info",item);
	       	 	$location.path('/contract.prototype/edit');
	       };
           //开启添加合同
	       $scope.addInfo = function(item){
	       		cache.put("modify_info_searchData",$scope.searchData);
	       	 	$location.path('/contract.prototype/add');
	       };



			//查询合同列表
			//重新从第一页加载数据
			$scope.serchList = function(){
	            $scope.listPage.pageNum = 1;
	            $scope.queryList(true);//调用刷新方法传入true
			};
	    
	    	//定义刷新方法 刷新表格数据
	    	$scope.queryList = function(flag){
	    		$scope.listPage.flag = flag? 1 : 2;
	    		var $mainTable = $('#search_info .main-list');
	    		loading.addLoading($mainTable,common.getRootPath());
	    		return http.post(BTPATH.QUERY_TEMPLATE,$.extend({},$scope.listPage,$scope.searchData))
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


            //数据初始化区域
            //$scope.initPage();


			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){

				commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{'custType':'2,3'},$scope,'custList').success(function(){
					$scope.searchData.factorNo = $scope.custList.length>0?$scope.custList[0].value:'';
					$scope.queryList(true).success(function(){
						common.resizeIframeListener();
					});;
				});

				/*公共绑定*/
				$rootScope.$on('ngRepeatFinished',function(){
					$timeout(function(){
						common.resizeIframeListener();  
					});
				});
			});
			
		}]);

	};

});