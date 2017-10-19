/*
个人资产模块
作者:bhg
*/
define(function(require,exports,module){
	require.async(['p/js/common/dicTool','l/bootstrap/js/bootstrap.min',"l/My97DatePicker/4.8/WdatePicker"],function(){
		require.async(['BTDictData'],function(){
	var validate = require("m/sea_modules/validate");
    var tipbar = require("m/sea_modules/tooltip");
    var common = require("p/js/common/common");
    var loading = require("m/sea_modules/loading");
    var placeholder = require("m/sea_modules/placeholder");

	//模块数据声明和初始化(Model)
	window.currentData = {
		// tradeListPage : {
		// 	pageNum: 1,
		// 	pageSize: 10,
		// 	pages: 1,
		// 	total: 1
		// },
		searchData:{

		},
		tradList:[],
		compInfo : {},
		fundCompInfoList :[],
		fundCompProList : []
	};

	//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
	window.viewModel = {
		//属性绑定监控
		// tradeListPageBind : ko.observable(currentData.tradeListPage),
		searchDataBind : ko.observable(currentData.searchData),
		tradListBind : ko.observableArray(currentData.tradList),
		compInfoBind : ko.observable(currentData.compInfo),
		fundCompInfoListBind : ko.observableArray(currentData.fundCompInfoList),
		fundCompProListBind : ko.observableArray(currentData.fundCompProList),
		//事件绑定
		// setDateInfo : function(data,event){
		// 	WdatePicker({startDate:'%y-%M-%d',maxDate:'#F{$dp.$D(\'end_date\')}',dateFmt:'yyyy-MM-dd',readOnly:true});
		// },
		// setEndDate : function(){
		// 	WdatePicker({startDate:'%y-%M-%d',minDate:'#F{$dp.$D(\'begin_date\')}',dateFmt:'yyyy-MM-dd',readOnly:true});
		// },
		// changeDateInfo : function(data,event){
		// 	var dateName = $(event.target).attr('dateName'),
		// 	dateData = $(event.target).attr('dateData');
		// 	currentData[dateData][dateName] = event.target.value;
		// },
		searchComp : function(){
			_personModule.reFreshComp();
			_personModule.reFreshFundCompany();
		},
		/*格式化区域*/
		parseEmpty : function(data){
			if(data===true){
				return '是';
			}else if(data===false){
				return '否';
			}
			if(!data||data==='') return '----';
			return data;
		}
		// showTradeDetail : function(data,event){
		// 	currentData.tradeInfo = data;
		// 	viewModel.tardeInfoBind(currentData.tradeInfo);
		// 	// $('#tradeDetail').modal('show');
		// 	tipbar.boxTopTipbar($('#tradeDetailBox'),$(document.body),null,{});
		// },

		//分页事件
		// firstPage : function(){
		// 	currentData.tradeListPage.pageNum=1;
		// 	_personModule.reFreshTradList(false);
		// },
		// endPage : function(){
		// 	currentData.tradeListPage.pageNum=currentData.tradeListPage.pages;
		// 	_personModule.reFreshTradList(false);
		// },
		// prevPage : function(){
		// 	currentData.tradeListPage.pageNum--;
		// 	_personModule.reFreshTradList(false);
		// },
		// nextPage : function(){
		// 	currentData.tradeListPage.pageNum++;
		// 	_personModule.reFreshTradList(false);
		// },
		// skipPage : function(data,event){
		// 	var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
		// 	if(isNaN(pageNum)||pageNum.split('.').length>1||Number(pageNum)<1||Number(pageNum)>currentData.tradeListPage.pages){
		// 		$('#fund_list_page [name="skipToPageNum"]').val('');
		// 		tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000);
		// 		return;
		// 	}
		// 	currentData.tradeListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
		// 	$('#fund_list_page [name="skipToPageNum"]').val('');
		// 	_personModule.reFreshTradList(false);
		// }
	};

	//定义私有属性以及方法
	var _personModule = {
		//各步骤前置处理方法
		
		//刷新基金数据
		reFreshComp : function(callback){
			//弹出弹幕加载状态
			loading.addLoading($('#search_info table'),common.getRootPath());
			$.post(common.getRootPath()+'/SaleQuery/querySaleAgencyInfo',
				{agencyNo:$('#search_comp_list').val()},function(data){
					//关闭加载状态弹幕
					loading.removeLoading($('#search_info table'));
					if(data.code ===200){
						viewModel.compInfoBind(data.data[0]);
						if(callback) callback();
					}
			},'json');
		},
		//初始化地址、银行、证件类型等信息
		initInfo : function(targetElement,dicData,defaultElement,textName,valueName){
			var text = textName || 'text',
			value =  valueName || 'value',
			dicArray = dicData.toArray(value,text),
			defaultHtml = defaultElement||''; 
			targetElement.html('').append(defaultHtml);
			for (var i = 0; i < dicArray.length; i++) {
				var tempDic = dicArray[i];
				targetElement.append('<option value="'+tempDic[value]+'">'+tempDic[text]+'</option>');
			}
		},
		//刷新基金机构资料列表
		reFreshFundCompany : function(){
			loading.addLoading($('#comp_info_box'),common.getRootPath());
			$.post(common.getRootPath()+'/SaleQuery/querySaleAgencyInfoWithFile',{agencyNo:$('#search_comp_list').val()},function(data){
				if(data.code === 200){
					loading.removeLoading($('#comp_info_box'));
					var compInfoList = data.data.files;
					if(compInfoList){
						currentData.fundCompInfoList = ArrayPlus(compInfoList).objectChildFilter('paperType','0');
						currentData.fundCompProList = ArrayPlus(compInfoList).objectChildFilter('paperType','1');
					}else{
						currentData.fundCompInfoList = [];
						currentData.fundCompProList = [];
					}
					viewModel.fundCompInfoListBind(common.cloneArrayDeep(currentData.fundCompInfoList));
					viewModel.fundCompProListBind(common.cloneArrayDeep(currentData.fundCompProList));
					common.resizeIframe();
				}
			},'json');

		}
		

	};

	


	ko.applyBindings(viewModel);

	//数据初始化
	_personModule.initInfo($('#search_comp_list'),BTDict.SaleAgency);
	_personModule.reFreshComp(function(){
		_personModule.reFreshFundCompany($('#search_comp_list').val());
	});
	//公共事件绑定
	// $('#fund_search_way .double-check-sp').click(function(){
	// 	$(this).toggleClass('active');
	// 	if($(this).is('.active')){
	// 		currentData.searchData[$(this).attr('objValue')] = true;
	// 	}else{
	// 		currentData.searchData[$(this).attr('objValue')] = false;
	// 	}
	// });

	//绑定placeholder
	// placeholder.placeholder($('#search_params'));
});
});
});