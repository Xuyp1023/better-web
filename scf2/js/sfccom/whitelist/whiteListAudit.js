/*
客户白名单审核
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

	//控制器区域
	mainApp.controller('mainController',['$scope','http','cache',function($scope,http,cache){
		/*VM绑定区域*/
		$scope.statusList = ArrayPlus(BTDict.CustWhitelistStatus.toArray('value','name')).extractChildArrayByindexArray(['2','3']);
		$scope.typeList = BTDict.BlacklistType.toArray('value','name');
		$scope.creditInfo = [];
		$scope.isSelectShow = true;
		$scope.searchData = {
			businStatus:$scope.statusList[0].value
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//客户白名单受理列表
		$scope.infoList = [];

		//单个客户白名单受理信息
		$scope.info = {
			businStatus:""
		};

		//客户类型
		$scope.CustWhiteTypeList=BTDict.CustWhitelistType.toArray('value','name');

		/*事件处理区域*/
		//查询客户白名单受理列表
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//获取客户白名单受理列表
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_AUDIT_WHITELIST,$.extend({},$scope.listPage,$scope.searchData))
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

		//白名单审批意见提交
		$scope.acceptInfo = function(target){
			var $target = $(target);
			http.post(BTPATH.AUDIT_WHITELIST,{id:$scope.info.id,auditOpinion:$scope.auditOpinion})
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		$scope.closeRollModal('accept_white_list_box','fast',function(){
				 			dialog.success('白名单审批成功!',3000);
				 		});
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'提交失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//白名单审批驳回意见提交
		$scope.rejectInfo = function(target){
			var $target = $(target);
			http.post(BTPATH.AUDIT_REJECT_WHITELIST,{id:$scope.info.id,auditOpinion:$scope.auditOpinion})
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		$scope.closeRollModal('reject_white_list_box','fast',function(){
				 			dialog.success('白名单审批驳回成功!',3000);
				 		});
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'提交失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		/*//判断白名单状态
		$scope.businStatusTF= function(item){
			$scope.info = item;
			if ($scope.info.businStatus==='1') {
				return true;
			}
		}
		*/

		//页面初始化
		$scope.initPage = function(){
			$scope.queryList(true);
		};

		/*
		 *模板显隐控制区域
		*/
		//打开白名单受理
		$scope.acceptWhiteList = function(item){
			$scope.info = item;
			/*$scope.openRollModal('accept_white_list_box');*/
			cache.put('relateType',item.relateType);
			window.location.href = window.BTServerPath + '/scf2/home.html#/customerRelation/openFactorAudit/'+item.custNo;
		};

		
		//打开详情
		$scope.openInfo = function(item){
			$scope.info = item;
			//从白名单审核-》查看开通保理业务详情
			cache.put("factor_detail_orgin",'whiteListAudit');
			cache.put('relateType',item.relateType);
			window.location.href = window.BTServerPath + '/scf2/home.html#/customerRelation/qiefactorDetail/'+item.custNo;
		};

		//打开白名单驳回
		$scope.rejectWhiteList = function(item){
			$scope.info = item;
			$scope.openRollModal('reject_white_list_box');
		};

		/*数据初始区域*/
		$scope.initPage();
		

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

