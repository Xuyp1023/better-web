/**=========================================================
 * 基金-企业认证
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.filter('split2', function () {
			return function (data, pros) {
				var splitArr = data.split(":");
				if (pros == 'downf') {
					return '../Platform/CustFile/fileDownload?id=' + splitArr[0];
				} else {
					return splitArr[1];
				}
			};
		})
		.controller('p.fund.crtcount.certificate', MainController);

	MainController.$inject = ['$scope', 'BtUtilService', 'configVo', 'BtTipbar', '$timeout'];
	function MainController($scope, BtUtilService, configVo, BtTipbar, $timeout) {

		activate();

		// 初始化字典数据-机构
		$scope.auditStatusList = BTDict.SaleAgency.toArray('value', 'name');

		// 查询条件初始化对象
		$scope.searchData = {
			agencyNo: $scope.auditStatusList[0].key
		}

		// 账户下拉列表获取
		BtUtilService
			.post(configVo.BTServerPath.Query_Company_List)
			.then(function (jsonData) {
				$scope.companyList = jsonData.data;
				$scope.searchData.custNo = jsonData.data[0].value;
			});

		$scope.queryList();
		////////////////
		//初始化方法开始
		function activate() {
			// 初始化查询
			$scope.queryList = function () {

				// 获取企业认证的材料
				BtUtilService
					.post(configVo.BTServerPath.Query_ALL_Attach, $scope.searchData)
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							$scope.uploadList = jsonData.data;
						}
					})
					.then(function () {
						return BtUtilService
							.post(configVo.BTServerPath.INIT_CERTIFICATE_INFO, $scope.searchData)
					})
					.then(function (jsonData) {
						angular.forEach(jsonData.data, function (row) {

							var temp = $scope.uploadList;
							for (var i = 0; i < temp.length; i++) {
								if (row.fileInfoType == temp[i].fileInfoType) {
									temp[i].file = {
										fileName: row.fileName,
										id: row.id
									};
									break;
								}
							}

						})

						setTimeout(function () {
							BtUtilService.freshIframe();
						}, 10);

					});
			}

			// 删除
			$scope.deleteItem = function ($event, crfile) {
				delete crfile.file;
			}

			// 认证提交
			$scope.submitCertificate = function ($event) {
				var params = [];
				var temp = $scope.uploadList;
				for (var i = 0; i < temp.length; i++) {
					var row = temp[i];
					if (!row.file || !row.file.id) {
						BtTipbar.tipbarWarning($event.target, '请将基本信息补充完整！');
						return;
					}else{
						params.push(row.file.id);
					}
				}

				BtUtilService
					.post(configVo.BTServerPath.SUBMIT_CERTIFICATE_INFO, angular.extend({}, { fileIds: params.join(',') }, $scope.searchData))
					.then(function (jsonData) {
						if (jsonData.code === 200) {
							BtTipbar.pop('success','提示信息','认证提交成功'); 
							// BtPopInfo.propmpt('认证提交成功!', {});
						} else {
							BtTipbar.tipbarWarning($event.target, '认证失败，服务器返回:' + jsonData.message);
						}

					});
			}

		} // 初始化结束
	}

})();
