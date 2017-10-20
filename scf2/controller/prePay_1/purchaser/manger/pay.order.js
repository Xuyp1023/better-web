
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('pay.order',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */


      //分页数据..
      $scope.listPage = {
        pageNum: 1,
        pageSize: 100,
        pages: 1,
        total: 1
      };

      // 列表
      $scope.infoList = [];
      
      // 初始化查条件对象
      $scope.searchData = {
          GTErequestPayDate:common.getFirstDay().format('YYYY-MM-DD'),
          LTErequestPayDate:common.getLastDay().format('YYYY-MM-DD')
      };   
        
        // 详情..
        $scope.lookDetail = function(data) {
          cache.put('cacheData',data);
          window.location.href='?rn'+new Date().getTime()+'../scf2/home.html#/prePay_1/order.detail';
        }

        // 下载
        $scope.downloadIt = function(data, flagValue){
            
             // 获取数据列表             
             http.post(BTPATH.SAVE_PAYFILE_SAVEADDFILE,{requestPayDate:data, flag:flagValue})
              .success(function(data){
                  $scope.$apply(function(){                
                    
                    $scope.info = data.data;
                    if(flagValue == '0'){
                      $scope.openRollModal('download_box');
                    }else{

                      window.location.href=BTPATH.DOWNLOAD_BACK_INFO+"?id="+$scope.info.fileItemId;
                      $scope.closeRollModal('download_box');
                      $scope.queryList(true);
                    }

                    
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
            http.post(BTPATH.QUERY_PAYPOOL_QUERYPAYPOOLLIST,$.extend({},$scope.listPage,$scope.searchData))
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

      // 查看历史
      $scope.lookHisttory = function(){
          // 获取历史下载列表             
           http.post(BTPATH.QUERY_PAYFILE_QUERYFILELIST,{infoType : '0', requestPayDate : $scope.info.requestPayDate, businStatus : ''})
            .success(function(data){
                $scope.$apply(function(){                
                  $scope.historyList = data.data;/*3*/                               
                  $scope.openRollModal('history_box');
                });
          });
      }

      
      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
        $scope.queryList(true);  
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
