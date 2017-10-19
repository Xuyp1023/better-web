/*
交易查询
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
		
		//交易日期
		$scope.searchData = {
			GTEtradeDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEtradeDate:new Date().format('YYYY-MM-DD'),
			agencyNo:'',
			businFlag:'22'
		};
		//销售机构
		$scope.agencyList = BTDict.SaleAgency.toArray('value','name');
		//业务类型
		$scope.businessList = function(){
			BTDict.tempBusinQueryFlag = new ListMap();
			BTDict.tempBusinQueryFlag.set('22','申购');
			BTDict.tempBusinQueryFlag.set('24','赎回');
			BTDict.tempBusinQueryFlag.set('37','基金转换入');
			BTDict.tempBusinQueryFlag.set('38','基金转换出');
			return BTDict.tempBusinQueryFlag.toArray('value','name');
		}();
		
		//结果列表
		$scope.infoList = [];
		
		/*事件处理区域*/
		$scope.queryList = function(){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			http.post(common.getRootPath()+"/fundQuery/queryTradeInfo",$.extend({},$scope.searchData))
				.success(function(data){
					//关闭加载状态弹幕
					loading.removeLoading($mainTable);
					if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)&&data.data.tradeList){
						$scope.$apply(function(){
							$scope.infoList = common.cloneArrayDeep(data.data.tradeList);
							//合计金额
							$scope.totalBalance=data.data.totalBalance;
							//合计确认金额
							$scope.totalConfirmBalance=data.data.totalConfirmBalance;
							$scope.totalConfirmShares=data.data.totalConfirmShares;
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

