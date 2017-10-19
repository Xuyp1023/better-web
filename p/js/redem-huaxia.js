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
					redemList : [],
					redemListPage : {
						pageNum: 1,
						pageSize: 10,
						pages: 1,
						total: 1
					},
					redemFund:{},
					redemResult:{}
				};

				//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
				window.viewModel = {
					//属性绑定监控
					redemListBind : ko.observableArray(currentData.redemList),
					redemListPageBind : ko.observable(currentData.redemListPage),
					redemFundBind : ko.observable(currentData.redemFund),
					redemResultBind : ko.observable(currentData.redemResult),

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
						_personModule.reFreshRedemList($('#fund_partment').val(),true);
					},
					redemFund:function(data,event){
						currentData.redemFund = $.extend(true,currentData.redemFund,data);
						$.post(common.getRootPath()+'/SaleQuery/queryFundLimit',{
								fundCode:data.fundCode,
								businFlag:'24',
								custType:'0',
								custNo:data.custNo
						},function(resultData){
							validate.cleanValidate($('#confirm_amount_form'),null,['blur'],true);
							//计算应该用的限额值
							var maxShare,message;
							if(resultData.data.perMax>data.validShares){
								maxShare = data.validShares;
								message = '本产品可用份额份额为'+data.validShares+'份';
							}else{
								maxShare = resultData.data.perMax;
								message = '本产品最大可赎回份额为'+resultData.data.perMax+'份';
							}
							validate.validate($('#confirm_amount_form'),{
								elements:[
								{
									name:'redemShares',
									rules:[
										{
											name:'required',
											message:''
										},{
											name:'min',
											params:{
												min:resultData.data.perMin
											},
											message:'本产品起始赎回份额为'+resultData.data.perMin+'份'
										},{
											name:'max',
											params:{
												max:maxShare
											},
											message:message
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
							$('#input_amount').attr('placeholder','最低赎回份额为'+resultData.data.perMin+'份');
							placeholder.placeholder('#input_amount');
							currentData.redemFund.fund_partment = $('#fund_partment').val();
							currentData.redemFund.fund_partment_name = $('#fund_partment option:selected').text();
							viewModel.redemFundBind(currentData.redemFund);
							$('#confirm_amount_link').tab('show');
						},'json');
					},
					toPreeSee : function(data,event){
						var validResult = validate.validate($('#confirm_amount_form'));
						if(validResult===false){
							tipbar.errorTipbar($(event.target),'有选项没有正确填写，请仔细检查!');
							return;
						}
						currentData.redemFund.redemShares = $('#input_amount').val();
						viewModel.redemFundBind(currentData.redemFund);
						$('#pree_see_link').tab('show');
					},
					confirmRedem : function(data,event){
						var target = $(event.target||event.srcElement);
						currentData.redemFund.shareType="fast"; // 快赎标识
						var redemFund = $.extend(true,currentData.redemFund,{shares:$('#input_amount').val()});
						var paramStr = common.serializeSingleObject(redemFund);
						$.post(common.getRootPath()+'/SaleTrade/redeemFund',paramStr,function(data){
							if(data.code===200){
								viewModel.redemFundBind(currentData.redemFund);
								currentData.redemResult = data;
								viewModel.redemResultBind(currentData.redemResult);
								//向拜特审批流发送赎回的信息
								if(common.isBFS()){
									$.post(common.getBFSRootPath()+'/fund/fundApp.do?method=purchaseFund',data.data,function(data){
										if(console) console.log(data);
									});	
								}
								$('#finish_select_link').tab('show');
							}else{
								tipbar.errorTopTipbar(target,data.message);
							}
						},'json');
					},
					/*数据格式化*/
					//状态格式化
					parseStaus : function(data){
						return BTDict.fundStatus.get(data.status);
					},
					//小数点格式化4位
					parsePoint4 : function(data){
						return common.formaterPoint4(data);
					},
					parsePoint2 : function(data){
						return common.formaterPoint2(data);
					},
					//日期格式化
					parseDate : function(data){
						return common.formaterDate(data);
					},
					//格式化预估市值
					parseTotalValue : function(data){
						return common.formaterThounthand((Number(data.shares)*Number(data.netValue)).toFixed(2));
					},
					//格式化份额
					parseShares : function(data){
						if(data.validShares===undefined)return;
						return common.formaterThounthand(Number(data.validShares).toFixed(2))+'';
					},
					//格式化赎回份额
					parseRedemShares : function(data){
						if(!data.redemShares)return;
						return common.formaterThounthand(Number(data.redemShares).toFixed(2));
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
						currentData.redemListPage.pageNum=1;
						_personModule.reFreshRedemList($('#fund_partment').val(),false);
					},
					endPage : function(){
						currentData.redemListPage.pageNum=currentData.redemListPage.pages;
						_personModule.reFreshRedemList($('#fund_partment').val(),false);
					},
					prevPage : function(){
						currentData.redemListPage.pageNum--;
						_personModule.reFreshRedemList($('#fund_partment').val(),false);
					},
					nextPage : function(){
						currentData.redemListPage.pageNum++;
						_personModule.reFreshRedemList($('#fund_partment').val(),false);
					},
					skipPage : function(data,event){
						var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
						if(isNaN(pageNum)||pageNum.split('.').length>1||Number(pageNum)<1||Number(pageNum)>currentData.redemListPage.pages){
							$('#fund_list_page [name="skipToPageNum"]').val('');
							tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000);
							return;
						}
						currentData.redemListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
						$('#fund_list_page [name="skipToPageNum"]').val('');
						_personModule.reFreshRedemList($('#fund_partment').val(),false);
					}
				};

				//定义私有属性以及方法
				var _personModule = {
					//各步骤前置处理方法
					
					//刷新基金数据
					reFreshRedemList : function(partmentId,flag){
						loading.addLoading($('#select_fund table'),common.getRootPath());
						$.post(common.getRootPath()+'/SaleQuery/queryBalance',
							$.extend(true,currentData.redemListPage,{
								custNo:partmentId,
								businFlag : '24',
								agencyNo:$('#fund_company').val(),
								fundCode:$('#fund_product').val()
								/* $('#fund_product').val(),$('#fund_company').val() */
							}),function(data){
								//关闭加载状态弹幕
								loading.removeLoading($('#select_fund table'),function(){
									viewModel.redemListBind(common.cloneArrayDeep(data.data));
									if(flag){
										currentData.redemListPage = data.page;
										viewModel.redemListPageBind(data.page);
									}else{
										viewModel.redemListPageBind(currentData.redemListPage);
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
					//销售机构变化，产品类型也需要变化
					initFundCompany : function(){
						$('#fund_company').change(function(){
							var value = $('#fund_company').val();
							$.post(common.getRootPath()+'/SaleQuery/queryFundDays',
								{
									agencyNo:value,
									brand:'货币基金',
									fundCode:'',
									businFlag:24
								},function(data){
								if(data.code === 200){
								var tempArray = [];
								for(var index in data.data){
									var temp = data.data[index];
									tempArray.push({value:temp.fundCode,name:temp.fundName});
								}
								_personModule.initInfo($('#fund_product'),tempArray);
								}/*else{
									$('#error_info_box').css('height',$('body').parent().height()-5).slideDown('fast');
								}*/
							},'json');
						});
					   $("#fund_company").trigger("change");
					},
					//刷新交易账户列表
					reFreshTradeAcoount : function(){
						$.post(common.getRootPath()+'/SaleQuery/queryCustInfo',{},function(data){
							if(data.code === 200){
							var tempCustInfo = new ListMap();
							for(var index in data.data){
								var temp = data.data[index];
								tempCustInfo.set(temp.value,temp.name);
							}
							BTDict.CustInfo = tempCustInfo;
							_personModule.initInfo($('#fund_partment'),data.data,'<option value="">----全部----</option>');
							}/*else{
								$('#error_info_box').css('height',$('body').parent().height()-5).slideDown('fast');
							}*/
						},'json');
					}

				};

				//绑定VM
				ko.applyBindings(viewModel);
				//数据初始化
				_personModule.reFreshRedemList('',true);
				_personModule.reFreshTradeAcoount();
				_personModule.initFundCompany();
				//公用事件绑定
				//placeholder绑定
				placeholder.placeholder('#input_amount');
		});
	});

});