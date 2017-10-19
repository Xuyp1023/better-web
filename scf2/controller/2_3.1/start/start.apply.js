
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    var flowService = require('../../flow/supplierFinance/service/supplierFinanceService.js');
    flowService.servPlus(mainApp,common);

    mainApp.controller('start.apply',['$scope','http','$rootScope','$route','cache','commonService','$location','flowService',function($scope,http,$rootScope,$route,cache,commonService,$location,flowService){
      /*  VM绑定区域  */
      $scope.statusList = BTDict.ProductConfigStatus.toArray('value','name');
      $scope.infoList = [];
      // $scope.infoList = [{requestNo:'12345678'}];
      $scope.info = {};
      $scope.searchData = {
        GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
        LTEregDate:new Date().format('YYYY-MM-DD')        
      };

      //资产详情
      $scope.assetInfo = {};
      $scope.assetInfo.basedataMap = {} ;
      $scope.assetInfo.basedataMap.agreementList=$scope.assetInfo.basedataMap.agreementList||[];
      $scope.assetInfo.basedataMap.orderList=$scope.assetInfo.basedataMap.orderList||[];
      $scope.assetInfo.basedataMap.invoiceList=$scope.assetInfo.basedataMap.invoiceList||[];
      $scope.assetInfo.basedataMap.receivableList=$scope.assetInfo.basedataMap.receivableList||[];
      $scope.assetInfo.basedataMap.acceptBillList=$scope.assetInfo.basedataMap.acceptBillList||[];
      // 对账单列表
      $scope.recheckList=[];
      // 商品出库单列表
      $scope.outboundList=[];
      // 其他附件列表
      $scope.otherList=[];

      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      }; 

      $scope.temp={};

      // 新增申请
      $scope.addInfoBox=function(){
        window.location.href='?rn'+new Date().getTime()+'../scf2/home.html#/2_3.1/start.process';
        // $location.path('/2_3.1/start.process');
        // common.resizeIframe();
      }

      // 继续申请
      $scope.continueApply=function(data){
          // 保存此对象的信息，供打开的页面使用
          cache.put('basicInfo',$.extend({},data,{'edit':true}));
          window.location.href='?rn'+new Date().getTime()+'../scf2/home.html#/2_3.1/start.process';
          // $location.path('/2_3.1/start.process');
      }

      // 作废(打开模态框)
      $scope.cancel=function(data){
          $scope.info=data;
          param={productCode:data.productCode};  
           http.post(BTPATH.FIND_CUSTMECH_BANK_ACCOUNT,{bankAcco:data.suppBankAccount}).success(function(accountData){
                if(common.isCurrentData(accountData)){
                    $scope.$apply(function(){
                        $scope.bankAccount=accountData.data;
                        $scope.info.bankAccoName=$scope.bankAccount.bankAccoName;
                        $scope.info.bankName=$scope.bankAccount.bankName; 
                    });
                  }
          })

          $scope.temp.step='2';
          // 查询保理产品的融资标的配置
          commonService.queryBaseInfoList(BTPATH.FIND_ASSETDICT_BYPRODUCT,{productCode:$scope.info.productCode},$scope,'lists').success(function(data){
              if($scope.lists.length<=0){                
                $scope.tempObj={};
                return;
              }
              // 调用服务中的方法
              flowService.getAllList($scope);

            });
          $scope.queryAllList();

          $scope.openRollModal('cancelDetail');
      }
      // 查询融资标的列表
      $scope.queryAllList=function(){      
            
         http.post(BTPATH.QUERY_Asset_DETAIL_BYASSETID_CUST,{assetId:$scope.info.orders}).success(function(data){
                    $scope.$apply(function(){
                      $scope.assetInfo=data.data;
                      $scope.assetInfo.factorNo=$scope.info.factorNo;
                      $scope.info.totalBalance=$scope.assetInfo.balance;
                    })
                    
                    // 根据基本信息里的保理产品编号查询资产清单
                    // 对账单查询和下载全部
                   commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.assetInfo.statementBatchNo},$scope,'recheckList');                   
                   $scope.downRecheckListUrl = BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + ArrayPlus($scope.recheckList).extractChildArray("id",true) + "&fileName=对账单资料包";
                   // 商品出库单查询和下载全部
                   commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.assetInfo.goodsBatchNo},$scope,'outboundList');                  
                   $scope.downOutboundListUrl = BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + ArrayPlus($scope.outboundList).extractChildArray("id",true) + "&fileName=出库单资料包";
                   // 其它附件查询和下载全部
                   commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.assetInfo.othersBatchNo},$scope,'otherList');                    
                   $scope.downOtherListUrl = BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + ArrayPlus($scope.otherList).extractChildArray("id",true) + "&fileName=其他附件资料包";
                }); 
           
      }
    

      //子页面作废按钮处理
      $scope.doCancel=function(target){          
          var $target=$(target);
          $scope.info.businStatus="3";//作废
          http.post(BTPATH.SAVE_Annul_REQUEST_TEMP_CUST/*2*/,$scope.info)
            .success(function(data){   
              if(common.isCurrentData(data)){
                  $scope.closeRollModal('cancelDetail');
                  tipbar.infoTopTipbar('废弃成功!',{});
                  $scope.queryList(true);
              }else{
                 tipbar.errorTopTipbar($target,'废弃失败:'+data.message,3000,9993);
              }
          });
      }

       //查询申请列表 
      $scope.searchList = function(){
        $scope.listPage.pageNum = 1;
        $scope.queryList(true);    
      };
      
      /*查询初始化*/
      $scope.queryList = function(flag){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        // loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_REQUEST_TEMPLIST,$.extend({},$scope.listPage,$scope.searchData))
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
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'financeCustList').success(function(){
           $scope.searchData.custNo = $scope.financeCustList.length>0?$scope.financeCustList[0].value:'';

           //保理商列表
           commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:$scope.searchData.custNo},$scope,'factorList'); 

           //申请列表 
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
