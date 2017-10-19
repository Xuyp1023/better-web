
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('pay.account',['$scope','http','$rootScope','$route','cache','commonService','$location','$filter',function($scope,http,$rootScope,$route,cache,commonService,$location,$filter){
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
          window.location.href='../byte/home1.html#/scf/prepay/apply?id='+data.requestNo+'&src=3.html';
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
        http.post(BTPATH.QUERY_CONTINUE_APPLY,$.extend({},$scope.listPage,$scope.searchData))
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
        // 查询核心企业下的供应商
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList','CoreCustListDic').success(function(){
          //$scope.searchData.custNo = $scope.custList.length>0?$scope.custList[0].value:'';
            $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.searchData.coreCustNo},$scope,'financeCustList').success(function(){              
              $scope.queryList(true);
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

