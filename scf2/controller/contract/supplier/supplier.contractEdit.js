
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('supplier.contractEdit',['$scope','http','$rootScope','$route','cache','upload','$location','$window',function($scope,http,$rootScope,$route,cache,upload,$location,$window){
     
      /*  VM绑定区域  */
      upload.regUpload($scope);

      // 合同基本信息
      $scope.info = {
      	supplierNo:null,
		signDate : new Date().format('YYYY-MM-DD'),
		agreeStartDate : new Date().format('YYYY-MM-DD'),
		agreeEndDate : new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),
		deliveryDate : new Date().format('YYYY-MM-DD'),
		fileList:null,
	      // 买方信息
	      buyerInfo : {
	      },
	      // 卖方信息
		  supplierInfo : {
	      }
      };
      // 核心企业列表
      $scope.coreList = [];

      //合同附件列表
      $scope.uploadList = [];

      /*  业务处理绑定区域  */




			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){

				$scope.info.id=$route.current.pathParams.contractId;
				$scope.findContractLedgerCustFileItems($scope.info.id);

				$scope.findContractLedgerInfo().success(function(){
					$scope.queryCoreCustList();
					$scope.findBuyerCustInfo();
					$scope.findSupplierCustInfo();
				});

				common.resizeIframeListener();
		        /*公共绑定*/
		        $scope.$on('ngRepeatFinished',function(){
		        	common.resizeIframeListener();
		        });

			});

			// 查询对应的核心企业列表信息
			$scope.queryCoreCustList = function(){
				$.post(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.info.supplierNo},function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.coreList = data.data;
						});
					}
				},'json');
			};

			// 查询合同信息
			$scope.findContractLedgerInfo = function(){
				return $.post(BTPATH.FIND_CONTRACT_LEDGERINFO,{contractId:$scope.info.id},function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.info = data.data;
						});
					}
				},'json');
			};

			// 查询买方的客户信息
			$scope.findBuyerCustInfo = function(){
				$.post(BTPATH.FIND_CONTRACT_LEDGER_CONTRACTID,{custNo:$scope.info.buyerNo,contractId:$scope.info.id},function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.info.buyerInfo = data.data;
						});
					}
				},'json');
			};
			

			// 查询卖方的客户信息
			$scope.findSupplierCustInfo = function(){
				$.post(BTPATH.FIND_CONTRACT_LEDGER_CONTRACTID,{custNo:$scope.info.supplierNo,contractId:$scope.info.id},function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.info.supplierInfo = data.data;
						});
					}
				},'json');
			};

			// 查询合同附件列表
			$scope.findContractLedgerCustFileItems = function(contractId){
				$.post(BTPATH.FIND_CONTRACT_LEDGER_CUSTFILEITEMS,{contractId:contractId},function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.uploadList = data.data;
						});
					}
				},'json');
			};

			//删除附件
			$scope.delAddUpload = function(item){
				$scope.uploadList = ArrayPlus($scope.uploadList).delChild('id',item.id);
			};

			//修改合同
			$scope.editContract = function(target){
				$scope.info.id=$scope.info.id+"";
				$scope.info.buyerNo=$scope.info.buyerNo+"";
				$scope.info.supplierNo=$scope.info.supplierNo+"";
				$scope.info.buyer=$scope.info.buyerInfo.custName;
				$scope.info.supplier=$scope.info.supplierInfo.custName;
				$scope.info.balance=$scope.info.balance+"";
				var result=validate.validate($('#editContract_form'));
				$target=$(event.target);
				if (!result) {
					tipbar.errorTopTipbar($target,'您还有信息项没有正确填写!',3000,99999);
					return;
				}
				common.cleanPageTip();
				$scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
				$.post(BTPATH.SAVE_CONTRACT_LEDGER,{params:JSON.stringify($scope.info)},function(data){
					if(data&&(data.code === 200)){
						tipbar.infoTopTipbar('合同修改成功!',{});
						$window.location.href = '#/supplierContract/list/';
					}else{
						tipbar.errorTopTipbar($target,'编辑失败，服务端返回信息:'+data.message,3000,99999);
					}
				},'json');
			};

			//返回
			$scope.goBack = function(){
				$location.url("/supplierContract/list");
			};


			/*表单验证*/
      	validate.validate($('#editContract_form'), {
      	      elements: [{
      	          name: 'info.agreeNo',
      	          rules: [{
      	              name: 'required'
      	          }],
      	          events: ['blur']
      	      },{
      	          name: 'info.agreeName',
      	          rules: [{
      	              name: 'required'
      	          }],
      	          events: ['blur']
      	      },{
      	          name: 'info.supplierNo',
      	          rules: [{
      	              name: 'required'
      	          }],
      	          events: ['blur']
      	      },{
      	          name: 'info.signDate',
      	          rules: [{
      	              name: 'required'
      	          }],
      	          events: ['blur']
      	      },{
      	          name: 'info.signAddr',
      	          rules: [{
      	              name: 'required'
      	          }],
      	          events: ['blur']
      	      }],
      	      errorPlacement: function(error, element) {
      	          tipbar.tdTipbar(element,error);
      	      }
      	});


		}]);

	};

});
