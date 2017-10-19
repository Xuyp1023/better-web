
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.mail',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
      $scope.infoList = [];

      $scope.custList = [];
      $scope.detailInfo = {};
      $scope.detailInfoList = [];
      $scope.statusList = BTDict.deliveryRecordStatus.toArray('value','name');
      $scope.searchData = {
        GTEpostDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
        LTEpostDate:new Date().format('YYYY-MM-DD'),
        postCustNo:'',
        isPostCust:false
      };


      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10
      };

      /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_DELIVERY_RECORD_LIST/*2*/,$.extend({},$scope.searchData, $scope.listPage))
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

      //投递账单
      $scope.addInfo = function(target,refNo,description){

        var $target = $(target);
        http.post(BTPATH.SAVE_EXPRESS_DELIVERY_RECORD,{refNo:refNo,description:description}).success(function(data){
          if(data&&(data.code === 200)){
            tipbar.infoTopTipbar('投递成功!',{});
            $scope.$apply(function(){
              $scope.closeRollModal('mailCheck_box');
              $scope.queryList(true);
            });
            //window.location.href = '#/1qh-mobile/check.mail';
          }else{
            tipbar.errorTopTipbar($target,'对账单提交失败:'+data.message,3000,9992);
          }
        });
      };

      // 跳到确认界面
      $scope.goConfirmRecord = function(item){
        $scope.deliveryRecordInfo = item;
        $scope.openRollModal('mailCheck_box');
      };

      // 查看投递对账单详情
      $scope.lookRecordDetail = function(data){
        $scope.info=data;
        $scope.openRollModal('detail_box');
      };

      //查询月账单详情
      $scope.lookDetail = function(target,monthlyId){
        
         $scope.openRollModal('detail_monthly_box');
         http.post(BTPATH.FIND_MONTHLY_STATEMENT_ID,{"monthlyId":monthlyId})
          .success(function(data){
              $scope.$apply(function(){
                $scope.detailInfo = data.data;
                $scope.detailInfoList = common.cloneArrayDeep($scope.detailInfo.dailyList);/*3*/
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

      // 移除月账单
      $scope.removeBill = function(target,item) {
        var $target = $(target);
        //前端判断是否是最后一条月账单

        //移除单条记录
         http.post(BTPATH.SAVE_DELIVERY_RECORD_REMOVE_MONTHLY_STATEMENT/*2*/,{statementId:item.id})
          .success(function(data){
            //关闭加载状态弹幕
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.deliveryRecordInfo = data.data;/*3*/
                $scope.openRollModal('mailCheck_box');
              });
            }else{

              tipbar.errorTopTipbar($target,data.message,3000,9992);
            }
        });

      }

      // 删除对账单信息
      $scope.deleteRecord = function(target,item){

        var $target=$(target);
        http.post(BTPATH.SAVE_DELETE_DELIVERY_RECORD,{recordId:item.id}).success(function(data){
          if(data&&(data.code === 200)){
            tipbar.infoTopTipbar('删除对账单信息成功!',{});
            $scope.$apply(function(){
              $scope.queryList(true);
            });
            //window.location.href = '#/1qh-mobile/check.mail';
          }else{
            tipbar.errorTopTipbar($target,'删除对账单信息失败:'+data.message,3000,9992);
          }
        });

      };


      //投递账单
      $scope.add = function(target,item) {
        window.location.href = '#/1qh-mobile/check.mailSelect';
      }


      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){

         commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{custType:2},$scope,'coreCustList').success(function(){
          // $scope.searchData.postCustNo = $scope.coreCustList[0] ? $scope.coreCustList[0].value : '';
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
