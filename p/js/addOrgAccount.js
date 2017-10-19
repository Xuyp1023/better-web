/*
开户模块
作者:bhg
*/
define(function(require,exports,module){
	require.async(['p/js/common/dicTool','l/bootstrap/js/bootstrap.min','l/My97DatePicker/4.8/WdatePicker','l/jquery-plugins/jquery.cookie'],function(){
		require.async('BTDictData',function(){
				var validate = require("m/sea_modules/validate");
			    var tipbar = require("m/sea_modules/tooltip");
			    var common = require("p/js/common/common");
    			var loading = require("m/sea_modules/loading");

				//模块数据声明和初始化(Model)
				window.currentData = {
					custInfo : {
						// address: "广东深圳XXXXXX",
						// bankAccount: "621700550321788",
						// bankAddress: "广东深圳车公庙",
						// bankName: "广东深圳车公庙分行泰然支行",
						// c_apply_code: "7A6AH7SSA7",
						// c_busy_code: "43234242123131233",
						// identNo: "887878321-5",
						// bankAcountName: "张三",
						// c_tax_code: "A4546512324565321",
						// c_type_1: false,
						// c_type_2: true,
						// c_type_4: true,
						// certValidDate: "2020-09-10",
						// checker: "李四",
						// checkerCertValidDate: "2020-05-14",
						// contCertValidDate: "2020-12-05",
						// contEmail: "test@mail.com",
						// contIdentNo: "425225197002058754",
						// contIdentType1: true,
						// contMobileNo: "18858562012",
						// contName: "王五",
						// contPhone: "13565244528",
						// contFax:"0755-12345678",
						// custName: "XXX有限公司",
						// faxNo: "0755-12345678",
						// checkerIdentType1:true,
						// checkerIdentCode:"430135199007288547",
						// lawCertValidDate: "2020-07-06",
						// lawIdentNo: "4302321313211332",
						// lawIdentType1: true,
						// lawName: "赵六",
						// mobileNo: "17065872654",
						// officePhone: "0755-35648597",
						// zipCode: "518000",
						fundList:[]
					},
					accountInfo :[],
					existsFundList : [],
					fundCompInfoList :[],
					fundCompProList : []
				};

				//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
				window.viewModel = {
					//属性绑定监控
					regInfoBind : ko.observable(currentData.custInfo),
					accountInfoBind : ko.observableArray(currentData.accountInfo),
					fundListBind : ko.observableArray(currentData.custInfo.fundList),
					fundCompInfoListBind : ko.observableArray(currentData.fundCompInfoList),
					fundCompProListBind : ko.observableArray(currentData.fundCompProList),
					

					//事件绑定
					nextStep : function(data,event){
						var target = $(event.srcElement?event.srcElement:event.target),tabIndex,tabRoute = $('#content .nav-tabs a');
						tabIndex = Number(target.attr('target'));
						var targetLink = tabRoute.eq(tabIndex);
						var linkHref = targetLink.attr('href');
						var tabContentFunc = (linkHref===undefined||linkHref===null)?'reg_company_info':linkHref.split('#')[1];
						var tabFunc = _personModule[tabContentFunc+'_func'];
						tabFunc = (tabFunc===undefined ||tabFunc===null) ?_personModule.finish_company_info_func : tabFunc;
						var funcResult = tabFunc(target,targetLink);
						if(funcResult) targetLink.tab('show');
					},
					setDateInfo : function(data,event){
						WdatePicker({startDate:'%y-%M-%d',dateFmt:'yyyy-MM-dd',readOnly:true});
					},
					changeDateInfo : function(data,event){
						var targetElement = event.srcElement?event.srcElement:event.target;
						var dateName = $(targetElement).attr('dateName'),
						dateData = $(targetElement).attr('dateData');
						currentData[dateData][dateName] = targetElement.value;
					},
					checkNear:function(data,event){
						_personModule.checkNear($(event.srcElement?event.srcElement:event.target).next(),data);
					},
					storgeInfo : function(){
						try{
							var dataStr = JSON.stringify(currentData.custInfo);
							$.post(common.getRootPath()+'/p/testdata/testTrackResult.json',{data:dataStr,busyType:'01'},function(data){
								if(data.statusCode === 200){
									//暂存成功处理
									tipbar.infoTopTipbar('您的数据已成功暂存到服务器！',{});
								}else{
									tipbar.infoTopTipbar('数据暂存失败，错误信息:'+data.message+'请联系管理员！',{color:'red'});
								}
							});
						}catch(e){
							console.log(e);
						}
					},
					//数据格式化
					parseDate : function(data){
						if(!data) return '';
						return common.formaterDate(data);
					},
					//格式化基金公司
					formaterComp : function(data){
					    return BTDict.SaleAgency.get(data);
					}
				};
				viewModel.refreshCookie = ko.computed({
						read:function(){
							
						},
						owner:viewModel
					});

				//定义私有属性以及方法
				var _personModule = {
					//各步骤前置处理方法
					finish_company_info_func : function(clickedButton){
						// viewModel.regInfoBind(currentData.custInfo);
						// var validResult = validate.validate($('#reg_company_form'));
						// if(!validResult){
						// 	tipbar.errorTipbar(clickedButton,'有数据填写错误，请先进行检查！');
						// 	return false;
						// }
						return true;
					},
					sign_agreement_func : function(target,targetLink){
						//检查账号
						var resultFormValid = validate.validate($('#finish_company_form'));
						if(!resultFormValid){
							tipbar.errorTipbar(target,'有待填项还未正确填写,请检查!');
							return false;
						} 
						viewModel.regInfoBind(currentData.custInfo);
						viewModel.fundListBind(currentData.custInfo.fundList);
						//进行用户以及银行账号合法判断
						// common.cleanPageTip();
						// _personModule.checkAccount($('[mapping="identNo"]').val(),function(data){
						// 	if(data.code===200){
						// 		_personModule.checkBankAccount($('[mapping="bankAccount"]').val(),function(data){
						// 			if(data.code===200){
						// 				targetLink.tab('show');
						// 			}else{
						// 				tipbar.errorTipbar(target,'用户银行账号无效,请检查');
						// 				tipbar.errorTipbar($('[mapping="bankAccount"]'),'用户银行账号无效,请检查');
						// 			}
						// 		});
						// 	}else{
						// 		tipbar.errorTipbar(target,'用户组织机构代码证号无效,请检查');
						// 		tipbar.errorTipbar($('[mapping="identNo"]'),'用户组织机构代码证号无效,请检查');
						// 		_personModule.checkBankAccount($('[mapping="bankAccount"]').val(),function(data){
						// 			if(data.code!==200){
						// 				tipbar.errorTipbar($('[mapping="bankAccount"]'),'用户银行账号无效,请检查');
						// 			}
						// 		});
						// 	}
						// });
						return true;
					},
					pre_see_func : function(target,targetLink){
						//验证已选机构和协议信息
						var AccountListLength = $('#sign_agreement .account-list input:checked:enabled').length;
						if(AccountListLength<1){
							tipbar.errorTopTipbar(target,'还未选择需要增开账户的基金机构,请检查!');
							return false;
						}
						viewModel.regInfoBind(currentData.custInfo);
						viewModel.accountInfoBind(common.cloneArrayDeep(currentData.accountInfo));
						viewModel.fundListBind(currentData.custInfo.fundList);
						//设置未选中checkbox样式
						common.setUncheckCss($('#pre_see input:checkbox'));
						return true;
					},
					set_password_func : function(){
						return true;
					},
					finish_crt_func : function(obj,link){
						//取出已经存在的基金公司
						var newFundList = [];
						for (var i = 0; i < currentData.custInfo.fundList.length; i++) {
							var temp = currentData.custInfo.fundList[i];
							var notSame = true; 
							for (var j = 0; j < currentData.existsFundList.length; j++) {
								var temp2 = currentData.existsFundList[j];
								if(temp2===temp){
									notSame = false;
								}
							}
							if(notSame){
								newFundList.push(temp);
							}
						}
						//合并新参数列表
						var newCustInfo = $.extend(currentData.custInfo,{fundList:newFundList});
						//访问账户新增
						$.post(common.getRootPath()+'/SaleAccount/addOrgAccount?rn='+Math.random(),common.serializeSingleObject(newCustInfo),function(data){
							if(data.code==200){
								//组装基金公司code以及名称列表
								var targetFundList = [];
								for (var k = 0; k < currentData.custInfo.fundList.length; k++){
								    var tempFundList = currentData.custInfo.fundList[k];
								    targetFundList.push(tempFundList+';'+viewModel.formaterComp(tempFundList));
								}
								//组装返回数据
								var tmpData = $.extend(true,{},data.data.tmpData);
								delete data.data.tmpData;
								$.extend(data.data,tmpData);
								data.data.fundList = targetFundList.join(',');
								if(common.isBFS()){
								    $.post(common.getBFSRootPath()+'/fund/fundApp.do?method=mechOpenAcco',data.data,function(resultData){
								        /*if(resultData&&resultData.code===200){
								        }else{
								           // tipbar.errorTipbar(obj, data.message||'未知错误!');
								        }*/
								    }); 
								}
								link.tab('show');
							}else{
								tipbar.errorTipbar(obj,data.message);
							}
						},'json');
					},
					//公用绑定函数
					checkNear : function(element,obj){
						var data_bind = element.attr('data-bind');
						var valueBind = data_bind.split('hecked:')[1];
						var keyBind = valueBind.split(',')[0];
						var key = keyBind.split('.')[1];
						element[0].checked = !element[0].checked;
						if(element.attr('index')!==undefined&&element.attr('index')!==null&&element.attr('index')!==''){
							if(element[0].checked === true){
								currentData.custInfo.fundList.push(element.val());
							}else{
								var fundList = [];
								for (var i = 0; i < currentData.custInfo.fundList.length; i++) {
									var temp = currentData.custInfo.fundList[i];
									if(temp !== element.val()){
										fundList.push(temp);
									}
								}
								currentData.custInfo.fundList = fundList;
							}
						}else{
							obj[key] = element[0].checked;
						}
					},
					//初始化基金公司可选列表
					initFundCompList : function(){
					    var data = BTDict.SaleAgency.toArray('value', 'text');
					    if (currentData.accountInfo.length < 1) {
					        currentData.accountInfo = common.splitArray(data, 5);
					    }
					    viewModel.accountInfoBind(common.cloneArrayDeep(currentData.accountInfo));
					},
					//初始化地址、银行、证件类型等信息
					initInfo : function(targetElement,dicData,defaultElement,textName,valueName){
						var text = textName || 'text',
						value =  valueName || 'value';
						var dicArray = dicData.toArray(value,text);
						defaultHtml = defaultElement||''; 
						targetElement.html('').append(defaultHtml);
						for (var i = 0; i < dicArray.length; i++) {
							var tempDic = dicArray[i];
							targetElement.append('<option value="'+tempDic[value]+'">'+tempDic[text]+'</option>');
						}
					},
					//获取已开户信息
					initOrgInfo : function(custNo,callback){
						loading.addLoading($('#container'),common.getRootPath());
						$.post(common.getRootPath()+'/SaleQuery/queryRelaAccoInfo',{custNo:custNo},function(data){
							if(data.code === 200){
								loading.removeLoading($('#container'));
								//截取城市代码
								data.data.provinceNo =  data.data.cityNo.substr(0,2)+'0000';
								//设置市级连调
								_personModule.initInfo($('[mapping="city"]'),BTDict.Provinces.getItem(data.data.provinceNo).citys);
								currentData.custInfo = data.data;
								viewModel.regInfoBind(currentData.custInfo);
							}else{
								tipbar.infoTopTipbar('未查询到该账户的已开户信息,返回信息:'+data.message,{
									msg_box_cls : 'alert alert-warning alert-block',
									during:3000,
									inIframe:true
								});
							}
							callback();
						},'json');
					},
					//初始化已开户基金公司
					initFundCompInfo : function(custNo,callback){
						$.post(common.getRootPath()+'/SaleQuery/queryOpenedAgencyNoList',{custNo:custNo},function(data){
							currentData.custInfo.fundList = common.cloneArrayDeep(data.data);
							viewModel.fundListBind(currentData.custInfo.fundList);
							//临时保存已存在的基金公司
							currentData.existsFundList = common.cloneArrayDeep(data.data);
							callback();
						},'json');
					},
					//验证用户是否有效
					checkAccount : function(identNo,callback){
						$.post(common.getRootPath()+'/SaleQuery/checkAccountExists',{
							custType:'0',
							identType:'0',
							identNo:identNo
						},function(data){
							callback(data);
						},'json');
					},
					//验证银行账号是否有效
					checkBankAccount : function(bankAccount,callback){
						$.post(common.getRootPath()+'/SaleQuery/checkAcooBankExists',{
							netNo:'0101',
							bankAccount:bankAccount
						},function(data){
							callback(data);
						},'json');
					},
					//刷新交易账户列表
					reFreshTradeAccount : function(callback){
						$.post(common.getRootPath()+'/SaleQuery/queryCustInfo',{},function(data){
							if(data.code === 200){
								var tempCustInfo = new ListMap();
								for(var index in data.data){
									var temp = data.data[index];
									tempCustInfo.set(temp.value,temp.name);
								}
								BTDict.CustInfo = tempCustInfo;
								$('#cust_select_list').html('');
								for(var indexC in data.data){
									var tempCust = data.data[indexC];
									$('#cust_select_list').append('<li objValue="'+tempCust.value+'"><a href="#">'+tempCust.name+'</a></li>');
								}
								callback();
							}else{
								$('#error_info_box').css('height',$('#error_info_box').parent().height()-5).slideDown('fast');
							}
						},'json');
					},
					//刷新基金机构列表
					reFreshFundCompany : function(){
						var fundCompListInfo = BTDict.SaleAgency.toArray('value','text'),
						fundCompList = $('#fund_comp_list');
						fundCompList.html('');
						for(var index in fundCompListInfo){
							var temp = fundCompListInfo[index];
							fundCompList.append('<li objValue="'+temp.value+'"><a href="#">'+temp.text+'</a></li>');
						}
						fundCompList.find('li').click(function(){
							$('#fund_comp_name').html($(this).text());
							var agencyNo = $(this).attr('objValue');
							$.post(common.getRootPath()+'/SaleQuery/querySaleAgencyInfoWithFile',{agencyNo:agencyNo},function(data){
								if(data.code === 200){
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
									$('#comp_info_box').css('height',$('#content').height()).slideDown(500);
								}
							},'json');

						});

					}


				};

				//表单验证
				validate.validate($('#reg_company_form'),{
					elements:[
						{
							name:'c_apply_code',
							rules:[
								{
									name:'required',
									message:''
								}
							],
							events:['blur']
						},{
							name:'mobileNo',
							rules:[
								{
									name:'required',
									message:''
								}
							],
							events:['blur']
						}
					],
					errorPlacement:function(error,element){
						tipbar.errorTipbar(element,error);
					}
				});

				validate.validate($('#finish_company_form'),{
					elements:[{
						name:'phone',
						rules:[{
							name:'phone'
						}],
						events:['blur']
					},{
						name:'contFax',
						rules:[{
							name:'fax'
						}],
						events:['blur']
					},{
						name:'contEmail',
						rules:[{
							name:'email'
						}],
						events:['blur']
					},{
						name:'contMobileNo',
						rules:[{
							name:'mobile'
						}],
						events:['blur']
					},{
						name:'faxNo',
						rules:[{
							name:'fax'
						}],
						events:['blur']
					},{
						name:'contPhone',
						rules:[{
							name:'phone'
						}],
						events:['blur']
					}],
					errorPlacement : function(error,element){
						var label = element.parents('td').prev().text().substr(1);
						tipbar.errorLeftTipbar(element,label+error);
					}
				});


				ko.applyBindings(viewModel);
				/*公共事件绑定*/
				$('#finish_company_form,#sign_agreement_table').find('.double-check-sp').click(function(event){
					var dateName = $(this).parent().find('input').attr('dateName'),
					dateData = $(this).parent().find('input').attr('dateData');
					var that = $(this);
					if(that.is('.active')){
						that.removeClass('active');
						that.parent().find('input').val(common.getCurrentDate());
						currentData[dateData][dateName] = common.getCurrentDate();
					}else{
						that.addClass('active');
						that.parent().find('input').val('2099-12-31');
						currentData[dateData][dateName] = '2099-12-31';
					}
				});
				$('#sign_agreement .checkPro input:checkbox:enabled').next('span').css('cursor','pointer').click(function(){
					_personModule.checkNear($(this).prev(),currentData.custInfo);
				});

				$('#reg_company_info,#finish_company_info,#sign_agreement').find(':input')
				.live('blur',function(){
					var custInfoStr = JSON.stringify(currentData.custInfo);
					$.cookie('custInfo',custInfoStr,{
						expires:7
					});
				});
				//绑定账号校验
				$('[mapping="identNo"]').blur(function(){
					var _that = $(this);
					_personModule.checkAccount($(this).val(),function(data){
						if(data.code !== 200){
							tipbar.errorTipbar(_that,'该用户为无效用户,请重新填写');
						}
					});
				});
				//绑定银行号码校验
				$('[mapping="bankAccount"]').blur(function(){
					var _that = $(this);
					_personModule.checkBankAccount($(this).val(),function(data){
						if(data.code !== 200){
							tipbar.errorTipbar(_that,'该账号为无效账号，请重新填写');
						}
					});
				});
				//选择交易账户
				$('#cust_select_list li').live('click',function(){
					//初始化基金公司列表
					common.cleanPageTip();
					_personModule.initFundCompList();
					var _that = this;
					_personModule.reFreshTradeAccount(function(){
						_personModule.initOrgInfo($(_that).attr('objValue'),function(){
							validate.validate($('#finish_company_form'));
							//初始化已开户的销售机构
							_personModule.initFundCompInfo($(_that).attr('objValue'),function(){
								//设置选中checkbox样式
								$('#check_protocol_table input:checked').each(function(){
									$(this).attr('disabled',true)
									.prev().unbind()
									.addClass('unchecked');
								});
							});
						});
					});
				});

				//初始化字典信息
				_personModule.initInfo($('[mapping="initBank"]'),BTDict.SaleBankCode);
				_personModule.initInfo($('[mapping="province"]'),BTDict.Provinces);
				_personModule.initInfo($('[mapping="city"]'),BTDict.Provinces.getItem($('[mapping="province"]').val()).citys);
				_personModule.initInfo($('[mapping="identity"]'),BTDict.PersonIdentType);
				$('[mapping="province"]').change(function(){
					var dicData = BTDict.Provinces.getItem($(this).val()).citys;
					_personModule.initInfo($('[mapping="city"]'),dicData);
				});

				//初始化第一次开户的信息
				_personModule.reFreshTradeAccount(function(){
					//刷新基金机构信息
					var data = BTDict.SaleAgency.toArray('value','text');
					if(currentData.accountInfo.length<1){
						currentData.accountInfo = common.splitArray(data,5);
					}
					viewModel.accountInfoBind(currentData.accountInfo);
					_personModule.initOrgInfo($('#cust_select_list li:eq(0)').attr('objValue'),function(){
						//初始化已开户的销售机构
						_personModule.initFundCompInfo($('#cust_select_list li:eq(0)').attr('objValue'),function(){
							//设置选中checkbox样式
							$('#check_protocol_table input:checked').each(function(){
								$(this).attr('disabled',true)
								.prev().unbind()
								.addClass('unchecked');
							});
						});
					});
				});

				//初始化基金机构信息
				_personModule.reFreshFundCompany();

				//设定上次保存的数据
				// $(document).on('load',function(){
					
				// });

				// $.post(common.getRootPath()+'/p/testdata/testResp.json',{},function(data){
				// 	if(data.data){
				// 		currentData.custInfo = data.data;
				// 		viewModel.regInfoBind(custInfo);
				// 		tipbar.infoTopTipbar('发现服务器暂存信息，已载入！',{});
				// 	}else{
				// 		//如果没有服务器暂存，则启用本地暂存
				// 		var custInfo = JSON.parse($.cookie('custInfo'));
				// 		if(custInfo&&!common.isEmptyObject(custInfo)){
				// 			currentData.custInfo = custInfo;
				// 			viewModel.regInfoBind(custInfo);
				// 		}
				// 		tipbar.infoTopTipbar('未发现服务器暂存信息，使用本地缓存的用户填写信息！',{inIframe:true});
				// 	}
					
				// });
		});
	});

});