
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contract_2_3.relationQuery',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
			$scope.statusList = BTDict.AgreementStandardStatus.toArray('value','name');
      $scope.infoList = [];
      $scope.info = {};
			$scope.searchData = {
				GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
				LTEregDate:new Date().format('YYYY-MM-DD'),
				agreementTypeId:'',
				businStatus:''
			};
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
  			$scope.listPage.flag = flag? 1 : 2;/*1*/
  			http.post(BTPATH.QUERY_AGREEMENT_STANDARD/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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
        window.location.href = '#/contract_2_3/standardAdd';
      }

			//删除标准合同类型
      $scope.remove = function(target,item) {
        var $target = $(target);

        dialog.confirm('请确认是否删除此项合同类型?',function(){
          http.post(BTPATH.DELETE_AGREEMENTTYPE,{id:item.id})
          .success(function(data){
            if(data&&(data.code === 200)){
              tipbar.infoTopTipbar('删除合同类型成功!',{});
              $scope.queryList(true);
            }else{
              tipbar.errorTopTipbar($target,'删除合同类型失败,服务器返回:'+data.message,3000,9992);
            }
          });
        });
      }


			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				commonService.queryBaseInfoList(BTPATH.FIND_ENABLE_AGREEMENTTYPE,{},$scope,'typeList').success(function(){
					$scope.info.agreementTypeId = common.filterArrayFirst($scope.typeList);
				});
				$scope.queryList(true);
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

			});
		}]);

	};

});
