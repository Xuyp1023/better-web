
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.maintenancebill',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */

      $scope.editInfo = {
        coreInfoType:'1',
        isLatest:'1'
      };
      $scope.factorList = [];

      
      
        $scope.saveInfo = function(target){
           
            var $target = $(target);
            // $scope.editInfo.confirmFlag='false';
             // $scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
              http.post(BTPATH.SAVE_COMMISSION_CUSTINFO_ADD_INVOICE_CUSTINFO,$scope.editInfo)
                 .success(function(data){
                  if(data&&(data.code === 200)){
                    tipbar.infoTopTipbar('发票开票方信息维护保存成功!',{});
                    $scope.add = false;
                    $scope.findCustInfo();
                  }else{
                    tipbar.errorTopTipbar($target,'应付账款新增失败,服务器返回:'+data.message,3000,9992);
                  }
                 });
        }
        $scope.editchange = function(){
          $scope.edit = false;
          $scope.editc = false;
          $scope.editt = true;
        }
       

          $scope.editinvoice = function(target){
                  
            var $target = $(target);
            // $scope.editInfo.confirmFlag='false';
             // $scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
              http.post(BTPATH.UPDATE_COMMISSION_CUSTINFO_SAVE_UPDATE_INVOICE_CUSTINFO,$scope.editInfo)
                 .success(function(data){
                  if(data&&(data.code === 200)){
                    tipbar.infoTopTipbar('发票开票方信息修改成功!',{});
                    $scope.editt = false;
                    $scope.findCustInfo();
                  }else{
                    tipbar.errorTopTipbar($target,'应付账款修改失败,服务器返回:'+data.message,3000,9992);
                  }
                 });
        }

       /**
       查询当前企业的发票抬头
       */
         $scope.findCustInfo = function(){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        
        http.post(BTPATH.FIND_COMMISSION_CUSTINFO_EFFECTIVE_BY_CUSTNO/*2*/,$.extend({},$scope.editInfo))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.editInfo = data.data;/*3*/
                $scope.edit = true;
              });
            }else{
              $scope.$apply(function(){
                $scope.add = true;
                });
            }
        });
      };


      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
        

         commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList').success(function(){

          $scope.editInfo.custNo = $scope.factorList.length>0?$scope.factorList[0].value:''; 
          $scope.editInfo.coreCustNo = $scope.factorList.length>0?$scope.factorList[0].value:''; 
          
          if($scope.editInfo.custNo !=null && $scope.editInfo.custNo !='' && $scope.editInfo.coreCustNo !=null && $scope.editInfo.coreCustNo !=''){

            $scope.findCustInfo(true);
          }
          
        });

        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
