/*
	@herb
	开户认证资料
*/

exports.installController = function(mainApp,common){

	mainApp.controller('open.showController',['$scope','muiSupport','http','$rootScope','$route','cache',function($scope,muiSupport,http,$rootScope,$route,cache){
		/*私有属性区域*/
		_statusPicker = {};	
		
		/*VM绑定区域*/
		$scope.upLoadList = {};
		$scope.info = {};

		//预览图片
		$scope.preImg = function(item){
			cache.put('account_info',$scope.info);
			// cache.put('file_list',$scope.fileList);
			window.location.href = '#/preImg/'+item.id+',1';
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			var preInfo = cache.get('account_info');
			//替换信息暂存
			if(!!preInfo){
				$scope.info = preInfo;
				cache.put('account_info',{});
			}
			http.post(BTPATH.QUERY_UPLOAD_LIST,{batchNo:preInfo.batchNo}).success(function(data){
				if(common.isCurrentData(data)){
					var upLoadList = BTDict.CustOpenAccountFile.toArray('fileInfoType','name');
					upLoadList = ArrayPlus(upLoadList).extendObjectArray(data.data,'fileInfoType');
			 		$scope.$apply(function(){
			 			$scope.upLoadList = ArrayPlus(upLoadList).changeObjectArray2Object('fileInfoType');
			 		});
				}
		 	});

			

		});
	}]);

};