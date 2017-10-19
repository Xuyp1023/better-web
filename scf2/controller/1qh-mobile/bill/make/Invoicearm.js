

define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.Invoicearm',['$scope','http','$rootScope','$route','cache','commonService','$routeParams',function($scope,http,$rootScope,$route,cache,commonService,$routeParams){
      /*  VM绑定区域  */

      $scope.goback = function(){
       window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/1qh-mobile/Invoiceaffirm';
    }
      $scope.goCheck = function(target){

        var $target=$(target);

         $scope.invoiceInfo.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
        if(!$scope.invoiceInfo.fileList || $scope.invoiceInfo.fileList==''){
          tipbar.errorTopTipbar($target,'请上传附件,发票登记必须要有附件信息',3000,9992);
          return ;
        }

       //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        
        http.post(BTPATH.SAVE_COMMISSION_INVOICE_SAVEAUDITINVOICE/*2*/,$.extend({},$scope.invoiceInfo))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){

              window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/1qh-mobile/Invoiceaffirm';
            }else{

              tipbar.errorTopTipbar($target,'保存基本信息失败,服务器返回:'+data.message,3000,9992);
            }
        }); 
      }


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


     //删除附件项
      $scope.delUploadItem = function(item,listName){
        $scope[listName] = ArrayPlus($scope[listName]).delChild('id',item.id);
      };


  $scope.invoiceInfo = {};
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
