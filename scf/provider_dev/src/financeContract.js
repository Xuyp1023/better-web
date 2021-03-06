/*
融资合同管理
作者:herb
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

	//控制器区域
	mainApp.controller('mainController',['$scope',function($scope){
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
			GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEregDate :new Date().format('YYYY-MM-DD'),
			signStatus : ''
		};

		//电子合同列表
		$scope.AgreementList = [];

		//合同详情信息
		$scope.AgreementDetail = {};

		//合同状态列表
		$scope.AgreeStatusList = [];

		//验证信息
		$scope.identifyInfo = {
			//是否允许发送验证码
			canSend:"true",
			//读秒提示信息
			timerMsg:"",
			//输入的验证码
			verifyCode:""
		};

		
		//验证码倒计时
		var timer;
		$scope.countDown = function(){
			var count = 30;
			//倒计时 读秒
		    timer = setInterval(function(){
		    	if(count === 0){
		    		$scope.$apply(function(){
		    			$scope.identifyInfo.canSend = true;
		    		});
		    		clearInterval(timer);
		    	}else{
		    		$scope.$apply(function(){
		    			count-- ;
		    			$scope.identifyInfo.canSend = false;
		    			$scope.identifyInfo.timerMsg = count + "秒后可重新发送";
		    		});
		    	}
		    },1000);
		};

		//清除验证码计时器
		function _clearTimer(){
			clearInterval(timer);
			$scope.identifyInfo.canSend = true;
			$scope.identifyInfo.timerMsg = "";
		}


		//刷新电子合同数据
		$scope.reFreshAgreementList = function(flag){
			$scope.tradeListPage.flag = flag ? 1 : 2;
			//弹出弹幕加载状态
			loading.addLoading($('#search_info table'),common.getRootPath());
			$.post(BTPATH.ELEC_CONTR_LIST,$.extend({},$scope.searchData,$scope.tradeListPage),function(data){
				//关闭加载状态弹幕
				loading.removeLoading($('#search_info table'));
				if((data!==undefined)&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.AgreementList = common.cloneArrayDeep(data.data);
						if(flag){
							$scope.tradeListPage = data.page;
						}
					});
				}
			},'json');
		};


		//初始化 合同状态下拉列表
		$scope.initAgreeStatusList = function(){
			$scope.AgreeStatusList = BTDict.ElecSignContractStatus.toArray('value','text');
		};


		//向客户发送验证码
		$scope.sendIdentifyCode = function(){
			var param={
				custType:"supply",
				appNo:$scope.AgreementDetail.appNo
			};
			$.post(BTPATH.GET_VALID_CODE,param,function(data){
				if(data.code === 200 && (data.data===true || data.data==="true")){
					//倒计时读秒
					$scope.countDown();
				}
			},'json');
		};


		//签署合同
		$scope.signAgreement = function(target){
			var param={
				custType:"supply",
				appNo:$scope.AgreementDetail.appNo,
				vCode:$scope.identifyInfo.verifyCode
			};
			if(!$scope.identifyInfo.verifyCode){
				tipbar.errorLeftTipbar($(target),'请输入验证码！',3000,999999);
				return;
			}
			$.post(BTPATH.SEND_VALID_CODE,param,function(data){
				if(data.code === 200&& (data.data===true || data.data==="true")){
					tipbar.infoTopTipbar('合同签署成功！', {});
					//刷新合同列表
					$scope.reFreshAgreementList(false);
					$scope.backForward();
				}else{
					//清除定时器，重新校验 	
					_clearTimer();
					tipbar.errorLeftTipbar($(target),'验证码不正确！',3000,999999);
				}
			},'json');
		};


		//拒绝签署
		$scope.refuseSign = function(target){
			$.post(BTServerPath+"/ElecAgree/cancelElecAgreement",{appNo:$scope.AgreementDetail.appNo},function(data){
				if(data.code === 200&& (data.data===true || data.data==="true")){
					tipbar.infoTopTipbar('拒绝成功！', {});
					//刷新合同列表
					$scope.reFreshAgreementList(false);
					$scope.backForward();
				}else{
					tipbar.errorLeftTipbar($(target),'服务器提了一个问题，请稍后再试！',3000,999999);
				}
			},'json');
		};
		

		//合同相关文件展示
		$scope.getStaticPage = function(){
			$.post(BTPATH.GET_STATIC_PAGE,{"appNo":$scope.AgreementDetail.appNo},function(data){
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


		//生成下载电子合同(PDF格式）的URL
		$scope.initDownPDFUrl = function(){
			var downURL = BTServerPath + "/ElecAgree/downloadAgreePDF?appNo=" + $scope.AgreementDetail.appNo;
			$scope.AgreementDetail.downURL = downURL;
		};


		/*事件处理区域*/
		//合同签署及详情下拉框
		$scope.showDetailPanel = function(data){
			$scope.AgreementDetail = $.extend({},data);
			//获取静态页面
			$scope.getStaticPage();
			//生成下载URL
			$scope.initDownPDFUrl();
			$('#fix_operator_info_box').slideDown('fast',function(){
				common.resizeIframe(500);
			});
		};

		//关闭下拉帘
		$scope.backForward = function(){
			$('#fix_operator_info_box').slideUp();
			common.pageSkip($("#search_info"));
			common.cleanPageTip();
			_clearTimer();
			$scope.identifyInfo.verifyCode = "";
			$scope.AgreementDetail = {};
		};


		//分页事件
		$scope.pageEmitter = {
			firstPage : function(){
				$scope.tradeListPage.pageNum=1;
				$scope.reFreshAgreementList(false);
			},
			endPage : function(){
				$scope.tradeListPage.pageNum=$scope.tradeListPage.pages;
				$scope.reFreshAgreementList(false);
			},
			prevPage : function(){
				$scope.tradeListPage.pageNum--;
				$scope.reFreshAgreementList(false);
			},
			nextPage : function(){
				$scope.tradeListPage.pageNum++;
				$scope.reFreshAgreementList(false);
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
				$scope.reFreshAgreementList(false);
			}
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
			common.resizeIframe();  
		});

		//刷新电子合同列表
		$scope.reFreshAgreementList(true);
		//初始化合同状态列表
		$scope.initAgreeStatusList();

	}]);


	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

