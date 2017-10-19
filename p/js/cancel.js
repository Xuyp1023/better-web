/*
申购模块
作者:bhg
*/
define(function(require,exports,module){
	require.async(['p/js/common/dicTool','l/bootstrap/js/bootstrap.min',"l/My97DatePicker/4.8/WdatePicker.js"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("m/sea_modules/validate");
    var tipbar = require("m/sea_modules/tooltip");
    var common = require("p/js/common/common");
    var placeholder = require("m/sea_modules/placeholder");
    var loading = require("m/sea_modules/loading");

	//模块数据声明和初始化(Model)
	window.currentData = {
		cancelList : [],
		cancelListPage : {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		},
		cancelFund:{},
		cancelResult:{}
	};

	//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
	window.viewModel = {
		//属性绑定监控
		cancelListBind : ko.observableArray(currentData.cancelList),
		cancelListPageBind : ko.observable(currentData.cancelListPage),
		cancelFundBind : ko.observable(currentData.cancelFund),
		cancelResultBind : ko.observable(currentData.cancelResult),
		//事件绑定
		nextStep : function(data,event){
			var target = $(event.target),tabIndex,tabRoute = $('#content .nav-tabs a');
			tabIndex = Number(target.attr('target'));
			var targetLink = tabRoute.eq(tabIndex);
			var linkHref = targetLink.attr('href');
			/*var tabContentFunc = (linkHref==undefined||linkHref==null)?'reg_company_info':linkHref.split('#')[1];
			var tabFunc = _personModule[tabContentFunc+'_func'];
			tabFunc = (tabFunc==undefined ||tabFunc==null) ?_personModule.finish_company_info_func : tabFunc;
			var funcResult = tabFunc(target,targetLink);*/
			funcResult = true;
			if(funcResult) targetLink.tab('show');
		},
		searchFund : function(){
			_personModule.reFreshcancelList($('#fund_partment').val(),true);
		},
		cancelFund:function(data,event){
			currentData.cancelFund = $.extend(true,currentData.cancelFund,data);
			viewModel.cancelFundBind(currentData.cancelFund);
			$('#confirm_amount_link').tab('show');
		},
		confirmcancel : function(data,event){
			var target = $(event.target||event.srcElement);
			var paramStr = common.serializeSingleObject(currentData.cancelFund);
			$.post(common.getRootPath()+'/SaleTrade/revokeTrade',paramStr,function(data){
				if(data.code===200){
					viewModel.cancelFundBind(currentData.cancelFund);
					currentData.cancelResult = data;
					viewModel.cancelResultBind(currentData.cancelResult);
					//向拜特审批流发送信息
					if(common.isBFS()){
						$.post(common.getBFSRootPath()+'/fund/fundApp.do?method=revokeTrade',data.data,function(data){
							if(console) console.log(data);
						});
					}
					
					$('#finish_select_link').tab('show');
				}else{
					tipbar.errorTopTipbar(target,data.message);
				}
			},'json');
		},
		/*格式化操作*/
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
		//基金详情查询地址格式化
		formaterFundDetail : function(data){
			return common.getRootPath()+'/p/pages/queryInfo/queryFund.html#'+data.fundCode;
		},

		//分页事件
		firstPage : function(){
			currentData.cancelListPage.pageNum=1;
			_personModule.reFreshcancelList($('#fund_partment').val(),false);
		},
		endPage : function(){
			currentData.cancelListPage.pageNum=currentData.cancelListPage.pages;
			_personModule.reFreshcancelList($('#fund_partment').val(),false);
		},
		prevPage : function(){
			currentData.cancelListPage.pageNum--;
			_personModule.reFreshcancelList($('#fund_partment').val(),false);
		},
		nextPage : function(){
			currentData.cancelListPage.pageNum++;
			_personModule.reFreshcancelList($('#fund_partment').val(),false);
		},
		skipPage : function(data,event){
			var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
			if(isNaN(pageNum)||pageNum.split('.').length>1||Number(pageNum)<1||Number(pageNum)>currentData.cancelListPage.pages){
				$('#fund_list_page [name="skipToPageNum"]').val('');
				tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000);
				return;
			}
			currentData.cancelListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
			$('#fund_list_page [name="skipToPageNum"]').val('');
			_personModule.reFreshcancelList($('#fund_partment').val(),false);
		}
	};

	//定义私有属性以及方法
	var _personModule = {
		//各步骤前置处理方法

		//刷新基金数据
		reFreshcancelList : function(partmentId,flag){
			//弹出弹幕加载状态
			loading.addLoading($('#select_fund table'),common.getRootPath());
			$.post(common.getRootPath()+'/SaleQuery/queryRevokeTrade',
				$.extend(true,currentData.cancelListPage,{
					custNo:partmentId
				}),function(data){
					//关闭加载状态弹幕
					loading.removeLoading($('#select_fund table'),function(){
						viewModel.cancelListBind(common.cloneArrayDeep(data.data));
						if(flag){
							currentData.cancelListPage = data.page;
							viewModel.cancelListPageBind(data.page);
						}else{
							viewModel.cancelListPageBind(currentData.cancelListPage);
						}
						common.resizeIframe();
					});
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
				_personModule.initInfo($('#fund_partment'),data.data,'<option value="">----全部----</option>');
				//获取可撤单列表
				_personModule.reFreshcancelList('',true);
			},'json');
		}


	};

	
	//绑定VM
	ko.applyBindings(viewModel);
	//数据初始化
	_personModule.reFreshTradeAcoount();
	//绑定placeholder
	placeholder.placeholder('#input_amount');
});
});
});