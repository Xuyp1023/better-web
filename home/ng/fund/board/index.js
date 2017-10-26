/**=========================================================
 * 欢迎界面
 =========================================================*/
 (function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('MainController', MainController);

	MainController.$inject = ['$scope', 'configVo'];
	function MainController($scope, configVo) {

		activate();

		////////////////
		//初始化方法开始
		function activate() {


		} // 初始化结束
	}

})();
