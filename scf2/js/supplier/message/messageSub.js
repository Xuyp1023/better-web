/*
消息模板管理
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
    var base64 = require('base64');
    require('modal');
    require('date');
    require("upload");
    require('editor');


	//定义模块
	var mainApp = angular.module('mainApp',['modal','date','pagination','upload','editor']);

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
	mainApp.controller('mainController',['$scope','http','commonService','form',function($scope,http,commonService,form){
		/*VM绑定区域*/
		$scope.statusList = BTDict.BusinDataStatus.toArray('value','name');
		$scope.typeList = BTDict.ProfileType.toArray('value','name');
		$scope.custList = [];
		//==============================公共操作区 start=================================
		$scope.searchData = {
			custNo:''
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//消息模板管理列表
		$scope.infoList = [];
		//单个消息模板管理信息
		$scope.info = {};
		$scope.infoModuleList = [];
		$scope.infoModule = {};
		$scope.infoVariableList = [];
		//单个信息的模板类型
		$scope.infoModuleChannelType = [];

		//查询列表
		$scope.changeCust = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//获取消息模板管理申请列表 测试/正式路径:/ScfRequest/queryRequest
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			var $mainTable = $('#message_sub_table');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_LIST_PROFILESUB,$.extend({},$scope.listPage,$scope.searchData))
				.success(function(data){
					//关闭加载状态弹幕
					loading.removeLoading($mainTable);
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							//处理渠道列表
							for (var i = 0; i < data.data.length; i++) {
								var tempData =  data.data[i];
								tempData.channels = common.splitArray(tempData.channels,3);
							}
							$scope.infoList = common.cloneArrayDeep(data.data);
							if(flag){
								$scope.listPage = data.page;
							}
						});
					} 	
			});
		};


		//启用消息模板
		$scope.activeInfo = function($target,item){
			var $mainTable = $('#message_sub_table');
			loading.addLoading($mainTable,common.getRootPath());
			http.post(BTPATH.ACTIVE_INFO_SUB,item)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
					 	loading.removeLoading($mainTable);
				 	}
			});
		};

		//禁用消息模板
		$scope.cancelInfo = function($target,item){
			var $mainTable = $('#message_sub_table');
			loading.addLoading($mainTable,common.getRootPath());
			http.post(BTPATH.CANCEL_INFO_SUB,item)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		loading.removeLoading($mainTable);
				 	}
				 });
		};

		//改变订阅状态
		$scope.editInfo = function(target,item){
			var $target = $(target);
			if($target.is(':not(input)')) return;
			if(item.subscribed){
				$scope.activeInfo($target,item);
			}else{
				$scope.cancelInfo($target,item);
			}
		};

		//页面初始化
		$scope.initPage = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList','CustListDic').success(function(){
				$scope.searchData.custNo = $scope.custList.length>0?$scope.custList[0].value:'';
				$scope.queryList(true);
			});
			

		};

		/*
		 *模板显隐控制区域
		*/

		//打开消息模板管理编辑
		$scope.editInfoBox = function(data){
			$scope.info = data;
			$scope.queryNoticeModuleList().success(function(){
				$scope.$apply(function(){
					$scope.info.channel = $scope.infoModuleChannelType.length>0?$scope.infoModuleChannelType[0].value:'';
					$scope.changeInfoModule();
				});
				$scope.openRollModal('edit_box');
			});
		};


		//==============================公共操作区 end ==================================

		/*数据初始区域*/
		$scope.initPage();
		

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});


