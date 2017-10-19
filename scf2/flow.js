/*
流程控制主页管理
@author binhg
*/
define(function(require,exports,module){
	/*引入引用文件*/
	require.async(['dicTool','bootstrap',"datePicker",'easyloader','jqueryPaser'],function(){
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
    var multiple =require("multiSelect");
    var modal = require("modal");
    require('date');
    require("upload");

	//定义模块
	var mainApp = angular.module('mainApp',['date','pagination','upload','multiple','modal']);

	//扩充公共指令库
	comdirect.direcPlus(mainApp);
	//扩充公共过滤器
	comfilter.filterPlus(mainApp);
	//扩充公共服务
	comservice.servPlus(mainApp,true);
	/*装载Controller*/
	var mainInstance = require('main');
	mainInstance.installAllControllers(mainApp,common,validate,tipbar,loading,comdirect,dialog);
	/*装载路由*/
	var routeInstance = require('route');
	routeInstance.installRoute(mainApp,common,validate,tipbar,loading,comdirect,dialog);

	mainApp.run(['$rootScope','http','$route','scopeBridge','cache','$timeout',function($rootScope,http,$route,scopeBridge,cache,$timeout){
		// 当前任务
		$rootScope.currentTask = {};

		$rootScope.auditRecord = [];

		$rootScope.rejectNodeList = [];

		$rootScope.auditListPage = {
			pageNum: 1,
			pageSize: 10
		};

		$rootScope.resultDict = [{value:0, name:'通过'},{value:1, name:'驳回'},{value:2, name:'作废'}];

		$rootScope.auditResult = {
			data: '',
			taskId:'',
			content:'',
			rejectNode:'',
			result: 0
		};

		$rootScope.queryAuditRecord = function(flag) {
			$rootScope.auditListPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_WORKFLOW_AUDIT_LIST,$.extend({businessId:$rootScope.currentTask.workFlowBusiness.businessId}, $rootScope.auditListPage)).success(function(data){
				if(common.isCurrentData(data)){
					$rootScope.$apply(function(){
						$rootScope.auditRecord = common.cloneArrayDeep(data.data);
						if(flag/*1*/){
							$rootScope.auditListPage = data.page;/*4*/
						}
					});
				}
			});
		};

		$rootScope.queryRejectNodeList = function() {
			http.post(BTPATH.QUERY_WORKFLOW_REJECT_NODE_LIST,{taskId:$rootScope.currentTask.taskId}).success(function(data){
				if(common.isCurrentData(data)){
					$rootScope.$apply(function(){
						if(data.data.length==0||$rootScope.currentTask.workFlowNode.form=='/flow/supplierFinance/financeRecheck'){
							$rootScope.resultDict = [{value:0, name:'通过'},{value:2, name:'作废'}];
							return ;
						}
						$rootScope.rejectNodeList = common.cloneArrayDeep(data.data);
						$rootScope.auditResult.rejectNode = common.filterArrayFirst(data.data);
					});
				}
			});
		};

		$rootScope.goBack = function() {
			window.location.href=$rootScope.origin_path;
		};


		$rootScope.submit = function(target) {

			if ($rootScope.auditResult.result == 1) { // 驳回
				$rootScope.rejectWorkFlow(target);
			} else if ($rootScope.auditResult.result == 2){ // 作废
				$rootScope.cancelWorkFlow(target);
			} else { // 通过
				if ($rootScope.currentTask.workFlowNode.type == '2') { //办理
					$rootScope.handleWorkFlow(target);
				} else {
					$rootScope.passWorkFlow(target);
				}
			}
			
		};

		// 通过 PASS_WORKFLOW_TASK
		$rootScope.passWorkFlow = function(target) {
			var childScope = scopeBridge.getRouteScope($route);

			var result = childScope.$GET_RESULT(target,'pass');
			$rootScope.auditResult.data = JSON.stringify(result);

			var $target = $(target);
			http.post(BTPATH.PASS_WORKFLOW_TASK/*1*/,$.extend({}, $rootScope.auditResult, {result:0})/*2*/)
				 .success(function(data){
			 	if(common.isCurrentResponse(data)){
			 		dialog.tip('审批通过流程成功!',3,function(){
			 			window.location.href=$rootScope.origin_path;
			 		},true);
			 	}else{
			 		tipbar.errorTopTipbar($target,'审批通过流程失败,服务器返回:'+data.message,3000,9992);
			 	}
			 });
		};

		// 驳回  REJECT_WORKFLOW_TASK
		$rootScope.rejectWorkFlow = function(target) {
			var childScope = scopeBridge.getRouteScope($route);
			
			var result = childScope.$GET_RESULT(target,'reject');

			if (!result) {
				return;
			}

			$rootScope.auditResult.data = JSON.stringify(result);
			var $target = $(target);
			http.post(BTPATH.REJECT_WORKFLOW_TASK/*1*/,$.extend({}, $rootScope.auditResult, {result:1})/*2*/)
				 .success(function(data){
			 	if(common.isCurrentResponse(data)){
			 		// tipbar.infoTopTipbar('审批驳回流程成功!',{});
			 		dialog.tip('审批驳回流程成功!',3,function(){
			 			window.location.href=$rootScope.origin_path;
			 		},true);
			 	}else{
			 		tipbar.errorTopTipbar($target,'审批通过流程失败,服务器返回:'+data.message,3000,9992);
			 	}
			 });
		};

		// 处理  HANDLE_WORKFLOW_TASK
		$rootScope.handleWorkFlow = function(target) {
			var childScope = scopeBridge.getRouteScope($route);

			var result = childScope.$GET_RESULT(target,'handle');

			if (!result) {
				return;
			}
			$rootScope.auditResult.data = JSON.stringify(result);

			//$rootScope.auditResult.result = 2;

			var $target = $(target);
			http.post(BTPATH.HANDLE_WORKFLOW_TASK/*1*/,$.extend({}, $rootScope.auditResult, {result:2})/*2*/)
				 .success(function(data){
			 	if(common.isCurrentResponse(data)){
			 		dialog.tip('办理流程成功!',3,function(){
			 			window.location.href=$rootScope.origin_path;
			 		},true);
			 	}else{
			 		tipbar.errorTopTipbar($target,'办理流程失败,服务器返回:'+data.message,3000,9992);
			 	}
			 });
		};

		// 作废
		$rootScope.cancelWorkFlow = function(target) {
			var childScope = scopeBridge.getRouteScope($route);

			var result = childScope.$GET_RESULT(target,'cancel');
			if (!result) {
				return;
			}
			$rootScope.auditResult.data = JSON.stringify(result);

			var $target = $(target);
			http.post(BTPATH.CANCEL_WORKFLOW_TASK/*1*/,$.extend({}, $rootScope.auditResult, {result:3})/*2*/)
				 .success(function(data){
			 	if(common.isCurrentResponse(data)){
			 		dialog.tip('办理流程成功!',3,function(){
			 			window.location.href=$rootScope.origin_path;
			 		},true);
			 	}else{
			 		tipbar.errorTopTipbar($target,'办理流程失败,服务器返回:'+data.message,3000,9992);
			 	}
			 });
		};


		// 保存  
		$rootScope.saveWorkFlow = function(target) {
			var childScope = scopeBridge.getRouteScope($route);

			var result = childScope.$GET_RESULT(target,'save');
			$rootScope.auditResult.data = JSON.stringify(result);

			$rootScope.auditResult.result = 2;

			var $target = $(target);
			http.post(BTPATH.HANDLE_WORKFLOW_TASK/*1*/,$rootScope.auditResult/*2*/)
				 .success(function(data){
			 	if(common.isCurrentResponse(data)){
			 		dialog.tip('办理流程成功!',3,function(){
			 			window.location.href=$rootScope.origin_path;
			 		},true);
			 	}else{
			 		tipbar.errorTopTipbar($target,'办理流程失败,服务器返回:'+data.message,3000,9992);
			 	}
			 });
		};


		//切换面板
        $rootScope.switchTab = function(event) {
            var $target = $(event.srcElement ? event.srcElement : event.target);
			$target.tab('show');
        };

        //页面入口
		$rootScope.$on('$routeChangeSuccess',function(){
			$rootScope.readonly = cache.get("WORKFLOW_TASK_FLAG");
			$rootScope.currentTask = cache.get("currentTask");
			$rootScope.auditResult.taskId = $rootScope.currentTask.taskId;

			//返回来源页面
			var flag = cache.get("flow_origin_flag").flag;
			var paths = {
				'waitHandle':'home.html#/flowTask/backlogTask',	//待办列表
				'finished':'home.html#/flowTask/finishedTask',		//已办列表
			};
			$rootScope.origin_path = paths[flag];
			// cache.put("flow_origin_flag",'');

			$rootScope.queryAuditRecord(true);
			if ($rootScope.readonly !== 'readonly') {
				$rootScope.queryRejectNodeList();
			}
			/*公共绑定*/
			$rootScope.$on('ngRepeatFinished',function(){
				$timeout(function(){
					common.resizeIframeListener();  
				});
			});
		});


		//视图加载完全 才显示页面
		$rootScope.$on("$viewContentLoaded",function(){
			$timeout(function(){
				$("#container").removeClass("hide");
				common.resizeIframeListener();  
			});
			
		});


	}]);


	angular.bootstrap($('#container'),['mainApp']);


});
});
});
