
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('order.detail',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */

      $scope.businStatus = BTDict.effectiveVersionUsingBusinStatusForSearch.toArray('value','name');
      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 30,
        pages: 1,
        total: 1
      };    
     
      $scope.infoList = [];
      
      // 初始化查条件对象
      $scope.searchData = {         
      };   
        
        
       $scope.goBack = function(){
          history.go(-1);
       } 
       // 查看历史
      $scope.lookHisttory = function(){
          // 获取历史下载列表             
           http.post(BTPATH.QUERY_COMMISSION_FILE_DOWN_LIST_FILE_ID_OPER,{})
            .success(function(data){
                $scope.$apply(function(){                
                  $scope.historyList = data.data;/*3*/                               
                  $scope.openRollModal('history_box');
                });
          });
      }
       //点击查询
       $scope.searchList = function(){
            $scope.listPage.pageNum = 1;
            $scope.queryList(true);
          };

        //刷新列表
        $scope.queryList = function(flag){
            //弹出弹幕加载状态
            var $mainTable = $('#search_info .main-list');
            loading.addLoading($mainTable,common.getRootPath());
            $scope.listPage.flag = flag? 1 : 2;
            $scope.searchData.isAudit = true;
            http.post(BTPATH.QUERY_FINISHED_APPLY,$.extend({},$scope.listPage,$scope.searchData))
              .success(function(data){
                //关闭加载状态弹幕
                loading.removeLoading($mainTable);
                if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
                  $scope.$apply(function(){
                    $scope.infoList = common.cloneArrayDeep(data.data);                    
                    if(flag){
                      $scope.listPage = data.page;
                    }
                  });
                }   
            });
          };

    

      
      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
        $scope.data= cache.get('cacheData');
        // 为初始查询条件赋值
        $scope.searchData.importDate = new Date().format('YYYY-MM-DD');
        $scope.searchData.businStatus = 1;
        $scope.queryList(true);  
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
