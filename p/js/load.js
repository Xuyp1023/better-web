/*
个人资产模块
作者:bhg
*/
define(function(require,exports,module){
	require.async(['p/js/common/dicTool','l/bootstrap/js/bootstrap.min',"l/My97DatePicker/4.8/WdatePicker.js"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("m/sea_modules/validate");
    var tipbar = require("m/sea_modules/tooltip");
    var common = require("p/js/common/common");
    var loading = require("m/sea_modules/loading");

	//模块数据声明和初始化(Model)
	window.currentData = {
	};

	//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
	window.viewModel = {
		pullFundStateBind:ko.observable('未拉取'),

		pullFundInfo:function(){
			$.post(BTServerPath+'/load/fund',{},function(data){
				viewModel.pullFundStateBind(data.message);
			},'json');
		}
	};

	//定义私有属性以及方法
	var _personModule = {
	};

	


	ko.applyBindings(viewModel);


});
});
});