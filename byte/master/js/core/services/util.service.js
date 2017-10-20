(function () {
	'use strict';

	angular
		.module('app.core')
		.service('BtUtilService', BtUtilService);

	BtUtilService.$inject = ['$http', '$location', '$q', '$cacheFactory', '$log', '$timeout', 'BtRouterService', '$rootScope'];
	function BtUtilService($http, $location, $q, $cacheFactory, $log, $timeout, BtRouterService, $rootScope) {

		// 打开模态对话框
		this.open = function (options, callback) {
			options.callback = callback;
			$rootScope.$broadcast('addNewTab', options);
		};

		// 打开独立的模态对话框
		this.openModal = function (url, params, callback) {
			url = '/'+url;
			BtRouterService
				.getOptions(null, url, params)
				.then(function (opts) {
					$rootScope.$broadcast('addNewTab', opts);
				});
		}

		// 关闭模态对话框
		this.close = function (options, callback) {
			BtRouterService.close(options, callback);
		}

		// 路由级别的页面跳转
		this.go = function (url, params) {
			// 设置路由参数
			var domains = $location.absUrl().split(/bt_v=([^#]*)#/);
			if (domains.length == 1) {
				domains = $location.absUrl().split(/#/);

			}
			domains[1] = '?bt_v=' + new Date().getTime() + '#/';
			domains[2] = url;
			domains[3] = '';
			if (params) {
				domains[3] = [];
				angular.forEach(params, function (value, key) {
					domains[3].push(key + '=' + value);
				});
				domains[3] = '?' + domains[3].join('&');
			}

			// 刷新界面
			window.location.href = domains.join('');
		};

		// 遮罩层
		this.addSpin = function (element) {
			var toggleSpin = angular.element('<div class="bt-preloader"><img class="bt-loading-img" src="app/img/loading.gif" alt="正在加载中...." /></div>');
			element.append(toggleSpin);
			return toggleSpin;
		}
		this.removeSpin = function (element) {
			if (!element) return;
			element.remove();
		}

		//公共的控制台输出
		this.log = function (msg, type) {
			var type = type || 'log';
			$log[type](msg);
		}

		var urlCache = {}; // 阻止post重复提交
		//post方法
		this.post = function (url, params) {

			if (indexNum == 0) {
				return this.get(url);
			}

			// 一分钟之内只能请求一次
			if (urlCache[url] && new Date().getTime() - urlCache[url] < 1000 * 60) {
				return $q.reject(
					{
						status: 515,
						data: '1分钟之类不允许重复提交'
					});
			} else {
				urlCache[url] = new Date().getTime();
			}

			return $http.post(getUrl(url), params)
				.then(function (response) {

					delete urlCache[url];
					return response.data;
				}, function (error) {
					delete urlCache[url];
					return $q.reject(error);
				});
		};
		/**
		 get方法
		 url:路径地址
		 params:路径参数
		 cache:缓存
		 */
		this.get = function (url, params) {
			var config = { params: params };
			return $http.get(getUrl(url), config)
				.then(function (response) {

					return response.data;
				}, function (error) {

					return $q.reject(error);
				});
		};

		this.freshIframe = function (height) {
			// 兼容老系统的自适应高度
			var href = window.parent.location.href;
			var frameOld = href && (href.indexOf('scf2') || href.indexOf('p') || href.indexOf('scf'));
			if (frameOld) {
				var ifm = angular.element(window.parent.document.getElementsByName('content_iframe'));
				height = height || angular.element(document).find("html")[0].scrollHeight;
				setTimeout(function () {
					ifm.css('height', height + 'px');
				});
			}
		};

		/**
		 * 获取http缓存数据
		 * @param url
		 * @returns json数据
		 */
		this.cache = function (url) {
			var config = { cache: lru20 };
			return $http.get(getUrl(url), config)
				.then(function (response) {
					return response.data;
				});
		};
		// 获取测试环境的地址
		this.getUrl = getUrl;

		// 最近最少使用的缓存 Least Recently Used
		var lru20 = $cacheFactory('lru20', { capacity: 20 });

		//0代表是测试环境，1代表是真实环境
		var indexNum = ($location.host() === 'localhost' || $location.host().indexOf('static') === 0) ? 0 : 1;

		// [1]为测试环境，''、[2]根据$location来判断
		function getUrl(url) {
			var tmpUrl;
			if (angular.isArray(url)) {
				tmpUrl = url[indexNum] || '/byte/' + url[0];
			} else {
				tmpUrl = url;
			}
			return Api_Global_Var.baseUrl[indexNum] + tmpUrl;
		}
	}
})();