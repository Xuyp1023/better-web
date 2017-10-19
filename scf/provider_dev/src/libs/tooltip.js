define(function(require,exports,module){
	/*私有方法*/
	var _personCurrent = {
		tipabarBind : function(element,tipbarElement,time,zIndex,callback,resizeCall){
			//设置提示显示标志
			element.attr('istipshow','0');
			//自设定定位层
			if(zIndex){
				tipbarElement.css('zIndex',zIndex);
			}
			//对按钮进行特殊处理
			if(element.is('button')){
				setTimeout(function(){
					tipbarElement.remove();
					element.attr('istipshow','1');
					if(callback){callback();}
				},3000);
			}
			//定时关闭效果
			if(time&&time!==0&&!isNaN(time)){
				setTimeout(function(){
					tipbarElement.remove();
					element.attr('istipshow','1');
					if(callback){callback();}
				},time);
			}
			//清除绑定的多余事件
			element.one('focus',function(){
				tipbarElement.remove();
				element.attr('istipshow','1');
			});
			window.top.onresize = function(){
				/*//过滤掉Iframe调节产生的影响
				if(window.isIframeResizing) return;
				//设置绝对定位
				var left = element.offset().left+element.outerWidth()+8;
				var top = element.offset().top+(element.height()/2)-10;
				tipbarElement.css({top:top+'px',left:left+'px'});*/
				if(element.attr('istipshow') === '0'){
					tipbarElement.remove();
					resizeCall();
				}
			};
		}
	};
	/*公用方法*/
	//右方错误提示框
	exports.errorTipbar = function(element,message,time,zIndex,callback){
		if(element.length<1){if(console) console.log('创建提示框时找不到响应对象，其选择器为:'+element.selector); return;}
		var tipbarElement = $('<div mapping="tipbar" class="tipbar-wrap">'+message+'<div class="tipbar-wrap-arrow"></div></div>');
		tipbarElement.appendTo($('body'));
		//设置绝对定位
		var left = element.offset().left+element.outerWidth()+8;
		var top = element.offset().top+(element.height()/2)-10;
		tipbarElement.css({top:top+'px',left:left+'px'});
		var _callee = arguments.callee;
		_personCurrent.tipabarBind(element,tipbarElement,time,zIndex,callback,function(){
			_callee(element,message,time,zIndex,callback);
		});
	};

	//上方错误提示框
	exports.errorTopTipbar = function(element,message,time,zIndex,callback){
		if(element.length<1){if(console) console.log('创建提示框时找不到响应对象，其选择器为:'+element.selector); return;}
		var tipbarElement = $('<div mapping="tipbar" class="tipbar-wrap">'+message+'<div class="tipbar-wrap-arrow-top"></div></div>');
		tipbarElement.appendTo($('body'));
		//设置绝对定位
		var left = element.offset().left+10;
		var top = element.offset().top-tipbarElement.outerHeight()-10;
		tipbarElement.css({top:top+'px',left:left+'px'});
		var _callee = arguments.callee;
		_personCurrent.tipabarBind(element,tipbarElement,time,zIndex,callback,function(){
			_callee(element,message,time,zIndex,callback);
		});
	};

	//左方信息提示框
	exports.errorLeftTipbar = function(element,message,time,zIndex,callback){
		if(element.length<1){if(console) console.log('创建提示框时找不到响应对象，其选择器为:'+element.selector); return;}
		var tipbarElement = $('<div mapping="tipbar" class="tipbar-wrap">'+message+'<div class="tipbar-wrap-arrow-left"></div></div>');
		tipbarElement.appendTo($('body'));
		//设置绝对定位
		var left = element.offset().left-tipbarElement.outerWidth()-8;
		var top = element.offset().top+(element.height()/2)-10;
		tipbarElement.css({top:top+'px',left:left+'px'});
		var _callee = arguments.callee;
		_personCurrent.tipabarBind(element,tipbarElement,time,zIndex,callback,function(){
			_callee(element,message,time,zIndex,callback);
		});
	};

	//页面上方弹出信息提示
	exports.infoTopTipbar = function(message,params){
		var _default_params ={
			msg_box_cls : 'alert alert-success alert-block',
			msg_box_width : '80%',
			slideDownTime : 500,
			during:1500,
			slideUpTime : 500,
			fontColor : 'rgb(70, 136, 71)',
			inIframe : false
		};
		var newParams = $.extend(_default_params,params||{});
		//兼容资金管理系统措施
		var bfsFrame = $(window.parent.document).find('iframe').filter('#mainshow');
		if(bfsFrame.length>0) newParams.inIframe = true;
		//设置标识
		var flag = newParams.msg_box_cls.split(' ').join('-');
		var tipbarElement = $('<div mapping="'+flag+'" class="'+newParams.msg_box_cls+'"><p>'+message+'</p></div>');
		tipbarElement.css({
			width:newParams.msg_box_width,
			position:'fixed',
			zIndex : 800,
			textAlign:'center',
			top : 0,
			left:'50%',
			color:newParams.fontColor,
			display:'none'
		})
		.appendTo(newParams.inIframe ? $('body') : $(window.parent.document.body))
		.css('marginLeft','-'+(tipbarElement.outerWidth()/2)+'px')
		.slideDown(newParams.slideDownTime,function(){
			window.setTimeout(function(){
				tipbarElement.slideUp(newParams.slideUpTime,function(){
					tipbarElement.remove();
				});
			},newParams.during);
		});
		//页面卸载时启动自我销毁
		$(window).unload(function(){
			tipbarElement.remove();
		});
		return tipbarElement;
	};

	//自定义框元素弹出效果
	exports.boxTopTipbar = function(element,targetObject,closeElement,params){
		var _default_params = {
			wrapCss : {
				    position: 'absolute',
				    left: 0,
				    top:0,
				    zIndex: 900,
				    display: 'none',
				    backgroundColor: 'white'
			},
			closeSelector : '.close-tipbar',
			slideDownSpeed : 'slow',
			slideUpSpeed : 'slow'

		};
		var newParams = $.extend(true,_default_params,params===null||params===undefined?{}:params),
		tipbarElement = $('<div></div>');
		//前置处理
		if(targetObject.css('position')==='static'){
			targetObject.css('position','relative')
			.attr('isStatic','true');
		}
		element = $(element.html());
		//增加信息操作
		tipbarElement.css(newParams.wrapCss)
		.css({
			width:targetObject.width()+'px',
			height:targetObject.height()+'px'
		})
		.appendTo(targetObject)
		.append(element)
		.slideDown(newParams.slideDownSpeed);
		//创建关闭事件
		var closeHandle = function(){
			if(targetObject.attr('isStatic')==='true'){
				targetObject.css('position','static')
				.attr('isStatic','false');
			}
			tipbarElement.slideUp(newParams.slideUpSpeed,function(){
				$(this).remove();
			});
		};
		if(closeElement){
			closeElement.click(function(){
				closeHandle();
			});
		}else{
			$(element).find(newParams.closeSelector).click(function(){
				closeHandle();
			});
		}

	};

	exports.cleanPageTip = function(){
		$('[mapping="tipbar"]').remove();
	};
});