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
		searchData : {
			GTEtradeDate:new Date().getSubDate('MM',1).format('YYYY-MM-DD'),
			LTEtradeDate :new Date().format('YYYY-MM-DD'),
			fundCode:'',
			agencyNo:'',
			custNo:'',
			flag:'1'
		},
		custInfo : {},
		fundAllInfo:{},
		//用户资金信息区域
		fundDetailListPage : {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		},
		fundDetailList:[],
		fundDetailInfo : {},
		//用户交易信息
		tradeListPage : {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		},
		tradList:[],
		tradeInfo : {}
	};

	//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
	window.viewModel = {
		//属性绑定监控
		searchDataBind : ko.observable(currentData.searchData),
		custInfoBind : ko.observable(currentData.custInfo),
		fundAllInfoBind:ko.observable(currentData.fundAllInfo),
		//用户资金信息绑定区域
		fundDetailListPageBind : ko.observable(currentData.fundDetailListPage),
		fundDetailListBind : ko.observableArray(currentData.fundDetailList),
		fundDetailInfoBind : ko.observable(currentData.fundDetailInfo),
		//用户交易信息绑定区域
		tradeListPageBind : ko.observable(currentData.tradeListPage),
		tradListBind : ko.observableArray(currentData.tradList),
		tardeInfoBind : ko.observable(currentData.tradeInfo),
		//事件绑定
		setDateInfo : function(data,event){
			WdatePicker({startDate:'%y-%M-%d',maxDate:'#F{$dp.$D(\'end_date\')}',dateFmt:'yyyy-MM-dd',readOnly:true});
		},
		setEndDate : function(){
			WdatePicker({startDate:'%y-%M-%d',minDate:'#F{$dp.$D(\'begin_date\')}',dateFmt:'yyyy-MM-dd',readOnly:true});
		},
		setMonth : function(){
			WdatePicker({startDate:'%y-%M',dateFmt:'yyyy-MM',readOnly:true});
		},
		changeDateInfo : function(data,event){
			var dateName = $(event.target||event.srcElement).attr('dateName'),
			dateData = $(event.target||event.srcElement).attr('dateData');
			currentData[dateData][dateName] = (event.target||event.srcElement).value;
		},
		
		/*事件绑定区域*/
		//获取资金详情
		showfundDetail : function(data,event){
			currentData.fundDetailInfo = data;
			viewModel.fundDetailInfoBind(currentData.fundDetailInfo);
			tipbar.boxTopTipbar($('#fund_detail_box'),$(document.body),null,{});
		},
		//获取交易详情
		showTradeDetail : function(data,event){
			currentData.tradeInfo = data;
			viewModel.tardeInfoBind(currentData.tradeInfo);
			// $('#tradeDetail').modal('show');
			tipbar.boxTopTipbar($('#tradeDetailBox'),$(document.body),null,{});
		},
		//查询账单信息
		searchInfo : function(data,event){
			_personModule.reFreshAllInfo();
		},
		//更换客户custNo
		changeCust : function(){
			_personModule.reFreshAllInfo();
		},
		/*数据格式化*/
		//格式化total信息
		parseTotal : function(data){
			if(!data) return '0.00';
			return common.formaterThounthand(common.formaterPoint2(data));
		},
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

		/*分页操作区域*/
		//分页事件
		firstPage : function(){
			currentData.tradeListPage.pageNum=1;
			_personModule.reFreshTradList($('#fund_partment').val(),false);
		},
		endPage : function(){
			currentData.tradeListPage.pageNum=currentData.tradeListPage.pages;
			_personModule.reFreshTradList($('#fund_partment').val(),false);
		},
		prevPage : function(){
			currentData.tradeListPage.pageNum--;
			_personModule.reFreshTradList($('#fund_partment').val(),false);
		},
		nextPage : function(){
			currentData.tradeListPage.pageNum++;
			_personModule.reFreshTradList($('#fund_partment').val(),false);
		},
		skipPage : function(data,event){
			var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
			if(isNaN(pageNum)||pageNum.split('.').length>1||Number(pageNum)<1||Number(pageNum)>currentData.tradeListPage.pages){
				$('#fund_list_page [name="skipToPageNum"]').val('');
				tipbar.errorTipbar($(event.target||event.srcElement),'请填写正确的页数!',1000);
				return;
			}
			currentData.tradeListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
			$('#fund_list_page [name="skipToPageNum"]').val('');
			_personModule.reFreshTradList($('#fund_partment').val(),false);
		}
	};

	//定义私有属性以及方法
	var _personModule = {
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
				if(data.code === 200){
				var tempCustInfo = new ListMap();
				for(var index in data.data){
					var temp = data.data[index];
					tempCustInfo.set(temp.value,temp.name);
				}
				BTDict.CustInfo = tempCustInfo;
				_personModule.initInfo($('#fund_partment'),data.data);
				if(callback) callback();
				}/*else{
					$('#error_info_box').css('height',$('body').parent().height()-5).slideDown('fast');
				}*/
			},'json');
		},
		//获取账户信息
		reFreshCustInfo : function(custNo){
			$.post(common.getRootPath()+'/SaleQuery/queryContacInfo',
				{
					custNo:custNo
				},function(data){
					currentData.custInfo = data.data;
					viewModel.custInfoBind(currentData.custInfo);
			},'json');
		},
		//获取总资产信息
		reFreshFundAllInfoList : function(custNo){
			$.post(common.getRootPath()+'/SaleQuery/queryCustBalance',
				{
					custNo:custNo
				},function(data){
					if(data&&data.code === 200){
						currentData.fundAllInfo = data.data;
						viewModel.fundAllInfoBind(currentData.fundAllInfo);
					}
			},'json');
		},
		//获取用户资产信息
		reFreshfundDetailList : function(custNo,flag,callback){
			loading.addLoading($('#fund_info_table'),common.getRootPath());
			$.post(common.getRootPath()+'/SaleQuery/querySaleShares',
				{
					custNo:custNo,
					businFlag : '24'
				},function(data){
					loading.removeLoading($('#fund_info_table'));
					if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
						currentData.fundDetailList = data.data;
						viewModel.fundDetailListBind(common.cloneArrayDeep(data.data));
						if(flag){
							currentData.fundDetailListPage = data.page;
							viewModel.fundDetailListPageBind(data.page);
						}else{
							viewModel.fundDetailListPageBind(currentData.fundDetailListPage);
						}
					}
					if(callback) callback();
					
			},'json');
		},
		//获取用户交易信息
		reFreshTradList : function(custNo,flag){
			//弹出弹幕加载状态
			loading.addLoading($('#trade_list_table'),common.getRootPath());
			currentData.searchData.custNo = custNo;
			$.post(common.getRootPath()+'/SaleQuery/queryTradeRequest',
				$.extend(currentData.tradeListPage,currentData.searchData),function(data){
					//关闭加载状态弹幕
					loading.removeLoading($('#trade_list_table'));
					if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
						viewModel.tradListBind(common.cloneArrayDeep(data.data));
						if(flag){
							currentData.tradeListPage = data.page;
							viewModel.tradeListPageBind(data.page);
						}else{
							viewModel.tradeListPageBind(currentData.tradeListPage);
						}
						common.resizeIframe();
					}
			},'json');
		},
		//获取相应信息
		reFreshAllInfo : function(){
			var custNo = $('#fund_partment').val();
			currentData.tradeListPage.pageNum = 1;
			_personModule.reFreshCustInfo(custNo);
			_personModule.reFreshFundAllInfoList(custNo);
			_personModule.reFreshfundDetailList(custNo,false,function(){
				_personModule.reFreshTradList(custNo,true);
			});
		}


	};

	
	//绑定VM
	ko.applyBindings(viewModel);
	//数据初始化
	$('#fund_partment').change(function(){
		_personModule.reFreshAllInfo();
	});
	_personModule.reFreshTradeAcoount(function(){
		_personModule.reFreshAllInfo();
	});
	
});
});
});