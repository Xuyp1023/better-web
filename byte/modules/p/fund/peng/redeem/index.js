/**=========================================================
 * 基金类-卖出理财产品弹出框控制器
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('p.fund.peng.redeem', MainController);

	MainController.$inject = ['$scope','BtUtilService','configVo'];
	function MainController($scope,BtUtilService,configVo) {

		activate();

		BtUtilService
			.post(configVo.BTServerPath.Query_Fund_BasicInfo)
			.then(function (jsonData) {
				$scope.rowDatas = jsonData.data;
			});

		////////////////
		//初始化方法开始
		function activate() {

			// 立即买入
			$scope.redeemOut = function () {
				BtUtilService.open({ templateUrl: 'modules/p/fund/peng/redeem/result.html', scope: $scope });
			}
			// 确定
			$scope.confirm = function () {

				if (window.btRemoveModal) window.btRemoveModal();
			}

			//关闭按钮的事件
			$scope.closeModal = function () {
				if (window.btRemoveModal) window.btRemoveModal();
			};

			if (window.addEventListener) {  // all browsers except IE before version 9
				window.addEventListener("message", receiver, false);
			} else if (window.attachEvent) {   // IE before version 9
				window.attachEvent("onmessage", receiver);
			};
			function receiver(event) {

				var source = event.source, origin = event.origin;
				window.btRemoveModal = function () {
					window.btRemoveModal = null;
					source.postMessage('remove', origin);
				}
				if (window.removeEventListener) {  // all browsers except IE before version 9
					window.removeEventListener("message", receiver, false);
				} else if (window.attachEvent) {   // IE before version 9
					window.detachEvent("onmessage", receiver);
				};

			};

			// 清楚模态对画框
			// $scope.$on("$destroy", function() {
			//     if(window.btRemoveModal) window.btRemoveModal();
			// })

		} // 初始化结束
	}

})();
