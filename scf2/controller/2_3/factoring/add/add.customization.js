
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('add.customization',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */			
      $scope.infoList = [];
      $scope.custList = [];
      $scope.info = {};
      $scope.allAssetDictList = [];
      $scope.coreList=[];
      $scope.assetDictList=[];
      $scope.searchData = {
				GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
				LTEregDate:new Date().format('YYYY-MM-DD'),				
				productCode:'',
        factorNo:''
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
      
      // $scope.step=$scope.step||1;
      $scope.statusNum={
        status:1
      };    

       //查询产品列表 
      $scope.searchList = function(){
        $scope.listPage.pageNum = 1;
        $scope.queryList(true);
     };

       //删除发货单
      $scope.delInfo = function(target,data){
        // data.businStatus = '-1';
        dialog.confirm('是否确认删除该保理产品,该操作无法恢复!',function(){
          var $target = $(target);
          http.post(BTPATH.DEL_PRODUCT_CONFIG,{'id':data.id})
             .success(function(data){
              if(data&&(data.code === 200)){
                $scope.queryList(true);
                tipbar.infoTopTipbar('删除产品成功!',{});
              }else{
                tipbar.errorTopTipbar($target,'删除发货单失败,服务器返回:'+data.message,3000,9992);
              }
             });
        });
      };

      // 查看保理产品详情
      $scope.detailInfoBox=function(data){
         $scope.info= $.extend(data,{object:'factoring'});
             commonService.queryBaseInfoList(BTPATH.FIND_ASSETDICT_BYPRODUCT,{productCode:data.productCode},$scope,'assetDictList');
             $scope.queryCoreList(true,data);
        $scope.openRollModal('detail_box');
      } 

      /*  业务处理绑定区域  */
      $scope.queryList = function(flag){
  			//弹出弹幕加载状态
  			var $mainTable = $('#search_info .main-list');
  			loading.addLoading($mainTable,common.getRootPath());
  			$scope.listPage.flag = flag? 1 : 2;/*1*/
        $scope.searchData.businStatus='0,3'
  			http.post(BTPATH.QUERY_PRODUCT_CONFIG/*2*/,$.extend({},$scope.listPage,$scope.searchData))
  				.success(function(data){
  					//关闭加载状态弹幕
  					loading.removeLoading($mainTable);
  					if(common.isCurrentData(data)){
  						$scope.$apply(function(){
  							$scope.infoList = common.cloneArrayDeep(data.data);/*3*/
  							if(flag){
  								$scope.listPage = data.page;
  							}
  						});
  					}
  			});
  		};

       /*  业务处理绑定区域  */
      $scope.queryCoreList = function(flag,data){
        $scope.coreListPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_CORE_BYPRODUCT/*2*/,$.extend({},$scope.coreListPage,{productCode:data.productCode}))
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


    //打开产品录入
    $scope.addInfoBox = function(){      
      // $scope.openRollModal('add_box');
      $location.path('/factoring/add.basicInfoAll');       
      common.resizeIframeListener();     
    }; 
    //产品编辑
    $scope.editInfoBox= function(data){
      $scope.info=data;
      // 基本信息
      cache.put("info1",$scope.info);
       //清单列表的查询和缓存 
      http.post(BTPATH.FIND_ALL_ASSETDICT,{}).success(function(data1){
         $scope.$apply(function(){
                $scope.assetDictList = common.cloneArrayDeep(data1.data);                
                cache.put("assetDictList",$scope.assetDictList);
                $scope.statusNum.status++;  
                stateGo();              
              });
      });
      //已选中清单列表查询和缓存 
      http.post(BTPATH.FIND_ASSETDICT_BYPRODUCT,{'productCode':data.productCode}).success(function(data2){
         $scope.$apply(function(){
                $scope.checkedAssetDictList = common.cloneArrayDeep(data2.data);                
                cache.put("checkedAssetDictList",$scope.checkedAssetDictList);
                $scope.statusNum.status++;
                stateGo();                 
              });
      });
      //所有核心企业列表的查询和缓存  
      http.post(BTPATH.QUERY_FACTOR_CORELIST,{'factorNo':data.factorNo}).success(function(data3){
         $scope.$apply(function(){
                $scope.coreList = common.cloneArrayDeep(data3.data);                
                cache.put("coreList",$scope.coreList);
                $scope.statusNum.status++;
                stateGo();                 
              });
      });
      //已选中核心企业列表的查询和缓存 
      http.post(BTPATH.FIND_CORE_BYPRODUCT,{'productCode':data.productCode}).success(function(data4){
         $scope.$apply(function(){
                $scope.checkedCoreList = common.cloneArrayDeep(data4.data);                
                cache.put("checkedCoreList",$scope.checkedCoreList);
                $scope.statusNum.status++;
                stateGo();                 
              });
      });

      function stateGo(){
        if($scope.statusNum.status==5){
          window.location.href='?rn'+new Date().getTime()+'../scf2/home.html#/factoring/add.editInfoAll';
          common.resizeIframeListener(); 
        }  
      }
    };   

			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
          $scope.searchData.factorNo = $scope.custList.length>0?$scope.custList[0].value:'';
          $scope.queryList(true);
          console.log(window.parent.$$$ajaxTokenMap);
        });				
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();
				});
			});
		}]);
	};
});
