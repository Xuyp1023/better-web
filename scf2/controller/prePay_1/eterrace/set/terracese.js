
define(function (require, exports, module) {

  exports.installController = function (mainApp, common, validate, tipbar, loading, comdirect, dialog) {

    mainApp.controller('set.terracese', ['$scope', 'http', '$rootScope', '$route', 'cache', 'commonService', '$location', '$filter', function ($scope, http, $rootScope, $route, cache, commonService, $location, $filter) {

      // 供应商报价列表
      $scope.infoList = [];

       // 初始化查条件对象
       $scope.searchData = {}; 
       
       $scope.info = {};

      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };

     // 添加
      $scope.addInfoBox = function(){
        $scope.info = {};
        
        
        $scope.info.custNo=common.filterArrayFirst($scope.factorList);
        $scope.info.coreCustNo=$scope.searchData.coreCustNo;
       
          $scope.openRollModal('add_box');
      }

    // 更新
    $scope.update = function(data){
        $scope.info = {};
          $scope.info = data;
        $scope.openRollModal('update');
    }

    //确认添加
      $scope.doConfirm=function(target,dataInfo){          
          var $target=$(target);          
          http.post(BTPATH.SAVE_SUPPLIER_OFFER_SAVEADDOFFER/*2*/,dataInfo)
            .success(function(data){   
              if(common.isCurrentData(data)){
                  $scope.closeRollModal('add_box');
                  tipbar.infoTopTipbar('添加成功!',{});
                  $scope.queryList(true);
              }else{
                 tipbar.errorTopTipbar($target,'添加失败:'+data.message,3000,9993);
              }
          });
      }

 //确认更新
      $scope.doUpdate=function(target,datainfo){          
          var $target=$(target);          
          http.post(BTPATH.SAVE_SUPPLIER_OFFER_SAVEUPDATEOFFER/*2*/,datainfo)
            .success(function(data){   
              if(common.isCurrentData(data)){
                  $scope.closeRollModal('update');
                  tipbar.infoTopTipbar('更新成功!',{});
                  $scope.queryList(true);
              }else{
                 tipbar.errorTopTipbar($target,'更新失败:'+data.message,3000,9993);
              }
          });
      }



      //查询产品列表 
      $scope.searchList = function () {
        $scope.listPage.pageNum = 1;
        $scope.queryList(true);
      };

       /*查询初始化*/
       $scope.queryList = function(flag){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        // loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_SUPPLIER_OFFER_QUERYOFFERLIST,$.extend({},$scope.listPage,$scope.searchData))
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
      $scope.$on('$routeChangeSuccess', function () {

        commonService.queryBaseInfoList(BTPATH.QUERY_ALLCUST_RELATION,{},$scope,'factorList').success(function(){
          // $scope.searchData.custNo = $scope.factorList.length>0?$scope.factorList[0].value:''; 
          commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList').success(function(){

          $scope.searchData.coreCustNo = $scope.coreCustList.length>0?$scope.coreCustList[0].value:''; 
            $scope.queryList();
        });
          
        });

        

        /*公共绑定*/
        $scope.$on('ngRepeatFinished', function () {
          common.resizeIframe();
        });
      });
    }]);
  };
});

