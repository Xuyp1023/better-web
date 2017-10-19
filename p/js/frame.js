/**
*登录首页
*作者:binhg
*/
define(function(require,exports,module){
	require('l/bootstrap/js/bootstrap.min');
	require("l/My97DatePicker/4.8/WdatePicker.js");
	var validate = require("m/sea_modules/validate");
    var tipbar = require("m/sea_modules/tooltip");
    var common = window.common = require("p/js/common/common");
    var placeholder = require("m/sea_modules/placeholder");
    var dialog = require('m/sea_modules/dialog');
    require('l/jquery-plugins/jquery.cookie');

	//模块数据声明和初始化(Model)
	window.currentData = {
		pwdInfo : {},
		userInfo :{
			userName:function(){
				var userName,
				isBFS = location.hash.indexOf('bfs')>-1;
				if(isBFS){
					userName = location.search.split('?')[1].split('&')[0].split('=')[1];
				}else{
					userName = $.cookie('user_name');
				}
				return userName;
			}()
		}
	};


	//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
	window.viewModel = {
		//属性绑定监控
		pwdInfoBind : ko.observable(currentData.pwdInfo),
		userInfoBind : ko.observable(currentData.userInfo),
		//事件绑定
		contentIframeLoad:function(data,event){
			var content_iframe = $(document).find('#content_iframe');
			content_iframe.css('height',($(window).height()+1)+'px');
			var iframe = window.frames.content_iframe.document;
			if($(iframe).find('body').outerHeight()<$(window.frames.content_iframe).height()){
				$(iframe).find('body').css('minHeight',$(window.frames.content_iframe).height()+'px');
			}
			
			var height = $(iframe).find('body').outerHeight();
			if(height<=content_iframe.height()) return;
			height+=20;
			var toHeight = height-content_iframe.height()>0?'+='+(height-content_iframe.height()):'-='+(content_iframe.height()-height);
			content_iframe.stop().animate({
				height:toHeight+'px'
			},500);
		},
		logout:function(){
			dialog.confirm('是否确认退出登录?',function(){
				$.post(common.getRootPath()+'/logout',{},function(data){
					// if(data.code === 401){
					// 	location.href = 'login.html';
					// }
				},'json');
				location.href = 'login.html';
			});
		},
		//修改密码
		modiPwd : function(data,event){
			var $target = $(event.target||event.srcElement),
			validResult = validate.validate($('#modi_pwd_form'));
			if(validResult){
				$.post(common.getRootPath()+'/Platform/CustOperator/updatePassword',currentData.pwdInfo,function(data){
					if(data.code === 200){
						tipbar.errorTopTipbar($target,'修改成功!',1500,9999,function(){
							$('#modi_pwd_box').modal('hide');
							$.post(common.getRootPath()+'/logout',{},function(data){},'json');
							location.href = 'login.html';
						});
					}else{
						tipbar.errorTopTipbar($target,'修改失败,原因:'+data.message,3000,9999);
					}
				},'json');
			}else{
				tipbar.errorTopTipbar($target,'您还有选项未正确填写，请检查!',3000,9999);
			}
		},
		//菜单切换
		switchMenu : function(data,event){
			var $target = $(event.target||event.srcElement),
			menu_id = $target.is('li')?$target.attr('menuid'):$target.parents('li').attr('menuid');
			$('#nav_iframe').attr('src','sidebar/sidebar.html?rn='+Math.random()+'#'+menu_id);
		}
	};

	//定义私有属性以及方法
	var _personModule = {
		//各步骤前置处理方法
		


	};

	//定义全局属性以及方法


    //定义初始化设置以及方法
    $(document).ready(function(){
    	var initPage = function(){
    		// $('#content_navbar,#content_area')
    		// .css('min-height',($(window).height()+1)+'px')
    		// .find('#content_iframe')
    		// .attr('src','fundInfo/fundInfo.html?rn='+Math.random());
    		$('#nav_iframe').attr('src','sidebar/sidebar.html?rn='+Math.random()+'#1');
    		// if(location.href.indexOf('qiejf')!==-1){
    		// 	$.post(common.getRootPath()+'/tokenLogin?ticket=1234',{},function(){});
    		// }
    	};
    	initPage();
    	// var timeWait = window.setInterval(function(){
    	// 	console.log(111);
	    // 		if(common.isBFS()){
	    // 			if($.cookie('JSESSIONID')!==null){
	    // 				initPage();
	    // 				clearInterval(timeWait);
	    // 			}
	    // 		}else{
	    // 			initPage();
	    // 			clearInterval(timeWait);
	    // 		}
    	// },500);
    	
    	
    });

    $('#modi_pwd_box').on('hide',function(){
    	common.cleanPageTip();
    });

    // $.ajax({
    // 	type:common.getRootPath()+'/p/test',
    // 	url:'test',
    // 	dataType:'jsonp',
    // 	data : '',
    // 	jsonp:'callback',
    // 	jsonpCallback : 'jsonpFunction',
    // 	success:function(result){
    // 		console.log(result);
    // 	}
    // });
	

	ko.applyBindings(viewModel);

	//数据初始化
	validate.validate($('#modi_pwd_form'), {
	    elements: [{
	        name: 'passwd',
	        rules: [{
	            name: 'required',
	            message:'请填写原密码!'
	        }],
	        events: ['blur']
	    }, {
	        name: 'newPasswd',
	        rules: [{
	            name: 'required',
	            message:'请填写新密码!'
	        }],
	        events: ['blur']
	    },{
	        name: 'okPasswd',
	        rules: [{
	            name: 'required',
	            message:'请填写确认密码!'
	        },{
	        	name:'repwd',
	        	params:{
	        		target:$('#modi_pwd_form [name="newPasswd"]')
	        	},
	        	message:'您输入的确认密码与新密码不一致，请检查！'
	        }],
	        events: ['blur']
	    }],
	    errorPlacement: function(error, element) {
	        tipbar.errorTipbar(element,error,0,9999);
	    }
	});

	// 退出登录
	window.dialogWarning = function(msg){
		var dialogStr = '<div class="bt-dialog"><div class="bt-dialog-background"></div><div class="bt-pop bt-pop-warning"><span class="bt-pop-close"></span><div class="bt-pop-title">'+
			'<span class="bt-pop-icon icon"></span>提示信息'+
			'</div><div class="bt-pop-content"><span>'+ (msg|| '') +'</span></div>'+
			'<div class="bt-dialog-button"><button autofocus="autofocus" class="dialog-confirm">重新登录</button></div></div></div>';
		var dialogEle = $(dialogStr);

		$(document.body).append(dialogEle);
		$(dialogEle.find('span')[0])
		.on('click',function(event){
			// 点击按钮移除消息提示
			dialogEle.remove();
		});
		$(dialogEle.find('button')[0])
		.on('click',function(event){
			// 点击按钮移除消息提示
			location.href = 'login.html';
		});
	}

	// 平台消息提示
	window.pop = function (type, title, body, timeout) {
		var popStr = '<div class="bt-pop bt-pop-' + (type || 'info') + '"><span class="bt-pop-close"></span><div class="bt-pop-title">' +
			'<span class="bt-pop-icon icon"></span>' + (title || '') +
			'</div><div class="bt-pop-content"><span>' + (body || '') + '</span></div></div>';
		var popEle = $(popStr);

		$(document.body).append(popEle);
		var timeRemove = setTimeout(function () {
			popEle.remove();
		}, timeout || 3000);
		popEle
			.on('click', function (event) {
				if ($(event.target).hasClass('bt-pop-close')) {
					clearTimeout(timeRemove);
					// 点击按钮移除消息提示
					popEle.remove();
				}

			});
		popEle
			.on('mouseout', function (event) {
				timeRemove = setTimeout(function () {
					popEle.remove();
				}, timeout || 3000);
			});
		popEle
			.on('mouseover', function (event) {
				clearTimeout(timeRemove);
			});
	};

});