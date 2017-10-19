
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('detail.core',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */
			$scope.statusList = BTDict.AgreementStandardStatus.toArray('value','name');
      $scope.infoList = [];
      $scope.info = {};
			$scope.searchData = {				
				agreementTypeId:'',
				businStatus:''
			};
      $scope.coreList=[];
      //分页数据
  		$scope.listPage = {
  			pageNum: 1,
  			pageSize: 10,
  			pages: 1,
  			total: 1
  		};
       //分页数据
      $scope.coreListPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };
      // $scope.step=$scope.step||1;
       //保理产品详情(保理机构) 
      $scope.detailCoreBox=function(data){
          $scope.info= $.extend(data,{object:'core'});
          commonService.queryBaseInfoList(BTPATH.FIND_ASSETDICT_BYPRODUCT,{productCode:data.productCode},$scope,'assetDictList');
          $scope.queryCoreList(true);          
          $scope.openRollModal('checkCore');
      }  
       //查询产品列表 
      $scope.searchList = function(){
        $scope.listPage.pageNum = 1;
        $scope.queryList(true);
     };
     
      /*查询产品列表*/
      $scope.queryList = function(flag){
  			//弹出弹幕加载状态
  			var $mainTable = $('#search_info .main-list');
  			loading.addLoading($mainTable,common.getRootPath());
  			$scope.listPage.flag = flag? 1 : 2;/*1*/
        $scope.searchData.businStatus="1";
  			http.post(BTPATH.QUERY_PRODUCT_CONFIG/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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

       /*  查询关联的核心企业  */
      $scope.queryCoreList = function(flag){
        $scope.coreListPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_CORE_BYPRODUCT,$.extend({},$scope.coreListPage,{'productCode':$scope.info.productCode}))
          .success(function(data){
            //关闭加载状态弹幕
              $scope.$apply(function(){
                var coreList = common.cloneArrayDeep(data.data);/*3*/
                 angular.forEach(coreList,function(row){          
                    if($scope.searchData.coreCustNo==row.coreCustNo){
                      $scope.coreList.push(row);
                    }
                  });

                if(flag){
                  $scope.coreListPage = data.page;
                }
              });
        });
      };   
    

			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				//查询操作机构
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList').success(function(){
           $scope.searchData.coreCustNo = $scope.coreCustList.length>0?$scope.coreCustList[0].value:'';
           //查询保理机构
            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{'custNo':$scope.searchData.coreCustNo},$scope,'factorList');

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
