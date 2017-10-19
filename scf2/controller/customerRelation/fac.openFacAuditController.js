/*
开通保理业务审核
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('fac.openFacAuditController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){

			//详情
			$scope.info = {};
			// 获取到要传入的客户编号 custNo
			$scope.custInfo = {
				'custNo' :'',
				'aduitOpinion':'',
				'aduitStatus':'',
				'relateType':''
			};
			$scope.attachList = [];
			$scope.recordList = [];
		
			

			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				$scope.custInfo.custNo=$route.current.pathParams.custNo;
				$scope.custInfo.relateType=cache.get("relateType");
				$scope.findFactorBusinessRequest($scope.custInfo.custNo);
				$scope.findRequestFile($scope.custInfo.custNo);
				$scope.findCustRelateAduitRecord($scope.custInfo.custNo);

				common.resizeIframeListener();
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});

			//查询基础信息
			$scope.findFactorBusinessRequest = function(custNo){
				$.post(BTPATH.FIND_FACTORBUSINESS_REQUEST,{custNo:custNo},function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.info = data.data;
						});
					}
				},'json');
			};
			
			//查询审批记录
			$scope.findCustRelateAduitRecord = function(custNo){
				$.post(BTPATH.FIND_CUST_RELATEADUIT_RECORD,{custNo:custNo,selectCustNo:null,relateType:$scope.custInfo.relateType},function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.recordList = data.data;
						});
					}
				},'json');
			};

			// 查询上传附件的资料
			$scope.findRequestFile = function(custNo){
				return http.post(BTPATH.FIND_RELATEADUIT_TEMP_FILE,{custNo:custNo}).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.attachList = data.data;
							$scope.downListUrl = BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + ArrayPlus($scope.attachList).extractChildArray("id",true) + "&fileName=保理业务资料包";
							$scope.attachList = ArrayPlus($scope.attachList).addKey4ArrayObj('isChecked',false);
						});	
					}
				});
			};

			// 文件审批/拒绝
			$scope.openAccount = function(aduitStatus){
				$scope.custInfo.aduitStatus=aduitStatus;

				return http.post(BTPATH.SAVE_ACCEPT_ADUIT,$scope.custInfo).success(function(data){
					if((data!==undefined)&&(data.data!==undefined)&&(data.code === 200)){
						$scope.$apply(function(){
							tipbar.infoTopTipbar('成功!',{});
							window.location.href = window.BTServerPath + '/scf2/views/sfccom/whitelist/whiteListAudit.html';
						});	
					}
				});
			};
			
			//返回
			$scope.goBack = function(){
				window.location.href = window.BTServerPath + '/scf2/views/sfccom/whitelist/whiteListAudit.html';
				// window.history.back();
			};

		}]);

	};

});