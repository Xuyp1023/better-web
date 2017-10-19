
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('seller.contractAdd',['$scope','http','$rootScope','$route','cache','upload','$location','$window',function($scope,http,$rootScope,$route,cache,upload,$location,$window){
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
				common.resizeIframeListener();
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
		        	common.resizeIframeListener();
				});

				$scope.findBuyerCustInfo().success(function(){
					$scope.queryCoreCustList().success(function(){
						$scope.findSupplierCustInfo();
					});
				});

			});

			// 查询买方的客户信息
			$scope.findBuyerCustInfo = function(){
				return $.post(BTPATH.FIND_CONTRACT_LEDGER_CUSTINFO,{custNo:null},function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.info.buyerInfo = data.data;
						});
					}
				},'json');
			};

			

			// 查询对应的核心企业列表信息
			$scope.queryCoreCustList = function(){
				return $.post(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.info.buyerInfo.custNo},function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.coreList = data.data;
							$scope.info.supplierNo=common.filterArrayFirst(data.data);
						});
					}
				},'json');
			};
			

			// 查询卖方的客户信息
			$scope.findSupplierCustInfo = function(){
				$.post(BTPATH.FIND_CONTRACT_LEDGER_CUSTINFO,{custNo:$scope.info.supplierNo},function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.info.supplierInfo = data.data;
						});
					}
				},'json');
			};

			//删除附件
			$scope.delAddUpload = function(item){
				$scope.uploadList = ArrayPlus($scope.uploadList).delChild('id',item.id);
			};


			//新增合同
			$scope.addContract = function(target){
				$scope.info.buyerNo=$scope.info.buyerInfo.custNo+"";
				$scope.info.buyer=$scope.info.buyerInfo.custName;
				$scope.info.supplier=$scope.info.supplierInfo.custName;
				var result=validate.validate($('#addContract_form'));
				$target=$(event.target);
				if (!result) {
					tipbar.errorTopTipbar($target,'您还有信息项没有正确填写!',3000,99999);
					return;
				}
				common.cleanPageTip();
				$scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
				$.post(BTPATH.ADD_CONTRACT_LEDGER,{params:JSON.stringify($scope.info)},function(data){
					if(data&&(data.code === 200)){
						tipbar.infoTopTipbar('合同添加成功!',{});
						$window.location.href = '#/sellerContract/list/';
					}else{
						tipbar.errorTopTipbar($target,'新增失败，服务端返回信息:'+data.message,3000,99999);
					}
				},'json');
			};

			//返回
			$scope.goBack = function(){
				$location.url("/sellerContract/list");
			};

			/*表单验证*/
      	validate.validate($('#addContract_form'), {
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
