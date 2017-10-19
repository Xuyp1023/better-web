/*
	保理公司 放款确认
	@author herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		var flowService = require('./service/agencyFinanceService.js');
		flowService.servPlus(mainApp,common);

		mainApp.controller('loanEnsureController',['$scope','http','$rootScope','$route','cache','detailShow','commonService','flowService',function($scope,http,$rootScope,$route,cache,detailShow,commonService,flowService){

			//当前任务
			var currentTask = cache.get("currentTask");
			//当前业务信息
			$scope.businessInfo = {
				'requestNo':currentTask.workFlowBusiness.businessId,
				'nodeName':currentTask.workFlowNode.nickname
			};


			/*
			* 提供数据至外部
			* @param operType|操作类型		
			*/
			$scope.$GET_RESULT = function(target,operType){
				//当审批通过时，才校验
				if(operType==='handle'){
					//设置校验项|校验
					validate.validate($('#approve_handle_loan'),validOption);
					var valid = validate.validate($('#approve_handle_loan'));
					if(!valid) return false;
				}
				//放款确认
				return $.extend({},$scope.auditInfo,{
					requestNo:$scope.businessInfo.requestNo
				});
			};


			/* --------------字典数据------------- */
			//授信方式
			$scope.creditModes = BTDict.CreditMode.toArray('value','name');
			//融资类型
			$scope.requestTypes = BTDict.RaiseCapitalType.toArray('value','name');
			//期限单位
			$scope.periodUnits = BTDict.PeriodUnit.toArray('value','name');


			//融资状态列表  从后台接口查取
			$scope.requestStatus = [];

			//融资详情
			$scope.financeInfo = {};
			//审贷详情（贷款|保理方案）
			$scope.loanInfo = {};
			//审批信息
			$scope.auditInfo = {};
			//是否存在黑名单
			$scope.blackExist = '';
			
			/*关联信息*/
			$scope.orderList = [];	//订单列表

			//申请材料列表
			$scope.applyDocList = [];
			//合同（协议）列表
			$scope.contractList = [];
			//其他资料列表
			$scope.otherInfoList = [];
			//单个其他资料
			$scope.otherInfo = {};
			//其他资料附件
			$scope.otherInfoAttach = [];



			//================================================== 其他资料相关操作 =====================================================

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
	        	     	commonService.queryBaseInfoList(BTPATH.QUERY_OTHER_FILE_LIST,{requestNo:requestNo},$scope,'otherInfoList');
	        	     	$scope.closeRollModal("add_other_file_box");
	        	    }
	        	});
	        };


	        //删除其他资料
	        $scope.deleteOtherFile = function(item){
		        dialog.confirm('确认删除该项资料?',function(){
		        	http.post(BTPATH.DELETE_OTHER_FILE_INFO,{"otherId":item.id}).success(function(data){
		        	    if(data&& data.code === 200){
		        	    	//刷新其他资料列表
		        	     	commonService.queryBaseInfoList(BTPATH.QUERY_OTHER_FILE_LIST,{requestNo:item.requestNo},$scope,'otherInfoList');
		        	    }   
		        	});
		        });	
	        };


	        
	        //====================================================弹框操作 start ========================================================

	        //查看协议详情
	        $scope.showAgreeInfo = function(data){
	        	$scope.AgreementDetail = $.extend({},data);
	        	//获取静态页面
	        	if(data){
	        		flowService.getStaticPage($scope);	//通过appNo
	        	}/*else{
	        		flowService.getStaticPageByRequestNo($scope);//通过requestNo
	        	}*/
	        	$scope.openRollModal("look_agree_info_box");
	        };

	        // 融资依赖详情查看 
	        $scope.showfactorProofDetail = function(type,data){
	        	detailShow.getFinanceCredentialDetail($scope,type,data.id);
	        };


	        //打开补充资料 box
	        $scope.addOtherFileBox = function(){
	        	//设置节点
	        	$scope.otherInfo ={
	        		node:$scope.businessInfo.nodeName
	        	};
	        	//置空附件
	        	$scope.otherInfoAttach = [];
	        	$scope.openRollModal("add_other_file_box");
	        };


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

	        //====================================================弹框操作 end ========================================================





	        /*!入口*/ /*控制器执行入口*/ 
	        $scope.$on('$routeChangeSuccess',function(){

	        	//获取融资状态列表 	生成字典|FlowTypeDic
	        	commonService.queryBaseInfoList(BTPATH.QUERY_TRADESTATUS,'',$scope,'requestStatus','FlowTypeDic',{
	        	  name:'nodeCustomName',
	        	  value:'sysNodeId',
	        	  isChange:true
	        	});

	        	//业务id号 
	        	var requestNo = $scope.businessInfo.requestNo;
	        	//查询融资详情
	        	flowService.queryFinanceInfo($scope,requestNo).success(function(data){
	        		//查询黑名单是否存在
	        		flowService.checkBlacklist($scope);
	        		//查询关联列表（订单|应收账款|票据）
	        		flowService.querySelectList($scope,data);
	        		//查询其他资料列表
	        		commonService.queryBaseInfoList(BTPATH.QUERY_OTHER_FILE_LIST,{requestNo:requestNo},$scope,'otherInfoList');
	        		//申请材料列表
	        		commonService.queryBaseInfoList(BTPATH.QUERY_REQUEST_ATTACH_LIST,{requestNo:requestNo},$scope,'applyDocList');
	        		//合同列表(协议列表)
	        		commonService.queryBaseInfoList(BTPATH.FIND_ELEC_AGREE_BY_REQUESTNO,{requestNo:requestNo,signType:''},$scope,'contractList');
	        		//查询审贷方案详情
	        		flowService.queryLoanSchemeInfo($scope,requestNo).success(function(){
	        			//审贷信息 默认值
	        			// $scope.loanInfo.approvedPeriodUnit = $scope.loanInfo.approvedPeriodUnit||$scope.periodUnits[0].value;//审贷期限单位
	        			// $scope.loanInfo.creditMode = $scope.loanInfo.creditMode||$scope.financeInfo.creditMode;		//授信类型
	        			//放款前数据处理
	        			$scope.loanEnsureBefore();
	        			common.resizeIframeListener();
	        		});

	        	});

	        	/*公共绑定*/
	        	$scope.$on('ngRepeatFinished',function(){
	        		common.resizeIframeListener();  
	        	});
	        	
	        });


	        //放款确认前的操作
	        $scope.loanEnsureBefore = function(){
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



	        

			//====================================================校验配置 start ========================================================	

	        //校验配置(放款确认)
	        var validOption = {
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

	        //====================================================校验配置 end ========================================================	        


		}]);

	};

});