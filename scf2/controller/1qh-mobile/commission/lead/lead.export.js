
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('lead.export',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */
    
      $scope.infoList = [];     
      $scope.searchData = {
        GTEimportDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
        LTEimportDate:new Date().format('YYYY-MM-DD')
        
      };
      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };      

      //查询产品列表 
      $scope.searchList = function(){
          $scope.listPage.pageNum = 1;
          $scope.queryList(true);
      };
      
      /*查询产品列表*/
      $scope.queryList = function(flag){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_COMMISSION_FILE_DOWN_LIST/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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

      /*!入口*/ /*控制器执行入口*///BTPATH.FIND_CUST_BY_PLATFORM,{custType:2},$scope,'factorList'
      $scope.$on('$routeChangeSuccess',function(){
        commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{custType:2},$scope,'factorList').success(function(){
          // $scope.searchData.custNo = $scope.factorList.length>0?$scope.factorList[0].value:''; 
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

