
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('fac.custInfoController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){
			/*VM绑定区域*/
			$scope.searchData = {
				relateType: "0,2,3"
			};

			//分页数据
			$scope.listPage = {
				pageNum: 1,
				pageSize: 10,
				pages: 1,
				total: 1
			};

			$scope.relateTypeList = BTDict.CustWhitelistType.toArray('value','name');
			$scope.statusTypeList = BTDict.CustWhitelistStatus.toArray('value','name');

			//查询
			$scope.queryList = function(flag) {
				$scope.listPage.flag = flag? 1 : 2;
				return http.post(BTPATH.QUERY_CUSTINFO_FACTOR,$.extend({},$scope.listPage,$scope.searchData))
					.success(function(data){
						if(data&&(data.code === 200)){
							$scope.$apply(function(){
								$scope.infoList = data.data;
								if(flag){
								  $scope.listPage = data.page;
								}
							});
						} else {
							// tipbar.errorTopTipbar($target,'状态查询失败,服务器返回:'+data.message,3000,6662);
							tipbar.infoTopTipbar('状态查询失败，服务端返回信息:'+data.message,{
							    msg_box_cls : 'alert alert-warning alert-block',
							    during:2000
							});
						}
				});
			};

			//回收
			$scope.recovery = function(item){

				http.post(BTPATH.QUERY_CUSTINFO_FACTOR,$.extend({}))
				.success(function(data){
					if(data&&(data.code === 200)){
						$scope.queryList(true);
						tipbar.pop('success','系统提示','回收成功');
					} else {
						// tipbar.errorTopTipbar($target,'状态查询失败,服务器返回:'+data.message,3000,6662);
						tipbar.pop('error','系统提示','回收失败');
					}
			});
			}

			//打开详情
			$scope.openInfo = function(item){
				$scope.info = item;
				// 客户信息查询（平台） -》查看开通保理业务详情
				cache.put("factor_detail_orgin",'facCustInfo');
				window.location.href = window.BTServerPath + '/scf2/home.html#/customerRelation/qiefactorDetail/'+item.custNo;
			};

			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				$scope.queryList(true).success(function(){
					common.resizeIframeListener();
				});
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});
		}]);

	};

});