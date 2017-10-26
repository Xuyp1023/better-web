/**=========================================================
 * http请求
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('MainController', MainController);

	MainController.$inject = ['$scope', 'configVo', '$http'];
	function MainController($scope, configVo, $http) {

		activate();

		////////////////
		//初始化方法开始
		function activate() {

			$scope.post = function () {
				$http
					.post('xxxxx', { code: { aa: { bb: 11 } }, ddd: { cc: 22 }, dd: 22,aaa:[
						{a:1,c:3},{b:2}
					] }, {
						headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
						transformRequest: function (obj) {
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
						}
					})
			};

		} // 初始化结束
	}

})();
