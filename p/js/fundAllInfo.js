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
		fundAllInfo : {},
		total : {},
		fundHead : {},
		fundData : [],
		penguinHead :{},
		penguinData :[]
	};

	//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
	window.viewModel = {
		//属性绑定监控
		totalBind : ko.observable(currentData.total),
		fundHeadBind : ko.observable(currentData.fundHead),
		fundDataBind : ko.observableArray(currentData.fundData),
		penguinHeadBind : ko.observable(currentData.penguinHead),
		penguinDataBind : ko.observableArray(currentData.penguinData),
		//事件绑定

		/*数据格式化*/
		//格式化total信息
		parseTotal : function(data){
			if(!data||data==='') return '0.00';
			return common.formaterThounthand(common.formaterPoint2(data));
		},
		//格式化head
		parseHead : function(){

		},
		//格式化预估市值
		parseTotalValue : function(data){
			return common.formaterThounthand((Number(data.shares)*Number(data.netValue)).toFixed(1));
		},
		//交易账户格式化
		parseCustNo : function(data){
			if(!data) return '----';
			return BTDict.CustInfo.get(data);
		},
		//基金详情查询地址格式化
		formaterFundDetail : function(data){
			return common.getRootPath()+'/p/pages/queryInfo/queryFund.html#'+data.fundCode;
		}
	};

	//定义私有属性以及方法
	var _personModule = {
		//刷新基金数据
		reFreshFundAllInfoList : function(partmentId){
			$.post(common.getRootPath()+'/SaleQuery/queryCustClassBalance',
				{
					custNo:partmentId
				},function(data){
					if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
						viewModel.totalBind(data.data.total);
						viewModel.fundHeadBind(data.data.fund.head);
						viewModel.fundDataBind(data.data.fund.data);
						viewModel.penguinHeadBind(data.data.penguin.head);
						viewModel.penguinDataBind(data.data.penguin.data);
						common.resizeIframe();
					}
			},'json');
		},
		//信息初始化
		initInfo : function(targetElement,dicData,defaultElement,textName,valueName){
			var text = textName || 'name',
			value =  valueName || 'value',
			dicArray = dicData,
			defaultHtml = defaultElement||''; 
			targetElement.html('').append(defaultHtml);
			for (var i = 0; i < dicArray.length; i++) {
				var tempDic = dicArray[i];
				targetElement.append('<option value="'+tempDic[value]+'">'+tempDic[text]+'</option>');
			}
		},
		//刷新交易账户列表
		reFreshTradeAccount : function(callback){
			$.post(common.getRootPath()+'/SaleQuery/queryCustInfo',{},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					var tempCustInfo = new ListMap();
					for(var index in data.data){
						var temp = data.data[index];
						tempCustInfo.set(temp.value,temp.name);
					}
					BTDict.CustInfo = tempCustInfo;
					_personModule.initInfo($('#cust_select_list'),data.data,'<option value="">----全部----</option>');
					callback();
				}
			},'json');
		}


	};

	

	ko.applyBindings(viewModel);

	/*JQ事件绑定区域*/
	$('#route_operate_menu li').click(function(){
		location.href = common.getRootPath()+'/p/pages/'+$(this).attr('url');
	});
	//更换账号
	$('#cust_select_list').change(function(){
		_personModule.reFreshFundAllInfoList($(this).val());
	});

	/*数据初始化*/
	//初始化用户交易信息
	_personModule.reFreshTradeAccount(function(){
		_personModule.reFreshFundAllInfoList($('#cust_select_list').val());
	});
});
});
});