/**=========================================================
 * 测试类-布局控制器
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('p.fund.peng.scheme', MainController);

	MainController.$inject = ['$scope', 'configVo', 'BtUtilService','BtTipbar'];
	function MainController($scope, configVo, BtUtilService,BtTipbar) {

		activate();

		////////////////
		//初始化方法开始
		function activate() {

			$scope.searchData = { schemeType: '01' ,flag:'1'};
			
			$scope.queryList = function (schemeType) {
				$scope.searchData.schemeType = schemeType;
				queryList();
			}
						

			$scope.tableParams = {
				initOver:queryList
			};

			// 首选
			$scope.setFirst = function (item) {
				BtUtilService
					.post(configVo.BTServerPath.Save_Set_First)
					.then(function (jsonData) {
						if(jsonData.code == 200){
							queryList();
							BtTipbar.pop('success', '提示信息', '提交成功！');
						}else{
							BtTipbar.pop('error', '提示信息', '提交失败！');
						}
					});
			};

			// 详情
			$scope.lookItem = function (item) {
				BtUtilService.go('p/fund/peng/finance',{id:item.id});
			};

			// 编辑
			$scope.editItem = function (item) {
				BtUtilService.go('p/fund/peng/editplan',{id:item.id,src:'1.html'});
			};
			// 编辑
			$scope.newItem = function () {
				
				BtUtilService.go('p/fund/peng/editplan',{src:'1.html'});
			};

		} // 初始化结束

		// 查询列表的方法
		function queryList() {

			$scope.tableParams.setDatasource({
				searchUrl:configVo.BTServerPath.Com_Money_Scheme,
				queryVo:angular.extend({},$scope.searchData)
			});
		}
	}

})();
