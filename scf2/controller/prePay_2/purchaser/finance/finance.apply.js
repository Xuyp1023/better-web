
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){
    
    var flowService = require('../../../flow/supplierFinance/service/supplierFinanceService.js');
    flowService.servPlus(mainApp,common);

    mainApp.controller('finance.apply',['$scope','http','$rootScope','$route','cache','commonService','$location','flowService',function($scope,http,$rootScope,$route,cache,commonService,$location,flowService){
      /*  VM绑定区域  */
      // $scope.statusList = BTDict.ProductConfigStatus.toArray('value','name');
      $scope.statusList = BTDict.ReceivbaleRequestModeFourStatus.toArray('value','name');
      $scope.infoList = [];
      // $scope.infoList = [{requestNo:'12345678'}];
      $scope.info = {};
      $scope.searchData = {
        GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
        LTEregDate:new Date().format('YYYY-MM-DD'),
        isCust:true       
      };

    

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
          window.location.href = '../scf2/home.html#/prePay_1/submit.apply';
        
      } 

      //查看详情
      $scope.lookDetail = function(data) {

          $scope.info = {};
          $scope.info = data;
          http.post(BTPATH.QUERY_Asset_DETAIL_BYASSETID_CUST,{assetId:$scope.info.assetId}).success(function(data){
                    $scope.$apply(function(){
                      $scope.assetInfo=data.data;
                      //$scope.assetInfo.factorNo=$scope.info.factorNo;
                      //$scope.info.totalBalance=$scope.assetInfo.balance;
                    })
                    
                    
                }); 

          //授信余额
            http.post(BTPATH.QUERY_COMP_QUOTA,{custNo:$scope.info.custNo}).success(function(data){
                
                $scope.$apply(function(){
                     $scope.info.creditBalance= data.data.creditBalance;
                    })
                
            });

          $scope.openRollModal('lookDetail');
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
        http.post(BTPATH.QUERY_RECEIVABLE_REQUEST_FOUR,$.extend({},$scope.listPage,$scope.searchData))
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
           $scope.searchData.custNo = $scope.financeCustList[0].value || '';

           //融资银行列表
           commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:$scope.searchData.custNo},$scope,'factorList'); 

           
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
