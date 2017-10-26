/**=========================================================
 * 路由
 =========================================================*/
(function () {
	'use strict';

	angular
		.module('app.routes')
		.directive('btView', btView);

	btView.$inject = ['BtRouterService'];
	function btView(BtRouterService) {

		var tabsParent;

		var directive = {
			restrict: 'A',
			link: function (scope, element, attrs) {

				// 获取强约束的配置文件
				BtRouterService.getStrongConfig()
					.then(function (jsonData) {
						BtRouterService.loadHtml(jsonData,function($tabContent){
							element.append($tabContent);
						});
					})
					;

			},
			controller: 'BtRouterController'
		};

		return directive;

	}

})();