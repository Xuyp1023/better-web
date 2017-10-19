
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.monthAdd',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
      $scope.infoList = [];

      $scope.isDisabled=false;

      $scope.basicInfo = {};// 绑定基本信息

      $scope.custList = [];

      var curDate = new Date();

      $scope.yearList = [];
      $scope.monthList = [];

      var curDateYear = curDate.getFullYear();
      for(var i=0;i<10;i++){
        $scope.yearList.push({key:curDateYear--});
      }
      for(var i=1;i<=12;i++){
        if(i<10){
          $scope.monthList.push({key:'0'+i});
        }else{
          $scope.monthList.push({key:''+i});
        }
      }
      $scope.searchData = {
        year:curDate.getFullYear(),
        month:curDate.getMonth()
      };

      if(curDate.getMonth()<10){
        $scope.searchData.month = '0'+curDate.getMonth();
      }else{
        $scope.searchData.month = ''+curDate.getMonth();
      }

      $scope.detailInfo = {};
      $scope.dailyStatementId="";


      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10
      };

      function judgeEmpty(){
        var codes=ArrayPlus($scope.infoList).extractChildArray('refNo',true);
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


        commonService.queryBaseInfoList(BTPATH.FIND_DAILY_STATEMENT_COUNT,{billMonth:$scope.searchData.year+$scope.searchData.month,custNo:$scope.searchData.custNo},$scope,'basicInfo').success(function(){

            http.post(BTPATH.FIND_DAILY_STATEMENT_INFO_BY_MONTH,$.extend({billMonth:$scope.searchData.year+$scope.searchData.month},$scope.searchData))
              .success(function(data){
                //关闭加载状态弹幕
                loading.removeLoading($mainTable);
                if(common.isCurrentData(data)){
                  $scope.$apply(function(){
                    $scope.infoList = common.cloneArrayDeep(data.data);
                    judgeEmpty();
                  });
                }
            });
         });
      };

      $scope.searchCheck = function(status){
        $scope.searchData.businStatus=status;

        http.post(BTPATH.FIND_DAILY_STATEMENT_INFO_BY_MONTH,$.extend({billMonth:$scope.searchData.year+$scope.searchData.month},$scope.searchData))
              .success(function(data){
                if(common.isCurrentData(data)){
                  $scope.$apply(function(){
                    $scope.infoList = common.cloneArrayDeep(data.data);
                    judgeEmpty();
                  });
                }
            });


      }

      $scope.lookDayDetail = function(target,item){
        $scope.dailyStatementId=item.id;
         
         http.post(BTPATH.QUERY_QH_CHECK_DAY_Detail,{"dailyStatementId":item.id})
          .success(function(data){

              $scope.$apply(function(){

                $scope.detailInfo = data.data;

              });
              $scope.openRollModal('dayDetail_box');
              $scope.queryDetailList(true);
        });
      }
      $scope.detailListPage = {
        pageNum: 1,
        pageSize: 10
      };
      /*  业务处理绑定区域  */
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
                $scope.detailInfoList = common.cloneArrayDeep(data.data);
                if(flag){
                  $scope.detailListPage = data.page;
                }
              });
            }
        });
      };

      // 确认
      $scope.addMonthlyStatement = function(target){

        // 作废和删除需要确认
        http.post(BTPATH.SAVE_MONTHLY_STATEMENT,$.extend({},$scope.detailInfo))
              .success(function(data){
                if((data && data.code === 200)){
                    tipbar.infoTopTipbar('账单新建成功!',{}); 
                    window.location.href = '#/1qh-mobile/check.monthManager';
                }else{
                  tipbar.errorTopTipbar($(target),'新增失败，服务端返回信息:'+data.message,3000,99999);
                }
        });


      }

      //返回
      $scope.goBack = function(){
        window.location.href = '#/1qh-mobile/check.monthManager';
      }

      //下一步
      $scope.nextStep = function(target,item) {

        var $target = $(target);

        if(!$scope.searchData.endInterestDate){
          tipbar.errorTopTipbar($target,'请先设置结息日期！',3000,9992);
          return;
        }

        dialog.confirm('是否确认结息日期?',function(){

          http.post(BTPATH.FIND_DAILY_STATEMENT_BASIC_INFO,$.extend({billMonth:$scope.searchData.year+$scope.searchData.month},$scope.searchData))
              .success(function(data){
                
                if((data && data.code === 200)){
                    $scope.$apply(function(){
                      $scope.detailInfo = data.data;
                      $scope.detailInfoList = common.cloneArrayDeep($scope.detailInfo.dailyList);
                    });
                    $scope.openRollModal('confirm_box');
                }else{
                  tipbar.errorTopTipbar($(target),'异常，服务端返回信息:'+data.message,3000,99999);
                }
          });
          
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
