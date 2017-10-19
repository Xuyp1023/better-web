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
					redemResult:{},
					qieInfo : {},
					validShareFlag:true
				};

				//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
				window.viewModel = {
					//属性绑定监控
					redemListBind : ko.observableArray(currentData.redemList),
					redemListPageBind : ko.observable(currentData.redemListPage),
					redemFundBind : ko.observable(currentData.redemFund),
					redemResultBind : ko.observable(currentData.redemResult),
					qieInfoBind : ko.observable(currentData.qieInfo),

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
						_personModule.reFreshRedemList($('#select_cust_list').val(),true);
						_personModule.reFreshQieInfo($('#select_cust_list').val());
					},
					redemFund:function(data,event){
							// if(_personModule.calculateTotalMoney()<=0){
							// 	tipbar.errorTipbar($(event.target),'您的申购总金额为0,请重新填写申购金额!');
							// 	return;
							// }
							
					},
					toPreeSee : function(data,event){
						currentData.validShareFlag = true;
						var isTrueShares = false;
						$('#fund_detail_table [name="share"]:enabled').each(function(index){
							viewModel.validShare(currentData.redemList[index],{target:this});
							if($.trim($(this).val())!=='0'&&$.trim($(this).val())!==''){
								isTrueShares = true;
							}
						});
						if(currentData.validShareFlag===false){
							tipbar.errorTipbar($(event.target),'有选项没有正确填写，请仔细检查!');
							return;
						}
						if(!isTrueShares){
							tipbar.errorTipbar($(event.target),'您还未填写有效的赎回金额，请检查!');
							return;
						}
						currentData.redemFund.moneyAccount = $('#select_cust_list').val();
						currentData.redemFund.fund_partment_name = $('#select_cust_list option:checked').text();
						currentData.redemFund.fast_purchase_money = $('#fast_purchase_money').val();
						viewModel.redemFundBind(currentData.redemFund);
						//添加赎回金额
						$('#fund_detail_table [name="share"]:enabled').each(function(index){
							$('#fund_pree_see_table [name="share"]').eq(index).text(viewModel.formaterMoney($(this).val()));
						});
						$('#pree_see_link').tab('show');
					},
					confirmRedem : function(data,event){
						var target = $(event.target||event.srcElement);
						delete currentData.redemFund.share;
						delete currentData.redemFund.moneyAccount;
						var paramStr = common.serializeSingleObject(currentData.redemFund);
						var paramBalance = '';
						for(var index in currentData.redemList){
							var tempDetail = currentData.redemList[index];
							paramBalance+='&shares='+tempDetail.moneyAccount+','+tempDetail.fundCode+','+$('#fund_detail_table [name="share"]:enabled').eq(index).val();
						}
						paramStr+=paramBalance;
						$.post(common.getRootPath()+'/SaleTrade/batchRedeemFund',paramStr,function(data){
							if(data.code===200){
								viewModel.redemFundBind(currentData.redemFund);
								currentData.purchaseResult = data;
								viewModel.redemResultBind(currentData.redemResult);
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
					validShare : function(data,event){
						var target = event.srcElement||event.target,
						balance = $.trim($(target).val()),
						perMax = Number(data.combPriceMax),
						validShares = Number(data.validShares),
						perMin = data.combPriceMin===''?0:data.combPriceMin;
						//数据格式验证
						if(!balance||balance===''){
							// $(target).val('0');
							tipbar.errorLeftTipbar($(target),'此项输入不能为空，请重新输入!');
							currentData.validShareFlag = false;
							return;
						}
						if(!/^([1-9]\d+\.?(\d{1,2})?)$|^([0-9]\.?(\d{1,2})?)$/.test(balance)){
							tipbar.errorLeftTipbar($(target),'您输入的数字格式有误，请重新输入!');
							$(target).val('');
							// viewModel.totalBalanceBind(_personModule.calculateTotalMoney());
							currentData.validShareFlag = false;
							return;
						}
						//通过验证后进行限额校验
						if(balance!=='0'){
							if(Number(balance)>perMax){
								tipbar.errorLeftTipbar($(target),'您输入的份额大于本支基金最高赎回限额:'+perMax);
								currentData.validShareFlag = false;
								return;
							}else if(Number(balance)<perMin){
								tipbar.errorLeftTipbar($(target),'您输入的份额低于本支基金最低赎回限额!');
								currentData.validShareFlag = false;
								return;
							}else if(Number(balance)>Number(validShares)){
								tipbar.errorLeftTipbar($(target),'您输入的份额高于您持有的可用份额:'+validShares);
								currentData.validShareFlag = false;
								return;
							}
						}
						
					},
					//每次改变单项金额计算总金额
					shareKeyUp : function(data,event){
						var target = event.srcElement||event.target,
						balance = $.trim($(target).val());
						//进行动态计算
						var result = balance.match(/([1-9]\d+\.?(\d{1,2})?)|[0-9]\.?(\d{1,2})?/);
						$(target).val(result===null?'':result[0]);
					},
					//快速排序可赎回基金列表,并赋予赎回金额
					reFreshRedemOrder : function(){
						var totalShares = $('#fast_purchase_money').val(),
						custNo = $('#select_cust_list').val();
						//验证
						if(!totalShares||totalShares===''){
							tipbar.errorTopTipbar($('#fast_purchase_money'),'此项输入不能为空，请重新输入!',1500);
							return;
						}
						if(totalShares==='0'){
							tipbar.errorTopTipbar($('#fast_purchase_money'),'您输入的金额为0，无法计算!',1500);
							return;
						}
						if(!/^([1-9]\d+\.?(\d{1,2})?)$|^([0-9]\.?(\d{1,2})?)$/.test(totalShares)){
							tipbar.errorTopTipbar($('#fast_purchase_money'),'您输入的数字格式有误，请重新输入(例:88888888.88)!',1500);
							$('#fast_purchase_money').val('');
							return;
						}
						$.post(common.getRootPath()+'/SaleTrade/sharesDistribution',{
							custNo : custNo,
							totalShares : totalShares
						},function(data){
							if(data.code === 200){
								for(var index in data.data){
									var tempData = data.data[index];
									for(var indexR in currentData.redemList){
										var tempRedem = currentData.redemList[indexR];
										if(tempRedem.fundCode === tempData.fundCode){
											currentData.redemList[indexR].share = tempData.shares;
										}
									}
								}
								viewModel.redemListBind(common.cloneArrayDeep(currentData.redemList));
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
						return common.formaterThounthand((Number(data.shares)*Number(data.netValue)).toFixed(1));
					},
					//格式化份额
					parseShares : function(data){
						if(!data.validShares)return;
						return common.formaterThounthand(Number(data.validShares).toFixed(2));
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
						if(!data) return '0.00';
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
						if(!data) return '----';
						if(data>=999999999) return '无限制';
						return common.formaterThounthand(common.formaterPoint2(data));
					},
					//基金详情查询地址格式化
					formaterFundDetail : function(data){
						return common.getRootPath()+'/p/pages/queryInfo/queryFund.html#'+data.fundCode;
					},

					//分页事件
					firstPage : function(){
						currentData.redemListPage.pageNum=1;
						_personModule.reFreshRedemList($('#select_cust_list').val(),false);
					},
					endPage : function(){
						currentData.redemListPage.pageNum=currentData.redemListPage.pages;
						_personModule.reFreshRedemList($('#select_cust_list').val(),false);
					},
					prevPage : function(){
						currentData.redemListPage.pageNum--;
						_personModule.reFreshRedemList($('#select_cust_list').val(),false);
					},
					nextPage : function(){
						currentData.redemListPage.pageNum++;
						_personModule.reFreshRedemList($('#select_cust_list').val(),false);
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
						_personModule.reFreshRedemList($('#select_cust_list').val(),false);
					}
				};

				//定义私有属性以及方法
				var _personModule = {
					//各步骤前置处理方法
					
					//刷新基金数据
					reFreshRedemList : function(partmentId,flag){
						tipbar.cleanPageTip();
						loading.addLoading($('#fund_detail_table'),common.getRootPath());
						$.post(common.getRootPath()+'/SaleQuery/querySaleShares',
							$.extend(true,currentData.redemListPage,{
								custNo:partmentId,
								businFlag : '24',
								flag:'1'
							}),function(data){
								//关闭加载状态弹幕
								loading.removeLoading($('#fund_detail_table'));
								currentData.redemList = data.data;
								currentData.redemList = common.addKey4ArrayObj(currentData.redemList,'share','');
								viewModel.redemListBind(common.cloneArrayDeep(data.data));
								//IE兼顾placeholder
								$('#fund_detail_table [name="share"]:enabled').each(function(){
									placeholder.placeholder($(this));
								});
								if(flag){
									currentData.redemListPage = data.page;
									viewModel.redemListPageBind(data.page);
								}else{
									viewModel.redemListPageBind(currentData.redemListPage);
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
							_personModule.initInfo($('#select_cust_list'),data.data,'<option value="">----全部----</option>');
						},'json');
					},
					//刷新企额宝产品信息
					reFreshQieInfo : function(custNo){
						$.post(common.getRootPath()+'/SaleQuery/queryPenguinShares',{custNo:custNo},function(data){
							if(data.code === 200){
								currentData.qieInfo = data.data;
								viewModel.qieInfoBind(currentData.qieInfo);
							}
						},'json');
					}

				};

				//绑定VM
				ko.applyBindings(viewModel);
				//数据初始化
				_personModule.reFreshRedemList('',true);
				_personModule.reFreshTradeAcoount();
				_personModule.reFreshQieInfo('');
				//公用事件绑定
				//placeholder绑定
				placeholder.placeholder('#input_amount');
		});
	});

});