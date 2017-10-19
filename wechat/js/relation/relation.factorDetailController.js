
exports.installController = function(mainApp,common){

	mainApp.controller('relation.factorDetailController',['$scope','muiSupport','http','$rootScope','cache',function($scope,muiSupport,http,$rootScope,cache){

		//VM绑定区域

		//关联的核心企业
		$scope.info = {
			relateCustname:''
		};

		$scope.recordList=[];

		//重新申请
		$scope.applyAgain = function(){
			cache.put('apply_related_factor',[{
						'value':$scope.info.relateCustno,
						'name':$scope.info.relateCustname
					}]);
			window.location.href = '#/relation/factor/attach';
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//获取详情信息
			$scope.info = cache.get("detail_info");
			$scope.findCustRelateAduitRecord($scope.info.relateCustno);
		});

		//查询审批记录
		$scope.findCustRelateAduitRecord = function(custNo){
			$.post(BTPATH.FIND_CUST_RELATEADUIT_RECORD,{custNo:custNo},function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.recordList = data.data;
					});
				}
			},'json');
		};



	}]);

};

