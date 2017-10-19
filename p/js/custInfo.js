/*
开户模块
作者:bhg
*/
define(function(require,exports,module){
	require.async(['p/js/common/dicTool','l/bootstrap/js/bootstrap.min',"l/My97DatePicker/4.8/WdatePicker.js"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("m/sea_modules/validate");
    var tipbar = require("m/sea_modules/tooltip");
    var common = require("p/js/common/common");

	//模块数据声明和初始化(Model)
	window.currentData = {
		custInfo : {}
	};

	//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
	window.viewModel = {
		//属性绑定监控
		custInfoBind : ko.observable(currentData.custInfo),
		existsFundCompBind : ko.observable(''),
		existsScfCompBind : ko.observable(''),
		existsMoneyCompBind : ko.observable(''),
		//事件绑定
		modifyCustInfo : function(data,event){
			//表单校验
			var target = event.srcElement || event.target,
			valid_edit = validate.validate($('#edit_info_form'));
			valid_scf = validate.validate($('#edit_scf_info_form'));
			if(!valid_edit||!valid_scf){
				tipbar.errorTopTipbar($(target),'还有选项没有正确填写,请查看上方提示！');
				return;
			}
			$.post(common.getRootPath()+'/SaleAccount/updateContacInfo',common.serializeSingleObject(currentData.custInfo),function(data){
				tipbar.errorTopTipbar($(target),data.message);
				_personModule.reFreshCustInfo($('#select_cust_no').val());
			},'json');
		},
		setDateInfo : function(data,event){
			WdatePicker({startDate:'%y-%M-%d',maxDate:'#F{$dp.$D(\'end_date\')}',dateFmt:'yyyy-MM-dd',readOnly:true});
		},
		setEndDate : function(){
			WdatePicker({startDate:'%y-%M-%d',minDate:'#F{$dp.$D(\'begin_date\')}',dateFmt:'yyyy-MM-dd',readOnly:true});
		},
		setBeginDate : function(){
			WdatePicker({startDate:'%y-%M-%d',dateFmt:'yyyy-MM-dd',readOnly:true});
		},
		changeDateInfo : function(data,event){
			var dateName = $(event.target).attr('dateName'),
			dateData = $(event.target).attr('dateData');
			currentData[dateData][dateName] = event.target.value;
		},
		//表单重置
		resetForm : function(){
			_personModule.reFreshCustInfo($('#select_cust_no').val());
		}
	};

	//定义私有属性以及方法
	var _personModule = {
		//刷新客户信息
		reFreshCustInfo : function(partmentId,callback){
			$.post(common.getRootPath()+'/SaleQuery/queryContacInfo',
				{
					custNo:partmentId
				},function(data){
					currentData.custInfo = data.data;
					viewModel.custInfoBind(currentData.custInfo);
					//初始化已开户基金公司
					$.post(common.getRootPath()+'/SaleQuery/queryOpenedAccount',{custNo:partmentId},function(data){
						_personModule.reFeshOPenedPartment(data.data.fund,'SaleAgency','existsFundCompBind');
						_personModule.reFeshOPenedPartment(data.data.scf,'ScfAgencyGroup','existsScfCompBind');
						_personModule.reFeshOPenedPartment(data.data.money,'SaleAgency','existsMoneyCompBind');
					},'json');
					common.resizeIframe();
			},'json');
		},
		//刷新已开户机构相关数据
		reFeshOPenedPartment : function(data,dicName,bindName){
			var newCompArr = [];
			for (var i = 0; i < data.length; i++) {
				var tempCompInfo = data[i];
				newCompArr.push(BTDict[dicName].get(tempCompInfo));
			}
			viewModel[bindName](newCompArr.join('、'));
			if(newCompArr.length<1){
				viewModel[bindName]('暂无已开户基金公司！');
			}
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
		reFreshTradeAccount : function(callback){
			$.post(common.getRootPath()+'/SaleQuery/queryCustInfoIsOpen',{},function(data){
				if(data.code===200){
				var tempCustInfo = new ListMap();
				for(var index in data.data){
					var temp = data.data[index];
					tempCustInfo.set(temp.value,temp.name);
				}
				BTDict.CustInfo = tempCustInfo;
				_personModule.initInfo($('#select_cust_no'),data.data);
				callback();
				}else{
					$('#error_info_box').css('height',$('body').parent().height()-5).slideDown('fast');
				}
			},'json');
		}
	};

	//数据校验
	validate.validate($('#edit_info_form'), {
	      elements: [{
	          name: 'contMobileNo',
	          rules: [{
	              name: 'mobile'
	          }],
	          events: ['blur']
	      },{
	          name: 'contEmail',
	          rules: [{
	              name: 'email'
	          }],
	          events: ['blur']
	      },{
	          name: 'phone',
	          rules: [{
	              name: 'phone'
	          }],
	          events: ['blur']
	      }],
	      errorPlacement: function(error, element) {
	          var label = element.parents('td').prev().text().substr(0);
	          tipbar.errorTipbar(element,error,0,99999);
	      }
	});

	validate.validate($('#edit_scf_info_form'), {
	      elements: [{
	          name: 'regBalance',
	          rules: [{
	              name: 'money'
	          }],
	          events: ['blur']
	      },{
	          name: 'paidCapital',
	          rules: [{
	              name: 'money'
	          }],
	          events: ['blur']
	      },{
	          name: 'personCount',
	          rules: [{
	              name: 'int'
	          }],
	          events: ['blur']
	      },{
	          name: 'operateArea',
	          rules: [{
	              name: 'float'
	          }],
	          events: ['blur']
	      },{
	          name: 'ownerShipYear',
	          rules: [{
	              name: 'float'
	          }],
	          events: ['blur']
	      }],
	      errorPlacement: function(error, element) {
	          var label = element.parents('td').prev().text().substr(0);
	          tipbar.errorTipbar(element,error,0,99999);
	      }
	});

	


	ko.applyBindings(viewModel);

	/*JQ事件绑定区域*/
	//更换账号
	$('#select_cust_no').change(function(){
		_personModule.reFreshCustInfo($(this).val());
	});

	/*数据初始化*/
	//初始化用户交易信息
	_personModule.initInfo($('#reg_fund_area'),BTDict.RegCapitalRang.toArray('value','name'),'<option value="">--未选择--</option>');
	_personModule.initInfo($('#corp_select'),BTDict.OrganizationType.toArray('value','name'),'<option value="">--未选择--</option>');
	_personModule.initInfo($('#corp_pro_select'),BTDict.EnterpriseNature.toArray('value','name'),'<option value="">--未选择--</option>');
	_personModule.initInfo($('#corp_nor_select'),BTDict.InvestCorpVocate.toArray('value','name'),'<option value="">--未选择--</option>');
	_personModule.reFreshTradeAccount(function(){
		_personModule.reFreshCustInfo($('#select_cust_no').val());
	});
});
});
});