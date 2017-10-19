
define(function (require, exports, module) {
    
      exports.installController = function (mainApp, common, validate, tipbar, loading, comdirect, dialog) {
    
        mainApp.controller('set.arapment', ['$scope', 'http', '$rootScope', '$route', 'cache', 'commonService', '$location', '$filter', function ($scope, http, $rootScope, $route, cache, commonService, $location, $filter) {
    
          // 供应商报价列表
          $scope.infoList = [{},{}];

          var dddd = new Date();
          dddd.setDate(1);
    
           // 初始化查条件对象
           $scope.searchData = {
            GTEregDate:dddd.getSubDate('MM',0).format('YYYY-MM-DD'),
            LTEregDate:new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),
           }; 
           
           $scope.info = {};
    
          //分页数据
          $scope.listPage = {
            pageNum: 1,
            pageSize: 10,
            pages: 1,
            total: 1
          };

          //提前申请付款
          $scope.addInfo = function(){

            window.location.href='../byte/home1.html#/scf/prepay/apply?id=21412412&src=1.html';

          }

          //继续申请
          $scope.apply_adpay = function(datainfo){


             window.location.href='../byte/home1.html#/scf/prepay/apply?id='+datainfo.requestNo+'&src=2.html';
          

            
          };
          //作废
          $scope.delete_adpay = function (target,data){

            dialog.confirm('是否确认删除该申请,该操作无法恢复!',function(){
              var $target = $(target);
              http.post(BTPATH.SAVE_RECEIVABLE_REQUEST_SAVEANNULRECEIVABLEREQUEST,{requestNo:data.requestNo})
                 .success(function(data){
                  if(data&&(data.code === 201)){
                    $scope.queryList(true);
                    tipbar.infoTopTipbar('删除申请成功!',{});
                  }else{
                    tipbar.errorLeftTipbar($target,'删除申请失败,服务器返回:'+data.message,3000,9992);
                  }
                 });
            });
          }
          //详情
          $scope.detail_adpay = function(target,data){
            window.location.href='../byte/home1.html#/scf/prepay/apply?id='+data.requestNo+'&src=detail.html';
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
            http.post(BTPATH.QUERY_RECEIVABLE_REQUEST_QUERYRECEIVABLEREQUESTWITHSUPPLIER,$.extend({},$scope.listPage,$scope.searchData))
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
    
           

            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'receiver').success(function(){
                
                $scope.searchData.custNo = common.filterArrayFirst($scope.receiver);
                
                commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.custNo},$scope,'factorList','factorList').success(function(){
                   $scope.searchData.coreCustNo = common.filterArrayFirst($scope.factorList);
                    
                     $scope.searchData.coreCustNo = $scope.searchData.coreCustNo.length>0?$scope.searchData.coreCustNo[0].value:'';
                   $scope.queryList(true);

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
    
    