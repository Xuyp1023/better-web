
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.dayAdd',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
      $scope.infoList = [];

      $scope.isDisabled=false;

      $scope.basicInfo = {};// 绑定基本信息

      $scope.custList = [];
      $scope.statusList = BTDict.factoringPublishStatus.toArray('value','name');
      $scope.searchData = {
        payDate:new Date().format('YYYY-MM-DD')
      };


      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10
      };

      function judgeEmpty(){
        var codes=ArrayPlus($scope.infoList).extractChildArray('recordRefNo',true);
        if(codes.length==0){
          $scope.isDisabled=true;
        }else{
          $scope.isDisabled=false;
        }
      }
      /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        

         commonService.queryBaseInfoList(BTPATH.FIND_PAY_RESULT_COUNT,$scope.searchData,$scope,'basicInfo').success(function(){

            http.post(BTPATH.QUERY_PAY_RESULT_RECORD/*2*/,$.extend({},$scope.searchData, $scope.listPage))
              .success(function(data){
                //关闭加载状态弹幕
                loading.removeLoading($mainTable);
                if(common.isCurrentData(data)){
                  $scope.$apply(function(){
                    $scope.infoList = common.cloneArrayDeep(data.data);
                    judgeEmpty();
                    if(flag/*1*/){
                      $scope.listPage = data.page;/*4*/
                    }
                  });
                }
            });
         });
      };

      $scope.detailListPage = {
        pageNum: 1,
        pageSize: 10
      };

      /*  业务处理绑定区域  */
      $scope.queryDetailList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.detailListPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_PAY_RESULT_RECORD/*2*/,$.extend({},$scope.searchData,$scope.detailListPage))
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
      };

      // 查看佣金
      $scope.lookCommissionDetail = function(target,item){
        http.post(BTPATH.FIND_CPS_COMMISSION_RECORD, {refNo: item.recordRefNo})
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

      // 提交申请
      $scope.addDailyStatement = function(target,detailInfo){


        http.post(BTPATH.ADD_DAILY_STATEMENT,{"dailyRefNo":detailInfo.refNo,"payDate":detailInfo.payDate,"custNo":detailInfo.ownCustNo})
              .success(function(data){
                if((data && data.code === 200)){
                    tipbar.infoTopTipbar('账单新建成功!',{}); 
                   window.location.href = '#/1qh-mobile/check.dayManager';
                }else{
                  tipbar.errorTopTipbar($(target),'新增失败，服务端返回信息:'+data.message,3000,99999);
                }
        });


      }

      //返回
      $scope.goBack = function(){
        window.location.href = '#/1qh-mobile/check.dayManager';
      }

      //下一步
      $scope.nextStep = function(target,item) {
        $scope.searchData.payStatus="1";
        http.post(BTPATH.FIND_PAY_RESULT_INFO/*2*/,$.extend({},$scope.searchData))
              .success(function(data){
                if((data && data.code === 200)){
                    $scope.$apply(function(){
                      $scope.detailInfo = data.data;
                    });
                    $scope.queryDetailList(true);
                    $scope.openRollModal('confirm_box');
                }else{
                  tipbar.errorTopTipbar($(target),'异常，服务端返回信息:'+data.message,3000,99999);
                }
        });
      }


      $scope.searchCheck = function(status){
        $scope.searchData.payStatus=status;
        var flag=true;
        $scope.listPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_PAY_RESULT_RECORD,$.extend({},$scope.searchData,$scope.listPage))
          .success(function(data){          
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.infoList = common.cloneArrayDeep(data.data); 
                judgeEmpty();               
                if(flag){
                  $scope.listPage = data.page;
                }
              });
            }
        });


      }


      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){

        commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{custType:2},$scope,'custList').success(function(){
          $scope.searchData.custNo = $scope.custList[0] ? $scope.custList[0].value : '';
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
