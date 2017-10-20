(function () {
	'use strict';

	angular
		.module('app.core')
		.config(coreConfig);

	coreConfig.$inject = ['$httpProvider'];
	function coreConfig($httpProvider) {

		$httpProvider.defaults.headers.post = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
		$httpProvider.defaults.transformRequest = function (obj) {
			var str = [];
			getFormData(obj);
			return str.join("&");

			function getFormData(objr, pr) {
				for (var p in objr) {
					var keyN;
					if (pr) {
						keyN = pr + '[' + p + ']';
					} else {
						keyN = p;
					}

					if (angular.isObject(objr[p])) {
						getFormData(objr[p], keyN);

					} else {
						str.push(encodeURIComponent(keyN) + "=" + encodeURIComponent(objr[p]));
					}
				}
			}
		};

		// http请求的拦截器
		$httpProvider.interceptors.push(['$q', function ($q) {
			return {
				request: function (config) {
					//成功的请求方法
					return config;// 或者 $q.when(config);
				},
				response: function (response) {
					//响应成功
					return response;// 或者 $q.when(response);
				},
				requestError: function (rejection) {
					// 请求发生了错误，如果能从错误中恢复，可以返回一个新的请求或promise
					// return rejection; //或新的promise
					// 或者，可以通过返回一个rejection来阻止下一步
					return $q.reject(rejection);
				},
				responseError: function (rejection) {
					switch (rejection.status) {
						case 401:
							if (window.dialogWarning) {
								window.dialogWarning('登录超时，请重新登录!');
							} else {
								window.parent.dialogWarning('登录超时，请重新登录!');
							}
							break;
						case 403:
							// Add unauthorized behaviour
							break;
					}
					// 请求发生了错误，如果能从错误中恢复，可以返回一个新的请求或promise
					// return rejection; //或新的promise
					// 或者，可以通过返回一个rejection来阻止下一步
					return $q.reject(rejection);
				}
			}
		}]);
	}

})();