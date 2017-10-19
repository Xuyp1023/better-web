
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('approve.node',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */
      $scope.periodUnits = BTDict.PeriodUnit.toArray('value','name');   //期限单位       
      $scope.info = {};

      // 应收账款列表
      $scope.accountList=[];
      // 贸易合同列表
      $scope.contractList=[];
      //发票清单 
      $scope.billList=[];
      //采购订单
      $scope.orderList=[];
      // 对账单列表
      $scope.recheckList=[];
      // 商品出库单列表
      $scope.outboundList=[];
      // 其他附件列表
      $scope.otherList=[];

      $scope.temp={};

      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      }; 

      $scope.temp={};

      $scope.queryAllList=function(){
          // 根据基本信息里的保理产品编号查询资产清单
           commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'accountList');
           commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'contractList');
           commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'billList');
           commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'orderList');
           commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'recheckList');
           commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'outboundList');
           commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'otherList');  
      }

      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
         $scope.temp.bSelect=true; 
          // 查询资产列表
         $scope.queryAllList();       

        setTimeout(function(){
          common.resizeIframeListener();
        },100)
        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });
      });
    }]);
  };
});
