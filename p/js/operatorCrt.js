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
			revokeBusin :'',
			operCode:'',   
			defOper :'' ,        
			contactorSerial :'', 
			ruleList :[] 
		}
	};

	//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
	window.viewModel = {
		//属性绑定监控
		operDataBind : ko.observable(currentData.operData),
		//事件绑定
		setDateInfo : function(data,event){
			WdatePicker({startDate:'%y-%M-%d',dateFmt:'yyyy-MM-dd',readOnly:true});
		},
		changeDateInfo : function(data,event){
			var dateName = $(event.target).attr('dateName'),
			dateData = $(event.target).attr('dateData');
			currentData[dateData][dateName] = event.target.value;
		},
		//新增操作员
		addOper : function(data,event){
			//表单校验
			var resultFormValid = validate.validate($('#fix_operator_info')),
			target = $(event.target||event.srcElement);
			if (!resultFormValid) {
			    tipbar.errorTipbar(target, '有待填项还未正确填写,请检查!');
			    return false;
			}
			if($('#rule_list_line input:checked').length<1){
				tipbar.errorTipbar(target, '还未为用户分配角色!');
				return false;
			}
			$.post(common.getRootPath()+'/custOperator/saveCustOperator',common.serializeSingleObject(currentData.operData),
				function(data){
					if(data.code === 200){
						tipbar.errorTopTipbar($(target),'新增操作员成功,请进入操作员管理查看或继续新增！');
					}else{
						tipbar.errorTopTipbar($(target),'新增操作员失败,返回信息:'+data.message);
					}
				},'json');
		},
		//重置信息
		reset : function(){
			currentData.operData = $.extend(true,{},currentData.initOperData);
			viewModel.operDataBind(currentData.operData);
		}
	};

	//定义私有属性以及方法
	var _personModule = {
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
		initCheckBox : function(targetElement, dicData, defaultElement, textName, valueName){
			var text = textName || 'text',
			    value = valueName || 'value',
			    dicArray = dicData.toArray(value, text),
			    defaultHtml = defaultElement || '';
			targetElement.html('').append(defaultHtml);
			for (var i = 0; i < dicArray.length; i++) {
			    var tempDic = dicArray[i];
			    targetElement.append('<span>'+tempDic[text]+'</span><input type="checkbox" value="'+tempDic[value]+'" name="ruleList" data-bind="checked:operDataBind().ruleList">');
			}
		},
		//公用绑定函数
		checkNear: function(element, obj) {
		    var data_bind = element.attr('data-bind');
		    var valueBind = data_bind.split('hecked:')[1];
		    var keyBind = valueBind.split(',')[0];
		    var key = keyBind.split('.')[1];
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
	    },{
	        name: 'repassword',
	        rules: [{
	            name: 'repwd',
	            params:{
	            	target:$('#fix_operator_info [name="password"]')
	            },
	            message: '请保持确认密码和用户密码一致!'
	        }],
	        events: ['blur']
	    }],
	    errorPlacement: function(error, element) {
	        var label = element.parents('td').prev().text().substr(1);
	        tipbar.errorLeftTipbar(element,/* label +':'+ */error);
	    }
	});
	

	_personModule.initCheckBox($('#rule_list_line'),BTDict.CustUserType);


	ko.applyBindings(viewModel);

	//数据初始化
	_personModule.initInfo($('[mapping="identity"]'), BTDict.PersonIdentType);
	//缓存初始化状态
	currentData.initOperData = $.extend(true,{},currentData.operData);
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
});
});
});