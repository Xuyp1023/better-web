
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.Invoiceaffirm',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */

    //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10
      };
      $scope.infoList = [{},{}];
      $scope.searchData = {
      GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
      LTEregDate:new Date().format('YYYY-MM-DD'),
      isConfirm:true
    };

    $scope.statusList = BTDict.commissionInvoiceBusinStatusWithoutAnnul.toArray('value','name');
    $scope.factorList = [];


    $scope.addinfo = function(id){
      cache.put("searchData",$scope.searchData);
      window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/1qh-mobile/Invoicecorrect/'+id;
    }

    $scope.addinfoConfirm = function(id){
      cache.put("searchData",$scope.searchData);
      window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/1qh-mobile/Invoicearm/'+id;
    }
    
    $scope.LookdetailInfo = function(invoiceid){
      cache.put("searchData",$scope.searchData);
      window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/1qh-mobile/Invoicedetails/1/'+invoiceid;
    }

    


      /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_COMMISSION_INVOICE_INVOICELIST/*2*/,$.extend({},$scope.searchData, $scope.listPage))
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

      
       //点击查询
       $scope.searchList = function(){
            $scope.listPage.pageNum = 1;
            $scope.queryList(true);
          };


      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){

        if(cache.get("searchData")){
            $scope.searchData=cache.get("searchData");
            cache.remove("searchData");
          }

         commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList').success(function(){

            $scope.searchData.custNo = $scope.factorList.length>0?$scope.factorList[0].value:''; 
            
                commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{custType:2},$scope,'coreCustList').success(function(){
                  // $scope.searchData.coreCustNo = $scope.searchData.coreCustNo?$scope.searchData.coreCustNo:$scope.coreCustList[0] ? $scope.coreCustList[0].value : '';
                     $scope.searchData.coreCustNo = $scope.searchData.coreCustNo?$scope.searchData.coreCustNo:''; 
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
