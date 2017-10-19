
exports.installController = function(mainApp,common){

	mainApp.controller('relation.factorAttachController',['$scope','muiSupport','http','$rootScope','cache','wx',function($scope,muiSupport,http,$rootScope,cache,wx){
		/*VM绑定区域*/

		/*获取数据区域*/


		// 上传文件列表
		$scope.upLoadList = [];
		// 电子合同服务商客户号列表
		$scope.elecAgreementServiceCustList = [];
		// 电子合同服务商文件/文件类型列表
		$scope.elecCustFileList = [];

		//删除附件
		/*$scope.delUpload = function(item){ 
 			// $scope.upLoadList = ArrayPlus($scope.upLoadList).delChild('id',item.id);

 			var type = item.fileInfoType;
 			$scope.upLoadList = ArrayPlus($scope.upLoadList).replaceChild('fileInfoType',type,{fileInfoType:type});
		};*/

		//删除附件
		$scope.delUpload = function(item){ 
			http.post(BTPATH.DELETE_CUSTADUIT_TEMP_FILE,{id:item.id}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.upLoadList = ArrayPlus($scope.upLoadList).replaceChild('fileInfoType',item.fileInfoType,{
							'fileInfoType':item.fileInfoType,
							'fileDescription':item.fileDescription
						});
					});
				}else{
					mui.alert('删除失败,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		// 删除电子合同服务商附件
		$scope.delWosUpload = function(item){ 
			http.post(BTPATH.DELETE_CUSTADUIT_TEMP_FILE,{id:item.id}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.elecCustFileList = ArrayPlus($scope.elecCustFileList).replaceChild('fileInfoType',item.fileInfoType,{
							'fileInfoType':item.fileInfoType,
							'fileDescription':item.fileDescription
						});
					});
				}else{
					mui.alert('删除失败,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//预览图片
		$scope.preImg = function(item){
			cache.put('pre_upload_list',$scope.upLoadList);
			cache.put('account_info',$scope.info);
			window.location.href = '#/preImg/'+item.id+',1';
		};

		//上传图片附件
		$scope.uploadImage = function(flag){
			wx.uploadImage(function(res){
				http.post(BTPATH.ADD_CUST_FILEADUIT_TEMP,{
					relateCustNo:cache.get("apply_related_factor")[0].value,
					fileTypeName:flag,
					fileMediaId:res.serverId,
					custType:"FACTOR_USER"
				}).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							var type = data.data.fileInfoType;
							$scope.upLoadList = ArrayPlus($scope.upLoadList).replaceChild('fileInfoType',type,data.data);
							// $scope.upLoadList.push(data.data);
						});
					}
				});
			},true);
		};

		//上传电子合同服务商图片附件
		$scope.uploadWosImage = function(flag){
			wx.uploadImage(function(res){
				http.post(BTPATH.ADD_CUST_FILEADUIT_TEMP,{
					relateCustNo:$scope.elecAgreementServiceCustList[0].value,
					fileTypeName:flag,
					fileMediaId:res.serverId,
					custType:"WOS"
				}).success(function(data){
					console.log(data);
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							var type = data.data.fileInfoType;
							$scope.elecCustFileList = ArrayPlus($scope.elecCustFileList).replaceChild('fileInfoType',type,data.data);
							// $scope.upLoadList.push(data.data);
						});
					}
				});
			},true);
		};

		//跳转下一步
		$scope.nextStep = function(){
			cache.put("apply_related_wos",$scope.elecAgreementServiceCustList);
			window.location.href = '#/relation/factor/ensure';
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){

			// 保理
			// 电子合同服务商
			$scope.findCustInfo();

			var preUploadList = cache.get('pre_upload_list');
			var preInfo = cache.get('account_info');
			if((!!preUploadList)&&(!!preInfo)){
				$scope.upLoadList = preUploadList;
				$scope.info = preInfo;
				cache.put('pre_upload_list',[]);
				cache.put('account_info',{});
			}

		});


		// 查询附件列表
		$scope.findCustInfo = function(){
			// 获取选中的保理公司客户号，查询附件列表信息
			console.info("param" + cache.get("apply_related_factor")[0].value);
			$.post(BTPATH.FIND_CUST_ADUIT_TEMP,{relateCustNo:cache.get("apply_related_factor")[0].value},function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.upLoadList = data.data;
					});
				}else{
					mui.alert('未查询到数据');
					location.href = '#/relation/select';
					return;
				}
			},'json');

			// 查询电子合同服务商信息客户号
			$.post(BTPATH.FIND_ELECAGREEMENT_SERVICE_CUST,function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.elecAgreementServiceCustList = data.data;
						$scope.findElecAgreementServiceCustList(true);
					});
				}
			},'json');
		};

		//获取电子合同服务商附件类型列表
		$scope.findElecAgreementServiceCustList = function(flag){

			return http.post(BTPATH.FIND_CUST_ADUIT_TEMP,{relateCustNo:$scope.elecAgreementServiceCustList[0].value}).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.elecCustFileList = data.data;
						});
					}
			});
		};



	}]);

};