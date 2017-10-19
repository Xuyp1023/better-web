
exports.installController = function(mainApp,common){

	mainApp.controller('signController',['$scope','muiSupport','http','$rootScope','$route','cache',function($scope,muiSupport,http,$rootScope,$route,cache){
		/*VM绑定区域*/
		$scope.searchData = {
			businStatus:''
		};

		$scope.infoList = [];

		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10
		};
		

		/*获取数据区域*/
		//切换查询条件
		$scope.changeStatus = function(){
			_statusPicker.show(function(items){
				$scope.$apply(function(){
					$scope.searchData.businStatus = items[0].value;
				});
				$scope.infoList = [];
				$scope.listPage.pageNum = 1;
				$scope.queryList();
			});
		};

		//查询融资列表
		$scope.queryList = function(){
			muiSupport.showBar();
			return http.post(BTPATH.QUERY_LIST_ELECAGREEMENT,$.extend({},$scope.listPage,{
				flag:1
			})).success(function(data){
				muiSupport.hideBar();
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.infoList = $scope.infoList.concat(data.data);
						$scope.listPage = data.page;
					});
				}
			});
		};

		$scope.agreementSubList = [];
		//打开详情
		$scope.showDetail = function(item){
			console.log(item);
			if(item.signStatus==='0'){
				window.location.href="#/sign/do/"+item.appNo;
			}else if(item.signStatus==='2'){
				//FIND_ELECAGREEMENTINFO

				http.post(BTPATH.FIND_ELECAGREEMENTINFO,{appNo:item.appNo}).success(function(data){
						
						if(common.isCurrentData(data)){
							$scope.$apply(function(){
								$scope.agreementSubList = data.data.stubInfos;
								for (var i = $scope.agreementSubList.length - 1; i >= 0; i--) {
									if(item.supplierNo==$scope.agreementSubList[i].custNo && $scope.agreementSubList[i].operStatus=='0'){
										window.location.href="#/sign/do/"+item.appNo;
										return ;
									}
								}
							});
						}else{
							window.location.href="#/sign/detail/"+item.appNo;
						}
					});

				window.location.href="#/sign/detail/"+item.appNo;

			}
			else{
				window.location.href="#/sign/detail/"+item.appNo;
			}
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			$scope.queryList();
		});
	}]);

};