
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.Invoicelooked',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */


      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10
      };
      $scope.infoList = [{},{}];
      $scope.custINfo = {};

      //打开新增
      $scope.addInfoBox = function (){

        $scope.custINfo = {};
        $scope.custINfo.coreInfoType = "1";
        $scope.custINfo.custNo = $scope.searchData.custNo;
        $scope.custINfo.coreCustNo = $scope.coreCustList[0].value;
        $scope.openRollModal('add_box');
      }
      //打开编辑
      $scope.editInfoBox = function(item){

        $scope.custINfo = {};
        $scope.custINfo=item;
        $scope.showBox($scope.custINfo);
        $scope.openRollModal('edit_box');
      }

      $scope.showBox = function(item){

        if(item){
          if(item.coreInfoType==1){
          $scope.radiotype = true;
          $scope.rediotype = false;
        }else{
          $scope.radiotype = false;
          $scope.rediotype = true;
        }
        }

      }
      //打开删除
      $scope.deletInfoBox = function(item){

        $scope.custINfo = {};
        $scope.custINfo=item;
        $scope.showBox($scope.custINfo);
        $scope.openRollModal('delet_box');
      }
      //打开详情
      $scope.detailsBox = function(item){

        $scope.custINfo = {};
        $scope.custINfo=item;
        $scope.showBox($scope.custINfo);
        $scope.openRollModal('detail_box');
      }

      //提交新增账单
      $scope.addinfoList = function(target){

         var $target = $(target);

         //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        
        http.post(BTPATH.SAVE_COMMISSION_CUSTINFO_SAVEADDINVOICECUSTINFO/*2*/,$.extend({},$scope.custINfo))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              tipbar.infoTopTipbar('发票抬头新增成功!',{});
              $scope.custINfo = {};
               $scope.closeRollModal('add_box');
              $scope.queryList(true);
            }else{
               tipbar.errorTopTipbar($target,'发票抬头新增失败,服务器返回:'+data.message,3000,9992);
            }
        });

       
      }
      //提交编辑账单
      $scope.editinfoList = function(target){

         var $target = $(target);

         //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        
        http.post(BTPATH.SAVE_COMMISSION_CUSTINFO_SAVEUPDATEINVOICECUSTINFO/*2*/,$.extend({},$scope.custINfo))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              tipbar.infoTopTipbar('发票抬头修改成功!',{});
              $scope.custINfo = {};
               $scope.closeRollModal('edit_box');
              $scope.queryList(true);
            }else{
               tipbar.errorTopTipbar($target,'发票抬头修改失败,服务器返回:'+data.message,3000,9992);
            }
        });
       
      }
      //删除账单  
      $scope.deletinfoList = function(target,id){

        var $target = $(target);

         //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        
        http.post(BTPATH.SAVE_COMMISSION_CUSTINFO_SAVEDELETECUSTINFOBYID/*2*/,{id:id})
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              tipbar.infoTopTipbar('发票抬头删除成功!',{});
              $scope.custINfo = {};
              $scope.closeRollModal('delet_box');
              $scope.queryList(true);
            }else{
               tipbar.errorTopTipbar($target,'发票抬头删除失败,服务器返回:'+data.message,3000,9992);
            }
        });
        
      }
      $scope.goback = function (){
        window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/1qh-mobile/Invoicelooked';
      }

      $scope.radiotype = true;
      $scope.rediotype = false;

      $scope.radioclick = function(){
        //var ioop = $("input[name='genren']:checked").val();
        
        if($scope.custINfo.coreInfoType == 0){
          $scope.radiotype = false;
          $scope.rediotype = true;
        }else{
          $scope.radiotype = true;
          $scope.rediotype = false;
        }
      }
      

      $scope.factorList = [];
       $scope.searchData = {};

       /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_COMMISSION_CUSTINFO_QUERYINVOICECUSTLIST/*2*/,$.extend({},$scope.searchData, $scope.listPage))
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

          commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList').success(function(){

            $scope.searchData.custNo = $scope.factorList.length>0?$scope.factorList[0].value:''; 
            commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{custType:2},$scope,'coreCustList').success(function(){
              $scope.queryList(true);
            });
            

        });

           

          common.resizeIframe();
        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
