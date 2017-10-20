/**=========================================================
 * 自定义表单效验的指令
 =========================================================*/
(function () {
	'use strict';

	angular
		.module('app.core')
		.directive('btPattern', btPattern);

	btPattern.$inject = ['$parse', '$timeout'];
	function btPattern($parse, $timeout) {

		var pattern = {
			mobile:/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
			email:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/,
			phone:/^((\d{3,4}-)?\d{7,8})$|^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
			fax:/(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/,
			zipcode:/(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/,
			money:/^([1-9]\d+\.?(\d{1,2})?)$|^([0-9]\.?(\d{1,2})?)$/,
			int:/^\d+$/
		};

		return {
			require: 'ngModel',
			restrict: 'A',
			link: function (scope, element, attrs, ngModel) {

				if(!attrs.btPattern) return;
				var cPattern = pattern[attrs.btPattern];

				//注册model到view的转换视图
				// ngModel.$formatters.push(function(value) {
				// 	ngModel.$setValidity('unique', false);
				// });
				//注册view到model的解析视图
				ngModel.$parsers.push(function(value) {

					if(!value || cPattern.test(value)){
						ngModel.$setValidity('btPattern', true);
						return value;
					}else{
						ngModel.$setValidity('btPattern', false);
					}
				});

			}
		};

	}
})();