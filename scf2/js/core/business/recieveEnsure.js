/*
	应收账款转让确认
	@anthor : herb
*/

define(function(require,module,exports){

	require.async(['dicTool','bootstrap',"datePicker"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("validate");
    var tipbar = require("tooltip");
    var common = require("common");
    var loading = require("loading");
    var comdirect = require("direct");
    var comfilter = require("filter");
    var comservice = require("service_s2");
    var BTPATH = require("path_s2");
    var pages = require("pages");
    var upload = require("upload");
    var date = require("date");
    require('modal');


	//定义模块
	var mainApp = angular.module('mainApp',['pagination','modal','upload','date']);

	//扩充公共指令库|过滤器|服务
	comdirect.direcPlus(mainApp);
	comfilter.filterPlus(mainApp);
  	comservice.servPlus(mainApp);

	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService','detailShow',function($scope,http,commonService,detailShow){
		/*基础数据*/
		//授信方式
		$scope.creditModes = BTDict.CreditMode.toArray('value','name');
		//融资类型
		$scope.requestTypes = BTDict.RaiseCapitalType.toArray('value','name');
		//期限单位
		$scope.periodUnits = BTDict.PeriodUnit.toArray('value','name');
		//核心企业确认签约状态
		$scope.confirmStatus = BTDict.ConfirmSignStatus.toArray('value','name');
		//是否签约
		$scope.approvalResult = '';
		

		//核心企业列表
		$scope.coreCustList = [];
		//保理公司列表
		$scope.factorCompList = [];
		//供应商列表
		$scope.supplierList = [];

		//订单分页配置
		$scope.pageConf = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};

		//供应商贷款方案列表
		$scope.loanList = [];

		//融资详情
		$scope.financeInfo = {};

		//查询条件
		$scope.searchData = {
			// "custNo":'',
			"coreCustNo":''
			// "factorNo":''
		};

		$scope.contractList = [];		//合同列表
		$scope.paymentRecordList = [];	//还款记录列表
		$scope.pressMoneyList = [];		//催收列表
		$scope.exemptList = [];			//豁免列表
		$scope.loanInfo = {};			//审贷详情（贷款方案）
		$scope.otherInfoList = [];		//其他资料列表


		/*关联 VM-------------------------------------------------------*/
		$scope.orderList = [];	//订单列表
		$scope.recieveList = [];//应收账款列表
		$scope.billList = [];	//票据列表

		/* 关联列表 配置 */
		var _linkedConfig = {
			1:{
				type:'order',
				list_name:'orderList'		//列表VM名称
			},
			2:{
				type:'bill',
				list_name:'billList'		//列表VM名称
			},
			3:{
				type:'recieve',
				list_name:'recieveList'	  	//列表VM名称
			},
			4:{	//供应商融资，也是查询订单列表
				type:'order',
				list_name:'orderList'		//列表VM名称
			}
		};
		// 关联类型（即融资申请类型）
		$scope.linkedType = '';

		//重置数据
		function resetData(){
			//置空关联列表
			$scope.orderList = [];	
			$scope.recieveList = [];
			$scope.billList = [];	
		}
		/*关联 VM-------------------------------------------------------*/



		//-------------------------------发送短信验证码 相关 start --------------------------

		//签约验证信息
		$scope.identifyInfo = {
			//是否允许发送验证码
			canSend:true,
			//读秒提示信息
			timerMsg:"",
			//输入的验证码
			verifyCode:""
		};

		//验证码倒计时
		var timer;
		$scope.countDown = function(){
			var count = 30;
			$scope.$apply(function(){
				$scope.identifyInfo.canSend = false;
			});
			common.resizeIframeListener();
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
		    			$scope.identifyInfo.timerMsg = count + "秒后可重新发送";
		    		});
		    	}
		    },1000);
		};

		//清除验证码计时器
		function _clearTimer(){
			clearInterval(timer);
			$scope.identifyInfo = {
				canSend:true,
				timerMsg:"",
				verifyCode:""
			};
		}

		//向客户发送验证码
		$scope.sendIdentifyCode = function(){
			var param={
				requestNo:$scope.financeInfo.requestNo,
				agreeType:1	//'1','转让确认书'
			};
			http.post(BTPATH.FIND_VALIDCODE_BY_REQUESTNO,param).success(function(data){
			    if( data && data.code === 200){
					//倒计时读秒
					$scope.countDown();
				}
			});
		};
		//-------------------------------发送短信验证码 相关 end --------------------------



		//核心企业变化 带动申请企业与保理公司变化
		$scope.coreCustChange = function(){
			//供应商列表
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.searchData.coreCustNo},$scope,'supplierList').success(function(){
				// $scope.searchData.custNo = $scope.supplierList[0] ? $scope.supplierList[0].value:'';
				$scope.searchData.custNo = '';
				//保理商列表
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:$scope.searchData.coreCustNo},$scope,'factorList').success(function(){
					// $scope.searchData.factorNo = $scope.factorList[0] ? $scope.factorList[0].value:'';
					$scope.searchData.factorNo = '';
					//查询融资列表
					$scope.reFreshLoanList(true);
				});
			});
		};


		//查询
		$scope.searchList = function(flag){
			$scope.reFreshLoanList(flag);
		};

		//刷新供应商融资（借贷方案）列表
		$scope.reFreshLoanList = function(flag,data){
		    //是否需要分页信息 1：需要 2：不需要
		    $scope.pageConf.flag = flag ? 1 : 2;
		    //弹出弹幕加载状态
		    loading.addLoading($('#search_info table'),common.getRootPath());
		    // requestType ：1|供应商
		    http.post(BTPATH.QUERY_LOAN_SCHEME_LIST ,$.extend({requestType:1},$scope.pageConf,$scope.searchData) ).success(function(data){
		        //关闭加载状态弹幕
		        loading.removeLoading($('#search_info table'));
		        if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
		          $scope.$apply(function(){
		              $scope.loanList = common.cloneArrayDeep(data.data);
		              if(flag){
		                $scope.pageConf = data.page;
		              }
		          });
		        }   
		    });
		};


		//查询融资详情 传入申请单编号
		$scope.queryFinanceInfo = function(requestNo){
			var promise = http.post(BTPATH.QUERY_FINANCE_DETAIL,{"requestNo":requestNo}).success(function(data){
			    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
			      $scope.$apply(function(){
			          $scope.financeInfo = data.data;
			      });
			    }   
			});
			return promise;
		};

		//查询审贷详情（贷款方案）
		$scope.queryLoanSchemeInfo = function(requestNo){
			var promise = http.post(BTPATH.FIND_LOAN_SCHEME_DETAIL,{"requestNo":requestNo}).success(function(data){
			    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
			      $scope.$apply(function(){
			          $scope.loanInfo = data.data;
			      });
			    }   
			});
			return promise;
		};


		//查询关联列表（订单|应收账款|票据）
		$scope.querySelectList = function(data){
		  //置空关联类型
		  $scope.linkedType = '';
		  var requestType = data.requestType,
		      requestNo = data.requestNo,
		      config = _linkedConfig[requestType];
		  if(requestType && config){
		    //设置关联类型
		    $scope.linkedType = config.type;
		    http.post(BTPATH.FIANACE_REQUEST_LINKED_LIST,{"requestType":requestType,"requestNo":requestNo}).success(function(data){
		        if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
		          $scope.$apply(function(){
		              $scope[config.list_name] = common.cloneArrayDeep(data.data);
		          });
		        }   
		    });
		  }
		};


		//查询补充资料列表
		$scope.queryOtherInfoList = function(requestNo){
			if(!requestNo) return;
			http.post(BTPATH.QUERY_OTHER_FILE_LIST,{"requestNo":requestNo}).success(function(data){
			    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
			      $scope.$apply(function(){
			          $scope.otherInfoList = common.cloneArrayDeep(data.data);
			      });
			    }  
			});
		};
		

		//背景确认
		$scope.backgroundConfirm = function(target){
			var validCode = $scope.identifyInfo.verifyCode;
			// 2:拒绝签署
			if($scope.approvalResult*1!==2 && !validCode){
				tipbar.errorTopTipbar($(target),"请填写验证码！",3000,9992);
				return;
			}
			var param = {
				"requestNo":$scope.financeInfo.requestNo,
				"smsCode":validCode,
				"approvalResult":$scope.approvalResult
			};
			loading.addLoading($('#recieve_ensure_detail_box'),common.getRootPath());
			http.post(BTPATH.CONFIRM_TRADE_BACKGROUND,param).success(function(data){
				loading.removeLoading($('#recieve_ensure_detail_box'));
				//清除定时器，重新校验 	
				_clearTimer();
			    if(data&&(data.code === 200)){
			    	tipbar.infoTopTipbar('融资方背景已确认,已跳转到下一步!',{});
			    	//刷新融资方案列表
			    	$scope.reFreshLoanList(true);
			    	$scope.closeRollModal('recieve_ensure_detail_box');
			    }else{
			    	tipbar.errorTopTipbar($(target),'融资方背景确认失败,服务器返回:'+data.message,3000,9992);
			    }
			});
		};
		


	


		//---------------------------------协议查看相关 ------------------------------------

		//合同相关文件展示
		$scope.getStaticPage = function(){
			$.post(BTPATH.GET_STATIC_PAGE,{"appNo":$scope.AgreementDetail.appNo},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					//获取iframe
					$detail_iframe = $(document.getElementById("detail_iframe").contentWindow.document);
					//动态修改iframe中内容
					$detail_iframe.find("body").html(data.data);
				}
			},'json');
		};


		//合同相关文件展示（通过 请求编号和 协议类型 查找）
		$scope.getStaticPageByRequestNo = function(){
			var param={
				requestNo:$scope.financeInfo.requestNo,
				agreeType:1	//'1','债权转让确认书'
			};
			$.post(BTPATH.FIND_AGREE_PAGE_BY_REQUESTNO,param,function(data){
				if(data && data.code === 200){
					//获取iframe
					$detail_iframe = $(document.getElementById("detail_iframe").contentWindow.document);
					//动态修改iframe中内容
					$detail_iframe.find("body").html(data.data);
				}
			},'json');
		};


		//查看协议详情
		$scope.showAgreeInfo = function(data){
			$scope.AgreementDetail = $.extend({},data);
			//获取静态页面
			if(data){
				$scope.getStaticPage();	//通过appNo
			}else{
				$scope.getStaticPageByRequestNo();//通过requestNo
			}
			$scope.openRollModal("look_agree_info_box");
		};





		//-------------------------box 弹框操作 --------------------------------

		//查看单个待批融资申请详情
		$scope.openDetailBox = function(data){
			//查询融资详情
			$scope.queryFinanceInfo(data.requestNo).success(function(){
				resetData();
				//查询关联列表（订单|应收账款|票据）
				$scope.querySelectList(data);
				//还款记录列表
				commonService.queryBaseInfoList(BTPATH.FIND_PAYMENT_RECORD_LIST,{requestNo:data.requestNo},$scope,'paymentRecordList');
				//豁免列表
				commonService.queryBaseInfoList(BTPATH.FIND_EXEMPT_LIST,{requestNo:data.requestNo},$scope,'exemptList');
				//催收列表
				commonService.queryBaseInfoList(BTPATH.FIND_PRESS_MONEY_LIST,{requestNo:data.requestNo},$scope,'pressMoneyList');
				//合同列表(协议列表)
				commonService.queryBaseInfoList(BTPATH.FIND_ELEC_AGREE_BY_REQUESTNO,{requestNo:data.requestNo,signType:''},$scope,'contractList');
			});
			$scope.openRollModal('finance_info_box');
		};

		//确认详情面板弹出
		$scope.openEnsureBox = function(data){
			//查询融资详情
			$scope.queryFinanceInfo(data.requestNo).success(function(){
				resetData();
				//查询关联列表（订单|应收账款|票据）
				$scope.querySelectList(data);
				//查询其他资料列表
				// $scope.queryOtherInfoList(data.requestNo);
				//合同列表(协议列表)
				commonService.queryBaseInfoList(BTPATH.FIND_ELEC_AGREE_BY_REQUESTNO,{requestNo:data.requestNo,signType:''},$scope,'contractList');
				//查询审批结果（贷款方案）
				$scope.queryLoanSchemeInfo(data.requestNo);
				//清除定时器	
				_clearTimer();
			});
			//默认 ‘确认签约’
			$scope.approvalResult = $scope.confirmStatus[0].value;
			$scope.openRollModal('recieve_ensure_detail_box');
		};

		// 融资依赖详情查看 
		$scope.showfactorProofDetail = function(type,data){
		    detailShow.getFinanceCredentialDetail($scope,type,data.id);
		};



		//页面初始化
		commonService.initPage(function(){
			//当前操作员下机构（核心企业列表）
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList').success(function(){
			      $scope.searchData.coreCustNo = $scope.coreCustList[0] ? $scope.coreCustList[0].value:'';
			      $scope.coreCustChange();
			      //融资流程节点
			      commonService.queryBaseInfoList(BTPATH.QUERY_TRADESTATUS,'',$scope,'','FlowTypeDic',{
			      	name:'nodeCustomName',
			      	value:'sysNodeId'
			      });
		  	});
			
		});



		
	}]);

	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);

});
});
});