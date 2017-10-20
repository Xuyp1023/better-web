/**=========================================================
 * 基金-企鹅宝-企鹅宝申购
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('p.fund.peng.apply1', MainController);

	MainController.$inject = ['$scope', 'configVo', 'BtUtilService', '$q', 'datefFilter', 'point4fFilter', 'percentfFilter', 'BtTipbar','$filter'];
	function MainController($scope, configVo, BtUtilService, $q, datef, point4f, percentf, BtTipbar,$filter) {

		activate();

		BtUtilService
			.post(configVo.BTServerPath.reFreshTradeAcoount, {})
			.then(function (jsonData) {
				if (jsonData.code === 200) {
					$scope.BTDict.AccountBank = jsonData.data; //交易账户列表
					$scope.purchaseInfo = {
						moneyAccount: jsonData.data[0].value //默认选中第一个
					}
				}
			});

		////////////////
		//初始化方法开始
		function activate() {

			$scope.BTDict = {
			};

			$scope.pageInfo = {
				src: configVo.modulePaht + '/1.html'
			}

			$scope.tableParams = {
				parentScope: $scope,
				paginationControls: true,
				cols: [
					{
						title: '理财方案',
						type: 'template',
						cellTemplate: '<a class="bt-table-button" href="../p/pages/queryInfo/queryFund.html#{{fundCode}}">{{schemeName}}</a>',
						width: '25%'
					}, {
						title: '投资金额',
						field: 'investMentAmount',
						filter: 'custom',
						getStatusHtml: function getStatusHtml(status) {
							return $filter('currency')(status, '');
						},
						width: '12%'
					}, {
						title: '有效期限',
						field: 'validDate',
						filter: 'custom',
						getStatusHtml: datef,
						width: '15%'
					}, {
						title: '万份收益',
						field: 'incomeUnit',
						filter: 'custom',
						getStatusHtml: function getStatusHtml(status) {
							return '<span class="bt-red">' + point4f(status) + '</span>';
						},
						width: '8%'
					}, {
						title: '七日年化',
						field: 'incomeRatio',
						filter: 'custom',
						getStatusHtml: percentf,
						width: '8%'
					}, {
						title: '方案类型',
						field: 'schemeType',
						width: '10%'
					}, {
						title: '风险特征',
						field: 'riskLevel',
						filter: 'custom',
						getStatusHtml: function getStatusHtml(data) {
							if(data == '0') return '--';
							return BTDict.SaleRiskLevel.get(data + '');
						},
						width: '8%'
					}, {
						title: '操作',
						type: 'buttons',
						width: '6%',
						config: [{ title: '申购', event: 'purchaseFund' }]
					}
				],
				initOver: $q.defer()
			};

			$scope.tableParams.initOver
				.promise.then(function (params) {



					// 查询按钮事件
					$scope.queryList = function () {
						BtUtilService
							// .post(configVo.BTServerPath.Query_List_Info, {"schemeType":"01"})
							// .then(function (jsonData) {
							// 	if (jsonData.code == 200) {
							// 		$scope.tableParams.setRowData(jsonData.data);
							// 	}
							// });

						$scope.tableParams.setDatasource({
							searchUrl: configVo.BTServerPath.Query_List_Info,
							queryVo: {"schemeType":"01"}
						});
					};

					$scope.queryList();
				});
			// 申购按钮事件
			$scope.purchaseFund = function (item) {

				angular.extend($scope.purchaseInfo, item);

				// $scope.moneyAccountChange();

				BtUtilService
					.post(configVo.BTServerPath.FIND_SCHEMEINFO, {
						schemeId: $scope.purchaseInfo.id,
						businFlag: '22',
						custType: '0',
						moneyAccount: $scope.purchaseInfo.moneyAccount
					})
					.then(function (jsonData) {
						if (jsonData.code === 200) {
							$scope.purchaseInfo = jsonData.data;
							$scope.pageInfo.src = configVo.modulePaht + '/2.html'
						}
					});


			}
			// 交易账户发生改变，效验规则也需要变化
			$scope.moneyAccountChange = function () {

				// 获取交易账户的限制条件
				/*BtUtilService
					.post(configVo.BTServerPath.checkMoneyAccountAndAgency, {
						agencyNo: $scope.purchaseInfo.agencyNo, moneyAccount: $scope.purchaseInfo.moneyAccount, fundCode: $scope.purchaseInfo.fundCode
					})
					.then(function (jsonData) {
						if (jsonData.code === 200) {
							$scope.pageInfo.moneyInvalid = false;

							// 获取存入金额的限制条件
							return BtUtilService
								.post(configVo.BTServerPath.queryFundLimit, {
									fundCode: $scope.purchaseInfo.fundCode,
									businFlag: '22',
									custType: '0',
									moneyAccount: $scope.purchaseInfo.moneyAccount
								});
						} else {
							$scope.pageInfo.moneyInvalid = true;
							return $q.reject();
						}
					})
					.then(function (jsonData) {
						if (jsonData.code === 200) {
							$scope.pageInfo.balanceValid = jsonData.data;
						}
					});*/

					// 获取交易账户的限制条件
				

			};

			// 确认金额页面表单效验
			$scope.formParams = configVo.formParams;

			// 预览按钮事件
			$scope.toPreeSee = function ($event) {

				var formParams = $scope.formParams.getValid()
				if (!formParams || $scope.pageInfo.moneyInvalid) {
					BtTipbar.tipbarWarning($event.target, '表单填写有错误');
					return;
				}

				if (!balanceValidate()) {
					BtTipbar.tipbarWarning($event.target, '表单填写有错误');
					return;
				}

				for (var i = 0; i < $scope.BTDict.AccountBank.length; i++) {
					if ($scope.BTDict.AccountBank[i].value == $scope.purchaseInfo.moneyAccount) {
						$scope.pageInfo.fund_partment_name = $scope.BTDict.AccountBank[i].name;
						break;
					}
				}

				$scope.pageInfo.src = configVo.modulePaht + '/3.html'
			};
			// 立即申购按钮事件
			$scope.confirmPurchase = function ($event) {

				BtUtilService
					.post(configVo.BTServerPath.purchaseFund, angular.extend($scope.purchaseInfo))
					.then(function (jsonData) {
						if (jsonData.code === 200) {
							$scope.purchaseResult = jsonData.data;

							return BtUtilService
								.post(configVo.BTServerPath.querySaleAgencyInfoWithFile, { agencyNo: $scope.purchaseInfo.agencyNo });
						} else {
							BtTipbar.tipbarWarning($event.target, jsonData.message);
							return $q.reject();
						}
					})
					.then(function (jsonData) {
						if (jsonData.code === 200) {
							angular.extend($scope.purchaseResult, jsonData.data);
							$scope.pageInfo.src = configVo.modulePaht + '/4.html'
						}
					});
			};
			// 跳转到指定页
			$scope.toIndexPage = function (index) {
				$scope.pageInfo.src = configVo.modulePaht + '/' + index + '.html'
			};
			// 高度自适应
			$scope.refreshPage = function(){
				setTimeout(function(){
					BtUtilService.freshIframe();
				},10);
			}
		} // 初始化结束

		// 存入金额发生改变，效验规则也需要变化
		function balanceValidate() {
			if ($scope.purchaseInfo.balance < $scope.purchaseInfo.minBalance) {
				$scope.pageInfo.balanceInvalidInfo = '本产品起购金额为' + $scope.purchaseInfo.minBalance + '元';
				$scope.pageInfo.balanceInvalid = true;
				return false;
			} else if ($scope.purchaseInfo.balance > $scope.purchaseInfo.maxBalance) {
				$scope.pageInfo.balanceInvalidInfo = '本产品限购金额为' + $scope.purchaseInfo.maxBalance + '元';
				$scope.pageInfo.balanceInvalid = true;
				return false;
			} else {
				$scope.pageInfo.balanceInvalid = false;
				return true;
			}
		}
	}

})();
