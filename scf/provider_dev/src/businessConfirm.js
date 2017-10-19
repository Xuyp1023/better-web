/*
业务确认查询
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
	mainApp.controller('mainController',['$scope','mainService','$timeout',function($scope,mainService,$timeout){
		/*VM绑定区域*/
		$scope.productList = [];
		$scope.custList = [];
		$scope.proKindList = BTDict.FinancingAppType.toArray('value','name');
		$scope.searchData = {
			custNo : '',
			billNo:'',
			supplier:'',
			GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEregDate :new Date().format('YYYY-MM-DD')
		};
		$scope.statusList = BTDict.ElecSignContractStatus.toArray('value','name');
		$scope.today = new Date().format('YYYY-MM-DD');
		$scope.signList = [];
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//业务确认列表
		$scope.infoList = [];
		//单个业务确认信息
		$scope.info = {};

		$scope.downloadurl = BTPATH.DOWNLOADCON+'?appNo=';

		$scope.contracturl = BTPATH.GET_STATIC_PAGE+'?appNo=';

		/*事件处理区域*/
		//查询业务确认
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//获取业务未确认列表 测试/正式路径:/CoreEnter/unConfirmList
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			$scope.listPage.flag = flag? 1 : 2;
			loading.addLoading($('#search_info table'),common.getRootPath());
			$.post(BTPATH.CON_LIST_PATH,$.extend({},$scope.searchData,$scope.listPage),function(data){
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
			$.post(BTPATH.FAC_PRO_PATH,{custNo:0},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.productList = data.data;
						$scope.searchData.productId = data.data[0].productId;
					});
					if(callback) callback();
				}
			},'json');
		};

		//合同相关文件展示
		$scope.getStaticPage = function(){
			$.post(BTPATH.GET_STATIC_PAGE,{"appNo":$scope.info.appNo},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					//获取iframe
					$detail_iframe = $(document.getElementById("detail_iframe").contentWindow.document);
					//动态修改iframe中内容
					$detail_iframe.find("body").html(data.data);
					//根据内容修改iframe高度
					/*var height = $detail_iframe.find("#container").height();
					$("#detail_iframe").height(height+20);*/
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

		//确认单个信息操作
		$scope.confirmInfo = function(target){
			var $target = $(target);
			//校验验证码
			if($scope.checkCode===''){
				tipbar.errorLeftTipbar($target,'您还未填写验证码,请填写后再提交!',3000,99999);
				return;
			}
			$.post(BTPATH.SEND_VALID_CODE,{appNo:$scope.info.appNo,custType:'core',vCode:$scope.checkCode},function(data){
				if(data&&(data.code === 200)){
					tipbar.errorTopTipbar($target,'已成功签署!',1500,99999,function(){
						$scope.hideInfoDetail();
						$scope.searchList();
					});
				}else{
					tipbar.errorTopTipbar($target,'签署失败,返回信息:'+data.message,3000,99999);
				}
			},'json');
		};

		//取消单个信息
		$scope.forbiddenContr = function(){
			$.post(BTPATH.CANCEL_CONTRACT,$scope.info,function(data){
				if(data&&(data.code === 200)){
					tipbar.errorTopTipbar($target,'该合同已成功作废!',1500,99999,function(){
						$scope.hideInfoDetail();
						$scope.searchList();
					});
				}else{
					tipbar.errorTopTipbar($target,'作废失败,返回信息:'+data.message,3000,99999);
				}
			},'json');
		};

		/*获取验证码相关*/
		$scope.initSecond = 60;

		$scope.isCanGet = true;

		$scope.checkCode = '';

		$scope.setCodeInterval = function(){
			$scope.isCanGet = false;
			var inter = setInterval(function() {
				$scope.$apply(function(){
					if($scope.initSecond<1){
						$scope.initSecond = 60;
						$scope.isCanGet = true;
						clearInterval(inter);
					}
					$scope.initSecond--;
				});
			},1000);
			$.post(BTPATH.GET_VALID_CODE,{appNo:$scope.info.appNo,custType:'core'},function(){},'json');
		};


		//账号切换
		$scope.changeCust = function(){
			$scope.queryList(true);
		};

		//页面初始化
		$scope.initPage = function(){
			$scope.queryCustList(function(){
				$scope.queryList(true);
			});
		};

		//查看单个业务确认详情
		$scope.showInfoDetail = function(data){
			$scope.info = data;
			$scope.signList = data.stubInfos;
			$scope.getStaticPage();
			$('#fix_operator_info_box').slideDown('fast',function(){
				common.resizeIframe();
			});
		};

		//关闭业务确认详情
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

