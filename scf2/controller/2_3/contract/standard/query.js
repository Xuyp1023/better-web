
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contract_2_3.standardQuery',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
			$scope.infoList = [];

      $scope.custList = [];

			$scope.searchData = {
        custNo:'',
        businStatus:'00'
      };

      //选择界面的vo对象
      $scope.selectVo = {};

      //分页数据
  		$scope.listPage = {
  			pageNum: 1,
  			pageSize: 10
  		};

      /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
  			//弹出弹幕加载状态
  			var $mainTable = $('#search_info .main-list');
  			loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
  			http.post(BTPATH.QUERY_TEMPLATE_STANDARD_TYPE_LIST/*2*/,$.extend({},$scope.searchData, $scope.listPage))
  				.success(function(data){
  					//关闭加载状态弹幕
  					loading.removeLoading($mainTable);
  					if(common.isCurrentData(data)){
  						$scope.$apply(function(){
  							$scope.infoList = common.cloneArrayDeep(data.data);/*3*/
                if(flag/*1*/){
                  $scope.listPage = data.page;/*4*/
                }
  						});
  					}
  			});
  		};

      //启用新类型
      $scope.add = function(){
        window.location.href = '#/contract_2_3/standardAdd/' + $scope.searchData.custNo;
      }

			//删除标准合同类型
      $scope.remove = function(target,item) {
        var $target = $(target);

        dialog.confirm('请确认是否移除此标准合同类型?',function(){
          http.post(BTPATH.SAVE_REMOVE_STANDARD_TYPE,{custNo:item.custNo, standardTypeId:item.standardTypeId})
          .success(function(data){
            if(data&&(data.code === 200)){
              tipbar.infoTopTipbar('移除此标准合同类型成功!',{});
              $scope.queryList(true);
            }else{
              tipbar.errorTopTipbar($target,'移除此标准合同类型失败,服务器返回:'+data.message,3000,9992);
            }
          });
        });
      }


			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
          $scope.searchData.custNo = $scope.custList[0] ? $scope.custList[0].value : '';
          $scope.queryList(true);
        });
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

			});
		}]);

	};

});
