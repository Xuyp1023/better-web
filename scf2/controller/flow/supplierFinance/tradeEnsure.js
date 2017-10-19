
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    var flowService = require('./service/supplierFinanceService.js');
      flowService.servPlus(mainApp,common);

    mainApp.controller('tradeEnsure',['$scope','http','$rootScope','$route','cache','commonService','$location','flowService',function($scope,http,$rootScope,$route,cache,commonService,$location,flowService){
      /*  VM绑定区域  */
      

      // $scope.periodUnits = BTDict.PeriodUnit.toArray('value','name');   //期限单位       
      $scope.info = {};

      //当前任务
      var currentTask = cache.get("currentTask");
      //当前业务信息
      $scope.businessInfo = {
        'requestNo':currentTask.workFlowBusiness.businessId,
        'nodeName':currentTask.workFlowNode.nickname
      };

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

      $scope.temp={};
      //中登查询结果对象
      $scope.assReg={};

      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      }; 

      $scope.temp={step:2};

            /*
      * 提供数据至外部
      * @param operType|操作类型    
      */
      $scope.$GET_RESULT = function(target,operType){
        //当审批通过时，才校验
       /* if(operType==='handle'){*/
          //设置校验项|校验
         /* validate.validate($('#approve_handle_issue'),validOption);
          var valid = validate.validate($('#approve_handle_issue'));
          if(!valid) return;
        }*/
        //出具贷款方案
        return $.extend({},$scope.info,{
          requestNo:$scope.businessInfo.requestNo
        });
      };

      $scope.queryAllList=function(requestNo){
          // 根据基本信息里的保理产品编号查询资产清单
           http.post(BTPATH.QUERY_Asset_DETAIL_BYASSETID_CUST,{assetId:$scope.info.orders}).success(function(data){
                    $scope.$apply(function(){
                      $scope.assetInfo=data.data;
                      $scope.assetInfo.factorNo=$scope.info.factorNo;
                      $scope.info.totalBalance=$scope.assetInfo.balance;
                    })
                    
                    // 根据基本信息里的保理产品编号查询资产清单
                    // 对账单查询和下载全部
                   commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.assetInfo.statementBatchNo},$scope,'recheckList');                   
                   $scope.downRecheckListUrl = BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + ArrayPlus($scope.recheckList).extractChildArray("id",true) + "&fileName=保理业务资料包";
                   // 商品出库单查询和下载全部
                   commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.assetInfo.goodsBatchNo},$scope,'outboundList');                  
                   $scope.downOutboundListUrl = BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + ArrayPlus($scope.outboundList).extractChildArray("id",true) + "&fileName=保理业务资料包";
                   // 其它附件查询和下载全部
                   commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.assetInfo.othersBatchNo},$scope,'otherList');                    
                   $scope.downOtherListUrl = BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + ArrayPlus($scope.otherList).extractChildArray("id",true) + "&fileName=保理业务资料包";
                }); 
      }
      
      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
         $scope.temp.bSelect=true;
          //业务id号 
          var requestNo = $scope.businessInfo.requestNo;
          //查询融资详情
          flowService.queryInfo($scope,requestNo).success(function(data){
              commonService.queryBaseInfoList(BTPATH.FIND_ASSETDICT_BYPRODUCT,{productCode:$scope.info.productCode},$scope,'lists').success(function(data){
              
              flowService.getAllList($scope);
              // 查询资产列表
              $scope.queryAllList(requestNo);
            })
              
          });               

        setTimeout(function(){
          common.resizeIframeListener();
        },100)
        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });
      });
    }]);
  };
});
