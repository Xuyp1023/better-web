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
			return function(data){
				return BTServerPath+'/Platform/CustFile/fileDownload?id='+data;
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
				return BTDict[listName].get(data);
			};
		})
		//百分号格式化
		.filter('percentf',function(){
			return function(data){
				if(data+''==='0'||data+''==='') return '----';
				return data+'%';
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
				if((data===undefined)||(data === '')) return '无';
			};
		});


	};

});

