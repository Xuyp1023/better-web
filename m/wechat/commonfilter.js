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
			return function(data,flag){
				return BTServerPath+'/Wechat/Platform/fileDownload?id='+data;
			};
		})


		//下载地址格式化
		.filter('downPdf',function(){
			return function(data){
				return  BTServerPath+'/Wechat/Scf/ElecAgree/downloadAgreePDF?appNo='+data;				
			};
		})

		//下载地址格式化
		.filter('baseInfoF',function(){
			return function(data){
				return BTServerPath+'/scf2/views/supplier/info/basicInfo.html#'+data;
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
				return BTDict[listName].get(data)||'----';
			};
		})
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
					provinceInfo = BTDict.Provinces.getItem(provinceNo),
					provinceName = provinceInfo.name,
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
				if(!data) return '----';
				if(data+''==='0'||data+''==='') return '----';
				return data+'%';
			};
		})
		//千分号格式化
		.filter('permillf',function(){
			return function(data){
				if(data+''==='0'||data+''==='') return '----';
				return data+'‰';
			};
		})
		//合同签署信息状态格式化
		.filter('cstatusf',function(){
			return function(data){
				if((data===undefined)||(data === '')) return '----';
				if(data === '0'||data === 0){
					return '未签署';
				}else{
					return (data === '1'||data === 1)?'成功':'失败';
				}
			};
		})
		//空处理
		.filter('emptyf',function(){
			return function(data,unit){
				if((data===undefined)||(data === '')) return '----';
				return data + (unit||'');
			};
		});


	};

});

