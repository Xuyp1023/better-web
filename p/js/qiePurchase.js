/*
申购模块
作者:bhg
*/
define(function(require,exports,module){
	require.async(['p/js/common/dicTool','l/bootstrap/js/bootstrap.min',"l/My97DatePicker/4.8/WdatePicker"],function(){
		require.async(['BTDictData'],function(){

		var validate = require("m/sea_modules/validate");
	    var tipbar = require("m/sea_modules/tooltip");
	    var common = require("p/js/common/common");
	    var placeholder = require("m/sea_modules/placeholder");
	    var loading = require("m/sea_modules/loading");

		//模块数据声明和初始化(Model)
		window.currentData = {
			fundList : [],
			fundDetailList : [],
			fundListPage : {
				pageNum: 1,
				pageSize: 10,
				pages: 1, 
				total: 1
			},
			purchaseFund:{
			},
			purchaseLimit:{
				"perMin": 100,
				"perMax": 10000
			},
			purchaseResult:{},
			purchaseValidFlag : true
		};

		//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
		window.viewModel = {
			//属性绑定监控
			fundListBind : ko.observableArray(currentData.fundList),
			fundListPageBind : ko.observable(currentData.fundListPage),
			purchaseFundBind : ko.observable(currentData.purchaseFund),
			purchaseResultBind : ko.observable(currentData.purchaseResult),
			fundDetailListBind : ko.observableArray(currentData.fundDetailList),
			totalBalanceBind : ko.observable(null),
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
				_personModule.reFreshFundList($('#search_fund_company').val(),$('#fund_kind .active').attr('objValue'),$('#fast_search_keyword').val(),true);
			},
			purchaseFund:function(data,event){
				var _data = data;
				currentData.purchaseFund = $.extend(true,currentData.purchaseFund,data);
				viewModel.purchaseFundBind(currentData.purchaseFund);
				$.post(common.getRootPath()+'/SaleQuery/queryFundCombinVestDays',{
					fundCombCode:data.fundCode,
					businFlag:'22',
					custType:'0'
				},function(resultData){
					currentData.fundDetailList = resultData.data;
					currentData.fundDetailList = common.addKey4ArrayObj(currentData.fundDetailList,'balance',0);
					currentData.fundDetailList = common.cloneArrayDeep(currentData.fundDetailList);
					viewModel.fundDetailListBind(currentData.fundDetailList);
					viewModel.totalBalanceBind(null);
					$('#confirm_amount_link').tab('show');
				},'json');
			},
			toPreeSee : function(data,event){
				if(_personModule.calculateTotalMoney()<=0){
					tipbar.errorTipbar($(event.target),'您的申购总金额为0,请重新填写申购金额!');
					return;
				}
				currentData.purchaseValidFlag = true;
				$('#fund_detail_table [name="balance"]').each(function(index){
					viewModel.validBalance(currentData.fundDetailList[index],{target:this});
				});
				if(currentData.purchaseValidFlag===false){
					tipbar.errorTipbar($(event.target),'有选项没有正确填写，请仔细检查!');
					return;
				}
				currentData.purchaseFund.moneyAccount = $('#select_cust_list').val();
				currentData.purchaseFund.fund_partment_name = $('#select_cust_list option:checked').text();
				currentData.purchaseFund.balance = $('#input_amount').val();
				viewModel.purchaseFundBind(currentData.purchaseFund);
				$('#pree_see_link').tab('show');
			},
			confirmPurchase : function(data,event){
				var target = $(event.target||event.srcElement);
				delete currentData.purchaseFund.balance;
				var paramStr = common.serializeSingleObject(currentData.purchaseFund);
				var paramBalance = '';
				for(var index in currentData.fundDetailList){
					var tempDetail = currentData.fundDetailList[index];
					paramBalance+='&balance='+tempDetail.fundCode+','+$('#fund_detail_table [name="balance"]').eq(index).val();
				}
				paramStr+=paramBalance;
				$.post(common.getRootPath()+'/SaleTrade/batchPurchaseFund',paramStr,function(data){
					if(data.code===200){
						viewModel.purchaseFundBind(currentData.purchaseFund);
						currentData.purchaseResult = data;
						viewModel.purchaseResultBind(currentData.purchaseResult);
						//向拜特审批流发送信息
						if(common.isBFS()){
							$.post(common.getBFSRootPath()+'/fund/fundApp.do?method=batchPurchFund',{data:JSON.stringify(data.data)},function(data){
								if(console) console.log(data);
							});
						}
						$('#finish_select_link').tab('show');
					}else{
						tipbar.errorTopTipbar(target,data.message);
					}
				},'json');
			},
			//定义输入金额框失去焦点验证
			validBalance : function(data,event){
				var target = event.srcElement||event.target,
				balance = $.trim($(target).val()),
				perMax = data.combPriceMax,
				perMin = data.combPriceMin===''?0:data.combPriceMin;
				//数据格式验证
				if(!balance||balance===''){
					// $(target).val('0');
					tipbar.errorLeftTipbar($(target),'此项输入不能为空，请重新输入!');
					currentData.purchaseValidFlag = false;
					return;
				}
				if(!/^([1-9]\d+\.?(\d{1,2})?)$|^([0-9]\.?(\d{1,2})?)$/.test(balance)){
					tipbar.errorLeftTipbar($(target),'您输入的数字格式有误，请重新输入!');
					$(target).val('');
					viewModel.totalBalanceBind(_personModule.calculateTotalMoney());
					currentData.purchaseValidFlag = false;
					return;
				}
				//通过验证后进行限额校验
				if(balance!=='0'){
					if(Number(balance)>perMax){
						tipbar.errorLeftTipbar($(target),'您输入的资金大于本支基金最高申购限额!');
						currentData.purchaseValidFlag = false;
						return;
					}else if(Number(balance)<perMin){
						tipbar.errorLeftTipbar($(target),'您输入的资金低于本支基金最低申购限额!');
						currentData.purchaseValidFlag = false;
						return;
					}
				}
				
			},
			//每次改变单项金额计算总金额
			calculateTotalMoney : function(data,event){
				var target = event.srcElement||event.target,
				balance = $.trim($(target).val());
				//进行动态计算
				var result = balance.match(/([1-9]\d+\.?(\d{1,2})?)|[0-9]\.?(\d{1,2})?/);
				$(target).val(result===null?'':result[0]);
				viewModel.totalBalanceBind(_personModule.calculateTotalMoney());
			},
			//计算每一项基金金额
			calculateEachBalance : function(data,event){
				var target = event.srcElement||event.target,
				totalBalance = $.trim($('#fast_purchase_money').val()),
				$totalInput = $('#fast_purchase_money');
				if(!totalBalance||totalBalance===''){
					tipbar.errorTopTipbar($('#fast_purchase_money'),'此项输入不能为空，请重新输入!',1500);
					return;
				}
				if(totalBalance==='0'){
					tipbar.errorTopTipbar($('#fast_purchase_money'),'您输入的金额为0，无法计算!',1500);
					return;
				}
				if(!/^([1-9]\d+\.?(\d{1,2})?)$|^([0-9]\.?(\d{1,2})?)$/.test(totalBalance)){
					tipbar.errorTopTipbar($('#fast_purchase_money'),'您输入的数字格式有误，请重新输入(例:88888888.88)!',1500);
					$('#fast_purchase_money').val('');
					return;
				}
				_personModule.calculateEachBalance(totalBalance,function(){
					tipbar.cleanPageTip();
					viewModel.totalBalanceBind(_personModule.calculateTotalMoney());
				});
			},

			/*数据格式化*/
			//百分号格式化
			formaterPercent :function(data){
				if(data+''==='0'||data==='') return '----';
				return data+'%';
			},
			//四位符格式化
			formaterPoint4 : function(data){
				return Number(data).toFixed(4);
			},
			//日期格式化
			formaterDate : function(data){
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
				if(!data) return;
				return common.formaterThounthand(common.formaterPoint2(data));
			},
			//组合价位格式化
			formaterComPrice : function(data){
				return common.formaterThounthand(common.formaterPoint2(data.combPriceMin))+' - '+common.formaterThounthand(common.formaterPoint2(data.combPriceMax));
			},
			//全部金额格式化
			formaterTotalBalance : function(data){
				if(!data||data==='') return '----';
				return common.formaterThounthand(common.formaterPoint2(data));
			},
			//单只基金限额格式化
			formaterFundLimite : function(data){
				if((data===undefined)||(data===null)) return '----';
				if(data>=999999999) return '无限制';
				return common.formaterThounthand(common.formaterPoint2(data));
			},
			//基金详情查询地址格式化
			formaterFundDetail : function(data){
				return common.getRootPath()+'/p/pages/queryInfo/queryFund.html#'+data.fundCode;
			},

			//分页事件
			firstPage : function(){
				currentData.fundListPage.pageNum=1;
				_personModule.reFreshFundList($('#search_fund_company').val(),$('#fund_kind .active').attr('objValue'),$('#fast_search_keyword').val(),false);
			},
			endPage : function(){
				currentData.fundListPage.pageNum=currentData.fundListPage.pages;
				_personModule.reFreshFundList($('#search_fund_company').val(),$('#fund_kind .active').attr('objValue'),$('#fast_search_keyword').val(),false);
			},
			prevPage : function(){
				currentData.fundListPage.pageNum--;
				_personModule.reFreshFundList($('#search_fund_company').val(),$('#fund_kind .active').attr('objValue'),$('#fast_search_keyword').val(),false);
			},
			nextPage : function(){
				currentData.fundListPage.pageNum++;
				_personModule.reFreshFundList($('#search_fund_company').val(),$('#fund_kind .active').attr('objValue'),$('#fast_search_keyword').val(),false);
			},
			skipPage : function(data,event){
				var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
				if(isNaN(pageNum)||pageNum.split('.').length>1||Number(pageNum)<1||Number(pageNum)>currentData.fundListPage.pages){
					$('#fund_list_page [name="skipToPageNum"]').val('');
					tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000);
					return;
				}
				currentData.fundListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
				$('#fund_list_page [name="skipToPageNum"]').val('');
				_personModule.reFreshFundList($('#search_fund_company').val(),$('#fund_kind .active').attr('objValue'),$('#fast_search_keyword').val(),false);
			}
		};

		//定义私有属性以及方法
		var _personModule = {
			//各步骤前置处理方法
			
			//刷新基金数据
			reFreshFundList : function(fundCompany,brand,fundCode,flag){
				//弹出弹幕加载状态
				loading.addLoading($('#select_fund table'),common.getRootPath());
				$.post(common.getRootPath()+'/SaleQuery/queryFundCombinDays',
					$.extend(true,currentData.fundListPage,{
						businFlag:'22'
					}),function(data){
						//关闭加载状态弹幕
						loading.removeLoading($('#select_fund table'));
						viewModel.fundListBind(common.cloneArrayDeep(data.data));
						if(flag){
							currentData.fundListPage = data.page;
							viewModel.fundListPageBind(data.page);
						}else{
							viewModel.fundListPageBind(currentData.fundListPage);
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
				$.post(common.getRootPath()+'/SaleQuery/queryAccountBank',{},function(data){
					_personModule.initInfo($('#select_cust_list'),data.data);
					if(callback) callback();
				},'json');
			},
			//查询对应基金公司是否已经开户
			// checkCompIsOrg : function(agencyNo,moneyAccount){
			// 	$.post(common.getRootPath()+'/SaleQuery/checkMoneyAccountAndAgency',{agencyNo:agencyNo,moneyAccount:moneyAccount},function(data){
			// 		if(data.code !== 200){
			// 			tipbar.errorTipbar($('#select_cust_list'),'该账户还未在该基金所属基金公司开户，请更换或进行增开!');
			// 			$('#pree_see_btn').hide();
			// 		}else{
			// 			$('#pree_see_btn').show();
			// 		}
			// 	},'json');
			// },
			//计算申购总金额
			calculateTotalMoney : function(){
				var totalBalance = 0;
				$('#fund_detail_table [name="balance"]').each(function(){
					var temp = $(this).val();
					totalBalance+=Number(temp===''?0:temp);
				});
				return totalBalance;
			},
			//计算每一项基金金额并分配
			calculateEachBalance : function(totalBalance,callback){
				$.post(common.getRootPath()+'/SaleTrade/balancesDistribution',{
					combFundCode : currentData.purchaseFund.fundCode,
					totalBalance : totalBalance,
					moneyAccount : $('#select_cust_list').val()
				},function(data){
					if(data.code === 200){
						for(var index in data.data){
							var tempData = data.data[index];
							for(var indexR in currentData.fundDetailList){
								var tempRedem = currentData.fundDetailList[indexR];
								if(tempRedem.fundCode === tempData.fundCode){
									currentData.fundDetailList[indexR].balance = tempData.balance;
								}
							}
						}
						viewModel.fundDetailListBind(common.cloneArrayDeep(currentData.fundDetailList));
						callback();
					}
				},'json');
			}
		};

		//绑定VM
		ko.applyBindings(viewModel);
		//数据初始化
		//初始化基金公司
		_personModule.initInfo($('#search_fund_company'),BTDict.SaleAgency.toArray('value','name'),'<option value="">----全部----</option>');
		_personModule.reFreshFundList('','','',true);
		_personModule.reFreshTradeAcoount(function(){
			//进行开户对应校验
			// $('.nav-tabs').on('shown',function(){
			// 	_personModule.checkCompIsOrg(currentData.purchaseFund.agencyNo,$('#select_cust_list').val());
			// });
		});
		//公用事件绑定
		// $('#fund_kind li').click(function(){
		// 	$(this).siblings().removeClass('active')
		// 	.end()
		// 	.addClass('active');
		// 	// currentData.fundListPage.pageNum = 1;
		// 	_personModule.reFreshFundList($('#search_fund_company').val(),$('#fund_kind .active').attr('objValue'),$('#fast_search_keyword').val(),false);
		// });
		//进行是否对应开户检测
		// $('#select_cust_list').change(function(){
		// 	//进行开户对应校验
		// 	_personModule.checkCompIsOrg(currentData.purchaseFund.agencyNo,$(this).val());
		// });
		//placeholder绑定
		placeholder.placeholder('#fast_search_keyword');

		//test
		// $('#confirm_amount_link').tab('show');

		});

		
	});
});