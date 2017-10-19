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
			var BTPATH = require("p/js/common/commonpath");

			window.tipbar = tipbar;
			//模块数据声明和初始化(Model)
			window.currentData = {
				//开户类型配置信息
				addTypeConfig:[
					{
						type:"fund",
						title:"选择开户基金销售机构",
						// orgDetailBtn:true,			//["查看机构开户资料"]按钮是否显示
						selectMsg:"还未选择需要增开账户的基金机构,请检查!",
						successMsg:"开户已经完成，等待基金销售机构复核开户资料，复核通过后才能购买基金或理财产品。",//开户成功提示
						noExistMsg:"系统检测到您还未拥有已开户的账户，请先进行基金开户后再尝试增开账户操作!",		//尚没有账户
						protocolName:"基金机构客户网上交易协议",
						remindMsg1:"1.请您认真核对地址信息，保证资料真实、准确。",
						remindMsg2:"2.因网上交易的特殊性，请您务必填写真实、准确的机构信息并妥善保管登录账号（证件号码、基金账号）及交易密码等重要信息。",	//温馨提示信息
						remindMsg4:"4.开立基金账户所需资料:开放式基金账户申请表机构、开放式基金业务授权委托书、机构投资者传真委托服务协议、开放式基金业务印鉴卡、营业执照复印件（加盖公章）、组织机构代码证复印件（加盖公章）、税务登记证复印件（加盖公章）、指定银行开户证明、经办人有效身份证复印件（加盖公章）、法人有效身份证复印件（加盖公章）、机构负责人有效身份证复印件（加盖公章）、机构投资者风险调查问卷、投资者权益书;此外某些基金机构所需个别资料请在基金机构选择页面详细查看。",
						viewMsg:"查看基金产品",
						viewUrl:"../purchase/purchase.html"
					},
					{
						type:"scf",
						title:"选择开户保理销售机构",
						// orgDetailBtn:false,
						selectMsg:"还未选择需要增开账户的保理机构,请检查!",
						successMsg:"开户已经完成，等待保理销售机构复核开户资料，复核通过后才能进行保理业务操作。",
						noExistMsg:"系统检测到您还未拥有已开户的账户，请先进行保理开户后再尝试增开账户操作!",
						protocolName:"保理机构客户网上交易协议",
						remindMsg1:"1.请您认真核对企业名称、企业证件号码以及联系方式等信息，保证资料真实、准确。",
						remindMsg2:"2.因网上交易的特殊性，请您务必填写真实、准确的机构信息并妥善保管登录账号（证件号码、保理账号）及交易密码等重要信息。",	
						remindMsg4:"4.开通保理融资业务所需资料列表如下:营业执照副本复印件；组织机构代码证副本复印件；税务登记证复印件；公司章程；验资报告（或询证函）；贷款卡复印件（如无，则提供机构信用代码证）；婚姻证明、身份证复印件（法人及夫妻双方）；企业法人代表和企业征信报告；近两年审计报告（未审计则提供财务报表）、近三个月及上一年同期财务报表（共六期）；近一年及最近三个月企业纳税申报表、企业纳税证明（税局盖章原件）；主要结算行近期不少于三个月的银行对账单；企业融资明细（包括银行贷款及民间借贷）；交易量排前5名的上下游客户清单及贸易合同和发票复印件；与核心企业近六个月的交易金额，近三个月合同、对账单、发票、收发货文件、付款水单等（各提供5份）。",
						viewMsg:"查看保理产品",
						viewUrl:"../../../scf/app/factoring/recieveFac.html"
					}
				],
				custInfo : {
					custNo:"",
					fundList:['ylb']
				},
				agreeInfo :{
					isFile:false
				},
				accountInfo :[],
				existsFundList : [],
				fundCompInfoList :[],
				fundCompProList : [],
				nextButtonShow:{
					allow:true,
					info:""
				},
				//当前开户类型信息
				addTypeInfo : {
					type:"",
					title:"",
					title_pre:"",
					sign_agree:"",
					// orgDetailBtn:false,
					selectMsg:"",
					successMsg:"",
					existMsg:"",
					protocolName:"",
					remindMsg2:"",	
					remindMsg4:""
				}
			};

			//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
			window.viewModel = {
				//属性绑定监控
				nextButtonShowBind :  ko.observable(currentData.nextButtonShow),
				addTypeInfoBind : ko.observable(currentData.addTypeInfo),
				regInfoBind : ko.observable(currentData.custInfo),
				accountInfoBind : ko.observableArray(currentData.accountInfo),
				fundListBind : ko.observableArray(currentData.custInfo.fundList),
				fundCompInfoListBind : ko.observableArray(currentData.fundCompInfoList),
				fundCompProListBind : ko.observableArray(currentData.fundCompProList),
				agreeInfoBind:ko.observable(currentData.agreeInfo),
				

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

					//iframe高度自适应
					setTimeout(function(){
						var ifm = window.parent.document.getElementsByName('content_iframe');
						var subHmtl = $('html');
						$(ifm).css('height',subHmtl[0].scrollHeight +'px');
					},500);
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
				/*storgeInfo : function(){
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
				},*/
				//获取新选择的公司/机构，判断是否允许下一步操作
				checkedOrgPermit: function(){
					var newCmpList = _personModule.filterExistCmp();
					/*if(!newCmpList){
						return ;
					}*/
					var param = {
						'custNo':currentData.custInfo.custNo,
						"businFlag":currentData.addTypeInfo.type,
						"agencyNo":newCmpList
					};
					$.post(BTPATH.CHECK_CUST_FILE_PATH,common.serializeSingleObject(param),function(data){
						//不允许，页面显示原因
						if(data.data.length===0){
							currentData.nextButtonShow.allow = true;
							currentData.nextButtonShow.info = "";
						}else{
							currentData.nextButtonShow.allow = false;
							currentData.nextButtonShow.info = "以下文件尚未认证:" + data.data.join(",") + "。";
						}
						viewModel.nextButtonShowBind(currentData.nextButtonShow);
					},'json');
					return true;
				},
				//数据格式化
				parseDate : function(data){
					if(!data) return '';
					return common.formaterDate(data);
				},
				//格式化基金公司
				formaterComp : function(data){
				    return BTDict.SaleAgency.get(data);
				},
				//删除上传附件
				deleteAttach : function(data,event){
					var target = $(event.target||event.srcElement);
					var index = $(target[0]).attr("index");
					currentData.agreeInfo['attachName' + index] = null;
					viewModel.agreeInfoBind(currentData.agreeInfo);
				},
				//下载地址
				formatDownLoadUrl:function(index){
					/*return common.getRootPath()+'/p/pages/queryInfo/queryFund.html#'+currentData.agreeInfo['id' + index];*/
					return common.getRootPath()+'/Platform/CustFile/fileDownload?id='+currentData.agreeInfo['id' + index];
				}
			};

			viewModel.refreshCookie = ko.computed({
					read:function(){
						
					},
					owner:viewModel
				});

			//监控选中机构数量的变化
			viewModel.fundListBind.subscribe(function(newValue){
				viewModel.checkedOrgPermit();
			});

			//定义私有属性以及方法
			var _personModule = {
				//初始化开户类型信息
				initAddTypeInfo : function(){
					var type = location.hash.substr(1);
					currentData.addTypeInfo = ArrayPlus(currentData.addTypeConfig).objectChildFilter('type',type)[0];
					viewModel.addTypeInfoBind(currentData.addTypeInfo);
				},
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
					// var AccountListLength = $('#sign_agreement .account-list input:checked:enabled').length;
					// if(AccountListLength<1){
					// 	tipbar.errorTopTipbar(target,currentData.addTypeInfo.selectMsg);
					// 	return false;
					// }
					viewModel.regInfoBind(currentData.custInfo);
					viewModel.accountInfoBind(common.cloneArrayDeep(currentData.accountInfo));
					viewModel.fundListBind(currentData.custInfo.fundList);

					var existFund = currentData.existsFundList.join(",");
					//SaleAccountInfoBind 刷新数据将复选框禁用抹除了，需要重新设置
					$('#check_protocol_table input:checked').each(function(){
						var value = $(this).val();
						if(existFund.indexOf(value)!==-1){
							//已经开户的机构，将其置灰。
							$(this).attr('disabled',true)
							.prev().addClass('unchecked');
						}						
					});

					//设置未选中checkbox样式
					common.setUncheckCss($('#pre_see input:checkbox'));
					return true;
				},
				set_password_func : function(){
					return true;
				},
				finish_crt_func : function(obj,link){
					//取出已经存在的机构/公司
					var fileList=currentData.agreeInfo;
					fileList = [fileList.id1,fileList.id2,fileList.id3,fileList.id4];
					//合并新参数列表
					var newCustInfo = $.extend(currentData.custInfo,{fileList:fileList});
					newCustInfo.agencyNo="ylb";
					//访问账户新增
					$.post("../../../SaleAccount/addYlbAccount" + '?rn='+Math.random(),common.serializeSingleObject(newCustInfo),function(data){
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
							    },'json'); 
							}
							link.tab('show');
						}else{
							tipbar.errorTipbar(obj,data.message);
						}
					},'json');
				},
				//取出已经存在的机构/公司
				filterExistCmp : function(){
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
					return newFundList;
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
				//初始化机构可选列表
				initFundCompList : function(){
					var data;
					switch(currentData.addTypeInfo.type){
					case 'fund':
						data = BTDict.SaleAgency.toArray('value', 'text');
						break;
					case 'scf':
						data = BTDict.ScfAgencyGroup.toArray('value', 'text');
						break;
					}
				    // var data = BTDict.SaleAgency.toArray('value', 'text');
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
					$.post(BTPATH.RELA_ACCO_INFO_PATH,{'custNo':custNo,"businClass":currentData.addTypeInfo.type},function(data){
						if(data.code === 200){
							loading.removeLoading($('#container'));
							// 赋值  附件信息
							var agreeInfo = {},aduitList = data.data.aduitList;
							for (var i = 0; i < aduitList.length; i++) {

								switch (aduitList[i].workType){
									case "custLogoFile":
										var attachAttr = aduitList[i].fileList[0].split(':');
										agreeInfo['attachName'+1] = attachAttr[1];
										agreeInfo['id'+1] = attachAttr[0];
										break;
									case "shopBoardFile":
										var attachAttr = aduitList[i].fileList[0].split(':');
										agreeInfo['attachName'+2] = attachAttr[1];
										agreeInfo['id'+2] = attachAttr[0];
										break;
									case "shopSceneFile":
										var attachAttr = aduitList[i].fileList[0].split(':');
										agreeInfo['attachName'+3] = attachAttr[1];
										agreeInfo['id'+3] = attachAttr[0];
										break;
									case "otherFile":
										var attachAttr = aduitList[i].fileList[0].split(':');
										agreeInfo['attachName'+4] = attachAttr[1];
										agreeInfo['id'+4] = attachAttr[0];
										break;
								}
							}
							currentData.agreeInfo = agreeInfo;

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
					//,"type":currentData.addTypeInfo.type
					/*$.post(BTPATH.OPENED_AGENCY_PATH,{'custNo':custNo,"businClass":currentData.addTypeInfo.type},function(data){
						currentData.custInfo.fundList = common.cloneArrayDeep(data.data);
						viewModel.fundListBind(currentData.custInfo.fundList);
						//临时保存已存在的机构/公司
						currentData.existsFundList = common.cloneArrayDeep(data.data);
						callback();
					},'json');*/

					currentData.custInfo.fundList=["ylb"];
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
					$.post(BTPATH.TRADE_ACCOUNT_LIST,{},function(data){
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
				//初始化经营类目的下拉
				reFreshOperateSelect : function(){


					function initSelect(targetElement,dicArray){
						targetElement.html('');
						for (var i = 0; i < dicArray.length; i++) {
							var tempDic = dicArray[i];
							targetElement.append('<option index="'+i+'" value="'+tempDic.code+'">'+tempDic.name+'</option>');
						}
					}

					function refreshAgreeInfo(data,type) {

						switch (type){
							case 1:
								$('[mapping="mq2"]').change();
								break;
							case 2:
								$('[mapping="mq3"]').change();
								break;
							case 3:
								var targetElement = $('[mapping="mq3"]');
								var mq3 = targetElement[0].selectedOptions[0].index;
								var info = data[mq1].children[mq2].children[mq3];

								currentData.agreeInfo.isFile = info.isFile =='0' ? false:true;
								currentData.agreeInfo.name = info.remark;
								viewModel.agreeInfoBind(currentData.agreeInfo);
								break;
						};
					}

					//设置默认下标
					var mq1 = 0,mq2 =0;

					$.get('/better/byte/server/btDict/p/fund/operate.json',function(data){
						if(data.code === 200){

							initSelect($('[mapping="mq1"]'),data.data);
							initSelect($('[mapping="mq2"]'),data.data[mq1].children);
							initSelect($('[mapping="mq3"]'),data.data[mq1].children[mq2].children);

							setTimeout(function(){
								$('[mapping="mq1"]').change(function(){
									mq1 = $(this)[0].selectedOptions[0].index;
									initSelect($('[mapping="mq2"]'),data.data[mq1].children);

									refreshAgreeInfo(data.data,1);
								});
							},1);
							setTimeout(function(){
								$('[mapping="mq2"]').change(function(){
									mq2 = $(this)[0].selectedOptions[0].index;
									initSelect($('[mapping="mq3"]'),data.data[mq1].children[mq2].children);

									refreshAgreeInfo(data.data,2);
								});
							},2);
							$('[mapping="mq3"]').change(function(){
								refreshAgreeInfo(data.data,3);
							});
					
						}
					},'json');

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
				var custNo = currentData.custInfo.custNo = $(_that).attr('objValue');
				_personModule.reFreshTradeAccount(function(){
					_personModule.initOrgInfo(custNo,function(){
						validate.validate($('#finish_company_form'));
						//初始化已开户的销售机构
						_personModule.initFundCompInfo(custNo,function(){
							//设置选中checkbox样式
							$('#check_protocol_table input:checked').each(function(){
								$(this).attr('disabled',true)
								.prev().addClass('unchecked');
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

			//初始化增开类型信息
 			_personModule.initAddTypeInfo();

			//初始化第一次开户的信息
			_personModule.reFreshTradeAccount(function(){
				//刷新基金机构信息
				var data;
				switch(currentData.addTypeInfo.type){
				case 'fund':
					data = BTDict.SaleAgency.toArray('value', 'text');
					break;
				case 'scf':
					data = BTDict.ScfAgencyGroup.toArray('value', 'text');
					break;
				}
				// var data = BTDict.SaleAgency.toArray('value','text');
				if(currentData.accountInfo.length<1){
					currentData.accountInfo = common.splitArray(data,5);
				}
				viewModel.accountInfoBind(currentData.accountInfo);
				var custNo = currentData.custInfo.custNo = $('#cust_select_list li:eq(0)').attr('objValue');
				_personModule.initOrgInfo(custNo,function(){
					//初始化已开户的销售机构
					_personModule.initFundCompInfo(custNo,function(){
						//设置选中checkbox样式
						$('#check_protocol_table input:checked').each(function(){
							$(this).attr('disabled',true)
							.prev().addClass('unchecked');
						});
					});
				});
			});

			//初始化经营类目的下拉
			_personModule.reFreshOperateSelect();

			/*设定上次保存的数据
			$(document).on('load',function(){
				
			});

			$.post(common.getRootPath()+'/p/testdata/testResp.json',{},function(data){
				if(data.data){
					currentData.custInfo = data.data;
					viewModel.regInfoBind(custInfo);
					tipbar.infoTopTipbar('发现服务器暂存信息，已载入！',{});
				}else{
					//如果没有服务器暂存，则启用本地暂存
					var custInfo = JSON.parse($.cookie('custInfo'));
					if(custInfo&&!common.isEmptyObject(custInfo)){
						currentData.custInfo = custInfo;
						viewModel.regInfoBind(custInfo);
					}
					tipbar.infoTopTipbar('未发现服务器暂存信息，使用本地缓存的用户填写信息！',{inIframe:true});
				}
				
			});*/
		});
	});

});