define(function(require,exports,module){
	var tipbar = require("m/sea_modules/tooltip");
	var dialog = require('m/sea_modules/dialog');
	//内部变量及方法
	var _commonModel = {
		token : '',
		//设置文件头
		setAjaxHeader : function(token){
			$.ajaxSetup({
				beforeSend:function(xhr){
					xhr.setRequestHeader("token",token);
				}
			});
		},
		//获取token并设置
		getRemoteToken : function(){
			$.ajax({
				url:exports.getRootPath()+'/p/testdata/testToken.json',
				type:'post',
				dataType:'json',
				async:false,
				success:function(data){
					_commonModel.setAjaxHeader(data.token);
				}
			});
		}
	};

	exports.isNoEmptyArray = function(data){
		return (typeof data === 'object')&&(data instanceof Array)&&(data.length>0);
	};

	//获取当前项目地址URL
	exports.getRootPath = function(){//js获取项目根路径，如： http://localhost:8083/uimcardprj
		    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
		    var curWwwPath=window.document.location.href;
		    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
		    var pathName=window.document.location.pathname;
		    var pos=curWwwPath.indexOf(pathName);
		    //获取主机地址，如： http://localhost:8083
		    var localhostPaht=curWwwPath.substring(0,pos);
		    //获取带"/"的项目名，如：/uimcardprj
		    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
		    //兼容BFS代理路径
		    var BFSPath = location.href.indexOf('qiejf') === -1?'/better':'';
		    // if(window.parent&&window.parent.pathFlag&&window.parent.pathFlag.isBFS === true){
		    // 	BFSPath += '/'+window.parent.pathFlag.path;
		    // }
		    return(localhostPaht+projectName+BFSPath);
		};
	//获取BFS项目URL
	exports.getBFSRootPath = function(){//js获取项目根路径，如： http://localhost:8083/uimcardprj
		    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
		    var curWwwPath=window.document.location.href;
		    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
		    var pathName=window.document.location.pathname;
		    var pos=curWwwPath.indexOf(pathName);
		    //获取主机地址，如： http://localhost:8083
		    var localhostPaht=curWwwPath.substring(0,pos);
		    //获取带"/"的项目名，如：/uimcardprj
		    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
		    //兼容BFS代理路径
		    var BFSPath = location.href.indexOf('qiejf') === -1?'/fund':'';
		    // if(window.parent&&window.parent.pathFlag&&window.parent.pathFlag.isBFS === true){
		    // 	BFSPath += '/'+window.parent.pathFlag.path;
		    // }
		    return(localhostPaht+projectName);

	};

	//判断是否为BFS
	exports.isBFS = function(){
		if(location.href.indexOf('qiejf.com') !== -1){
			return false;
		}
		return true;
	};

	//数组截断
	exports.splitArray = function(preArray,splitNum){
			var targetArrayList = [];
			for (var i = 0; i < preArray.length;) {
				var temp = preArray.slice(i,i+splitNum);
				targetArrayList.push(temp);
				i+=splitNum;
			}
			return targetArrayList;
		};

	//数组深度克隆
	exports.cloneArrayDeep = function(preArray){
			var targetArray = [];
			for (var i = 0; i < preArray.length; i++) {
				var item = preArray[i];
				if(item instanceof Array){
					item = arguments.callee(item);
				}else if(item instanceof Object){
					item = $.extend(true,{},item);
				}
				targetArray.push(item);
			}
			return targetArray;
	};

	//组装checkBox的值
	exports.pakageCheckBoxValue = function(checkBoxList){
		var valueArray = {};
		checkBoxList.each(function(index){
			valueArray[index] = this.checked;
		});
		return valueArray;
	};

	//填充checkBox的值
	exports.setCheckBoxValue = function(checkBoxList,valueArray){
		checkBoxList.each(function(index){
			this.checked = valueArray[index];
		});
	};

	//为未选中的单选框添加虚化样式
	exports.setUncheckCss = function(checkBoxList){
		checkBoxList.prev('span').removeClass('unchecked')
		.end()
		.filter(':not(:checked)')
		.prev('span')
		.addClass('unchecked');
	};

	//为所有的单、复选框设置文字联动选中
	exports.setUnionCheck = function(checkBoxList){
		checkBoxList.filter(':not(.right-text-checkbox)')
		.prev('span')
		.css('cursor','pointer')
		.click(function(){
			$(this).next(':checkbox')[0].checked = !($(this).next(':checkbox')[0].checked);
		});
		checkBoxList.filter('.right-text-checkbox')
		.next('span')
		.css('cursor','pointer')
		.click(function(){
			$(this).prev(':checkbox')[0].checked = !($(this).prev(':checkbox')[0].checked);
		});
	};

	//数组中对象批处理加值
	exports.addKey4ArrayObj = function(array,keyName,defaultValue){
		var targetArray = [];
		for (var i = 0; i < array.length; i++) {
			var temp = array[i];
			temp[keyName] = defaultValue;
			targetArray.push(temp);
		}
		return targetArray;
	};

	//UI处理:重新调节父iframe
	exports.resizeIframe = function(speed){
		var height = $(document).find('body').outerHeight()+20,
		content_iframe = $(window.parent.document).find('#content_iframe');
		if(height<content_iframe.height()) return;
		toHeight = height-content_iframe.height()>0?'+='+(height-content_iframe.height()):'-='+(content_iframe.height()-height);
		content_iframe.animate({
			height:toHeight+'px'
		},speed||1500);
	};

	/**
	*数据格式化区块
	*/
	//格式化日期
	exports.formaterDate = function(data){
		if(data.split('-').length>1) return data;
		data+='';
		var newDate = '';
		newDate+=(data.substr(0,4)+'-'+data.substr(4,2)+'-'+data.substr(6));
		return newDate;
	};

	//4位小数点格式化
	exports.formaterPoint4 = function(data){
		return Number(data).toFixed(4);
	};

	//2位小数点格式化
	exports.formaterPoint2 = function(data){
		return Number(data).toFixed(2);
	};

	//数字千位符格式化
	exports.formaterThounthand = function(data,placeholder){
		data = Number(data).toFixed(placeholder||2)+'';
		var dataStrArr = data.split('.');
		data = dataStrArr[0];
		var dataStrUNPlus = '';
		if(data.substr(0,1)==='-'){
			dataStrUNPlus = data.substr(0,1);
			data = data.substr(1);
		}
		var tempEnd = dataStrArr[1]||'',
		tempResultArr = [];
		for(var i=data.length;i>-3;){
			if(data.length<=3){
				tempResultArr.push(data);
				break;
			}
			i-=3;
			tempResultArr.push(data.substr(i,3));
			if(i<=3&&i>0){
				tempResultArr.push(data.substr(0,i));
				break;
			}
		}
		return dataStrUNPlus+tempResultArr.reverse().join(',')+'.'+tempEnd;
	};

	//百分号格式化
	exports.formaterPercent = function(data){
		return data+'%';
	};

	//序列化单层对象为标准查询字符串
	exports.serializeSingleObject = function(object){
		var paramStr = '';
		var num = 0;
		for(var index in object){
			var temp = object[index];
			if(typeof(temp) === 'object'&&temp instanceof Array){
				temp = temp.join(',');
			}
			if(typeof(temp) !== 'function'||typeof(temp) !== 'object'){
				if(num === 0){
					paramStr+=(index+'='+temp);
					num++;
				}else{
					paramStr+=('&'+index+'='+temp);
				}
			}
		}
		return paramStr;
	};

	//判断对象是否没有任何Own属性和方法
	exports.isEmptyObject = function(object){
		var isEmpty = true;
		for(var index in object){
			isEmpty = false;
		}
		return isEmpty;
	};
	//格式化json各类对象为无法被过滤字段
	exports.formaterJsonUglify = function(object){
		return JSON.stringify(object)
		.replace(/\{/g,'$left_quote$')
		.replace(/\}/g,'$right_quote$')
		.replace(/"/g,'$double_quote$')
		.replace(/:/g,'=')
		.replace(/\[/g,'$left_middle_quote$')
		.replace(/\]/g,'$right_middle_quote$');
	};

	//组装格式化的json各类对象字符串
	exports.packageJsonFromUglify = function(dataStr){
		dataStr = dataStr.replace(/\$left_quote\$/g,'{')
		.replace(/\$right_quote\$/g,'}')
		.replace(/\$double_quote\$/g,'"')
		.replace(/=/g,':')
		.replace(/\$left_middle_quote\$/,'[')
		.replace(/\$right_middle_quote\$/,']');
		return JSON.parse(dataStr);
	};

	//获取日期信息
	exports.getToday = function(){
		return new Date();
	};
	exports.getCurrentDate = function(){
		var today = new Date();
		return today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	};
	//当月拥有天数
	exports.getMonthDay = function(year,month){
		var d = new Date(year,month,0);
		return d.getDate();
	};

	//删除所有提示框
	exports.cleanPageTip = function(){
		$('[mapping="tipbar"]').remove();
	};

	//查询条件判断
	exports.isCurrentData = function(data){
		return (data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200);
	};

	//编辑条件判断
	exports.isCurrentResponse = function(data){
		return data&&(data.code === 200);
	};


	/*js原生对象扩展*/
	//Date对象拓展
	$.extend(Date.prototype,{
		//日期格式化
		format : function(formatStr){
			formatStr = formatStr||'YYYY-MM-DD HH:mm:SS';
			var FullYearIndex = formatStr.indexOf('YYYY'),
			monthIndex = formatStr.indexOf('MM'),
			dayIndex = formatStr.indexOf('DD'),
			hourIndex = formatStr.indexOf('HH'),
			miniteIndex = formatStr.indexOf('mm'),
			secondIndex = formatStr.indexOf('SS');
			if(FullYearIndex!== -1){
				formatStr = formatStr.replace('YYYY',this.getFullYear()+'');
			}
			if(monthIndex!== -1){
				var thisMonth = this.getMonth()<9?'0'+(this.getMonth()+1):(this.getMonth()+1)+'';
				formatStr = formatStr.replace('MM',thisMonth);
			}
			if(dayIndex !== -1){
				var thisDay = this.getDate()<10?'0'+(this.getDate()):(this.getDate())+'';
				formatStr = formatStr.replace('DD',thisDay);
			}
			if(hourIndex !== -1){
				var thisHours = this.getHours()<10?'0'+(this.getHours()):(this.getHours())+'';
				formatStr = formatStr.replace('HH',thisHours);
			}
			if(miniteIndex !== -1){
				var thisMinites = this.getMinutes()<10?'0'+(this.getMinutes()):(this.getMinutes())+'';
				formatStr = formatStr.replace('mm',thisMinites);
			}
			if(secondIndex !== -1){
				var thisSecond = this.getSeconds()<10?'0'+(this.getSeconds()):(this.getSeconds())+'';
				formatStr = formatStr.replace('SS',thisSecond);
			}
			return formatStr;
		},
		//日期前驱范围计算
		getSubDate : function(flag,subNum){
			var FullYearNum = this.getFullYear(),
			monthNum = this.getMonth(),
			dayNum = this.getDate(),
			thisMonthAllDays = new Date(this.getFullYear(),this.getMonth(),0).getDate(),
			prevMonthAllDays = new Date(this.getFullYear(),this.getMonth()-1,0).getDate();
			if(flag === 'YYYY'){
				FullYearNum-=subNum;
			}
			if(flag === 'MM'){
				monthNum -= subNum;
				if(monthNum===0){
					FullYearNum-=1;
				}else if(monthNum<0){
					monthNum+=11;
					FullYearNum-=1;
				}
				if(dayNum>new Date(FullYearNum,monthNum+1,0).getDate()){
					dayNum = new Date(FullYearNum,monthNum+1,0).getDate();
				}
			}
			if(flag === 'DD'){
				dayNum-=subNum;
				if(dayNum===0){
					dayNum = prevMonthAllDays;
					monthNum-=1;
				}else if(dayNum<0){
					dayNum = prevMonthAllDays+dayNum;
					monthNum-=1;
				}
				if(monthNum===0){
					FullYearNum-=1;
				}else if(monthNum<0){
					monthNum+=11;
					FullYearNum-=1;
				}
			}
			return new Date(FullYearNum,monthNum,dayNum);
		},
		//获取当月拥有天数
		getMonthDay : function(){
			return new Date(this.getFullYear(),this.getMonth()+1,0).getDate();
		}
	});

	//Array对象拓展,避免遍历问题，不采用原生拓展
	window.ArrayPlus = function(obj){
		return $.extend(obj,{
		//过滤数组中子元素
		objectChildFilter : function(queryKey,queryValue){
			var resultArray = [];
			for(var index in this){
				var tempItem = this[index];
				if(tempItem[queryKey]&&(tempItem[queryKey]+'').indexOf(queryValue+'')!==-1){
					resultArray.push(tempItem);
				}
			}
			return resultArray;
		},
		//子元素对象中新增属性
		addKey4ArrayObj : function(keyName,defaultValue){
				var targetArray = [];
				for (var i = 0; i < this.length; i++) {
					var temp = this[i];
					temp[keyName] = defaultValue;
					targetArray.push(temp);
				}
				return targetArray;
		},
		//数组截断
		splitBy : function(splitNum){
				var targetArrayList = [];
				for (var i = 0; i < this.length;) {
					var temp = this.slice(i,i+splitNum);
					targetArrayList.push(temp);
					i+=splitNum;
				}
				return targetArrayList;
		}
		});
	};


	//公用全局方法或者属性以及初始化
	//token处理
	_commonModel.getRemoteToken();
	window.setInterval(function(){
		_commonModel.getRemoteToken();
	},600000);
	//视框自动调节大小
	$('.nav-tabs').on('shown',function(){
		exports.resizeIframe();
		exports.cleanPageTip();
	});
	//AJAX信息全局操作
	$.ajaxSetup({
		error : function(jqXHR, textStatus, errorMsg){
			// if(console) console.log(arguments);
			// if($(window.parent.document).find('[mapping="alert-alert-error-alert-block"]').length<1){
			// 	tipbar.infoTopTipbar('连接服务器端失败，请检查网络是否正确连接或联系客服人员！',{
			// 		msg_box_cls : 'alert alert-error alert-block',
			// 		during:3000
			// 	});
			// }
			if(jqXHR.status === 401){

				if(window.dialogWarning){
					window.dialogWarning('登录超时，请重新登录!');
				}else{
					window.parent.dialogWarning('登录超时，请重新登录!');
				}

				// dialog.alert('您还未登录或已退出登录，请先执行登录操作!',function(){
				// 	var path = window.parent.location.href.split('/');
				// 	path.pop();
				// 	if(!exports.isBFS()) window.parent.location.replace(path.join('/')+'/login.html');
				// });
			}
		
		},
		complete : function(data){
			var resp = data.responseText;
			try{
				var respData = JSON.parse(resp);
				if(respData.code === 401){
					dialog.alert('您还未登录或已退出登录，请先执行登录操作!',function(){
						var path = window.parent.location.href.split('/');
						path.pop();
						if(!exports.isBFS()) window.parent.location.replace(path.join('/')+'/login.html');
					});
				}
			}catch(e){

			}
		}
	});
});
