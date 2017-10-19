/*
  机构列表
作者:herb
*/
define(function (require, exports, module) {
	require.async(['dicTool', 'bootstrap', "datePicker"], function () {
		require.async(['BTDictData'], function () {
			var validate = require("validate");
			var tipbar = require("tooltip");
			var common = require("common");
			var loading = require("loading");
			var comdirect = require("direct");
			var comservice = require("service_s2");
			var comfilter = require("filter");
			var BTPATH = require("path_s2");
			var pages = require("pages");
			require('modal');

			//定义模块
			var mainApp = angular.module('mainApp', ['pagination', 'modal']);

			//扩充公共指令库/过滤器
			comdirect.direcPlus(mainApp);
			comfilter.filterPlus(mainApp);
			comservice.servPlus(mainApp);


			//控制器区域
			mainApp.controller('mainController', ['$scope', 'http', 'commonService', 'cache', function ($scope, http, commonService, cache) {
				/*VM绑定区域*/
				//分页数据
				/*$scope.pageConf = {
					pageNum: 1,
					pageSize: 10,
					pages: 1,
					total: 1
				};*/

				//机构列表
				$scope.agencyList = [];

				//缓存客户信息
				$scope.cacheCustInfo = function (custInfo,href) {
					custInfo.origin = 'agencyList';
					cache.put("custInfo", custInfo);
					window.location.href = href;
				};

				//刷新机构列表数据
				$scope.reFreshAgencyList = function (flag) {
					//弹出弹幕加载状态
					loading.addLoading($('#search_info table'), common.getRootPath());
					http.post(BTPATH.QUERY_CUST_LIST, {}).success(function (data) {
						//关闭加载状态弹幕
						loading.removeLoading($('#search_info table'));
						if ((data !== undefined) && (data.data !== undefined) && (data.data !== '') && (data.code === 200)) {
							$scope.$apply(function () {
								$scope.agencyList = common.cloneArrayDeep(data.data);
							});
						}
					});
				};

				$scope.initPage = function () {
					$scope.reFreshAgencyList(true);
				};

				//初始化页面
				$scope.initPage();

			}]);


			//手动装载angular模块
			angular.bootstrap($('#container'), ['mainApp']);
		});
	});
});

