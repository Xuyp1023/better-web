/**=========================================================
 * 欢迎界面
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('MainController', MainController);

	MainController.$inject = ['$scope', 'configVo','BtUtil'];
	function MainController($scope, configVo,BtUtil) {

		activate();

		BtUtil
			.post(configVo.BTServerPath.Query_Company_List)
			.then(function(jsonData){
					$scope.dict.companyList = jsonData.data;
			});

		////////////////
		//初始化方法开始
		function activate() {

			// 初始化字典表
			$scope.dict = {

			}

			// 类型字典的数据源
			// $scope.auditStatusList = BTDict.ContractTemplateAuditStatus.toArray('value','name');

		} // 初始化结束
	}

})();
