/*
	贷款审批
	@anthor : herb
*/

define(function(require,module,exports){

	require.async(['dicTool','bootstrap',"datePicker"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("validate");
    var tipbar = require("tooltip");
    var common = require("common");
    var loading = require("loading");
    // var dialog = require("dialog");
    var comdirect = require("direct");
    var comfilter = require("filter");
    var comservice = require("service_s2");
    var BTPATH = require("path_s2");
    var pages = require("pages");
    var upload = require("upload");
    var date = require('date');
    require('modal');


	//定义模块
	var mainApp = angular.module('mainApp',['pagination','modal','upload','date']);
	//扩充公共指令库|过滤器|服务
	comdirect.direcPlus(mainApp);
	comfilter.filterPlus(mainApp);
	comservice.servPlus(mainApp);

	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService','detailShow','cache',function($scope,http,commonService,detailShow,cache){
		/*基础数据*/
		//审批结果
		$scope.approvalResults = BTDict.ApprovalResult.toArray('value','name');
		//审批结果（放款确认）
		$scope.approvalLoanResults = BTDict.ApprovalLoanResult.toArray('value','name');
		//融资申请状态
		// $scope.financeReqStatus = BTDict.FinanceReqStatus.toArray('value','name');
		//授信方式
		$scope.creditModes = BTDict.CreditMode.toArray('value','name');
		//融资类型
		$scope.requestTypes = BTDict.RaiseCapitalType.toArray('value','name');
		//期限单位
		$scope.periodUnits = BTDict.PeriodUnit.toArray('value','name');
		//融资状态列表  从后台接口查取
		$scope.requestStatus = [];

		//初始化分页配置
		function initPage(){
			return {
				pageNum: 1,
				pageSize: 10,
				pages: 1,
				total: 1
			};
		}
		
		//已完成订单 查询条件
		$scope.compleSearchData = {
			// requestNo:'',
			//发布时间
			GTErequestDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTErequestDate:new Date().format('YYYY-MM-DD')
		};
		//已完成订单 分页配置
		$scope.complePageConf = initPage();
		//已完成申请单列表
		$scope.compleHandleList = [];


		//待处理订单 查询条件
		$scope.waitSearchData = {
			// requestNo:'',
			//发布时间
			GTErequestDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTErequestDate:new Date().format('YYYY-MM-DD')
		};
		//待处理订单 分页配置
		$scope.waitPageConf = initPage();
		//待处理申请单列表
		$scope.waitHandleList = [];

		//融资详情
		$scope.financeInfo = {};
		//审贷详情（贷款方案）
		$scope.loanInfo = {};
		//是否存在黑名单
		$scope.blackExist = '';
		//协议信息
		$scope.agreeList = [];
		//审批信息
		$scope.auditInfo = {};
		
		/*关联信息*/
		$scope.orderList = [];//订单列表
		$scope.recieveList = [];//应收账款列表
		$scope.billList = [];//票据列表
		//重置数据
		function resetData(){
			//置空关联列表
			$scope.orderList = [];	
			$scope.recieveList = [];
			$scope.billList = [];	
		}
		//申请材料列表
		$scope.applyDocList = [];
		//合同（协议）列表
		$scope.contractList = [];

		//其他资料列表
		$scope.otherInfoList = [];
		//单个其他资料
		$scope.otherInfo = {};
		$scope.otherInfoAttach = [];


		//审批历史记录
		$scope.auditHistoryList = [];
		//已审批节点（打回节点列表）
		$scope.auditHistoryNodes = [];


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
		}

		//向客户发送验证码
		$scope.sendIdentifyCode = function(){
			var param={
				requestNo:$scope.financeInfo.requestNo,
				agreeType:2	//'2','三方协议'
			};
			http.post(BTPATH.FIND_VALIDCODE_BY_REQUESTNO,param).success(function(data){
			    if( data && data.code === 200){
					//倒计时读秒
					$scope.countDown();
				}
			});
		};



		//查询待处理订单
		$scope.searchWaitList = function(){
			$scope.waitPageConf.pageNum = 1;
			$scope.reFreshWaitApplyList(true);
		};

		//查询已处理订单
		$scope.searchCompleList = function(){
			$scope.complePageConf.pageNum = 1;
			$scope.reFreshCompleApplyList(true);
		};


		//刷新待处理申请单列表数据
	    $scope.reFreshWaitApplyList = function(flag){
	       //是否需要分页信息 1：需要 2：不需要
	       $scope.waitPageConf.flag = flag ? 1 : 2;
	       //弹出弹幕加载状态
	       loading.addLoading($('#wait_handle_tab .search_result table'),common.getRootPath());
	       //taskType:1  表示 ‘待处理’
	       http.post(BTPATH.QUERY_WORK_TASK_LIST,$.extend({"taskType":1},$scope.waitPageConf,$scope.waitSearchData)).success(function(data){
	           //关闭加载状态弹幕
	           loading.removeLoading($('#wait_handle_tab .search_result table'));
	           if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
	             $scope.$apply(function(){
	                 $scope.waitHandleList = common.cloneArrayDeep(data.data);
	                 if(flag){
	                   $scope.waitPageConf = data.page;
	                 }
	             });
	           }   
	       });
	    };


    	//刷新已处理申请单列表数据
        $scope.reFreshCompleApplyList = function(flag){
           //是否需要分页信息 1：需要 2：不需要
           $scope.complePageConf.flag = flag ? 1 : 2;
           //弹出弹幕加载状态
           loading.addLoading($('#handel_complete_tab .search_result table'),common.getRootPath());
           //taskType:2  表示 '已处理'
           http.post(BTPATH.QUERY_WORK_TASK_LIST,$.extend({"taskType":0},$scope.complePageConf,$scope.compleSearchData)).success(function(data){
               //关闭加载状态弹幕
               loading.removeLoading($('#handel_complete_tab .search_result table'));
               if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
                 $scope.$apply(function(){
                     $scope.compleHandleList = common.cloneArrayDeep(data.data);
                     if(flag){
                       $scope.complePageConf = data.page;
                     }
                 });
               }   
           });
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


        //补充其他资料
        $scope.addOtherFileInfo = function(){
        	var fileId = ArrayPlus($scope.otherInfoAttach).extractChildArray('id',true),
        		requestNo = $scope.financeInfo.requestNo;
        	var param = $.extend({
        		requestNo:requestNo,
        		fileId :fileId
        	},$scope.otherInfo);
        	http.post(BTPATH.SAVE_OTHER_FILE_INFO,param).success(function(data){
        	    if(data && data.code === 200){
        	    	tipbar.infoTopTipbar('补充资料成功!',{});
        	      	//刷新其他资料列表
        	     	$scope.queryOtherInfoList(requestNo);
        	     	$scope.closeRollModal("add_other_file_box");
        	    }
        	});
        };


        //删除其他资料
        $scope.deleteOtherFile = function(item){
	        // dialog.confirm('确认删除附加资料?',function(){
	        	http.post(BTPATH.DELETE_OTHER_FILE_INFO,{"otherId":item.id}).success(function(data){
	        	    if(data&& data.code === 200){
	        	    	//刷新其他资料列表
	        	     	$scope.queryOtherInfoList(item.requestNo);
	        	    }   
	        	});
	        // });	
        	
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
			          //当前审贷信息中没有相关数据，从融资申请中获取
			          if(!$scope.loanInfo.creditMode){
			          	$scope.loanInfo = $.extend({},$scope.loanInfo,{
			          		"requestBalance":$scope.financeInfo.balance,
			          		"period":$scope.financeInfo.period,
			          		"periodUnit":$scope.financeInfo.periodUnit,
			          		"creditMode":$scope.financeInfo.creditMode
			          	});
			          }
			      });
			    }   
			});
			return promise;
		};


		//审批历史
		$scope.queryActivityHistory = function(requestNo){
			http.post(BTPATH.ACTIVITY_HISTORY_LIST,{businessId:requestNo}).success(function(data){
			    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
	             $scope.$apply(function(){
	                 $scope.auditHistoryList = common.cloneArrayDeep(data.data);
	             });
	           }   
			});
		};



		//已审批节点
		$scope.queryActivityExecuteNodes = function(requestNo){
			var promise = http.post(BTPATH.ACTIVITY_EXECUTE_NODES,{businessId:requestNo}).success(function(data){
			    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
	             $scope.$apply(function(){
	             	//组装对象 value:name 
	             	var targetArray = [];
	             	for(var i =0; i<data.data.length ;i++){
	             		targetArray.push({
	             			value:data.data[i].nodeId,
	             			name:data.data[i].nodeName
	             		});
	             	}
	             	$scope.auditHistoryNodes = common.cloneArrayDeep(targetArray);
	             });
	           }   
			});
			return promise;
		};



		//检查黑名单是否存在
		$scope.checkBlacklist = function(){
			//参数 name:机构名称
			http.post(BTPATH.CHECK_BLACK_LIST,{"name":$scope.financeInfo.custName}).success(function(data){
			    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
			      $scope.$apply(function(){
			      	  //1:存在	0：不存在
			          $scope.blackExist = data.data ==="0" ? "不存在" : "存在";
			      });
			    }   
			});
		};


		//一般审批操作
		$scope.submitNormalAudit = function(target){

			//设置校验项|校验
			validate.validate($('#approve_handle'),validOption_normalAudit);
			var valid = validate.validate($('#approve_handle'));
			if(!valid) return;

			http.post(BTPATH.APPROVE_LOAN_REQUEST,$.extend({requestNo:$scope.financeInfo.requestNo},$scope.auditInfo)).success(function(data){
			    if(data&&(data.code === 200)){
			    	tipbar.infoTopTipbar('审批成功,已跳转到下一步!',{});
			    	$scope.reFreshWaitApplyList(false);
			    	$scope.closeRollModal('approve_flow_box');
			    }else{
			    	tipbar.errorTopTipbar($(target),'审批失败,服务器返回:'+data.message,3000,9992);
			    } 
			});
		};


		//出具贷款方案
		$scope.issueLoanScheme = function(target){
			//当审批通过时，才校验  0|下一步
			if($scope.auditInfo.approvalResult*1===0){
				//设置校验项|校验
				validate.validate($('#approve_handle_issue'),validOption_issuePlan);
				var valid = validate.validate($('#approve_handle_issue'));
				if(!valid) return;
			}

			http.post(BTPATH.ADD_LOAN_SCHEME,$.extend({},$scope.loanInfo,$scope.auditInfo,{requestNo:$scope.financeInfo.requestNo})).success(function(data){
			    if(data&&(data.code === 200)){
			    	tipbar.infoTopTipbar('审批成功,已跳转到下一步!',{});
			    	$scope.reFreshWaitApplyList(false);
			    	$scope.closeRollModal('issue_plan_box');
			    }else{
			    	tipbar.errorTopTipbar($(target),'审批失败,服务器返回:'+data.message,3000,9992);
			    } 
			});
		};


		// 签约 发起背景确认
		$scope.reqBackgoundEnsure = function(target){

			//设置校验项|校验
			validate.validate($('#approve_handle_sign'),validOption_normalAudit);
			var valid = validate.validate($('#approve_handle_sign'));
			if(!valid) return;

			//验证码
			var validCode = $scope.identifyInfo.verifyCode,
				requestType = $scope.financeInfo.requestType;
			//融资类型为：经销商，且审批结果为“下一步”，需要填写验证码	0|下一步
			if(requestType==="4" && $scope.auditInfo.approvalResult*1===0 && !validCode){
				tipbar.errorTopTipbar($(target),"请填写验证码！",3000,9992);
				return false;
			}
			$scope.auditInfo.smsCode = validCode;
			loading.addLoading($('#approve_handle_sign'),common.getRootPath());
			http.post(BTPATH.REQUEST_TRADE_BACK_ENSURE,$.extend({requestNo:$scope.financeInfo.requestNo},$scope.auditInfo)).success(function(data){
				loading.removeLoading($('#approve_handle_sign'));
				//清除定时器，重新校验 	
				_clearTimer();
			    if(data&&(data.code === 200)){
			    	tipbar.infoTopTipbar('审批成功,已跳转到下一步!',{});
			    	$scope.reFreshWaitApplyList(false);
			    	$scope.closeRollModal('sign_action_box');
			    }else{
			    	tipbar.errorTopTipbar($(target),'审批失败,服务器返回:'+data.message,3000,9992);
			    } 
			});
		};

		
		//放款确认
		$scope.submitLoanEnsure = function(target){
			//设置校验项|校验
			validate.validate($('#approve_handle_loan'),validOption_loanEnsure);
			var valid = validate.validate($('#approve_handle_loan'));
			if(!valid) return;

			http.post(BTPATH.CONFIRM_MAKE_LOAN,$.extend({requestNo:$scope.financeInfo.requestNo},$scope.auditInfo)).success(function(data){
			    if(data&&(data.code === 200)){
			    	tipbar.infoTopTipbar('审批成功,已跳转到下一步!',{});
			    	$scope.reFreshWaitApplyList(false);
			    	$scope.closeRollModal('loan_ensure_box');
			    }else{
			    	tipbar.errorTopTipbar($(target),'审批失败,服务器返回:'+data.message,3000,9992);
			    } 
			});
		};

		//放款确认前的操作
		$scope.loanEnsureBefore = function(){
			//默认审批 “下一步”
			$scope.auditInfo.approvalResult = $scope.approvalLoanResults[0].value;
			//默认 “放款金额” 为 审批金额,默认 “放款时间” 为当前时间
			var balance = $scope.financeInfo.approvedBalance,
				requestNo = $scope.financeInfo.requestNo,
				defaultDate = new Date().format('YYYY-MM-DD');
			$scope.auditInfo.loanBalance = balance;
			$scope.auditInfo.loanDate = defaultDate;
			//带出手续费
			$scope.calculatServiceFee(requestNo,balance);
			//带出到期日期
			$scope.calculatEndDate(requestNo,defaultDate).success(function(){
				//带出利息，其他费用
				$scope.calculatInsterest(requestNo,balance);
			});
			
			//监听 实际放款日期和金额
			$scope.$watch('auditInfo.loanBalance', function(newValue,oldValue){
				var requestNo = $scope.financeInfo.requestNo;
				if(newValue && newValue!==oldValue){
					$scope.calculatServiceFee(requestNo,newValue);
					$scope.calculatInsterest(requestNo,newValue);
				}
			});
			$scope.$watch('auditInfo.loanDate', function(newValue,oldValue){
				var requestNo = $scope.financeInfo.requestNo,
					balance = $scope.financeInfo.approvedBalance;
				if(newValue && newValue!==oldValue){
					$scope.calculatEndDate(requestNo,newValue).success(function(){
						//利息，其他费用变化
						// $scope.calculatInsterest(requestNo,balance);
					});
				}
			});
			//监听 到期日期
			$scope.$watch('auditInfo.endDate', function(newValue,oldValue){
				var requestNo = $scope.financeInfo.requestNo,
					balance = $scope.financeInfo.approvedBalance;
				if(newValue && newValue!==oldValue){
					//利息，其他费用变化
					$scope.calculatInsterest(requestNo,balance);
				}
			});
		};

		//计算结束日期
		$scope.calculatEndDate = function(requestNo,loanDate){
			var promise = http.post(BTPATH.CALCULATE_END_DATE,{requestNo:requestNo,loanDate:loanDate}).success(function(data){
			    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
			    	$scope.$apply(function(){
			    		$scope.auditInfo.endDate = data.data.endDate;
			    	});
			    }
			});
			return promise;
		};

		//计算手续费
		$scope.calculatServiceFee = function(requestNo,loanBalance){
			http.post(BTPATH.CALCULATE_SERVICE_FEE,{requestNo:requestNo,loanBalance:loanBalance}).success(function(data){
			    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
			    	$scope.$apply(function(){
			    		$scope.auditInfo.servicefeeBalance = data.data.servicefeeBalance;
			    	});
			    }
			});
		};

		//计算利息和其他费用
		$scope.calculatInsterest = function(requestNo,loanBalance){
			var param = {
				requestNo:requestNo,
				loanBalance:loanBalance,
				loanDate:$scope.auditInfo.loanDate,
				endDate:$scope.auditInfo.endDate
			};
			http.post(BTPATH.CALCULATE_INSTEREST,param).success(function(data){
			    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
			    	$scope.$apply(function(){
			    		$scope.auditInfo.interestBalance = data.data.interestBalance;		//利息
			    		$scope.auditInfo.managementBalance = data.data.managementBalance;	//其他费用
			    	});
			    }
			});
		};


		//审批结果 选择
		$scope.approvalResultChange = function(){
			var value = $scope.auditInfo.approvalResult+'';
			if(value!=="1"){
				//如果不为 ‘打回’ ，置空returnNode
				$scope.auditInfo.returnNode = '';
			}else if(value==="1"){
				//如果为 ‘打回’ ，默认选中第一个
				$scope.auditInfo.returnNode = $scope.auditHistoryNodes[0]?$scope.auditHistoryNodes[0].value:'';
			}
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
			var param={
				requestNo:$scope.financeInfo.requestNo,
				agreeType:2	//'2','三方协议'
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




		//---------------------------弹板操作-------------------------start

		//开启审批
		$scope.openApproveBox= function(data){
			//暂存该信息
			cache.put('loan_info',data);

			//当前申请状态
			var currStatus = data.tradeStatus+'';
			//查询融资详情
			$scope.queryFinanceInfo(data.requestNo).success(function(){
				resetData();
				//查询黑名单是否存在
				$scope.checkBlacklist();
				//查询关联列表（订单|应收账款|票据）
				$scope.querySelectList(data);
				//查询其他资料列表
				$scope.queryOtherInfoList(data.requestNo);
				//申请材料列表
				commonService.queryBaseInfoList(BTPATH.QUERY_REQUEST_ATTACH_LIST,{requestNo:data.requestNo},$scope,'applyDocList');
				//合同列表(协议列表)
				commonService.queryBaseInfoList(BTPATH.FIND_ELEC_AGREE_BY_REQUESTNO,{requestNo:data.requestNo,signType:''},$scope,'contractList');
				//查询审贷方案详情
				$scope.queryLoanSchemeInfo(data.requestNo).success(function(){
					//审贷信息 默认值
					$scope.loanInfo.approvedPeriodUnit = $scope.loanInfo.approvedPeriodUnit||$scope.periodUnits[0].value;//审贷期限单位
					// $scope.loanInfo.creditMode = $scope.loanInfo.creditMode||$scope.creditModes[0].value;	//授信类型
					$scope.loanInfo.creditMode = $scope.loanInfo.creditMode||$scope.financeInfo.creditMode;		//授信类型
				});
				//查询审批记录
				$scope.queryActivityHistory(data.requestNo);
				//查询已审批节点（打回节点）
				$scope.queryActivityExecuteNodes(data.requestNo).success(function(){
					//如果没有已审批节点，移除审批 ‘打回’ 选项
					if($scope.auditHistoryNodes.length===0){
						$scope.approvalResults = ArrayPlus($scope.approvalResults).delChild('value',"1");
					}else{
						$scope.approvalResults = BTDict.ApprovalResult.toArray('value','name');
					}
				});

				//审批信息置空 默认审批 “下一步”
				$scope.auditInfo = {
					"approvalResult":$scope.approvalResults[0].value
				};

				switch(currStatus){
					case "110":
						//出具贷款方案
						$scope.openRollModal('issue_plan_box');
						break;
					case "130":
						//签约 发起背景确认
						$scope.openRollModal('sign_action_box');
						break;
					case "150":
						//放款确认
						$scope.loanEnsureBefore();	//放款确认前的操作
						$scope.openRollModal('loan_ensure_box');
						break;
					default:
						//一般审批
						$scope.openRollModal('approve_flow_box');
						if(!currStatus) {
							return;
						}
						currStatus*=1;
						//判断状态 ：是否已出具贷款方案
						currStatus > 110 ? $scope.issuePlanStatus = true : $scope.issuePlanStatus = false;
						//判断状态 ：核心企业是否已确认债权转让
						currStatus > 140 ? $scope.signEnsureStatus = true : $scope.signEnsureStatus = false;
				}
			});
		};


		//打开补充资料 box
		$scope.addOtherFileBox = function(){
			//设置节点
			$scope.otherInfo ={
				node:$scope.financeInfo.tradeStatus
			};
			//置空附件
			$scope.otherInfoAttach = [];
			$scope.openRollModal("add_other_file_box");
		};


		//开启详情页面
		$scope.openDetailBox= function(data){

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
			$scope.openRollModal('fix_operator_info_box');	
		};


		// 融资依赖详情查看 
		$scope.showfactorProofDetail = function(type,data){
		    // detailShow.getFinanceCredentialDetail($scope,type,data.id);
		    cache.put('is_from_loan',true);
		    if(type === 'draft'){
		    	cache.put('loan_bill_info',data);
		    	window.location.href = '../../supplier/data/draftManage.html';
		    }else{
		    	detailShow.getFinanceCredentialDetail($scope,type,data.id);
		    }
		    
		};

		//---------------------------弹板操作-------------------------end
		

		//开启上传
		$scope.openUpload = function(event,type,typeName,list){
			$scope.uploadConf = {
				//上传触发元素
				event:event.target||event.srcElement,
				//上传附件类型
				type:type,
				//类型名称
				typeName:typeName,
				//存放上传文件
				uploadList:$scope[list]
			};
		};


		//切换面板
        $scope.switchTab = function(event) {
            var $target = $(event.srcElement ? event.srcElement : event.target);
			$target.tab('show');
        };


        //页面初始化
        commonService.initPage(function(){
        	
        	//获取融资状态列表
        	commonService.queryBaseInfoList(BTPATH.QUERY_TRADESTATUS,'',$scope,'requestStatus','FlowTypeDic',{
        	  name:'nodeCustomName',
        	  value:'sysNodeId',
        	  isChange:true
        	}).success(function(){
        		//待办查询，融资状态默认第一个
        		// $scope.waitSearchData.tradeStatus = $scope.requestStatus[0]?$scope.requestStatus[0].value:'';
        		//查询待处理订单
        		$scope.reFreshWaitApplyList(true);
        		//查询已处理订单
        		$scope.reFreshCompleApplyList(true);
        	});

        	//从汇票管理页回来
        	//贷款审批相关入口
			if(cache.get('is_frome_draft')){
				cache.remove('is_frome_draft');
				($scope.$$$MODAL_EVENT_QUEUE = []).push(function(modalId){
					if(modalId === 'issue_plan_box'){
						var loanInfo = cache.get('loan_info');
						$scope.openApproveBox(loanInfo);
					}
				});
			}


        });


        //------------------------------------------ 校验配置 ------------------------------------------------

        //校验配置(出具贷款方案)
        var validOption_issuePlan = {
              elements: [{
                  name: 'loanInfo.approvedBalance',
                  rules: [{name: 'required'},{name: 'money'},{name: 'nozero'}],
                  events: ['blur']
              },{
                  name: 'loanInfo.approvedPeriod',
                  rules: [{name: 'required'},{name: 'int'}],
                  events: ['blur']
              },{
                  name: 'loanInfo.approvedRatio',
                  rules: [{name: 'required'},{name: 'float'}],
                  events: ['blur']
              },{
                  name: 'loanInfo.approvedManagementRatio',
                  rules: [{name: 'float'}],
                  events: ['blur']
              },{
                  name: 'loanInfo.servicefeeRatio',
                  rules: [{name: 'float'}],
                  events: ['blur']
              },{
                  name: 'auditInfo.description',
                  rules: [{name: 'required'}],
                  events: ['blur']
              }],


              errorPlacement: function(error, element) {
                  var label = element.parents('td').prev().text().substr(0);
                  tipbar.errorLeftTipbar(element,label+error,0,99999);
              }
        };


        //校验配置(放款确认)
        var validOption_loanEnsure = {
              elements: [{
                  name: 'auditInfo.loanBalance',
                  rules: [{name: 'required'},{name: 'money'}],
                  events: ['blur']
              },{
                  name: 'auditInfo.servicefeeBalance',
                  rules: [{name: 'required'},{name: 'money'}],
                  events: ['blur']
              },{
                  name: 'auditInfo.interestBalance',
                  rules: [{name: 'required'},{name: 'money'}],
                  events: ['blur']
              },{
                  name: 'auditInfo.managementBalance',
                  rules: [{name: 'required'},{name: 'money'}],
                  events: ['blur']
              },{
                  name: 'auditInfo.description',
                  rules: [{name: 'required'}],
                  events: ['blur']
              }],
              errorPlacement: function(error, element) {
                  var label = element.parents('td').prev().text().substr(0);
                  tipbar.errorLeftTipbar(element,label+error,0,99999);
              }
        };


        //校验配置(普通审批)
        var validOption_normalAudit = {
              elements: [{
                  name: 'auditInfo.description',
                  rules: [{name: 'required'}],
                  events: ['blur']
              }],
              errorPlacement: function(error, element) {
                  var label = element.parents('td').prev().text().substr(0);
                  tipbar.errorLeftTipbar(element,label+error,0,99999);
              }
        };



	}]);

	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);

});
});
});