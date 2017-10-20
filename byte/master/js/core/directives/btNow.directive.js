/**=========================================================
 * 时间变化的指令
 =========================================================*/
(function () {
	'use strict';
	angular
		.module('app.core')
		.directive('btNow', btNow);

	btNow.$inject = ['$parse', '$interval'];
	function btNow($parse, $interval) {

		return {
			restrict: 'EA',
			link: function (scope, element, attrs) {

				function updateTime(){
					switch (attrs.type) {
						case 'now':
							break;
						case 'decrease':
							var time = element.text() || $parse(attrs.name)(scope);
							updateTime = decrease;
							element.text(time);
							break;
					}
				}

				updateTime();
				var intervalPromise = $interval(updateTime, 1000);

				scope.$on('$destroy', function(){
					$interval.cancel(intervalPromise);
				});

				//	秒数递减
				function decrease(){
					var time = element.text();
					time--;
					element.text(time);
					if(time == 0){
						$interval.cancel(intervalPromise);
					}
				}
			}
		}
	}
})();