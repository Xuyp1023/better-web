
exports.installController = function(mainApp,common){

	mainApp.controller('account.detailController',['$scope','muiSupport','http','$rootScope','$route','cache',function($scope,muiSupport,http,$rootScope,$route,cache){
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
		$scope.queryInfo = function(){
			return http.post(BTPATH.QUERY_INFO_ACCOUNT,{}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.info = data.data;
					});
				}else{
					mui.alert('未查询到您的账户信息,服务端\n返回信息:'+data.message,'错误信息');
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
			http.post(BTPATH.QUERY_UPLOAD_LIST,{batchNo:$scope.info.batchNo}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.upLoadList = data.data;
					});
				}
			});
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			$scope.queryInfo().success(function(){
				$scope.queryFinanceUploadList();
			});

		});
	}]);

};
