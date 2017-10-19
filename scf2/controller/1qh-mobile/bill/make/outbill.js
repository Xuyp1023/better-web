
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.outbill',['$scope','http','$rootScope','$route','cache','commonService','$routeParams',function($scope,http,$rootScope,$route,cache,commonService,$routeParams){
      /*  VM绑定区域  */

    $scope.goback = function(){
       window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/1qh-mobile/Invoiceapply';
    }

    //发票作废
    $scope.goout = function(target,id){

      var $target=$(target);

       //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        
        http.post(BTPATH.SAVE_COMMISSION_INVOICE_SAVEANNULINVOICE/*2*/,{invoiceId:id})
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              

              window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/1qh-mobile/Invoiceapply';
            }else{

              tipbar.errorTopTipbar($target,'保存基本信息失败,服务器返回:'+data.message,3000,9992);
            }
        });

    }



    $scope.findInvoice = function(){
        

        http.post(BTPATH.FIND_COMMISSION_INVOICE_FINDINVOICE_ID/*2*/,{invoiceId:$routeParams.id})
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
        $scope.findInvoice();
          common.resizeIframe();
        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
