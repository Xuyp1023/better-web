/*
者风险承受力调查问卷
作者:herb
*/
define(function(require,exports,module){
	require.async(['p/js/common/dicTool','l/bootstrap/js/bootstrap.min',"l/My97DatePicker/4.8/WdatePicker.js"],function(){
		require.async(['BTDictData'],function(){
			var validate = require("m/sea_modules/validate");
		    var tipbar = require("m/sea_modules/tooltip");
		    var common = require("p/js/common/common");
		    var loading = require("m/sea_modules/loading");

			//模块数据声明和初始化(Model)
			window.currentData = {
				searchData : {
					custNo:"",
					agencyNo :""
				},
				//评估详情
				evaluateData : {
					reason:"",
					invest_years:"",
					target:"",
					time:"",
					fund_number:"",
					oneincome_loss:"",
					thrincome_loss:"",
					//评估结果
					gradeInfo:"暂未评估",
					description:"暂无描述"
				}
			};

			//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
			window.viewModel = {
				//属性绑定监控
				searchDataBind : ko.observable(currentData.searchData),
				evaluateDataBind : ko.observable(currentData.evaluateData),

				//事件绑定
				//查询报告信息
				searchReport : function(){
					_personModule.reFreshReportInfo();
				},
				//提交报告信息
				submitReport : function(data,event){
					var $target = $(event.target||event.srcElement);
					if(!_personModule.validateOption()){
						tipbar.errorTopTipbar($target,'问卷尚未填写完全！',3000,9999);
						return false;
					}
					var requestUrl = '/Risk/riskGrade';
					if(window.reportVo.agencyNo == '201'){
						currentData.evaluateData.examNo="1";
					}else{
						currentData.evaluateData.examNo="2";
					}
					$.post(common.getRootPath()+requestUrl,$.extend({},currentData.searchData,currentData.evaluateData),function(data){
						if(data.code === 200){
							tipbar.errorTopTipbar($target,'提交成功!',1500,9999,function(){});
							var result = $.extend(currentData.evaluateData,data.data);
							viewModel.evaluateDataBind(result);
							$('#risk_level_box').modal('show');
						}else{
							tipbar.errorTopTipbar($target,'提交失败,原因:'+data.message,3000,9999);
						}
					},'json');
				}

			};

			//定义私有属性以及方法
			var _personModule = {
				//各步骤前置处理方法
				
				//信息初始化(下拉框)
				initInfo : function(targetElement,dicData,defaultElement,textName,valueName){

					var searchVar = window.reportVo.agencyNo;

					// debugger;
					var text = textName || 'name',
					value =  valueName || 'value',
					dicArray = dicData,
					defaultHtml = defaultElement||''; 
					targetElement.html('').append(defaultHtml);
					for (var i = 0; i < dicArray.length; i++) {
						var tempDic = dicArray[i];
						if(searchVar == tempDic[value]){
							targetElement.append('<option value="'+tempDic[value]+'" selected = "selected">'+tempDic[text]+'</option>');
						}else{
							targetElement.append('<option value="'+tempDic[value]+'">'+tempDic[text]+'</option>');
						}
						
					}
				},
				//刷新交易账户列表
				reFreshTradeAcoount : function(callback){
					$.post(common.getRootPath()+'/SaleQuery/queryCustInfo',{},function(data){
						if(data && data.code === 200){
							var tempCustInfo = new ListMap();
							for(var index in data.data){
								var temp = data.data[index];
								tempCustInfo.set(temp.value,temp.name);
							}
							BTDict.CustInfo = tempCustInfo;
							_personModule.initInfo($('#trade_account'),data.data,'');
						}
						if(callback)  callback();
					},'json');
				},
				//获取基金机构列表
				reFreshFundDpartment :function(){
					_personModule.initInfo($('#fund_partment'),BTDict.RiskAssessment.toArray('value','name'),'');
				},
				//刷新风险评估报告信息
				reFreshReportInfo : function(){
					$.post(common.getRootPath()+'/Risk/riskRecode',currentData.searchData,function(data){
						if(data && data.code === 200){
							currentData.evaluateData = data.data;
							viewModel.evaluateDataBind(data.data);
						}
					},'json');
				},
				//检查选项是否已全部填写
				validateOption : function(){
					for (var i in currentData.evaluateData){
						if(!currentData.evaluateData[i]){
							return false;
						}
					}
					return true;
				}
			};

			//基金机构
			$("#fund_partment").change(function(){
				var agencyNo = $(this).val();
				if(agencyNo && window.reportVo.agencyNo != agencyNo){
					if(agencyNo == '201'){
						window.location.href = '../report/report.html?agencyNo =='+agencyNo;
					}else if(agencyNo == '203'){
						window.location.href = '../report/report-huaxia.html?agencyNo =='+agencyNo;
					}
				}
				currentData.searchData.agencyNo = agencyNo;
				//刷新问卷信息
				_personModule.reFreshReportInfo();
			});

			//交易账户
			$("#trade_account").change(function(){
				currentData.searchData.custNo = $(this).val();
				//刷新问卷信息
				_personModule.reFreshReportInfo();
			});

			//绑定VM
			ko.applyBindings(viewModel);
			//获取交易账户列表
			_personModule.reFreshTradeAcoount(function(){
				//获取基金机构列表
				_personModule.reFreshFundDpartment();
				//页面加载后触发change事件
				$("#fund_partment").trigger("change");
				$("#trade_account").trigger("change");
			});
			
			

		});
	});

});