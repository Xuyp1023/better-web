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
		$scope.statusList = BTDict.NotificationProfileStatus.toArray('value','name');
		$scope.typeList = BTDict.ProfileType.toArray('value','name');
		$scope.custList = [];
		$scope.moduleChannelType = BTDict.NoticeSendChanel.toArray('value','name');
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

		//custNo
		$scope.custNo = '';

		//查询列表
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//获取消息模板管理申请列表 测试/正式路径:/ScfRequest/queryRequest
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_LIST_NOTICEPROFILE,$.extend({},$scope.listPage,$scope.searchData))
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

		//获取消息模板列表
		$scope.queryNoticeModuleList = function(){
			return http.post(BTPATH.QUERY_LIST_NOTICEMODULE,{profileId:$scope.info.id,custNo:$scope.info.custNo}).success(function(data){
				if(common.isCurrentData(data)){
					var moduleList = data.data,
						channelIds = ArrayPlus(moduleList).extractChildArray('channel');
					$scope.$apply(function(){
						$scope.infoModuleChannelType = ArrayPlus($scope.moduleChannelType).extractByAnotherArray(channelIds,'value');
						$scope.infoModuleList = moduleList;
					});
				}
			});
		};

		//查询预处理规则
		$scope.queryVariableList = function(){
			return http.post(BTPATH.QUERY_LIST_PREVARIABLE,{channelProfileId:$scope.infoModule.id}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.infoVariableList = data.data;
					});
				}
			});
		};

		//获取对应的模板信息
		$scope.changeInfoModule = function(custNo){
			var $mainTable = $('#edit_box .table-module');
			loading.addLoading($mainTable,BTServerPath);
			var channel = $scope.info.channel;
			if((!!channel)&&channel!==''){
				$scope.infoModule = ArrayPlus($scope.infoModuleList).objectChildFilter('channel',channel)[0];
				$scope.infoModule.custNo = $scope.custNo;
				var ue = UE.loadEditor('message_editor');
				ue.setContent($scope.infoModule.content);
			}
			$scope.queryVariableList();
			loading.removeLoading($mainTable);
		};

		//编辑消息模板管理
		$scope.editInfo = function(target){
			var $target = $(target);
			var infoModule = $.extend({},$scope.infoModule);
			infoModule.channelProfileId = infoModule.id;
			infoModule.content = base64.uriBase64Encode(UE.loadEditor('message_editor').getContent());
			infoModule.contentText = UE.loadEditor('message_editor').getContentTxt();
			http.post(BTPATH.EDIT_INFO_CHANNELMODULE,infoModule)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		tipbar.errorTopTipbar($target,'修改消息模板成功!',3000,6662);
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'修改消息模板失败,服务器返回:'+data.message,3000,6662);
				 	}
				 });
		};

		//启用消息模板
		$scope.activeInfo = function(target,item){
			var $target = $(target);
			dialog.confirm('请确认是否激活该条消息模板?',function(){
				http.post(BTPATH.ACTIVE_INFO_NOTICEMODULE,{id:item.id,custNo:item.custNo})
					 .success(function(data){
					 	if(common.isCurrentResponse(data)){
					 		$scope.queryList(true);
					 	}else{
					 		tipbar.errorLeftTipbar($target,'激活消息模板失败,服务器返回:'+data.message,3000,6662);
					 	}
					 });
			});
		};

		//禁用消息模板
		$scope.cancelInfo = function(target,item){
			var $target = $(target);
			dialog.confirm('请确认是否激活该条消息模板?',function(){
				http.post(BTPATH.CANCEL_INFO_NOTICEMODULE,{id:item.id,custNo:item.custNo})
					 .success(function(data){
					 	if(common.isCurrentResponse(data)){
					 		$scope.queryList(true);
					 	}else{
					 		tipbar.errorLeftTipbar($target,'禁用消息模板失败,服务器返回:'+data.message,3000,6662);
					 	}
					 });
			});
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
			$scope.custNo = data.custNo;
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
