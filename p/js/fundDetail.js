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
		fundDetailListPage : {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		},
		searchData:{
			startDate:common.getToday().getFullYear()+'-'+(common.getToday().getMonth()+1)+'-'+1,
			endDate :common.getToday().getFullYear()+'-'+(common.getToday().getMonth()+1)+'-'+common.getToday().getDate(),
			allDate:false,
			allFundName:false,
			allFundCompany:false,
			allDepartment:false,
			allfundDetailFlag:false,
			fundName:''

		},
		fundDetailList:[],
		fundDetailInfo : {},
		totalFundInfo : {}
	};

	//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
	window.viewModel = {
		//属性绑定监控
		fundDetailListPageBind : ko.observable(currentData.fundDetailListPage),
		searchDataBind : ko.observable(currentData.searchData),
		fundDetailListBind : ko.observableArray(currentData.fundDetailList),
		fundDetailInfoBind : ko.observable(currentData.fundDetailInfo),
		totalFundInfoBind : ko.observable(currentData.totalFundInfo),
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
		searchfundDetail : function(){
			_personModule.reFreshfundDetailList(true);
		},
		showfundDetail : function(data,event){
			currentData.fundDetailInfo = data;
			viewModel.fundDetailInfoBind(currentData.fundDetailInfo);
			tipbar.boxTopTipbar($('#fund_detail_box'),$(document.body),null,{});
		},
		/*数据格式化*/
		//百分号格式化
		formaterPercent :function(data){
			if(data+''==='0') return '----';
			return data+'%';
		},
		//四位符格式化
		formaterPoint4 : function(data){
			return Number(data).toFixed(4);
		},
		//日期格式化
		formaterDate : function(data){
			if(!data) return;
			data+='';
			var newDate = '';
			newDate+=(data.substr(0,4)+'-'+data.substr(4,2)+'-'+data.substr(6));
			return newDate;
		},
		//风险等级格式化
		formaterRiskLvel : function(data){
			return BTDict.SaleRiskLevel.get(data+'');
		},
		//申购金额格式化
		formaterMoney : function(data){
			if(!data) return '0.00';
			return common.formaterThounthand(common.formaterPoint2(data))+'';
		},
		//是否为空处理
		prepareEmpty : function(data){
			if(!data||data==='') return '---';
		},
		//业务类型
		parseBusiFlag : function(data){
			if(!data) return;
			return BTDict.SaleBusinCode.get(data);
		},
		//交易账户格式化
		parseCustNo : function(data){
			if(!data) return;
			return BTDict.CustInfo.get(data);
		},
		//格式化预估市值
		parseTotalValue : function(data){
			return common.formaterThounthand((Number(data.validShares)*Number(data.netValue)+Number(data.income)).toFixed(1));
		},
		//格式化分红方式
		parseBousType : function(data){
			if(!data) return;
			return BTDict.SaleBonusType.get(data);
		},
		//基金详情查询地址格式化
		formaterFundDetail : function(data){
			return common.getRootPath()+'/p/pages/queryInfo/queryFund.html#'+data.fundCode;
		},

		//分页事件
		firstPage : function(){
			currentData.fundDetailListPage.pageNum=1;
			_personModule.reFreshfundDetailList(false);
		},
		endPage : function(){
			currentData.fundDetailListPage.pageNum=currentData.fundDetailListPage.pages;
			_personModule.reFreshfundDetailList(false);
		},
		prevPage : function(){
			currentData.fundDetailListPage.pageNum--;
			_personModule.reFreshfundDetailList(false);
		},
		nextPage : function(){
			currentData.fundDetailListPage.pageNum++;
			_personModule.reFreshfundDetailList(false);
		},
		skipPage : function(data,event){
			var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
			if(isNaN(pageNum)||pageNum.split('.').length>1||Number(pageNum)<1||Number(pageNum)>currentData.fundDetailListPage.pages){
				$('#fund_list_page [name="skipToPageNum"]').val('');
				tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000);
				return;
			}
			currentData.fundDetailListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
			$('#fund_list_page [name="skipToPageNum"]').val('');
			_personModule.reFreshfundDetailList(false);
		}
	};

	//定义私有属性以及方法
	var _personModule = {
		//各步骤前置处理方法
		
		//刷新基金数据
		reFreshfundDetailList : function(custNo,flag){
			$.post(common.getRootPath()+'/SaleQuery/querySaleShares',
				{
					custNo:custNo,
					businFlag : '24'
				},function(data){
					if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
						currentData.fundDetailList = data.data;
						viewModel.fundDetailListBind(common.cloneArrayDeep(data.data));
						if(flag){
							currentData.fundDetailListPage = data.page;
							viewModel.fundDetailListPageBind(data.page);
						}else{
							viewModel.fundDetailListPageBind(currentData.fundDetailListPage);
						}
						common.resizeIframe();
					}
					
			},'json');
			$.post(common.getRootPath()+'/SaleQuery/queryCustBalance',
				{
					custNo:custNo
				},function(data){
					currentData.totalFundInfo = data.data;
					viewModel.totalFundInfoBind(currentData.totalFundInfo);
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
		reFreshTradeAcoount : function(callback){
			$.post(common.getRootPath()+'/SaleQuery/queryCustInfo',{},function(data){
				var tempCustInfo = new ListMap();
				for(var index in data.data){
					var temp = data.data[index];
					tempCustInfo.set(temp.value,temp.name);
				}
				BTDict.CustInfo = tempCustInfo;
				_personModule.initInfo($('#search_cust_list'),data.data,'<option value="">----全部----</option>');
				if(callback) callback();
			},'json');
		}

		

	};

	


	ko.applyBindings(viewModel);

	//数据初始化
	_personModule.reFreshTradeAcoount(function(){
		_personModule.reFreshfundDetailList('',true);
	});
	/*公共事件绑定*/
	//交易账户选择
	$('#search_cust_list').change(function(){
		_personModule.reFreshfundDetailList($(this).val(),true);
	});
	/*$('#fund_search_way .double-check-sp').click(function(){
		$(this).toggleClass('active');
		if($(this).is('.active')){
			currentData.searchData[$(this).attr('objValue')] = true;
		}else{
			currentData.searchData[$(this).attr('objValue')] = false;
		}
	});*/
});
});
});