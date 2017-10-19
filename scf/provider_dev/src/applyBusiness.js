/*
应收账款 
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
		return {
			//初始化核心企业列表
		};
	}]);

	//控制器区域
	mainApp.controller('mainController',['$scope','mainService',function($scope,mainService){
		/*VM绑定区域*/
		$scope.billInfo = {
			productId:''
		};
		$scope.isAgree = false;
		$scope.facList = [];
		$scope.invoList = [];
		$scope.conUploadList = [];
		$scope.billUploadList = [];
		$scope.cacheBalance = '';


		/*事件处理区域*/
		
		//获取单据信息 测试路径: /scf/testdata/querybillDetail.json
		$scope.queryBillDetail = function(callback){
			var billId = location.href.split('#')[1];
			$.post(BTPATH.BILL_DETAIL,{id:billId},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						data.data.productId = $scope.billInfo.productId;
						data.data.billId = data.data.id;
						data.data.applyMoney = data.data.balance;
						data.data.bigBalance = common.capitalRMB(Number(data.data.balance))
						$scope.billInfo = data.data;
					});
					if(callback) callback();
				}
			},'json');
		};

		//获取保理产品列表
		$scope.queryFacList = function(callback){
			$.post(BTPATH.FAC_PRO_PATH,{custNo:$scope.billInfo.buyerNo},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.facList = data.data;
						$scope.billInfo.productId = data.data[0].factorCode;
						//加入字典
						var tempCustInfo = new ListMap();
						for(var index in data.data){
							var temp = data.data[index];
							tempCustInfo.set(temp.factorCode,temp.factorName);
						}
						BTDict.BillProductInfo = tempCustInfo;
					});
					if(callback) callback();
				}
			},'json');
		};

		//获取发票信息 测试路径:/scf/testdata/invoList.json
		$scope.queryInvoList = function(){
			$.post(BTPATH.INVO_LIST,{billId:$scope.billInfo.id},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.invoList = data.data;
					});
				}
			},'json');
		};

		//获取票据以及合同附件 测试路径:/scf/testdata/uploadList.json
		$scope.queryUploadList = function(){
			$.post(BTPATH.PLUS_PATH,{billId:$scope.billInfo.id},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.conUploadList = ArrayPlus(data.data).objectChildFilter('fileInfoType','agreeAccessory');
						$scope.billUploadList = ArrayPlus(data.data).objectChildFilter('fileInfoType','billAccessory');
					});
				}
			},'json');
		};

		//确定申请
		$scope.confirmApply = function(target){
			var result=validate.validate($('#apply_form'));
			$target=$(event.target);
			if (!result) {
				tipbar.errorLeftTipbar($target,'您还有信息项没有正确填写!',3000,99999);
				return;
			}
			if(!$scope.isAgree){
				tipbar.errorTopTipbar($(target),'请先确认同意申请保理选项!');
				return;
			}
			var billInfo = $.extend({},$scope.billInfo);
			billInfo.balance = billInfo.applyMoney;
			$.post(BTPATH.ADD_FAC,billInfo,function(data){
				if(data&&(data.code===200)){
					tipbar.errorTopTipbar($(target),'申请成功,请等待审核!');
				}else{
					tipbar.errorTopTipbar($(target),'申请失败,服务器返回信息:'+data.message);
				}
			},'json');
		};

		//同化生成大写金额
		$scope.validMoney = function(target){
			var $target = $(target),
				balance = $target.val(),
				reg = /^([1-9]\d+\.?(\d{1,2})?)$|^([0-9]\.?(\d{1,2})?)$/;
			if(!reg.test(balance)){
				$scope.billInfo.applyMoney = $scope.cacheBalance;
				return;
				// tipbar.errorTopTipbar($(target),'请填写正确的金额!');
			}else if(Number(balance)>Number($scope.billInfo.balance)){
				$scope.billInfo.applyMoney = $scope.cacheBalance;
				$scope.billInfo.bigBalance = common.capitalRMB($scope.billInfo.applyMoney);
				tipbar.errorTopTipbar($(target),'申请保理金额不能高于商业汇票金额!',2000);
				return;	
			}else{
				$scope.cacheBalance = balance;
				$scope.billInfo.bigBalance = common.capitalRMB(Number(balance));
			}
		};

		/*公共绑定*/
		$scope.$on('ngRepeatFinished',function(){
			common.resizeIframe();  
		});
		
		/*数据初始区域*/
			$scope.queryBillDetail(function(){
				$scope.queryFacList();
				$scope.queryInvoList();
				$scope.queryUploadList();
			});
		/*$.post(common.getRootPath()+'/tokenLogin?ticket=12345',{},function(){
			//初始化票据信息
		});*/

		/*表单验证*/
      	validate.validate($('#apply_form'), {
			elements:[
				{
      	          name: 'applyMoney',
      	          rules: [{
      	              name: 'money'
      	          }],
      	          events: ['blur']
      	      	}
			],   
			errorPlacement: function(error, element) {
				var label = element.parents('td').prev().text().substr(0);
				tipbar.errorLeftTipbar(element,error,3000,99999);
			}
      	});

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

