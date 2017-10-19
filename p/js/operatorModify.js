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
    var placeholder = require("m/sea_modules/placeholder");

	//模块数据声明和初始化(Model)
	window.currentData = {
		operListPage : {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		},
		operData:{
			name:'',             
			contIdentType:'0',    
			contIdentNo:'',      
			contCertValidDate:new Date().getSubDate('YYYY', -5).format('YYYY-MM-DD'),
			zipCode:'' ,         
			address:'',          
			faxNo:'',            
			sex:''  ,            
			phone:'' ,           
			mobileNo:'' ,        
			email:''   ,         
			password :'' ,       
			repassword :'' ,       
			identClass:'',                       
			transBusin:'' ,                      
			revokeBusin :'' ,
			operCode:'',   
			defOper :'' ,        
			contactorSerial :'', 
			ruleList :[] 
		},
		operList:[],
		operInfo : {},
		cacheSearchtarget:'',
		localDic : {
			status:{
				item1:'正常',
				item2:'暂停业务',
				item3:'注销'
			}
		},
		pwdInfo:{}
	};

	//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
	window.viewModel = {
		//属性绑定监控
		operListPageBind : ko.observable(currentData.operListPage),
		operDataBind : ko.observable(currentData.operData),
		operListBind : ko.observableArray(currentData.operList),
		operInfoBind : ko.observable(currentData.operInfo),
		pwdInfoBind:ko.observable(currentData.pwdInfo),
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
		// searchoper : function(data,event){
		// 	var target = $(event.srcElement||event.target).attr('objValue');
		// 	currentData.cacheSearchtarget = target;
		// 	_personModule.reFreshoperList(_personModule.packageParams(target),true);
		// },
		showoperDetail : function(data,event){
			currentData.operData = data;
			currentData.initOperData = $.extend({},data);
			currentData.initOperData.ruleList = currentData.initOperData.ruleList.length>1?currentData.initOperData.ruleList.split(','):[];
			currentData.operData.ruleList = currentData.operData.ruleList.length>1?currentData.operData.ruleList.split(','):[];
			viewModel.operDataBind(currentData.operData);
			$('#fix_operator_info_box').css('height',$('#content').height()).slideDown('fast');
		},
		//新增操作员
		addOper : function(data,event){
			//表单校验
			var resultFormValid = validate.validate($('#fix_operator_info')),
			target = $(event.target||event.srcElement);
			if (!resultFormValid) {
			    tipbar.errorTipbar(target, '有待填项还未正确填写,请检查!',3000,9200);
			    return false;
			}
			if($('#rule_list_line input:checked').length<1){
				tipbar.errorTipbar(target, '还未为用户分配角色!',3000,9200);
				return false;
			}
			$.post(common.getRootPath()+'/custOperator/editCustOperator',common.serializeSingleObject(currentData.operData),
				function(data){
					if(data.code === 200){
						tipbar.errorTopTipbar($(target),'编辑操作员成功,请进入操作员管理查看或继续编辑！',2500,9200);
					}else{
						tipbar.errorTopTipbar($(target),'编辑操作员失败,返回信息:'+data.message,2500,9200);
					}
				},'json');
		},
		//重置密码
		modiPwd : function(data,event){
			var $target = $(event.target||event.srcElement),
			validResult = validate.validate($('#modi_pwd_form'));
			if(validResult){
				$.post(common.getRootPath()+'/changeUserPassword',$.extend({id:currentData.operData.id},currentData.pwdInfo),function(data){
					if(data.code === 200){
						tipbar.errorTopTipbar($target,'密码重置成功!',1500,9999,function(){
							$('#modi_pwd_box').modal('hide');
							// $.post(common.getRootPath()+'/logout',{},function(data){},'json');
							// location.href = 'login.html';
						});
					}else{
						tipbar.errorTopTipbar($target,'重置失败,原因:'+data.message,3000,9999);
					}
				},'json');
			}else{
				tipbar.errorTopTipbar($target,'您还有选项未正确填写，请检查!',3000,9999);
			}
		},
		//返回
		backForward : function(data,event){
			$('#fix_operator_info_box').slideUp('fast');
			_personModule.reFreshoperList(_personModule.packageParams(currentData.cacheSearchtarget),false);
		},
		//重置信息
		reset : function(){
			currentData.operData = $.extend(true,{},currentData.initOperData);
			viewModel.operDataBind(currentData.operData);
		},

		/*数据格式化*/
		formatRuler : function(data){
			if(!data||data === '') return '----';
			var result = [];
			for(var index in data.split(',')){
				var temp =data.split(',')[index];
				if(BTDict.CustUserType.get(temp)){
					result.push(BTDict.CustUserType.get(temp));
				} 
			}
			return result.join('-');
		},
		//格式化状态
		formatStatus : function(data){
			if(!data||data === '') return '----';
			return BTDict.CustOperatorStatus.get(data);
		},
		//日期格式化
		formaterDate : function(data){
			if(!data) return;
			data+='';
			var newDate = '';
			newDate+=(data.substr(0,4)+'-'+data.substr(4,2)+'-'+data.substr(6));
			return newDate;
		},
		//证件类型格式化
		formaterIdenType : function(data){
			if(!data) return;
			return BTDict.PersonIdentType.get(data+'');
		}
		//分页事件
		// firstPage : function(){
		// 	currentData.operListPage.pageNum=1;
		// 	_personModule.reFreshoperList(_personModule.packageParams(currentData.cacheSearchtarget),false);
		// },
		// endPage : function(){
		// 	currentData.operListPage.pageNum=currentData.operListPage.pages;
		// 	_personModule.reFreshoperList(_personModule.packageParams(currentData.cacheSearchtarget),false);
		// },
		// prevPage : function(){
		// 	currentData.operListPage.pageNum--;
		// 	_personModule.reFreshoperList(_personModule.packageParams(currentData.cacheSearchtarget),false);
		// },
		// nextPage : function(){
		// 	currentData.operListPage.pageNum++;
		// 	_personModule.reFreshoperList(_personModule.packageParams(currentData.cacheSearchtarget),false);
		// },
		// skipPage : function(data,event){
		// 	var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
		// 	if(isNaN(pageNum)||pageNum.split('.').length>1||Number(pageNum)<1||Number(pageNum)>currentData.operListPage.pages){
		// 		$('#fund_list_page [name="skipToPageNum"]').val('');
		// 		tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000);
		// 		return;
		// 	}
		// 	currentData.operListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
		// 	$('#fund_list_page [name="skipToPageNum"]').val('');
		// 	_personModule.reFreshoperList(_personModule.packageParams(currentData.cacheSearchtarget),false);
		// }
	};

	//定义私有属性以及方法
	var _personModule = {
		//各步骤前置处理方法
		
		//刷新基金数据
		reFreshoperList : function(params,flag){
			//弹出弹幕加载状态
			loading.addLoading($('#search_info table'),common.getRootPath());
			$.post(common.getRootPath()+'/Platform/CustOperator/queryCustOperatorByPage',
				$.extend(currentData.operListPage,params),function(data){
					//关闭加载状态弹幕
					loading.removeLoading($('#search_info table'));
					viewModel.operListBind(common.cloneArrayDeep(data.data));
					if(flag){
						currentData.operListPage = data.page;
						viewModel.operListPageBind(data.page);
					}else{
						viewModel.operListPageBind(currentData.operListPage);
					}
					common.resizeIframe();
			},'json');
		},
		//初始化地址、银行、证件类型等信息
		initInfo: function(targetElement, dicData, defaultElement, textName, valueName) {
		    var text = textName || 'text',
		        value = valueName || 'value',
		        dicArray = dicData.toArray(value, text),
		        defaultHtml = defaultElement || '';
		    targetElement.html('').append(defaultHtml);
		    for (var i = 0; i < dicArray.length; i++) {
		        var tempDic = dicArray[i];
		        targetElement.append('<option value="' + tempDic[value] + '">' + tempDic[text] + '</option>');
		    }
		},
		//初始化复选框
		initCheckBox : function(targetElement, dicData,eleName,inputType, defaultElement, textName, valueName){
			var text = textName || 'text',
			    value = valueName || 'value',
			    dicArray = dicData.toArray(value, text),
			    defaultHtml = defaultElement || '';
			targetElement.html('').append(defaultHtml);
			for (var i = 0; i < dicArray.length; i++) {
			    var tempDic = dicArray[i];
			    targetElement.append('<span>'+tempDic[text]+'</span><input type="'+inputType+'" value="'+tempDic[value]+'" name="'+eleName+'" data-bind="checked:operDataBind().'+eleName+'">');
			}
		},
		//公用绑定函数
		checkNear: function(element, obj) {
		    var data_bind = element.attr('data-bind');
		    var valueBind = data_bind.split('hecked:')[1];
		    var keyBind = valueBind.split(',')[0];
		    var key = keyBind.split('.')[1];
		    if(element.is(':radio')){
		    	element[0].checked = true;
		    	currentData.operData[key] = element.val();
		    	return;
		    }
		    element[0].checked = !element[0].checked;
		    if (element[0].checked === true) {
		        currentData.operData[key].push(element.val());
		    } else {
		        var ruleList = [];
		        for (var i = 0; i < currentData.operData.ruleList.length; i++) {
		            var temp = currentData.operData.ruleList[i];
		            if (temp !== element.val()) {
		                ruleList.push(temp);
		            }
		        }
		        currentData.operData[key] = ruleList;
		    }
		},
		//参数组装
		packageParams : function(flag){
			var params = {
				name:'',                        //操作员姓名
				operCode:'',                     //操作员编码
				phone:'',                        //手机号码 
				status:''                       //1正常，2暂停业务，3注销 
			};
			if(flag&&flag!=='') params[flag] = $('#search_params').val();
			return params;
		}

		

	};


	/*表单验证*/
	validate.validate($('#fix_operator_info'), {
	    elements: [{
	        name: 'phone',
	        rules: [{
	            name: 'phone',
	            message: ''
	        }],
	        events: ['blur']
	    },{
	        name: 'faxNo',
	        rules: [{
	            name: 'fax',
	            message: ''
	        }],
	        events: ['blur']
	    },{
	        name: 'mobileNo',
	        rules: [{
	            name: 'mobile',
	            message: ''
	        }],
	        events: ['blur']
	    }],
	    errorPlacement: function(error, element) {
	        var label = element.parents('td').prev().text().substr(1);
	        tipbar.errorLeftTipbar(element, /*label +':'+ */error,0,9200);
	    }
	});

	validate.validate($('#modi_pwd_form'), {
	    elements: [{
	        name: 'newPasswd',
	        rules: [{
	            name: 'required',
	            message:'请填写新密码!'
	        }],
	        events: ['blur']
	    },{
	        name: 'okPasswd',
	        rules: [{
	            name: 'required',
	            message:'请填写确认密码!'
	        },{
	        	name:'repwd',
	        	params:{
	        		target:$('#modi_pwd_form [name="newPasswd"]')
	        	},
	        	message:'您输入的确认密码与新密码不一致，请检查！'
	        }],
	        events: ['blur']
	    }],
	    errorPlacement: function(error, element) {
	        tipbar.errorTipbar(element,error,0,9600);
	    }
	});

	
	_personModule.initCheckBox($('#rule_list_line'),BTDict.CustUserType,'ruleList','checkbox');
	_personModule.initCheckBox($('#status_list_line'),BTDict.CustOperatorStatus,'status','radio');

	ko.applyBindings(viewModel);

	//数据初始化
	_personModule.reFreshoperList(_personModule.packageParams(''),true);
	_personModule.initInfo($('[mapping="identity"]'), BTDict.PersonIdentType);
	//公共事件绑定
	$('#fix_operator_info').find('.double-check-sp').click(function(event) {
	    var dateName = $(this).parent().find('input').attr('dateName'),
	        dateData = $(this).parent().find('input').attr('dateData');
	    var that = $(this);
	    if (that.is('.active')) {
	        that.removeClass('active');
	        that.parent().find('input').val(new Date().getSubDate('YYYY', -5).format('YYYY-MM-DD'));
	        currentData[dateData][dateName] = new Date().getSubDate('YYYY', -5).format('YYYY-MM-DD');
	    } else {
	        that.addClass('active');
	        that.parent().find('input').val('2099-12-31');
	        currentData[dateData][dateName] = '2099-12-31';
	    }
	});

	$('#fix_operator_info input:checkbox:enabled,#fix_operator_info input:radio:enabled')
	    .prev('span').css('cursor', 'pointer').click(function() {
	        _personModule.checkNear($(this).next(), currentData.custInfo);
	 });

    $('#modi_pwd_box').on('hide',function(){
    	common.cleanPageTip();
    });

	//绑定placeholder
	placeholder.placeholder($('#search_params'));
});
});
});