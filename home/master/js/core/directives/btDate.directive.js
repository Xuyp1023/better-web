/**=========================================================
 * 时间选择的指令
 =========================================================*/
(function () {
	'use strict';

	angular
		.module('app.core')
		.directive('btDate', btDate);

	btDate.$inject = ['$parse', '$timeout'];
	function btDate($parse, $timeout) {

		return {
			restrict: 'A',
			link: function (scope, element, attrs) {

				element.attr("readonly", true);

				var config = scope.$eval(attrs.btDate) || {};
				if (attrs.longTerm) {
					var buttonEle = angular.element('<button class="bt-btn bt-btn-default bt-left-8">长期有效</button>');
					element.after(buttonEle);

					buttonEle
						.on('click', function () {
							$timeout(function () {
								$parse(attrs.ngModel).assign(scope, '2099-12-31');
								element.addClass("ng-dirty");
							}, 1);
						});
				}

				element
					.on('click', function (e) { e.stopPropagation(); })
					.on('click', function () {

						var elePos = element[0].getBoundingClientRect();

						var config = scope.$eval(attrs.btDate) || {};

						var inputElement = angular.element('<input>');
						var dateParam = {
							startDate: element[0].value,
							position: { left: elePos.left, top: (elePos.top + element[0].offsetHeight) },
							el: inputElement[0],
							dateFmt: config.dateFmt || 'yyyy-MM-dd',
							onpicked: function () {
								var modelDate = inputElement[0].value;
								$timeout(function () {
									$parse(attrs.ngModel).assign(scope, modelDate);
									element.addClass("ng-dirty");

									if(attrs.callback){
										$parse(attrs.callback)(scope);
									}
								}, 1);
							},
							oncleared: function () {
								$timeout(function () {
									$parse(attrs.ngModel).assign(scope, '');
									element.addClass("ng-dirty");
								}, 1);
							}
							// onpicking:function(){
							//     console.log('pick');
							// }
						};

						if (config.max) dateParam.maxDate = config.max;
						if (config.min) dateParam.minDate = config.min;

						window.WdatePicker(dateParam)
					});
			}
		};
	}
})();