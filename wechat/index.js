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
	var base64 = require('base64');

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
	var mainInstance = require('main'); 
	mainInstance.installAllControllers(mainApp,common,base64);
	/*装载路由*/
	var routeInstance = require('route');
	routeInstance.installRoute(mainApp);

	mainApp.run(['$rootScope','http','$route',function($rootScope,http,$route){
		/*
		VM绑定区域
		*/
		$rootScope.loginInfo = {};

		$rootScope.pageTitle = '';

		//地址信息
		$rootScope.locationCache = {
			prev:'#/home',
			current:'#/home'
		};

		/*
		公用事件绑定
		*/
		//退出
		$rootScope.goBack = function(){
			// window.location.href = $rootScope.locationCache.prev;
			window.history.back();
			
		};

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
			//判断是否为主页面
			var homeArr = ["#/home/finance","#/home/single","#/home/invest"];
			$rootScope.locationCache.isHome =  window.location.hash && homeArr.indexOf(window.location.hash)!=-1;
			$rootScope.pageTitle = $route.current.$$route?$route.current.$$route.title:'';

			if($route.current.loadedTemplateUrl){

				//判断权限
				var isNoRegister1 = $route.current.loadedTemplateUrl.indexOf('openAccountBasic.html') !== -1;
				var isNoRegister2 = $route.current.loadedTemplateUrl.indexOf('accountUpload.html') !== -1;
				var isNoRegister3 = $route.current.loadedTemplateUrl.indexOf('openAccountPasswd.html') !== -1;
				var isNoRegister4 = $route.current.loadedTemplateUrl.indexOf('openAccountShow.html') !== -1;
				var isNoRegister5 = $route.current.loadedTemplateUrl.indexOf('waitAudit.html') !== -1;
				var isNoRegister6 = $route.current.loadedTemplateUrl.indexOf('waitActive.html') !== -1;
				var isNoPreImg = $route.current.loadedTemplateUrl.indexOf('preImg.html') !== -1;

				var isNo403 = $route.current.loadedTemplateUrl.indexOf('403page.html') === -1;
				var isNoOpenSuccess = $route.current.loadedTemplateUrl.indexOf('accountSuccess.html') === -1;
				// var isNoFinanceSuccess = $route.current.loadedTemplateUrl.indexOf('financeSuccess.html') === -1;
				// var isNoFirstLogin = $route.current.loadedTemplateUrl.indexOf('accountBind.html') === -1;
				if(isNo403&&isNoOpenSuccess){
					$rootScope.checkLogin(isNoRegister1||isNoRegister2||isNoRegister3||isNoRegister4||isNoRegister5||isNoRegister6||isNoPreImg);
				}

			}

		});

		// $rootScope.getLoginInfo();
	}]);


	angular.bootstrap($('#container'),['mainApp']);

},'wechat');
},'angular');
},'mui');
