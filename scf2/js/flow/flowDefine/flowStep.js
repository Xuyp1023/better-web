/*
  流程步骤
作者:herb
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
    var BTPATH = require("path_s2");
    var pages = require("pages");
    var date = require("date");
    require('modal');

	//定义模块
	var mainApp = angular.module('mainApp',['pagination','modal','date']);
	
	//扩充公共指令库/过滤器
	comdirect.direcPlus(mainApp);
	comfilter.filterPlus(mainApp);
	

	//控制器区域
	mainApp.controller('mainController',['$scope',function($scope){
		/*VM绑定区域*/
		


		$scope.flowInfo = {};


	}]);


	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

