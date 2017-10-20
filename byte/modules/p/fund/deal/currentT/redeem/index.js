/**=========================================================
 * 基金-我要交易-活期宝赎回
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('p.fund.deal.currentT.redeem', MainController);

	MainController.$inject = ['$scope', 'configVo', 'BtUtilService', '$q', 'datefFilter', 'point4fFilter', 'currencyFilter', 'BtTipbar'];
	function MainController($scope, configVo, BtUtilService, $q, datef, point4f, currency, BtTipbar) {

		activate();

		BtUtilService
			.post(configVo.BTServerPath.reFreshTradeAcoount, {})
			.then(function (jsonData) {
				if (jsonData.code === 200) {
					$scope.BTDict.AccountBank = jsonData.data; //交易账户列表
					$scope.searchData.custNo = jsonData.data[0].value //默认选中第一个
					
				}
				$scope.queryList();
			});

		////////////////
		//初始化方法开始
		function activate() {

			$scope.BTDict = {};

			$scope.searchData = {
				businFlag:802,
				pageNum:1,
				pageSize:10,
				flag:1
			}

			$scope.pageInfo = {
				src: configVo.modulePaht + '/1.html'
			}

			$scope.tableParams = {
				parentScope: $scope,
				cols: [
					{
						title: '基金名称',
						type: 'template',
						cellTemplate: '<a class="bt-table-button" href="../p/pages/queryInfo/queryFund.html#{{fundCode}}">{{fundName}}-{{fundCode}}</a>',
						width: '20%'
					}, {
						title: '净值日期',
						field: 'netDate',
						filter: 'custom',
						getStatusHtml: datef,
						width: '12%'
					}, {
						title: '最新净值',
						field: 'netValue',
						filter: 'custom',
						getStatusHtml: point4f,
						width: '15%'
					}, {
						title: '持有份额',
						type: 'template',
						cellTemplate: '<span class="bt-red">{{disShares}}</span>',
						width: '8%'
					}, {
						title: '可用份额',
						type: 'template',
						cellTemplate: '<span class="bt-red">{{disValidShares}}</span>',
						width: '8%'
					}, {
						title: '参考市值',
						type: 'template',
						cellTemplate: '{{shares*netValue}}',
						filter: 'custom',
						getStatusHtml: function getStatusHtml(data) {
							return '<span class="bt-red">' + currency(data, '') + '</span>';
						},
						width: '8%'
					}, {
						title: '基金状态',
						field: 'status',
						filter: 'custom',
						getStatusHtml: function getStatusHtml(data) {
							return BTDict.fundStatus.get(data + '');
						},
						width: '8%'
					}, {
						title: '操作',
						type: 'buttons',
						width: '6%',
						config: [{ title: '赎回', event: 'redemFund', show: "(Number(row.validShares)) > '0'" }]
					}
				],
				initOver: $q.defer()
			};

			$scope.tableParams.initOver
				.promise.then(function (params) {
					// 查询按钮事件
					$scope.queryList = function () {
						BtUtilService
							.post(configVo.BTServerPath.Query_List_Info, $scope.searchData)
							.then(function (jsonData) {
								if (jsonData.code == 200) {
									$scope.tableParams.setRowData(jsonData.data);
								}
							});
					};
				});
			// 赎回按钮事件
			$scope.redemFund = function (item) {

				$scope.purchaseInfo = item;

				$scope.purchaseInfo.balance = $scope.purchaseInfo.validShares;

				$scope.pageInfo.src = configVo.modulePaht + '/2.html';

				BtUtilService
					.post(configVo.BTServerPath.queryFundLimit, {
						fundCode: $scope.purchaseInfo.fundCode,
						businFlag: '24',
						custType: '0',
						custNo: $scope.purchaseInfo.custNo
					})
					.then(function (jsonData) {
						if (jsonData.code === 200) {
							$scope.pageInfo.balanceValid = jsonData.data;
						}
					});

			}

			// 确认金额页面表单效验
			$scope.formParams = configVo.formParams;

			// 预览按钮事件
			$scope.toPreeSee = function ($event) {

				var formParams = $scope.formParams.getValid()
				if (!formParams) {
					BtTipbar.tipbarWarning($event.target, '表单填写有错误');
					return;
				}

				if (!balanceValidate()) {
					BtTipbar.tipbarWarning($event.target, '表单填写有错误');
					return;
				}

				for (var i = 0; i < $scope.BTDict.AccountBank.length; i++) {
					if ($scope.BTDict.AccountBank[i].value == $scope.purchaseInfo.custNo) {
						$scope.pageInfo.fund_partment_name = $scope.BTDict.AccountBank[i].name;
						break;
					}
				}

				$scope.pageInfo.src = configVo.modulePaht + '/3.html'
			};
			// 立即申购按钮事件
			$scope.confirmPurchase = function ($event) {

				$scope.purchaseInfo.shares = $scope.purchaseInfo.balance;

				BtUtilService
					.post(configVo.BTServerPath.redeemFund, angular.extend($scope.purchaseInfo,{}))
					.then(function (jsonData) {
						if (jsonData.code === 200) {
							$scope.redemResult = jsonData.data;
							$scope.pageInfo.src = configVo.modulePaht + '/4.html'
							
						} else {
							BtTipbar.tipbarWarning($event.target, jsonData.message);
							return $q.reject();
						}
					});
			};
			// 跳转到指定页
			$scope.toIndexPage = function (index) {
				$scope.pageInfo.src = configVo.modulePaht + '/' + index + '.html'
			};
		} // 初始化结束

		// 存入金额发生改变，效验规则也需要变化
		function balanceValidate() {
			if ($scope.purchaseInfo.balance < $scope.pageInfo.balanceValid.perMin) {
				$scope.pageInfo.balanceInvalidInfo = '本产品起购金额为' + $scope.pageInfo.balanceValid.perMin + '元';
				$scope.pageInfo.balanceInvalid = true;
				return false;
			} else if ($scope.purchaseInfo.balance > $scope.pageInfo.balanceValid.perMax) {
				$scope.pageInfo.balanceInvalidInfo = '本产品限购金额为' + $scope.pageInfo.balanceValid.perMax + '元';
				$scope.pageInfo.balanceInvalid = true;
				return false;
			} else {
				$scope.pageInfo.balanceInvalid = false;
				return true;
			}
		}
	}

})();
