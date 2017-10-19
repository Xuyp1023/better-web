/*
还款计划 
作者:bhg
*/
define(function(require,exports,module){
	require.async(['dicTool','bootstrap',"datePicker"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("./libs/validate");
    var tipbar = require("./libs/tooltip");
    var common = require("./libs/common");
    var loading = require("./libs/loading");
    var comdirect = require("./libs/commondirect");
	
	require('angular');

	//定义模块
	var mainApp = angular.module('mainApp',[]);

	//扩充公共指令库
	comdirect.direcPlus(mainApp);

	//兼容IE模式
	// .config(function($sceProvider){
	// 	$sceProvider.enabled(false);
	// })

	//控制器区域
	mainApp.controller('testController',function($scope){
		/*VM绑定区域*/
		//分页数据
		$scope.tradeListPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//搜索所需信息
		$scope.searchData = {
			GTEtradeDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEtradeDate :new Date().format('YYYY-MM-DD'),
			applyCode:'',
			reCode:''
		};

		/*事件处理区域*/
		//查看详情按钮
		$scope.showDetail = function(event){
			var target = $(event.target||event.srcElement);
			$('#fix_operator_info_box').height($('body').height()).slideDown();
		};

		//关闭下拉帘
		$scope.backForward = function(){
			$('#fix_operator_info_box').slideUp();
		};


		//日期处理
		$scope.dateEmitter = {
			changeDateInfo : function(event){
				var target = event.target||event.srcElement;
				var dateName = $(target).attr('dateName'),
				dateData = $(target).attr('dateData');
				$scope[dateData][dateName] = target.value;
			}
		};
		
		//分页事件
		$scope.pageEmitter = {
			firstPage : function(){
				currentData.tradeListPage.pageNum=1;
				_personModule.reFreshTradList(false);
			},
			endPage : function(){
				currentData.tradeListPage.pageNum=currentData.tradeListPage.pages;
				_personModule.reFreshTradList(false);
			},
			prevPage : function(){
				currentData.tradeListPage.pageNum--;
				_personModule.reFreshTradList(false);
			},
			nextPage : function(){
				currentData.tradeListPage.pageNum++;
				_personModule.reFreshTradList(false);
			},
			skipPage : function(data,event){
				var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
				if(isNaN(pageNum)||pageNum.split('.').length>1||Number(pageNum)<1||Number(pageNum)>currentData.tradeListPage.pages){
					$('#fund_list_page [name="skipToPageNum"]').val('');
					tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000);
					return;
				}
				currentData.tradeListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
				$('#fund_list_page [name="skipToPageNum"]').val('');
				_personModule.reFreshTradList(false);
			}
		};

		/*外部事件绑定*/
		window.dateEmitter = {
			changeDateInfo:function(){

			}
		};
	});

	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

