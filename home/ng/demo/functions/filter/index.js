/**=========================================================
 * 欢迎界面
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('MainController', MainController);

	MainController.$inject = ['$scope', 'configVo','$filter'];
	function MainController($scope, configVo,$filter) {

		activate();

		////////////////
		//初始化方法开始
		function activate() {

			var ina = 'a11';
			var b = $filter('number')(ina,2);
			console.log(b);


		} // 初始化结束
	}

})();
