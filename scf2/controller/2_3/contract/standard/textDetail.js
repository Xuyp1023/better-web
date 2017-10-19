/*
开通保理业务受理
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contract_2_3.standardTextDetail',['$scope','http','$rootScope','$route','cache','form',function($scope,http,$rootScope,$route,cache,form){

			//详情
			$scope.info = {};
			// 获取到要传入的客户编号 custNo
			$scope.custInfo = {
				'custNo' :'',
				'aduitOpinion':'',
				'aduitStatus':'',
				'passFiles':'',
				'failFiles':'',
				'relateType':''
			};

			$scope.isAllChecked = true;

			$scope.attachList = [];

			form.installCheckboxTools($scope);

			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				// 获取到要传入的客户编号 custNo
				$scope.custInfo.custNo=$route.current.pathParams.custNo;
				$scope.custInfo.relateType=cache.get("relateType");
				
				$scope.findFactorBusinessRequest($scope.custInfo.custNo);
				$scope.findRequestFile($scope.custInfo.custNo);
				/*公共绑定*/
				common.resizeIframeListener();
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});

			//更新权限框状态
			$scope.changeIsAllChecked = function(target){
				if(target.checked){

				}
			};

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

			// 查询上传附件的资料
			$scope.findRequestFile = function(custNo){
				return http.post(BTPATH.FIND_RELATEADUIT_TEMP_FILE,{custNo:custNo}).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.attachList = data.data;							
							$scope.downListUrl = BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + ArrayPlus($scope.attachList).extractChildArray("id",true) + "&fileName=保理业务资料包";							
							$scope.attachList = ArrayPlus($scope.attachList).addKey4ArrayObj('isChecked',true);
						});	
					}
				});
			};


			//全选|全反选
			$scope.toggleCheckAll = function(target){
				var input = $(target).find("input:checkbox")[0],	
					checked = $(input).attr("checked");
				if(checked)
					$('#aduitFile [mapping="checkboxAduitFile"] :checkbox').attr("checked","checked");
				else
					$('#aduitFile [mapping="checkboxAduitFile"] :checkbox').removeAttr("checked");
			};



			// 文件受理/拒绝
			$scope.openAccount = function(aduitStatus){
				$scope.custInfo.aduitStatus=aduitStatus;
				$scope.custInfo.passFiles = ArrayPlus($scope.attachList).objectChildFilterByBoolean('isChecked',true);
				$scope.custInfo.passFiles = ArrayPlus($scope.custInfo.passFiles).extractChildArray('batchNo',true);
				$scope.custInfo.failFiles = ArrayPlus($scope.attachList).objectChildFilterByBoolean('isChecked',false);
				$scope.custInfo.failFiles = ArrayPlus($scope.custInfo.failFiles).extractChildArray('batchNo',true);

				// 获取选中的文件				
				return http.post(BTPATH.SAVE_ACCEPT_ADUIT,$scope.custInfo).success(function(data){
					if((data!==undefined)&&(data.data!==undefined)&&(data.code === 200)){
						$scope.$apply(function(){
							tipbar.infoTopTipbar('成功!',{});
							window.location.href = window.BTServerPath + '/scf2/views/sfccom/whitelist/whiteListAccept.html';
						});	
					}
				});
			};
			
			//返回
			$scope.goBack = function(){
				window.location.href = window.BTServerPath + '/scf2/views/sfccom/whitelist/whiteListAccept.html';
				// window.history.back();
			};


		    // 打包下载全部附件



		}]);

	};

});