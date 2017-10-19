
/*
	融资审批
	@author : herb
*/

exports.installController = function(mainApp,common){

	mainApp.controller('flow.financeAuditController',['$scope','muiSupport','http','$rootScope','$route','cache','commonService',function($scope,muiSupport,http,$rootScope,$route,cache,commonService){


		/*
		* 提供数据至外部
		* @param operType|操作类型		
		*/
		$scope.$GET_RESULT = function(operType){
			//当审批通过时，才校验
			var validCode = $scope.info.verifyCode;
			// var password = $scope.info.passWord;
			//获取请求编号
			var requestNo = $scope.businessInfo.requestNo;

			if(operType==='handle' && !validCode){
				mui.alert("请填写验证码!");
				return;
			}
			//确认贷款方案
			return {
				"requestNo":requestNo,
				"smsCode":validCode
				// "tradePassword":password,
			};
		};


		//当前任务
		var currentTask = cache.get("currentTask");

		//当前业务信息
		$scope.businessInfo = {
			'requestNo':currentTask.workFlowBusiness.businessId,
			'nodeName':currentTask.workFlowNode.nickname
		};

		/*VM绑定区域*/
		//申请信息
		$scope.info = {};

		//融资方案
		$scope.scheme = {};

		//应收列表
		$scope.recieveList = [];
		//汇票列表
		$scope.billList = [];

		//融资材料列表
		$scope.materialList = [];

		//其他材料列表
		$scope.otherInfoList = [];

		//审贷详情（贷款方案）
		$scope.loanInfo = {};
		//融资协议列表
		$scope.agreeList = [];


		/* 标的物 类别 配置 */
		var _linkedConfig = {
			/*1:{
				type:'order',
				list_name:'orderList'		//列表VM名称
			},*/
			2:{
				type:'bill',
				list_name:'billList'		//列表VM名称
			},
			3:{
				type:'recieve',
				list_name:'recieveList'	  	//列表VM名称
			}
		};

		//授信列表
		$scope.creditList = [];

		//切换密码栏可见
		$scope.toggleEye = function(model,attr){
			var name = model + '.' + attr,
				eyeAttr = attr + 'Eye';
			$scope[model][eyeAttr] = !$scope[model][eyeAttr];
			if(console) console.info($scope[model][eyeAttr]);
			var input = document.querySelector("[ng-model='"+ name +"']");
			input.type = $scope[model][eyeAttr] ? 'text' : 'password';
		};


		//改变文本框类型
		$scope.typeChange = function(target){
			target.type = 'password';
			$(target).unbind("focus");
		};


		//-------------------------------发送短信验证码 相关 start --------------------------

		//验证信息
		$scope.identifyInfo = {
			//是否允许发送验证码
			canSend:true,
			//读秒提示信息
			timerMsg:"",
			//输入的验证码
			// verifyCode:""
		};

		//验证码倒计时
		var timer;
		$scope.countDown = function(){
			var count = 60;
			$scope.identifyInfo.canSend = false;
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
			$scope.identifyInfo.canSend = true;
			$scope.identifyInfo.timerMsg = "";
		}

		//向客户发送验证码  @todo
		$scope.sendIdentifyCode = function(){
			http.post(BTPATH.OPEN_ACCOUNT_VERIFY_CODE, {mobileNo:/*$scope.info.operMobile*/''}).success(function(data){
			    if( data && data.code === 200){
					//倒计时读秒
					$scope.countDown();
				}
			});
		};
		//-------------------------------发送短信验证码 相关 end --------------------------

		/*获取数据区域*/

		//查询融资详情 传入申请单编号
		$scope.queryFinanceInfo = function(requestNo){
			var promise = http.post(BTPATH.QUERY_FINANCE_DETAIL,{"requestNo":requestNo}).success(function(data){
			    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
			      $scope.$apply(function(){
			          $scope.info = data.data;
			      });
			    }   
			});
			return promise;
		};

		//查询审贷详情（贷款方案）
		$scope.queryLoanSchemeInfo = function(requestNo){
			var promise = http.post(BTPATH.FIND_SCHEME,{"requestNo":requestNo}).success(function(data){
			    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
			      $scope.$apply(function(){
			          $scope.loanInfo = data.data;
			      });
			    }   
			});
			return promise;
		};


		//获取标的物列表（应收|票据）
		$scope.queryProofList = function(){
        	var requestType = $scope.info.requestType,
		      	orderId = $scope.info.orders,
		      	config = _linkedConfig[requestType];
			if(requestType && config){
				http.post(BTPATH.FIND_SUBJECT_MASTER,{"type":requestType,"id":orderId}).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope[config.list_name] = common.cloneArrayDeep(data.data);
						});
					} 
				});
			}
			
		};

		//获取授信
		$scope.queryCreditList = function(){
			var promise = http.post(BTPATH.FIND_CREDIT,{'custNo':$scope.info.custNo,'coreCustNo':$scope.info.coreCustNo,'factorNo':$scope.info.factorNo}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.creditList = ArrayPlus(data.data).replaceChildProp("name",'text',true);
					});
				} 
			});
			return promise;
		};


		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){

			//获取请求编号
			var requestNo = $scope.businessInfo.requestNo;

			//获取申请详情
			$scope.queryFinanceInfo(requestNo).success(function(){
				//标的物列表
				$scope.queryProofList(requestNo);
				//授信字典
				commonService.queryBaseInfoList(BTPATH.FIND_CREDIT,{'custNo':$scope.info.custNo,'coreCustNo':$scope.info.coreCustNo,'factorNo':$scope.info.factorNo},$scope,'creditList','_CreditDict');
				//融资材料列表
				commonService.queryBaseInfoList(BTPATH.QUERY_UPLOAD_LIST,{batchNo:$scope.info.batchNo},$scope,'materialList');
			});
			//贷款方案详情
			$scope.queryLoanSchemeInfo(requestNo);
			
			//查询其他资料列表
			commonService.queryBaseInfoList(BTPATH.QUERY_OTHER_FILE_LIST,{requestNo:requestNo},$scope,'otherInfoList');
			//获取融资协议列表
			commonService.queryBaseInfoList(BTPATH.FIND_ELEC_AGREE_BY_REQUESTNO,{requestNo:requestNo,signType:''},$scope,'agreeList');
			


			//从图片预览页面返回
			/*var preInfo = cache.get('finance_apply_info');
			var agreeList = cache.get('agree_upload_list');
			var invoiceList = cache.get('invoice_upload_list');
			if(preInfo && preInfo.preImg){
				$scope.agreeUploadList = agreeList;
				$scope.invoiceUploadList = invoiceList;
				$scope.info = preInfo;
				cache.put('agree_upload_list',[]);
				cache.put('invoice_upload_list',[]);
				cache.put('finance_apply_info',{});
			}*/
			
		});
	}]);

};