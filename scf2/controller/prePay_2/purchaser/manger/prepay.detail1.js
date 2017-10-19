
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('prepay.detail1',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
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
          window.location.href='../byte/home1.html#/scf/prepay/apply2?id='+data.requestNo+'&src=eDetail.html';
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
            http.post(BTPATH.QUERY_RECEIVABLE_REQUEST_queryTwoFinishReceivableRequestWithFactory,$.extend({},$scope.listPage,$scope.searchData))
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

          commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList','factorListDic').success(function(){
              $scope.searchData.factoryNo =  common.filterArrayFirst($scope.factorList);
                //根据保理公司查询核心企业列表
                commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACOTRCORERELATION,{factorNo:$scope.searchData.factoryNo},$scope,'coreCustList').success(function(){
                  $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
                //根据核心企业查询融资企业列表
                commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.searchData.coreCustNo},$scope,'custList').success(function(){
                  // $scope.searchData.custNo = $scope.custList[0] ? $scope.custList[0].value : '' ;
                  //获取融资状态
                  /*commonService.queryBaseInfoList(BTPATH.QUERY_TRADESTATUS,'',$scope,'','FlowTypeDic',{
                    name:'nodeCustomName',
                    value:'sysNodeId'
                  }).success(function(){*/
                  $scope.queryList(true);
                  // });
                });
              });
            });

        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
