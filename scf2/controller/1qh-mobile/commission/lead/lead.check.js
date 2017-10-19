
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('lead.check',['$scope','http','$rootScope','$route','cache','commonService','$location','$filter',function($scope,http,$rootScope,$route,cache,commonService,$location,$filter){
      /*  VM绑定区域  */
      $scope.statusList = BTDict.factoringPublishStatus.toArray('value','name');
      $scope.infoList = [];     
      $scope.searchData = {
        importDate:new Date().format('YYYY-MM-DD'),
        businStatus:'0',
        payStatus:'0',
        custNo:''
      };
      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };       

      // 审核全部
      $scope.checkAll=function(target){
          var $target = $(target);
          http.post(BTPATH.SAVE_AUDIT_COMMISSION_RECORD_LIST,{importDate:$scope.searchData.importDate,custNo:$scope.searchData.custNo})
           .success(function(data){
              if(data&&(data.code === 200)){
                var code=data.data.code;
                var noAuditFile=data.data.noAuditFile;
                var auditRecord=data.data.auditRecord;
                var auditTotalBalance=$filter('moneyFilter')(data.data.auditTotalBalance);
                if(code==200){
                  var message='审核已生效，本次审核共'+auditRecord+'笔，金额'+auditTotalBalance+'元';
                  tipbar.infoTopTipbar(message,{});
                  $scope.queryList(true);   

                }else{
                  var message="检测到未解析文件（"+noAuditFile+"个），请解析所有文件后再审核";
                  tipbar.errorTopTipbar($target,message,3000,9992);
                }
                            
              }else{
                tipbar.errorTopTipbar($target,'审核失败,服务器返回:'+data.message,3000,9992);
              }
           });
      }

       // 查看佣金详情
      $scope.detailInfo=function(item){
        http.post(BTPATH.FIND_CPS_COMMISSION_RECORD/*2*/, {refNo: item.refNo})
          .success(function(data){
            //关闭加载状态弹幕
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.commissionRecord = data.data;
                $scope.openRollModal('detailInfo');
              });
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
        http.post(BTPATH.QUERY_COMMISSION_RECORD_AUDIT_LIST/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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
          $scope.searchData.custNo = $scope.factorList.length>0?$scope.factorList[0].value:''; 
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

