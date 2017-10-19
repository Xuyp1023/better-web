/*
个人资产模块
作者:bhg
*/
define(function(require,exports,module){
	require.async(['p/js/common/dicTool','l/bootstrap/js/bootstrap.min',"l/My97DatePicker/4.8/WdatePicker.js",'l/highcharts/js/highcharts'],function(){
	require.async(['BTDictData'],function(){
	var validate = require("m/sea_modules/validate");
    var tipbar = require("m/sea_modules/tooltip");
    var common = require("p/js/common/common");
    var loading = require("m/sea_modules/loading");

	//模块数据声明和初始化(Model)
	window.currentData = {
		netValueListPage : {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		},
		searchData:{
			fundCode:'',
			beginDate : new Date().getSubDate('MM',1).format('YYYY-MM-DD'),
			endDate : new Date().format('YYYY-MM-DD')
			// beginDate :'2015-10-01',
			// endDate : '2015-10-31'
		},
		netValueSearchData : {
			fundCode:'',
			beginDate : new Date().getSubDate('MM',1).format('YYYY-MM-DD'),
			endDate : new Date().format('YYYY-MM-DD')
		},
		fundList:[],
		fundInfo : {},
		//净值波动折线图参数
		netValOptions:{
			chart : {
				renderTo : 'fund_netvalue_chart',
				defaultSeriesType : 'line',
				zoomType : 'xy'
			},
			title : {
				text : ''
			},
			subtitle : {
				text : ''
			},
			credits : {
				enabled : false
			},
			xAxis : {
				type : "datetime",//时间轴要加上这个type，默认是linear  	
				lineWidth : 3,//自定义x轴宽度  
				gridLineWidth : 0,//默认是0，即在图上没有纵轴间隔线  
				//自定义x刻度上显示的时间格式，根据间隔大小，以下面预设的小时/分钟/日的格式来显示  
				dateTimeLabelFormats : {
					second : '%H:%M:%S',
					minute : '%e. %b %H:%M',
					hour : '%b/%e %H:%M',
					day : '%m/%d',
					week : '%m/%d',
					month : '%b %y',
					year : '%Y'
				},
				labels : {
					rotation : -50,
					align : 'right',
					style : {
						font : 'normal 13px Verdana, 微软黑体'						
					}
				}
			},
			yAxis : {
				title : {
					text : ''
				},
				tickPixelInterval : 20
			},
			tooltip : {
				crosshairs : [ {
					width : 1,
					color : "#B0C4DE",
					dashStyle : "longdash"
				} ],
				formatter : function() {
					var s = "日期:" + Highcharts.dateFormat('%Y-%m-%d',this.x);
					var lastY = 0;
					var xxxx = 0;
					$.each(this.points, function(i, point) {
						s += '<br/>' + point.series.name + ': ' + point.y.toFixed(3);
						xxxx = point.y.toFixed(3) - lastY;
						lastY = point.y.toFixed(3);
					});
					// s += '<br/>' + '相差: ' + Math.round(xxxx * 100) / 100;
				return s;
			},
			shared : true
			},
			plotOptions: {
				  series: {
				   lineWidth: 1,
				   shadow: true,
				   states: {
				    hover: {
				     lineWidth: 1      
				    }
				   }, marker:{
				                enabled:false,// 是否显示点
				                radius:1,// 点的半径
				                states:{
				                    hover:{
				                        enabled:true// 鼠标放上去点是否放大
				                    },
				                    select:{
				                        enabled:false// 控制鼠标选中点时候的状态
				                    }
				                }
				            },
				   enableMouseTracking: true　// 是否提示
				  }
			},
			series: [{name: ''}, {name: ''}]
		},
		/******************线图、饼图、柱形图**************************/
		lineOptions : {
				chart : {
					renderTo : 'fund_netvalue_chart',
					defaultSeriesType : 'line'
				},
				title : {
					text : ''
				},
				credits : {
					enabled : false
				},
				xAxis : {
						type : "datetime",//时间轴要加上这个type，默认是linear  	
						lineWidth : 1,//自定义x轴宽度  
						gridLineWidth : 0,//默认是0，即在图上没有纵轴间隔线  
						//自定义x刻度上显示的时间格式，根据间隔大小，以下面预设的小时/分钟/日的格式来显示  
						dateTimeLabelFormats : {
							second : '%H:%M:%S',
							minute : '%e. %b %H:%M',
							hour : '%b/%e %H:%M',
							day : '%m/%d',
							week : '%m/%d',
							month : '%b %y',
							year : '%Y'
						},
						showFirstLabel: false,
						labels : {
							rotation : -70,
							align : 'right',
							style : {
								font : 'normal 13px Verdana, 微软黑体'						
							},
							// step: 1,   
		                    formatter: function () {  
		                        return Highcharts.dateFormat('%Y-%m-%d', this.value);  
		                    }
						}
				},
				yAxis: [{ // left y axis
								title: {
									text: ''
								},
								tickPixelInterval :150,
								//gridLineWidth: 0,
								labels: {
									align: 'left',
									x: -8,
									y: 0,
									formatter: function() {
										return Highcharts.numberFormat(this.value, 0)+"%";
									}
								},
								showFirstLabel: false
				        }
			    ],
			tooltip: {
			    formatter: function () {                    
		            var pobj = this.points;                        
		            if (pobj.length>1){                
		               return '日期：'+Highcharts.dateFormat('%Y-%m-%d',this.x) 
		                 +'<br/><span style="color:'+this.points[0].series.color+'">'+this.points[0].series.name+'</span>:' + Math.round(this.points[0].y * 100) / 100.00
		                 + '%<br/><span style="color:'+this.points[1].series.color+'">'+this.points[1].series.name+'</span>:' + Math.round(this.points[1].y * 100) / 100.00+'%';  
		            }else{
		               return '日期：'+Highcharts.dateFormat('%Y-%m-%d',this.x)
		                 +'<br/><span style="color:'+this.points[0].series.color+'">'+this.points[0].series.name+'</span>:' + Math.round(this.points[0].y * 100) / 100.00+'%';
		            }				
		        },
		        shared: true,
		        crosshairs: true  
		    },

			plotOptions: {
				series: {
					lineWidth: 1,
					shadow: true,
					states: {
						hover: {
							lineWidth: 1						
						}
					}, marker:{
		                enabled:false,//是否显示点
		                radius:1,//点的半径
		                //symbol: 'url(http://highcharts.com/demo/gfx/sun.png)',//这个可以让点用图片来显示
		                states:{
		                    hover:{
		                        enabled:true//鼠标放上去点是否放大
		                    },
		                    select:{
		                        enabled:false//控制鼠标选中点时候的状态
		                    }
		                }
		            },
					enableMouseTracking: true　//是否提示
				}
			},
			series : []
		}
	};

	//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
	window.viewModel = {
		//属性绑定监控
		netValueListPageBind : ko.observable(currentData.netValueListPage),
		searchDataBind : ko.observable(currentData.searchData),
		netValueSearchDataBind : ko.observable(currentData.netValueSearchData),
		fundListBind : ko.observableArray(currentData.fundList),
		fundInfoBind : ko.observable(currentData.fundInfo),
		//事件绑定
		setDateInfo : function(data,event){
			event.target = event.srcElement||event.target;
			var flag = $(event.target).attr('flag'),
			endId = flag+'_'+'end_date';
			WdatePicker({startDate:'%y-%M-%d',maxDate:'#F{$dp.$D(\''+endId+'\')}',dateFmt:'yyyy-MM-dd',readOnly:true,onpicked:function(){
				if(flag === 'charts'){
					viewModel.changeDateForChart(data,event);
				}else if(flag==='netValue'){
					currentData.netValueListPage.pageNum = 1;
					_personModule.reFreshNetValueList();
				}
			}});
		},
		setEndDate : function(data,event){
			event.target = event.srcElement||event.target;
			var flag = $(event.target).attr('flag'),
			beginId = flag+'_'+'begin_date';
			WdatePicker({startDate:'%y-%M-%d',minDate:'#F{$dp.$D(\''+beginId+'\')}',dateFmt:'yyyy-MM-dd',readOnly:true,onpicked:function(){
				if(flag === 'charts'){
					viewModel.changeDateForChart(data,event);
				}else if(flag==='netValue'){
					currentData.netValueListPage.pageNum = 1;
					_personModule.reFreshNetValueList();
				}
			}});
		},
		changeDateInfo : function(data,event){
			event.target = event.srcElement||event.target;
			var dateName = $(event.target).attr('dateName'),
			dateData = $(event.target).attr('dateData');
			currentData[dateData][dateName] = event.target.value;
		},
		//更改图表信息
		changeDateForChart: function(data,event){
			event.target = event.srcElement||event.target;
			var dateName = $(event.target).attr('dateName'),
			dateData = $(event.target).attr('dateData');
			currentData[dateData][dateName] = event.target.value;
			_personModule.reFreshFundChart();
		},
		//更改净值历史信息
		changeNetHistory: function(data,event){
			event.target = event.srcElement||event.target;
			var dateName = $(event.target).attr('dateName'),
			dateData = $(event.target).attr('dateData');
			currentData[dateData][dateName] = event.target.value;
			currentData.netValueListPage.pageNum = 1;
			_personModule.reFreshNetValueList(true);
		},
		searchTrade : function(){
			_personModule.reFreshTradList(true);
		},
		showTradeDetail : function(data,event){
			currentData.tradeInfo = data;
			viewModel.tardeInfoBind(currentData.tradeInfo);
			// $('#tradeDetail').modal('show');
			tipbar.boxTopTipbar($('#tradeDetailBox'),$(document.body),null,{});
		},
		/*格式化*/
		//净值格式化
		parseNetValue : function(data){
			if(data.netValue){
				return common.formaterPoint4(data.netValue);
			}else{
				return '----';
			}
		},
		//申请状态格式化
		parseStaus : function(data){
			if(data.tradeStatus){
				return BTDict.SaleBusinFlag.get(data.tradeStatus);
			}else{
				return '----';
			}
		},
		//日期格式化
		formaterDate : function(data){
			data+='';
			var newDate = '';
			newDate+=(data.substr(0,4)+'-'+data.substr(4,2)+'-'+data.substr(6));
			return newDate;
		},
		//百分号格式化
		formaterPercent :function(data){
			if(data+''==='0'||data==='') return '----';
			return data+'%';
		},
		//四位符格式化
		formaterPoint4 : function(data){
			return Number(data).toFixed(4);
		},
		//业务类型
		parseBusiFlag : function(data){
			if(!data) return '----';
			return BTDict.SaleBusinCode.get(data);
		},
		//交易账户格式化
		parseCustNo : function(data){
			if(!data) return;
			return BTDict.CustInfo.get(data);
		},
		//风险等级格式化
		formaterRiskLvel : function(data){
			if(!data) return;
			return BTDict.SaleRiskLevel.get(data+'');
		},

		//分页事件
		firstPage : function(){
			currentData.netValueListPage.pageNum=1;
			_personModule.reFreshNetValueList(false);
		},
		endPage : function(){
			currentData.netValueListPage.pageNum=currentData.netValueListPage.pages;
			_personModule.reFreshNetValueList(false);
		},
		prevPage : function(){
			currentData.netValueListPage.pageNum--;
			_personModule.reFreshNetValueList(false);
		},
		nextPage : function(){
			currentData.netValueListPage.pageNum++;
			_personModule.reFreshNetValueList(false);
		},
		skipPage : function(data,event){
			var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
			if(isNaN(pageNum)||pageNum.split('.').length>1||Number(pageNum)<1||Number(pageNum)>currentData.netValueListPage.pages){
				$('#fund_list_page [name="skipToPageNum"]').val('');
				tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000);
				return;
			}
			currentData.netValueListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
			$('#fund_list_page [name="skipToPageNum"]').val('');
			_personModule.reFreshNetValueList(false);
		}
	};

	//定义私有属性以及方法
	var _personModule = {
		//各步骤前置处理方法
		
		//刷新基金数据
		reFreshTradList : function(){
			_personModule.reFreshNetValueList(true);
			_personModule.reFreshFundChart();		
		},
		//刷新基金收益图信息
		reFreshFundChart : function(){
			$.post(common.getRootPath()+'/SaleQuery/queryCombFundChart',currentData.searchData,function(data){
					//关闭加载状态弹幕
					_personModule.createLineChart(data.data);
			},'json');
		},
		//刷新基金净值列表信息
		reFreshNetValueList : function(flag){
			//弹出弹幕加载状态
			loading.addLoading($('#fund_net_list_table'),common.getRootPath());	
			$.post(common.getRootPath()+'/SaleQuery/queryFundDayByFundCode',$.extend(currentData.netValueListPage,currentData.netValueSearchData),function(data){
					//关闭加载状态弹幕
					loading.removeLoading($('#fund_net_list_table'));
					if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)&&(data.data.length>0)){
						currentData.fundList = common.cloneArrayDeep(data.data);
						viewModel.fundListBind(currentData.fundList);
						currentData.fundInfo = data.data[0];
						viewModel.fundInfoBind(currentData.fundInfo);
						if(flag){
							currentData.netValueListPage = data.page;
							viewModel.netValueListPageBind(data.page);
						}else{
							viewModel.netValueListPageBind(currentData.netValueListPage);
						}
						common.resizeIframe();
					}
			},'json');
		},
		//信息初始化
		initInfo : function(targetElement,dicData,defaultElement,textName,valueName){
			var text = textName || 'name',
			value =  valueName || 'value',
			dicArray = dicData,
			defaultHtml = defaultElement||''; 
			targetElement.html('').append(defaultHtml);
			for (var i = 0; i < dicArray.length; i++) {
				var tempDic = dicArray[i];
				targetElement.append('<option value="'+tempDic[value]+'">'+tempDic[text]+'</option>');
			}
		},
		//刷新基金曲线波动图
		getFundNetWorthForChart : function(begin, end, fundCode) {
			$.ajax( {
				type : "POST",
				url : common.getRootPath()+'/p/testdata/testNetValue.json',
				data : {
					fundCode : fundCode,
					beginTime : begin,
					endTime : end
				},
				success : function(data) {
					currentData.netValOptions.series = data.data;
					var count = 10;
					for ( var i = 0; i < data.data.length; i++){
						if (count < data.data[i].data.length){
							count = data.data[i].data.length;
						}
					}
					currentData.netValOptions.xAxis.tickInterval = (count/4) * 24 * 3600 * 1000;
					var netValLine = new Highcharts.Chart(currentData.netValOptions);
					// changeIframeHeight();
				},
				error : function() {
					alert('获取数据失败！');
				}
			});
		},
		//业绩走势折线图 fundcode:基金代码 type:类型 7天、30天、90天、1年、3年、今年、成立(1\2\3\4\5\6\7) bdate:开始日期 edate:结束日期
		createLineChart : function(data){
			currentData.lineOptions.series = "";
			var count = 10;
			for ( var i = 0; i < data.length; i++){
				if (count < data[i].data.length){
					count = data[i].data.length;
				}
			}
			currentData.lineOptions.xAxis.tickInterval = (count/10) * 24 * 3600 * 1000;
			currentData.lineOptions.series = data;
			var chartLine = new Highcharts.Chart(currentData.lineOptions);
		}
		
	};

	


	ko.applyBindings(viewModel);

	/*JQ事件绑定*/
	//刷新图表
	$('#chart_search_box').find('.search-fast li').click(function(){
		var target = $(this).attr('target'),
		flag = target.split(',')[0],
		subNum = Number(target.split(',')[1]),
		startDate = '',
		endDate = new Date().format('YYYY-MM-DD');
		if(subNum===0&&flag==='YYYY'){
			startDate = new Date(new Date().getFullYear(),0,1).format('YYYY-MM-DD');
		}else if(subNum===50&&flag==='YYYY'){
			startDate = new Date(1990,0,1).format('YYYY-MM-DD');
		}else{
			startDate = new Date().getSubDate(flag,subNum).format('YYYY-MM-DD');
		}
		currentData.searchData.beginDate = startDate;
		currentData.searchData.endDate = endDate;
		viewModel.searchDataBind(currentData.searchData);
		_personModule.reFreshFundChart();
	});
	//刷新净值信息列表
	$('#netValue_search_box').find('.search-fast li').click(function(){
		var target = $(this).attr('target'),
		flag = target.split(',')[0],
		subNum = Number(target.split(',')[1]),
		startDate = '',
		endDate = new Date().format('YYYY-MM-DD');
		if(subNum===0&&flag==='YYYY'){
			startDate = new Date(new Date().getFullYear(),0,1).format('YYYY-MM-DD');
		}else if(subNum===50&&flag==='YYYY'){
			startDate = new Date(1990,0,1).format('YYYY-MM-DD');
		}else{
			startDate = new Date().getSubDate(flag,subNum).format('YYYY-MM-DD');
		}
		currentData.netValueSearchData.beginDate = startDate;
		currentData.netValueSearchData.endDate = endDate;
		viewModel.netValueSearchDataBind(currentData.netValueSearchData);
		_personModule.reFreshNetValueList(true);
	});


	/*数据初始化*/
	//获取净值列表
	currentData.searchData.fundCode = location.href.split('#')[1];
	currentData.netValueSearchData.fundCode = location.href.split('#')[1];
	_personModule.reFreshTradList();

});
});
});