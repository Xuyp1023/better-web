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
		userInfo : {userName:$.cookie('user_name')}
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
			var height = $(iframe).find('body').outerHeight()+20;
			if(height<content_iframe.height()) return;
			toHeight = height-content_iframe.height()>0?'+='+(height-content_iframe.height()):'-='+(content_iframe.height()-height);
			content_iframe.animate({
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
				$.post(common.getRootPath()+'/updatePassword',currentData.pwdInfo,function(data){
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
    		$('#content_navbar,#content_area')
    		.css('min-height',($(window).height()+1)+'px')
    		.find('#content_iframe')
    		.attr('src','factoring/recieveFac.html?rn='+Math.random());
    		$('#nav_iframe').attr('src','sidebar/sidebar.html?rn='+Math.random());
    		if(location.href.indexOf('qiejf')!==-1){
    			$.post(common.getRootPath()+'/tokenLogin?ticket='+location.href.split('#')[1],{},function(){});
    		}
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

});