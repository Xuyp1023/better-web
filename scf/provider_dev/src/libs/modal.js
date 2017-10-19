/*
  系统各类模态框插件
  author binhg
  @params:
  <!===============================>
  bt-roll-modal ：模板地址
  bt-z-index :模板层级控制
  <===============================!>
*/

define(function(require,exports,module){

	var _prop = {

		wrap_style:{
			marginTop:'10px',
			position:'absolute',
			left:0,
			top:0,
			zIndex:9999,
			background:'white',
			display:'none',
			width:'100%'
		},
		wrap_cls:'top-box'

	};

	angular.module('modal',[])
	/*
		卷帘模态框
	*/
	.directive('btRollModal',function(){
		return {
			restrict:'EA',
			replace:false,
			controller:['$scope','$attrs', '$element', '$transclude', '$log',function($scope,$attrs, $element, $transclude, $log){
				/*
				*打开操作
				*@params
				*modalId 卷帘下拉模态框ID 必填
				*time 下拉速度 可选 (number|'slow'|'fast'|'mormal'|defult:'fast')
				*callback 下拉后回调方法 可选 
				*isFill 是否填充满父容器
				*/
				$scope.openRollModal = function(modalId,time,callback,isFill){
					var param = {
						id:modalId,
						time : time||'fast',
						callback:callback||function(){},
						isFill:isFill||false
					},
					$wrap_box = $('#'+id);
					if(isFill) $wrap_box.height($('body').height());
					$wrap_box.slideDown(time,callback);
				};

				/*
				*关闭操作
				*@params
				*modalId 卷帘下拉模态框ID 必填
				*time 上拉速度 可选 (number|'slow'|'fast'|'mormal'|defult:'fast')
				*callback 下拉后回调方法 可选 
				*/
				$scope.closeRollModal = function(modalId,time,callback){
					var param = {
						id:modalId,
						time : time||'fast',
						callback:callback||function(){}
					},
					$wrap_box = $('#'+id);
					$wrap_box.slideUp(time,callback);
				};
			}],
			templateUrl:function(tElement,tAttrs){
				return tAttrs.btRollModal;
			},
			link:function($scope,$element,$attr){
				//初始化容器基础样式
				$element.addClass(_prop.wrap_cls).css(_prop.wrap_style).css('z-index',$attr.btZIndex);
			}
		};
	});

});

