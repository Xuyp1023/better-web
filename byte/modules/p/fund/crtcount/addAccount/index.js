/**=========================================================
 * 基金-开通基金业务
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('p.fund.crtcount.addAccount', MainController);

	MainController.$inject = ['$scope', 'configVo', 'BtUtilService'];
	function MainController($scope, configVo, BtUtilService) {

		activate();
		initInfo();

		////////////////
		//初始化方法开始
		function activate() {

			$scope.regInfoBind = {
				companyNt: '0', aptitude: '0'
			};
			$scope.pageInfo = {
				src: configVo.modulePaht + '/1.html',
				fundList: []
			}
			// 基本信息界面跳转到预览界面
			$scope.toPreviewPage = function () {

				$scope.pageInfo.src = configVo.modulePaht + '/2.html';
			}
			// 查看基金详细信息
			$scope.lookFundDetail = function (item) {
				BtUtilService.open({
					templateUrl: configVo.modulePaht + '/fundInfo.html',
					controller: ['$scope', 'BtUtilService', function ($scope, BtUtilService) {
						$scope.fundName = item.value;
						// 获取机构信息
						BtUtilService
							.post(configVo.BTServerPath.SALE_AGENCY_INFO_PATH, { agencyNo: item.key })
							.then(function (jsonData) {
								if (jsonData.code === 200) {
									var fundCompInfoList = [], fundCompProList = [];
									angular.forEach(jsonData.data.files, function (row) {
										if (row.paperType === '0') {
											fundCompInfoList.push(row);
										} else if (row.paperType === '1') {
											fundCompProList.push(row);
										}
									});
									$scope.fundCompInfoList = fundCompInfoList;
									$scope.fundCompProList = fundCompProList;
								}
							});
					}]
				});
			}
			// 预览界面界面跳转到协议界面
			$scope.toAgreePage = function () {

				$scope.pageInfo.src = configVo.modulePaht + '/3.html';
			}
			// 协议界面界面跳转到完成界面
			$scope.toFinishPage = function () {
				$scope.pageInfo.src = configVo.modulePaht + '/4.html';
			}
			// 机构名称变了之后，会刷新其它信息
			$scope.changeInitInfo = function (custNo) {

				BtUtilService
					.post(configVo.BTServerPath.RELA_ACCO_INFO_PATH, { 'custNo': custNo })
					.then(function (jsonData) {
						if (jsonData.code === 200) {
							$scope.regInfoBind.provinceNo = jsonData.data.cityNo.substr(0, 2) + '0000';
							$scope.regInfoBind.certValidDate = jsonData.data.certValidDate;
							$scope.BTDict.citys = BTDict.Provinces.getItem($scope.regInfoBind.provinceNo).citys.toArray();
						}
					});
			}
			// 省份变化以后，城市也要跟着变
			$scope.changeCity = function () {
				$scope.BTDict.citys = BTDict.Provinces.getItem($scope.regInfoBind.provinceNo).citys.toArray();;
			}
			// 企业性质也要存起来
			$scope.changeCompanyNt = function (cThis) {
				$scope.pageInfo.companyNt2 = cThis.options[cThis.options.selectedIndex].text;
			}
			// 返回上一个界面
			$scope.goBack = function ($event, page) {
				$scope.pageInfo.src = configVo.modulePaht + '/' + page + '.html';
			}
		} // 初始化结束

		//初始化开户信息
		function initInfo() {

			$scope.BTDict = {
				SaleBankCode: BTDict.SaleBankCode.toArray(),         //销售银行
				Provinces: BTDict.Provinces.toArray('id', 'name'),    //省份
				PersonIdentType: BTDict.PersonIdentType.toArray(),   //个人证件类型
				SaleAgency: BTDict.SaleAgency.toArray()              //基金品种
			}

			// 删除余利宝
			$scope.BTDict.SaleAgency.pop();

			// 初始化申购机构
			BtUtilService
				.post(configVo.BTServerPath.TRADE_ACCOUNT_LIST)
				.then(function (jsonData) {
					if (jsonData.code === 200) {
						$scope.BTDict.AccountList = jsonData.data;
					}
				});

			// 获取已经选择的基金
			BtUtilService
				.post(configVo.BTServerPath.OPENED_AGENCY_PATH)
				.then(function (jsonData) {
					if (jsonData.code === 200) {
						var codeStr = jsonData.data.toString();
						angular.forEach($scope.BTDict.SaleAgency, function (row) {
							if (codeStr.indexOf(row.key) > -1) {
								row.checked = true;
							}
						});
					}
				});
		}
	}

})();
