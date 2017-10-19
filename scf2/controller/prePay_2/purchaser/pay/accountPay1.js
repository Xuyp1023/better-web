
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('pay.account1',['$scope','http','$rootScope','$route','cache','commonService','$location','$filter',function($scope,http,$rootScope,$route,cache,commonService,$location,$filter){
      // 供应商报价列表
      $scope.infoList = [];

      // 初始化查条件对象
      $scope.searchData = {
          GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
          LTEregDate:new Date().format('YYYY-MM-DD')
      }; 

      $scope.info = {};

       //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      }; 

      $scope.lookDetail = function(data) {
          window.location.href='../byte/home1.html#/scf/prepay/apply2?id='+data.requestNo+'&src=4.html';
      }

      //查询产品列表 
      $scope.searchList = function () {
        $scope.listPage.pageNum = 1;
        $scope.queryList(true);
      };     


      /*查询初始化*/
      $scope.queryList = function(flag){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        // loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_RECEIVABLE_REQUEST_queryTwoReceivableRequestWithFactory,$.extend({},$scope.listPage,$scope.searchData))
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
        
        
      commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList','factorListDic').success(function(){
        $scope.searchData.factoryNo =  common.filterArrayFirst($scope.factorList);
          //根据保理公司查询核心企业列表
          commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACOTRCORERELATION,{factorNo:$scope.searchData.factoryNo},$scope,'coreCustList').success(function(){
            $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
          //根据核心企业查询融资企业列表
          commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.searchData.coreCustNo},$scope,'custList').success(function(){
            // $scope.searchData.custNo = $scope.custList[0] ? $scope.custList[0].value : '' ;
            //获取融资状态
            /*commonService.queryBaseInfoList(BTPATH.QUERY_TRADESTATUS,'',$scope,'','FlowTypeDic',{
              name:'nodeCustomName',
              value:'sysNodeId'
            }).success(function(){*/
            $scope.queryList(true);
            // });
          });
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

