/*
供应商/采购商开通保理业务
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('supplier.openFactorController',['$scope','http','$rootScope','$route','cache','commonService','form','$location',function($scope,http,$rootScope,$route,cache,commonService,form,$location){

			//详情
			$scope.info = {};

			//查询返回的保理机构列表
			$scope.factorList=[];
			//查询返回的电子合同服务商列表
			$scope.wosList=[];

			//搜索所需信息
			$scope.searchData = {
				custNo:null,
				custName:''
			};

			// 添加客户关系条件
			$scope.addData = {
				factorCustType:'FACTOR_USER',
				wosCustType:'WOS',
				factorCustNoList:'',
				wosCustNoList:'',
				custNo:''
			};

			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				$scope.findFactorBusinessRequest();
				$scope.findCustInfo();
				
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
				$scope.searchData.custNo=$scope.addData.custNo; 
				// 查询电子合同服务商信息客户号
				$.post(BTPATH.FIND_CUST_INFO,$.extend({custType:cache.get("related_cust_type")},$scope.searchData),function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.factorList = data.data;
						});
					}
				},'json');

				$.post(BTPATH.FIND_ELECAGREEMENT_SERVICECUST,$.extend({custType:'WOS'},$scope.searchData),function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.wosList = data.data;
						});
					}
				},'json');
			};



			//查看资料详情	isAt|是否wos
			$scope.lookResource = function(custNo,isAt,disRelateCustName){
				// 清空缓存
				cache.put('upload_param',{
					'disCustName':$scope.info.custName,
					'selectCustNo':$scope.addData.custNo
				});
				var custType = isAt ? 'FACTOR_USER':'WOS';
				//window.location.href = '#/customerRelation/facUploadData/'+custNo+'/'+custType/*+'/'+disRelateCustName*/;
				$location.url('/customerRelation/facUploadData/'+custNo+'/'+custType+'/'+disRelateCustName);
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

			//返回
			$scope.goBack = function(){
				window.location.href="#/customerRelation/coreRelationManage";
			};


		}]);

	};

});