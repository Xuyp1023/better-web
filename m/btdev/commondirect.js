/*angular公用指令
作者:binhg
*/

define(function(require,exports,module){
	/*
	全局信息缓存区
	*/
	window.$$btDisQuene = [];

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
					if (scope.$last) {
						$timeout(function() {
							scope.$emit('ngRepeatFinished');
						});
					}
				}
			};
		}]);

		/*ngOptionFilter*/
		moduleApp.directive('ngOptionFilter', ['$timeout',function ($timeout) {
			return {
				restrict: 'A',
				controller:['$scope','$attrs', '$element', '$transclude', '$log',function($scope,$attr, $element, $transclude, $log){
				}],
				link: function(scope, element, attr) {
					var $ele = $(element[0]);
					function removeBadOption(){
						$ele.parent('select').find('option').each(function(){
							var $element = $(this),
							value = $element.val();
							if(value.indexOf('?')!==-1){
								$element.remove();
							}
						});
					}
					if (scope.$last === true) {
						removeBadOption();
					}
					var ngModelExpr = $ele.parents('select').attr('ng-model');
					scope.$watch(ngModelExpr,function(){
						removeBadOption();
					});

				}
			};
		}]);

		/*
		ngBoxEnabled
		@ng-box-disabled
		@example ng-box-enabled = "info.status = 1,2,3[|number]"
		 (1)其中info.status 为对应的数据模型
		 (2)其中的1,2,3对应的是值为1,2,3其中一个时会禁用掉指令所处的元素下的表单元素
		 (3)其中的number表示为1,2,3为数值类型,|为分隔符,如果是字符串类型则不需要写
		 (4)其中的 auto 为 false 表示手动，使用$$emiterBoxEnabled来触发
		*/
		moduleApp.directive('ngBoxEnabled',[function(){
			return {
				restrict:'EA',
				replace:false,
				controller:['$scope','$attrs', '$element', '$transclude', '$log',function($scope,$attr, $element, $transclude, $log){

				}],
				link:function($scope,$element,$attr){
					var expr = $attr.ngBoxEnabled,
						isNoAuto = $.trim($attr.auto||'') === 'false'?true:false,
						exprSplit = expr.split('='),
						modelExpr = exprSplit[0],
						ctrlExpr = exprSplit[1],
						valExprArray = ctrlExpr.split('|'),
						valArray = valExprArray[0].split(','),
						valType = valExprArray.length>1 ? valExprArray[1] : 'string',
						$ele = $($element[0]) ;

					function getkeyAndValue(expr){
						if(!expr) return false;
						var exprArray = expr.split('.');
						return {
							first:$.trim(exprArray[0]),
							second:exprArray.length>1?$.trim(exprArray[1]):''
						};
					}

					function getOptionText(options,value){
						var val;
						options.each(function(){
							var $that = $(this);
							if($that.val() === value+''){
								val = $that.text();
							}
						});
						return val;
					}

					function getValue($element){
						var keyValue = getkeyAndValue($element.attr('ng-model')||$element.attr('bt-date'));
						if((!keyValue)||(!$scope[keyValue.first])) return '暂无';
						var	scopeValue = $scope[keyValue.first][keyValue.second];
						if((!scopeValue)) return '暂无';
						var	$targetEle = $element;

						if($element.is('select')){
							return getOptionText($element.find('option'),scopeValue);
						}else{
							return scopeValue;
						}
					}

					function typeTransfer(val){
						if(typeof(val)=== "boolean"){
							return val.toString();
						}
						return val;
					}


					function disabledBox(flag){
						$ele.find('input:text,select,textarea').each(function(){
							var $that = $(this),
							text = getValue($that);
							if(flag){
								$that.hide();
								$that.nextAll('[mapping="ng-box-disabled"]').remove().end().after('<span mapping="ng-box-disabled"></span>').next().text(text);
								var leftClsEle = $that.parents('.div-text-left');
								if(leftClsEle.length>0){
									leftClsEle.removeClass('div-text-left').addClass('div-text-disabled');
								}
							}else{
								var leftClsEle = $that.parents('.div-text-disabled');
								if(leftClsEle.length>0){
									leftClsEle.removeClass('div-text-disabled').addClass('div-text-left');
								}
								$that.show();
								$that.nextAll('[mapping="ng-box-disabled"]').remove();

							}

						});
					}

					function enter(){
						var isNeedFresh = false;
						for (var i = 0; i < valArray.length; i++) {
							var tempVal = $.trim(valArray[i]);
							if(valType === 'number') tempVal = Number(tempVal);
							var modelCache = modelExpr.split('.'),
								first = $.trim(modelCache[0]),
								second = modelCache.length>1?$.trim(modelCache[1]):null;
							if(modelCache.length>1){
								isNeedFresh = (typeTransfer($scope[first][second]) == tempVal);
							}else{
								isNeedFresh = (typeTransfer($scope[first]) == tempVal);
							}
							if(isNeedFresh) break;
						}
						disabledBox(!isNeedFresh);
					}

					/*
					监听数据触发
					*/
					if(!isNoAuto){
						$scope.$watch(getkeyAndValue(modelExpr).first,enter);
					}

					/*
					触发显隐切换函数
					*/
					$scope.$$emiterBoxEnabled = enter;
				}
			};
		}]);

		/*
		ngBoxActive
		@ng-box-active
		@example ng-box-enabled = "info.status = 1,2,3[|number]"
		 (1)其中info.status 为对应的数据模型
		 (2)其中的1,2,3对应的是值为1,2,3其中一个时会禁用掉指令所处的元素下的表单元素
		 (3)其中的number表示为1,2,3为数值类型,|为分隔符,如果是字符串类型则不需要写
		 (4)使用$$emiterBoxEnabled来触发
		 (5)使用bt-no-change来规避该项被改变
		*/
		moduleApp.directive('ngBoxActive',['$parse',function($parse){
			return {
				restrict:'EA',
				replace:false,
				controller:['$scope','$attrs', '$element', '$transclude', '$log',function($scope,$attr, $element, $transclude, $log){

				}],
				link:function($scope,$element,$attr){
					var expr = $attr.ngBoxActive,
						exprSplit = expr.split('='),
						modelExpr = exprSplit[0],
						ctrlExpr = exprSplit[1],
						valExprArray = ctrlExpr.split('|'),
						valArray = valExprArray[0].split(','),
						valType = valExprArray.length>1 ? valExprArray[1] : 'string',
						$ele = $($element[0]) ;

					function getkeyAndValue(expr){
						if(!expr) return false;
						var exprArray = expr.split('.');
						return {
							first:$.trim(exprArray[0]),
							second:exprArray.length>1?$.trim(exprArray[1]):''
						};
					}

					function getOptionText(options,value){
						var val = 'none';
						options.each(function(){
							var $that = $(this);
							if($that.val() === value+''){
								val = $that.text();
							}
						});
						return val;
					}

					function getValue($element){
						var keyValue = getkeyAndValue($element.attr('ng-model')||$element.attr('bt-date'));
						var currScope = angular.element($element).scope();
						if((!keyValue)||(!currScope[keyValue.first])) return '暂无';
						var	scopeValue = keyValue.second ? currScope[keyValue.first][keyValue.second] : currScope[keyValue.first];
						if((!scopeValue)) return '暂无';
						var	$targetEle = $element;

						if($element.is('select')){
							var tempVal = getOptionText($element.find('option'),scopeValue);
							if(tempVal === 'none'){
								var vmListName = $element.attr('bt-list'),
										vmValue = $element.attr('bt-value-name'),
										vmName = $element.attr('bt-name-name');
								if(!vmListName) return '暂无';
								var list = $parse(vmListName)(currScope);
								if((typeof list === 'object')&&(list instanceof Array)&&(list.length>0)){
									for (var i = 0; i < list.length; i++) {
										var tempItem = list[i];
										if(scopeValue === tempItem[vmValue]){
											tempVal = tempItem[vmName];
										}
									}

								}

							}
							return tempVal;
						}else{
							return scopeValue;
						}
					}

					function typeTransfer(val){
						if(typeof(val)=== "boolean"){
							return val.toString();
						}
						return val;
					}


					function disabledBox(flag,$ele){
						$ele.find('input:text,select,textarea').filter(':not([bt-no-change])').each(function(){
							var $that = $(this),
							text = getValue($that);
							if(flag){
								$that.hide();
								$that.nextAll('[mapping="ng-box-disabled"]').remove().end().after('<span mapping="ng-box-disabled"></span>').next().text(text);
								var leftClsEle = $that.parents('.div-text-left');
								if(leftClsEle.length>0){
									leftClsEle.removeClass('div-text-left').addClass('div-text-disabled');
								}
							}else{
								var leftClsEle = $that.parents('.div-text-disabled');
								if(leftClsEle.length>0){
									leftClsEle.removeClass('div-text-disabled').addClass('div-text-left');
								}
								$that.show();
								$that.nextAll('[mapping="ng-box-disabled"]').remove();
							}

						});
					}


					
					//执行函数
					function enter($wrapEle,param){
						if(param) modelExpr = param.modelExpr,valArray = param.valArray,valType = param.valType;
						//if(console) console.info("action "+ param.modelExpr);
						var isNeedFresh = false;
						for (var i = 0; i < valArray.length; i++) {
							var tempVal = $.trim(valArray[i]);
							if(valType === 'number') tempVal = Number(tempVal);
							var modelCache = modelExpr.split('.'),
								first = $.trim(modelCache[0]),
								second = modelCache.length>1?$.trim(modelCache[1]):null;
							if(modelCache.length>1){
								isNeedFresh = (typeTransfer($scope[first][second]) == tempVal);
							}else{
								isNeedFresh = (typeTransfer($scope[first]) == tempVal);
							}
							if(isNeedFresh) break;
						}
						disabledBox(!isNeedFresh,$wrapEle||$ele);
					}


					/*
					触发显隐切换函数
					*/
					if(typeof $scope.$$emiterBoxEnabled !== 'function') $scope.$$emiterBoxEnabled = enter;

					/*
					触发多个包裹容器转换，传入容器selector
					*/
					if(typeof $scope.$$emiterMultipleBoxEnabled !== 'function'){
						$scope.$$emiterMultipleBoxEnabled = function(selectorArray,express){
							var selectorStr = selectorArray.join(',');
							//传入表达式
							if(express){
								var exprSplit = express.split('='),
									modelExpr = exprSplit[0],
									ctrlExpr = exprSplit[1],
									valExprArray = ctrlExpr.split('|'),
									valArray = valExprArray[0].split(','),
									valType = valExprArray.length>1 ? valExprArray[1] : 'string';
								var param = {
									modelExpr:modelExpr,
									valArray:valArray,
									valType:valType
								};
							}
							enter($(selectorStr),param);
						};
					}

				}
			};
		}]);

		/*
		日期最大化关联按钮
		@ng-max-date
		*/
		moduleApp.directive('ngMaxDate',[function(){
			return{
				restrict:'EA',
				replace:false,
				controller:['$scope','$attrs', '$element', '$transclude', '$log',function($scope,$attr, $element, $transclude, $log){
				}],
				link:function($scope,tElement,tAttrs){
					var $ele = $(tElement[0]),
						$prev = $ele.prev(),
						modelExprArray = $prev.attr('bt-date').split('.'),
						first = $.trim(modelExprArray[0]),
						second = modelExprArray.length>1?$.trim(modelExprArray[1]):false;
					$ele.click(function(){
						var $that = $(this);
						if($that.is('.active')){
							$that.removeClass('active');
							$prev.val($that.attr('prevValue'));
							if(second){
								$scope[first][second] = $that.attr('prevValue');
							}else{
								$scope[first] = $that.attr('prevValue');
							}
						}else{
							$that.addClass('active');
							$that.attr('prevValue',$prev.val());
							$prev.val('2099-12-31');
							if(second){
								$scope[first][second] = '2099-12-31';
							}else{
								$scope[first] = '2099-12-31';
							}
						}

					});

					$prev.click(function(){
						$ele.removeClass('active');
					});
				}
			};
		}]);

		/*
			checkbox组
			@ng-checkbox-group 必须绑定顶层VM,类型为数组
			ng-checkbox-all 表示多选关联按钮
			ng-wrap 包裹容器
		*/
		moduleApp.directive('ngCheckboxGroup',[function(){
			return{
				restrict:'EA',
				replace:false,
				controller:['$scope','$attrs', '$element', '$transclude', '$log',function($scope,$attr, $element, $transclude, $log){
				}],
				link:function($scope,tEle,tAttrs){
					var repeatExpr = tAttrs.ngRepeat;
					function isComplete(){
						if(!repeatExpr) return true;
						var listModel = $.trim(repeatExpr.split('in')[1]);
						return $scope[listModel].length === $(tEle[0]).parent().find('tr').length;
					}
					if($scope.$last&&isComplete()){
						var $ele = function(){
								var ele = $(tEle[0]),
									wrap = ele.parents('[ng-wrap]');
								return wrap.length>0?wrap:ele;
							}(),
							$checkboxList = $ele.find('input:checkbox'),
							$checkboxListSingle = $checkboxList.filter(':not([ng-checkbox-all])'),
							$allCheckbox = $checkboxList.filter('[ng-checkbox-all]'),
							modelExpr = $.trim(tAttrs.ngCheckboxGroup||'');
						//数组去除单项
						function delArrayItem(array,targetValue){
							var targetArray = [];
							for (var i = 0; i < array.length; i++) {
								var temp = array[i];
								if(temp!==targetValue){
									targetArray.push(temp);
								}
							}
							return targetArray;
						};
						$checkboxListSingle.click(function(){
							var _that = this;
							$scope.$apply(function(){
								if(_that.checked === true){
									$scope[modelExpr].push(_that.value);
									$scope[modelExpr] = $.extend({},$scope[modelExpr]);
								}else{
									$scope[modelExpr] = delArrayItem($scope[modelExpr],_that.value);
								}
							});
						});

						$allCheckbox.click(function(){
							$checkboxListSingle.prop('checked',this.checked);
						});

						$scope.$watch(modelExpr,function(newObj){
							if(newObj.length===$checkboxListSingle.length){
								$allCheckbox.prop('checked',true);
							}else{
								$allCheckbox.prop('checked',false);
							}
						});
					}

				}
			};
		}]);

		/*ng-checkbo相关组件*/
		moduleApp.directive('ngCheckboxArray',[function(){
			return{
				restrict:'EA',
				replace:false,
				controller:['$scope','$attrs', '$element', '$transclude', '$log',function($scope,$attr, $element, $transclude, $log){
				}],
				link:function($scope,tEle,tAttrs){
					var $ele = $(tEle[0]),
						$wrap = $ele.parents('[ng-checkbox-wrap]'),
						$all =$wrap.length>0?$wrap.find('[ng-checkbox-all]'):false,
						arrayExpr = tAttrs.ngCheckboxArray;
					//处理全选函数
					function fillCheckAll($checkboxList){
						if($all&&($all.length>0)){
							var isAllCheck = true;
							$checkboxList.each(function(){
								if(!this.checked){
									isAllCheck = false;
								}
							});
							if(isAllCheck) $all.prop('checked',true);
						}
					}
					//检查数组是否重复
					function isRepeatArrayItem(array,item){
						var isRepeat = false;
						for (var i = 0; i < array.length; i++) {
							var temp = array[i];
							if(temp === item){
								isRepeat = true;
							}
						}
						return isRepeat;
					}
					//新增对应数组项
					function addArrayItem($checkboxList){
						var targetArray = [];
						$checkboxList.each(function(){
							if(this.checked){
								targetArray.push(this.value);
							}
						});
						return targetArray;
					}
					//删除对应数组项
					function delArrayItem($checkboxList,item){
						var targetArray = [];
						$checkboxList.each(function(){
							if(this.checked&&(this.value !== item)){
								targetArray.push(this.value);
							}
						});
						return targetArray;
					}
					$ele.click(function(){
						var $checkboxList = $wrap.find('[ng-checkbox-array]');
						if(this.checked){
							fillCheckAll($checkboxList);
							if(!isRepeatArrayItem($scope[arrayExpr],this.value)){
								$scope.$apply(function(){
									$scope[arrayExpr] = addArrayItem($checkboxList);
								});
							}
						}else{
							if($all) $all.prop('checked',false);
							$scope.$apply(function(){
								$scope[arrayExpr] = delArrayItem($checkboxList,this.value);
							});
						}
					});
				}
			};
		}]);

		moduleApp.directive('ngCheckboxAll',[function(){
			return{
				restrict:'EA',
				replace:false,
				controller:['$scope','$attrs', '$element', '$transclude', '$log',function($scope,$attr, $element, $transclude, $log){
				}],
				link:function($scope,tEle,tAttrs){
					var $ele = $(tEle[0]),
						$wrap = $ele.parents('[ng-checkbox-wrap]'),
						$all =$wrap.length>0?$wrap.find('[ng-checkbox-all]'):false,
						arrayExpr = tAttrs.ngCheckboxArray;
					//获取所有value的数组
					function getAllValueArray($checkboxList){
						var targetArray = [];
						$checkboxList.each(function(){
							targetArray.push(this.value);
						});
						return targetArray;
					}
					$ele.click(function(){
						var $checkboxList = $wrap.find('[ng-checkbox-array]');
						if(this.checked){
							$checkboxList.prop('checked',true);
							$scope.$apply(function(){
								$scope[arrayExpr] = getAllValueArray($checkboxList);
							});
						}else{
							var $initCheckboxList = $checkboxList.filter(':hidden,:disabled'),
								$unInitCheckboxList = $checkboxList.filter(':visible,:enabled');
								$scope.$apply(function(){
									$scope[arrayExpr] = getAllValueArray($initCheckboxList);
								});
							$unInitCheckboxList.prop('checked',false);
						}
					});


				}
			};
		}]);



	};

});
