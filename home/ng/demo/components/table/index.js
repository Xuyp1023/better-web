/**=========================================================
 * 演示-控件-表格
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
			.get(configVo.BTServerPath.Query_Pages_Test)
			.then(function (jsonData) {
				$scope.rowDatas = jsonData.data;
			});

		////////////////
		//初始化方法开始
		function activate() {

			$scope.queryList = function(){
				$scope.tableParams.setDatasource({
					searchUrl:configVo.BTServerPath.Query_Pages_Test,
					queryVo:{}
				});
			}

			$scope.tableParams = {
				initOver:$scope.queryList
			};

		} // 初始化结束
	}

})();
