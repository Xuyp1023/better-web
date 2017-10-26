(function () {
	'use strict';

	angular
		.module('app.core')
		.service('BtUtil', BtUtil);

	BtUtil.$inject = ['$http', '$location', '$q', '$cacheFactory', '$timeout'];
	function BtUtil($http, $location, $q, $cacheFactory, $timeout) {
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


		var urlCache = {}; // 阻止post重复提交
		//post方法
		this.post = function (url, params) {

			if (_isTest) {
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

		// 最近最少使用的缓存 Least Recently Used
		var lru20 = $cacheFactory('lru20', { capacity: 20 });
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
		function getUrl(url) {
      var tmpUrl;
      if (angular.isArray(url)) {
        if (_isTest || !url[1]) {
          tmpUrl = url[0];
        } else {
          tmpUrl = _baseUrl + url[1];
        }
      } else {
        tmpUrl = url;
      }
      return tmpUrl;
    }
	}
})();