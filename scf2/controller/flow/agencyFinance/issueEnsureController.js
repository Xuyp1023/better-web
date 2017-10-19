/*
	融资方 - 确认保理方案
	@author herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		var flowService = require('./service/agencyFinanceService.js');
		flowService.servPlus(mainApp,common);

		mainApp.controller('issueEnsureController',['$scope','http','$rootScope','$route','cache','detailShow','commonService','flowService',function($scope,http,$rootScope,$route,cache,detailShow,commonService,flowService){

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
				var validCode = $scope.identifyInfo.verifyCode;
				if(operType==='handle' && !validCode){
					tipbar.errorTopTipbar($(target),"请填写验证码！",3000,9992);
					return false;
				}
				//确认贷款方案
				return {
					"requestNo":$scope.businessInfo.requestNo,
					"smsCode":validCode
				};
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



			//================================================发送短信验证码 相关 start =============================================

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
				    $scope.$apply(function(){
				    	if(count === 0){
				    		$scope.identifyInfo.canSend = true;
				    		clearInterval(timer);
				    	}else{
			    			count-- ;
			    			$scope.identifyInfo.timerMsg = count + "秒后可重新发送";
				    	}
				    });
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
				// agreeType  0|1|2  转让通知书|转让确认书|三方协议
				var param={
					requestNo:$scope.financeInfo.requestNo,
					agreeType:2  //三方协议
				};
				http.post(BTPATH.FIND_VALIDCODE_BY_REQUESTNO,param).success(function(data){
				    if( data && data.code === 200){
						//倒计时读秒
						$scope.countDown();
					}
				});
			};
			//================================================发送短信验证码 相关 end =============================================





	        //====================================================弹框操作 start ========================================================


	        //查看协议详情
	        $scope.showAgreeInfo = function(data){
	        	$scope.AgreementDetail = $.extend({},data);
	        	//获取静态页面
	        	if(data){
	        		flowService.getStaticPage($scope);	//通过appNo
	        	}else{
	        		//协议类型: 2|三方协议
	        		flowService.getStaticPageByRequestNo($scope,2);//通过requestNo	
	        	}
	        	$scope.openRollModal("look_agree_info_box");
	        };


	        // 融资依赖详情查看 
	        $scope.showfactorProofDetail = function(type,data){
	        	detailShow.getFinanceCredentialDetail($scope,type,data.id);
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
	        		//查询关联列表（订单|应收账款|票据）
	        		flowService.querySelectList($scope,data);
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