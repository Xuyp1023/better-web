
exports.installController = function(mainApp,common){

	mainApp.controller('account.factorController',['$scope','muiSupport','http','$rootScope','cache','wx',function($scope,muiSupport,http,$rootScope,cache,wx){
		/*私有属性区域*/

		//保理公司列表
		$scope.factorList = [];

		$scope.custInfo = {};
		//新选中的保理公司
		$scope.addFactorArr = [];
		//阅读并同意
		$scope.readAndAgree = true;


		/*获取数据区域*/

		//获取到保理公司下拉数据详情
/*		$scope.queryFactor = function(){
			return http.post(BTPATH.CUST_RELATION).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.factorList = data.data;
					});
				}else{
					mui.alert('未查询到对应保理公司信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};*/

		//获取到开户的保理机构
		$scope.queryFactorOpened = function(){
			$scope.factorList = BTDict.ScfFactorGroup.toArray('value','name');
		  	http.post(BTPATH.QUERY_OPENED_FACTOR,{custNo:$scope.custInfo.custNo})
		    .success(function(data){
		      //关闭加载状态弹幕
		      if(common.isCurrentData(data)){
		        $scope.$apply(function(){
		        	$scope.factorList = ArrayPlus($scope.factorList).setKeyArrayObj("businStatus",0);// 0|未开通
		        	var  tempList = $scope.factorList;
		        	for(var i=0 ; i<data.data.length ;i++ ){
		        		var temp = data.data[i];
		        		tempList = ArrayPlus(tempList).setKeyArrayObj("businStatus",temp.businStatus,'value',temp.relateCustno+'');
		        		tempList = ArrayPlus(tempList).setKeyArrayObj("isChecked",true,'value',temp.relateCustno+'');
		        	}
		        	$scope.factorList = tempList;
		        });
		      }   
		  });
		};

		$scope.queryCustInfo = function(){
			return http.post(BTPATH.QUERY_CUST_INFO).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.custInfo = data.data;
					});
				}else{
					mui.alert('未查询到公司信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};


		//融资开户
		$scope.openAccount = function(){

			if(!$scope.readAndAgree){
				mui.alert('网上交易协议未同意！','温馨提示');
				return false;
			}
			var factorList = $scope.addFactorArr.join(",");
			if(!factorList || factorList.length==0){
				mui.alert('请选择保理公司！','温馨提示');
				return false;
			}
			http.post(BTPATH.SAVE_FACTOR_RELATION,{custNo:$scope.custInfo.custNo,factorList:factorList}).success(function(data){
				if(common.isCurrentResponse(data)){
					window.location.href = '#/home';
					mui.alert('保理业务已受理,请等待审核!','温馨提示');
				}else{
					mui.alert('申请失败,请联系客服人员,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};


		//切换选择
		$scope.toggleCheckItem = function(item){
			// 0|未开通  4|被驳回
			if(item.businStatus==0 || item.businStatus==4){
				item.isChecked = !item.isChecked;
				if(item.isChecked){
					$scope.addFactorArr.push(item.value);
				}else{
					$scope.addFactorArr = ArrayPlus($scope.addFactorArr).remove(item.value);
				}
			}
		};


		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			$scope.readAndAgree =true;
			$scope.factorList = [];
			//创建单项选择
			// _coreCustPicker = muiSupport.singleSelect(_coreCustList);
			/*var preUploadList = cache.get('pre_upload_list');
			var preInfo = cache.get('account_info');
			if((!!preUploadList)&&(!!preInfo)){
				$scope.upLoadList = preUploadList;
				$scope.info = preInfo;
				cache.put('pre_upload_list',[]);
				cache.put('account_info',{});
			}*/
			$scope.queryCustInfo().success(function(){
				$scope.queryFactorOpened();
			});
		});
	}]);

};