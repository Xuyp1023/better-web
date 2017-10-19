
exports.installController = function(mainApp,common){

	mainApp.controller('productController',['$scope','muiSupport','http','$rootScope','commonService',function($scope,muiSupport,http,$rootScope,commonService){
		/*私有属性区域*/
		_productPicker = {};
		$scope.productSelect = [];
		/*VM绑定区域*/
		$scope.searchData = {
			productId:''
		};

		$scope.info = {};
		

		/*获取数据区域*/
		//切换查询条件
		$scope.changeProduct = function(){
			_productPicker.show(function(items){
				$scope.$apply(function(){
					$scope.searchData.productId = items[0].value;
				});
				$scope.queryInfo();
			});
		};

		//查询融资列表
		$scope.queryInfo = function(){
			muiSupport.showBar();
			http.post(BTPATH.QUERY_INFO_PRODUCT,{
				productId: $scope.searchData.productId
			}).success(function(data){
				muiSupport.hideBar();
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.info = data.data;
					});
				}
			});
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//创建单项选择
			commonService.queryBaseInfoList(BTPATH.QUERY_PRODUCT_SELECT_LIST,{},$scope,'productSelect','ProductSelectDic').success(function(){
				$scope.productSelect = BTDict.ProductSelectDic.toArray('value','text');
				_productPicker = muiSupport.singleSelect($scope.productSelect);
				$scope.$apply(function(){
					$scope.searchData.productId = $scope.productSelect.length>0?$scope.productSelect[0].value:'';
				});
				$scope.queryInfo();
			});
			
			// $scope.queryList();
		});
	}]);

}