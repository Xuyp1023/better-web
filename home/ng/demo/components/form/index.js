/**=========================================================
 * 欢迎界面
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('MainController', MainController);

	MainController.$inject = ['$scope', 'configVo','BtTipbar'];
	function MainController($scope, configVo,BtTipbar) {

		activate();

		////////////////
		//初始化方法开始
		function activate() {

			$scope.formParams = {};

			$scope.basicSubmit = function($event){


				if(!$scope.formParams.getValid()) {
					BtTipbar.tipbarWarning($event.target,'表单有错误');
					return;
				}else{
					BtTipbar.pop('success','成功','表单提交成功！');
				}
			

			};

			$scope.myValidate = function(value){

				if(value <1000){
					return true;
				}else{
					return false;
				}
			}
		} // 初始化结束
	}

})();
