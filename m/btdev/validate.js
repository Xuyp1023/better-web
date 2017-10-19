define(function(require,exports,module){
	//私有方法以及对象定义区
	var _tools = {
		isEmpty : function(element){
			return element.val()===''||element.val()===null||element.val()===undefined;
		},
		IdentityCodeValid:function(code) { 
            var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
            var tip = "";
            var pass= true;
            
            if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
                tip = "身份证号格式错误";
                pass = false;
            }
            
            else if(!city[code.substr(0,2)]){
                tip = "地址编码错误";
                pass = false;
            }
            else{
                //18位身份证需要验证最后一位校验位
                if(code.length == 18){
                    code = code.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                    //校验位
                    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++)
                    {
                        ai = code[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if(parity[sum % 11] != code[17]){
                        tip = "校验位错误";
                        pass =false;
                    }
                }
            }
            // if(!pass) alert(tip);
            return pass;
        },
		findObj : function(formJQ,name){
			var obj1 = formJQ.find('[ng-model="'+name+'"]'),
				obj2 = formJQ.find('[bt-date="'+name+'"]');
			return $.merge(obj1,obj2);
		},
		checkEleVisible : function($element){
			return $element.is(':visible');
		},
		packageValidAttr : function(formJQ,options){
			var elements = options.elements,
			inputElements = formJQ.find(':input');
			inputElements.each(function(){
				//检测原有options是否已有该项检测
				var valid = $(this).attr('valid'),
				name = $(this).attr('ng-model') || $(this).attr('bt-date'),
				isExists = false;
				if(valid&&valid !== ''){
					valid = JSON.parse(valid.replace(/'/g,'"'));
					for(var index in elements){
						var tempEle = elements[index];
						if(tempEle.name === name){
							isExists = true;
							var rules = tempEle.rules;
							for(var indexR in rules){
								var tempRule = rules[indexR];
								for(var indexV in valid){
									var tempValid =  valid[indexV];
									if(indexV === tempRule.name){
										delete valid[indexV];
									}
								}
							}
							//处理过滤后的valid对象
							for(var indexVa in valid){
								var tempVa = valid[indexVa];
								elements[index].rules.push({
									name : indexVa,
									message : tempVa === true ?'':tempVa
								});	
							}
						}
					}
					//如果不存在该项验证
					if(!isExists){
						//处理valid对象
						var newRules = [];
						for(var indexVal in valid){
							var tempVal = valid[indexVal];
							newRules.push({
								name : indexVal,
								message : tempVal === true ?'':tempVal
							});	
						}
						options.elements.push({
							name : name,
							rules : newRules,
							events : ['blur']
						});
					}
				}

			});
		return options;
		}
	};

	/*
	*  验证规则配置
	*/
	var _regRules = {
		//必填
		required : function(element,params,message){
			//兼容IE8及以下的placeholder插件干扰
			if($.browser.msie&&(Number($.browser.version)<9)){
				if(element.attr('placeholder')&&(element.attr('placeholder')===element.val())){
					return !message||message === ''?'此项必须填写':message;
				}
			}
			//处理option为空导致的取值错误问题
			if(element.is("select") && (element.val()+'').indexOf("?")!==-1){
				return !message||message === ''?'此项必须填写':message;
			}
			if(element.val()!==null&&element.val()!==''&&element.val()!==undefined){
				return true;
			}else{
				return !message||message === ''?'此项必须填写':message;
			}
		},
		int:function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(/^[1-9]\d*$/.test(element.val())){
				return true;
			}else{
				return !message||message === ''?'您输入的数值不正确':message;
			}
		},
		number:function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(/^\d+$/.test(element.val())){
				return true;
			}else{
				return !message||message === ''?'您输入的数值不合法':message;
			}
		},
		repwd : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(!_tools.isEmpty(params.target)&&(params.target.val()===element.val())){
				return true;
			}else{
				return !message||message === ''?'请保持密码与确认密码的一致性':message;
			}
		},
		repin : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(!_tools.isEmpty($(params.target))&&($(params.target).val()===element.val())){
				return true;
			}else{
				return !message||message === ''?'请保持密码与确认密码的一致性':message;
			}
		},
		//最小值
		min : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(isNaN(element.val())||(!isNaN(element.val())&&!isNaN(params.min)&&Number(element.val())>=Number(params.min))){
				return true;
			}else{
				return !message||message === ''?'此项可填写的数值不低于'+params.min:message;
			}
		},
		//最小长度
		strmin : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(element.val().length>=params.strmin){
				return true;
			}else{
				return !message||message === ''?'此项可填写的长度必须大于或等于'+params.strmin:message;
			}
		},
		//最大值
		max : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(isNaN(element.val())||(!isNaN(element.val())&&!isNaN(params.max)&&Number(element.val())<=Number(params.max))){
				return true;
			}else{
				return !message||message === ''?'此项可填写的数值不高于'+params.max:message;
			}
		},
		//最大长度
		strmax : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(element.val().length<=params.strmax){
				return true;
			}else{
				return !message||message === ''?'此项可填写的长度必须小于或等于'+params.max:message;
			}
		},
		//金额 正数且小数点后保留两位
		money : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(/^([1-9]\d+\.?(\d{1,2})?)$|^([0-9]\.?(\d{1,2})?)$/.test(element.val())){
				return true;
			}else{
				return !message||message === ''?'请填写正确的数值(例如8888888.88,正数且小数点后保留两位)':message;
			}
		},
		//非零
		nozero: function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(element.val()*1!==0){
				return true;
			}else{
				return !message||message === ''?'此项不能为零':message;
			}
		},
		//浮点数|小数  支持1-2位小数
		float : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(/^([1-9]\d+\.?(\d{1,2})?)$|^([0-9]\.?(\d{1,2})?)$/.test(element.val())){
				return true;
			}else{
				return !message||message === ''?'请填写正确的数值':message;
			}
		},
		//邮箱
		email : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			// if(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(element.val())){
			if(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(element.val())){
				return true;
			}else{
				return !message||message === ''?'请填写格式正确的邮箱':message;
			}
		},
		mobile : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(element.val())){
				return true;
			}else{
				return !message||message === ''?'请填写格式正确的手机号码':message;
			}
		},
		phone : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(/^((\d{3,4}-)?\d{7,8})$|^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(element.val())){
				return true;
			}else{
				return !message||message === ''?'请填写格式正确的电话号码':message;
			}
		},
		//传真号码
		fax : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(/(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/.test(element.val())){
				return true;
			}else{
				return !message||message === ''?'请填写格式正确的传真号码':message;
			}
		},
		//邮编
		zipcode : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(/^[1-9][0-9]{5}$/.test(element.val())){
				return true;
			}else{
				return !message||message === ''?'请填写格式正确的邮编号码':message;
			}
		},
		corpCode : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(/^[0-9A-Z\-]{9}[0-9A-Z]{1}$/.test(element.val())){
				return true;
			}else{
				return !message||message === ''?'机构代码应由大写字母、数字、-组成,合规示例:888A88C8-8':message;
			}
		},
		identNo : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(_tools.IdentityCodeValid(element.val())){
				return true;
			}else{
				return !message||message === ''?'请填写格式正确的身份证号码':message;
			}
		},
		name : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(/^[\u4E00-\u9FA5a-zA-Z\s]+$/.test(element.val())){
				return true;
			}else{
				return !message||message === ''?'请填写格式正确的姓名':message;
			}
		},
		minlength : function(element,params,message){
			
		}
	};

	//全局变量定义区
	window.validateCache = {};//验证规则缓存

	//表单验证框架
	exports.validate = function(formJQ,options){
		if(arguments.length>1){
			//阻止重复校验
			if(formJQ.attr('isOnValid') === 'true'){
				return;
			}else{
				formJQ.attr('isOnValid','true');
			}
			//进行元素属性验证定义打包
			options = _tools.packageValidAttr(formJQ,options);
			//保存到全局暂存区
			var cacheFlag = 'valid'+Date.now();
			formJQ.attr('cacheFlag',cacheFlag);
			validateCache[cacheFlag]=options;
			//进行验证规则配置
			for (var i = 0; i < options.elements.length; i++) {
				var tempElement = options.elements[i];
				var obj = _tools.findObj(formJQ,tempElement.name);
				if(obj.length>0) obj.each(function(index){
					obj[index].tempElement = tempElement;
				});
				//验证条件事件群体绑定
				for (var j = 0; j < tempElement.events.length; j++) {
					var tempEvent = tempElement.events[j];
						obj.bind(tempEvent,function(){
							//不可见元素拒绝触发
							var isVisible = _tools.checkEleVisible($(this));
							if(!isVisible) return;

							var tempElement = this.tempElement,
								isAllPass = true;
							//规则遍历处理
							for (var i = 0; i < tempElement.rules.length; i++) {
								var tempRule = tempElement.rules[i];
								var result = _regRules[tempRule.name]($(this),tempRule.params,tempRule.message);
								if(result!==true){
									isAllPass = false;
									options.errorPlacement(result,$(this));
									break;
								}
							}

							//验证通过，处理各类提示框删除
							//td内气泡
							if($(this).is('[mainTdTipFlag]')&&isAllPass){
								$('[popTdTipFlag='+$(this).attr('mainTdTipFlag')+']').remove();
								$(this).removeAttr('mainTdTipFlag');
							}
							

						});
				}
			}
		}else if(arguments.length>0){
			var cacheFlag = formJQ.attr('cacheFlag');
			var optionsRe = validateCache[cacheFlag];
			var noError = true;//无错误标志
			for (var k = 0; k < optionsRe.elements.length; k++) {
				var tempElementRe = optionsRe.elements[k];
				//判断无name属性元素并过滤
				if(!tempElementRe.name||tempElementRe.name === '') continue;
				var objRe = _tools.findObj(formJQ,tempElementRe.name);

				//不可见元素拒绝触发
				var isVisible = _tools.checkEleVisible(objRe);
				if(!isVisible) continue;

				//规则遍历处理
				var isAllPass = true;
				for (var l = 0; l < tempElementRe.rules.length; l++) {
					var tempRule = tempElementRe.rules[l];
					var result = _regRules[tempRule.name](objRe,tempRule.params,tempRule.message);
					if(result!==true){
						isAllPass = false;
						optionsRe.errorPlacement(result,objRe);
						noError = false;
						break;
					}
					
				}
				//验证通过，处理各类提示框删除
				//td内气泡
				if(objRe.is('[mainTdTipFlag]')&&isAllPass){
					$('[popTdTipFlag='+objRe.attr('mainTdTipFlag')+']').remove();
					objRe.removeAttr('mainTdTipFlag');
				}


			}
			return noError;
		}
	};

	//清除表单验证事件绑定
	exports.cleanValidate = function(formJQ,nameList,eventsList,isAll){
		if(isAll){
			formJQ.find(':input').each(function(){
				if(eventsList===null||eventsList===undefined){
					$(this).unbind();
				}else{
					for (var j = 0; j < eventsList.length; j++) {
						var evntName = eventsList[j];
						$(this).unbind(evntName);
					}
				}
			});
		}else{
			for (var i = 0; i < nameList.length; i++) {
				var temp = nameList[i];
				if(eventsList===null||eventsList===undefined||eventsList[temp]===undefined||eventsList[temp]===null){
					_tools.findObj(formJQ,temp).unbind();
				}else{
					for (var j = 0; j < eventsList[temp].length; j++) {
						var evntName = eventsList[temp][j];
						_tools.findObj(formJQ,temp).unbind(evntName);
					}
				}
			}
		}
	};
});