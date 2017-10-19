
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('lead.ensure',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */
      $scope.statusList = BTDict.deliveryRecordCoreCustStatus.toArray('value','name');
      $scope.infoList = [];
      $scope.detailInfo = {};
      $scope.detailInfoList = [];
      $scope.info = {};     
      $scope.searchData = {
        GTEpostDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
        LTEpostDate:new Date().format('YYYY-MM-DD'),
        businStatus:'',
        isPostCust:true
      };
      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      }; 
      // 查看详情
       $scope.LookdetailInfo=function(data){
         $scope.info=data;
        $scope.openRollModal('accountDetail');
      }

       //查询月账单详情
      $scope.lookDetail = function(target,monthlyId){
         
         
         http.post(BTPATH.FIND_MONTHLY_STATEMENT_ID,{"monthlyId":monthlyId})
          .success(function(data){
              $scope.$apply(function(){
                $scope.detailInfo = data.data;
                $scope.detailInfoList = common.cloneArrayDeep($scope.detailInfo.dailyList);/*3*/
                $scope.openRollModal('detail_monthly_box');
              });
        });
      }


      $scope.lookDayDetail = function(target,item){
         $scope.dailyStatementId=item.dailyStatementId;
         http.post(BTPATH.QUERY_QH_CHECK_DAY_Detail,{"dailyStatementId":item.dailyStatementId})
          .success(function(data){

              $scope.$apply(function(){

                $scope.dayDetailInfo = data.data;

              });
              $scope.openRollModal('dayDetail_box');
              $scope.queryDetailList(true);
        });
      }
      $scope.detailListPage = {
        pageNum: 1,
        pageSize: 10
      };
      /*  业务处理绑定区域   */
      $scope.queryDetailList = function(flag){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.detailListPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_QH_CHECK_DAY_Detail_List,$.extend({},{"dailyStatementId":$scope.dailyStatementId},$scope.detailListPage))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.dayDetailInfoList = common.cloneArrayDeep(data.data);
                if(flag){
                  $scope.detailListPage = data.page;
                }
              });
            }
        });
      };


      // 确认(打开确认模态框)
       $scope.ensure=function(data){
        // 区分是从确认打开还是编号打开(state)
        $scope.info=$.extend({},data,{state:'1'});  
        $scope.openRollModal('accountDetail');
      }        
      // 确认(提示确认信息)
      $scope.ensureInfo=function(target,refNo){

        var $target=$(target);
        http.post(BTPATH.SAVE_CONFIRM_DELIVERY_RECORD_INFO/*2*/,{refNo:refNo})
          .success(function(data){
 
            if(common.isCurrentData(data)){
                $scope.closeRollModal('accountDetail');
                tipbar.infoTopTipbar('对账单确认成功!',{});
                $scope.queryList(true);
            }else{
               tipbar.errorTopTipbar($target,'对账单确认失败:'+data.message,3000,9992);
            }
        });

        
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
        http.post(BTPATH.QUERY_DELIVERY_RECORD_LIST/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList').success(function(){
          $scope.searchData.postCustNo = $scope.factorList.length>0?$scope.factorList[0].value:''; 
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

