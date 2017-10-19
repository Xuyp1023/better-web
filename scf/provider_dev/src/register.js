/*
注册
作者:bhg
*/
define(function(require,exports,module){
	require.async(['dicTool','bootstrap',"datePicker"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("./libs/validate");
    var tipbar = require("./libs/tooltip");
    var common = require("./libs/common");
    var loading = require("./libs/loading");
    var comdirect = require("./libs/commondirect");
	
	require('angular');

	//定义模块
	var mainApp = angular.module('mainApp',[]);

	//扩充公共指令库
	comdirect.direcPlus(mainApp);

	//兼容IE模式
	// .config(function($sceProvider){
	// 	$sceProvider.enabled(false);
	// })

	//控制器区域
	mainApp.controller('mainController',['$scope',function($scope){
		/*VM绑定区域*/


		/*事件处理区域*/
		//注册
		$scope.register = function(event){
			var result = validate.validate($('#register_form')),
			$target = $(event.target);
			if(!result){
				tipbar.errorTipbar($target,'您还有信息项没有正确填写!');
				return;
			}
			//重复性验证
			$.post(common.getRootPath()+'/CustTemp/enrollSupply',$('#register_form').serialize(),function(data){
				//处理注册返回结果
				if(data.code === 200){
					tipbar.errorTipbar($('#register_btn'), '注册成功！',3000,99999);
				}else{
					tipbar.errorTipbar($('#register_btn'), '注册失败,返回信息:'+data.message,3000,99999);
				}
			},'json');
		};
		
		
		/*表单验证*/
          validate.validate($('#register_form'), {
                elements: [{
                    name: 'contMobileNo',
                    rules: [{
                        name: 'phone'
                    }],
                    events: ['blur']
                },{
                    name: 'contEmail',
                    rules: [{
                        name: 'email'
                    }],
                    events: ['blur']
                }],
                errorPlacement: function(error, element) {
                    var label = element.parents('td').prev().text().substr(1);
                    tipbar.errorTipbar(element, label + error);
                }
            });

	}]);

	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

