  
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('assetmanage.Purchase.orders',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */


      //分页数据
    $scope.listPage = {
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 1
    };
     $scope.uploadList = [];
     $scope.lodst = true;
    //开启上传
      $scope.openUpload = function(event,type,typeName,list){
      $scope.uploadConf = {
        //上传触发元素
        event:event.target||event.srcElement,
        //上传附件类型
        type:type,
        //类型名称
        typeName:typeName,
        //存放上传文件
        uploadList:$scope[list]
      };
    };
      $scope.infoList = [{}];
      $scope.statusList = BTDict.effectiveVersionUsingBusinStatusForSearch.toArray('value','name');
      $scope.receiver = BTDict.CoreStatus.toArray('value','name');

      $scope.info = {};
      $scope.searchData = {
        GTEorderDate :new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
        LTEorderDate:new Date().format('YYYY-MM-DD'),
        isCust:'true',
        businStatus:''
      };
  
      //订单详情
      $scope.detailsBox = function(data){

        $scope.uploadList=[];
        $scope.info=data;
        $scope.info.userRoleCust="1";
        commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
          
          $scope.openRollModal('details_box');
        
        });

      }
       $scope.quitbox = function(){

        window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/assetmanage/Purchase.orders';
      }

           //查询订单列表 
      $scope.searchList = function(){
          $scope.listPage.pageNum = 1;
          
          $scope.queryList(true);
      };


         /*查询订单列表*/
      $scope.queryList = function(flag){

        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_EFFECTIVE_ORDER_CORE/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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

        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'receiver').success(function(){
                
                $scope.searchData.supplierNo = common.filterArrayFirst($scope.receiver);
                
                commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.supplierNo},$scope,'coreCustList','CoreCustListDic').success(function(){
                   $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
                   $scope.searchData.coreCustNo = $scope.searchData.coreCustNo.length>0?$scope.searchData.coreCustNo[0].value:'';
                   $scope.queryList(true);

                });
            });
        
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
