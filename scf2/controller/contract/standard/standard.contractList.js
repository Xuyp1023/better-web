
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('standard.contractList',['$scope','http','$rootScope','$route','cache','$location',function($scope,http,$rootScope,$route,cache,$location){
      /*  VM绑定区域  */
      $scope.infoList = [];
      $scope.info = {};
      //分页数据
  		$scope.listPage = {
  			pageNum: 1,
  			pageSize: 10,
  			pages: 1,
  			total: 1
  		};

      /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
  			//弹出弹幕加载状态
  			var $mainTable = $('#search_info .main-list');
  			loading.addLoading($mainTable,common.getRootPath());
  			$scope.listPage.flag = flag? 1 : 2;
  			//return http.post(BTPATH.QUERY_REGISTERED_AGREEMENT_STANDARD,$.extend({},$scope.listPage,{}))
  			http.post(BTPATH.QUERY_REGISTERED_CONTRANCT_STANDARD,$.extend({},$scope.listPage))
  				.success(function(data){
  					//关闭加载状态弹幕
  					loading.removeLoading($mainTable);
  					if(common.isCurrentData(data)){
  						$scope.$apply(function(){
  							$scope.infoList = data.data;
  							if(flag){
  								$scope.listPage = data.page;
  							}
  						});
  					}
  			});
  		};

			//标准合同登记
			$scope.addInfo = function(){
				$location.path("/standardContract/add");
				// window.location.href = '#/standardContract/add';
			};

			//删除标准合同
			$scope.deleteInfo = function(target,item) {
				var $target = $(target);

				dialog.confirm('请确认是否删除此项标准合同?',function(){
					http.post(BTPATH.DELETE_CONTRANCT_STANDARD,{id:item.id})
					.success(function(data){
						if(data&&(data.code === 200)){
							tipbar.infoTopTipbar('删除标准合同成功!',{});
							$scope.queryList(true);
						}else{
							tipbar.errorTopTipbar($target,'删除标准合同失败,服务器返回:'+data.message,3000,9992);
						}
					});
				});
			};

			//编辑标准合同
			$scope.editInfo = function(data) {
				cache.put("info", data);
				$location.path("/standardContract/edit");
				// window.location.href = '#/standardContract/edit';
			};



			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				

				$scope.queryList(true);
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();
				});

			});
		}]);

	};

});
