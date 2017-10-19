/*
额度查询
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
    var dialog = require("./libs/dialog");
    var comfilter = require("./libs/commonfilter");
    var BTPATH = require("./libs/commonpath");
	
	require('angular');

	//定义模块
	var mainApp = angular.module('mainApp',[]);

	//扩充公共指令库
	comdirect.direcPlus(mainApp);

	//扩充公共过滤器
	comfilter.filterPlus(mainApp);

	//兼容IE模式
	// .config(function($sceProvider){
	// 	$sceProvider.enabled(false);
	// })

	//业务模块
	mainApp.service('mainService',['$rootScope',function($rootScope){
		return {};
	}]);

	//控制器区域
	mainApp.controller('mainController',['$scope','mainService',function($scope,mainService){
		/*VM绑定区域*/
		$scope.productList = [];
		$scope.custList = [];
		$scope.creditInfo = [];
		$scope.isSelectShow = true;
		$scope.searchData = {
			custNo : '',
			GTEtradeDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEtradeDate :new Date().format('YYYY-MM-DD')
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//额度列表
		$scope.infoList = [];
		//单个额度信息
		$scope.info = {};

		/*事件处理区域*/
		//查询额度
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//获取额度申请列表 测试/正式路径:/ScfRequest/queryRequest
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			loading.addLoading($('#search_info table'),common.getRootPath());
			var custNo = $scope.searchData.custNo;
			$scope.listPage.flag = flag? 1 : 2;
			if($scope.flag !== 'core') custNo = '0';
			$.post(BTPATH.CREDIT_LIST_PATH,$.extend({},$scope.listPage,{custNo:custNo}),function(data){
				//关闭加载状态弹幕
				loading.removeLoading($('#search_info table'));
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.infoList = common.cloneArrayDeep(data.data);
						if(flag){
							$scope.listPage = data.page;
						}
					});
				}
			},'json');
		};

		//获取保理产品列表 测试/正式路径:/ScfRequest/queryFactorProduct
		$scope.queryFacList = function(callback){
			var custNo = $scope.searchData.custNo;
			if($scope.flag !== 'core') custNo = '0';
			$.post(BTPATH.FAC_PRO_PATH,{custNo:custNo},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					//填充字典数据
					var tempCustInfo = new ListMap();
					for(var index in data.data){
						var temp = data.data[index];
						tempCustInfo.set(temp.factorCode,temp.factorName);
					}
					BTDict.BillProductInfo = tempCustInfo;
					if(callback) callback();
				}
			},'json');
		};

		//获取核心企业账户列表 测试/正式路径:/ScfRequest/queryCustomer
		$scope.queryCustList = function(callback){
			$.post(BTPATH.CUST_PATH,{},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.custList = data.data;
						$scope.searchData.custNo = data.data[0].value;
					});
					if(callback) callback();
				}
			},'json');
		};

		//获取企业授信信息 测试/正式路径:/ScfRequest/queryCredit
		$scope.queryCredit = function(){
			var custNo = $scope.searchData.custNo;
			// if($scope.flag !== 'core') custNo = '0';
			$.post(BTPATH.CREDIT_PATH,{custNo:custNo},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.creditInfo = data.data;
					});
				}
			},'json');
		};

		//账号切换
		$scope.changeCust = function(){
			$scope.queryCredit();
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//页面初始化
		$scope.initPage = function(){
			$scope.flag = location.hash.split('#')[1];
			if($scope.flag !== 'core') $scope.isSelectShow = false;
			$scope.queryCustList(function(){
				$scope.queryFacList(function(){
					$scope.queryCredit();
					$scope.queryList(true);
				});
			});
		};

		//查看单个额度详情
		$scope.showInfoDetail = function(data){
			$scope.info = data;
			$('#fix_operator_info_box').slideDown('fast',function(){
				$scope.queryUploadList();
			});
		};

		//关闭额度详情
		$scope.hideInfoDetail = function(){
			$('#fix_operator_info_box').slideUp('fast');
		};

		/*公共绑定*/
		$scope.$on('ngRepeatFinished',function(){
			common.resizeIframe();  
		});

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
				$scope.tradeListPage.pageNum=1;
				$scope.queryList(false);
			},
			endPage : function(){
				$scope.tradeListPage.pageNum=$scope.tradeListPage.pages;
				$scope.queryList(false);
			},
			prevPage : function(){
				$scope.tradeListPage.pageNum--;
				$scope.queryList(false);
			},
			nextPage : function(){
				$scope.tradeListPage.pageNum++;
				$scope.queryList(false);
			},
			skipPage : function(data,event){
				var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
				if(isNaN(pageNum)||pageNum.split('.').length>1||Number(pageNum)<1||Number(pageNum)>$scope.tradeListPage.pages){
					$('#fund_list_page [name="skipToPageNum"]').val('');
					tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000);
					return;
				}
				$scope.tradeListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
				$('#fund_list_page [name="skipToPageNum"]').val('');
				$scope.queryList(false);
			}
		};

		/*数据初始区域*/
		$scope.initPage();
		

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

