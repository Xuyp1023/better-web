
exports.installController = function(mainApp,common){

	mainApp.controller('finance.applyController',['$scope','muiSupport','http','cache','$route','commonService','wx',function($scope,muiSupport,http,cache,$route,commonService,wx){

		_factorPicker = {};
		
		//票据信息
		$scope.info = {};

		//申请对象
		$scope.request = {};

		//申请对象
		$scope.offer = {};

		//询价对象
		$scope.enquiryObject = {};

		//附件列表
		$scope.upLoadList = [];

		$scope.factorList =[];

		//获取到报价详情
		$scope.queryOfferInfo = function(enquiryNo, factorNo){
			return http.post(BTPATH.FIND_OFFER_DETAIL,{enquiryNo:enquiryNo,factorNo:factorNo}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.offer = data.data;
						$scope.info = data.data.enquiry.order;
						$scope.info.loanBalalce = data.data.enquiry.balance;
						$scope.info.ratio = data.data.ratio;
						$scope.info.offerId = data.data.id;

						$scope.request.factorNo = data.data.factorNo;
						$scope.request.balance = data.data.enquiry.balance;
					});
				}else{
					mui.alert('未查询到对应报价信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//获取到票据详情
		$scope.queryBillInfo = function(billId){
			return http.post(BTPATH.QUERY_ONE_BILL,{id:billId}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data;
					});
				}else{
					mui.alert('未查询到对应票据信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//获取到保理公司下拉数据详情
		$scope.queryFactor = function(){
			return http.post().success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.factorList = data.data;
					});
				}else{
					mui.alert('未查询到对应保理公司信息,服务端\n返回信息:'+data.message,'错误信息');
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
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.upLoadList.push(data.data);
						});
						$scope.linkApplyUpload(data.data);
					}
				});
			});
		};

		//申请融资
		$scope.applyFinance = function(){
			$scope.request.orders = $scope.info.id;
			$scope.request.requestFrom = 2;
			$scope.request.coreCustNo = $scope.info.coreCustNo;
			$scope.request.requestType = 2;
			$scope.request.offerId=$scope.offer.id;
			//文件上传，打包文件ID
			$scope.info.fileList = ArrayPlus($scope.upLoadList).extractChildArray('id',true);
			http.post(BTPATH.APPLY_FINANCE,$scope.request).success(function(data){
				if(common.isCurrentResponse(data)){
					mui.alert('申请成功,点击确定返回票据列表','温馨提示',function(){
						window.location.href = '#/bill';
					});
					
				}else{
					mui.alert('申请失败,请联系客服人员,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//change factorNo
		$scope.changeFactorNo = function(){
			if(!$scope.isCanChangeFactor) return;
			_factorPicker.show(function(res){
				$scope.$apply(function(){
					$scope.request.factorNo = res[0].value;
				});
			});
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			var type = $route.current.pathParams.type;
			var param = $route.current.pathParams.id;
			var promise = {};
			//for set if can do changeFactorNo
			$scope.isCanChangeFactor = (type==='offer')?false:true;

			commonService.queryBaseInfoList(BTPATH.CUST_RELATION,{},$scope,'factorList','FactorListDic').success(function(){
				$scope.factorList = BTDict.FactorListDic.toArray('value','text');
				if(type!=='offer'){
					$scope.$apply(function(){
						$scope.request.factorNo = common.filterArrayFirst($scope.factorList);
					});
				}
				_factorPicker = muiSupport.singleSelect($scope.factorList);

				if(type==='offer'){
					//从报价过来的申请
					var paramArr = param.split(',');
					var enquiryNo = paramArr[0];
					var factorNo = paramArr[1];
					promise = $scope.queryOfferInfo(enquiryNo,factorNo);
				}
				else{
					//从票据过来的申请
					promise = $scope.queryBillInfo(param);
				}
			});

			
			
			//文件缓存读取
			var preUploadList = cache.get('pre_upload_list');
			if(preUploadList){
				$scope.upLoadList = preUploadList;
				cache.put('pre_upload_list',[]);
			}
		});
	}]);

}