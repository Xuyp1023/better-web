define(function (require, exports, module) {

	//tooltip缓存处理区域
	$('body').bind('close_tip_active', function (e, wrap_selector) {
		var $inputList = $(wrap_selector).find('[tip_active]');
		$inputList.each(function () {
			var $that = $(this),
				tempFlag = $that.attr('mainTipFlag');
			if (!tempFlag) return;
			$('[popTipFlag="' + tempFlag + '"]').remove();
		});

	});


	/*私有方法*/
	var _personCurrent = {
		tipabarBind: function (element, tipbarElement, time, zIndex, callback, resizeCall, interval) {
			//为其绑定检测
			if (element.is('[tip_active]')) {
				var tipFlag = 'tip-active-' + Date.now();
				element.attr('mainTipFlag', tipFlag);
				tipbarElement.attr('popTipFlag', tipFlag);
			}

			//设置提示显示标志
			element.attr('istipshow', '0');
			//自设定定位层
			if (zIndex) {
				tipbarElement.css('zIndex', zIndex);
			}

			//定时关闭效果
			if (time && time !== 0 && !isNaN(time)) {
				setTimeout(function () {
					tipbarElement.remove();
					_personCurrent.bubbleReset(element, interval);
					element.attr('istipshow', '1');
					if (callback) { callback(); }
				}, time);
			} else {
				//对按钮进行特殊处理
				if (element.is('button')) {
					setTimeout(function () {
						tipbarElement.remove();
						_personCurrent.bubbleReset(element, interval);
						element.attr('istipshow', '1');
						if (callback) { callback(); }
					}, 3000);
				}
			}


			if (resizeCall !== 'bubble') {
				//清除绑定的多余事件
				element.one('focus', function () {
					tipbarElement.remove();
					element.attr('istipshow', '1');
				});

				window.parent.onresize = function () {
					//过滤掉Iframe调节产生的影响
					if (window && window.isIframeResizing) return;
					//设置绝对定位
					try {
						var left = element.offset().left + element.outerWidth() + 8;
						var top = element.offset().top + (element.height() / 2) - 10;
						tipbarElement.css({ top: top + 'px', left: left + 'px' });
						if (element.attr('istipshow') === '0') {
							tipbarElement.remove();
							resizeCall();
						}
					} catch (e) { }
				};
			}

		},
		setCheckCode: function ($element, $tipbarElement) {
			var checkCode = 'tipbar' + Date.now();
			$element.attr('tipbar-code', checkCode);
			$tipbarElement.attr('tipbar-code', checkCode);
		},
		bubbleRefresh: function ($element) {
			var checkCode = $element.attr('tipbar-code');
			if (checkCode) {
				$element.removeAttr('tipbar-code');
				$('[tipbar-code = "' + checkCode + '"]').remove();
			}
		},
		bubbleReset: function ($element, interval) {
			$element.removeAttr('tipbar-code')
				.css({
					width: 'auto',
					height: 'auto'
				});
		}
	};
	/*公用方法*/
	//右方错误提示框
	exports.errorTipbar = function (element, message, time, zIndex, callback) {
		if (element.length < 1) { if (console) console.log('创建提示框时找不到响应对象，其选择器为:' + element.selector); return; }
		var tipbarElement = $('<div mapping="tipbar" class="tipbar-wrap">' + message + '<div class="tipbar-wrap-arrow"></div></div>');
		tipbarElement.appendTo($('body'));
		//设置绝对定位
		var left = element.offset().left + element.outerWidth() + 8;
		var top = element.offset().top + (element.height() / 2) - 10;
		tipbarElement.css({ top: top + 'px', left: left + 'px' });
		var _callee = arguments.callee;
		_personCurrent.tipabarBind(element, tipbarElement, time, zIndex, callback, function () {
			_callee(element, message, time, zIndex, callback);
		});
	};

	//上方错误提示框
	exports.errorTopTipbar = function (element, message, time, zIndex, callback) {
		if (element.length < 1) { if (console) console.log('创建提示框时找不到响应对象，其选择器为:' + element.selector); return; }
		var tipbarElement = $('<div mapping="tipbar" class="tipbar-wrap">' + message + '<div class="tipbar-wrap-arrow-top"></div></div>');
		tipbarElement.appendTo($('body'));
		//设置绝对定位
		var left = element.offset().left + 10;
		var top = element.offset().top - tipbarElement.outerHeight() - 10;
		tipbarElement.css({ top: top + 'px', left: left + 'px' });
		var _callee = arguments.callee;
		_personCurrent.tipabarBind(element, tipbarElement, time, zIndex, callback, function () {
			_callee(element, message, time, zIndex, callback);
		});
	};

	//左方信息提示框
	exports.errorLeftTipbar = function (element, message, time, zIndex, callback) {
		if (element.length < 1) { if (console) console.log('创建提示框时找不到响应对象，其选择器为:' + element.selector); return; }
		var tipbarElement = $('<div mapping="tipbar" class="tipbar-wrap">' + message + '<div class="tipbar-wrap-arrow-left"></div></div>');
		tipbarElement.appendTo($('body'));
		//设置绝对定位
		var left = element.offset().left - tipbarElement.outerWidth() - 8;
		var top = element.offset().top + (element.height() / 2) - 10;
		tipbarElement.css({ top: top + 'px', left: left + 'px' });
		var _callee = arguments.callee;
		_personCurrent.tipabarBind(element, tipbarElement, time, zIndex, callback, function () {
			_callee(element, message, time, zIndex, callback);
		});
	};

	//左方信息提示框(可定义提示框的位置)
	exports.errorLeftAdjust = function (element, message, time, zIndex, parent, callback) {
		var $parent = $('#' + parent) || 'body';
		if (element.length < 1) { if (console) console.log('创建提示框时找不到响应对象，其选择器为:' + element.selector); return; }
		var tipbarElement = $('<div mapping="tipbar" class="tipbar-wrap">' + message + '<div class="tipbar-wrap-arrow-left"></div></div>');
		tipbarElement.appendTo($parent);
		//设置绝对定位
		var left = element.offset().left - tipbarElement.outerWidth() - 8;
		var top = element.offset().top + (element.height() / 2) - 10;
		tipbarElement.css({ top: top + 'px', left: left + 'px' });
		var _callee = arguments.callee;
		_personCurrent.tipabarBind(element, tipbarElement, time, zIndex, parent, callback, function () {
			_callee(element, message, time, zIndex, parent, callback);
		});
	};

	// 全局的消息提示
	exports.pop = function (type, title, body, timeout) {
		window.parent.pop(type, title, body, timeout);
	}

	//页面上方弹出信息提示
	exports.infoTopTipbar = function (message, params) {
		var _default_params = {
			msg_box_cls: 'alert alert-success alert-block',
			msg_box_width: '80%',
			slideDownTime: 500,
			during: 1500,
			slideUpTime: 500,
			fontColor: 'rgb(70, 136, 71)',
			inIframe: false
		};
		var newParams = $.extend(_default_params, params || {});
		//兼容资金管理系统措施
		var bfsFrame = $(window.parent.document).find('iframe').filter('#mainshow');
		if (bfsFrame.length > 0) newParams.inIframe = true;
		//设置标识
		var flag = newParams.msg_box_cls.split(' ').join('-');
		var tipbarElement = $('<div mapping="' + flag + '" class="' + newParams.msg_box_cls + '"><p>' + message + '</p></div>');
		tipbarElement.css({
			width: newParams.msg_box_width,
			position: 'fixed',
			zIndex: 800,
			textAlign: 'center',
			top: 0,
			left: '50%',
			color: newParams.fontColor,
			display: 'none'
		})
			.appendTo(newParams.inIframe ? $('body') : $(window.parent.document.body))
			.css('marginLeft', '-' + (tipbarElement.outerWidth() / 2) + 'px')
			.slideDown(newParams.slideDownTime, function () {
				window.setTimeout(function () {
					tipbarElement.slideUp(newParams.slideUpTime, function () {
						tipbarElement.remove();
					});
				}, newParams.during);
			});
		//页面卸载时启动自我销毁
		$(window).unload(function () {
			tipbarElement.remove();
		});
		return tipbarElement;
	};

	//自定义框元素弹出效果
	exports.boxTopTipbar = function (element, targetObject, closeElement, params) {
		var _default_params = {
			wrapCss: {
				position: 'absolute',
				left: 0,
				top: 0,
				zIndex: 900,
				display: 'none',
				backgroundColor: 'white'
			},
			closeSelector: '.close-tipbar',
			slideDownSpeed: 'slow',
			slideUpSpeed: 'slow'

		};
		var newParams = $.extend(true, _default_params, params === null || params === undefined ? {} : params),
			tipbarElement = $('<div></div>');
		//前置处理
		if (targetObject.css('position') === 'static') {
			targetObject.css('position', 'relative')
				.attr('isStatic', 'true');
		}
		element = $(element.html());
		//增加信息操作
		tipbarElement.css(newParams.wrapCss)
			.css({
				width: targetObject.width() + 'px',
				height: targetObject.height() + 'px'
			})
			.appendTo(targetObject)
			.append(element)
			.slideDown(newParams.slideDownSpeed);
		//创建关闭事件
		var closeHandle = function () {
			if (targetObject.attr('isStatic') === 'true') {
				targetObject.css('position', 'static')
					.attr('isStatic', 'false');
			}
			tipbarElement.slideUp(newParams.slideUpSpeed, function () {
				$(this).remove();
			});
		};
		if (closeElement) {
			closeElement.click(function () {
				closeHandle();
			});
		} else {
			$(element).find(newParams.closeSelector).click(function () {
				closeHandle();
			});
		}

	};
	/*绝对位置提示框*/
	//上方信息提示
	exports.bubbleTopTipbar = function ($element, message, time, zIndex, callback) {
		var interval = _personCurrent.bubbleRefresh($element);
		if ($element.length < 1) { if (console) console.log('创建提示框时找不到响应对象，其选择器为:' + $element.selector); return; }
		var $tipbarElement = $('<div mapping="tipbar" class="bubble-wrap">' + message + '<div class="tipbar-wrap-arrow-top"></div></div>'),
			isIe = !!$.browser.msie,
			elementHeight = $element.outerHeight(),
			element_style = {
				height: isIe ? $element.innerHeight() : elementHeight,
				width: (isIe ? $element.innerWidth() : $element.outerWidth()),
				overflow: 'hidden'
			};
		// $tipbarElement.css('visibility','hidden');
		// $('#content').append($tipbarElement);
		// var tipbarOuterWidth = $tipbarElement.outerHeight(),
		// 	tipbarInnerWidth = $tipbarElement.innerHeight();
		// $('#content > [mapping="tipbar"]').remove();
		$element.css(element_style);
		// $tipbarElement.css('visibility','visible');
		$element.addClass('btn-outline-none');
		$element.append($tipbarElement);
		_personCurrent.setCheckCode($element, $tipbarElement);
		// $tipbarElement.css('width',isIe?tipbarInnerWidth:tipbarOuterWidth);
		var tipbarHeight = $tipbarElement.outerHeight(),
			elementPddingBottom = $element.css('padding-bottom').split('px')[0];
		//设置绝对定位
		var top = '-' + (elementHeight + tipbarHeight + 10 - elementPddingBottom);
		$tipbarElement.css({ top: top + 'px', left: '0' });
		$element.css('overflow', 'visible');
		_personCurrent.tipabarBind($element, $tipbarElement, time, zIndex, callback, 'bubble', interval);
	};

	exports.cleanPageTip = function () {
		$('[mapping="tipbar"]').remove();
	};

	/*
	*=================================表格专用提示框==========================================
	*/
	_trTipCls = {
		display: 'none'
	};
	_tdTipCls = {
		'padding': '2px'
	};
	_pTipCls = {
		'padding-top': '2px',
		'padding-bottom': '2px',
		'margin-bottom': 0,
		'padding-right': '0px',
		'font-size': '12px'
	};

	//获取table最大的colspan数字
	function _getMaxCol($table) {
		var num = 0,
			$trList = $table.find('tbody>tr,thead>tr');
		$trList.each(function () {
			var $that = $(this),
				tdLength = $that.find('td').length;
			if (tdLength > num) num = tdLength;
		});
		return num;

	}

	//增加气泡改变模板和iframe高度
	function _addHeight($element, $tipElement) {
		var $rollModal = $element.parents('[bt-roll-modal]'),
			$mainIframe = $(window.parent.document).find('#content_iframe'),
			tipHeight = $tipElement.outerHeight();
		$rollModal.height($rollModal.height() + (tipHeight || 0));
		$mainIframe.height($mainIframe.height() + (tipHeight || 0));
	}

	//减去气泡收缩引起的iframe减小
	function _subHeight($element, $tipElement) {
		if ($element.is('[mainTdTipFlag]')) {
			$element.removeAttr('mainTdTipFlag');
		}

		var $rollModal = $element.parents('[bt-roll-modal]'),
			$mainIframe = $(window.parent.document).find('#content_iframe'),
			tipHeight = $tipElement.outerHeight();
		$rollModal.height($rollModal.height() - (tipHeight || 0));
		$mainIframe.height($mainIframe.height() - (tipHeight || 0));
	};

	exports.trTipbar = function ($element, message) {
		if ($element.length < 1) { if (console) console.log('创建提示框时找不到响应对象，其选择器为:' + $element.selector); return; }
		var $trElement = $('<tr mapping="trTipbar"></tr>'),
			trTipFlag = 'tr-tip-flag-' + Date.now();
		//设置标记
		$trElement.attr('popTrTipFlag', trTipFlag);
		$element.attr('mainTrTipFlag', trTipFlag);
		$trElement.css(_trTipCls);
		//创建子标记
		var colspan = _getMaxCol($element.parents('table')),
			$tdElement = $('<td colspan="' + colspan + '"></td>');
		$tdElement.css(_tdTipCls);
		$tdElement.appendTo($trElement);
		//创建提示p标记
		var $pElement = $('<p class="alert alert-warning">' + message + '</p>');
		$pElement.css(_pTipCls);
		$pElement.appendTo($tdElement);
		//插入整体提示
		$element.parents('tr').after($trElement);
		$trElement.slideDown('slow');
		//绑定删除事件
		$element.bind('focus', function () {
			// $pElement.removeClass('alert-warning');
			// $pElement.addClass('alert-error');

			$trElement.slideUp('fast', function () {
				$trElement.remove();
			});
			_subHeight($(this), $trElement);
		});
		/*$element.blur('focus',function(){
			$pElement.removeClass('alert-error');
			// $pElement.addClass('alert-warning');
		});*/
		//调节高度
		_addHeight($element, $trElement);

	};

	//td内部信息提示块
	exports.tdTipbar = function ($element, message) {
		if ($element.length < 1) { if (console) console.log('创建提示框时找不到响应对象，其选择器为:' + $element.selector); return; };

		//重置
		if ($element.is('[mainTdTipFlag]')) {
			var $tempTipEle = $('[popTdTipFlag=' + $element.attr('mainTdTipFlag') + ']');
			_subHeight($element, $tempTipEle);
			$tempTipEle.remove();
		}

		//创建提示p标记
		var $pElement = $('<p class="alert alert-error" style="margin-right:2px;"><i class="icon-info-sign"></i>' + message + '</p>'),
			_tipCls = $.extend({}, _pTipCls, {
				'margin-top': '2px',
				'width': $element.width() + 'px'
			});

		$pElement.css(_tipCls);
		var tdTipFlag = 'td-tip-flag-' + Date.now();
		$pElement.attr('popTdTipFlag', tdTipFlag);
		$element.attr('mainTdTipFlag', tdTipFlag);
		$pElement.appendTo($element.parents('td'));
		//绑定删除事件
		/*$element.bind('focus',function(){

			var $tempTipEle = $('[popTdTipFlag='+$(this).attr('mainTdTipFlag')+']');
			_subHeight($(this),$tempTipEle);
			$tempTipEle.slideUp('fast',function() {
				$(this).remove();
			});
		});*/
		//调节高度
		_addHeight($element, $pElement);

	};



	/*===============================================表格专用提示框 end ===============================================*/

});
