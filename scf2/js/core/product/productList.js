/*
产品查询
作者:bhg
*/
define(function(require,exports,module){
	require.async(['dicTool','bootstrap',"datePicker"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("validate");
    var tipbar = require("tooltip");
    var common = require("common");
    var loading = require("loading");
    var comdirect = require("direct");
    var dialog = require("dialog");
    var comfilter = require("filter");
    var comservice = require("service_s2");
    var BTPATH = require("path_s2");
    var pages = require("pages");
    require('modal');
    require('date');
    require("upload");

	//定义模块
	var mainApp = angular.module('mainApp',['modal','date','pagination','upload']);

	//扩充公共指令库
	comdirect.direcPlus(mainApp);
	//扩充公共过滤器
	comfilter.filterPlus(mainApp);
	//扩充公共服务
	comservice.servPlus(mainApp);


	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService',function($scope,http,commonService){
		/*VM绑定区域*/
		//状态类型
		$scope.statusList = BTDict.FinanceProductStatus.toArray('value','name');
		//融资类型
		$scope.financeTypeList = BTDict.FinanceType.toArray('value','name');
		//保理类型
		$scope.factorTypeList = BTDict.FactorType.toArray('value','name');
		//用户公司列表
		$scope.custList = [];

		//获取客户类型

		//核心企业列表
		$scope.coreCustList = [];
		$scope.isSelectShow = true;
		$scope.searchData = {
			coreCustNo:''
		};
		//产品列表
		$scope.infoList = [];
		//单个产品信息
		$scope.info = {};

		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};

		/*事件处理区域*/
		//查询产品
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//获取产品申请列表
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_PRODUCT_BYCORE,$.extend({},$scope.listPage,{coreCustNo:$scope.searchData.coreCustNo}))
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

		/*
		 *模板显隐控制区域
		*/

		//打开产品详情
		$scope.detailInfoBox = function(data){
			$scope.info = data;
			$scope.openRollModal('detail_box');
		};


		//初始化页面
		commonService.initPage(function(){
		    //当前操作员下机构（保理商列表）
		    commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList','coreCustListDict').success(function(){
		      $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
		      //查询产品列表
		      $scope.queryList(true);
		    });
		    
		});
		

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

