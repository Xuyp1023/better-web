/*
还款计划 
作者:bhg
*/
define(function(require,exports,module){
	require.async(['dicTool','bootstrap'],function(){
	require.async(['BTDictData'],function(){
	var validate = require("./libs/validate");
    var tipbar = require("./libs/tooltip");
    var common = require("./libs/common");
    var loading = require("./libs/loading");
    var comdirect = require("./libs/commondirect");
    var comfilter = require("./libs/commonfilter");
    var BTPATH = require("./libs/commonpath");
    require('./libs/modal');
    require('./libs/date');
	
	require('angular');

	//定义模块
	var mainApp = angular.module('mainApp',['modal','date']);

	//扩充公共指令库
	comdirect.direcPlus(mainApp);
	//扩充公共过滤器
	comfilter.filterPlus(mainApp);

	//兼容IE模式
	// .config(function($sceProvider){
	// 	$sceProvider.enabled(false);
	// })

	//控制器区域
	mainApp.controller('testController',['$scope',function($scope){
		/*VM绑定区域*/
		//分页数据
		$scope.tradeListPage = {
			pageNum: 1,
			pageSize: 5,
			pages: 1,
			total: 5
		};

		//搜索所需信息
		$scope.searchData = {
			GTErequestDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTErequestDate :new Date().format('YYYY-MM-DD'),
			custNo : '',
			requestNo : '',
			productId : '',
			supplier:''
		};
		//保理产品列表	
		$scope.productList = [];

		//核心企业账户列表
		$scope.custList = [];

		//申请单列表
		$scope.facApplyList = [];

		//申请单详情
		$scope.factoringDetail = {};


		//获取核心企业账户列表		
		$scope.queryCustList = function(){
			$.post(BTPATH.CUST_PATH,{},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.custList = data.data;
						//默认选中列表第一个核心企业
						$scope.searchData.custNo = data.data[0].value;
						$scope.custChangeFresh();
					});
				}
			},'json');
		};


		//核心企业变更（保理产品和申请单列表刷新）
		$scope.custChangeFresh = function(){
			//产品列表重刷新
			$scope.queryProList();
			//申请单列表刷新
			$scope.reFreshFacApplyList(true);
		};


		//获取保理产品列表		
		$scope.queryProList = function(){
			$.post(BTPATH.FAC_PRO_PATH,{"custNo":$scope.searchData.custNo},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.productList = data.data;
						$scope.searchData.productId = '';
					});
				}
			},'json');
		};


		//刷新申请单列表数据	
		$scope.reFreshFacApplyList = function(flag){
			$scope.tradeListPage.flag = flag ? 1 : 2;
			//弹出弹幕加载状态
			loading.addLoading($('#search_info table'),common.getRootPath());
			$.post(BTPATH.CORE_COMPLETE_FAC_PATH,$.extend({},$scope.searchData,$scope.tradeListPage),function(data){
				//关闭加载状态弹幕
				loading.removeLoading($('#search_info table'));
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.facApplyList = common.cloneArrayDeep(data.data);
						if(flag){
							$scope.tradeListPage = data.page;
						}
					});
				}
			},'json');
		};


		/*事件处理区域*/
		//查看详情按钮
		$scope.showDetail = function(detail){
			$('#fix_operator_info_box').height($('body').height()).slideDown();
			$scope.factoringDetail = detail;
		};

		//关闭下拉帘
		$scope.backForward = function(){
			$('#fix_operator_info_box').slideUp();
		};


		//分页事件
		$scope.pageEmitter = {
			firstPage : function(){
				$scope.tradeListPage.pageNum=1;
				$scope.reFreshFacApplyList(false);
			},
			endPage : function(){
				$scope.tradeListPage.pageNum=$scope.tradeListPage.pages;
				$scope.reFreshFacApplyList(false);
			},
			prevPage : function(){
				$scope.tradeListPage.pageNum--;
				$scope.reFreshFacApplyList(false);
			},
			nextPage : function(){
				$scope.tradeListPage.pageNum++;
				$scope.reFreshFacApplyList(false);
			},
			skipPage : function(event){
				var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
				if(isNaN(pageNum)||pageNum.split('.').length>1||Number(pageNum)<1||Number(pageNum)>$scope.tradeListPage.pages){
					$('#fund_list_page [name="skipToPageNum"]').val('');
					tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000);
					return;
				}
				$scope.tradeListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
				$('#fund_list_page [name="skipToPageNum"]').val('');
				$scope.reFreshFacApplyList(false);
			}
		};

		/*外部事件绑定*/
		// //日期处理
		// $scope.dateEmitter = {
		// 	changeDateInfo : function(event){
		// 		var target = event.target||event.srcElement;
		// 		var dateName = $(target).attr('dateName'),
		// 		dateData = $(target).attr('dateData');
		// 		$scope[dateData][dateName] = target.value;
		// 	}
		// };

		/*公共绑定*/
 		$scope.$on('ngRepeatFinished',function(){
  			common.resizeIframe();  
    	});


		/*数据初始区域*/
/*		$.post(common.getRootPath()+'/tokenLogin?ticket=123',{},function(){	
			
		});*/

		//初始化核心企业账户列表
		$scope.queryCustList();
		


	}]);

	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

