
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.Invoicedetails',['$scope','http','$rootScope','$route','cache','commonService','$routeParams',function($scope,http,$rootScope,$route,cache,commonService,$routeParams){
      /*  VM绑定区域  */

      
      $scope.invoiceInfoDetailShowFlag=false;

      $scope.goback = function(){
        if($scope.parsmod == 1){
            window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/1qh-mobile/Invoiceaffirm';
        }else if($scope.parsmod == 2){
            window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/1qh-mobile/Invoiceapply';
        }
       
       }

      $scope.findInvoice = function(){
        

        http.post(BTPATH.FIND_COMMISSION_INVOICE_FINDINVOICE_ID/*2*/,{invoiceId:$routeParams.invoiceId})
          .success(function(data){
            
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.invoiceInfo = data.data;/*3*/

                if($scope.invoiceInfo.invoiceCode !=null && $scope.invoiceInfo.invoiceCode !='' && $scope.invoiceInfo.invoiceCode !=undefined){

                    $scope.invoiceInfoDetailShowFlag = true;
                     // 查询附件列表
                        commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.invoiceInfo.batchNo},$scope,'uploadList').success(function(){
                      
                      });

                }
                
              });
            }
        });
        
       
      };

     



      $scope.uploadList = [];
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



      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
         

        $scope.parsmod = $routeParams.id;

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
