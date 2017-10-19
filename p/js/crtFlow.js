/*
个人资产模块
作者:bhg
*/
define(function(require,exports,module){
	require.async(['p/js/common/dicTool','l/bootstrap/js/bootstrap.min',"l/My97DatePicker/4.8/WdatePicker"],function(){
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
		flowData:{
			operType:'复核',
			businClass:'01',
			aduitType:'0'
		},
		reWriteList:[],
		operList:[],
		recheckOperList:[],
		reWriteData : [],
		reWriteOperList : []
	};


	//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
	window.viewModel = {
		//属性绑定监控
		flowDataBind : ko.observable(currentData.flowData),
		operListBind : ko.observableArray(currentData.operList),
		reWriteListBind : ko.observableArray(currentData.reWriteList),
		recheckOperListBind : ko.observableArray(currentData.recheckOperList),
		reWriteDataBind : ko.observableArray(currentData.reWriteData),
		reWriteOperListBind : ko.observableArray(currentData.reWriteOperList),
		//选择复核定义
		selectRecheck : function(data,event){
			currentData.recheckOperList = [];
			viewModel.recheckOperListBind(currentData.recheckOperList);
			$('#recheck_link').tab('show');
		},
		//选择复核定义
		selectReWrite : function(){
			currentData.recheckOperList = [];
			viewModel.recheckOperListBind(currentData.recheckOperList);
			if(currentData.flowData.businClass === '02'){
				$('[mapping="noSkip"]').removeClass('hide');
				$('[mapping="skip"]').addClass('hide');
				$.post(common.getRootPath()+'/flow/selectFlowParams',{
				},function(data){
					if(data.code === 200){
						_personModule.createMoneyList(data.data.aduitAmountRange);
					}
					$('#rewrite_link').tab('show');
				},'json');
			}else{
				$('[mapping="noSkip"]').addClass('hide');
				$('[mapping="skip"]').removeClass('hide');
				$('#rewrite_link').tab('show');
			}
		},
		crtFlow : function(data,event){
			var param = currentData.flowData,
			target = $(event.target||event.srcElement);
			//判断数据填写完整性
			if(_personModule.validRecheck() !== true){
				tipbar.errorTopTipbar(target,_personModule.validRecheck());
				return;
			}
			//组装新建流程
			if(currentData.flowData.operType === '复核'){
				delete param.aduitType;
				//复核人参数添加
				var checker = [];
				$('#recheck_info .oper-list input:checkbox').each(function(){
					if(this.checked === true) checker.push($(this).val());
				});
				param.checker = checker.join(',');
			}else{
				//复核人参数添加
				var checkerRe = [];
				$('#rewrite_info_checker .oper-list input:checkbox').each(function(){
					if(this.checked === true) checkerRe.push($(this).val());
				});
				param.checker = checkerRe.join(',');
				var aduit = [],
				operList = $('#rewrite_info_aduit .oper-list');
				for (var i = 0; i < currentData.reWriteData.length; i++) {
					var tempRe = currentData.reWriteData[i],
					tempOp = operList.eq(i),
					checkerOp = [];
					tempOp.find('input:checkbox').each(function(){
						if(this.checked === true) checkerOp.push($(this).val());
					});
					aduit.push(tempRe.optAmount+','+checkerOp.join(','));
				}
				param.aduit = aduit.join(';');
				//处理另外一种情况
				var businCode = $('#busin_class_list_line input:checked').val(),
				aduitCode = $('#aduit_type_list_line input:checked').val();
				if(businCode !== '02'){
					var aduitStr = [];
					$('[mapping="skip"] .oper-list input:checkbox').each(function(){
						if(this.checked === true) aduitStr.push($(this).val());
					});
					param.aduit = '0,0,'+aduitStr.join(',');
				}
			}
			//新建请求
			$.post(common.getRootPath()+'/flow/addFlowDef',param,function(data){
				if(data.code === 200){
					tipbar.errorTopTipbar(target,'更新流程定义成功!');
				}else{
					tipbar.errorTopTipbar(target,'更新失败,原因:'+data.message||'未知');
				}
			},'json');
		},
		/*数据初始化*/
		formaterOptAmount:function(data){
			if(!data||data === '')return '----';
			if(data.split(',')[1] === '-1') data = data.split(',')[0]+','+'无限大';
			return data.split(',').join('-');
		}

		
	};
	//定义私有属性以及方法
	var _personModule = {
		
		//刷新基金数据
		reFreshTicketList : function(params,flag){
			//弹出弹幕加载状态
			loading.addLoading($('#'+params.wrapId+' table'),common.getRootPath());
			$.post(common.getRootPath()+params.url,
				$.extend(currentData.tradeListPage,currentData.searchData),function(data){
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
		//公用绑定函数
		checkNear: function(element, obj) {
			if(!obj){
				element[0].checked = !element[0].checked;
				return;
			}
		    var data_bind = element.attr('data-bind');
		    var valueBind = data_bind.split('hecked:')[1];
		    var keyBind = valueBind.split(',')[0];
		    var key = keyBind.split('.')[1];
		    if(element.is(':radio')){
		    	element[0].checked = true;
		    	obj[key] = element.val();
		    	//进行操作员选择框联动
		    	var eleName = element.attr('name');
		    	if(eleName === 'businClass'){
		    		_personModule.selectOperator();
		    	}
		    	return;
		    }
		    element[0].checked = !element[0].checked;
		    if (element[0].checked === true) {
		        currentData.flowData[key].push(element.val());
		    } else {
		        var ruleList = [];
		        for (var i = 0; i < currentData.flowData[key].length; i++) {
		            var temp = currentData.flowData[key][i];
		            if (temp !== element.val()) {
		                ruleList.push(temp);
		            }
		        }
		        currentData.flowData[key] = ruleList;
		    }
		},
		//初始化基金公司可选列表
		initFundCompList : function(ruleList,targetObj,targetBind,callback){
			$.post(common.getRootPath()+'/Platform/CustOperator/queryCustOperatorByPage',{
				ruleList:ruleList,
				name:'',                        //操作员姓名
				operCode:'',                     //操作员编码
				phone:'',                        //手机号码 
				status:''                       //1正常，2暂停业务，3注销 
			},function(data){
					if (targetObj.length < 1) {
					    targetObj = common.splitArray(data.data, 5);
					}
					viewModel[targetBind](targetObj);
					if(callback){callback();}
			},'json');
		},
		//选择操作员选择框体
		selectOperator : function(){
			var businCode = $('#busin_class_list_line input:checked').val();
			if(businCode === '02'){
				$('[mapping="noSkip"]').removeClass('hide');
				$('[mapping="skip"]').addClass('hide');
			}else{
				$('[mapping="noSkip"]').addClass('hide');
				$('[mapping="skip"]').removeClass('hide');
			}
			_personModule.reFreshFlowInfo(businCode);
			common.resizeIframe();
		},
		//处理生成金额段列表
		createMoneyList : function(moneyStr,callback){
			var moneyList = [],
			singleList = moneyStr.split(',');
			for (var i = 0; i < singleList.length; i++) {
				var tempSingle = singleList[i],
				prevSingle = singleList[i===0?0:i-1];
				if(!/^\d+$/.test(tempSingle)){
					return false;
				}else if(Number(tempSingle)<Number(prevSingle)){
					return {message:'请按照递增的顺序设定审批金额段!'};
				}else{
					if(tempSingle !== '0'){
						if(i === 0){
							moneyList.push({optAmount:'0,'+tempSingle});
						}else{
							moneyList.push({optAmount:prevSingle+','+tempSingle});
						}
						if(i===singleList.length-1){
								moneyList.push({optAmount:tempSingle+',-1'});
						}
					}
				}
			}
			currentData.reWriteData = moneyList;
			viewModel.reWriteDataBind(common.cloneArrayDeep(currentData.reWriteData));
			common.resizeIframe();
			if(callback){callback();}
			return true;
		},
		//刷新组装
		reFreshFlowInfo : function(businClass){
			$.post(common.getRootPath()+'/flow/selectFlowDef',{businClass:businClass},function(data){
				if((data.data||data.code === 200)&&(data.data.id!=='')){
					//判断是审批还是符合
					var recheckInfo = data.data;
					//复核人数据绑定
					currentData.recheckOperList = recheckInfo.checker.split(',');
					viewModel.recheckOperListBind(currentData.recheckOperList);
					//赋予ID等信息并刷新
					currentData.flowData.id = recheckInfo.id;
					currentData.flowData.aduitType = recheckInfo.aduitType;
					currentData.flowData.operType = recheckInfo.operType;
					viewModel.flowDataBind(currentData.flowData);
					if(recheckInfo.operType === '审批'){
						$('#rewrite_link').tab('show');
						if(businClass === '02'){
							var operList = recheckInfo.aduit.split(';');
							$.post(common.getRootPath()+'/flow/selectFlowParams',{
							},function(data){
								if(data.code === 200){
									_personModule.createMoneyList(data.data.aduitAmountRange);
									//循环赋值并判断值是否相等
									for (var i = 0; i < currentData.reWriteData.length; i++) {
										var tempReW = currentData.reWriteData[i],
										tempOper = operList[i],
										tempOperCode = tempOper.split(',').slice(0,2).join(','),
										tempOperList = tempOper.split(',').slice(2),
										tempOperEle = $('#rewrite_info_aduit .oper-list').eq(i).find('input:checkbox');
										if(tempReW.optAmount === tempOperCode){
											tempOperEle.each(function(){
												this.checked = false;
												for (var i = 0; i < tempOperList.length; i++) {
													var tempOperRe = tempOperList[i];
													if($(this).val() === tempOperRe){
														this.checked = true;
													}
												}
											});
										}
									}
								}
							},'json');
						}else{
							currentData.reWriteOperList = recheckInfo.aduit.split(',').slice(2);
							viewModel.reWriteOperListBind(currentData.reWriteOperList);
						}
					}else{
						$('#recheck_link').tab('show');
					}
				}
				if((data.data||data.code === 200)&&(data.data.id ==='')){
					//刷新非交易类的审批人列表
					delete currentData.flowData.id;
					$('#recheck_link').tab('show');
					currentData.flowData.operType = '复核';
					viewModel.flowDataBind(currentData.flowData);
					//复核人数据绑定
					currentData.recheckOperList = [];
					viewModel.recheckOperListBind(currentData.recheckOperList);
					currentData.reWriteOperList = [];
					viewModel.reWriteOperListBind(currentData.reWriteOperList);
				}
			},'json');
		},

		//选取内容提交验证
		validRecheck : function(){
			if(currentData.flowData.operType === '复核'){
				if($('#recheck_info_list input:checked').length<1){
					return '请选择复核操作员!';
				}
			}else{
				if($('#rewrite_info_checker input:checked').length<1){
					return '请选择复核操作员!';
				}
				if(currentData.flowData.businClass !== '02'){
					if($('#aduit_orther_list input:checked').length<1){
						return '请选择审批操作员!';
					}
				}else{
					var isAllLteOne = true;
					$('#rewrite_info_aduit .oper-list').each(function(){
						var isAllNoChecked = true;
						$(this).find('input:checkbox').each(function(){
							if(this.checked === true){
								isAllNoChecked = false;
							}
						});
						if(isAllNoChecked) isAllLteOne = false;
					});
					if(!isAllLteOne){ return '还有金额段未选择对应操作员!';}
				}
				
			}
			return true;
		}
	};

	
	

	ko.applyBindings(viewModel);


	_personModule.initFundCompList('OPERATOR_CHECKER',currentData.operList,'operListBind',function(){
		_personModule.initFundCompList('OPERATOR_ADUIT',currentData.reWriteList,'reWriteListBind',function(){
			_personModule.reFreshFlowInfo(currentData.flowData.businClass);
		});
	});

	//数据初始化
	
	//公共事件绑定
	$('#fund_search_way input:radio:enabled,#search_info input:radio:enabled')
	    .prev('span').css('cursor', 'pointer').click(function() {
	        _personModule.checkNear($(this).next(), currentData.flowData);
	 });

	$('#search_info .oper-list span').live('hover',function(){
		$(this).css('cursor', 'pointer');
	}).live('click',function() {
	        _personModule.checkNear($(this).next(), null);
	 });

	//控制选择性视图
	$('#busin_class_list_line input[type="radio"]').live('click',function(){
		_personModule.selectOperator();
	});  

	//兼容操作方式点击事件
	$('#oper_type_list_line input:radio').click(function(){
		if($(this).val() === '复核'){
			viewModel.selectRecheck();
		}else{
			viewModel.selectReWrite();
		}
	});  


});
});
});