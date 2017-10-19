/*
	微信绑定
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
	var mainApp = angular.module('mainApp',['modal']);

	//扩充公共指令库
	comdirect.direcPlus(mainApp);
	//扩充公共过滤器
	comfilter.filterPlus(mainApp);
	//扩充公共服务
	comservice.servPlus(mainApp);


	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService','form','$timeout',function($scope,http,commonService,form,$timeout){
		/*VM绑定区域*/

		$scope.codeUrl = '';

		$scope.isScan = '0';

		$scope.scanFlag = false;
		

		/*事件处理区域*/
		$scope.findCode = function(){

			http.post(BTPATH.GET_WECHAT_SIGN,{workType:1}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.scanFlag = true;
						$scope.codeUrl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+data.data;

						setInterval(function(){
							$scope.checkScan();
						},500);
					});
				} else {
					$scope.scanFlag = false;
				}
			});

		};

		$scope.checkScan = function(){

			http.post(BTPATH.CHECK_IS_CAN_SCAN,{workType:1}).success(function(data){
				if(common.isCurrentResponse(data)){
					if(data.data === '1'){
						$scope.$apply(function(){
							$scope.isScan = '1';

						});
						$timeout(function(){
							window.location.href = 'setPassword.html';
						},5000);
					}
				}
			});

		};

		$scope.initPage = function(){
			$scope.findCode();
		};



		/*数据初始区域*/
		$scope.initPage();

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});


