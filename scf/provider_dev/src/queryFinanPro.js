/*
还款计划 
作者:bhg
*/
define(function(require,exports,module){
	require.async(['dicTool','bootstrap',"datePicker"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("./libs/validate");
    var tipbar = require("./libs/tooltip");
    var common = require("./libs/common");
    var loading = require("./libs/loading");
    var comdirect = require("./libs/commondirect");
    var comfilter = require("./libs/commonfilter");
    var comservice = require("./libs/commonservice");
    var BTPATH = require("./libs/commonpath");
	
	require('angular');

	//定义模块
	var mainApp = angular.module('mainApp',[]);

	//扩充公共服务
	comservice.servPlus(mainApp);

	//扩充公共指令库
	comdirect.direcPlus(mainApp);
	//扩充公共过滤器
	comfilter.filterPlus(mainApp);

	//兼容IE模式
	// .config(function($sceProvider){
	// 	$sceProvider.enabled(false);
	// })

	//控制器区域
	mainApp.controller('mainController',['$scope','commonService',function($scope,commonService){
		/*VM绑定区域*/
		//金融产品列表
		$scope.infoList = [];

		//金融产品信息
		$scope.info = {};

		//金融产品选中ID
		$scope.selectId = '';

		/*事件处理区*/
		//处理产品选择事件
		$scope.changePro = function(){
			$scope.queryInfo($scope.selectId);
		};

		/*业务数据处理区*/
		//获取单个金融产品信息
		$scope.queryInfo = function(proId){
			loading.addLoading($('#pro_info'),common.getRootPath());
			$.post(BTPATH.FAC_PRO_SIG_PATH,{productId:proId},function(data){
				loading.removeLoading($('#pro_info'));
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.info = data.data;
					}); 
				}
			},'json');
		};

		/*页面初始化*/
		commonService.initPage(function(){
			//获取金融产品的列表
			commonService.queryDicList(BTPATH.FAC_PRO_ALL_PATH,{},function(data){
				$scope.$apply(function(){
					$scope.infoList = data;
				});
				//获取单个信息
				$scope.queryInfo(data[0].value);
			});
		});

	}]);

	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

