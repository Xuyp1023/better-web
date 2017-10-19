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

	//模块数据声明和初始化(Model)
	window.currentData = {
		fundAllInfo : {}
	};

	//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
	window.viewModel = {
		//属性绑定监控
		fundAllInfoBind : ko.observable(currentData.fundAllInfo),
		//事件绑定

		/*数据格式化*/
		//格式化total信息
		parseTotal : function(data){
			if(!data) return '0.00';
			return common.formaterThounthand(common.formaterPoint2(data));
		}
	};

	//定义私有属性以及方法
	var _personModule = {
		//刷新基金数据
		reFreshFundAllInfoList : function(partmentId){
			$.post(common.getRootPath()+'/SaleQuery/queryCustBalance',
				{
					custNo:partmentId
				},function(data){
					if(data&&data.code === 200){
						currentData.fundAllInfo = data.data;
						viewModel.fundAllInfoBind(currentData.fundAllInfo);
						common.resizeIframe();
					}
			},'json');
		}


	};

	


	ko.applyBindings(viewModel);

	/*JQ事件绑定区域*/
	$('#fund_link dl').click(function(){
		location.href = common.getRootPath()+'/p/pages/'+$(this).attr('url');
	});
	/*初始化数据*/
	_personModule.reFreshFundAllInfoList('');
});
});
});