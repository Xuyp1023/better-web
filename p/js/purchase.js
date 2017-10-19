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
	    var dialog = require('m/sea_modules/dialog');

		//模块数据声明和初始化(Model)
		window.currentData = {
			fundList : [],
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
			purchaseResult:{}
		};

		//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
		window.viewModel = {
			//属性绑定监控
			fundListBind : ko.observableArray(currentData.fundList),
			fundListPageBind : ko.observable(currentData.fundListPage),
			purchaseFundBind : ko.observable(currentData.purchaseFund),
			purchaseResultBind : ko.observable(currentData.purchaseResult),
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
					_personModule.reFreshFundLimit(data,function(){
						$('#confirm_amount_link').tab('show');
					});
			},
			toPreeSee : function(data,event){
				var validResult = validate.validate($('#confirm_amount_form'));
				if(validResult===false){
					tipbar.errorTipbar($(event.target),'有选项没有正确填写，请仔细检查!');
					return;
				}
				currentData.purchaseFund.moneyAccount = $('#fund_partment').val();
				currentData.purchaseFund.fund_partment_name = $('#fund_partment option:checked').text();
				currentData.purchaseFund.balance = $('#input_amount').val();
				viewModel.purchaseFundBind(currentData.purchaseFund);
				$('#pree_see_link').tab('show');

				// 只有华夏才会出现这个我同意
				if(currentData.purchaseFund.agencyNo == '203'){
					$("#bt_risk_button").attr("disabled",true); 
				}
				
			},
			confirmPurchase : function(data,event){
				var target = $(event.target||event.srcElement);
				var paramStr = common.serializeSingleObject(currentData.purchaseFund);
				$.post(common.getRootPath()+'/SaleTrade/purchaseFund',paramStr,function(data){
					if(data.code===200){
						viewModel.purchaseFundBind(currentData.purchaseFund);
						currentData.purchaseResult = data;
						//向拜特端发送申购的信息
						if(common.isBFS()){
							$.post(common.getBFSRootPath()+'/fund/fundApp.do?method=purchaseFund',data.data,function(data){
								if(console) console.log(data);
							});
						}
						//获取申购基金机构的账户信息
						$.post(common.getRootPath()+'/SaleQuery/querySaleAgencyInfoWithFile',{agencyNo:currentData.purchaseFund.agencyNo},function(data){
							if(data.code === 200){
								currentData.purchaseResult.bankAccount = data.data.bankAccount;
								currentData.purchaseResult.bankAcountName = data.data.bankAcountName;
								currentData.purchaseResult.bankName = data.data.bankName;
								viewModel.purchaseResultBind(currentData.purchaseResult);
								$('#finish_select_link').tab('show');
							}
						},'json');
					}else{
						tipbar.errorTopTipbar(target,data.message);
					}
				},'json');
			},
			/*数据格式化*/
			//百分号格式化
			formaterPercent :function(data){
				if(data+''==='0'||data+''==='') return '----';
				return data+'%';
			},
			//四位符格式化
			formaterPoint4 : function(data){
				return Number(data).toFixed(4);
			},
			//日期格式化
			formaterDate : function(data){
				if(!data) return '----';
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
				if(!data) return '----';
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
				if(fundCode===$('#fast_search_keyword').attr('placeholder')) fundCode = '';
				//弹出弹幕加载状态
				loading.addLoading($('#select_fund table'),common.getRootPath());
				$.post(common.getRootPath()+'/SaleQuery/queryFundDays',
					$.extend(true,currentData.fundListPage,{
						agencyNo:fundCompany,
						brand:brand,
						fundCode:fundCode,
						businFlag:'22'
					}),function(data){
						//关闭加载状态弹幕
						loading.removeLoading($('#select_fund table'),function(){
							viewModel.fundListBind(common.cloneArrayDeep(data.data));
							if(flag){
								currentData.fundListPage = data.page;
								viewModel.fundListPageBind(data.page);
							}else{
								viewModel.fundListPageBind(currentData.fundListPage);
							}
							common.resizeIframe();
						});
				},'json');
			},
			//重置限额信息
			reFreshFundLimit : function(data,callback){
				$.post(common.getRootPath()+'/SaleQuery/queryFundLimit',{
					fundCode:data.fundCode,
					businFlag:'22',
					custType:'0',
					moneyAccount:$('#fund_partment').val()
				},function(resultData){
					validate.cleanValidate($('#confirm_amount_form'),null,['blur'],true);
					validate.validate($('#confirm_amount_form'),{
						elements:[
						{
							name:'balance',
							rules:[
								{
									name:'required',
									message:''
								},{
									name:'min',
									params:{
										min:resultData.data.perMin
									},
									message:'本产品起购金额为'+resultData.data.perMin+'元'
								},{
									name:'max',
									params:{
										max:resultData.data.perMax
									},
									message:'本产品限购金额为'+resultData.data.perMax+'元'
								},{
									name:'money',
									message:''
								}
							],
							events:['blur']
						}],
						errorPlacement:function(error,element){
							tipbar.errorTipbar(element,error);
						}
					});
					if(resultData.data.perMin){
						$('#input_amount').attr('placeholder','起购金额为'+resultData.data.perMin+'元');	
					}
					placeholder.placeholder('#input_amount');
					callback();
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
					_personModule.initInfo($('#fund_partment'),data.data);
					if(callback) callback();
				},'json');
			},
			//查询对应基金公司是否已经开户
			checkCompIsOrg : function(agencyNo,moneyAccount){
				$.post(common.getRootPath()+'/SaleQuery/checkMoneyAccountAndAgency',{agencyNo:agencyNo,moneyAccount:moneyAccount,fundCode:currentData.purchaseFund.fundCode},function(data){
					if(data.code !== 200){
						tipbar.errorTipbar($('#fund_partment'),'该账户还未在该基金所属基金公司开户，请更换或进行增开!');
						$('#pree_see_btn').hide();
					}else{
						if(agencyNo == '201'){
							//判断风险
							if(data.data.status&&(data.data.status === '2')){
								dialog.confirm(data.message/*'如果您选择认（申）购的基金风险类型高于您的风险测评等级，是否选择继续认（申）购？'*/,function(){},function(){
									$('#select_fund_link').tab('show');
								},150);
							}else if(data.data.status&&(data.data.status === '0')){
								dialog.confirm('您还没有该机构的风险测评等级，将跳转至风险评测界面!',function(){
									window.location.href = '../report/report.html?agencyNo ==201';
								},function(){
									window.location.href = '../report/report.html?agencyNo ==201';
								},150);
							}
						}else if(agencyNo == '203'){
							if(!data.data){
								dialog.confirm('您还没有该机构的问卷调查，将跳转至风险评测界面!',function(){
									window.location.href = '../report/report-huaxia.html?agencyNo ==203';
								},function(){
									window.location.href = '../report/report-huaxia.html?agencyNo ==203';
								},150);
							}
						}
						common.cleanPageTip();
						$('#pree_see_btn').show();
					}
				},'json');
			}
		};

		//绑定VM
		ko.applyBindings(viewModel);
		//数据初始化
		//初始化基金公司
		_personModule.initInfo($('#search_fund_company'),BTDict.SaleAgency.toArray('value','name'),'<option value="">----全部----</option>');
		_personModule.reFreshFundList($('#search_fund_company').val(),$('#fund_kind .active').attr('objValue'),$('#fast_search_keyword').val(),false);
		_personModule.reFreshTradeAcoount(function(){
			//进行开户对应校验
			$('#confirm_amount_link').on('shown',function(){
				if($('.tab-pane.active').is('#confirm_amount')){
					_personModule.checkCompIsOrg(currentData.purchaseFund.agencyNo,$('#fund_partment').val());
				}
			});
		});
		//公用事件绑定
		$('#fund_kind li').click(function(){
			if($(this).attr('objValue') === 'other') return;
			$(this).siblings().removeClass('active')
			.end()
			.addClass('active');
			// currentData.fundListPage.pageNum = 1;
			_personModule.reFreshFundList($('#search_fund_company').val(),$('#fund_kind .active').attr('objValue'),$('#fast_search_keyword').val(),false);
		});
		//进行是否对应开户检测
		$('#fund_partment').change(function(){
			//进行开户对应校验
			_personModule.checkCompIsOrg(currentData.purchaseFund.agencyNo,$(this).val());
			_personModule.reFreshFundLimit(currentData.purchaseFund,function(){});
		});
		//placeholder绑定
		placeholder.placeholder('#fast_search_keyword');

		// 绑定立即申购时我同意的事件
		$('#bt_risk_inform').change(function(){
			if($("#bt_risk_button").attr("disabled")){
				$("#bt_risk_button").attr("disabled",false); 
			}else{
				$("#bt_risk_button").attr("disabled",true); 
			}
				
			});
		});

		// $("#bt_risk_href").click(function(){
		// 	$("#bt_risk_iframe").toggle();
		// });

		
	});
});