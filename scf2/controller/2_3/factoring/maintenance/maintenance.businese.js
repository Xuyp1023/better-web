
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('maintenance.businese',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
     
      //分页数据
      $scope.infoList = [];

      /*  业务处理绑定区域  */
      $scope.queryList = function(){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        http.post(BTPATH.QUERY_BUSINESS_TYPE_LIST/*2*/,{})
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.infoList = common.cloneArrayDeep(data.data);/*3*/
              });
            }
        });
      };
    
      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){      
        $scope.queryList();
        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });
      });
    }]);
  };
});
