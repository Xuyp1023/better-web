
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('seller.contractInfo',['$scope','http','$rootScope','$route','cache','upload','$location',function($scope,http,$rootScope,$route,cache,upload,$location){
     
      /*  VM绑定区域  */
      upload.regUpload($scope);

      // 合同基本信息
      $scope.info = {
        supplierNo:null,
    signDate : new Date().format('YYYY-MM-DD'),
    agreeStartDate : new Date().format('YYYY-MM-DD'),
    agreeEndDate : new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),
    deliveryDate : new Date().format('YYYY-MM-DD'),
    fileList:null,
        // 买方信息
        buyerInfo : {
        },
        // 卖方信息
      supplierInfo : {
        }
      };
      // 核心企业列表
      $scope.coreList = [];

      //合同附件列表
      $scope.uploadList = [];

      //合同状态
      $scope.businStatus = '';
      //审核记录信息
      $scope.contractRecodeInfo = {

      };


      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){

        $scope.info.id=$route.current.pathParams.contractId;
        $scope.findContractLedgerCustFileItems($scope.info.id);
        // 查询审核记录
        $scope.findContractLedgerRecode($scope.info.id);

        $scope.findContractLedgerInfo().success(function(){
          $scope.findBuyerCustInfo();
          $scope.findSupplierCustInfo();
          common.resizeIframeListener();
        });

        
        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframeListener();
        });

      });

      // 查询合同信息
      $scope.findContractLedgerInfo = function(){
        return $.post(BTPATH.FIND_CONTRACT_LEDGERINFO,{contractId:$scope.info.id},function(data){
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.info = data.data;
            });
          }
        },'json');
      };

      // 查询买方的客户信息
      $scope.findBuyerCustInfo = function(){
        $.post(BTPATH.FIND_CONTRACT_LEDGER_CONTRACTID,{custNo:$scope.info.buyerNo,contractId:$scope.info.id},function(data){
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.info.buyerInfo = data.data;
            });
          }
        },'json');
      };
      

      // 查询卖方的客户信息
      $scope.findSupplierCustInfo = function(){
        $.post(BTPATH.FIND_CONTRACT_LEDGER_CONTRACTID,{custNo:$scope.info.supplierNo,contractId:$scope.info.id},function(data){
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.info.supplierInfo = data.data;
            });
          }
        },'json');
      };

      // 查询合同附件列表
      $scope.findContractLedgerCustFileItems = function(contractId){
        $.post(BTPATH.FIND_CONTRACT_LEDGER_CUSTFILEITEMS,{contractId:contractId},function(data){
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.uploadList = data.data;
            });
          }
        },'json');
      };

      // 查询审核记录信息
      $scope.findContractLedgerRecode = function(contractId){
        $.post(BTPATH.FIND_CONTRACT_LEDGER_RECODE,{contractId:contractId},function(data){
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.contractRecodeInfo = data.data;
            });
          }
        },'json');
      };
      
      //返回
      $scope.goBack = function(){
        $location.url("/sellerContract/query");
      };


    }]);

  };

});
