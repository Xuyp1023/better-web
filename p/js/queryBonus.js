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
		tradeListPage : {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		},
		searchData:{
			GTEtradeDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEtradeDate :new Date().format('YYYY-MM-DD'),
			fundCode:'',
			// agencyNo:'',
			custNo:'',
			flag:'1'

		},
		tradList:[],
		tradeInfo : {}
	};

	//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
	window.viewModel = {
		//属性绑定监控
		tradeListPageBind : ko.observable(currentData.tradeListPage),
		searchDataBind : ko.observable(currentData.searchData),
		tradListBind : ko.observableArray(currentData.tradList),
		tardeInfoBind : ko.observable(currentData.tradeInfo),
		//事件绑定
		setDateInfo : function(data,event){
			WdatePicker({startDate:'%y-%M-%d',maxDate:'#F{$dp.$D(\'end_date\')}',dateFmt:'yyyy-MM-dd',readOnly:true});
		},
		setEndDate : function(){
			WdatePicker({startDate:'%y-%M-%d',minDate:'#F{$dp.$D(\'begin_date\')}',dateFmt:'yyyy-MM-dd',readOnly:true});
		},
		changeDateInfo : function(data,event){
			var dateName = $(event.target).attr('dateName'),
			dateData = $(event.target).attr('dateData');
			currentData[dateData][dateName] = event.target.value;
		},
		searchTrade : function(){
			_personModule.reFreshTradList(true);
		},
		showTradeDetail : function(data,event){
			currentData.tradeInfo = data;
			viewModel.tardeInfoBind(currentData.tradeInfo);
			// $('#tradeDetail').modal('show');
			tipbar.boxTopTipbar($('#tradeDetailBox'),$(document.body),null,{});
		},
		//下载并且打印回执
		printTradeBack :function($data){
			return common.getRootPath()+'/SaleQuery/exportTradeBackReport?requestNo='+$data;
		},
		/*格式化*/
		//净值格式化
		parseNetValue : function(data){
			if(data.netValue){
				return common.formaterPoint4(data.netValue);
			}else{
				return '----';
			}
		},
		//申请状态格式化
		parseStaus : function(data){
			if(data.tradeStatus){
				return BTDict.SaleBusinFlag.get(data.tradeStatus);
			}else{
				return '----';
			}
		},
		//申购金额份额显示
		parseBalanceAndShares : function(data){
			if(data===undefined) return '----';
			if(data.balance !== 0){
				return common.formaterThounthand(common.formaterPoint2(data.balance));
			}
			if(data.shares !== 0){
				return common.formaterThounthand(common.formaterPoint2(data.shares));
			}
			return '----';
		},
		//确认份额
		parseConShares : function(data){
			if((data === undefined)||data === 0) return '----';
			return common.formaterThounthand(common.formaterPoint2(data));
		},
		//格式化total信息
		parseTotal : function(data){
			if(!data) return '0.00';
			return common.formaterThounthand(common.formaterPoint2(data));
		},
		//业务类型
		parseBusiFlag : function(data){
			if(!data) return '----';
			return BTDict.SaleBonusType.get(data);
		},
		//交易账户格式化
		parseCustNo : function(data){
			if(!data) return;
			return BTDict.CustInfo.get(data);
		},
		//基金详情查询地址格式化
		formaterFundDetail : function(data){
			return common.getRootPath()+'/p/pages/queryInfo/queryFund.html#'+data.fundCode;
		},
		//日期格式化
		formaterDate : function(data){
			if(!data) return;
			data+='';
			var newDate = '';
			newDate+=(data.substr(0,4)+'-'+data.substr(4,2)+'-'+data.substr(6));
			return newDate;
		},

		//分页事件
		firstPage : function(){
			currentData.tradeListPage.pageNum=1;
			_personModule.reFreshTradList(false);
		},
		endPage : function(){
			currentData.tradeListPage.pageNum=currentData.tradeListPage.pages;
			_personModule.reFreshTradList(false);
		},
		prevPage : function(){
			currentData.tradeListPage.pageNum--;
			_personModule.reFreshTradList(false);
		},
		nextPage : function(){
			currentData.tradeListPage.pageNum++;
			_personModule.reFreshTradList(false);
		},
		skipPage : function(data,event){
			var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
			if(isNaN(pageNum)||pageNum.split('.').length>1||Number(pageNum)<1||Number(pageNum)>currentData.tradeListPage.pages){
				$('#fund_list_page [name="skipToPageNum"]').val('');
				tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000);
				return;
			}
			currentData.tradeListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
			$('#fund_list_page [name="skipToPageNum"]').val('');
			_personModule.reFreshTradList(false);
		}
	};

	//定义私有属性以及方法
	var _personModule = {
		//各步骤前置处理方法
		
		//刷新基金数据
		reFreshTradList : function(flag){
			//弹出弹幕加载状态
			loading.addLoading($('#search_info table'),common.getRootPath());
			$.post(common.getRootPath()+'/SaleQuery/queryDividendInfo',
				$.extend(currentData.tradeListPage,currentData.searchData),function(data){
					//关闭加载状态弹幕
					loading.removeLoading($('#search_info table'));
					if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
						viewModel.tradListBind(common.cloneArrayDeep(data.data));
						if(flag){
							currentData.tradeListPage = data.page;
							viewModel.tradeListPageBind(data.page);
						}else{
							viewModel.tradeListPageBind(currentData.tradeListPage);
						}
					}
					common.resizeIframe();
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
		reFreshTradeAcoount : function(){
			$.post(common.getRootPath()+'/SaleQuery/queryCustInfo',{},function(data){
				var tempCustInfo = new ListMap();
				for(var index in data.data){
					var temp = data.data[index];
					tempCustInfo.set(temp.value,temp.name);
				}
				BTDict.CustInfo = tempCustInfo;
				_personModule.initInfo($('#search_cust_no'),data.data,'<option value="">----全部----</option>');
				currentData.searchData.custNo = $('#search_cust_no').val();
			},'json');
		},
		//刷新基金行情列表
		reFreshFundList : function(agencyNo){
			$.post(common.getRootPath()+'/SaleQuery/queryAgencyFundName',{agencyNo:agencyNo},function(data){
				_personModule.initInfo($('#search_fund_code'),data.data,'<option value="">----全部----</option>','name','value');
				currentData.searchData.fundCode = $('#search_fund_code').val();
			},'json');
		}

		

	};

	


	ko.applyBindings(viewModel);

	//数据初始化
	_personModule.reFreshTradList(true);
	_personModule.reFreshTradeAcoount();
	//刷新基金列表
	// _personModule.initInfo($('#search_select_comp'),BTDict.SaleAgency.toArray('value','text'),'<option value="">----全部----</option>','text','value');
	_personModule.reFreshFundList('');
	/*公共事件绑定*/
	//绑定基金公司与基金联调选择
	$('#search_select_comp').change(function(){
		_personModule.reFreshFundList($(this).val());
	});

	// $('#fund_search_way .double-check-sp').click(function(){
	// 	$(this).toggleClass('active');
	// 	if($(this).is('.active')){
	// 		currentData.searchData[$(this).attr('objValue')] = true;
	// 	}else{
	// 		currentData.searchData[$(this).attr('objValue')] = false;
	// 	}
	// });

});
});
});