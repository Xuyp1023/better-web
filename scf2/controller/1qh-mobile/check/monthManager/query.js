
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.monthManager',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
      $scope.infoList = [];

      $scope.custList = [];
      $scope.statusList = BTDict.CommissionBusinStatus.toArray('value','name');
      $scope.monthlyId="";

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
        month:curDate.getMonth(),
        businStatus:""
      };

      if(curDate.getMonth()<10){
        $scope.searchData.month = '0'+curDate.getMonth();
      }else{
        $scope.searchData.month = ''+curDate.getMonth();
      }
      
      $scope.dailyStatementId="";

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
        http.post(BTPATH.QUERY_MONTHLY_STATEMENT/*2*/,$.extend({billMonth:$scope.searchData.year+$scope.searchData.month},$scope.searchData, $scope.listPage))
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

      $scope.lookDetail = function(target,item){
         $scope.monthlyId=item.id;
         http.post(BTPATH.FIND_MONTHLY_STATEMENT_ID,{"monthlyId":item.id})
          .success(function(data){
              $scope.$apply(function(){
                $scope.detailInfo = data.data;
                $scope.detailInfoList = common.cloneArrayDeep($scope.detailInfo.dailyList);/*3*/
              });
              $scope.openRollModal('detail_box');
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

      // 确认
      $scope.confirmCheck = function(target){

        switch ($scope.auditInfo.type){
          case 1:
            $scope.audit(target);
            // 审核请求
            $scope.closeRollModal("audit_box");
            break;
          case 2:
            dialog.confirm('确认要删除吗?',function(){
                $scope.del(target);
                $scope.closeRollModal("audit_box");
            });
            // 删除请求
            break;
          case 3:
            dialog.confirm('确认要作废吗?',function(){
                $scope.cancle(target);
                $scope.closeRollModal("audit_box");
            });
            // 作废请求
            break;
        }
        
      }


      $scope.audit = function(target){

        http.post(BTPATH.UPDATE_MONTHLY_STATEMENT_ID,{"monthlyId":$scope.monthlyId,"businStatus":"2"})
              .success(function(data){
                if((data && data.code === 200)){
                    tipbar.infoTopTipbar('审核成功!账单已生效',{}); 
                    $scope.queryList(true);
                }else{
                  tipbar.errorTopTipbar($(target),'审核失败，服务端返回信息:'+data.message,3000,99999);
                }
        });

      }


      $scope.cancle = function(target){

        http.post(BTPATH.UPDATE_MONTHLY_STATEMENT_ID,{"monthlyId":$scope.monthlyId,"businStatus":"9"})
              .success(function(data){
                if((data && data.code === 200)){
                    tipbar.infoTopTipbar('账单作废成功!',{}); 
                    $scope.queryList(true);
                }else{
                  tipbar.errorTopTipbar($(target),'账单作废失败，服务端返回信息:'+data.message,3000,99999);
                }
        });

      }


      $scope.del = function(target){

          http.post(BTPATH.DEL_MONTHLY_STATEMENT,{"monthlyId":$scope.monthlyId})
              .success(function(data){
                if((data && data.code === 200)){
                    tipbar.infoTopTipbar('删除账单成功!',{}); 
                    $scope.queryList(true);
                }else{
                  tipbar.errorTopTipbar($(target),'删除账单失败，服务端返回信息:'+data.message,3000,99999);
                }
         });

      }


      //启用新类型
      $scope.add = function(){
        window.location.href = '#/1qh-mobile/check.monthAdd';
      }

       //审核
      $scope.operate = function(target,item,type) {

        switch (type){
          case 1:
            $scope.auditInfo = {title:'审核',type:1};
            break;
          case 2:
            $scope.auditInfo = {title:'删除',type:2};
            break;
          case 3:
            $scope.auditInfo = {title:'作废',type:3};
            break;
        }
         $scope.monthlyId=item.id;
        $scope.openRollModal('audit_box');

        http.post(BTPATH.FIND_MONTHLY_STATEMENT_ID/*2*/,{"monthlyId":item.id})
          .success(function(data){
              $scope.$apply(function(){
                $scope.detailInfo = data.data;
                $scope.detailInfoList = common.cloneArrayDeep($scope.detailInfo.dailyList);/*3*/
              });
        });
        
      }

      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){


        commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{custType:2},$scope,'custList').success(function(){
          // $scope.searchData.custNo = $scope.custList[0] ? $scope.custList[0].value : '';
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
