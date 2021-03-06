
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('contract.manger1',['$scope','http','$rootScope','$route','cache','commonService','$location','$filter',function($scope,http,$rootScope,$route,cache,commonService,$location,$filter){
      // 供应商报价列表
      $scope.infoList = [];

      // 初始化查条件对象
      $scope.searchData = {
        agreementType:'2'
      }; 

      $scope.info = {};

       //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };
      

      // 详情页
      $scope.lookDetail = function(data){         
          $scope.openRollModal('look_agree_info_box');
          

      }

       //查询电子合同列表 
      $scope.searchList = function(){
        $scope.listPage.pageNum = 1;
        $scope.queryList(true);    
      };  



      /*查询初始化*/
      $scope.queryList = function(flag){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        // loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_AGREEMENT_QUERYAGREEMENTWITHCORE,$.extend({},$scope.listPage,$scope.searchData))
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
        
     


        commonService.queryBaseInfoList(BTPATH.QUERY_ALLCUST_RELATION,{},$scope,'financeCustList').success(function(){
          // $scope.searchData.custNo = $scope.factorList.length>0?$scope.factorList[0].value:''; 
          commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList').success(function(){

            $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
              $scope.queryList();
          });
          
        });


        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });
      });
    }]);
  };
});

