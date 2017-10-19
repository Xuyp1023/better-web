
define(function (require, exports, module) {
    
      exports.installController = function (mainApp, common, validate, tipbar, loading, comdirect, dialog) {
    
        mainApp.controller('set.apment', ['$scope', 'http', '$rootScope', '$route', 'cache', 'commonService', '$location', '$filter', function ($scope, http, $rootScope, $route, cache, commonService, $location, $filter) {
    
          // 供应商报价列表
          $scope.infoList = [];
          $scope.statusList = BTDict.billVersionBusinStatus.toArray('value','name');
          var dddd = new Date();
          dddd.setDate(1);
    
           // 初始化查条件对象
           $scope.searchData = {
            GTEregDate:dddd.getSubDate('MM',0).format('YYYY-MM-DD'),
            LTEregDate:new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),

            businStatus:'1',
            isAudit:true,
            isCust:true

           }; 
           
           $scope.info = {};
    
          //分页数据
          $scope.listPage = {
            pageNum: 1,
            pageSize: 10,
            pages: 1,
            total: 1
          };
          //打开详情
          $scope.detailsBox = function (target,data){
                  $scope.loanInfo=data;
                  $scope.openRollModal('detail_box');

          }

          //提前申请付款
          $scope.apply_adpay = function(target,dataInfo){

            var $target=$(target);
            http.post(BTPATH.CHECK_RECEIVABLE_REQUEST_CHECKvERIFYRECEIVABLE,{receivableId:dataInfo.id})

              .success(function(data){
               
                if(common.isCurrentData(data)){
                  window.location.href='../byte/home1.html#/scf/prepay/apply?id='+dataInfo.id+'&src=1.html';
                }else{
                  tipbar.errorLeftTipbar($target,'申请失败,服务器返回:'+data.message,3000,9992);
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

            http.post(BTPATH.QUERY_EFFECTIVE_RECEIVABLE_CORE,$.extend({},$scope.listPage,$scope.searchData))

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
    
            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
                
                $scope.searchData.custNo = common.filterArrayFirst($scope.custList);
                
                commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.custNo},$scope,'coreCustList','CoreCustListDic').success(function(){
                   $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
                    
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
    
    