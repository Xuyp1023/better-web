
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.dayManager',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
      $scope.infoList = [];

      $scope.custList = [];
      $scope.dailyStatementId ="";

      $scope.searchData = {
        GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
        LTEregDate:new Date().format('YYYY-MM-DD')
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
        http.post(BTPATH.QUERY_QH_CHECK_DAY_List/*2*/,$.extend({},$scope.searchData, $scope.listPage))
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
        $scope.dailyStatementId=item.id;
         $scope.openRollModal('detail_box');
         http.post(BTPATH.QUERY_QH_CHECK_DAY_Detail,{"dailyStatementId":item.id})
          .success(function(data){

              $scope.$apply(function(){

                $scope.detailInfo = data.data;

              });
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

        http.post(BTPATH.UPDATE_DAILY_STATEMENT,{"dailyStatementId":$scope.dailyStatementId,"businStatus":"2"})
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

        http.post(BTPATH.UPDATE_DAILY_STATEMENT,{"dailyStatementId":$scope.dailyStatementId,"businStatus":"9"})
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

          http.post(BTPATH.DEL_DAILY_STATEMENT,{"dailyStatementId":$scope.dailyStatementId})
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
        window.location.href = '#/1qh-mobile/check.dayAdd';
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

        $scope.openRollModal('audit_box');

        http.post(BTPATH.QUERY_QH_CHECK_DAY_Detail/*2*/,{"dailyStatementId":item.id})
          .success(function(data){
              $scope.$apply(function(){
                $scope.detailInfo = data.data;
                $scope.dailyStatementId=item.id;
              });
              $scope.queryDetailList(true);
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
