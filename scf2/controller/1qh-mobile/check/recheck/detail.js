
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.recheckDetail',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
      $scope.infoList = [];

      $scope.coreCustList = [];

      $scope.searchData = {
         payDate:new Date().format('YYYY-MM-DD'),
         custNo:""
      };

      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10
      };

      $scope.info = {

      };

      $scope.currentItem = {

      };

      $scope.searchType = 1;

      $scope.commissionRecord = {
        record:{},
        payResultRecord:{}
      };
      
      // 查看佣金
      $scope.lookCommissionDetail = function(item){
        http.post(BTPATH.FIND_CPS_COMMISSION_RECORD/*2*/, {refNo: item.refNo})
          .success(function(data){
            //关闭加载状态弹幕
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.commissionRecord = data.data;
                $scope.openRollModal('commissionDetail_box');
              });
            }
        });
      };

      /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_CPS_CONFIRM_PAY_RESULT_LIST/*2*/,$.extend({},$scope.searchData, $scope.listPage))
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

      $scope.detailListPage = {
        pageNum: 1,
        pageSize: 10
      };

      $scope.searchCheck = function(type){
        var lastType = $scope.searchType;
        $scope.searchType = type;
  
        $scope.queryDetailList(true);
      };

      /*  业务处理绑定区域  */
      $scope.queryDetailList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.detailListPage.flag = flag? 1 : 2;/*1*/

        var path = BTPATH.QUERY_CPS_ALL_PAY_RESULT_RECORDS;

        switch ($scope.searchType){
          case 1:
            path = BTPATH.QUERY_CPS_ALL_PAY_RESULT_RECORDS;
            break;
          case 2:
            path = BTPATH.QUERY_CPS_SUCCESS_PAY_RESULT_RECORDS;
            break;
          case 3:
            path = BTPATH.QUERY_CPS_FAILURE_PAY_RESULT_RECORDS;
            break; 
          case 4:
            path = BTPATH.QUERY_CPS_UNCHECK_PAY_RESULT_RECORDS;
            break;
        }

         http.post(path/*2*/,$.extend({payResultId: $scope.payId}, $scope.detailListPage))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.detailInfoList = common.cloneArrayDeep(data.data);/*3*/
                if(flag/*1*/){
                  $scope.detailListPage = data.page;/*4*/
                }
              });
            }
        });
          if (flag) {
             $scope.findCountPayResult();
          }

      };

      $scope.findCountPayResult = function() {
        http.post(BTPATH.FIND_CPS_COUNT_PAY_RESULT_RECORD/*2*/,{payResultId:$scope.payId})
          .success(function(data){
             if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.info = data.data;
              });
            }
          });
      };

      $scope.goBack = function(){
        window.history.back();
      };

      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
        $scope.payId = $route.current.pathParams.payId;
       
        $scope.queryDetailList(true);
        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
