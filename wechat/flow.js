/*
微信主页面区域
@author binhg
*/
require.ensure([],function(){
require('path_wechat');
/*mui相关加载*/
require('mui');
require('muiPicker');
require('muiPopPicker');
require('muiDtPicker');
/*jquery相关加载*/
require('jquery');
require.ensure([],function(){
/*angular相关加载*/
require('angular');
require('ngRoute');
require('ngTouch');
/*微信相关操作的angular模块*/
require('wx');
require.ensure([],function(){
	/*加载公用模块*/
	var common = require('common');

	var mainApp = angular.module('mainApp',['ngRoute','ngTouch','wx']);
	/*装载公用指令*/
	var commonDirect = require('direct');
	commonDirect.direcPlus(mainApp);
	/*装载公用过滤器*/
	var commonFilter = require('filter');
	commonFilter.filterPlus(mainApp);
	/*装载公用服务*/
	var commonServ = require('service_wechat');
	commonServ.servPlus(mainApp);
	/*装载Controller*/
	var mainInstance = require('fmain');
	mainInstance.installAllControllers(mainApp,common);
	/*装载路由*/
	var routeInstance = require('froute');
	routeInstance.installRoute(mainApp);

	mainApp.run(['$rootScope','http','$route', 'cache', 'scopeBridge',function($rootScope,http,$route, cache, scopeBridge){


		//切换密码栏可见
		$rootScope.toggleEye = function(model,attr){
			var name = model + '.' + attr,
				eyeAttr = attr + 'Eye';
			$rootScope[model][eyeAttr] = !$rootScope[model][eyeAttr];
			if(console) console.info($rootScope[model][eyeAttr]);
			var input = document.querySelector("[ng-model='"+ name +"']");
			input.type = $rootScope[model][eyeAttr] ? 'text' : 'password';
		};


		//改变文本框类型
		$rootScope.typeChange = function(target){
			target.type = 'password';
			$(target).unbind("focus");
		};


		/*
		VM绑定区域
		*/
		$rootScope.loginInfo = {};

		$rootScope.currentTask = {};

		$rootScope.pageTitle = '';

		$rootScope.commonPageFlag = true;

		$rootScope.readonly = true;

		$rootScope.auditResult = {
			data: '',
			taskId:'',
			content:'',
			password:'',
			rejectNode:'',
			result: 0
		};

		$rootScope.auditListPage = {
			pageNum: 1,
			pageSize: 10
		};

		//地址信息
		$rootScope.locationCache = {
			prev:'#/home',
			current:'#/home'
		};



		$rootScope.submit = function() {
			if ($rootScope.currentTask.workFlowNode.type == '2') { //办理
				$rootScope.handleWorkFlow();
			} else {
				$rootScope.passWorkFlow();
			}
		};

		// 通过 PASS_WORKFLOW_TASK
		$rootScope.passWorkFlow = function() {

			$rootScope.auditResult.result == 0;
			var childScope = scopeBridge.getRouteScope($route);

			var result = childScope.$GET_RESULT('pass');

			if (!result) {
				return;
			}
			$rootScope.auditResult.data = JSON.stringify(result);

			http.post(BTPATH.PASS_WORKFLOW_TASK/*1*/,$.extend({}, $rootScope.auditResult, {result:0})/*2*/)
				 .success(function(data){
			 	if(common.isCurrentResponse(data)){
			 		mui.alert('审批通过流程成功!',function(){
			 			window.history.back();
			 		});
			 	}else{
			 		mui.alert('审批通过流程失败,服务器返回:'+data.message, function() {

			 		});
			 	}
			 });
		};

		// 处理  HANDLE_WORKFLOW_TASK
		$rootScope.handleWorkFlow = function() {
			$rootScope.auditResult.result == 2;
			var childScope = scopeBridge.getRouteScope($route);

			var result = childScope.$GET_RESULT('handle');

			if (!result) {
				return;
			}
			$rootScope.auditResult.data = JSON.stringify(result);

			//$rootScope.auditResult.result = 2;
			http.post(BTPATH.HANDLE_WORKFLOW_TASK/*1*/,$.extend({}, $rootScope.auditResult, {result:2})/*2*/)
				 .success(function(data){
			 	if(common.isCurrentResponse(data)){
			 		mui.alert('办理流程成功!',function(){
			 			window.history.back();
			 		});
			 	}else{
			 		mui.alert('办理流程失败,服务器返回:'+data.message,function(){

			 		});
			 	}
			 });
		};


		// 作废
		$rootScope.cancelWorkFlow = function() {
			var childScope = scopeBridge.getRouteScope($route);

			var result = childScope.$GET_RESULT('cancel');
			if (!result) {
				return;
			}
			$rootScope.auditResult.data = JSON.stringify(result);

			http.post(BTPATH.CANCEL_WORKFLOW_TASK/*1*/,$.extend({}, $rootScope.auditResult, {result:3})/*2*/)
				 .success(function(data){
			 	if(common.isCurrentResponse(data)){
			 		mui.alert('办理流程成功!',function(){
			 			window.history.back();
			 		});
			 	}else{
			 		mui.alert('办理流程失败,服务器返回:'+data.message,function(){

			 		});
			 	}
			 });
		};

		/*
		公用事件绑定
		*/
		//退出
		$rootScope.goBack = function(){
			// window.location.href = $rootScope.locationCache.prev;
			window.history.back();
		};

		$rootScope.flowRecord = function() {
			window.location.href="flow.html#/flow/flowRecord";
		}

		//检查是否已登陆/取得权限
		$rootScope.checkLogin = function(isSignIn){
			http.post(BTPATH.CHECK_IS_LOGIN,{}).success(function(data){
				if(data.data+'' === '0'){
					if(isSignIn){
						mui.alert('请您通过拜特企e金服公众号进行开户！','温馨提醒',function(){
							wx.closeWindow();
						});
					} else {
						mui.alert('您未登录,或者登陆超时,请重新登陆。\n若还未开户，请先进行开户！','温馨提醒',function(){
							wx.closeWindow();
						});
					}
				}else if(data.data+'' === '2'){
					if(!isSignIn){
						mui.alert('您未登录,或者登陆超时,请重新登陆。\n若还未开户，请先进行开户！','温馨提醒',function(){
							wx.closeWindow();
						});
					}
				}
			});
		};


		$rootScope.$on('$routeChangeSuccess',function(){
			$('#progress').hide();
			//创建轮播
			$rootScope.locationCache.prev = $rootScope.locationCache.current;
			$rootScope.locationCache.current = window.location.hash;
			$rootScope.pageTitle = $route.current.$$route?$route.current.$$route.title:'';

			//判断权限
			// var isNoRegister1 = $route.current.loadedTemplateUrl.indexOf('openAccountBasic.html') !== -1;

			if($route.current.loadedTemplateUrl){
				var isNo403 = $route.current.loadedTemplateUrl.indexOf('403page.html') === -1;
				var isNoOpenSuccess = $route.current.loadedTemplateUrl.indexOf('accountSuccess.html') === -1;

				var isCommonPage1 = $route.current.loadedTemplateUrl.indexOf('todoFlow.html') !== -1;
				var isCommonPage2 = $route.current.loadedTemplateUrl.indexOf('didFlow.html') !== -1;
				var isCommonPage3 = $route.current.loadedTemplateUrl.indexOf('flowRecord.html') !== -1;

				$rootScope.commonPageFlag = isCommonPage1 || isCommonPage2 || isCommonPage3;
				if (!$rootScope.commonPageFlag) {
					$rootScope.readonly = cache.get("WORKFLOW_TASK_FLAG");
					$rootScope.currentTask = cache.get("currentTask");
					$rootScope.auditResult.taskId = $rootScope.currentTask.taskId;

					//激活审批表单
					$('#footer').show();
					if ($rootScope.readonly.readonly !== 'readonly') {
						$("#content").show();
						$("#button").show();
						$("#password").show();
					} else {
						$("#content").hide();	
						$("#button").hide();
						$("#password").hide();
					}

					$rootScope.pageTitle = $rootScope.currentTask.workFlowNode.nickname + ($rootScope.currentTask.workFlowStep ? ('--' + $rootScope.currentTask.workFlowStep.nickname) : '');

				}else{
					$rootScope.pageTitle = "任务管理";
					if (isCommonPage3) {
						$rootScope.pageTitle = "审批记录";
					}

					$('#footer').hide();
				}
				
			}

		});

		// $rootScope.getLoginInfo();
	}]);


	angular.bootstrap($('#container'),['mainApp']);

},'wechat');
},'angular');
},'mui');
