/*angular公用指令
作者:binhg
*/

define(function(require,exports,module){

	//扩充指令入口
	exports.direcPlus = function(moduleApp){
		/*ngFocus*/
		moduleApp.directive('ngFocus', ['$parse', function($parse) {
		  return function(scope, element, attr) {
		    var fn = $parse(attr['ngFocus']);
		    element.bind('focus', function(event) {
		      scope.$apply(function() {
		        fn(scope, {$event:event});
		      });
		    });
		  };
		}]);
		/*ngBlur*/
		moduleApp.directive('ngBlur', ['$parse', function($parse) {
		  return function(scope, element, attr) {
		    var fn = $parse(attr['ngBlur']);
		    element.bind('blur', function(event) {
		      scope.$apply(function() {
		        fn(scope, {$event:event});
		      });
		    });
		  };
		}]);
		/*ngLoad*/
		moduleApp.directive('ngLoad', ['$parse', function($parse) {
		  return function(scope, element, attr) {
		    var fn = $parse(attr['ngLoad']);
		    element.bind('load', function(event) {
		      scope.$apply(function() {
		        fn(scope, {$event:event});
		      });
		    });
		  };
		}]);
		/*ngRepeatFinish*/
		moduleApp.directive('ngRepeatEnd', ['$timeout',function ($timeout) {
			return {
				restrict: 'A',
				link: function(scope, element, attr) {
						if (scope.$last === true) {
							$timeout(function() {
							scope.$emit('ngRepeatFinished');
							});}
					}
			};
		}]);

		/*ngOptionFilter*/
		moduleApp.directive('ngOptionFilter', ['$timeout',function ($timeout) {
			return {
				restrict: 'A',
				link: function(scope, element, attr) {
					if (scope.$last === true) {
						$(element[0]).parent('select').find('option').each(function(){
							var $element = $(this),
							value = $element.val();
							if(value.indexOf('?')!==-1){
								$element.remove();
							}
						});
					}
						
				}
			};
		}]);
	};

});

