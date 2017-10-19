
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.Askbill',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */

    $scope.goback = function(){
       window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/1qh-mobile/applya';
    }
    $scope.goadd = function(target){

      var $target=$(target);

       http.post(BTPATH.FIND_COMMISSION_INVOICE_SAVEiNVOICE_EFFECTIVE/*2*/,$.extend({},$scope.invoiceInfo))
          .success(function(data){
            
            if(common.isCurrentData(data)){
               
                window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/1qh-mobile/Invoiceapply';
          
            }else{
                tipbar.errorTopTipbar($target,'保存基本信息失败,服务器返回:'+data.message,3000,9992);
            }
        });
        
      
    }

      $scope.invoiceInfo = {};

      $scope.findInvoice = function(id){
        

        http.post(BTPATH.FIND_COMMISSION_INVOICE_FINDINVOICE_ID/*2*/,{invoiceId:id})
          .success(function(data){
            
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.invoiceInfo = data.data;/*3*/
                
              });
            }
        });
        
       
      };




      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
          var id=cache.get("invoiceId").id;
          $scope.searchData = cache.get("searchData");
         $scope.findInvoice(id);
          common.resizeIframe();
        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
