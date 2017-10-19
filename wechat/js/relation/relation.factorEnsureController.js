
exports.installController = function(mainApp,common){

	mainApp.controller('relation.factorEnsureController',['$scope','muiSupport','http','$rootScope','cache',function($scope,muiSupport,http,$rootScope,cache){

		//VM绑定区域

		//选择保理公司列表
		$scope.factorList = [];
		//选择的电子合同服务公司
		$scope.addCustData={
			factorCustType:"FACTOR_USER",
			wosCustType:"WOS",
			wosCustNoList:'',
			factorCustNoList:''
		};



		//确认开通
		$scope.applyAction = function(){
			if($scope.factorList.length<=0){
				mui.alert('请选择保理公司');
				return;
			};
			$.post(BTPATH.ADD_FACTORCUST_RELATION,$scope.addCustData,function(data){
					if((data && data.code === 200)){
						//跳转到附件上传列表
						location.href = '#/relation/factor/show';
					}else{
						mui.alert('申请失败:'+data.message,'错误信息');
						location.href = '#/relation/factor/attach';
					}
			},'json');	
		};

		/*获取数据区域*/

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//获取申请列表
			$scope.factorList = cache.get("apply_related_factor");
			$scope.addCustData.factorCustNoList= cache.get("apply_related_factor")[0].value;
			$scope.addCustData.wosCustNoList= cache.get("apply_related_wos")[0].value;
		});
	}]);

};