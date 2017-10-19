/*
份额查询
作者:tanp
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

	//兼容IE模式
	// .config(function($sceProvider){
	// 	$sceProvider.enabled(false);
	// })

	//控制器区域
	mainApp.controller('mainController',['$scope','http',function($scope,http){
		/*VM绑定区域*/
		//基金销售机构
		$scope.statusList = BTDict.SaleAgency.toArray('value','name');
		
		$scope.searchData = {
			agencyNo:''
			// GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			// LTEregDate:new Date().format('YYYY-MM-DD')
		};
		
		//结果列表
		$scope.infoList = [];
		
		/*事件处理区域*/
		$scope.queryList = function(){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			// http.post(common.getRootPath()+"/p/testdata/testQueryShare.json",$.extend({},$scope.searchData))
			http.post(common.getRootPath()+"/fundQuery/queryShareInfo",$.extend({},$scope.searchData))
				.success(function(data){
					//关闭加载状态弹幕
					loading.removeLoading($mainTable);
					if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)&&data.data.shareList){
						$scope.$apply(function(){
							$scope.infoList = common.cloneArrayDeep(data.data.shareList);
							//保有份额合计
							$scope.totalLastShares=data.data.totalLastShares;
						});
					} 	
			});
		};

		//页面初始化
		$scope.initPage = function(){
			$scope.queryList();
		};

		/*公共绑定*/
		$scope.$on('ngRepeatFinished',function(){
			common.resizeIframe();  
		});

		/*数据初始区域*/
		$scope.initPage();
		

	}]);


	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

