/**=========================================================
 * demo-function-author
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('MainController', MainController);

	MainController.$inject = ['$scope', '$timeout'];
	function MainController($scope, $timeout) {

		activate();

		////////////////
		//初始化方法开始
		function activate() {

			console.log('权限界面');

		} // 初始化结束
	}

})();
