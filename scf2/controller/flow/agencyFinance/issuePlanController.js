/*
	保理公司 出具保理方案
	@author herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		var flowService = require('./service/agencyFinanceService.js');
		flowService.servPlus(mainApp,common);

		mainApp.controller('issuePlanController',['$scope','http','$rootScope','$route','cache','detailShow','commonService','flowService','$window',function($scope,http,$rootScope,$route,cache,detailShow,commonService,flowService,$window){

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
					validate.validate($('#approve_handle_issue'),validOption);
					var valid = validate.validate($('#approve_handle_issue'));
					if(!valid) return false;
				}
				//出具贷款方案
				return $.extend({},$scope.loanInfo,{
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
	        	return detailShow.getFinanceCredentialDetail($scope,type,data.id);
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


	        //打开贸易合同新增 box
	        $scope.openAddContractBox = function(){
	        	$scope.setBuyerAndSupplier();
	        	$scope.proof_info.type='order';
	        	cache.put("loanInfo",$scope.loanInfo);
	        	//缓存当前 订单id 以及角色信息
	        	cache.put("add_action_info",{
	        		role:'agency',
	        		proof_info:$scope.proof_info,
	        		'preInfo':{ 'origin_path': $rootScope.origin_path} //流程来源页面
	        	});
	        	$window.location.href = "home.html#/data/common/addContract";
	        };

	        //打开发票新增 box
	        $scope.openAddInvoiceBox = function(){
	        	$scope.setBuyerAndSupplier();
	        	cache.put("loanInfo",$scope.loanInfo);
	        	$scope.proof_info.type='order';
	        	//缓存当前 订单id 以及角色信息
	        	cache.put("add_action_info",{
	        		role:'agency',
	        		proof_info:$scope.proof_info,
	        		'preInfo':{ 'origin_path': $rootScope.origin_path} //流程来源页面
	        	});
	        	$window.location.href = "home.html#/data/common/addInvoice";
	        };

	        // 设置买方，卖方属性值
	        $scope.setBuyerAndSupplier = function(){
		          $scope.proof_info.buyer=$scope.proof_info.coreCustName;
		          $scope.proof_info.buyerNo=$scope.proof_info.coreCustNo;
		          $scope.proof_info.supplier=$scope.proof_info.custName;
		          $scope.proof_info.supplierNo=$scope.proof_info.custNo;
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

	         //删除合同
			$scope.deleteContract = function(target,contractId){
				$target = $(target);

				$scope.linkedType="5";
				/*if($scope.proof_info.type=='draft'){ // 汇票
		          $scope.linkedType="3";
		        }else if($scope.proof_info.type=='order'){ //  订单
		          $scope.linkedType="5";
		        }else if($scope.proof_info.type=='recieve'){ // 应收账款
		          $scope.linkedType="4";
		        }if($scope.proof_info.type=='bill'){ // 汇票
		          $scope.linkedType="3";
		        }*/

				dialog.confirm('您确定删除此项合同吗？',function(){
					http.post(BTPATH.DEL_LINK_CHILDINFO,{
						infoId:contractId,
						enterId:$scope.proof_info.id,
						infoType:'0',
						enterType:$scope.linkedType
					}).success(function(data){
						if(common.isCurrentData(data)){
							$.post(BTPATH.DELETE_CONTRACT_AGREE,{agreeId:contractId},function(data){
								if(data&&(data.code === 200)){
									tipbar.infoTopTipbar('删除成功!',{});
									$scope.$apply(function(){
										$scope.proof_info.agreementList = ArrayPlus($scope.proof_info.agreementList).delChild('id',contractId);
									});
								}else{
									tipbar.errorLeftTipbar($target,'删除合同失败，服务端返回信息:'+data.message);
								}
							},'json');
						}else{
							tipbar.errorLeftTipbar($target,'删除'+config.name+'失败,服务器返回:'+data.message,3000,6001);
						}
					});
				});
					
			};

	        //删除发票
			$scope.deleteInvoice = function(target,invoiceId){
				$target = $(target);
				/*if($scope.proof_info.type=='draft'){ // 汇票
		          $scope.linkedType="3";
		        }else if($scope.proof_info.type=='order'){ //  订单
		          $scope.linkedType="5";
		        }else if($scope.proof_info.type=='recieve'){ // 应收账款
		          $scope.linkedType="4";
		        }if($scope.proof_info.type=='bill'){ // 汇票
		          $scope.linkedType="3";
		        }*/
		        $scope.linkedType="5";
		        
				dialog.confirm('您确定删除此项发票吗？',function(){
					http.post(BTPATH.DEL_LINK_CHILDINFO,{
						infoId:invoiceId,
						enterId:$scope.proof_info.id,
						infoType:'1',
						enterType:$scope.linkedType
					}).success(function(data){
						if(common.isCurrentData(data)){
							$.post(BTPATH.DEL_INFO_INVOICE,{id:invoiceId},function(data){
								if(data&&(data.code === 200)){
									tipbar.infoTopTipbar('删除成功!',{});
									$scope.$apply(function(){
										$scope.proof_info.invoiceList = ArrayPlus($scope.proof_info.invoiceList).delChild('id',invoiceId);
									});
								}else{
									tipbar.errorLeftTipbar($target,'删除发票失败，服务端返回信息:'+data.message);
								}
							},'json');
						}else{
							tipbar.errorLeftTipbar($target,'删除'+config.name+'失败,服务器返回:'+data.message,3000,6001);
						}
					});
				});
					
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

					//从新增合同|发票 页面跳回
	        		var loanInfo = cache.get("loanInfo");
	        		var actionInfo = cache.get("add_action_info");
	        		if(loanInfo){
	        			//取出流程来源页面
	        			$rootScope.origin_path = actionInfo.preInfo.origin_path;
	        			$scope.loanInfo = loanInfo;
	        			cache.remove("loanInfo");
	        			cache.remove("add_action_info");
	        			//打开详情面板
	        			$scope.showfactorProofDetail(actionInfo.proof_info.type,{id:actionInfo.id}).success(function(){
	        				common.resizeIframeListener();
	        			});
	        			return;
	        		}

	        		//查询审贷方案详情
	        		flowService.queryLoanSchemeInfo($scope,requestNo).success(function(){
	        			//当前审贷信息中没有相关数据，从融资申请中获取
        				$scope.$apply(function(){
        					$scope.loanInfo = $.extend({},$scope.loanInfo,{
	        					"requestBalance":$scope.financeInfo.balance,
	        					"period":$scope.financeInfo.period,
	        					"periodUnit":$scope.financeInfo.periodUnit,
	        					"creditMode":$scope.financeInfo.creditMode
	        				});
		        			//审贷信息 默认值
		        			$scope.loanInfo.approvedPeriodUnit = $scope.loanInfo.approvedPeriodUnit||$scope.periodUnits[0].value;//审贷期限单位
		        			$scope.loanInfo.creditMode = $scope.loanInfo.creditMode||$scope.financeInfo.creditMode;		//授信类型
		        		});
	        			common.resizeIframeListener();
	        		});

	        	});

	        	/*公共绑定*/
	        	$scope.$on('ngRepeatFinished',function(){
	        		common.resizeIframeListener();  
	        	});
	        	
	        });



	        

			//====================================================校验配置 start ========================================================	

	        //校验配置(出具贷款方案)
	        var validOption = {
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