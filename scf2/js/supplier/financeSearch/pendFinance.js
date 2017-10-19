/*
待批融资申请查询
作者:tanp
*/
define(function(require,exports,module){
	require.async(['dicTool','bootstrap',"datePicker"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("validate");
    var tipbar = require("tooltip");
    var common = require("common");
    var loading = require("loading");
    var comdirect = require("direct");
    var dialog = require("dialog");
    var comfilter = require("filter");
    var comservice = require("service_s2");
    var BTPATH = require("path_s2");
    var pages = require("pages");
    var date = require("date");
    require('modal');
    require('date');

	//定义模块
	var mainApp = angular.module('mainApp',['pagination','modal','date']);

	//扩充公共服务
	comservice.servPlus(mainApp);
	//扩充公共指令库
	comdirect.direcPlus(mainApp);
	//扩充公共过滤器
	comfilter.filterPlus(mainApp);


	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService','detailShow',function($scope,http,commonService,detailShow){

		$scope.custList = [];
		$scope.factorList = [];
		$scope.coreCustList = [];
		/*VM绑定区域*/
		$scope.searchData = {
			custNo:'',
			coreCustNo:'',
			factorNo:'',
			GTErequestDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTErequestDate :new Date().format('YYYY-MM-DD'),
			lastStatus:'0,1,2,3'	//0 中止， 1 申请中，2审批中，3 放款中
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//待批融资申请列表
		$scope.infoList = [];
		//单个待批融资申请信息
		$scope.financeInfo = {};

		//审核状态列表
		$scope.confirmStatus = BTDict.ConfirmSignStatus.toArray('value','name');
		//是否确认
		$scope.confirmResult = '';

		$scope.contractList = [];		//合同列表
		$scope.paymentRecordList = [];	//还款记录列表
		$scope.pressMoneyList = [];		//催收列表
		$scope.exemptList = [];			//豁免列表
		$scope.loanInfo = {};			//审贷详情（贷款方案）

		//协议详情
		$scope.AgreementDetail = {};

		/*关联 VM*/
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


		//-------------------------------发送短信验证码 相关--------------------------

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
			$scope.identifyInfo.canSend = true;
			$scope.identifyInfo.timerMsg = "";
		}

		//向客户发送验证码
		$scope.sendIdentifyCode = function(){
			// agreeType  0|1|2  转让通知书|转让意见书|三方协议
			var requestType = $scope.financeInfo.requestType+'',
				agreeType = requestType==="4" ? 2 : 0;//融资类型为：供应商|4  
			var param={
				requestNo:$scope.financeInfo.requestNo,
				agreeType:agreeType
			};
			http.post(BTPATH.FIND_VALIDCODE_BY_REQUESTNO,param).success(function(data){
			    if( data && data.code === 200){
					//倒计时读秒
					$scope.countDown();
				}
			});
		};



		/*事件处理区域*/
		//查询待批融资申请
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//改变机构的联动
		$scope.changeCust = function(){
			//核心企业列表
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.custNo},$scope,'coreCustList','CoreCustListDic').success(function(){
				// $scope.searchData.coreCustNo = $scope.coreCustList[0] ? $scope.coreCustList[0].value : '';
				$scope.searchData.coreCustNo = '';
				//保理公司列表
				commonService.queryBaseInfoList(BTPATH.QUERY_OPENED_FACTOR,{custNo:$scope.searchData.custNo},$scope,'factorList','FactorListDic').success(function(){
					$scope.$apply(function(){
						$scope.searchData.factorNo = '';
					});
					// $scope.searchData.factorNo = $scope.factorList[0] ? $scope.factorList[0].value:'';
					//刷新融资列表
					$scope.searchList();
				});

			});
			
		};


		//获取待批融资申请列表
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			$scope.listPage.flag = flag? 1 : 2;
			loading.addLoading($('#search_info table'),common.getRootPath());
			$.post(BTPATH.QUERY_FINANCE_LIST,$.extend({},$scope.searchData,$scope.listPage),function(data){
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


		

		//确认贷款方案
		$scope.confirmLoanScheme = function(target){
			var validCode = $scope.identifyInfo.verifyCode;
			// 2:拒绝签署
			if($scope.confirmResult*1!==2 && !validCode){
				tipbar.errorTopTipbar($(target),"请填写验证码！",3000,9992);
				return;
			}
			//参数
			var param = {
				"requestNo":$scope.financeInfo.requestNo,
				"smsCode":validCode,
				"approvalResult":$scope.confirmResult
			};


			loading.addLoading($('#sign_contract_box'),common.getRootPath());
			http.post(BTPATH.CONFIRM_LOAN_SCHEME,param).success(function(data){
				loading.removeLoading($('#sign_contract_box'));
				//清除定时器，重新校验 	
				_clearTimer();
			    if(data&&(data.code === 200)){
			    	tipbar.infoTopTipbar('确认成功,已跳转到下一步!',{});
			    	//刷新列表
			    	$scope.queryList(true);
			    	$scope.closeRollModal('sign_contract_box');
			    }else{
			    	tipbar.errorTopTipbar($(target),'贷款方案确认失败,服务器返回:'+data.message,3000,9992);
			    } 
			});
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


		//查看单个待批融资申请详情
		$scope.showInfoDetail = function(data){
			//查询融资详情
			$scope.queryFinanceInfo(data.requestNo).success(function(){
				resetData();
				//查询关联列表（订单|应收账款|票据）
				$scope.querySelectList(data);
				//查询审批结果（贷款方案）
				$scope.queryLoanSchemeInfo(data.requestNo);
				//还款记录列表
				commonService.queryBaseInfoList(BTPATH.FIND_PAYMENT_RECORD_LIST,{requestNo:data.requestNo},$scope,'paymentRecordList');
				//豁免列表
				commonService.queryBaseInfoList(BTPATH.FIND_EXEMPT_LIST,{requestNo:data.requestNo},$scope,'exemptList');
				//催收列表
				commonService.queryBaseInfoList(BTPATH.FIND_PRESS_MONEY_LIST,{requestNo:data.requestNo},$scope,'pressMoneyList');
				//合同列表(协议列表)
				commonService.queryBaseInfoList(BTPATH.FIND_ELEC_AGREE_BY_REQUESTNO,{requestNo:data.requestNo,signType:''},$scope,'contractList');
			});
			//标志从 “待批融资” 页面 打开详情
			// $scope.prevBox = "pendFinance";
			$scope.openRollModal('fix_operator_info_box');
		};


		//单个待批融资申请签约
		/*$scope.signContract = function(data){
			//查询融资详情
			$scope.queryFinanceInfo(data.requestNo).success(function(){
				resetData();
				//查询关联列表（订单|应收账款|票据）
				$scope.querySelectList(data);
				//查询审批结果（贷款方案）
				$scope.queryLoanSchemeInfo(data.requestNo);
				//合同列表(协议列表)
				commonService.queryBaseInfoList(BTPATH.FIND_ELEC_AGREE_BY_REQUESTNO,{requestNo:data.requestNo,signType:''},$scope,'contractList');
				//清除定时器	
				_clearTimer();
			});
			//默认 "转让债权"
			$scope.confirmResult = $scope.confirmStatus[0].value;
			$scope.openRollModal("sign_contract_box");
		};*/


		// 融资依赖详情查看 
		$scope.showfactorProofDetail = function(type,data){
		    detailShow.getFinanceCredentialDetail($scope,type,data.id);
		};


		//---------------------------------协议查看相关 ------------------------------------

		
		//合同相关文件展示
		$scope.getStaticPage = function(){
			//获取iframe
			var $detail_iframe = $(document.getElementById("detail_iframe").contentWindow.document);
			$.post(BTPATH.GET_STATIC_PAGE,{"appNo":$scope.AgreementDetail.appNo},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					//动态修改iframe中内容
					$detail_iframe.find("body").html(data.data);
				}else{
					//动态修改iframe中内容
					$detail_iframe.find("body").html("");
				}
			},'json');
		};

		
		//合同相关文件展示（通过 请求编号和 协议类型 查找）
		$scope.getStaticPageByRequestNo = function(){
			// agreeType  0|1|2  转让通知书|转让意见书|三方协议
			var requestType = $scope.financeInfo.requestType+'',
				agreeType = requestType==="4" ? 2 : 0;//融资类型为：供应商|4  
			var param={
				requestNo:$scope.financeInfo.requestNo,
				agreeType:agreeType
			};
			//获取iframe
			var $detail_iframe = $(document.getElementById("detail_iframe").contentWindow.document);
			$.post(BTPATH.FIND_AGREE_PAGE_BY_REQUESTNO,param,function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					//动态修改iframe中内容
					$detail_iframe.find("body").html(data.data);
				}else{
					//动态修改iframe中内容
					$detail_iframe.find("body").html("");
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



		//页面初始化
		$scope.initPage = function(){
			//获取机构列表
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList','CustListDic').success(function(){
				$scope.searchData.custNo =$scope.custList[0] ? $scope.custList[0].value :'';
				//核心企业列表
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.custNo},$scope,'coreCustList','CoreCustListDic').success(function(data){
					// $scope.searchData.coreCustNo = $scope.coreCustList[0] ? $scope.coreCustList[0].value :'';
					$scope.searchData.coreCustNo = '';
					//保理公司列表
					commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:$scope.searchData.custNo},$scope,'factorList','FactorListDic').success(function(data){
						// $scope.searchData.factorNo = $scope.factorList[0] ? $scope.factorList[0].value:'';
						$scope.searchData.factorNo = '';
						//获取融资状态
						/*commonService.queryBaseInfoList(BTPATH.QUERY_TRADESTATUS,'',$scope,'','FlowTypeDic',{
							name:'nodeCustomName',
							value:'sysNodeId'
						}).success(function(){*/
						$scope.queryList(true);
						// });
					});
				});

			});
		};


		/*数据初始区域*/
		$scope.initPage();


		

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

