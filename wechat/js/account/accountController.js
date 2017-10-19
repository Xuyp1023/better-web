
exports.installController = function(mainApp,common){

	mainApp.controller('accountController',['$scope','muiSupport','http','$rootScope','cache','wx',function($scope,muiSupport,http,$rootScope,cache,wx){
		/*私有属性区域*/
		_coreCustPicker = {};
		_coreCustList = BTDict.ScfCoreGroup.toArray('value','text');
		/*VM绑定区域*/

		$scope.info = {
			coreCustNo:_coreCustList[0].value
		};

		//上传文件列表
		$scope.upLoadList = [];
		

		/*获取数据区域*/
		//切换查询条件
		$scope.changeCoreCust = function(){
			_coreCustPicker.show(function(items){
				$scope.$apply(function(){
					$scope.info.coreCustNo = items[0].value;
				});
			});
		};

		//融资开户
		$scope.openAccount = function(){
			$scope.info.fileList = ArrayPlus($scope.upLoadList).extractChildArray('id',true);
			http.post(BTPATH.OPEN_ACCOUNT,$scope.info).success(function(data){
				if(common.isCurrentResponse(data)){
					// window.location.href = '#/rigester/success';
					mui.alert('您已经开户成功,点击确认开始融资吧!','温馨提示',function(){
						window.location.href = BTServerPath+'/Wechat/Platform/toHome';
					});
				}else{
					mui.alert('申请失败,请联系客服人员,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};


		//删除附件
		$scope.delUpload = function(item){ 
 			$scope.upLoadList = ArrayPlus($scope.upLoadList).delChild('id',item.id);
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
				http.post(BTPATH.SAVE_REHISTERPLUS_INFO,{
					fileTypeName:flag,
					fileMediaId:res.serverId
				}).success(function(data){
					console.log(data);
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.upLoadList.push(data.data);
						});
					}
				});
			},true);
		};


		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//创建单项选择
			_coreCustPicker = muiSupport.singleSelect(_coreCustList);
			var preUploadList = cache.get('pre_upload_list');
			var preInfo = cache.get('account_info');
			if((!!preUploadList)&&(!!preInfo)){
				$scope.upLoadList = preUploadList;
				$scope.info = preInfo;
				cache.put('pre_upload_list',[]);
				cache.put('account_info',{});
			}
		});
	}]);

};