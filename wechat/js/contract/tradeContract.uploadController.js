
/*
	上传合同附件
	@author : herb
*/

exports.installController = function(mainApp,common){

	mainApp.controller('tradeContract.uploadController',['$scope','muiSupport','http','$rootScope','$route','cache','wx',function($scope,muiSupport,http,$rootScope,$route,cache,wx){

		/*私有属性区域*/

		$scope.agreeList = [{
			//附件类型 ？
			fileInfoType:'agreeAccessory'	
		}];

		$scope.info ={};

		$scope.contractId ='';
		
		//====================================== 附件相关操作 start ===========================================
	
		//上传图片附件
		$scope.uploadImage = function(){

			wx.uploadImage(function(res){
				http.post(BTPATH.SAVE_CONTRACT_LEDGER_FILE,{
					'contractId':$scope.contractId,
					'fileTypeName':'agreeAccessory',
					'fileMediaId':res.serverId
				}).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							var length = $scope.agreeList.length;
							//用上传返回的数据替换
							$scope.agreeList[length-1] = data.data;
							$scope.agreeList.push({
								fileInfoType:'agreeAccessory'
							});
						});
					}
				});
			},true);
		};

		//删除附件
		$scope.delUpload = function(item){ 
			http.post(BTPATH.DELETE_CONTRACT_FILE,{fileId:item.id}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.agreeList = ArrayPlus($scope.agreeList).delChild("id",item.id);
					});
				}else{
					mui.alert('删除失败,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};


		//预览图片
		$scope.preImg = function(item){
			//缓存数据
			cache.put('agree_list',$scope.agreeList);
			cache.put('contract_info',$.extend({preImg:true},$scope.info));
			window.location.href = '#/preImg/'+item.id;
		};

		//====================================== 附件相关操作 end ===========================================



		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){

			//从图片预览页面返回
			var preInfo = cache.get('contract_info');
			var agreeList = cache.get('agree_list');
			if(preInfo && preInfo.preImg){
				$scope.agreeList = agreeList;
				$scope.info = preInfo;
				cache.put('agree_list',[]);
				cache.put('contract_info',{});
			}

			$scope.contractId = $route.current.pathParams.contractId;

			//查询附件列表
			$scope.queryContractList();

		});

		//获取合同附件列表
		$scope.queryContractList = function(){
			var promise = http.post(BTPATH.FIND_CONTRACT_LEDGER_FILEINFO,{contractId:$scope.contractId}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.agreeList = data.data.custFileList;
						$scope.agreeList.push({
								fileInfoType:'agreeAccessory'
						});
					});
				} 
			});
			return promise;
		};

	}]);

};