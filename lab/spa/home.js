/*
路由主页管理
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
    require('date');
    require("upload");

	//定义模块
	var mainApp = angular.module('mainApp',['date','pagination','upload']);

	//扩充公共指令库
	comdirect.direcPlus(mainApp);
	//扩充公共过滤器
	comfilter.filterPlus(mainApp);
	//扩充公共服务
	comservice.servPlus(mainApp);
	/*装载路由*/
	var routeInstance = require('./route');
	routeInstance.installRoute(mainApp,common,validate,tipbar,loading,comdirect,dialog);

	mainApp.run(['$rootScope','http','$route',function($rootScope,http,$route){

		$rootScope.$on('$routeChangeSuccess',function(){

		});

	}]);


	angular.bootstrap($('#container'),['mainApp']);


});
});
});
