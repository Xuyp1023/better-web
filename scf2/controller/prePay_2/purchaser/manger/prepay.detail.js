
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('prepay.detail2',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */


      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };     
      
      $scope.statusList = BTDict.effectiveVersionUsingBusinStatusForSearch.toArray('value','name');
      $scope.receiver = BTDict.CoreStatus.toArray('value','name');
      $scope.infoList = [];     
      
     //当月第一天获取 
      var firstDay = new Date();
      firstDay.setDate(1);
      // 初始化查条件对象
      $scope.searchData = {
          GTEregDate:firstDay.format('YYYY-MM-DD'),
          LTEregDate:new Date().format('YYYY-MM-DD')
      }; 
        

        $scope.lookDetail = function(data) {
          window.location.href='../byte/home1.html#/scf/prepay/apply2?id='+data.requestNo+'&src=detail.html';
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
            http.post(BTPATH.QUERY_RECEIVABLE_REQUEST_queryTwoFinishReceivableRequestWithCore,$.extend({},$scope.listPage,$scope.searchData))
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

          commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList','CoreCustListDic').success(function(){
          //$scope.searchData.custNo = $scope.custList.length>0?$scope.custList[0].value:'';
            $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.searchData.coreCustNo},$scope,'receiver').success(function(){
                /*$scope.searchData.custNo = common.filterArrayFirst($scope.receiver);
                $scope.searchData.custNo = $scope.searchData.custNo>0?$scope.searchData.custNo[0].value:'';*/
                $scope.queryList(true);
          });
        });

        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
