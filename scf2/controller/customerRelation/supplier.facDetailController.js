/*
开通保理业务详情
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('supplier.facDetailController',['$scope','http','$rootScope','$route','cache','commonService','form','$location',function($scope,http,$rootScope,$route,cache,commonService,form,$location){

			//详情
			$scope.info = {
			};

			//查询返回的保理机构列表
			$scope.factorList=[];
			//查询返回的电子合同服务商列表
			$scope.wosList=[];
			$scope.recordList=[];

			// 添加客户关系条件
			$scope.addData = {
				factorCustType:'FACTOR_USER',
				wosCustType:'WOS',
				factorCustNoList:'',
				wosCustNoList:'',
				custNo:''
			};	
			$scope.businStatus='';
			

			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				$scope.findFactorBusinessRequest();
				$scope.findCustInfo();
				// debugger;
				// console.log('custName:'+cache.get('upload_param').custName);
				$scope.factorList.push({
					value:cache.get('upload_param').custNo,
					name:cache.get('upload_param').custName
				});
				$scope.findCustRelateAduitRecord(cache.get('upload_param').custNo);
				$scope.businStatus=cache.get('upload_param').businStatus;

				common.resizeIframeListener();
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});

			//查询基础信息
			$scope.findFactorBusinessRequest = function(){
				$scope.addData.custNo=cache.get('upload_param').selectCustNo;				
				$.post(BTPATH.FIND_FACTORBUSINESS_REQUEST,{custNo:$scope.addData.custNo},function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.info = data.data;
						});
					}
				},'json');
			};


			//查询类型列表
			$scope.findCustInfo = function(){
				// 查询电子合同服务商信息客户号
				$.post(BTPATH.FIND_ELECAGREEMENT_SERVICECUST,$.extend(),function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.wosList = data.data;
						});
					}
				},'json');
			};

			//查看资料详情	isAt|是否wos  isDel附件是否可以有删除功能
			$scope.lookResource = function(custNo,isAt,relateCustName){
				var custType=isAt?'FACTOR_USER':'WOS';
				$location.url('/customerRelation/facUploadData/'+custNo+'/'+custType+'/'+relateCustName);
				// window.location.href = '#/customerRelation/facUploadData/'+custNo+'/'+custType+'/'+relateCustName;
				/*window.location.href = '#/customerRelation/facUploadData/'+custNo+'/'+custType+'/'+isDel+'/'+custName+'/'+$scope.businStatus;*/
			};

			//打开 申请资料 面板
			$scope.openResourceBox = function(item){
				$scope.openRollModal("resource_box");
			};

			//提交申请
			$scope.openAccount = function(target){
				var $target = $(target);

				$scope.addData.wosCustNoList = ArrayPlus($scope.wosList).extractChildArray('value',true);
				$scope.addData.factorCustNoList=form.getCheckboxValueArray($('#cb4 [mapping="checkboxCustGroup"] :checkbox'),true);

				if(!$scope.addData.factorCustNoList){
					tipbar.errorLeftTipbar($target,'请选择保理机构！',3000,9999);
					return;
				}

				http.post(BTPATH.ADD_FACTOR_CUST_RELATION,$scope.addData).success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		tipbar.infoTopTipbar('提交申请成功!',{});
				 		window.location.href = '#/customerRelation/coreRelationManage';
				 	}else{
				 		tipbar.errorTopTipbar($target,'提交申请失败,服务器返回:'+data.message,3000,6662);
				 	}
				 });
			};

			//查询审批记录
			$scope.findCustRelateAduitRecord = function(custNo){
				var selectRelateType=cache.get('upload_param').selectRelateType;

				$.post(BTPATH.FIND_CUST_RELATEADUIT_RECORD,{custNo:custNo,selectCustNo:$scope.addData.custNo,relateType:selectRelateType},function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.recordList = data.data;
						});
					}
				},'json');
			};

			//返回
			$scope.goBack = function(){
				   window.history.back();
				// $location.url('/customerRelation/coreRelationManage');
				// window.location.href = '#/customerRelation/coreRelationManage/';
			};

		}]);

	};

});