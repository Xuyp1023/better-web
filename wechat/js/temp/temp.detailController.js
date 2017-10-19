
exports.installController = function(mainApp,common){

	mainApp.controller('bill.detailController',['$scope','muiSupport','http','$rootScope','$route','cache','wx','$route',
		function($scope,muiSupport,http,$rootScope,$route,cache,wx,$route){
		/*私有属性区域*/
		_statusPicker = {};
		_statusList = BTDict.AcceptFinanceFlag.toArray('value','text');
		/*VM绑定区域*/
		$scope.searchData = {
			financeFlag:''
		}; 

		$scope.info = {};

		//分页数据   
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10
		};

		//附件列表
		$scope.upLoadList = [];
		

		/*获取数据区域*/

		//获取到票据详情
		$scope.queryInfo = function(id){
			http.post(BTPATH.QUERY_ONE_BILL,{id:id}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data;
						$scope.info.invoiceBalanceSum = '';
						$scope.info.agreeBalance = '';
					});
				}else{
					mui.alert('未查询到对应票据信息,服务端\n返回信息:'+data.message,'错误信息');
				}  
			});
		};

		//申请融资
		$scope.applyFinance = function(){
			$scope.info.billId = $scope.info.id;
			$scope.info.fileList = ArrayPlus($scope.upLoadList).extractChildArray('id',true);
			http.post(BTPATH.APPLY_FINANCE,$scope.info).success(function(data){
				if(common.isCurrentResponse(data)){
					window.location.href = '#/finance/success';
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
			cache.put('pre_upload_list',$.extend({},$scope.upLoadList));
			window.location.href = '#/preImg/'+item.id+',0';
		};

		//上传图片附件
		$scope.uploadImage = function(flag){
			wx.uploadImage(function(res){
				http.post(BTPATH.SAVE_PLUS_INFO,{
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
			});
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			var id = $route.current.pathParams.id;
			$scope.queryInfo(id);
			var preUploadList = cache.get('pre_upload_list');
			if(preUploadList){
				$scope.upLoadList = preUploadList;
				cache.put('pre_upload_list',[]);
			}

		});
	}]);

};