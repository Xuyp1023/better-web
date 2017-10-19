/*
  系统各类模态框插件
  author binhg
  @params:
  <!===============================>
  bt-roll-modal ：模板地址
  bt-z-index :模板层级控制
  bt-max-width: 模板宽度
  <===============================!>
*/

define(function(require,exports,module){
	var common = require("common");
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
		detail_style:{
			maxWidth:'820px'
		},
		wrap_cls:'top-box',
		detail_cls:'div-width'

	};


	//移除行内样式的高度
	function removeHeight($target){
		var sheetStr = $target.attr("style"),
		 	begin = sheetStr.indexOf("height"),
		 	end = sheetStr.indexOf(";",begin);
		if(begin!=-1){
			var interStr = sheetStr.substring(begin,end+1),
				result = sheetStr.replace(interStr,'');
			$target.attr("style",result);
		}
	}

	/*
	*	关闭操作
	*	@params
	*	modalId 卷帘下拉模态框ID 必填
	*	time 上拉速度 可选 (number|'slow'|'fast'|'mormal'|defult:'fast')
	*	callback 下拉后回调方法 可选
	*/
	function closeBox(target,param){
		if(!target || target.length===0 || !target.hasClass("top-box-active")){
			throw new Error("该模板不存在或模板尚未激活，无法关闭！");
		}
		//打开上层模板
		var id = target.data("prev-box"),
			prev_box = $("#"+id);

		if(id!=="body"){
			var boxHeight = prev_box.height(),
				minHeight = $("body").height();
			if(minHeight > boxHeight){
				prev_box.height(minHeight);
			}
			prev_box.addClass("top-box-active").slideDown("fast",function(){
				//跳转到标题
				var anchor = $(this).find("h1");
				if(anchor && anchor.length>=1){
					common.pageSkip(anchor.first(),100);
				}
			});
		}
		target.removeClass("top-box-active").removeData("prev-box");
		//移除行内样式设置的高度
		removeHeight(target);
		common.cleanPageTip();
		target.slideUp(param.time,function(){
			common.resizeIframeListener();
			param.callback();
		});

	}

	/*
	消除数据更新对select产生的影响
	*/


	/**
	*select数据进行特殊化处理
	**/
	function _preSelect($ele){
		$ele.find('select[ng-model]').each(function(){
			var $that = $(this),
					$option = $that.find('option[ng-repeat]'),
					repeatExpr = $option.attr('ng-repeat'),
					valueExpr = $option.attr('value'),
					nameExpr = $option.attr('ng-bind');
			if($option.length<1) return false;
			var listVm = repeatExpr.match(/^[0-9a-zA-Z_\.]+\s+in\s+([0-9a-zA-Z_\.]+)\s*$/),
				valueVm =valueExpr.match(/\s*[0-9a-zA-Z_]+\.([0-9a-zA-Z_]+)\s*/),
				nameVm = nameExpr.match(/\s*[0-9a-zA-Z_]+\.([0-9a-zA-Z_]+)\s*/);
			$that.attr('bt-list',listVm[1]);
			$that.attr('bt-value-name',valueVm[1]||'value');
			$that.attr('bt-name-name',nameVm[1]||'name');
		});
	}


	angular.module('modal',[])
	/*
		卷帘模态框
	*/
	.directive('btRollModal',function(){
		return {
			restrict:'EA',
			replace:false,
			controller:['$scope','$attrs', '$element', '$transclude', '$log','$timeout',function($scope,$attrs, $element, $transclude, $log,$timeout){

				/*
				*	打开
				*	@params
				*	modalId 卷帘下拉模态框ID 必填
				*	time 下拉速度 可选 (number|'slow'|'fast'|'mormal'|defult:'fast')
				*	callback 下拉后回调方法 可选
				*/
				$scope.openRollModal = function(moduleId,time,callback){
					var param = {
						id:moduleId,
						time : time||"normal",
						callback:callback||function(){}
					},
					// 目标弹出框
					$wrap_box = $("#" + param.id),
					// 当前活跃面板
					$active = $(".top-box-active");

					var minHeight = $("body").height();
					var boxHeight = $wrap_box.height();
					if(minHeight > boxHeight){
						$wrap_box.height(minHeight);
					}

					//上层为 body
					if(!$active || $active.length===0){
						$wrap_box.addClass("top-box-active").data("prev-box","body");
					}else{
						// 隐藏上层弹出框
						var $prev_box = $active.first();
						$prev_box.removeClass("top-box-active").slideUp();
						$wrap_box.addClass("top-box-active").data("prev-box",$prev_box.attr("id"));
					}
					$wrap_box.slideDown(param.time,function(){
						common.pageSkip($wrap_box,100);
						common.resizeIframeListener();
						param.callback();
					});

				};



				/*
				*	关闭操作
				*	@params
				*	modalId 卷帘下拉模态框ID 必填
				*	time 上拉速度 可选 (number|'slow'|'fast'|'mormal'|defult:'fast')
				*	callback 下拉后回调方法 可选
				*/
				$scope.closeRollModal = function(modalId,time,callback){
					var param = {
						time : time||"fast",
						callback:callback||function(){}
					},
					target = $("#" +modalId);
					closeBox(target,param);
				};


				//避免多次监听 直接调用的angular内部变量，不推荐此种用法
				if($scope.$$listeners.ngRepeatFinished && $scope.$$listeners.ngRepeatFinished.length>=1) return;
				//监听事件， 弹出框高度变化，自动resize.
		        $scope.$on('ngRepeatFinished',function(){
		        	$timeout(function(){
						common.resizeIframeListener();
		        	});
		        });

			}],
			templateUrl:function(tElement,tAttrs){
				return tAttrs.btRollModal;
			},
			compile:function(tEle,tAttrs){
				var $ele = $(tEle[0]);
				//select预处理
				_preSelect($ele);

				return function($scope,$element,$attr){
					//初始化容器基础样式
					var $ele = $($element[0]),
						$detail_box = $ele.children();
					$element.addClass(_prop.wrap_cls).css(_prop.wrap_style).css('z-index',$attr.btZIndex);
					$detail_box.addClass(_prop.detail_cls).css(_prop.detail_style).css('max-width',$attr.btMaxWidth);

					//listening on over load template
					//pre set cache name is $$$MODAL_EVENT_QUEUE
					if((typeof $scope.$$$MODAL_EVENT_QUEUE === 'object')&&($scope.$$$MODAL_EVENT_QUEUE instanceof Array)&&($scope.$$$MODAL_EVENT_QUEUE.length>0)){
						$scope.$$$MODAL_EVENT_QUEUE[0]($attr.id);
					}
					if(typeof window.parent.$$$cache !== 'object'){
						window.parent.$$$cache = {};
					}
					window.parent.$$$cache['isModal'+$attr.id+'Load'] = true;

					var modalFlag = 'isModal'+$attr.id+'Load';

					if(typeof window.$$$MODAL_EVENT_MAP === 'object' && typeof window.$$$MODAL_EVENT_MAP[modalFlag] === 'function'){
						window.$$$MODAL_EVENT_MAP[modalFlag]();
					}

					if(typeof window.$$$MODAL_STATUS_MAP === 'object') window.$$$MODAL_STATUS_MAP[modalFlag] = true;


				};
			}
		};
	})
	/*
	模态框内部关闭
	*/
	.directive('btCloseModal',[function(){
		return {
			restrict:'EA',
			link:function($scope,$element,$attrs){
				var $ele = $($element[0]);
				$ele.live("click",function(){
					var target = $ele.parents('.top-box');
					var time = $attrs.btTime,
					callback = $attrs.btCallback ? $attrs.btCallback : '',
					param = {
						time : time||"fast",
						callback:$scope[callback]||function(){}
					};
					closeBox(target,param);
				});
			}
		};
	}])
	/*
		引入外部模板
		bt-include:需要引入的模板地址 必填
		bt-id:为模板根元素设置ID 选填
		bt-include-model:绑定元素上想要传输的模型
		bt-include-link:绑定模型的对应关系
		bt-include-click:绑定事件 bt-include-event
		bt-include-hide:隐藏该模板按钮
		bt-hide:隐藏模板属性
	*/
	.directive('btInclude',[function(){
		return {
			restrict:'EA',
			replace:true,
			controller:['$scope','$attrs', '$element', '$transclude', '$log',function($scope,$attrs, $element, $transclude, $log){}],
			templateUrl:function(tElement,tAttrs){
				return tAttrs.btInclude;
			},
			compile:function(tEle,tAttrs){
				var id = tAttrs.btId,
					$ele = $(tEle[0]),
					link = tAttrs.btIncludeLink,
					click =tAttrs.btIncludeClick,
					isHide = tAttrs.btHide;
				if(id) tEle[0].id = id;

				if(!!link) var linkArray = link.split(';');
				if(!!click) var clickArray = click.split(';');
				if(linkArray) $.each(linkArray,function(){
					var modelName = $.trim(this.split(':')[0]),
						linkName = $.trim(this.split(':')[1]),
						$modelEle = $ele.find('[bt-include-model="'+modelName+'"]');
						$modelEle.attr('ng-model',linkName);
				});
				if(clickArray) $.each(clickArray,function(){
					var modelName = $.trim(this.split(':')[0]),
						linkName = $.trim(this.split(':')[1]),
						$modelEle = $ele.find('[bt-include-event="'+modelName+'"]');
						$modelEle.attr('ng-click',linkName);
				});
				if(isHide&&(isHide === 'true')){
					$ele.hide();
				}
				//处理select字段的绑定字符
				_preSelect($ele);

				return function($scope,tEle,tAttrs){
					var $ele = $(tEle[0]);
					$ele.find('[bt-include-hide]').click(function(){
						$ele.slideUp('fast',function(){
							common.cleanPageTip();
							$scope.$emit('includeModalHide');
						});
					});

					//link渲染完成后执行回调数据
					//listening on over load template
					//pre set cache name is $$$MODAL_EVENT_QUEUE
					var modalFlag = 'isModal'+tAttrs.btId+'Load';

					if(typeof window.$$$MODAL_EVENT_MAP === 'object' && typeof window.$$$MODAL_EVENT_MAP[modalFlag] === 'function'){
						window.$$$MODAL_EVENT_MAP[modalFlag]();
					}

					if(typeof window.$$$MODAL_STATUS_MAP === 'object') window.$$$MODAL_STATUS_MAP[modalFlag] = true;


				};
			}
		};
	}])


/**
*模板相关服务
**/
.service('modalService',['$rootScope',function($rootScope){
	//listening on over load template
	//pre set cache name is $$$MODAL_EVENT_QUEUE
	if(typeof window.$$$MODAL_EVENT_MAP !== 'object'){
		window.$$$MODAL_EVENT_MAP = {};
	}
	if(typeof window.$$$MODAL_STATUS_MAP !== 'object'){
		window.$$$MODAL_STATUS_MAP = {};
	}
	return {
		/**
		*绑定某模板渲染完毕后处理函数
		**/
		onModalLoaded:function(callback,modalId){
			callback = callback||function(){};
			if(!modalId) {
				throw new Error('onModalLoaded监听方法未传入合法modalId值!');
			}
			var modalFlag = 'isModal'+modalId+'Load';
			if(window.$$$MODAL_STATUS_MAP[modalFlag]){
				callback();
			}else{
				window.$$$MODAL_EVENT_MAP[modalFlag] = callback;
			}
		}

	};
}]);


});
