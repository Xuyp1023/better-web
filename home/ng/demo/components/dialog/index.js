/**=========================================================
 * 欢迎界面
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('MainController', MainController);

	MainController.$inject = ['$scope', 'configVo', 'Dialog'];
	function MainController($scope, configVo, Dialog) {

		activate();

		////////////////
		//初始化方法开始
		function activate() {

			$scope.open = function () {

				Dialog
					.open({
						scope: $scope,
						templateUrl: configVo.modulePaht + '/temp/test.html'
					}, function () {
						// setTimeout(function(){
						// 	Dialog.close();
						// },1000*3);
					});
			}

			$scope.openCom = function () {

				Dialog
					.go('welcome');
			}


		} // 初始化结束
	}

})();
