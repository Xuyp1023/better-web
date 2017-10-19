
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contract_2_3.standardAdd',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */
      $scope.infoList = [];

      $scope.typeList = [];

      $scope.contractList = [];

      $scope.searchData = {
        custNo:null,
			  typeId:null
		};

      //分页数据
  		$scope.listPage = {
  			pageNum: 1,
  			pageSize: 10,
  			pages: 1,
  			total: 1
  		};

  		/*  业务处理绑定区域  */
      $scope.queryList = function(){
  			//弹出弹幕加载状态
  			var $mainTable = $('#search_info .main-list');
  			loading.addLoading($mainTable,common.getRootPath());
  			http.post(BTPATH.QUERY_TEMPLATE_UNUSED_STANDARD_TYPE_LIST/*2*/,$.extend({},$scope.searchData))
  				.success(function(data){
  					//关闭加载状态弹幕
  					loading.removeLoading($mainTable);
  					if(common.isCurrentData(data)){
  						$scope.$apply(function(){
  							$scope.infoList = common.cloneArrayDeep(data.data);/*3*/
  						});
  					}
  			});
  		};

      /*  业务处理绑定区域  */

      //选择按钮，全选和去除全选
      $scope.toggleCheckbox = function(flag){
				switch (flag){
					case 0:
						angular.forEach($scope.infoList,function(row){
							row.isSelected = $scope.tmpCheckbox;
						});
						break;
					case 1:
						var tmpFlag = true;
						angular.forEach($scope.infoList,function(row){
							tmpFlag = row.isSelected && tmpFlag;
						});
						$scope.tmpCheckbox = tmpFlag;
						break;
				}
      };

			//登记
			$scope.addInfo = function(target){
				var $target = $(target);

				var addIds = [];
				angular.forEach($scope.infoList,function(row){
					if(row.isSelected){
						addIds.push(row.id);
					}
				});

                if (addIds.length <= 0) {
                    tipbar.errorTopTipbar($target,'请选择需要启用的标准合同！',3000,9992);
                    return;
                }

				http.post(BTPATH.SAVE_ENABLE_STANDARD_TYPE,$.extend({},$scope.searchData,{"standardTypeIds": addIds.join(",")})).success(function(data){
					if(data&&(data.code === 200)){
						tipbar.infoTopTipbar('登记标准合同成功!',{});
						$scope.$apply(function(){
							$location.path("/contract_2_3/standardQuery");
						});
						// window.location.href = '#/standardContract/list';
					}else{
						tipbar.errorTopTipbar($target,'登记标准合同失败,服务器返回:'+data.message,3000,9992);
					}
				});
			};

			$scope.goBack = function(){
				$location.path("/contract_2_3/standardQuery");
			};



			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){

            $scope.searchData.custNo=$route.current.pathParams.custNo;
            commonService.queryBaseInfoList(BTPATH.FIND_ENABLE_AGREEMENTTYPE,{},$scope,'contractList').success(function(){
      	    $scope.queryList();
    				});
          
				  });
				/*公共绑定*/
				common.resizeIframeListener();
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();
				});

		}]);

	};

});
