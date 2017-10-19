
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.mainState',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
      $scope.infoList = [];

      $scope.coreCustList = [];

      $scope.info = {
        // payDate:new Date().format('YYYY-MM-DD')
      };

      $scope.countInfo = {
        amount:0,
        balance:0.0
      };

      $scope.searchData = {
        importDate:new Date().format('YYYY-MM-DD'),
        custNo:""
      };

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
        http.post(BTPATH.QUERY_CPS_UNCHECK_COMMISSION_RECORD/*2*/,$.extend({},$scope.searchData, $scope.listPage))
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

        if (flag) {
          $scope.findCount();
        }
      };

      $scope.findCount = function() {
         http.post(BTPATH.FIND_CPS_COUNT_COMMISSION_RECORD/*2*/,$.extend({},$scope.searchData))
          .success(function(data){
            //关闭加载状态弹幕
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                 $scope.countInfo = data.data;
              });
            }
        });
      };


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

      // 监听付款日期值的变化
      $scope.$watch('info.payDate', function(newValue, oldValue) {
        // console.log(newValue);
      });

      //返回
      $scope.goBack = function(){
        window.location.href = '#/1qh-mobile/check.maintenance';
      }

      //下一步
      $scope.nextStep = function(target) {

        var $target = $(target);

        if(!$scope.info.payDate){
          tipbar.errorTopTipbar($target,'请先设置付款日期！',3000,9992);
          return;
        }

        dialog.confirm('是否确认付款日期?',function(){

          // 创建 日对账结果
          http.post(BTPATH.SAVE_CPS_CREATE_PAY_RESULT/*2*/,$.extend({},$scope.searchData, $scope.info))
            .success(function(data){
              //关闭加载状态弹幕
              if(common.isCurrentData(data)){
                $scope.$apply(function(){
                 window.location.href = '#/1qh-mobile/check.mainStateDetail/' + data.data.id;
                });
              } else {
                tipbar.errorTopTipbar($target,'创建日对账单失败,服务器返回:'+data.message,3000,9992);
              }
          });
          
        });
      }


      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
         commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{custType:2},$scope,'coreCustList').success(function(){
          $scope.searchData.custNo = $scope.coreCustList[0] ? $scope.coreCustList[0].value : '';
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
