
/*
	融资详情
	@author : herb
*/

exports.installController = function(mainApp,common){

	mainApp.controller('flow.financeDetailController',['$scope','muiSupport','http','$rootScope','$route','cache','commonService',function($scope,muiSupport,http,$rootScope,$route,cache,commonService){

		var currentTask = cache.get("currentTask");
		debugger;

		//当前业务信息
		$scope.businessInfo = {
			'requestNo':currentTask.workFlowBusiness.businessId,
			'nodeName':currentTask.workFlowNode.nickname
		};

		/*VM绑定区域*/
		//申请信息
		$scope.info = {
			/*custName:'深圳市润祥工程技术有限公司',
			factorName:'深圳前海特智商业保理有限公司',
			coreCustName:'广东德豪润达电气股份有限公司',
			applyType:'应收账款 / 票据',
			balance:2000000*/
		};

		//融资方案
		$scope.scheme = {
			/*custName:'深圳市润祥工程技术有限公司',
			factorName:'深圳前海特智商业保理有限公司',
			coreCustName:'广东德豪润达电气股份有限公司',
			applyType:'应收账款 / 票据',
			balance:2000000*/
		};

		//应收列表
		$scope.recieveList = [/*{
			id:123,
			balance:123213,
			date:'2017-04-03',
			proName:'货物名称',
			proPrice:120,
			number:10
		},{
			id:123,
			balance:123213,
			date:'2017-04-03',
			proName:'货物名称',
			proPrice:120,
			number:10
		}*/];
		//汇票列表
		$scope.billList = [/*{
			id:123,
			balance:123213,
			sta_date:'2017-04-03',
			end_date:'2018-03-04',
			xxx:123,
			account:622588745874587455
		}*/];

		//融资材料列表
		$scope.materialList = [/*{
			type:'合同附件',
			name:'LED采购合同'
		},{
			type:'发票附件',
			name:'LED采购发票'
		}*/];

		//其他材料列表
		$scope.otherInfoList = [/*{
			type:'合同附件',
			name:'LED采购合同'
		},{
			type:'发票附件',
			name:'LED采购发票'
		}*/];

		//审贷详情（贷款方案）
		$scope.loanInfo = {
			/*applyBalance:1000,
			auditBalance:2000,
			applyPeriod:10,
			auditPeriod:10,
			xxxx:12*/
		};
		//融资协议列表
		$scope.agreeList = [/*{
			type:'转让通知书',
			name:'应收账款转让通知书'
		},{
			type:'确认意见书',
			name:'应收账款转让通知确认'
		}*/];


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
		$scope.creditList = [/*{
			id:123,
			balance:123213,
			sta_date:'2017-04-03',
			end_date:'2018-03-04',
			xxx:123,
			account:622588745874587455
		}*/];

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