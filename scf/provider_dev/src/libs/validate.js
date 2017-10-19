define(function(require,exports,module){
	//私有方法以及对象定义区
	var _tools = {
		isEmpty : function(element){
			return element.val()===''||element.val()===null||element.val()===undefined;
		},
		packageValidAttr : function(formJQ,options){
			var elements = options.elements,
			inputElements = formJQ.find(':input');
			inputElements.each(function(){
				//检测原有options是否已有该项检测
				var valid = $(this).attr('valid'),
				name = $(this).attr('name'),
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
	var _regRules = {
		required : function(element,params,message){
			//兼容IE8及以下的placeholder插件干扰
			if($.browser.msie&&(Number($.browser.version)<9)){
				if(element.attr('placeholder')&&(element.attr('placeholder')===element.val())){
					return !message||message === ''?'此项必须填写':message;
				}
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
			if(/^[1-9]\d+$/.test(element.val())){
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
		email : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(element.val())){
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
		zipcode : function(element,params,message){
			if(_tools.isEmpty(element)){
				return true;
			}
			if(/(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/.test(element.val())){
				return true;
			}else{
				return !message||message === ''?'请填写格式正确的邮编号码':message;
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
			//进行元素属性验证定义打包
			options = _tools.packageValidAttr(formJQ,options);
			//保存到全局暂存区
			validateCache[formJQ.attr('id')]=options;
			//进行验证规则配置
			for (var i = 0; i < options.elements.length; i++) {
				var tempElement = options.elements[i];
				var obj = formJQ.find('[name="'+tempElement.name+'"]');
				if(obj.length>0) obj.each(function(index){
					obj[index].tempElement = tempElement;
				});
				//验证条件事件群体绑定
				for (var j = 0; j < tempElement.events.length; j++) {
					var tempEvent = tempElement.events[j];
						obj.bind(tempEvent,function(){
							var tempElement = this.tempElement;
							//规则遍历处理
							for (var i = 0; i < tempElement.rules.length; i++) {
								var tempRule = tempElement.rules[i];
								var result = _regRules[tempRule.name]($(this),tempRule.params,tempRule.message);
								if(result!==true){
									options.errorPlacement(result,$(this));
									break;
								}
							}
						});
				}
			}
		}else if(arguments.length>0){
			var optionsRe = validateCache[formJQ.attr('id')];
			var noError = true;//无错误标志
			for (var k = 0; k < optionsRe.elements.length; k++) {
				var tempElementRe = optionsRe.elements[k];
				//判断无name属性元素并过滤
				if(!tempElementRe.name||tempElementRe.name === '') continue;
				var objRe = formJQ.find('[name="'+tempElementRe.name+'"]');
				//规则遍历处理
				for (var l = 0; l < tempElementRe.rules.length; l++) {
					var tempRule = tempElementRe.rules[l];
					var result = _regRules[tempRule.name](objRe,tempRule.params,tempRule.message);
					if(result!==true){
						optionsRe.errorPlacement(result,objRe);
						noError = false;
						break;
					}
					
				}
			}
			return noError;
		}
	};

	//清除表单验证事件绑定
	exports.cleanValidate = function(formJQ,nameList,eventsList,isAll){
		if(formJQ.is('form')&&isAll){
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
		}else if(formJQ.is('form')&&!isAll){
			for (var i = 0; i < nameList.length; i++) {
				var temp = nameList[i];
				if(eventsList===null||eventsList===undefined||eventsList[temp]===undefined||eventsList[temp]===null){
					formJQ.find('[name="'+temp+'"]').unbind();
				}else{
					for (var j = 0; j < eventsList[temp].length; j++) {
						var evntName = eventsList[temp][j];
						formJQ.find('[name="'+temp+'"]').unbind(evntName);
					}
				}
			}
		}
	};
});