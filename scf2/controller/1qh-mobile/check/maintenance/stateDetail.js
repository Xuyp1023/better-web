
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.mainStateDetail',['$scope','http','$rootScope','$route','cache','commonService','$filter',function($scope,http,$rootScope,$route,cache,commonService,$filter){
      /*  VM绑定区域  */
      $scope.infoList = [];

      $scope.coreCustList = [];

      $scope.info = {
      };

      $scope.currentInfo = {
      };

      $scope.payResultId = 0;

      $scope.listPage = {
        pageNum: 1,
        pageSize: 10
      };

      $scope.unconfirmInfoList = [];

      $scope.unconfirmSearchData = {
        payTargetBankAccountName:"",
        payTargetBankAccount:""
      };

      $scope.unconfirmListPage = {
        pageNum: 1,
        pageSize: 10
      };

      $scope.searchType = 1;

      /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;

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
        }
        http.post(path/*2*/,$.extend({payResultId: $scope.payResultId}, $scope.listPage))
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
             $scope.findCountPayResult();
          }
      };

      $scope.queryUnconfirmList = function(flag) {
        $scope.unconfirmListPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_CPS_UNCHECK_PAY_RESULT_RECORDS/*2*/,$.extend({}, {payResultId: $scope.payResultId}, $scope.unconfirmSearchData, $scope.unconfirmListPage))
          .success(function(data){
            //关闭加载状态弹幕
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.unconfirmInfoList = common.cloneArrayDeep(data.data);/*3*/
                setTimeout(function(){
                  $scope.isCountEqual();
                },1)                
                if(flag/*1*/){
                  $scope.unconfirmListPage = data.page;/*4*/
                }
              });
            }
          });
          if (flag) {
             $scope.findCountPayResult();
          }
      };

      $scope.findCountPayResult = function() {
        http.post(BTPATH.FIND_CPS_COUNT_PAY_RESULT_RECORD/*2*/,{payResultId:$scope.payResultId})
          .success(function(data){
             if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.info = data.data;
              });
            }
          });
      };

      // 抽象出单个选择的选择比较
      $scope.isCountEqual=function(){
        var count=$("td>input[type='checkbox']:checked").length;
        if(count==$scope.unconfirmInfoList.length){
          $scope.tmpCheckbox=true;
        }else{
          $scope.tmpCheckbox=false;
        }
      }

      // 单选
      $scope.selectOne=function(){
        $scope.isCountEqual();
      }

      //选择按钮，全选和去除全选
      $scope.toggleCheckbox = function(){
        angular.forEach($scope.unconfirmInfoList,function(row){
          row.isSelected = $scope.tmpCheckbox;
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

      // 确认成功或失败
      $scope.confirmSuccess = function(target){
        var $target = $(target);

        var idAttrs = [];

        angular.forEach($scope.unconfirmInfoList,function(row){
          if(row.isSelected){
            idAttrs.push(row.id);
          }
        });
        if(idAttrs.length <1){
          tipbar.errorTopTipbar($target,'请先选择付款记录！',3000,9992);
          return;
        }


        http.post(BTPATH.SAVE_CPS_CONFIRM_SUCCESS_PAY_RESULT_RECORDS,$.extend({}, {payResultId: $scope.payResultId, payResultRecords:idAttrs.toString()}))
           .success(function(data){
              if(data&&(data.code === 200)){
                $scope.$apply(function(){
                  var temp=$filter('moneyFilter')(data.data.balance);
                  tipbar.infoTopTipbar('确认付款成功!\n状态已更新，本次更新共' +data.data.amount+'笔，金额' +temp+'元~',{});
                  $scope.queryUnconfirmList(true);                  
                })                
              }else{
                tipbar.errorTopTipbar($target,'保存失败,服务器返回:'+data.message,3000,9992);
              }
           });
      }

            // 确认失败
      $scope.confirmFailure = function(target){

        var $target = $(target);

        var idAttrs = [];
        angular.forEach($scope.unconfirmInfoList,function(row){
          if(row.isSelected){
            idAttrs.push(row.id);
          }
        });
        if(idAttrs.length <1){
          tipbar.errorTopTipbar($target,'请先选择付款记录！',3000,9992);
          return;
        }
        
        http.post(BTPATH.SAVE_CPS_CONFIRM_FAILURE_PAY_RESULT_RECORDS,$.extend({}, {payResultId: $scope.payResultId, payResultRecords:idAttrs.toString()}))
           .success(function(data){
              if(data&&(data.code === 200)){
                tipbar.infoTopTipbar('确认付款失败!\n状态已更新，本次更新共' +data.data.amount+'笔，金额' +data.data.balance+'元~',{});
                $scope.queryUnconfirmList(true);
              }else{
                tipbar.errorTopTipbar($target,'保存失败,服务器返回:'+data.message,3000,9992);
              }
           });
      }

      // 变更状态
      $scope.changeState = function(target, item){
        var $target = $(target);
        if (item.payResult == '1') {
          http.post(BTPATH.SAVE_CPS_SUCCESS_TO_FAILURE_PAY_RESULT_RECORDS,$.extend({}, {payResultId: $scope.payResultId, payResultRecordId:item.id}))
           .success(function(data){
              if(data&&(data.code === 200)){
                tipbar.infoTopTipbar('确认付款成功!\n状态已更新，本次更新共1笔，金额' +data.data.payBalance+ '元~',{});
                $scope.queryList(true);
              }else{
                tipbar.errorTopTipbar($target,'保存失败,服务器返回:'+data.message,3000,9992);
              }
           });
        } else if (item.payResult == '2') {
          http.post(BTPATH.SAVE_CPS_FAILURE_TO_SUCCESS_PAY_RESULT_RECORDS,$.extend({}, {payResultId: $scope.payResultId, payResultRecordId:item.id}))
           .success(function(data){
              if(data&&(data.code === 200)){
                tipbar.infoTopTipbar('确认付款失败!\n状态已更新，本次更新共1笔，金额' +data.data.payBalance+ '元~',{});
                $scope.queryList(true);
              }else{
                tipbar.errorTopTipbar($target,'保存失败,服务器返回:'+data.message,3000,9992);
              }
           });
        }
      }

      // 结果确认
      $scope.confirmState = function(target){

        var $target = $(target);

        http.post(BTPATH.SAVE_CPS_CONFIRM_PAY_RESULT,$.extend({}, {payResultId: $scope.payResultId}))
           .success(function(data){
              if(data&&(data.code === 200)){
                tipbar.infoTopTipbar('付款状态维护成功!',{});
                window.location.href = '#/1qh-mobile/check.maintenance';
              }else{
                tipbar.errorTopTipbar($target,'保存失败,服务器返回:'+data.message,3000,9992);
              }
           });
      }

      // 确认
      $scope.searchCheck = function(type){
        var lastType = $scope.searchType;
        $scope.searchType = type;
        switch (type){
          case 1:
          case 2:
          case 3:
            $scope.queryList(true);
            changeModal();
            break;
          case 4:
            $scope.queryUnconfirmList(true);
            $scope.openRollModal('unconfirm_box');
            
            $("#confirm_box").removeData("prev-box");
            $("#unconfirm_box").data("prev-box","body");
            break;
        }

        function changeModal(){
          if(lastType == 4){
            $scope.openRollModal('confirm_box');
            $("#unconfirm_box").removeData("prev-box");
            $("#confirm_box").data("prev-box","body");
          }
        }
            
      };
        

      //返回
      $scope.goBack = function(){
        window.location.href = '#/1qh-mobile/check.maintenance';
      }


      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
        $scope.payResultId = $route.current.pathParams.payResultId;
       
        $scope.queryList(true);

        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
