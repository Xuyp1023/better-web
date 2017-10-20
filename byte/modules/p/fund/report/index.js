/**=========================================================
 * 基金-风险评测
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('p.fund.report', MainController);

	MainController.$inject = ['$scope', 'BtUtilService', 'configVo', 'BtTipbar','$parse','BtPopInfo'];
	function MainController($scope, BtUtilService, configVo, BtTipbar,$parse,BtPopInfo) {

		activate();

		// 刷新交易账户列表
		BtUtilService
			.post(configVo.BTServerPath.TRADE_ACCOUNT_LIST)
			.then(function (jsonData) {
				if (jsonData.code === 200) {
					$scope.BTDict.TRADE_ACCOUNT_LIST = jsonData.data;
					$scope.searchData.custNo = jsonData.data[0];
				}
			});

		////////////////
		//初始化方法开始
		function activate() {

			$scope.BTDict = {
				SaleAgency: BTDict.RiskAssessment.toArray()              //基金品种
			};
			$scope.searchData = {
				agencyNo:'203' // 默认选中华夏
			};
			$scope.pageInfo = {
				src: configVo.modulePaht + '/'+ $scope.searchData.agencyNo +'.html'
			}
			$scope.evaluateData = {};
			// 查询按钮事件
			$scope.reFreshReportInfo = function ($event) {

				//检查交易账户是否选择
				if (!$scope.searchData.custNo) {
					BtTipbar.tipbarWarning($event.target, '请选择交易账户！');
					return false;
				}

				BtUtilService
					.post(configVo.BTServerPath.ReFresh_ReportInfo, $scope.searchData)
					.then(function (jsonData) {
						if (jsonData.code === 200) {
							$scope.evaluateData = jsonData.data;
						}else{
							$scope.evaluateData = {};
						}
						$scope.pageInfo.src = configVo.modulePaht + '/' + $scope.searchData.agencyNo + '.html';
					});
			}

			// 高度自适应
			$scope.refreshPage = function(){
				BtUtilService.freshIframe();
			}

			// 提交按钮事件
			$scope.submitReport = function ($event) {

				//检查交易账户是否选择
				if (!$scope.searchData.custNo) {
					BtTipbar.tipbarWarning($event.target, '请选择交易账户！');
					return false;
				}

				//检查选项是否已全部填写
				if (!validateOption($scope.evaluateData)) {
					BtTipbar.tipbarWarning($event.target, '问卷尚未填写完全！');
					return false;
				}

				switch ($scope.searchData.agencyNo){
					case '201': //南方基金
						$scope.evaluateData.examNo="1";
						break;
					case '203':	//华夏基金
						$scope.evaluateData.examNo="2";
						break;
					case '303':	//天天基金
					$scope.evaluateData.examNo="3";
					break;
				}

				BtUtilService
					.post(configVo.BTServerPath.Submit_Report, angular.extend({}, $scope.searchData, $scope.evaluateData))
					.then(function (jsonData) {
						if (jsonData.code === 200) {

							$scope.reFreshReportInfo();

							BtTipbar.pop('success', '提示信息', '提交成功!');
							// $scope.evaluateData = jsonData.data;
							BtUtilService.open({ templateUrl: configVo.modulePaht + '/risk_level_box.html', scope: $scope });

						} else {
							BtTipbar.tipbarWarning($event.target, jsonData.message);
							// BtTipbar.pop('error', '提示信息', jsonData.message);
						}
					});

			};
		} // 初始化结束

		function validateOption(evaluateData) {

			var children = document.getElementById('fund_search_way').getElementsByTagName('*');
			for (var i = 0; i < children.length; i++) {
				var child = children[i];
				var eleValue = child.getAttribute('ng-model');
				if (eleValue && !$parse(eleValue)($scope)) {
					return false;
				}
			}
			return true;
		}
	}

})();
