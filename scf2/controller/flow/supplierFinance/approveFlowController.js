/*
	供应商融资 一般审批
	@author herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		var flowService = require('./service/supplierFinanceService.js');
		flowService.servPlus(mainApp,common);

		mainApp.controller('approveFlowController',['$scope','http','$rootScope','$route','cache','detailShow','commonService','flowService',function($scope,http,$rootScope,$route,cache,detailShow,commonService,flowService){

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
				/*if(operType==='handle'){
					//设置校验项|校验
					validate.validate($('#approve_flow_box'),validOption);
					var valid = validate.validate($('#approve_flow_box'));
					if(!valid) return;
				}*/
				//一般审批
				return {requestNo:$scope.businessInfo.requestNo};
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

			//融资申请类型  订单|汇票|应收
			$scope.linkedType = '';
			//融资详情
			$scope.financeInfo = {};
			//审贷详情（贷款|保理方案）
			$scope.loanInfo = {};
			//是否存在黑名单
			$scope.blackExist = '';
			
			/*关联信息*/
			$scope.orderList = [];	//订单列表
			$scope.recieveList = [];//应收账款列表
			$scope.billList = [];	//票据列表

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
				}
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
	        			common.resizeIframeListener();
	        		});

	        	});

	        	/*公共绑定*/
	        	$scope.$on('ngRepeatFinished',function(){
	        		common.resizeIframeListener();  
	        	});
	        	
	        });



	        

			//====================================================校验配置 start ========================================================	

	        //校验配置(一般审批)
	        var validOption = {};

	        //====================================================校验配置 end ========================================================	        


		}]);

	};

});