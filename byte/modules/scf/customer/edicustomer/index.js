/**=========================================================
 * 供应链-核心企业端
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('scf.customer.edicustomer', MainController);

	MainController.$inject = ['$scope', 'BtUtilService', 'configVo', 'BtTipbar', '$timeout', '$q', 'BtCache'];
	function MainController($scope, BtUtilService, configVo, BtTipbar, $timeout, $q, BtCache) {

		activate();

		//初始化方法开始
		function activate() {

			$scope.tableParams = {
				rowSelection: true,
				cols: [
					{
						title: '产品名称',
						field: 'productName',
						width: '25%'
					}, {
						title: '产品编号',
						field: 'productCode',
						width: '25%'
					}, {
						title: '融资模式',
						field: 'receivableRequestType',
						filter: 'custom',
						getStatusHtml: function getStatusHtml(data) {
							if (data == '0') return '--';
							return BTDict.NewFinanceModel.get(data + '') || '--';
						},
						width: '25%'
					}, {
						title: '资金方',
						field: 'factoryName',
						width: '25%'
					}//, {
					//     title: '操作',
					//     type: 'buttons',
					//     width: '20%',
					//     config: [{ title: '查看详情' }, { title: '删除' }]
					// }
				], initOver: $q.defer(), rowIsOnOrOff: function (item) {
					return (item.businStatus == 2);
				}
			};

			$scope.tableParams.initOver
				.promise.then(function (params) {

					BtUtilService
						.post(configVo.BTServerPath.Test_Query_Pages, { custNo: configVo.btParams.custNo, coreCustNo: configVo.btParams.coreCustNo })
						.then(function (jsonData) {

							$timeout(function () {
								$scope.tableParams.setRowData(jsonData.data);
								$scope.refreshPage();
							}, 1);
						});
				});

			$scope.save = function () {
				var selectList = $scope.tableParams.getRowSelection('id');
				BtUtilService
					.post(configVo.BTServerPath.Query_Day_Manager, { custNo: configVo.btParams.custNo, coreCustNo: configVo.btParams.coreCustNo, productCodes: selectList.toString() })
					.then(function (jsonData) {
						BtTipbar.pop('success', '', '保存成功');
						history.back();
					});
			}

			$scope.info = {};

			BtUtilService
			.post(configVo.BTServerPath.Test_Query_put, {custNo: configVo.btParams.custNo})
			.then(function (jsonData) {
				angular.extend($scope.info,jsonData.data);
			});

		

			$scope.goBack = function () {
				history.back();
			};
			// 高度自适应
			$scope.refreshPage = function () {
				setTimeout(function () {
					BtUtilService.freshIframe();
				}, 10);
			}

		} // 初始化结束
	}

})();
