
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('datail.supply',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */
			$scope.statusList = BTDict.AgreementStandardStatus.toArray('value','name');
      $scope.infoList = [];
      $scope.info = {};
      $scope.coreList=[];
      $scope.factorList=[]; 
      $scope.coreCustList=[];     
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

        //分页数据
      $scope.coreListPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };

      //保理产品详情(保理机构) 
      $scope.detailFacBox=function(data){
        $scope.info= $.extend(data,{object:'supply'});
        commonService.queryBaseInfoList(BTPATH.FIND_ASSETDICT_BYPRODUCT,{productCode:data.productCode},$scope,'assetDictList');
        $scope.queryCoreList(true);        
        $scope.openRollModal('checkSupply');
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
  			$scope.listPage.flag = flag? 1 : 2;
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
        $scope.coreListPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_CORE_BYPRODUCT/*2*/,$.extend({},$scope.coreListPage,{productCode:$scope.info.productCode}))
          .success(function(data){
            //关闭加载状态弹幕
              $scope.$apply(function(){
                $scope.coreList=[];
                var coreList = common.cloneArrayDeep(data.data);/*3*/
                for(var i=0;i<coreList.length;i++){
                  for(var j=0;j<$scope.coreCustList.length;j++){
                      if(coreList[i].coreCustNo==$scope.coreCustList[j].value){
                        $scope.coreList.push(coreList[i]);
                      }
                  }
                }
                /*angular.forEach(coreList,function(row){
                  angular.forEach($scope.coreCustList,function(row1){
                    if(row1.value==row.coreCustNo){
                        $scope.coreList.push(row);
                    }
                  })
                })*/
                if(flag){
                  $scope.coreListPage = data.page;
                }
              });
        });
      };

			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){

        //查询操作机构
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
           $scope.searchData.custNo = $scope.custList.length>0?$scope.custList[0].value:''; 
           //查询保理机构
           commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{'custNo':$scope.searchData.custNo},$scope,'factorList');
            //查询保核心企业
           commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{'custNo':$scope.searchData.custNo},$scope,'coreCustList');
          
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
