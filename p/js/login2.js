/*
登录模块
作者:bhg
*/
define(function(require,exports,module){
	require.async(['p/js/common/dicTool','l/bootstrap/js/bootstrap.min',"l/My97DatePicker/4.8/WdatePicker"],function(){
		require.async(['BTDictData'],function(){
		var validate = require("m/sea_modules/validate");
	    var tipbar = require("m/sea_modules/tooltip");
	    var common = require("p/js/common/common");
	    var placeholder = require("m/sea_modules/placeholder2");
	    var loading = require("m/sea_modules/loading");
	    require('l/jquery-plugins/jquery.cookie');

		//模块数据声明和初始化(Model)
		window.currentData = {
			loginInfo :{}
		};

		//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
		window.viewModel = {
			//属性绑定监控
			loginInfoBind : ko.observable(currentData.loginInfo),
			//事件绑定
			//登录操作
			login:function(data,event){

				var target = $(event.target||event.srcElement);

				var username = $($("#loginForm input[name='username']")[0]).val();
				var password = $($("#loginForm input[name='password']")[0]).val();
				currentData.loginInfo.username = currentData.loginInfo.username || username;
				currentData.loginInfo.password = currentData.loginInfo.password || password;

				//验证表单
				var result = validate.validate($('#loginForm'));
				if(result){
					$.post(common.getRootPath()+'/login',currentData.loginInfo,function(data){
						if(data.code === 200){
							$.cookie('user_name',$('[name="username"]').val(),{expires:7});
							location.href = 'frame.html';
						}else{
							tipbar.errorTopTipbar(target,'登录失败,原因:'+data.message);
						}
					},'json');
				}
			}
		};

		//定义私有属性以及方法
		var _personModule = {

		};

		//绑定VM
		ko.applyBindings(viewModel);
		//数据初始化
		validate.validate($('#loginForm'), {
		    elements: [{
		        name: 'username',
		        rules: [{
		            name: 'required',
		            message:'请填写操作员用户名!'
		        }],
		        events: ['blur']
		    }, {
		        name: 'password',
		        rules: [{
		            name: 'required',
		            message:'请填写操作员密码!'
		        },{
		            name: 'strmin',
		            params:{strmin:6},
		            message:'密码的长度应为6-16!'
		        },{
		            name: 'strmax',
		            params:{strmax:16},
		            message:'密码的长度应为6-16!'
		        }],
		        events: ['blur']
		    }],
		    errorPlacement: function(error, element) {
		    	if(element.is(':hidden')) {
		    		var target = element.next("input")[0];
		    		tipbar.errorTipbar($(target),error);	
					return;		    		
		    	}
		        tipbar.errorTipbar(element,error);
		    }
		});
		//初始化基金公司

		//处理账号placeholder不出现的问题 /暂时处理方案
		$("input[name='username']").blur();
		common.cleanPageTip();

	});
});
});
