
exports.installController = function(mainApp){

	mainApp.controller('financeDetailCtrl',['$scope','$location','muiSupport','$routeParams','http','commonService',function($scope,$location,muiSupport,$routeParams,http,commonService){ 
		$scope.info = {};
		$scope.info.asset = {};

		//合同附件列表
		$scope.agreeUploadList = [{
			fileInfoType:'agreeAccessory'
		}];
		//发票附件列表
		$scope.invoiceUploadList = [{
			fileInfoType:'invoiceFile'
		}];
		
		// 附件图片预览		
		$scope.preImg = function(item){
			//缓存数据
			/*cache.put('agree_upload_list',$scope.agreeUploadList);
			cache.put('invoice_upload_list',$scope.invoiceUploadList);
			cache.put('finance_apply_info',$.extend({preImg:true},$scope.info));*/
			window.location.href = '#/preImg/'+item.id;
		};
		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){ 
			//创建轮播
			// muiSupport.slide('#slider');
			var id = $routeParams.id;
			var version = $routeParams.version;
			console.log(12345);
			console.log(id);
			http.post(BTPATH.FIND_RECEIVABLE_REQUEST_FINDREQUESTBYRECEIVABLEID,{refNo:id,version:version}).success(function(data){
				$scope.$apply(function(){
					$scope.info = data.data;
					
					// 查询合同附件
					if($scope.info .asset.goodsBatchNo){
						commonService.queryBaseInfoList(BTPATH.FIND_CUSTFILE_FILELIEBYBATCHNO,{batchNo: $scope.info.asset.goodsBatchNo},$scope,'agreeUploadList');
					}
					if($scope.info .asset.statementBatchNo){ 
						commonService.queryBaseInfoList(BTPATH.FIND_CUSTFILE_FILELIEBYBATCHNO,{batchNo: $scope.info.asset.statementBatchNo},$scope,'invoiceUploadList');
					}
				})
			})
		});
	}]);

}; 