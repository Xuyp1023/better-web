/*
个人资产模块
作者:bhg
*/
define(function(require,exports,module){
	require.async(['p/js/common/dicTool',"l/My97DatePicker/4.8/WdatePicker.js",'l/highcharts/js/highcharts'],function(){
		require.async(['BTDictData'],function(){
		var validate = require("m/sea_modules/validate");
	    var tipbar = require("m/sea_modules/tooltip");
	    var common = require("p/js/common/common");

		//模块数据声明和初始化(Model)
		window.currentData = {
			searchData:{
				fundCode:'',
				beginDate : new Date().getSubDate('MM',1).format('YYYY-MM-DD'),
				endDate : new Date().format('YYYY-MM-DD')
			}
		};

		//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
		var viewModel = {
			//属性绑定监控
			searchDataBind : ko.observable(currentData.searchData),
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
			searchComp : function(data,event){
				currentData.searchData.fundCode = $('#select_fund_list').val();
				_personModule.createLineChart();
			}
		};

		//定义私有属性以及方法
		var _personModule = {
			//获取前三个图的数据
			reFreshFundInfo : function(custNo,callback){
				$.post(common.getRootPath()+'/SaleQuery/queryInvestCategory',{custNo:custNo},function(data){
					if(data&&data.code === 200){
						fundFrameInfo.series[0].data = _personModule.filterInfo(data.data.accounted,1,0);
						$('#fund_frame').highcharts(fundFrameInfo);
						fundDangerInfo.series[0].data = _personModule.filterInfo(data.data.riskInfo,1,0);
						$('#fund_danger_frame').highcharts(fundDangerInfo);
						//处理柱状图
						for (var i = 0; i < data.data.blockTotal.length; i++) {
							var tempBlock = data.data.blockTotal[i];
							blockCharts.xAxis.categories.push(tempBlock.fundName);
							blockCharts.series[0].data.push(tempBlock.total===0?'':tempBlock.total);
							blockCharts.series[1].data.push(tempBlock.up===0?'':tempBlock.up);
							blockCharts.series[2].data.push(tempBlock.down===0?'':tempBlock.down);
						}
						$('#fund_profit_info').highcharts(blockCharts);
						//填充基金列表
						$('#select_fund_list').html('');
						for (var j = 0; j < data.data.fundList.length; j++) {
							var tempFund = data.data.fundList[j];
							$('#select_fund_list').append('<option value="'+tempFund.fundCode+'">'+tempFund.fundName+'</option>');
						}
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
			//刷新交易账户列表
			reFreshTradeAcoount : function(callback){
				$.post(common.getRootPath()+'/SaleQuery/queryCustInfo',{},function(data){
					if(data.code === 200){
					var tempCustInfo = new ListMap();
					for(var index in data.data){
						var temp = data.data[index];
						tempCustInfo.set(temp.value,temp.name);
					}
					BTDict.CustInfo = tempCustInfo;
					_personModule.initInfo($('#search_comp_list'),data.data,'<option value="">----全部----</option>');
					callback();
					}else{
						$('#error_info_box').css('height',$('body').parent().height()-5).slideDown('fast');
					}
				},'json');
			},
			//过滤0数值
			filterInfo : function(array,filterNum,filterValue){
				var target = [];
				for (var i = 0; i < array.length; i++) {
					var temp = array[i];
					if(temp[filterNum] !== filterValue){
						target.push(temp);
					}
				}
				if(array.length<1) target = array;
				return target;
			},
			//业绩走势折线图 fundcode:基金代码 type:类型 7天、30天、90天、1年、3年、今年、成立(1\2\3\4\5\6\7) bdate:开始日期 edate:结束日期
			createLineChart : function(){
				$.post(common.getRootPath()+'/SaleQuery/queryCombFundChart',currentData.searchData,function(data){
					data = data.data;
					//关闭加载状态弹幕
					lineOptions.series = "";
					var count = 10;
					for ( var i = 0; i < data.length; i++){
						if (count < data[i].data.length){
							count = data[i].data.length;
						}
					}
					lineOptions.xAxis.tickInterval = (count/10) * 24 * 3600 * 1000;
					lineOptions.series = data;
					var chartLine = new Highcharts.Chart(lineOptions);
				},'json');
			}

		};


		//公共事件绑定
		window.onerror = function(e){
			window.location.reload();
		};

		//图表装载
		//基金结构数据
		var fundFrameInfo = {
			chart  : {
			      plotBackgroundColor: null,
			      plotBorderWidth: null,
			      plotShadow: false
			  },
			  title  : {
			     text:null
			  },
			  credits: {
            	enabled:false
        	  },    
			  tooltip  : {
			     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			  },
			  plotOptions  : {
			     pie: {
			        allowPointSelect: true,
			        cursor: 'pointer',
			        showInLegend: true,
			        dataLabels: {
			           enabled: true,
			           format: '<b>{point.name}</b>',
			           color: '#000',						
					   distance: -50,
			           style: {
			              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
			              fontSize: '10px',
						  lineHeight: '15px'
			           }
			        }
			     }
			  },
			  series : [{
			     type: 'pie',//图标类别,饼图为pie
			     name: '所占比例',//显示字符的前缀
			     data: [
			        ['XX现金增利',   45.0],//名字和所占比例
			        ['企额宝',   55.0]
			     ]
			  }]
			      
		};

		//风险分布饼状图
		var fundDangerInfo = {
			chart  : {
			      plotBackgroundColor: null,
			      plotBorderWidth: null,
			      plotShadow: false
			  },
			  title  : {
			     text:null
			  },
			  credits: {
            	enabled:false
        	  },    
			  tooltip  : {
			     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			  },
			  plotOptions  : {
			     pie: {
			        allowPointSelect: false,
			        cursor: 'pointer',
			        showInLegend: true,
			        dataLabels: {
			           enabled: true,
			           format: '<b>{point.name}</b>',
			           color: '#000',						
					   distance: -50,
			           style: {
			              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
			              fontSize: '10px',
						  lineHeight: '15px'
			           }
			        }
			     }
			  },
			  series : [{
			     type: 'pie',
			     name: '所占比例',
			     data: [
			        ['中等风险',   45.0],
			        ['高风险',   55.0]
			     ]
			  }]
			      
		};
		
		var blockCharts = {                                           
		        chart: {                                                           
		            type: 'bar'                                                    
		        },                                                                 
		        title: {                                                           
		            text: null                   
		        },                                                                 
		        subtitle: {                                                        
		            text: null                                 
		        },                                                                 
		        xAxis: {                                                           
		            categories: [],
		            title: {                                                       
		                text: null                                                 
		            }                                                              
		        },                                                                 
		        yAxis: {                                                           
		            min: 0,                                                        
		            title: {                                                       
		                text: '单位:元',                             
		                align: 'high'                                              
		            },                                                             
		            labels: {                                                      
		                overflow: 'justify'                                        
		            }                                                              
		        },                                                                 
		        tooltip: {                                                         
		            valueSuffix: '元'                                       
		        },                                                                 
		        plotOptions: {                                                    
		            bar: {                                                         
		                dataLabels: {                                              
		                    enabled: true                                          
		                }                                                          
		            }                                                             
		        },                                                                 
		        legend: {                                                          
		            layout: 'vertical',                                            
		            align: 'right',                                                
		            verticalAlign: 'top',                                          
		            x: -0,                                                        
		            y: 2,                                                        
		            floating: true,                                                
		            borderWidth: 1,                                                
		            backgroundColor: '#FFFFFF',                                    
		            shadow: true                                                   
		        },                                                                 
		        credits: {                                                         
		            enabled: false                                                 
		        },                                                                 
		        series: [{                                                         
		            name: '当前市值',
		            color:'#2DA7E0',                                             
		            data: []                                   
		        },{                                                         
		            name: '浮盈',
		            color:'red',                                             
		            data: []                                   
		        }, {                                                               
		            name: '浮亏', 
		            color:'green',                                            
		            data: []                                  
		        }]                                                                 
		    };
		 
		
		/******************线图、饼图、柱形图**************************/
		var lineOptions = {
				chart : {
					renderTo : 'fund_forward_info',
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
		};

		ko.applyBindings(viewModel);

		/*事件绑定区块*/
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
			currentData.searchData.fundCode = $('#select_fund_list').val();
			viewModel.searchDataBind(currentData.searchData);
			_personModule.createLineChart();
		});

		//初始化操作
		_personModule.reFreshTradeAcoount(function(){
			_personModule.reFreshFundInfo($('#search_comp_list').val(),function(){
				currentData.searchData.fundCode = $('#select_fund_list').val();
				_personModule.createLineChart();
			});
		});

	});
});
});