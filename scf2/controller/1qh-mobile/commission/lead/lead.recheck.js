
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('lead.recheck',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */
      $scope.statusList = BTDict.commissionFileConfirmStatus.toArray('value','name');

      $scope.statusListOper = BTDict.commissionFileConfirmOperatorStatus.toArray('value','name');
      $scope.infoList = [];     
      $scope.searchData = {
        GTEimportDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
        LTEimportDate:new Date().format('YYYY-MM-DD'),
        businStatus:''
      };

      $scope.dataList = [];

      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      }; 

      //佣金数据列表分页数据
      $scope.listDataPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };      

      // 审核(模态框)       
       $scope.checkDetail=function(flag,dataInfo){
         $scope.info=$.extend({},dataInfo,{onlyRead:'0'});
         // 获取数据列表
         $scope.listPage.flag = flag? 1 : 2;/*1*/
         $scope.info.confirmStatus=$scope.statusListOper[1].value;
         http.post(BTPATH.QUERY_COMMISSION_FILE_DOWN_LIST_FILE_ID_OPER,$.extend({fileId:dataInfo.id},$scope.listPage))
          .success(function(data){
              $scope.$apply(function(){                
                $scope.dataList = common.cloneArrayDeep(data.data);/*3*/
                if(flag/*1*/){
                  $scope.listDataPage = data.page;/*4*/
                }
                $scope.openRollModal('recheckDetail');
              });
        });  
             
      }

      // 审核操作
      $scope.checkDetailBox = function(target){  

      var $target = $(target);      
      http.post(BTPATH.SAVE_AUDIT_FILE_DOWN_ID_OPER,{id:$scope.info.id,confirmStatus:$scope.info.confirmStatus,confirmMessage:$scope.info.confirmMessage})
         .success(function(data){
          if(data&&(data.code === 200)){
            tipbar.infoTopTipbar('审核成功!',{});
            $scope.queryList(true);
            $scope.closeRollModal("recheckDetail");
          }else{
            tipbar.errorTopTipbar($target,'审核失败,服务器返回:'+data.message,3000,9992);
          }
         });
    };

      // 查看
      $scope.lookDetail=function(flag,dataInfo){

         $scope.info=dataInfo;
         // 获取数据列表
         $scope.listPage.flag = flag? 1 : 2;/*1*/
         http.post(BTPATH.QUERY_COMMISSION_FILE_DOWN_LIST_FILE_ID_OPER,$.extend({fileId:dataInfo.id},$scope.listPage))
          .success(function(data){
              $scope.$apply(function(){                
                $scope.dataList = common.cloneArrayDeep(data.data);/*3*/
                if(flag/*1*/){
                  $scope.listDataPage = data.page;/*4*/
                }
                $scope.openRollModal('recheckDetail');
              });
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
        http.post(BTPATH.QUERY_COMMISSION_FILE_DOWN_CANAUDIT_LIST/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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

      /*查询产品列表*/
      $scope.queryDataList = function(flag,fileId){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listDataPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_COMMISSION_FILE_DOWN_LIST_FILE_ID_OPER/*2*/,$.extend({fileId:fileId},$scope.listDataPage))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.dataList = common.cloneArrayDeep(data.data);/*3*/
                if(flag/*1*/){
                  $scope.listDataPage = data.page;/*4*/
                }
              });
            }
        });
      };           

      /*!入口*/ /*控制器执行入口*///BTPATH.FIND_CUST_BY_PLATFORM,{custType:2},$scope,'factorList'
      $scope.$on('$routeChangeSuccess',function(){
        commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{custType:2},$scope,'factorList').success(function(){
          // $scope.searchData.custNo = $scope.factorList.length>0?$scope.factorList[0].value:''; 
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

