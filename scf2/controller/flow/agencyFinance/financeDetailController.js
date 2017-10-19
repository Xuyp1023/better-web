/*
	供应商融资 详情
	@author herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		var flowService = require('./service/agencyFinanceService.js');
		flowService.servPlus(mainApp,common);

		mainApp.controller('financeDetailController',['$scope','http','$rootScope','$route','cache','detailShow','commonService','flowService',function($scope,http,$rootScope,$route,cache,detailShow,commonService,flowService){

			//当前任务
			var currentTask = cache.get("currentTask");
			//当前业务信息
			$scope.businessInfo = {
				'requestNo':currentTask.workFlowBusiness.businessId,
				'nodeName':currentTask.workFlowNode.nickname
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



	        
	        //====================================================弹框操作 start ========================================================

	        //查看协议详情
	        $scope.showAgreeInfo = function(data){
	        	$scope.AgreementDetail = $.extend({},data);
	        	//获取静态页面
	        	if(data){
	        		flowService.getStaticPage($scope);	//通过appNo
	        	}else{
	        		//协议类型: 1|转让确认书
	        		flowService.getStaticPageByRequestNo($scope,1);//通过requestNo
	        	}
	        	$scope.openRollModal("look_agree_info_box");
	        };

	        // 融资依赖详情查看 
	        $scope.showfactorProofDetail = function(type,data){
	        	detailShow.getFinanceCredentialDetail($scope,type,data.id);
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
	        		flowService.queryLoanSchemeInfo($scope,requestNo);
	        	});

	        	/*公共绑定*/
	        	$scope.$on('ngRepeatFinished',function(){
	        		common.resizeIframeListener();  
	        	});
	        	
	        });


		}]);

	};

});