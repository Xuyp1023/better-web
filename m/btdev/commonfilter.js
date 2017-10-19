/*angular公用指令
作者:binhg
*/

define(function(require,exports,module){
	//扩充指令入口
	exports.filterPlus = function(moduleApp){
		//时间过滤
		moduleApp.filter('dateFilter',function(){
			return function(data,param){
				if(!data) return '----';
				param = param||'/';
				if(data.split(param).length>1) return data;
				data+='';
				var newDate = '';
				newDate+=(data.substr(0,4)+param+data.substr(4,2)+param+data.substr(6));
				return newDate;
			};
		})
		// 保留2位小数
		.filter('floatTo2',function(){
			return function(str){			
				return Number(str).toFixed(2);
			}
		})
		// 获取日期的年
		.filter('yearFilter',function(){
			return function(data,param){
				if(!data) return '----';
				param = param||'/';
				if(data.split(param).length>1) return data;
				data+='';
				var newDate = '';
				newDate+=data.substr(0,4);
				return newDate;
			};
		})
		// 获取日期的月
		.filter('monthFilter',function(){
			return function(data,param){
				if(!data) return '----';
				data=data.replace(new RegExp("\\D","g"),'');
				data+='';
				param = param||'/';
				if(data.split(param).length>1) return data;				
				var newDate = '';
				newDate+=data.substr(4,2);
				return newDate;
			};
		})
		// 获取日期的日
		.filter('dayFilter',function(){
			return function(data,param){
				if(!data) return '----';
				data = data.replace(new RegExp("\\D","g"),'');
				data+='';
				param = param||'/';
				if(data.split(param).length>1) return data;				
				var newDate = '';
				newDate+=data.substr(6);
				return newDate;
			};
		})
		//时间格式化
		.filter('timeFilter',function(){
			return function(data,param){
				if(!data) return '---';
				param = param||'/';
				if(data.split(param).length>1) return data;
				data+='';
				var newTime = '';
				newTime+=(data.substr(0,2)+param+data.substr(2,2)+param+data.substr(4));
				return newTime;
			};
		})
		//年月日时分秒格式化
		.filter('datetimef',function(){
			return function(data,param){
				if(!data) return '----';
				param = param||'-';
				if(data.split(param).length>1) return data;
				data+='';
				var newDate = '';
				newDate+=(data.substr(0,4)+param+data.substr(4,2)+param+data.substr(6,2)+' '+data.substr(8,2)+':'+data.substr(10,2));
				return newDate;
			};
		})
		//货币千位符过滤,placeholder为小数点后保留位数
		.filter('moneyFilter',function(){
			return function(data,placeholder){
					if(data===undefined) return '----';
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
		})
		//下载地址格式化
		.filter('downf',function(){
			return function(data){
				return BTServerPath+'/Platform/CustFile/fileDownload?id='+data;
			};
		})
		//电子合同下载地址格式化
		.filter('elecf',function(){
			return function(data){
				return BTServerPath+'/Scf/ElecAgree/downloadAgreePDF?appNo='+data;
			};
		})
		//公司基本信息
		.filter('baseInfoF',function(){
			return function(data){
				return BTServerPath+'/scf2/views/supplier/info/basicInfo.html#'+data;
			};
		})
		//公司经营信息
		.filter('busiInfoF',function(){
			return function(data){
				return BTServerPath+'/scf2/views/supplier/info/businessInfo.html#'+data;
			};
		})
		//路径格式化（补全）
		.filter('urlf',function(){
			return function(data){
				return BTServerPath + data;
			};
		})
		//意见确认书等过滤
		.filter('downpf',function(){
			return function(requestNo,flag){
				if(flag==='0'){
					return BTServerPath+'/ScfRequest/exportNoticeReport?requestNo='+requestNo;
				}else{
					return BTServerPath+'/ScfRequest/exportOpinionReport?requestNo='+requestNo;
				}
			};
		})
		//类别过滤器
		.filter('kindf',function(){
			return function(data,listName){
				if(!BTDict[listName]) return '----';
				return BTDict[listName].get(data);
			};
		})
		//地址过滤器 传入城市编号，返回 省份名称+城市名称
		.filter('areaf',function(){
			return function(data){
				if(!data || data.length!=6) return '----';
				var areaName;
				//省
				if(data.indexOf('0000')===2){
					areaName = BTDict.Provinces.getItem(data).name;
					return areaName;
				}
				//省市
				var provinceNo = data.substr(0,2)+'0000',
					provinceInfo = BTDict.Provinces.getItem(provinceNo);
					if(!provinceInfo) return '----';
				var provinceName = provinceInfo.name,
					cityName = provinceInfo.citys.getItem(data).name;
				areaName =provinceName + cityName;
				return areaName;
			};
		})
		//类别组过滤器
		.filter('groupf',function(){
			return function(data,listName){
				if((!BTDict[listName])&&(data==='')) return '----';
				var group = data.split(','),
					targetArray = [];
				for (var i = 0; i < group.length; i++) {
					var temp = group[i];
					targetArray.push(BTDict[listName].get(temp));
				}
				return targetArray.join(' | ');
			};
		})
		//百分号格式化
		.filter('percentf',function(){
			return function(data){
				if(data+''==='0') return '0%';
				if(!data) return '----';
				return data+'%';
			};
		})
		//千分号格式化
		.filter('permillf',function(){
			return function(data){
				if(data+''==='0') return '0%';
				if(!data) return '----';
				return data+'‰';
			};
		})
		//合同签署信息状态格式化
		.filter('cstatusf',function(){
			return function(data){
				if((data===undefined)||(data === '')) return '----';
				return (data === '0'||data === 0)?'失败':'成功';
			};
		})
		//空处理
		.filter('emptyf',function(){
			return function(data){
				if((data===undefined)||(data === '')) return '----';
				return data;
			};
		})
		//数字单位大小写|不区分百千万
		.filter('numberFilter',
			function numberFilter() {
		        return filterFilter;
		        function filterFilter(data, props) {

		        	// 日期正则表达式
		        	 var reg =/\d{4}-\d{2}-\d{2}/;
		        	 // if(!data || data.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
		        	 	if(data && reg.test(data)){
		        	 	
		        	 
		        	var result = '';
		        	//return result;
		         	switch (props){
		         		//日期转换附带年月日 2017-12-18|贰零壹柒 年 壹贰 月 壹捌 日
		         		case(0):
		         	  		var atrrs = data.split('-');
		         	  		result += numberfter(atrrs[0]) + " 年 ";
        					result += numberfter(atrrs[1]) + " 月 ";
        					result += numberfter(atrrs[2]) + " 日 ";
		         			break;
		         			//年转换 2017-12-18 | 贰零壹柒
		         		case(1):
		         			var str = data.split('-')[0];
		         			result = numberfter(str);
		         			break;
		         			//月转换 2017-12-18 | 壹贰
		         		case 2:
		         			var str = data.split('-')[1];
		         			result = numberfter(str);
		         			break;
		         			//日转换 2017-12-18 | 壹捌
	         			case 3:
	         				var str = data.split('-')[2];
		         			result = numberfter(str);
		         			break;
	         	}
				function numberfter(string){

					var mathRs = '';
					var numMap = ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖'];
					angular.forEach(string.split(''),function(number){
						mathRs = mathRs + numMap[Number(number)];
					});
					return mathRs;
				}

				return result;
	        }
		   }
	    })
	    .filter('filindex',
	    	function filindex(){
	    		return filterindex;
	    		function filterindex(data,props){
	    		 var indexstr = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];

	    		 var result = '';

	    		 switch (data){
	    		 	case 0:
	    		 		result = indexstr[0];
	    		 		break;
	    		 	case 1:
	    		 		result = indexstr[1];
	    		 		break;
	    		 	case 2:
	    		 		result = indexstr[2];
	    		 		break;
	    		 	case 3:
	    		 		result = indexstr[3];
	    		 		break;
	    		 	case 4:
	    		 		result = indexstr[4];
	    		 		break;
	    		 	case 5:
	    		 		result = indexstr[5];
	    		 		break;
	    		 	case 6:
	    		 		result = indexstr[6];
	    		 		break;
	    		 	case 7:
	    		 		result = indexstr[7];
	    		 		break;
	    		 	case 8:
	    		 		result = indexstr[8];
	    		 		break;
	    		 	case 9:
	    		 		result = indexstr[9];
	    		 		break;
	    		 }

	    			

	    			return result;
	    	}
	    })
	    //开票金额过滤
  		.filter('moneytiny',
  			function moneytiny(){
  			 return filtermoney;
  			function filtermoney(data){
  				
  				 if(!data){
  				 	return '0';
  				 }else{
  				 data+='';	
  				var moneyfil = data.split('.');
  				
  				if(moneyfil[1]){		
  					//如果后面是1位小数
  					if(moneyfil[1].length==1){

  						moneyfil[1]+='0';
  						return  moneyfil.join(''); 		
  				//如果后面是二位小数
  					}else if(moneyfil[1].length==2) {
  						return moneyfil.join('');
  					}else{
  						moneyfil[1]=moneyfil[1].substr(0,2);
  						return moneyfil.join('');
  					}
  				}else{
  							moneyfil[0]+='00';
  							return moneyfil.join('');
  				}
  				}

  			}
  		})
		//金额大写
		.filter('moneybigf',function(){
		    return function(data){
	    		//字符长度
	    	    function LengthB(str) {
	    	        var p1 = new RegExp('%u..', 'g');
	    	        var p2 = new RegExp('%.', 'g');
	    	        return escape(str).replace(p1, '').replace(p2, '').length;
	    	    }

	    	    function covert(aMount) {
	    	    	if(!aMount) return;
	    	        if (isNaN(aMount)) {
	    	            return "不是一个有效的数字，请重新输入！";
	    	        }
	    	        var money1 = new Number(aMount);
	    	        if (money1 > 1000000000000000000) {
	    	            return"您输入的数字太大，重新输入！";
	    	        }
	    	        var a = ("" + aMount).replace(/(^0*)/g, "").split(".");
	    	        if (a.length > 1 && LengthB(a[1]) > 2) {
	    	            return '小数点位数不应超过2位';
	    	        }
	    	        var monee = Math.round(money1 * 100).toString(10);
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
	    	    	//如果不是【0-9】 
	    	    	if(! /^\d{1}/.test(a)) return '';
	    	    	var arr = ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖'];
	    	    	return arr[a];
	    	    }

	    	    function to_mon(a) {
	    	        if (a > 10) {
	    	            a = a - 8;
	    	            return(to_mon(a));
	    	        }
	    	        var arr = ['分','角','圆','拾','佰','仟','万','拾','佰','仟','亿'];
	    	        return arr[a];
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
		    	return covert(data);
		    };

		});


	};

});

