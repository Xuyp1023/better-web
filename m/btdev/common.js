/**
*项目内公用组件
*作者:bhg
*/
define(function(require,exports,module){
	var tipbar = require("./tooltip");
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
	//弹出框
	exports.popModal=function(ele){
		var instance;    		

        return {        	
        	show:function(data,success,error){
        			var poptop=$('#'+ele).offset().top-243+'px';
        			var popleft=$('#'+ele).offset().left-200+'px';
        			this.title='拒绝签署';       
		        	 // defer = $q.defer(),
		        	this.html='<div class="pop-modal">'+
			                        '<div class="container">'+
			                            '<h4 class="head">'+this.title+'</h4>'+
			                            '<div class="content">'+
			                            	'<textarea style="width:260px" rows="5" placeholder="请填写拒绝签署的原因" id="textarea"></textarea>'+	
			                            '</div>'+
			                            '<span id="spanName">还可以输入200字</span>'+
			                            '<div class="btn-block" style="margin-left:-654px">'+
			                                '<button class="btn-submit">提交</button>'+
			                                '<button class="btn-reject">取消</button>'+
			                            '</div>'+
			                        '</div>'+
	                    		'</div>' 

                    var _this=this;
                    if(instance){
                        this.destroy();
                    }
                    $(this.html).appendTo($('#content'));
                    $('.pop-modal').css({top:poptop,left:popleft});                     		
                    instance=this;
                    $('.pop-modal .btn-reject').on('click',function(){
                        _this.hide();
                        error();
                         // return defer.reject();
                    })

                    $('.pop-modal .btn-submit').on('click',function(){                    	
                         _this.hide();
                         success();
                    })

                    $('#textarea').on('keyup',function(){
                    	var counter=200-$('#textarea').val().length;
                    	
                    	$('#spanName').html('你还可以输入'+counter+'字'); 
                    })
                    
            },

           destroy:function(){
                instance=null;
                $('.pop-modal .btn-reject').off('click');
                $('.pop-modal .btn-submit').off('click');
                $('.pop-modal').remove();
           },
           hide:function(){
                this.destroy();
           }                

        }
	} 
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

	//合并对象数组
	exports.extendObjectArray = function(arrayOld,arrayNew,config){
		var _config = {
			oldKeyName:'id',
			newKeyName:'id',
			oldKeyNameTwo:false,
			newKeyNameTwo:false
		};
		_config = $.extend(_config,config||{});
		var targetArray = [];
		for (var i = 0; i < arrayOld.length; i++) {
			var tempOld = arrayOld[i];
			for (var j = 0; j < arrayNew.length; j++) {
				var tempNew = arrayNew[j];
				if(tempNew[_config.newKeyName]+'' === tempOld[_config.oldKeyName]+''){
					if(!_config.oldKeyNameTwo||!_config.newKeyNameTwo){
						tempOld = $.extend(true,tempOld,tempNew);
					}else if((tempNew[_config.newKeyName]+'' === tempOld[_config.oldKeyName]+'')&&(tempNew[_config.newKeyNameTwo]+'' === tempOld[_config.oldKeyNameTwo]+'')){
						tempOld = $.extend(true,tempOld,tempNew);
					}

				}
			}
			targetArray.push(tempOld);
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

	//提取多层对象数组为单层
	exports.extractMultipleObjectArray = function(objectArray){
		var targetArray = [];
		for (var i = 0; i < objectArray.length; i++) {
			var temp = objectArray[i];
			if((typeof temp === 'object')&&(temp instanceof Array)){
				targetArray = targetArray.concat(arguments.callee(temp));
			}else if(typeof temp === 'object'){
				targetArray.push(temp);
			}
		}
		return targetArray;
	};


	//移除行内样式的高度
	exports.removeHeight = function($target){
		var sheetStr = $target.attr("style");
		if(!sheetStr) return;
		var begin = sheetStr.indexOf("height"),
		 	end = sheetStr.indexOf(";",begin);
		if(begin!=-1){
			var interStr = sheetStr.substring(begin,end+1),
				result = sheetStr.replace(interStr,'');
			$target.attr("style",result);
		}
	};

	exports.resizeIframeListener = function(){
		//初始值(存储请求次数)
		window.resizeTimes = window.resizeTimes || 0 ;
		window.resizeTimes ++ ;
		//只在第一次请求执行resizeIframe方法
		if(resizeTimes==1){
			// console.log("resize queue begin!");
			exports.resizeIframe();
		} 
	};

	//UI处理:重新调节父iframe
	exports.resizeIframe = function(speed){
		// console.log("resize action : " + resizeTimes);
		var height = $(document).find('body').outerHeight()+20,
		content_iframe = $(window.parent.document).find('#content_iframe');
		//	当前活跃弹出框高度
		$(document).find('.top-box-active').each(function(){
			//移除行内height，获取box真实高度
			exports.removeHeight($(this));
			if($(this).height()>height){
				height = $(this).height();
			}else{
				//为 active-box 设置高度与body一致
				$(this).height(height);
			}
		});

		var toHeight = height-content_iframe.height()>0?'+='+(height-content_iframe.height()):'-='+(content_iframe.height()-height);
		// console.log("toHeight:" + toHeight);
		//调节高度为0
		if(toHeight.split("=")[1]==="0"){
			window.resizeTimes -- ;
			if(window.resizeTimes > 0){
				exports.resizeIframe();
			}
			return;
		}
		content_iframe.stop().animate({
			height:toHeight+'px'
		},speed||1000,function(){
			window.resizeTimes -- ;
			if(window.resizeTimes > 0){
				exports.resizeIframe();
			}
		});
	};

	//UI处理:重新调节父iframe
	exports.resizeIframeOld = function(speed){
		//执行完毕，清除定时器
		if(window.timer && window.resizeTimes<=0){
			clearInterval(window.timer);
			window.timer = undefined;
			return;
		}
		window.resizeTimes -- ;

		var height = $(document).find('body').outerHeight()+100,
		content_iframe = $(window.parent.document).find('#content_iframe');
		//弹出框高度处理
		$(document).find('.top-box').each(function(){
			if($(this).height()>height){
				height = $(this).height();
			}
		});
		if(height<content_iframe.height()){
			return;
		}
		toHeight = height-content_iframe.height()>0?'+='+(height-content_iframe.height()):'-='+(content_iframe.height()-height);
		window.isIframeResizing = true;
		content_iframe.animate({
			height:toHeight+'px'
		},speed||1000,function(){
			window.isIframeResizing = false;
		});
	};

	//伸缩模板内显隐模板高度调节
	exports.resizeTopBox = function($ele){
		var resizeMap = 'resize'+Date.now(),
			$topBox = $ele.parents('.top-box'),
			outerHeight = $ele.outerHeight();
			resizeFlag = $ele.attr('resizeFlag')||false;
		if(!resizeFlag){
			$topBox.height($topBox.height()+outerHeight);
			exports.resizeIframe();
			$ele.attr('resizeFlag',resizeMap);
		}

	};

	//数组首值为空过滤
	exports.filterArrayFirst = function(array,keyName,defaultValue){
		keyName = keyName||'value';
		defaultValue = defaultValue||'';
		return array.length>0?array[0][keyName]:defaultValue;
	};
	//将2个相同长度的数组连接在一起(提交到后台)
	exports.connectArray = function(arr1,arr2){
		var arr=[];
		for(var i=0;i<arr1.length;i++){
			arr.push(arr1[i]+'-'+arr2[i]);
		}
		return arr;
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
		$('[istipshow="0"]').attr('istipshow','1');

		//清除td气泡
		$('[mainTdTipFlag]').each(function(){
			$('[popTdTipFlag='+$(this).attr('mainTdTipFlag')+']').remove();
			$(this).removeAttr('mainTdTipFlag');
		});
	};

	//拼接select
	exports.concatSelect = function(targetElement,dicData,defaultElement,textName,valueName){
			var text = textName || 'name',
			value =  valueName || 'value',
			dicArray = dicData,
			defaultHtml = defaultElement||'';
			targetElement.html('').append(defaultHtml);
			for (var i = 0; i < dicArray.length; i++) {
				var tempDic = dicArray[i];
				targetElement.append('<option value="'+tempDic[value]+'">'+tempDic[text]+'</option>');
			}
	};

	//锚点跳跃
	exports.ancSkip = function(anchor){
		location.href = location.href.split('#')[0]+'#'+anchor;
	};

	//页面跳跃到指定元素
	exports.pageSkip = function($elemnt,time) {
	  var scroll_offset = $elemnt.offset(),//得到该元素的offset，包含两个值，top和left
	  $parent = $(window.frames.parent.document),
	  parent_scroll = $parent.find('#content').offset() || {};
	  $parent.find("body,html").animate({
   		scrollTop:scroll_offset.top+parent_scroll.top  //让body的scrollTop等于pos的top，实现了滚动
	   },time||500);
	};
	// 获取当月第一天方法
	exports.getFirstDay = function(){
		var date=new Date();
		date.setDate(1);
		return date;
	}
	
	// 获取当月最后一天的方法
	exports.getLastDay = function(){
		var date=new Date();
		 var currentMonth=date.getMonth();
		 var nextMonth=++currentMonth;
		 var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
		 var oneDay=1000*60*60*24;		 
		 date.setDate(new Date(nextMonthFirstDay-oneDay).getDate());
		 return date;
	}

	/*js原生对象扩展*/
	//Date对象拓展
	if(!Date.now){
		Date.now = function(){
			return new Date().getTime();
		};
	}
	// jquery方法扩展
	$.fn.highLight = function(options) {
		var defaults = {
			backgroundColor: '#fffceb',
			color: '#d85030'
		}
		var opts = $.extend({},defaults,options);

		this.css('backgroundColor', opts.backgroundColor).css('color', opts.color);
		return this;		
	}

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
		//过滤数组中子元素
		objectChildFilterByBoolean : function(queryKey,queryValue){
			var resultArray = [];
			for (var i = 0; i < this.length; i++) {
				var tempItem = this[i];
				if(tempItem[queryKey] === queryValue){
					resultArray.push(tempItem);
				}
			}
			return resultArray;
		},
		//过滤数组中子元素 （通过字符串过滤）
		objectChildFilterByStr : function(queryKey,valueStr){
			var resultArray = [];
			for(var index in this){
				var tempItem = this[index];
				if(tempItem[queryKey] && valueStr && valueStr.indexOf(tempItem[queryKey]+'')!==-1){
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
		//子元素对象中设置属性
		setKeyArrayObj : function(setKey,setValue,optionKey,optionValue){
			var targetArray = [];
			for (var i = 0; i < this.length; i++) {
				var temp = this[i];
				//设置需满足的条件
				if(!optionKey || !optionValue || (temp[optionKey]+'' === optionValue+'')){
					temp[setKey] = setValue;
				}
				targetArray.push(temp);
			}
			return targetArray;
		},
		//替换子元素
		replaceChild:function(queryKey,queryValue,obj){
			var resultArray = [];
			for (var i = 0; i < this.length; i++) {
				var tempItem = this[i];
				if(tempItem[queryKey] === queryValue){
					resultArray.push(obj);
				}else{
					resultArray.push(tempItem);
				}
			}
			return resultArray;
		},
		//子元素对象中设置属性（通过字符串过滤）
		setKeyArrayObjByStr : function(optionKey,valueStr,setKey,setValue,otherValue){
			var targetArray = [];
			for (var i = 0; i < this.length; i++) {
				var temp = this[i];
				//设置需满足的条件
				if(optionKey && valueStr && valueStr.indexOf(temp[optionKey]+'')!==-1){
					temp[setKey] = setValue;
				}else{
					temp[setKey] = otherValue;
				}
				targetArray.push(temp);
			}
			return targetArray;
		},
		//数组截断
		splitBy : function(splitNum){
				var targetArrayList = [];
				for (var i = 0; i < this.length;i++) {
					var temp = this.slice(i,i+splitNum);
					targetArrayList.push(temp);
					i+=splitNum;
				}
				return targetArrayList;
		},
		//删除数组中特定对象元素
		delChild : function(name,value){
				var targetArrayList = [];
				for (var i = 0; i < this.length;i++) {
					var temp = this[i];
					if(temp[name] !== value){
						targetArrayList.push(temp);
					}
				}
				return targetArrayList;
		},
		//提取数组子对象特定值，组成数组或字符串,strFlag为true为字符串
		extractChildArray : function(key,strFlag){
				var targetArrayList = [];
				for (var i = 0; i < this.length;i++) {
					var temp = this[i];
					if(typeof temp[key] !== 'undefined') targetArrayList.push(temp[key]);
				}
				return strFlag?targetArrayList.join(','):targetArrayList;
		},
		//提取数组子项特定值
		extractChildArrayByindexArray : function(indexArray){
				var targetArrayList = [];
				for (var i = 0; i < indexArray.length;i++) {
					var temp = this[indexArray[i]];
					targetArrayList.push(temp);
				}
				return targetArrayList;
		},
		//判断数组包含关系
		isContain : function(item){
			for (var i = 0; i < this.length;i++) {
				var temp = this[i];
				if(temp === item) return true;
			}
			return false;
		},
		//从数组中移除item对象
		remove : function(item){
			var index;
			for (var i in this) {
				if (this[i] === item)
					index = i;
			}
			if(index){
				this.splice(index,1);
			}
			return this;
		},
		//对象数组组合另一个关联基础类型数组
		linkAnotherArray : function(anArray,linkProperName,newProperName,newProperValue){
			var targetArray = [];
			for (var i = 0; i < this.length; i++) {
				var tempObj = this[i],
					isSeam = false;
				for (var j = 0; j < anArray.length; j++) {
					var temp = anArray[j];
					if(temp+'' === tempObj[linkProperName]+''){
						isSeam = true;
					}
				}
				if(isSeam){
					tempObj[newProperName] = newProperValue;
				}
				targetArray.push(tempObj);
			}
			return targetArray;
		},
		//根据对象基础数组提取子数组
		extractByAnotherArray : function(anArray,linkProperName){
			var targetArray = [];
			for (var i = 0; i < this.length; i++) {
				var tempObj = this[i],
					isSeam = false;
				for (var j = 0; j < anArray.length; j++) {
					var temp = anArray[j];
					if(temp+'' === tempObj[linkProperName]+''){
						isSeam = true;
					}
				}
				if(isSeam){
					targetArray.push(tempObj);
				}

			}
			return targetArray;
		},
		//合并某对象数组到该数组本身
		extendObjectArray:function(anArray,properName){
			var targetArray = [];
			for (var i = 0; i < this.length; i++) {
				var tempObj = this[i];
				for (var j = 0; j < anArray.length; j++) {
					var tempAn = anArray[j];
					if(tempObj[properName]+'' === tempAn[properName]+''){
						tempObj = $.extend({},tempObj,tempAn);
					}
				}
				targetArray.push(tempObj);
			}
			return targetArray;
		},
		//对象数组转对象
		changeObjectArray2Object:function(properName){
			var targetObj = {};
			for (var i = 0; i < this.length; i++) {
				var tempObj = this[i];
				targetObj[tempObj[properName]] = tempObj;
			}
			return targetObj;
		},
		//对象数组组合另一个关联对象类型数组
		linkAnotherObjectArray : function(anArray,linkProperName,newProperName,newProperValue){
			if(anArray.length<1) return this;
			var targetArray = [];
			for (var i = 0; i < this.length; i++) {
				var tempObj = this[i],
					isSeam = false;
				for (var j = 0; j < anArray.length; j++) {
					var temp = anArray[j];
					if(temp[linkProperName]+'' === tempObj[linkProperName]+''){
						isSeam = true;
					}
				}
				if(isSeam){
					tempObj[newProperName] = newProperValue;
				}else{
					tempObj[newProperName] = undefined;
				}
				targetArray.push(tempObj);
			}
			return targetArray;
		},
		//获取到某对象元素在数组内的节点
		indexOfObject:function(key,value){
			for (var i = 0; i < this.length; i++) {
				var temp = this[i];
				if(temp[key] === value){
					return i;
				}
			}
			return -1;
		},
		interChangePreObject:function(index){
			var prevIndex = 0;
			index = Number(index);
			if(isNaN(index)||(index>this.length-1)) return this;
			if(index === 0){
				prevIndex = this.length-1;
			}else{
				prevIndex = index-1;
			}
			var tempObject = $.extend({},this[index]);
			this[index] = $.extend({},this[prevIndex]);
			this[prevIndex] = $.extend({},tempObject);
			return this;
		},
		interChangeNextObject:function(index){
			var nextIndex = 0;
			index = Number(index);
			if(isNaN(index)||(index>this.length-1)) return this;
			if(index === this.length-1){
				nextIndex = 0;
			}else{
				nextIndex = index+1;
			}
			var tempObject = $.extend({},this[index]);
			this[index] = $.extend({},this[nextIndex]);
			this[nextIndex] = $.extend({},tempObject);
			return this;
		},
		delObjectChildProper : function(key){
			var targetArray = [];
			for (var i = 0; i < this.length; i++) {
				var temp = this[i];
				delete temp[key];
				targetArray.push(temp);
			}
			return targetArray;
		},
		//把子对象中的属性名进行更换
		changeObjectChildProper : function(oldKey,newKey){
			var targetArray = [];
			for (var i = 0; i < this.length; i++) {
				var temp = this[i];
				temp[newKey] = temp[oldKey];
				targetArray.push(temp);
			}
			return targetArray;
		}

		});
	};

	/**
	 * 将人民币金额转换为大写
	 * @param fAmount
	 * @returns {sring}
	 */
	exports.capitalRMB = function (aMount, sSuffix) {




	    //字符长度
	    function LengthB(str) {
	        var p1 = new RegExp('%u..', 'g');
	        var p2 = new RegExp('%.', 'g');
	        return escape(str).replace(p1, '').replace(p2, '').length;
	    }

	    function covert(aMount) {
	        if (isNaN(aMount)) {
	            return "不是一个有效的数字，请重新输入！";
	        }
	        var money1 = new Number(aMount);
	        if (money1 > 1000000000000000000) {
	            return"您输入的数字太大，重新输入！";

	        }
	        var a = ("" + aMount).replace(/(^0*)/g, "").split(".");
	        if (a.length > 1 && LengthB(a[1]) > 2) {
	            cap = '小数点位数不应超过2位';
	            return cap;
	        }
	        var monee = Math.round(money1 * 100).toString(10)
	        var i, j;
	        j = 0;
	        var leng = monee.length;
	        var monval = "";
	        for (i = 0; i < leng; i++) {
	            monval = monval + to_upper(monee.charAt(i)) + to_mon(leng - i - 1);
	        }
	        return repace_acc(monval);
	    }

	    function to_upper(a) {
	        switch (a) {
	            case '0' :
	                return '零';
	                break;
	            case '1' :
	                return '壹';
	                break;
	            case '2' :
	                return '贰';
	                break;
	            case '3' :
	                return '叁';
	                break;
	            case '4' :
	                return '肆';
	                break;
	            case '5' :
	                return '伍';
	                break;
	            case '6' :
	                return '陆';
	                break;
	            case '7' :
	                return '柒';
	                break;
	            case '8' :
	                return '捌';
	                break;
	            case '9' :
	                return '玖';
	                break;
	            default:
	                return '';
	        }
	    }

	    function to_mon(a) {
	        if (a > 10) {
	            a = a - 8;
	            return(to_mon(a));
	        }
	        switch (a) {
	            case 0 :
	                return '分';
	                break;
	            case 1 :
	                return '角';
	                break;
	            case 2 :
	                return '圆';
	                break;
	            case 3 :
	                return '拾';
	                break;
	            case 4 :
	                return '佰';
	                break;
	            case 5 :
	                return '仟';
	                break;
	            case 6 :
	                return '万';
	                break;
	            case 7 :
	                return '拾';
	                break;
	            case 8 :
	                return '佰';
	                break;
	            case 9 :
	                return '仟';
	                break;
	            case 10 :
	                return '亿';
	                break;
	        }
	    }

	    function repace_acc(Money) {
	        Money = Money.replace("零分", "");
	        Money = Money.replace("零角", "零");
	        var yy;
	        var outmoney;
	        outmoney = Money;
	        yy = 0;
	        while (true) {
	            var lett = outmoney.length;
	            outmoney = outmoney.replace("零圆", "圆");
	            outmoney = outmoney.replace("零万", "万");
	            outmoney = outmoney.replace("零亿", "亿");
	            outmoney = outmoney.replace("零仟", "零");
	            outmoney = outmoney.replace("零佰", "零");
	            outmoney = outmoney.replace("零零", "零");
	            outmoney = outmoney.replace("零拾", "零");
	            outmoney = outmoney.replace("亿万", "亿零");
	            outmoney = outmoney.replace("万仟", "万零");
	            outmoney = outmoney.replace("仟佰", "仟零");
	            yy = outmoney.length;
	            if (yy == lett) break;
	        }
	        yy = outmoney.length;
	        if (outmoney.charAt(yy - 1) == '零') {
	            outmoney = outmoney.substring(0, yy - 1);
	        }
	        yy = outmoney.length;
	        if (outmoney.charAt(yy - 1) == '圆') {
	            //outmoney=outmoney +'整';
	            outmoney = outmoney;
	        }
	        return outmoney;
	    }

	    return covert(aMount);
	};

	//查询条件判断
	exports.isCurrentData = function(data){
		return (data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200);
	};

	//编辑条件判断
	exports.isCurrentResponse = function(data){
		return data&&(data.code === 200);
	};

	//判断是否数组
	exports.isArray = function(data){
		return (typeof data === 'object')&&(data instanceof Array);
	};

	//判断是否为空数组
	exports.isEmptyArray = function(data){
		return (typeof data === 'object')&&(data instanceof Array)&&(data.length<=0);
	};

	exports.isNoEmptyArray = function(data){
		return (typeof data === 'object')&&(data instanceof Array)&&(data.length>0);
	};


	//公用全局方法或者属性以及初始化
	//视框自动调节大小
	$('.nav-tabs').live('shown',function(){
		exports.resizeIframeListener();
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

				// var dialog = require('./dialog');
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
					var dialog = require('./dialog');
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
