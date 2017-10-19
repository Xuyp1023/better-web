
exports.installController = function(mainApp,common){

	mainApp.controller('finance.detailController',['$scope','muiSupport','http','$rootScope','$route','cache',function($scope,muiSupport,http,$rootScope,$route,cache){
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
		$scope.uploadList = [];
		

		/*获取数据区域*/
		//获取单个融资详情
		$scope.queryInfo = function(type,id){
			var path = '',
				param = {};

			if(type === 'bill'){
				path = BTPATH.QUERY_ONE_FINANCE_BYBILLID;
				param = {
					billId:id
				};
			}else{
				path = BTPATH.QUERY_ONE_FINANCE_BYNO;
				param = {
					requestNo:id
				};
			}


			return http.post(path,param).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data;
					});
				}else{
					mui.alert('未查询到对应融资信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//预览图片
		$scope.preImg = function(item){
			cache.put('pre_upload_list',$.extend({},$scope.upLoadList));
			window.location.href = '#/preImg/'+item.id+',0';
		};

		//获取融资附件列表
		$scope.queryFinanceUploadList = function(){
			http.post(BTPATH.QUERY_UPLOAD_LIST,{batchNo:$scope.info.request.batchNo}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.upLoadList = data.data;
					});
				} 
			});
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			var id = $route.current.pathParams.id;
			var	type = $route.current.pathParams.type;
			$scope.queryInfo(type,id).success(function(){
				$scope.queryFinanceUploadList();
			});

		});
	}]);

};