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
    var comfilter = require("./libs/commonfilter");
    var BTPATH = require("./libs/commonpath");
    var pages = require("./libs/pages");
	
	require('angular');

	//定义模块
	var mainApp = angular.module('mainApp',['pagination']);

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
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//搜索所需信息
		$scope.searchData = {
			custNo:"0",	//为0查询供应商对应所有核心企业的申请单列表
			GTErequestDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTErequestDate :new Date().format('YYYY-MM-DD'),
			factorRequestNo:'',
			productId:''
		};

		$scope.prePath = BTServerPath+'/scf/app/factoring';

		//保理产品列表
		$scope.productList = [];

		//保理申请单列表
		$scope.facApplyList = [];

		//保理申请单详情
		$scope.factoringDetail = {};

		//发票列表
        $scope.invoiceList = [];	

        //合同附件列表
        $scope.agreeAttachList = [];
        
        //票据附件列表
        $scope.billAttachdList = [];	

        //分页 监听
        $scope.$watch('tradeListPage.pageNum', function(newValue,oldValue){
        	if(newValue!==oldValue){
        		$scope.reFreshFacApplyList(false);
        	}
        });


        //获取保理产品列表 
		$scope.queryFacList = function(){
			$.post(BTPATH.FAC_PRO_PATH,{"custNo":0},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.productList = data.data;
					});
				}
			},'json');
		};


		//刷新保理申请列表数据	
		$scope.reFreshFacApplyList = function(flag){
			$scope.tradeListPage.flag = flag ? 1 : 2;
			//弹出弹幕加载状态
			loading.addLoading($('#search_info table'),common.getRootPath());
			$.post(BTPATH.CREDIT_LIST_PATH,$.extend({},$scope.tradeListPage,$scope.searchData),function(data){
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
				/*common.resizeIframe();*/
			},'json');
		};



		//查询附件列表（合同 + 票据）	
		$scope.getAttachment = function(){
			$.post(BTPATH.PLUS_PATH,{"billId":$scope.factoringDetail.billId},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						//根据附件类别分别添加
						$scope.billAttachdList = ArrayPlus(data.data).objectChildFilter('fileInfoType','billAccessory');
   						$scope.agreeAttachList = ArrayPlus(data.data).objectChildFilter('fileInfoType','agreeAccessory');
					});
				}
			},'json');
		};


		//获取票据对应的发票列表	
		$scope.reFreshInvoiceList = function(){
			$.post(BTPATH.INVO_LIST,{"billId":$scope.factoringDetail.billId},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.invoiceList = common.cloneArrayDeep(data.data);
					});
				}
			},'json');
		};


		/*事件处理区域*/
		//查看详情按钮
		$scope.showDetail = function(data){
			$scope.factoringDetail = data;
			$('#fix_operator_info_box').slideDown('fast',function(){
				//获取发票列表
				$scope.reFreshInvoiceList();
				//初始化附件
				$scope.getAttachment();
				// common.resizeIframe();
			});
		};

		//关闭下拉帘
		$scope.backForward = function(){
			$('#fix_operator_info_box').slideUp();
			$scope._editBillAfter();
			common.pageSkip($("#fund_search_way"));
		};

		//关闭下拉栏 后续数据处理（清空）
		$scope._editBillAfter = function(){
			$scope.factoringDetail = {};
			$scope.invoiceList = [];
			$scope.agreeAttachList = [];
			$scope.billAttachdList = [];
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
		

		/*公共绑定*/
 		$scope.$on('ngRepeatFinished',function(){
  			common.resizeIframeListener();  
    	});

 		

		//判断页面入口 
    	var billId = location.href.split('#')[1];
    	//没有参数，正常加载 - 融资申请查询
    	if(!billId){
    		//初始化申请单列表
			$scope.reFreshFacApplyList(true);
			//初始化保理产品列表
			$scope.queryFacList();
    	}
    	//从应收账款链接到详情
    	else{
        	$scope.backToRecieve = true;
			$.post(BTPATH.CREDIT_DETAIL_PATH,{billId:billId},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.showDetail(data.data);
					});
				}
			},'json');	
    	}



	}]);

	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

