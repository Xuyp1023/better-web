/*
* 业务公用服务模块设置
* 作者: binhg
*/

define(function(require,exports,module){

	exports.servPlus = function(mainApp){

		mainApp.service('commonService',['$rootScope',function($rootScope){
			return {
				/*
				 *加载各类字典列表
				*/
				queryDicList:function(path,param,callback,dicName){
					$.post(path,param,function(data){
						if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
							if(dicName){
								//填充字典数据
								var tempCustInfo = new ListMap();
								for(var index in data.data){
									var temp = data.data[index];
									tempCustInfo.set(temp.value,temp.name);
								}
								BTDict[dicName] = tempCustInfo;
							}
							if(callback) callback(data.data);
						}
					},'json');
				},

				/*
				*公用页面初始化方法
				*/
				initPage : function(call){
					call();
				}
			};

		}]);
	};
});