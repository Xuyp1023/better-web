
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('assetmanage.Invoice.recycle',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
      // $scope.items = [];
      $scope.statusList = BTDict.orderVersionBusinStatus.toArray('value','name');
      $scope.receiver = BTDict.CoreStatus.toArray('value','name');
      // $scope.infoList = [{billNo:1111111111111}];
      $scope.infoList=[];      
      $scope.info = {};
      // $scope.infoAdd={};
      $scope.searchData = {
          GTEinvoiceDate:'',
          LTEinvoiceDate:''
      };  


      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };  

      //发票详情
      $scope.detailInfo = function(data){

          //$scope.info=data;
          $scope.uploadList=[];
           // 查询附件列表
          commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
          // 区分作废还是详情isCancel
          //$scope.info=$.extend({},data,{isCancel:2});
          $scope.info=data;
          $scope.info.isCancel=2;
          $scope.info.isCheck=2;
          $scope.openRollModal('details_box');
        });

      }

      // 作废
      $scope.infoBox=function(data){

        $scope.uploadList=[];
                 // 查询附件列表
          commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
          // 区分作废还是详情isCancel
          $scope.info=$.extend({},data,{isCancel:1});
          $scope.info.isCheck=2;
          $scope.openRollModal('details_box');
        });

      }

      // 子页面作废按钮的处理
      $scope.doCancel = function(target,data){
        var $target = $(target);        
        http.post(BTPATH.SAVE_RECYCLE_INVOICE_CUST,{refNo:data.refNo,version:data.version})
           .success(function(data){
            if(data&&(data.code === 200)){
              tipbar.infoTopTipbar('作废成功!',{});
              $scope.queryList(true);
              $scope.closeRollModal("details_box");
            }else{
              tipbar.errorTopTipbar($target,'作废发票失败,服务器返回:'+data.message,3000,9992);
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
        http.post(BTPATH.QUERY_RECYCLE_INVOICE_CORE/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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
        
        // 查询购买方和销售方列表
       
          commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'receiver').success(function(){
                
                $scope.searchData.custNo = common.filterArrayFirst($scope.receiver);
                
                commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.custNo},$scope,'coreCustList','CoreCustListDic').success(function(){
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
