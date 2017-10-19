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
			currentPage : {
				pageNum: 1,
				pageSize: 10,
				pages: 1,
				total: 1
			},
			searchData:{
				// startDate:common.getToday().getFullYear()+'-'+(common.getToday().getMonth()+1)+'-'+1,
				// endDate :common.getToday().getFullYear()+'-'+(common.getToday().getMonth()+1)+'-'+common.getToday().getDate(),
				businClass : '01',
				orderStatus :'0,1'
			},
			crtCountList:[],
			tradePurchaseList:[],
			crtCountCancelList:[],
			tradeCancelList:[],
			crtCountInfo : {},
			tradePurchaseInfo : {},
			tradeCancelInfo : {},
			//单据字典文件
			ticketParams:{
				crt_count:{
					// url:'/p/testdata/testCheck.json',
					wrapId:'crt_count',
					listName: 'crtCountList',
					bindName:'crtCountListBind',
					businClass :'01'
				},
				trade_purchase:{
					// url:'/p/testdata/testCheck.json',
					wrapId:'trade_purchase',
					listName:'tradePurchaseList',
					bindName:'tradePurchaseListBind',
					businClass :'02'
				},
				crt_count_cancel:{
					// url:'/p/testdata/testCheck.json',
					wrapId:'crt_count_cancel',
					listName:'crtCountCancelList',
					bindName:'crtCountCancelListBind',
					businClass :'03'
				},
				trade_cancel:{
					// url:'/p/testdata/testCheck.json',
					wrapId:'trade_cancel',
					listName:'tradeCancelList',
					bindName:'tradeCancelListBind',
					businClass :'04'
				}
			}
		};


		//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
		window.viewModel = {
			//属性绑定监控
			currentPageBind : ko.observable(currentData.currentPage),
			searchDataBind : ko.observable(currentData.searchData),
			crtCountListBind : ko.observableArray(currentData.crtCountList),
			tradePurchaseListBind : ko.observableArray(currentData.crtCountCancelList),
			crtCountCancelListBind : ko.observableArray(currentData.crtCancelList),
			tradeCancelListBind : ko.observableArray(currentData.tradeCancelList),
			crtCountInfoBind : ko.observable(currentData.crtCountInfo),
			tradePurchaseInfoBind : ko.observable(currentData.tradePurchaseInfo),
			tradeCancelInfoBind : ko.observable(currentData.tradeCancelInfo),
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
			searchTicket : function(event){
				var id = $(event).attr('target');
				currentData.currentPage.pageNum=1;
				_personModule.reFreshTicketList(currentData.ticketParams[id],true);
				$(event).children('a').tab('show');
			},
			showCrtCountDetail : function(data,event){
				location.href = 'recheckInfo.html?param='+data.requestNo+',08,unrecheck,'+data.id;
			},
			showTradePurchaseDetail : function(data,event){
				location.href = 'recheckInfo.html?param='+data.requestNo+',22,unrecheck,'+data.id;
			},
			showCrtCountCancelDetail : function(data,event){
				location.href = 'recheckInfo.html?param='+data.requestNo+',08,unrecheck,'+data.id;
			},
			showTradeCancelDetail : function(data,event){
				location.href = 'recheckInfo.html?param='+data.requestNo+',22,unrecheck,'+data.id;
			},
			/*数据格式化*/
			//交易账户格式化
			parseCustNo : function(data){
				if(!data) return;
				return BTDict.CustInfo.get(data);
			},
			//格式化基金公司
			formaterComp : function(data){
			    return BTDict.SaleAgency.get(data);
			},
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
			//业务类型
			parseBusiFlag : function(data){
			    if(!data) return '----';
			    return BTDict.SaleBusinCode.get(data);
			},
			//基金详情查询地址格式化
			formaterFundDetail : function(data){
			    return common.getRootPath()+'/p/pages/queryInfo/queryFund.html#'+data.fundCode;
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
			    if(!data||data === '') return '----';
			    data+='';
			    var newDate = '';
			    newDate+=(data.substr(0,4)+'-'+data.substr(4,2)+'-'+data.substr(6));
			    return newDate;
			},
			//日期加时间格式件
			formaterDateTime : function(data){
			    if(!data||data === '') return '----';
			    data+='';
			    var newDate = '',
			    newTime = data.split(' ')[1];
			    newDate=(data.substr(0,4)+'-'+data.substr(4,2)+'-'+data.substr(6,2));
			    newTime=(newTime.substr(0,2)+':'+newTime.substr(2,2)+':'+newTime.substr(4));
			    return newDate+' '+newTime;
			},
			//风险等级格式化
			formaterRiskLvel : function(data){
			    return BTDict.SaleRiskLevel.get(data+'');
			},
			//申购金额格式化
			formaterMoney : function(data){
			    if(!data) return;
			    return common.formaterThounthand(common.formaterPoint2(data));
			},

			//分页事件
			firstPage : function(data,event){
				currentData.currentPage.pageNum=1;
				var params = _personModule.getTicketParam(event.target?event.target:event.srcElement);
				_personModule.reFreshTicketList(params,false);
			},
			endPage : function(data,event){
				currentData.currentPage.pageNum=currentData.currentPage.pages;
				var params = _personModule.getTicketParam(event.target?event.target:event.srcElement);
				_personModule.reFreshTicketList(params,false);
			},
			prevPage : function(data,event){
				currentData.currentPage.pageNum--;
				var params = _personModule.getTicketParam(event.target?event.target:event.srcElement);
				_personModule.reFreshTicketList(params,false);
			},
			nextPage : function(data,event){
				currentData.currentPage.pageNum++;
				var params = _personModule.getTicketParam(event.target?event.target:event.srcElement);
				_personModule.reFreshTicketList(params,false);
			},
			skipPage : function(data,event){
				var params = _personModule.getTicketParam(event.target?event.target:event.srcElement);
				var pageNum = $('#'+params.wrapId+' .Spage [name="skipToPageNum"]').val();
				if(isNaN(pageNum)||pageNum.split('.').length>1||Number(pageNum)<1||Number(pageNum)>currentData.currentPage.pages){
					$('#'+params.wrapId+' .Spage [name="skipToPageNum"]').val('');
					tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000);
					return;
				}
				currentData.currentPage.pageNum = Number($('#'+params.wrapId+' .Spage [name="skipToPageNum"]').val()).toFixed(0);
				$('#'+params.wrapId+' .Spage [name="skipToPageNum"]').val('');
				_personModule.reFreshTicketList(params,false);
			}
		};

		//定义私有属性以及方法
		var _personModule = {

			//获取对应票据参数
			getTicketParam : function(element){
				var key = $(element).parents('.tab-pane').attr('id');
				return currentData.ticketParams[key];
			},
			
			//刷新基金数据
			reFreshTicketList : function(params,flag){
				//弹出弹幕加载状态
				loading.addLoading($('#'+params.wrapId+' table'),common.getRootPath());
				currentData.searchData.businClass = params.businClass;
				$.post(common.getRootPath()+'/flow/queryFlowOrderByPage',
					$.extend(currentData.currentPage,currentData.searchData),function(data){
						//关闭加载状态弹幕
						loading.removeLoading($('#'+params.wrapId+' table'));
						viewModel[params.bindName](common.cloneArrayDeep(data.data));
						if(flag){
							currentData.currentPage = data.page;
							viewModel.currentPageBind(data.page);
						}else{
							viewModel.currentPageBind(currentData.currentPage);
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
			reFreshTradeAcoount : function(callback){
				$.post(common.getRootPath()+'/SaleQuery/queryCustInfo',{},function(data){
					if(data.code === 200){
					var tempCustInfo = new ListMap();
					for(var index in data.data){
						var temp = data.data[index];
						tempCustInfo.set(temp.value,temp.name);
					}
					BTDict.CustInfo = tempCustInfo;
					}
					if(callback) callback();
					/*else{
						$('#error_info_box').css('height',$('body').parent().height()-5).slideDown('fast');
					}*/
				},'json');
			}

			

		};

		


		ko.applyBindings(viewModel);

		//数据初始化
		_personModule.reFreshTradeAcoount(function(){
			_personModule.reFreshTicketList(currentData.ticketParams.crt_count,true);
		});
		//公共事件绑定
		$('#fund_search_way .double-check-sp').click(function(){
			$(this).toggleClass('active');
			if($(this).is('.active')){
				currentData.searchData[$(this).attr('objValue')] = true;
			}else{
				currentData.searchData[$(this).attr('objValue')] = false;
			}
		});


	});
 });
});