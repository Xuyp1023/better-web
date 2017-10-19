
exports.installController = function(mainApp,common){

	mainApp.controller('recieve.detailDidController',['$scope','muiSupport','http','$rootScope','$route','cache','wx','$route',
		function($scope,muiSupport,http,$rootScope,$route,cache,wx,$route){
		/*私有属性区域*/
		_statusPicker = {};
		_statusList = BTDict.AcceptFinanceFlag.toArray('value','text');
		/*VM绑定区域*/

		$scope.info = {};


		//附件列表
		$scope.upLoadList = [];


		/*获取数据区域*/

		//获取到票据详情
		$scope.queryInfo = function(id){
			http.post(BTPATH.QUERY_ONE_BILL/*1*/,{id:id}/*2*/).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data/*3*/;
						//初始化
					});
				}else{
					mui.alert(/*4*/'未查询到对应票据信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//跳到申请融资
		$scope.applyFinance = function(){
			window.location.href = '#/finance/do/bill/'+ $scope.info.id;
		};
		//跳到询价
		$scope.applyInquiry = function(){
			window.location.href = '#/inquiry/do/'+ $scope.info.id;
		};

		//跳到发票列表
		$scope.toInvoiceList = function(){
			cache.put('invoiceList',$scope.info.invoiceList);
			window.location.href = '#/billInvoice';
		};

		//删除附件
		$scope.delUpload = function(item){
 			$scope.upLoadList/*1*/ = ArrayPlus($scope.upLoadList/*1*/).delChild('id',item.id);
		};

		//预览图片
		$scope.preImg = function(item){
			cache.put('pre_upload_list',$.extend({},$scope.upLoadList/*1*/));
			window.location.href = '#/preImg/'+item.id+',0'/*2*/;
		};

		//关联票据附件
		$scope.linkBillUpload = function(fileInfo){
			http.post(BTPATH.SAVE_BILL_FILE, {
				id:$scope.info.id,
				fileId:fileInfo.id
			});
		};

		//上传图片附件
		$scope.uploadImage = function(flag){
			wx.uploadImage(function(res){
				http.post(BTPATH.SAVE_PLUS_INFO/*1*/,{
					fileTypeName:flag,
					fileMediaId:res.serverId
				}).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							/*2*/$scope.upLoadList.push(data.data);
						});
						$scope.linkBillUpload(data.data);
					}
				});
			});
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			// 获取到要传入的path变量
			var id = $route.current.pathParams.id/*3*/;
			$scope.queryInfo(id);

			//文件缓存读取
			var preUploadList = cache.get('pre_upload_list');
			if(preUploadList){
				$scope.upLoadList = preUploadList;
				cache.put('pre_upload_list',[]);
			}

		});
	}]);

};
