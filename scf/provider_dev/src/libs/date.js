/*
  系统日期插件
  author binhg
  仅作用于input元素
  @params:
  <!=============必填================>
  bt-date    ：传入需要绑定的属性值
  <===============================!>
  
  <!=============选填================>
  bt-max-date:传入最大日期的ID
  bt-min-date:传入最小日期的ID
  bt-format  :传入日期格式          默认为yyyy-MM-dd
  bt-readonly:日期输入框是否只读    默认为true
  bt-wdate-cls:日期输入框是否带有默认样式  默认为true
  <===============================!>
  
*/

define(function(require,exports,module){
	require('datePicker');

	var _prop = {

		wrap_style:{
		},
		date_cls:'Wdate'

	};

	angular.module('date',[])

	.directive('btDate',function(){
		return {
			restrict:'EA',
			replace:false,
			controller:['$scope','$attrs', '$element', '$transclude', '$log',function($scope,$attr, $element, $transclude, $log){
			}],
			link:function($scope,$element,$attr){
				var dateEle = $element[0],
					$dateEle = $(dateEle),
					max = $attr.btMaxDate?'#F{$dp.$D(\''+$attr.btMaxDate+'\')}':false,
					min = $attr.btMinDate?'#F{$dp.$D(\''+$attr.btMinDate+'\')}':false,
					fmt = $attr.btFormat||'yyyy-MM-dd',
					readonly = $attr.btReadonly === 'false'?false:true,
					wdate = $attr.btWdateCls === 'false'?false:true;
				var datePro = $attr.btDate;
				if(!datePro||(!/^\w+\.\w+$/.test(datePro))){
					if(console) console.log('您输入的数据在VM中无法找到！');
					return;
				}
				var dateData = datePro.split('.')[0],
					dateName = datePro.split('.')[1];

				$scope.$watch(datePro,function(){
					$dateEle.val($scope[dateData][dateName]);
				});

				//初始化容器基础样式以及属性
				if(wdate) $dateEle.addClass(_prop.date_cls);
				if(readonly) $dateEle.prop('readonly',true);

				/*
				*日期组件事件处理
				*/
				var dateParam = {
					startDate:'%y-%M-%d',
					dateFmt:fmt
				};
				if(max) dateParam.maxDate = max;
				if(min) dateParam.minDate = min;

				$dateEle.click(function(){
					WdatePicker(dateParam);
				});

				$dateEle.focus(function(event){
						var target = event.target||event.srcElement;
						$scope[dateData][dateName] = target.value;
				});

			}
		};
	});

});

