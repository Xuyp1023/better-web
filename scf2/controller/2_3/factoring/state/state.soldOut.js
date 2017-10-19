
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('state.soldOut',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */
			$scope.statusList = BTDict.AgreementStandardStatus.toArray('value','name');
      $scope.infoList = [];
      $scope.info = {};
      $scope.assetDictList = [];
      $scope.productRelation={};
			$scope.searchData = {
				GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
				LTEregDate:new Date().format('YYYY-MM-DD'),
				custNo:'',
        productCode:''
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

      $scope.detailInfoBox=function(data){
        $scope.info= $.extend(data,{object:'factoring'});
        commonService.queryBaseInfoList(BTPATH.FIND_ASSETDICT_BYPRODUCT,{productCode:data.productCode},$scope,'assetDictList');
        $scope.queryCoreList(true); 
        $scope.openRollModal('detail_box');
      } 

      //进入下架界面
      $scope.detailsoldOut=function(data){
        $scope.info= $.extend(data,{object:'factoring'});   
        commonService.queryBaseInfoList(BTPATH.FIND_ASSETDICT_BYPRODUCT,{productCode:data.productCode},$scope,'assetDictList');
        $scope.queryCoreList(true);
        $scope.openRollModal('soldDetail');
      }

      /*  查询关联的核心企业  */
      $scope.queryCoreList = function(flag){
        $scope.coreListPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_CORE_BYPRODUCT/*2*/,$.extend({},$scope.coreListPage,{productCode:$scope.info.productCode}))
          .success(function(data){
            //关闭加载状态弹幕
              $scope.$apply(function(){
                $scope.coreList = common.cloneArrayDeep(data.data);/*3*/
                if(flag){
                  $scope.coreListPage = data.page;
                }
              });
        });
      };   

      //下架按钮的处理
      $scope.soldOut=function(target){
        var publishInfo = {
          "id":$scope.info.id,
          "businStatus":2
        };

        http.post(BTPATH.SAVE_MODIFY_PRODUCT_CONFIG, publishInfo)
           .success(function(data){
            if(data&&(data.code === 200)){              
              tipbar.infoTopTipbar('下架产品成功!',{});
              $scope.queryList(true);
              $scope.closeRollModal('soldDetail');
            }else{
              tipbar.errorTopTipbar($target,'下架产品失败,服务器返回:'+data.message,3000,9992);
            }
           });
      }   

       //查询产品列表 
      $scope.searchList = function(){
        $scope.listPage.pageNum = 1;
        $scope.queryList(true);
     };     
      /*  业务处理绑定区域  */
      $scope.queryList = function(flag){
        //只查询上架状态的产品
        $scope.searchData.businStatus = '1';

  			//弹出弹幕加载状态
  			var $mainTable = $('#search_info .main-list');
  			loading.addLoading($mainTable,common.getRootPath());
  			$scope.listPage.flag = flag? 1 : 2;/*1*/
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

			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
          $scope.searchData.factorNo = $scope.custList.length>0?$scope.custList[0].value:'';
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
